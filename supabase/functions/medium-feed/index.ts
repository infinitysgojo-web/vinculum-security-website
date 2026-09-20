import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

const MEDIUM_FEED_URL = 'https://medium.com/feed/@jamesndua'
const SYNC_TTL_MS = 60 * 60 * 1000 // 1 hour

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

/** Parse the Medium RSS XML into article records. */
function parseFeed(xml: string): Article[] {
  const doc = new DOMParser().parseFromString(xml, 'text/xml')
  const items = Array.from(doc.querySelectorAll('item'))
  return items.map((item) => {
    const guid = item.querySelector('guid')?.textContent?.trim() ?? ''
    const id = guid.replace(/^https?:\/\/medium\.com\/p\//, '') || guid
    const title = item.querySelector('title')?.textContent?.trim() ?? ''
    const link = item.querySelector('link')?.textContent?.trim() ?? ''
    const pubDate = item.querySelector('pubDate')?.textContent?.trim() ?? ''
    const author = item.querySelector('dc\\:creator, creator')?.textContent?.trim() ?? ''
    const categories = Array.from(item.querySelectorAll('category'))
      .map((c) => c.textContent?.trim() ?? '')
      .filter(Boolean)
    const contentEncoded = item.querySelector('content\\:encoded, content')?.textContent?.trim() ?? ''
    const coverImage = firstImage(contentEncoded)
    const excerpt = htmlToExcerpt(contentEncoded)
    return { id, title, link, pub_date: pubDate, author, categories, cover_image: coverImage, excerpt }
  })
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
