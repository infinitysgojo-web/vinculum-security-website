import asyncio,json,re,sys
from playwright.async_api import async_playwright
INIT="""document.addEventListener('DOMContentLoaded',()=>{const st=document.createElement('style');st.textContent='#stcm-wrapper{display:none!important}';document.head.appendChild(st);});sessionStorage.setItem('vs:offline-session', JSON.stringify({userId:'qa-user',email:'qa@example.com'}));"""
DESKS=["Diagnostics","Sentinel Matrix","Compound Shock","Comparative Mirror","Briefing Desk","Counterpart Prompter","De-confliction Bench","Track Sequencing","Field Audit","Clause Architect","Clause Redliner","Succession Simulator","Legal Desk","Adversarial Chamber","Mission Readiness","Verification Ledger","Mandate Handover","Mission Binder"]
JS="""()=>{const h=[...document.querySelectorAll('h2,h3')].filter(e=>e.offsetParent).map(e=>e.textContent.trim()).slice(0,1)[0]||'';
const gs=[...document.querySelectorAll('div.grid')].filter(g=>g.offsetParent && g.getBoundingClientRect().width>600 && getComputedStyle(g).gridTemplateColumns.trim().split(/\\s+/).length===2);
return {h, grids: gs.map(g=>{const k=[...g.children].filter(c=>c.offsetParent!==null||c.getClientRects().length); const hs=k.map(c=>Math.round(c.getBoundingClientRect().height)); return {n:k.length, hs}}).filter(x=>x.n<=2 && (x.n===1 || Math.abs(x.hs[0]-x.hs[1])>150))}}"""
async def main():
  w=int(sys.argv[1]); preset=len(sys.argv)>2
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); c=await b.new_context(viewport={"width":w,"height":900}); await c.add_init_script(INIT); p=await c.new_page()
    await p.goto("http://localhost:4173/dashboard"); await p.wait_for_timeout(2500)
    if preset:
      await p.get_by_role("radio", name=re.compile("Great Lakes")).click(); await p.wait_for_timeout(2500)
    out={}
    for d in DESKS:
      await p.keyboard.press("Control+k"); await p.wait_for_timeout(300); await p.keyboard.type(d); await p.wait_for_timeout(300); await p.keyboard.press("Enter"); await p.wait_for_timeout(1300)
      out[d]=await p.evaluate(JS)
    for k,v in out.items(): print(k,'|',v['h'][:40],'|',v['grids'])
    await b.close()
asyncio.run(main())
