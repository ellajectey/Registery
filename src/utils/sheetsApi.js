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
  const data = await res.json()
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
