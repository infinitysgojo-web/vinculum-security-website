import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

const MEDIUM_FEED_URL = 'https://medium.com/feed/@jamesndua'
const SYNC_TTL_MS = 10 * 60 * 1000 // 10 minutes

interface Article {
  id: string
  title: string
  link: string
  pub_date: string
  author: string
  categories: string[]
  cover_image: string | null
  excerpt: string
}

/** Strip HTML tags and collapse whitespace, truncating to ~280 chars. */
function htmlToExcerpt(html: string): string {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/"/g, '"')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > 280 ? text.slice(0, 277).trimEnd() + '...' : text
}

/** Extract the first <img src> from HTML content. */
function firstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match ? match[1] : null
}

/** Extract the text content of the first element matching `tag` within `xml`. */
function extractTag(xml: string, tag: string): string {
  // Match <tag>...</tag> or <tag attr="...">...</tag>, including namespaced tags
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>[\\s\\S]*?</${tag}>`, 'i')
  const m = xml.match(re)
  if (!m) return ''
  return m[0]
    .replace(new RegExp(`</?${tag}(?:\\s[^>]*)?>`, 'gi'), '')
    .trim()
}

/** Extract CDATA or plain text content from a tag's raw inner content. */
function unwrapCdata(raw: string): string {
  const m = raw.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/)
  return m ? m[1] : raw
}

/** Parse the Medium RSS XML into article records using regex. */
function parseFeed(xml: string): Article[] {
  const articles: Article[] = []
  // Split on <item> boundaries
  const itemBlocks = xml.split(/<item\b/).slice(1) // first block is channel metadata

  for (const block of itemBlocks) {
    const itemXml = block.split(/<\/item>/)[0]

    const guidRaw = extractTag(itemXml, 'guid')
    const guid = unwrapCdata(guidRaw)
    const id = guid.replace(/^https?:\/\/medium\.com\/p\//, '') || guid

    const titleRaw = extractTag(itemXml, 'title')
    const title = unwrapCdata(titleRaw)

    // link can be CDATA or plain
    const linkRaw = extractTag(itemXml, 'link')
    const link = unwrapCdata(linkRaw)

    const pubDateRaw = extractTag(itemXml, 'pubDate')
    const pubDate = unwrapCdata(pubDateRaw)

    // dc:creator — extractTag with namespaced tag
    const creatorRaw = extractTag(itemXml, 'dc:creator')
    const author = unwrapCdata(creatorRaw)

    // categories — multiple
    const categoryMatches = [...itemXml.matchAll(/<category\b[^>]*>([\s\S]*?)<\/category>/gi)]
    const categories = categoryMatches
      .map((m) => unwrapCdata(m[1].trim()))
      .filter(Boolean)

    // content:encoded
    const contentRaw = extractTag(itemXml, 'content:encoded')
    const content = unwrapCdata(contentRaw)

    const coverImage = firstImage(content)
    const excerpt = htmlToExcerpt(content)

    if (id && title && link) {
      articles.push({ id, title, link, pub_date: pubDate, author, categories, cover_image: coverImage, excerpt })
    }
  }

  return articles
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check staleness
    const { data: lastRun } = await supabase
      .from('medium_sync_runs')
      .select('run_at, status')
      .eq('status', 'ok')
      .order('run_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const now = Date.now()
    const lastRunTime = lastRun?.run_at ? new Date(lastRun.run_at).getTime() : 0
    const isStale = now - lastRunTime > SYNC_TTL_MS

    if (isStale) {
      const feedRes = await fetch(MEDIUM_FEED_URL, {
        headers: { 'User-Agent': 'VinculumSecurity-Dispatches/1.0' },
      })
      if (feedRes.ok) {
        const xml = await feedRes.text()
        const articles = parseFeed(xml)
        const nowIso = new Date().toISOString()

        // Upsert each article
        for (const a of articles) {
          await supabase
            .from('medium_articles')
            .upsert({
              id: a.id,
              title: a.title,
              link: a.link,
              pub_date: a.pub_date,
              author: a.author,
              categories: a.categories,
              cover_image: a.cover_image,
              excerpt: a.excerpt,
              fetched_at: nowIso,
            }, { onConflict: 'id' })
        }

        await supabase.from('medium_sync_runs').insert({
          status: 'ok',
          article_count: articles.length,
        })
      } else {
        await supabase.from('medium_sync_runs').insert({
          status: `error:${feedRes.status}`,
          article_count: 0,
        })
      }
    }

    // Return cached rows newest-first
    const { data: rows, error } = await supabase
      .from('medium_articles')
      .select('id, title, link, pub_date, author, categories, cover_image, excerpt')
      .order('pub_date', { ascending: false })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ articles: rows ?? [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
