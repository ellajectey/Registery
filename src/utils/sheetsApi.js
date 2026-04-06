// ═══════════════════════════════════════════════════════════
//  Google Apps Script request helpers
//
//  WHY THIS EXISTS:
//  Apps Script redirects (302) to googleusercontent.com which
//  browsers block with a CORS error. The workarounds:
//
//  GET  → use JSONP (script tag injection) — Apps Script supports
//         a ?callback= param natively via HtmlService, but the
//         easiest approach is to append &callback=... and parse.
//         Actually the simplest reliable fix: use fetch with
//         redirect:'follow' + no-cors won't work for reading data.
//         Best working solution: add CORS headers in the script
//         itself via ContentService + doOptions, OR use a
//         simple Vite proxy in dev.
//
//  The REAL fix that always works reliably:
//  → Add a vite.config.js proxy (dev only, free, no extra services)
//  → In production (Vercel/Netlify) add a redirect rule
//
//  This file provides the fetch calls that work once the proxy
//  is in place. See vite.config.js for the proxy config.
// ═══════════════════════════════════════════════════════════

const PROXY_PREFIX = '/api/sheets'   // matched by vite proxy in dev
                                     // matched by vercel.json rewrite in prod

/**
 * Fetch registry items via proxied GET
 */
export async function fetchRegistry() {
  const res  = await fetch(PROXY_PREFIX)
  let data = await res.json();
  
  let nairaXchange = 130;
  if (Array.isArray(data.items)) {
    for(let item of data.items) {

      // naira conversion
      if (item.price) {
        item.ng_price = item.price * nairaXchange;
      }

      // google drive images
      let isDriveURL = item.image?.includes('drive.google.com') ? true : false;
      if (isDriveURL) {
        let spliturl = item.image.split('/');
        let newURL = spliturl[5] ? `https://drive.google.com/thumbnail?id=${spliturl[5]}&sz=w1000` : 'https://images.unsplash.com/photo-1606293926075-69a5658f1c1c?w=400&q=80';
        item.image = newURL;
      }
    }
  }

  return data.items || []
}

/**
 * Post an RSVP or gift action via proxied POST
 */
export async function postToSheet(payload) {
  const res = await fetch(PROXY_PREFIX, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })
  return res.json()
}
