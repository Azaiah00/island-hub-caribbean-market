# Launch notes: Island Hub Caribbean Market

Confirm everything below with the owners before the site goes live.

## Facts to confirm
1. **Hours.** The site uses the current Instagram bio hours: Mon to Wed 9am to 8pm, Thu to Sat 9am to 9pm, Sun 9am to 5pm. The door decal in an older photo shows "Mon to Sat 9am to 9pm, Sun 9am to 5pm". Confirm which is current, and any holiday hours.
2. **Founders.** The Visit page, FAQ, `llms.txt` and JSON-LD `founder` say the store was founded by **Carlton Chambers and his daughter Tracy**. Confirm spelling, Tracy's surname if they want it shown, and permission to name them. Remove if they prefer not to.
3. **Opening date.** "Opened May 2023" / "Since May 2023". Confirm.
4. **Google rating.** Home page and JSON-LD `aggregateRating` show **4.8 from 48 reviews**. Update the count at launch (and ideally keep it current).
5. **Phone and texting.** (804) 716-5480 is used for calls and `sms:` "Text us" links. Confirm the number can receive texts; if not, remove the Text links.
6. **Shipping destinations.** The site says "every Caribbean island" (from their own graphic) and lists 21 islands as examples. Confirm the list. Cuba is deliberately left off (US export restrictions). Confirm whether mainland destinations such as Guyana or Belize are served; they are not currently listed as shipping destinations.
7. **What ships.** Barrels, boxes, crates; "barrels, boxes, appliances, groceries, general" from their graphic. Confirm, and supply any items they will not ship.
8. **Drop-off.** Step 4 on the Shipping page says "Ask about drop-off at the store, or book a pickup in and around RVA (fees apply)". Confirm whether customers can drop off packed barrels or boxes at the store.
9. **Boxes and crates for sale.** The site only says barrels are sold in store. Confirm whether boxes or crates are sold too.
10. **Pickup area and fees.** "In and around RVA, fees apply". No radius or fee is stated. Supply them if they want them shown.
11. **US grocery shipping.** "We ship to all states; perishable items ship overnight". Confirm, and confirm the ordering process (phone, text, Instagram DM).
12. **Product list.** Aisle items come from their Instagram posts and a creator's collab post (Trinidadian drinks, Guyanese chow mein, Haitian favorites, African goods). Confirm they still carry these. "Rude Boy" is listed as a drink by name only.
13. **Not on the site (unverified):** EBT/SNAP acceptance, payment methods, parking, delivery radius, prices, shipping rates, transit times, carriers. Tell us any they want added.
14. **Alcohol.** Magnum Tonic Wine and any alcoholic products are intentionally not listed.
15. **Email.** No business email is shown. Provide one if they want it on the site and in the structured data.
16. **Map pin.** The Google Maps link is a search for the business name and address. After launch, replace it with the Google Business Profile's share link, and optionally add `geo` coordinates to the JSON-LD.

## Forms
- `shipping-quote` (Shipping page) and `request-item` (Visit page) are Netlify Forms with a honeypot and client-side validation. They **only work once deployed on Netlify**. After the first deploy, set up email notifications to the owner's inbox under Forms > Settings.

## Photo credits and licensing
All photos come from the business's own public Instagram (@islandhub_) and must be approved and licensed by the owners before launch. Files used (in `assets/img/`):
sorrel-fresh, store-aisle-flags (cropped from a creator's collab video frame, above the person), barrel-loading-van (people visible: confirm consent), escoveitch-pickled-vegetables, easter-bun-golden-krust, jamaican-patties-golden-krust (cropped below a text overlay; shows a hand), butter-bread, sugar-buns, angel-brand-nutmeg, angel-brand-mauby-bark, angel-brand-cerasee, angel-brand-guinea-hen-weed, clover-soursop-tea, caribbean-dreams-moringa-tea, kiss-cream-filled-cupcakes, national-plantain-chips, callaloo-fresh, breadfruit, yellow-yam, grace-cherry-syrup, serge-full-cream-milk, supligen-vanilla, dominoes, ludi-board (cropped to leave out artwork at the bottom of the board), island-flag-apparel.
- `barrel-loading-van.webp` (Shipping page, "How it works") shows two people loading a barrel. Confirm they agree to appear, or swap it for the brand graphic.
- Product packaging shows third-party brands (Grace, Golden Krust, National, Angel Brand, Serge, Supligen, and others). These are shown only as stock photos of items sold in the store.
- The logo is a new SVG wordmark inspired by their palm-tree door decal. Confirm they are happy with it, or supply original logo files.
- The Open Graph image (`og.jpg`) and favicons were generated from the sorrel photo and the new palm mark.

## Items to swap or add when available
- A real storefront or exterior photo (none was available), and a photo of the owners for the Visit page.
- A current shelf photo of the Jamaican ice cream freezer (flavors are listed as text for now).
- A Google Business Profile link, and Facebook or TikTok links if they have them (add to `sameAs` in the JSON-LD and to the footer).
- Real Google reviews to quote, with permission (none are quoted now).

## Domain
- Proposed: **islandhubrva.com** (used in canonical tags, Open Graph, sitemap, robots and JSON-LD). Check availability and register it before launch, or find and replace across all files if a different domain is chosen.


## Live preview domain (updated 27 Sep 2026)
The site is live at https://island-hub-caribbean-market.netlify.app/ and every canonical URL, Open Graph/Twitter tag, JSON-LD URL, sitemap.xml, robots.txt and llms.txt now points there, so text-message and social link previews show this address.
When the owner's own domain (islandhubrva.com) is connected in Netlify, find-and-replace `island-hub-caribbean-market.netlify.app` with `islandhubrva.com` across the .html/.xml/.txt/.toml files, then redeploy.
