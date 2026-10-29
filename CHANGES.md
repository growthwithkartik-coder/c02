# Changes

## 26 October 2026 — prices, net weights and travel sizes from the price sheet

Full report (product-by-product mapping, flagged items): `docs/PRICE-SHEET-UPDATE-2026-10-26.md`.

- **Catalogue prices are back.** 52 of 55 products now show the full-size price and net weight from the CO2 price sheet; names follow the sheet (e.g. "Noir Charcoal Face Wash" → "Charcoal Face Wash"). URLs and photos unchanged. Add to bag / checkout work again for these products.
- **Travel sizes** (38 products) come from the sheet, shown beside the full size on cards, quick view and product pages. Products with no travel size (NA) show only the full size — no travel row, label, placeholder or "not available" text, and their "Try a sample" section is omitted.
- **Not priced, flagged for review:** Red Grapes Face Wash, Red Wine Soap, Scalp Clear Treatment Gel — still "Price on request" with the WhatsApp button.
- **Still on request:** made-to-order formulas / Make It Yours builder (`CUSTOM_PRICES_ON_REQUEST`) and the six services.
- New `components/ui/SizePrice.tsx`; price wording updated in FAQs, About, Terms, Combos, Sampling and the announcement bar; sample sets rebuilt from products with travel sizes.

## 18 October 2026 (fourth batch) — stale images fixed (cache-busting)

- Product photos, campaign cut-outs, the logo and the brand film are served with a one-year "immutable" cache, so browsers kept showing the old hero cut-outs (with the "CO2 Cosmetics" lettering) after the files were replaced. Every one of these URLs now carries a version tag (`?v=20261018c`, set in `lib/image-loader.ts` as `ASSET_VERSION`), so the new files load straight away. **Bump `ASSET_VERSION` whenever you replace an image or video.**

## 18 October 2026 (third batch) — logo check and proofread

- **Logo:** the logo supplied on 18 Oct is the same official CO2 logo already in `public/brand/` (it only differs by JPEG compression). Every product photo, campaign cut-out and film frame was checked: all packs carry the official logo. The homepage hero's serum, moisturizer and lip gloss already used it. A faint ghost of the old wordmark under the logo on the small Anti-Aging Cream jar (Renew Firming Cream photos + hero cut-out) has been removed, and the brand film was re-rendered from the cleaned cut-out.
- **Pack text fixed in photos:** "MULTHANI" → "MULTANI" (Multani Mitti Face Mask), "SHIKAIKAH" → "SHIKAKAI" (Shikakai Shampoo), the garbled "Coconut/Oil" line → "Gentle Cleansing & Refreshing Bathing Bar" (Mint Cool Herbal Bar, both photos), and the design placeholders "[Optional: Colour]" (Papaya Soap) and "[Optional: Essential Oils]" (Turmeric Soap) removed. Masters updated in `assets-source/`.
- **Copy:** every page was crawled (104 URLs) and proofread. Fixed: awkward "Anyone looking for a…" lines on 10 products; "The pack describes it as: spf 50+…" style lines (now "…as SPF 50+, daily use and sun protection"); "Lip Stick" → "Lipstick"; "shikaikah" in the hair FAQ; "personalisation/analyse" → "personalization/analyze" for consistency; meta descriptions no longer cut off mid-word; "Where it fits" lines read naturally; and all leftover price wording (price breakdown, "fixed price", "combos cost the sum", "prices shown", price filter mentions, terms of sale) updated for prices on request.

## 18 October 2026 (second batch) — Services + WhatsApp price requests

