const { writeFileSync } = require('fs');
const fetch = global.fetch || require('node-fetch');
const sharp = require('sharp');

const base = 'http://localhost:3000';
const locales = ['fr','en','es','de'];
const fbToken = process.env.FACEBOOK_APP_TOKEN || process.env.FACEBOOK_TOKEN || null;

async function head(url){
  const res = await fetch(url, { method: 'HEAD' });
  const headers = {};
  res.headers.forEach((v,k)=> headers[k]=v);
  return { status: res.status, headers };
}

async function get(url){
  const res = await fetch(url);
  const text = await res.text();
  return { status: res.status, text };
}

function extractMeta(html, propName, attr='property'){
  const re = new RegExp(`<meta\\s+${attr}=(?:"|')${propName}(?:"|')\\s+content=(?:"|')([^"']+)(?:"|')`, 'i');
  const m = html.match(re);
  return m ? m[1] : null;
}

async function checkImage(url){
  try{
    const h = await head(url);
    if (h.status !== 200) return { ok:false, status:h.status };
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    const meta = await sharp(Buffer.from(buf)).metadata();
    return { ok:true, status:200, contentType: res.headers.get('content-type'), width: meta.width, height: meta.height, size: buf.byteLength };
  }catch(e){
    return { ok:false, error: e.message };
  }
}

async function fbRescrape(url){
  if (!fbToken) return { ok:false, reason:'no_token' };
  const endpoint = `https://graph.facebook.com/`;
  const params = new URLSearchParams({ id: url, scrape: 'true', access_token: fbToken });
  const res = await fetch(endpoint, { method: 'POST', body: params });
  const json = await res.json();
  return { status: res.status, body: json };
}

(async ()=>{
  const report = { checkedAt: new Date().toISOString(), results: [] };
  for (const locale of locales){
    const url = locale === 'fr' ? `${base}/` : `${base}/${locale}`;
    const page = await get(url);
    const obj = { locale, url, status: page.status, ogImage: null, twitterImage: null };
    if (page.status === 200){
      obj.ogImage = extractMeta(page.text, 'og:image', 'property');
      obj.twitterImage = extractMeta(page.text, 'twitter:image', 'name');

      obj.images = [];
      for (const imgUrl of [obj.ogImage, obj.twitterImage].filter(Boolean)){
        const resolved = imgUrl.startsWith('http') ? imgUrl : new URL(imgUrl, base).toString();
        const check = await checkImage(resolved);
        obj.images.push({ url: resolved, check });
      }

      // try to trigger FB rescrape
      const fb = await fbRescrape(obj.url);
      obj.fbRescrape = fb;
    }
    report.results.push(obj);
  }

  writeFileSync('tmp/og-validate-report.json', JSON.stringify(report, null, 2));
  console.log('Report saved to tmp/og-validate-report.json');
  console.log(JSON.stringify(report, null, 2));
})();