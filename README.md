# Clean Clean Commercial Cleaning — Website

A static, one-page marketing site for Clean Clean Commercial Cleaning. Plain HTML/CSS/JS — no build step, no framework, ready to host for free on Netlify.

## Structure

```
website/
├── index.html               # home page (must stay at the root)
├── pages/
│   ├── privacy-policy.html  # Privacy Policy (US / Florida)
│   ├── cookie-policy.html   # Cookie Policy + cookie list
│   ├── thank-you.html       # shown after the contact form submits (Netlify Forms redirect)
│   └── 404.html             # custom not-found page
├── netlify.toml             # Netlify headers, redirects (old URLs → /pages/) and 404
├── robots.txt               # crawler rules + reference list of main keywords
├── llms.txt                 # AI-readable site summary and page list (llmstxt.org)
├── sitemap.xml
└── assets/
    ├── css/style.css        # ALL styles (no inline <style> in pages)
    ├── js/gtm.js            # Google Tag Manager + Consent Mode defaults (loads first, in <head>)
    ├── js/consent.js        # cookie banner + preferences
    ├── js/script.js         # nav, scroll reveal, contact form
    ├── video/cleaning-in-action.mp4
    └── img/                 # logo, favicons, and photos
```

Pages inside `pages/` use root-absolute paths (`/assets/...`, `/pages/...`), so preview the site with a local server (see below) rather than opening the files directly.

## Deploying to Netlify (free)

**Option A — Drag and drop (fastest)**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the entire `website` folder onto the page.
3. Netlify gives you a live URL immediately (e.g. `random-name.netlify.app`).
4. In *Site settings → Domain management* you can rename the subdomain for free, or connect a custom domain later.

**Option B — Git-based (recommended for ongoing edits)**
1. Push the `website` folder to a GitHub/GitLab/Bitbucket repo.
2. In Netlify: **Add new site → Import an existing project** and connect the repo.
3. Build settings: leave the build command empty and set the publish directory to the folder containing `index.html` (`website` if the repo root is the parent folder, or `.` if `website` itself is the repo root).
4. Deploy. Every future push to the connected branch redeploys automatically.

## Contact form (Netlify Forms)

The quote request form in `index.html` uses [Netlify Forms](https://docs.netlify.com/forms/setup/) — no backend required, no extra signup. It works automatically once deployed on Netlify because of the `data-netlify="true"` attribute and hidden `form-name` field.

- Submissions appear in **Site settings → Forms** in the Netlify dashboard.
- To get an email every time someone submits, go to **Forms → Settings and usage → Form notifications** and add an "Email notification".
- A hidden honeypot field (`company-website`) blocks basic spam bots.
- After submitting, users are redirected to `pages/thank-you.html` (the JS also shows an inline confirmation if JavaScript is enabled).

**Note:** the form will *not* receive submissions when previewed locally by just opening `index.html` in a browser, or on any host other than Netlify — Netlify Forms only activates on a live Netlify deploy.

## Editing content

- **Business info / text** — edit directly in `index.html`.
- **Phone / WhatsApp number** — search for `19412599604` across `index.html` (appears in the header, hero, CTA banner, and contact section) and replace all instances if the number changes.
- **Colors & fonts** — all defined as CSS variables at the top of `assets/css/style.css` (`:root { ... }`).
- **Photos** — replace files in `assets/img/` (keep the same filenames to avoid updating `index.html`), or add new `<img>` tags for new sections.
- **Video** — `assets/video/cleaning-in-action.mp4` is referenced in the Gallery section.

## Local preview

No build tools needed. From the `website` folder, run any static server, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in a browser. (The contact form won't submit locally — see note above.)

## Google Tag Manager & cookie consent

- GTM container `GTM-WC3VNBDG` is loaded by `assets/js/gtm.js`, included at the top of `<head>` on every page (plus the `<noscript>` iframe after `<body>`).
- `gtm.js` sets the Google Consent Mode v2 defaults **before** loading GTM. The model is US opt-out: analytics and ads run by default unless the visitor opts out in the banner or their browser sends Global Privacy Control (GPC), which always disables ads.
- `assets/js/consent.js` renders the banner (Accept All / Reject Non-Essential / Customize), saves the choice in `localStorage` (`cc_consent`, 12 months), sends `gtag('consent','update', ...)`, and pushes a `cc_consent_update` dataLayer event.
- Any element with `data-cc-open` reopens the preferences panel (used by the "Your Privacy Choices" footer link).
- **When you add a new tag in GTM** (e.g. Meta Pixel), update the cookie table in `pages/cookie-policy.html` and its "Last updated" date. Non-Google tags must use GTM's consent settings ("Require additional consent") so they respect the choice.
- `/assets/*` is cached for 1 year (see `netlify.toml`), so bump the `?v=` query on CSS/JS links in every page after editing those files.
