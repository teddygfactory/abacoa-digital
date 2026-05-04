# Abacoa Digital — Landing Page

Two-page static site. No build step, no dependencies. Drop it on any host.

## Files

- `index.html` — main landing page
- `contact.html` — multi-step project intake form
- `vercel.json` — sensible security headers for Vercel deploys

## Run locally

```bash
# Option 1 — Python (built into every Mac/Linux box)
python3 -m http.server 8000

# Option 2 — Node
npx serve .
```

Then open `http://localhost:8000`.

## Deploy to Vercel

```bash
npm i -g vercel       # one-time install
vercel                # deploy preview
vercel --prod         # promote to production
```

Or push the folder to a GitHub repo and import it at vercel.com — Vercel auto-detects a static site. Then point your `abacoadigital.com` DNS at Vercel.

---

## Features

### Light + Dark theme toggle

Top-right sun/moon button switches themes. Choice is saved to localStorage so it sticks across visits. First-time visitors get whichever theme matches their OS preference.

The two themes share the same gold (`#d4af37`). Dark is a softer, more UI-friendly navy (not pure black) for long reads. Light is warm cream + ivory for an editorial feel. Both maintain the premium aesthetic.

### Multi-step contact form (`contact.html`)

4 steps based on what top digital agency intake forms (WebFX, Yummygum, Zapier) collect:

1. **Who you are** — name, email, company, role
2. **What you need** — services multi-select (7 options)
3. **Scope** — budget range + timeline (radio cards)
4. **Details** — project description + optional website + referral source

Validates each step before advancing. Progress bar shows position. Smooth animations between steps.

### Form submission — two paths

The form works **out of the box** via a `mailto:` fallback. When the user clicks "Send it", their email client opens with all form data formatted into the body, addressed to `hello@abacoadigital.com`.

For a real backend, paste a [Formspree](https://formspree.io) endpoint URL into `contact.html`:

```js
// Find this line in contact.html:
const FORMSPREE_ENDPOINT = '';   // empty = mailto fallback

// Change it to:
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_ID_HERE';
```

Formspree free tier handles 50 submissions/month and emails them straight to your inbox. No backend code to write. When you outgrow it, swap to a Vercel serverless function or Resend webhook.

### Other things to know

- **Logo**: AD monogram (A on left, D's curve wraps from the apex). Placeholder — swap with your real logo SVG when ready. Located in three spots: `index.html` nav + footer, and `contact.html` header.
- **CTA buttons**: The gold "Start a project" buttons have a glow halo (`box-shadow` + blurred background pseudo-element) that intensifies on hover. They're meant to pop without being garish.
- **Animations respect `prefers-reduced-motion`** — users who've turned that on in their OS get a static experience.

---

## Customization checklist

Most likely things you'll want to swap:

- **Logo SVG** — search for `<!-- AD MONOGRAM` markers (or just the path data). Replace in three spots.
- **Email** — global find/replace `hello@abacoadigital.com` to whatever you want.
- **Hero copy** — the headline and sub paragraph live in `index.html` under `class="hero-title"` and `class="hero-sub"`.
- **About/Approach copy** — three paragraphs under `class="approach-body"`.
- **Stack list** — the Stack section assumes Manus, Claude, Next.js, etc. Add or remove items as your real toolchain settles. Items with `class="stack-item featured"` get the gold treatment.
- **Service cards** — six cards under `class="cap-grid"`. Edit titles, descriptions, tags. Or remove cards if you want fewer.

## Brand tokens

All colors, fonts, and spacing live in CSS variables at the top of each file's `<style>` block. Both themes are defined under `html[data-theme="dark"]` and `html[data-theme="light"]`. Change once, both pages and both themes update.

```
--gold: #d4af37          /* matches your logo */
--serif: "Fraunces"      /* display headlines */
--sans: "DM Sans"        /* body text */
--mono: "JetBrains Mono" /* labels, accents */
```

## What to add later

- Real case studies / portfolio section once you have client work to show
- Cal.com or Calendly booking link as an alternative CTA
- A short reel or product demo video in the hero
- Basic blog index if you want to build organic search authority
- Replace the Formspree fallback with your own Vercel serverless function once volume justifies it
