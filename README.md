# Island Hub Caribbean Market: spec website

A finished spec website for **Island Hub Caribbean Market** (6856 Midlothian Turnpike, Ste 104, Richmond, VA 23225), made by Couture House Co. to show the owners. It is a static site: plain HTML, one stylesheet, one small vanilla JavaScript file and self-hosted fonts. There is no build step and nothing to install.

## Pages
| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, trust strip, aisle map, packshot grid, shipping feature, restock strip, quick facts, FAQ, visit CTA |
| `aisles.html` | Shop by aisle (7 aisles) with photos and products seen in the store's posts |
| `shipping.html` | Barrel, box and crate shipping to the Caribbean, US grocery shipping, how it works, destinations, quote form |
| `visit.html` | Hours with a live open/closed badge (America/New_York), address, the family, FAQ, "Request an item" form |
| `404.html` | Branded not-found page (root-absolute paths) |

Also included: `robots.txt`, `sitemap.xml`, `llms.txt` (fact sheet for AI answer engines), `site.webmanifest`, `netlify.toml` (security and cache headers, 404), JSON-LD structured data on every page (GroceryStore, BreadcrumbList, FAQPage, WebSite).

## Preview locally
Double-click `index.html` to open it in a browser, or, better (so fonts and preloads behave exactly as in production), run a local server from this folder:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

The two forms only submit once the site is deployed on Netlify. Locally they validate, then show a "could not be sent" message.

## Deploy on Netlify
1. Create a new site on Netlify: drag and drop this folder into **Sites > Add new site > Deploy manually**, or connect a Git repo containing it. No build command is needed; the publish directory is the repo root (already set in `netlify.toml`).
2. In **Forms**, confirm Netlify detected `shipping-quote` and `request-item`, then add an email notification (Forms > Settings > Form notifications) to the owner's inbox.
3. Add the custom domain (below) under **Domain management** and turn on HTTPS (automatic with Let's Encrypt).
4. After launch, submit `https://islandhubrva.com/sitemap.xml` in Google Search Console, and add the website URL to the Google Business Profile, Instagram bio and Yelp listing.

## Domain
Proposed domain: **islandhubrva.com**. Canonical URLs, Open Graph tags, the sitemap and structured data already point to it. If a different domain is registered, find and replace `islandhubrva.com` across all files.

## Editing notes
- Colors, type and spacing live in `assets/css/site.css` (tokens at the top).
- Store hours are in three places: the page HTML, the `HOURS` object in `assets/js/site.js` (open-now badge), and the JSON-LD `openingHoursSpecification` on each page. Update all three together, plus `llms.txt`.
- Images are in `assets/img/` as WebP, with `-800` versions for large photos.
- Fonts (Bricolage Grotesque, DM Sans, Caveat Brush) are self-hosted from Fontsource under the SIL Open Font License.
- The Content-Security-Policy in `netlify.toml` allows one inline script by hash (the line that adds the `js` class). If you change that line, update the hash.

See `LAUNCH-NOTES.md` for everything to confirm with the owners before going live.
