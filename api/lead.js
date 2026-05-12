// Vercel Edge Function: proxies contact-form submissions to the
// abacoa-agent webhook on Railway with the secret header added
// server-side. Keeps the webhook secret out of the browser bundle.
//
// Required env vars (set in Vercel project settings):
//   LEADS_URL     e.g. https://abacoa-agent-production.up.railway.app/leads
//   LEADS_SECRET  the value of WEBHOOK_SECRET on the Railway service

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }
  if (req.method !== 'POST') {
    return json({ ok: false, error: 'method not allowed' }, 405);
  }

  const LEADS_URL = process.env.LEADS_URL;
  const LEADS_SECRET = process.env.LEADS_SECRET;

  if (!LEADS_URL || !LEADS_SECRET) {
    return json({ ok: false, error: 'lead webhook not configured' }, 500);
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: 'invalid json' }, 400);
  }

  // Minimal shape check. The agent does its own pydantic validation.
  if (!payload || typeof payload !== 'object' || typeof payload.email !== 'string') {
    return json({ ok: false, error: 'invalid payload' }, 400);
  }

  try {
    const upstream = await fetch(LEADS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': LEADS_SECRET,
      },
      body: JSON.stringify(payload),
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  } catch (err) {
    return json({ ok: false, error: 'upstream unreachable' }, 502);
  }
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
