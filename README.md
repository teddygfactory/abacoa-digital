# Abacoa Digital — Landing Page

Two static HTML pages plus one Vercel Edge function. No build step. Deploys to Vercel.

## Files

- `index.html` — main landing page
- `contact.html` — multi-step project intake form
- `api/lead.js` — Vercel Edge function that proxies form submissions to the abacoa-agent webhook on Railway
- `vercel.json` — sensible security headers for Vercel deploys

## Run locally

```bash
# Python (built into every Mac/Linux box)
python3 -m http.server 8000

# Or Node
npx serve .
```

Then open `http://localhost:8000`. Note: `/api/lead` only runs on Vercel, so the form falls back to mailto when run via the local static server.

## Deploy to Vercel

```bash
npm i -g vercel       # one-time install
vercel                # deploy preview
vercel --prod         # promote to production
```

Or push to GitHub and import at vercel.com. Vercel auto-detects the static site plus the `api/` Edge function.

---

## Features

### Light + Dark theme toggle

Top-right sun/moon button switches themes. Choice is saved to localStorage. First-time visitors get whichever theme matches their OS preference. Both themes share the same gold (`#d4af37`).

### Multi-step contact form (`contact.html`)

Four steps: who you are, what you need, scope (budget + timeline), details. Validates each step before advancing. Progress bar, smooth animations between steps. Animations respect `prefers-reduced-motion`.

### Form submission — agent webhook with mailto fallback

Submissions POST to `/api/lead`, a Vercel Edge function that forwards the payload to the `abacoa-agent` `/leads` webhook on Railway with the secret header added server-side. The browser never sees the secret. The agent triages each lead and posts it to Telegram in seconds.

Required Vercel env vars (Settings → Environment Variables):

| Name | Value |
| --- | --- |
| `LEADS_URL` | Railway URL of the agent, e.g. `https://abacoa-agent-production.up.railway.app/leads` |
| `LEADS_SECRET` | The same value as `WEBHOOK_SECRET` on the Railway service |

If the proxy is unreachable, the form falls back to a `mailto:` to `hello@abacoadigital.com` so nothing is silently lost.

### Optional integrations

**PostHog analytics** — set `POSTHOG_KEY` in both `index.html` and `contact.html` to enable. The contact form fires `lead_submitted` (and `lead_mailto_fallback` if the webhook path fails) with budget, timeline, and services as properties.

**Calendly / Cal.com booking** — set `BOOKING_URL` in `contact.html` (top of the script block). A "Book the call now" button appears on the success step pointing at it.

---

## Customization checklist

- **Logo SVG**: search for `<!-- AD MONOGRAM` markers. Replace in three spots.
- **Email**: global find/replace `hello@abacoadigital.com`.
- **Hero copy**: `class="hero-title"` and `class="hero-sub"` in `index.html`.
- **Approach copy**: three paragraphs under `class="approach-body"`.
- **Stack list**: items under the Stack section. `class="stack-item featured"` gets the gold treatment.
- **Service cards**: six cards under `class="cap-grid"`.

## Brand tokens

CSS variables at the top of each file's `<style>` block. Themes defined under `html[data-theme="dark"]` and `html[data-theme="light"]`.

```
--gold: #d4af37          /* matches the logo */
--serif: "Fraunces"      /* display headlines */
--sans: "DM Sans"        /* body text */
--mono: "JetBrains Mono" /* labels, accents */
```

## What to add later

- Real case studies / portfolio section once there's client work to show
- A short reel or product demo video in the hero
- Basic blog index for organic search
- Rate limiting on `/api/lead` if drive-by spam shows up (Vercel KV + per-IP counter is enough)