- **Six services added**, each with a heading, short description and its own "Request pricing" button: Packaging Consulting · Packaging Design · Legal & Regulatory Compliance · Quality Assurance & Product Feasibility Study · Regulatory Compliance Guidance · Export Procedures & Documentation Support. Content lives in `data/services.ts`.
- **Homepage:** a full "Our services" section (all six cards visible, no tabs) directly under the hero and benefits strip (`components/sections/ServicesSection.tsx`).
- **New `/services` page:** hero, a quick index of all six, detailed cards (description + what's included), how-it-works steps and a note on scope. Added to the sitemap.
- **Navigation:** "Services" is a top-level item in the main nav (not in a dropdown), a top row in the mobile menu and a footer link. "Customization" now shows in the desktop bar from 1280 px up (at 1024–1279 px it's reached via Make It Yours / the footer) so the bar fits.
- **Every "Request price" / "Request pricing" button now opens WhatsApp** on the existing number (+91 83558 97803, `site.contact.whatsapp` — unchanged) in a new tab, with a pre-filled quote request naming the product, shade, size, set, combo, routine or service. wa.me opens the app on mobile and WhatsApp Web/Desktop on a computer. The written request form stays available as a secondary "Request form" link on product pages.
- Tested: 52 price buttons across 15 pages all link to the WhatsApp number with the right item name, and clicks on product, service, sample-set, build-your-own-combo and try-on buttons were checked at desktop and iPhone sizes.

## 18 October 2026 — prices on request

- **No prices anywhere on the site.** Every product, shade, travel size, sample set, combo, collection and made-to-order formula now reads **"Price on request · as per customization"**. Switch: `PRICES_ON_REQUEST` in `lib/utils.ts` (set to `false` to bring listed prices back; the prices in `data/` are untouched).
- **Request price** replaces every add-to-bag / buy-now / "add set" button: it opens the request form on `/customization` pre-filled with the item (`?item=…`), with a WhatsApp option beside it (`components/commerce/PriceOnRequest.tsx`). The form has a new "Price for a CO2 product" option.
- **Make It Yours builder:** made-to-order formulas are now sent as quote requests too (contact step + "Send customization request"); the price breakdown is replaced by the price-on-request note.
- Price filters and price sorting hidden; budget questions removed from the consultations; product FAQs, Help/FAQ (new "Prices" section), guides, sampling and combo copy rewritten; announcement bar adds "Prices on request · as per customization".
- AI assistant context no longer includes prices and is told never to quote one.
- Cart and checkout code is kept but can't be filled while prices are on request (the server also rejects unpriced lines). Shipping policy amounts (free over ₹999, otherwise ₹79) are unchanged.

## 16 October 2026 (second batch) — lip shades, Coffee Soap, single logo

Full report: `docs/PRODUCT-UPDATE-REPORT-2026-10-16b.md`.

- **New products:** Coffee Soap (Body Care › Body soaps), Gloss Red Kiss and Gloss Secret Rose (Lips › Lip gloss) — pack text only, "Price coming soon".
- **Lipstick:** four new shades with photos — Berry Rubin, Burgundy Spirit, Red Kiss Matte, Red Kiss Glossy (seven shades in total), in the shade selector and virtual try-on.
- **Logo:** official logo applied on-pack to the 6 new photos and the 3 existing lipstick photos (old marks, corner stamp, placeholder text and sparkle watermark removed); campaign cut-outs and brand film rebuilt with the official logo; 3D packaging preview uses the logo artwork; intro shows the logo alone.
- **Content:** shade counts, collections, combos, consultation and recommender updated; duplicate and Title-Case product copy rewritten; "Multani Mitti Face Mask" and "Shikakai Shampoo" spelled correctly.
- **Fix:** product gallery thumbnails no longer overflow on mobile when a product has many photos.

## 16 October 2026 — Drive inventory, categories, customization, logo

Full audit: `docs/PRODUCT-INVENTORY-REPORT-2026-10-16.md`.

- **Catalogue = Drive inventory.** 52 products (was 54 + 6 made-to-order). 22 products added from the Drive photos (pack text only, "Price coming soon" until prices are entered); 20 products not in the Drive ZIP removed; Clarité Blemish Cream, Neem Clarity (aloe/neem/tea tree) Face Wash, Scalp Clear Jelly and the round-bottle 24K Gold Radiance Serum removed. Removed URLs return 404.
- **Categories by use:** Skincare (face wash & cleansers · serums & treatments · face creams & moisturizers · sun protection · masks & scrubs), Hair Care (shampoos · hair oils · scalp treatments · beard care), Body Care (lotions, creams & gels · body wash & shower gel · body soaps), Lips. Default sort keeps each section's products together.
- **Makeup removed** — nav, footer, mega menus, home tile, department, consultation, recommender, FAQ, combos and formulas. Old URLs redirect.
- **Customize Your Product** (`/customization`) replaces the drawn "empty bottle" made-to-order cards: container styles, pack colours, cap finishes, formulas and sizes from the existing config, travel sizes, and a request form. Made-to-order formulas moved to `data/custom-formulas.ts` (not catalogue products).
- **Logo:** the official CO2 logo applied on-pack to all 22 new photos and to Beetroot Soap; "[EXACT CO₂ LOGO]" placeholders retouched off the soap lids. Masters + scripts in `assets-source/product-photos-2026-10-16/`.
- Collections, combos, sample sets, concern tiles, campaign scenes, home/about/sampling imagery and the brand film rebuilt from authorized products only.

## October 2026 — lipstick, shade selector, branded photos, contact email

- **Products**: added **Lipstick** (Secret Rose, Coral Crush, Chocolate Dream — one product, three shades, a photo per shade) to Lips and Makeup, and **Beetroot Soap** to Body › Bath bars. Names, size and ingredients come from the packs; no prices were supplied, so both are marked "Price coming soon" and can't be ordered until a price is entered (`availability: "price-pending"`).
- **Lip shade selector** on the Lips page with smooth preview switching and a direct "Try {shade} on"; lipstick shades added to the virtual try-on (camera + photo, in-browser).
- **Product page**: picking a shade switches the gallery photo and the try-on button.
- **Branding**: the official CO2 logo applied to the four new product photos (top-left, 10% width) before upload; the "[EXACT CO₂ LOGO]" placeholder caption retouched off the soap lid. Sources and scripts in `assets-source/product-photos-2026-10/`.
- **Contact email** is now dev@demigodhouse.com everywhere; policy-page emails are clickable.
- **Footer**: oversized "CO2" wordmark removed; spacing rebalanced.
- **Fix**: the try-on now shows the "browser doesn't support camera access" message for `NotSupportedError` instead of a generic error.

## October 2026 — content & quality audit

- **About page**: the founders' story ("How CO2 Cosmetics began") replaces the earlier "Why we started" text, in full and in its original four paragraphs, with the closing tagline "CO2 Cosmetics — Created with care. Made with purpose. Inspired by nature." as a separate element. It appears once on the site.
- **Copy**: grammar, punctuation and wording fixes across product descriptions, homepage, Make It Yours, policies, cart/checkout and forms; consistent terms ("bag" not "cart", "personalize", "colour", "PIN code", "Bestseller", sentence-case headings).
- **Products**: removed references to products that don't exist (Skin Veil, Flush Balm); corrected the herbal bar count (six, not five); "Custom Lip Color" → "Custom Lip Colour"; softened a few result claims; removed an unsupported "suitable for eyes" answer. Prices, ingredients and pack claims are unchanged.
- **Placeholders**: `[TO CONFIRM]` lines removed from the cancellation and returns pages; the policy "draft" box now shows only in development. "[EXACT CO2 LOGO]" text that was printed in the herbal bar photos (12 product photos + 2 cut-outs) has been retouched out.
- **SEO**: product meta descriptions no longer repeat text or show "oz.."; product page section numbers are now consecutive.
- **Mobile**: fixed horizontal scrolling on the homepage (category tiles, combos banner, ingredient cards) and About page at phone width.

## October 2026 — "We make it for you" personalization redesign

- **Make It Yours**: five separate, config-driven consultations (Face & Skin, Hair, Body, Lips, Makeup) with conditional questions, progress rail, back/next, validation, local draft saving, review/edit and loading/error states; results page that shows a routine before any purchase, with reasons marked "from product info" vs "matches your preference"; product + packaging builder with a three.js 3D container preview, price breakdown, add-to-bag for made-to-order formulas and "pending confirmation" requests for on-request formulas (`/api/customize/request`).
- **Homepage** rebuilt as a 15-section journey with a brand film rendered from the real product cut-outs.
- **Sampling Studio** (`/sampling`): travel sizes, curated sets, build-your-own set; travel-size option on product pages; server-side sample pricing and limits. Draft prices — confirm in `data/sampling.ts`.
- **Combos** (`/combos`, `/combos/[slug]`) priced at the sum of their items, plus Build Your Own Combo.
- **Navigation**: Home · Shop All · Skin · Hair · Body · Lips · Makeup · Combos · Make It Yours · Our Story with mega menus; rotating announcement bar; new Body department; Shop All with filters (grouped by category).
- **Product pages** extended to 14 sections; **category pages** gained ingredient notes, routines, travel sizes, FAQs and a customization CTA.
- **About** page rewritten around the founders' story; customization, sampling and product-care guides; cancellation policy; policies marked as drafts with the fields to confirm.
- **Footer** with popular links (from the live catalogue), four columns, newsletter consent; floating WhatsApp + Try Sampling buttons.
- **Honesty fixes**: forms report real success/failure, newsletter consent, reviews sent for moderation, removed unbacked reply-time promise, no fabricated reviews/claims/savings.
- See README §00 for the full description, configuration still needed and the testing summary.

# CO2 — e-commerce redesign (October 2026)

See README §0 for the full description, run instructions and test results.

## Added
- `data/taxonomy.ts`, `lib/taxonomy.ts` — departments (Skin, Hair, Makeup, Lips), skin & hair concerns, product formats, ingredient facets, try-on shades
- `components/filters/DepartmentExplorer.tsx` — department-specific, multi-select, URL-synced filters + sorting + spacious 4-up grid
- `components/shop/DepartmentHero.tsx` — compact category banner + shop-by-concern tiles
- `components/tryon/` — `TryOnProvider`, `TryOnModal`, `TryOnButton`; `lib/tryon/lips.ts` — face tracking + lip renderer
- `public/mediapipe/face_mesh/` — bundled MediaPipe Face Mesh runtime + model (Apache-2.0); `@mediapipe/face_mesh` dependency
- `components/home/` — new homepage (hero with portrait slot, category tiles, concern tabs, bestseller tabs, featured skincare/haircare, lip collection with portrait slot, try-on section, brand story)
- `app/search/page.tsx`, `components/search/SearchResults.tsx` — full results page grouped by department
- `docs/AI-PORTRAIT-PROMPTS.md` — prompts for the two beauty portraits; `hero-model` / `lip-model` scenes in `data/campaign.ts`

## Changed
- `components/ui/ProductImage.tsx` + every product photo on the site → `object-fit: contain`, no scale/zoom transforms
- `components/product-gallery/ProductGallery.tsx` — square frame, contain, click-to-zoom
- `components/product-card/ProductCard.tsx` — uniform card, always-visible Add to bag, Try on for lip products
- `components/navbar/Navbar.tsx` — announcement bar, category navigation with mega menus (types + concerns); `MobileMenu.tsx` — compact drawer with expandable departments
- `app/shop/page.tsx`, `app/shop/[category]/page.tsx` — department pages, bestsellers, made-to-order; legacy URLs map to departments
- `app/product/[slug]/page.tsx` — department breadcrumbs, Try It On, related products from the same department
- `app/collections/[slug]/page.tsx` — products grouped by department, 4-up grid
- `components/search/SearchOverlay.tsx` — results grouped by department; concern/shade search
- `lib/catalog.ts` — department-scoped related products; search covers concerns, product types and shades
- `data/site.ts` — new navigation, announcements, footer links; `app/sitemap.ts`; `styles/globals.css` (header height vars); `tailwind.config.ts` (tighter section spacing); `lib/storage.ts` (try-on shade key)
- `scripts/generate-campaign.ts` — per-scene art direction and size

## Unchanged
Catalogue data and photos, cart logic, wishlist, compare, quick view, Customized Skincare consultation, checkout, Razorpay, UPI QR, orders, notifications, API routes, content pages.
