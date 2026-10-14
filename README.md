# Instant Shine website demo

Static site (plain HTML/CSS/JS, no build step). Live on GitHub Pages at:
https://peecho07.github.io/Instant-Shine/

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Services | `services.html` |
| Pricing | `pricing.html` |
| Our Work | `work.html` |
| About | `about.html` |
| FAQ | `faq.html` |
| Book a Detail | `book.html` (the "Book this" buttons on Pricing open it with the service already picked) |

Every page shares `styles.css` and `script.js`. The header, footer and icon set are repeated in each page, so a change to them needs to be made in all seven files.

## Brand

`brand/` holds the logo concept: `logo.svg` (dark backgrounds), `logo-light.svg` (light backgrounds), `logo-mark.svg` (icon and favicon), PNG exports, and `logo-sheet.png` for presenting it.

## Photos

`images/` holds the photos copied from the current site.

See [IMPROVEMENTS.md](IMPROVEMENTS.md) for what changed versus the current site.

Booking form: on Netlify it submits through Netlify Forms. On GitHub Pages (which can't receive form posts) it opens the visitor's email app with the booking details filled in.
