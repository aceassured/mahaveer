# Mahaveer Group — Website

Static marketing site for Mahaveer Group: the main site (home + about) and the Mahaveer Crest project landing page.

## Tech stack

- Plain HTML + [Tailwind CSS via the Play CDN](https://tailwindcss.com/docs/installation/play-cdn) — no build step, no `npm install` required
- Vanilla JavaScript (`assets/js/main.js`) for nav, tabs, carousels (Swiper), accordions, and form/menu behavior
- Self-hosted fonts (Optima, Satoshi, Brittany) served from `assets/fonts`

## Pages

- `home.html` — homepage
- `about.html` — about page
- `crest.html` — Mahaveer Crest project landing page (lead-gen page: hero form, floor plans, gallery, FAQ, etc.)

## Running locally

There's no build step — just serve the folder with any static file server. Opening the HTML files directly via `file://` can break font loading and other relative-path assets in some browsers, so a local server is recommended.

```bash
cd mahaveer
python3 -m http.server 8000
```

Then open in your browser:

- http://localhost:8000/home.html
- http://localhost:8000/about.html
- http://localhost:8000/crest.html

Any other static server works just as well, e.g.:

```bash
npx serve .
```

## Project structure

```
├── home.html
├── about.html
├── crest.html
└── assets/
    ├── css/style.css   — custom CSS: @font-face declarations, animations, small overrides on top of Tailwind
    ├── js/main.js      — header/nav behavior, tabs, accordions, Swiper carousels
    ├── images/         — photography and decorative graphics
    ├── icons/          — SVG/PNG icons
    └── fonts/          — self-hosted font files (Optima, Satoshi, Brittany)
```

## Notes

- No `package.json` — Tailwind is configured inline per page (`<script>tailwind.config = {...}</script>`) with a shared custom breakpoint scale and color palette.
- The lead-gen forms across all pages are front-end only and are not wired up to a backend yet.
- Several sections use placeholder/template copy and imagery pending final content from the client.
