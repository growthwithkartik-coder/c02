# CO2 — Cosmetics, Made Personal

A personalized beauty e-commerce website for **CO2**, built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, three.js, Lenis and Razorpay.

**October 2026 — "We make it for you" redesign** — see **§00** first. The site now centres on personalization: five category-specific consultations (Face & Skin, Hair, Body, Lips, Makeup) that show a routine *before* any purchase, a product + packaging builder with a 3D preview, a Sampling Studio, combos, richer product and category pages, a real About page and a full footer. The cart, checkout, Razorpay, UPI QR, lip try-on and catalogue from the previous version are kept. Earlier notes (§0 onwards) still describe those parts.

---

## 0000. 16 October 2026 — Drive product inventory, categories, Customization, logo

**Read this first.** Run as before (`npm install`, `npm run dev`; `npm run check` and `npm run check:config` validate the catalogue). No new dependencies or environment variables.

- The product list now matches the supplied Drive photo inventory exactly — see `docs/PRODUCT-INVENTORY-REPORT-2026-10-16.md` for the product-by-product comparison, removals, items needing a decision and test results.
- `data/products.ts` holds only photographed catalogue products (52). Made-to-order formulas live in `data/custom-formulas.ts` and are shown only on `/customization` and in the builder.
- Departments: Skincare, Hair Care, Body Care, Lips (`data/taxonomy.ts`, `data/categories.ts`). The Makeup department and consultation are gone; `/shop/makeup`, `/shop/made-personal` and `/make-it-yours/makeup` redirect (`next.config.ts`).
- 24 products are `availability: "price-pending"` ("Price coming soon"). To sell one, set its `price` and change `availability` to `"in-stock"`.

The sections below describe earlier versions; where they mention removed products, the Makeup department or a five-consultation setup, this section supersedes them.

---

## 000. October 2026 — lipstick, shade selector, branded photos, contact email

**Read this first if you are picking up the latest update.** Run it the same way as before (`npm install`, `npm run dev`). No new dependencies, environment variables or API keys.

| Change | Where |
|---|---|
| **Lipstick** — one product with three shades (Secret Rose, Coral Crush, Chocolate Dream), each shade with its own photo; picking a shade on the product page switches the gallery photo and the "Try … on" button | `data/products.ts` (`slug: "lipstick"`), `components/product-details/ProductPurchase.tsx`, `components/product-gallery/ProductGallery.tsx`, `components/tryon/ProductTryOn.tsx`, `lib/shade-events.ts` |
| **Beetroot Soap** — added to Body › Bath bars (ingredients and claims exactly as printed on the lid) | `data/products.ts` (`slug: "beetroot-soap"`) |
| **Lip shade selector** on `/shop/lips#try-on` — swatches for every lipstick and gloss shade, selected shade highlighted, preview photo swaps smoothly, "Try {shade} on" opens the virtual try-on on that shade | `components/tryon/LipShadeStudio.tsx` |
| **Virtual try-on** — lipstick shades added (satin finish rendering), grouped "CO2 lipstick" / "CO2 lip gloss"; uses the existing MediaPipe Face Mesh lip landmarks, camera + photo, processed in the browser only. `NotSupportedError` from the camera API now shows the "browser doesn't support camera" message | `lib/taxonomy.ts` (`getTryOnShades`, `shadeIdFor`), `components/tryon/TryOnModal.tsx`, `lib/tryon/lips.ts` |
| **Price pending** — no price was supplied for the lipstick or the soap, so none was invented. Both show **"Price coming soon"**, can be viewed, wish-listed and tried on, but can't be added to the bag; the server also refuses them; no ₹0 appears in search results, structured data or recommendations | `availability: "price-pending"` in `data/products.ts`; `isPricePending()` in `lib/utils.ts` |
| **Contact email** → `dev@demigodhouse.com` everywhere (footer, Contact page, policies — now clickable `mailto:` links — and the Organization structured data) | `data/site.ts` → `contact.email` |
| **Footer** — the oversized "CO2" wordmark is removed; contact row and legal bar close the footer without a gap. The footer logo and all other branding are unchanged | `components/footer/Footer.tsx` |
| **Branded product photos** — the official CO2 logo was applied to every new photo (same size and corner on all), checked, then exported. Originals, lossless masters, scripts and the placement rule are kept in `assets-source/product-photos-2026-10/` | see that folder's README |

**To make the lipstick and soap orderable:** in `data/products.ts` set `price` to the real INR price and change `availability` from `"price-pending"` to `"in-stock"`. Nothing else needs to change.

The supplied Berry Rubin gloss photo is the same photo already on the site, so it was left as it was.

---

## 00. October 2026 personalization redesign

### Run it
```bash
npm install
cp .env.example .env.local      # optional — runs without keys
npm run dev                     # http://localhost:3000
npm run build && npm start      # production
npm run check && npm run check:config   # catalogue + personalization config integrity
npm run film                    # re-render the brand film (needs Python Pillow + ffmpeg)
```
No new environment variables are required. One new dependency: `three` (loaded only on the builder page).

### New and rebuilt pages
| Route | What it is |
|---|---|
| `/` | 15-section homepage: rotating announcement bar → navigation → customization hero ("Your skin. Your needs. Your formula." + "We make it for you.") → benefits strip → one-size-fits-all breaker → editorial categories → Make It Yours steps → brand film → curated products + highlighted routine + made-to-order → ingredient story → Sampling Studio → combos → philosophy → trust strip → community (no fabricated reviews) → final CTA |
| `/make-it-yours` | Customization landing: category selection, how it works, made-to-order vs on-request, FAQs |
| `/make-it-yours/[face\|hair\|body\|lips\|makeup]` | Five **separate** consultations (config in `lib/customize/flows.ts`) |
| `/make-it-yours/[flow]/results` | Beauty profile → suggested routine → recommended products with reasons → customize → try first → save or continue |
| `/make-it-yours/build` | Product + packaging builder with 3D preview, price breakdown, add-to-bag or customization request |
| `/sampling` | The Sampling Studio: curated sample sets, all travel sizes with category filters, build-your-own set |
| `/combos`, `/combos/[slug]` | Combos by collection, combo detail (contents in order, prices), Build Your Own Combo |
| `/shop` | Shop All with filters (category, type, price, size, availability, customizable, travel size) and sorting; results stay grouped by category |
| `/shop/body` | New Body department (Skin is now face-only) |
| `/shop/[dept]` | + ingredient notes, featured routines, travel sizes, category FAQs, customization CTA, breaker |
| `/product/[slug]` | 14 sections: gallery, info (full/travel size switch), overview, ingredients, how to use, who might prefer it, texture, make it yours, try a sample, complete the routine, combos, FAQs, reviews, related |
| `/about` | Founders' story ("Four people. One idea."), philosophy, approach, transparency, customization, sampling, vision |
| `/guides/customization`, `/guides/sampling`, `/guides/product-care` | Discover guides linked from the footer |
| `/cancellation` | New cancellation policy (structured draft) |
| `/account?tab=routines` | Saved routines, saved customizations and customization requests (this browser only) |
| `/customized-skincare` | Permanently redirects to `/make-it-yours/face` (the earlier skin-only consultation was replaced; its components remain in `components/consultation/`) |

### How personalization works
- **Consultations** — `lib/customize/flows.ts` holds every question, option, follow-up and condition. Lip, body, hair, face and makeup questions are different; options that depend on earlier answers (e.g. lip finishes per product, coverage only for complexion products) are functions of the answers. "Ingredients to avoid" and price bands are generated from the catalogue, so they only show what CO2 actually sells.
- **Recommendations** — `lib/customize/recommend.ts` is deterministic. It scores real catalogue products against the answers and returns a routine, the reason for each pick (marked **From product info** vs **Matches your preference**), products left out because of an avoided ingredient, and made-to-order suggestions with the builder pre-filled. It never invents products or claims and labels results as a recommendation, not a formulation.
- **Builder** — `data/customize.ts` lists every customizable product:
  - *Listed* made-to-order formulas (catalogue price) go through the normal bag and checkout. Their formula options come from `custom.options` in `data/products.ts`; packaging choices are validated and priced server-side (`lib/cart.ts`).
  - *On-request* formulas (body lotion, body oil, body wash, face cleanser, shampoo, conditioner, hair oil, lip balm) have no price, so they are submitted to `POST /api/customize/request` and shown as **pending confirmation** — never as an order.
  - Only containers, colours and caps listed for a product are offered. All packaging surcharges are `0` ("Included") — change them in `data/customize.ts`.
- **3D preview** — `components/miy/PackagingViewer.tsx` models each container procedurally with three.js (dropper, airless, pump, jar, tube, compact, twist-up case, flip-top bottle), with drag-to-rotate, zoom and reset, label placement and the chosen colours. It is labelled as an illustration of the container style, not a photo, falls back to a flat illustration without WebGL, and doesn't auto-spin with reduced motion.
- **Persistence** — drafts, results, saved routines, saved builds and request receipts are stored in `localStorage` (`lib/customize/store.ts`). This is a convenience, not a customer database.

### Sampling, combos and cart
- `data/sampling.ts` — travel sizes (35 products), curated sets, limits and shipping copy. Set price = sum of samples; samples are never called free or credited to a full size.
- `data/combos.ts` — 12 combos from real products, priced at the sum of their items (no invented savings). Made-to-order combos route to the builder.
- Cart lines can carry `size: "sample"` and a `bundle` label. The server prices samples from `data/sampling.ts`, caps sample quantity (`maxQtyPerSample`), rejects samples that aren't offered, keeps only valid packaging values and sanitises label names.

### Honesty rules applied
No fabricated reviews, ratings, testimonials, certifications, cruelty-free/authenticity claims, savings or founder details. Trust items only use things the project backs (free-shipping threshold, Razorpay/UPI, returns window, WhatsApp number). Reply-time promises were removed. Newsletter, contact, review and request forms only report success when the server stored or forwarded the submission; the newsletter needs explicit consent. Product reviews submitted from product pages are sent to the team for moderation (via the contact endpoint) instead of being kept only in the browser.

### Video
`public/video/` — a brand film rendered by `scripts/make-brand-film.py` from the real product cut-outs (16:9 + 4:5 + posters). Autoplays muted/looped only on screen, honours reduced motion, has a pause button and a poster fallback. Brief for commissioned footage: **`docs/VIDEO-ASSETS.md`**.

### Configuration you still need to supply
| Item | Where |
|---|---|
| **Confirm or replace the draft travel-size sizes and prices** (they show on the site as written) | `data/sampling.ts` (`pricingStatus`) |
| Packaging surcharges, if any (currently 0 = included) | `data/customize.ts` |
| Which on-request formulas CO2 can really make (remove any that aren't feasible) | `data/customize.ts` → `buildProducts` |
| Whether names on labels are offered | `labelPersonalisation` in `data/customize.ts` |
| Real Instagram / Facebook / YouTube / Pinterest URLs (hidden until set) | `data/site.ts` → `social` |
| Customer-care phone if different from the current one (email is now dev@demigodhouse.com) | `data/site.ts` → `contact` |
| Founder names, roles and photos | `founders` in `app/about/page.tsx` |
| Policy details still to confirm — listed in each page's `confirm` prop and shown in an internal note **only in development** (`npm run dev`), never in the production build | `/shipping`, `/returns`, `/cancellation`, `/privacy`, `/terms` |
| Full INCI ingredient lists, expiry/PAO, texture photography | product data (pages say these are not on the website yet) |
| Razorpay keys (card/UPI checkout) — UPI QR works without them | `.env.local` (see §3/§4) |
| `FORMS_WEBHOOK_URL` and/or WhatsApp Cloud API vars to receive newsletter, contact and customization requests outside the server's `.data` folder | `.env.local` |
| A database for orders and requests on serverless hosts | `lib/orders.ts`, `lib/forms.ts` (§5) |
| Real customer reviews (stars appear automatically once `rating`/`reviews` are filled) | `data/products.ts` |

### Testing done for this redesign (production build, Playwright/Chromium)
- `next build` passes; `tsc` strict passes; `npm run check` and `npm run check:config` pass.
- Crawl of 20 key pages + all 168 internal links found on them → no 4xx/5xx, no broken images, no console errors; no horizontal overflow at 390 px and 1440 px.
- All five consultations completed end to end (10 / 11 / 10 / 12 / 10 questions with conditions), each reaching its own results page with no errors; face and lip questionnaires confirmed different; results show routine before any purchase.
- Builder: listed formula with pre-fill → packaging change → label → add to bag (options stored on the line); on-request body lotion → validation → submit → "pending confirmation" with reference; 3D viewer rendered (SwiftShader WebGL).
- Server pricing via `POST /api/orders`: sample priced from config and capped at 3, non-sample product rejected as a sample, incompatible packaging dropped, unknown options stripped, label sanitised.
- Travel size from the product page, sample set builder, combo add, Build Your Own Combo, cart subtotal, Shop All filters via URL, Body "customizable" filter, mega menus, mobile menu, WhatsApp link, Try Sampling float (and that both floats sit above the mobile buy bar), newsletter consent + success.

**Not tested:** real devices/Safari/Firefox, physical GPUs for the 3D viewer, Razorpay with live keys, WhatsApp Cloud API and form webhooks with real credentials.

---

## 0. October 2026 redesign — what changed and how it works

> Note: since §00, Skin is face-only and Body is its own department (`/shop/body`); old `/shop/body-care`-style URLs redirect into Body.

### Run it
```bash
npm install
cp .env.example .env.local   # optional — the site runs without keys
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```
No new environment variables were added.

### Category-led structure
| Route | What it shows | Filters |
|---|---|---|
| `/shop/skin` | Face + body care (42) | Skin concern · Face/Body · Product type · Skin type · Key ingredient · Price · Availability · Bestsellers |
| `/shop/hair` | Haircare & grooming (9) | Hair concern · Product type · Key ingredient · Price · Availability · Bestsellers |
| `/shop/makeup` | Lip gloss + made-to-order foundation, skin tint, blush, lip colour (7) | Product type · Shade · Finish · Price · Availability |
| `/shop/lips` | Lip gloss + made-to-order lip colour (4) + **Try It On** | Shade · Product type · Finish · Price · Availability |
| `/shop/bestsellers` | Bestsellers, one section per department | — |
| `/shop/made-personal` | Made-to-order formulas, split into skincare / makeup | — |
| `/shop` | Category directory (one row per department) | — |
| `/search?q=` | Search results grouped by department | — |

- **Skin, hair and lip products never share a grid** — listing pages, bestsellers, search, collections and related products are all scoped or grouped by department.
- **Concerns** (`data/taxonomy.ts`): Skin — Acne & Blemishes, Oily Skin, Dryness & Hydration, Dullness & Glow, Uneven Skin Tone, Skin Texture, Anti-Aging & Firming (pack text of Renew Firming Cream), Sensitive Skin. Hair — Dandruff & Flakes, Scalp Care, Dry & Damaged Hair, Hair Hydration, Frizz Control. Every assignment is based on the pack text / benefits / ingredients in `data/products.ts`.
- **Deliberately not created** (the catalogue doesn't support them): Dark Spots & Pigmentation as a separate concern (folded into Uneven Skin Tone — no product claims spot correction), Hair Fall, Hair Growth, Hair Repair, Eye Makeup, Lip Stains / Lip Tints / Lipsticks as retail lines, New Arrivals (no launch dates in the data) and Offers (no discounted prices; the real offers — free shipping over ₹999 and `WELCOME10` — are in the announcement bar). Add products and these appear automatically.
- Filters are multi-select (OR inside a group, AND across groups), show live counts, have removable pills and **Reset all**, and are synced to the URL (`/shop/skin?concern=acne-blemishes&area=face&sort=price-asc`). Sorting: Recommended, Bestselling, Price low→high, Price high→low, Newest, Name.
- Earlier URLs (`/shop/face`, `/shop/cleansers`, `/shop/scalp` …) still work and open the right department with filters pre-selected.
- To change concerns, product types or which products appear under them, edit `data/taxonomy.ts` (`productConcerns`, `productFormat`, `departments`).

### Product images — never cropped
`components/ui/ProductImage.tsx` now renders every product photograph with `object-fit: contain` inside a consistent square frame, with no hover zoom/scale. The same rule was applied to every product photo on the site (cards, gallery, thumbnails, quick view, cart, checkout, search, mega menu, homepage, consultation, collections, about). The product-page magnifier is now click-to-zoom (default view is always the whole product). Lifestyle/campaign portraits may use `cover`; product packaging never does. An automated check (see §0 Testing) confirms every `/products/` image is `contain` and unscaled at 1440, 820 and 390 px.

*Source-photo note:* in a few supplied photos the small secondary jar at the right edge was already cut off by the original framing (e.g. Scalp Clear Hair Oil, Noir Charcoal Mask, Lavender Santal Body Wash). The site shows those photos in full; re-shoot or re-export them with more margin to fix it at the source. The main product is complete in every photo.

### Virtual lip try-on
- "Try It On" buttons: lip product pages, product cards in Lips/Makeup, `/shop/lips`, homepage lip collection and try-on section.
- **Camera**: standard browser permission prompt → live mirrored preview; the colour follows the lips as you move. **Photo**: upload a front-facing photo. Shade panel (3 retail gloss shades + 6 indicative made-to-order colour families), intensity slider, before/after divider, start/stop camera, reset, close, clear selected-shade label, Add to bag. The chosen shade is remembered when you close and reopen.
- **Technology**: Google MediaPipe Face Mesh (Apache-2.0, 468 landmarks + refined lips), shipped inside the project at `public/mediapipe/face_mesh/` (~16 MB, loaded only when try-on opens). Outer lip contour minus the inner mouth contour → teeth and skin stay untouched; feathered edge; per-pixel colour using the lip's own luminance keeps texture and highlights; gloss shades add a specular sheen. Code: `lib/tryon/lips.ts`, `components/tryon/`.
- **Why Face Mesh and not the newer Face Landmarker**: the newer `@mediapipe/tasks-vision` needs a `face_landmarker.task` model downloaded from Google's storage, which the build environment could not reach. Face Mesh bundles its model in its npm package, so the feature works with no external service. Swapping to Face Landmarker later is a contained change in `createFaceMesh()`.
- **Privacy**: all processing happens in the browser. Frames and photos are never uploaded, stored or logged; closing the dialog stops the camera and discards the photo. No third-party service is involved.
- **Requirements**: camera needs **HTTPS** (or `localhost`). Clear messages are shown for: insecure page, unsupported browser, permission denied, no camera, camera busy, and "no lips found" in a photo.
- **Limits**: it's a cosmetic preview — accuracy drops with strong side profiles, hands over the mouth, very low light or heavy motion blur; colour on screen varies with the display.

### Beauty portraits (hero + lip section)
Image generation was **not available** in the build environment, so the two AI portraits were **not generated** and none are faked. Both slots are built: `hero-model` and `lip-model` scenes in `data/campaign.ts`, with full prompts in **`docs/AI-PORTRAIT-PROMPTS.md`**. Until a portrait is approved, the hero shows the real 24K Gold Face Elixir photograph and the lip section the real Chocolate Dream photograph. Generate → review → approve (`npx tsx scripts/generate-campaign.ts --approve hero-model`), or drop in a file as described in `public/characters/README.txt`; the homepage switches automatically. The old illustrated Muse is no longer used on the homepage (the component files remain in `components/face-hero/`).

### Homepage
Announcement bar → navigation → hero (portrait #1) → Shop by category → Shop by concern (Skin / Hair tabs) → Bestsellers & favourites (Skin / Hair / Lips tabs) → Featured skincare → Featured haircare → Lip collection (portrait #2) → Virtual try-on → Customized Skincare → Brand philosophy → Newsletter → Footer. Customer reviews are not shown because no real reviews exist yet (ratings appear automatically once they do).

### Checkout and payments
Unchanged: Razorpay (server-side order creation and signature verification, secret never in the browser) and the DemiGod House LLP UPI QR flow (§4). Razorpay card/UPI checkout needs `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`; without them the UPI QR option works and orders are recorded as pending verification. No payment is simulated.

### Testing done for this redesign
On a production build (`next build && next start`) with Playwright/Chromium:
- 98 internal links + all 58 product pages + 14 legacy URLs → 200.
- Each department grid contains exactly its own products (42 / 9 / 7 / 4).
- Concern filter, multi-select, cross-group combination, pill removal, reset, price sort both ways, URL-preset filters (hair dandruff, lip shade); lips page shows shade/finish filters and no skin concern; skin page shows no shade filter.
- Search overlay groups by department; search by shade ("berry") and by concern ("acne").
- Add to bag from card and from product page with quantity, selected shade shown in the cart, subtotal and quantity updates, remove item.
- Every product photo is `object-fit: contain` and unscaled; no horizontal overflow; no console errors — on 16 pages at 1440, 820 and 390 px.
- Desktop mega menu and mobile menu.
- Try-on: photo upload on real face photos (lips coloured, teeth and skin untouched, shade switching, before/after); live camera using Chromium's fake camera device fed with a face video (tracking + shade change + stop camera releases the stream); permission-denied message; "no lips found" message.

**Not tested:** a physical camera on a real phone/laptop (only the emulated camera), Safari/iOS and Firefox, Razorpay with real keys, the AI image generation step (no provider access), and the optional Anthropic consultation AI with a real key.

## 1. Project structure

```
co2/
├── app/
│   ├── page.tsx                    Homepage (sections 01–12)
│   ├── layout.tsx                  Root layout, metadata, Organization JSON-LD
│   ├── template.tsx                Page transition
│   ├── shop/page.tsx               Full catalogue
│   ├── shop/[category]/page.tsx    /shop/face, /shop/cleansers … (categories AND product types)
│   ├── product/[slug]/page.tsx     58 statically generated product pages
│   ├── collections/                Overview + 10 collection pages
│   ├── about · ingredients · contact · faq · shipping · returns · privacy · terms
│   ├── customized-skincare/        Consultation + /results (README §10)
│   ├── cart · checkout · account · wishlist
│   ├── order/[id]/page.tsx         Order confirmation
│   ├── sitemap.ts · robots.ts · not-found.tsx · error.tsx · loading.tsx
│   └── api/
│       ├── razorpay/config         GET  — public key id + whether Razorpay is enabled
│       ├── orders                  POST — create order (server-side pricing)
│       ├── orders/[id]             GET  — order lookup (?email= must match)
│       ├── payments/verify         POST — verify Razorpay signature → mark paid → notify
│       ├── payments/failed         POST — record failed attempt
│       ├── payments/upi            POST — UPI QR reference (UTR) → notify admin
│       ├── payments/webhook        POST — Razorpay webhook (safety net)
│       ├── newsletter · contact    POST — form submissions
│       ├── ai/status               GET  — which AI features are configured (booleans only)
│       └── consultation/           POST recommend · ask · photo (README §10)
├── components/
│   ├── consultation/               Flow, question inputs, results, assistant, product fit
│   ├── face-hero/                  Muse.tsx (illustrated character) + FaceHero.tsx + CampaignHero.tsx
│   ├── sections/                   Homepage sections, newsletter, contact form, ingredient library
│   ├── navbar/ · footer/ · hero/   Navigation, mega-menu, mobile menu, page heroes
│   ├── product-card/ · product-gallery/ · product-details/   Cards, gallery + zoom, purchase box,
│   │                               quick view, compare, sticky buy bar, reviews, routine, bundles
│   ├── cart/ · checkout/ · account/ · filters/ · search/
│   ├── animations/                 Reveal, line reveal, scroll-scrubbed words, parallax,
│   │                               magnetic buttons, cursor, intro curtain
│   ├── providers/                  Store (cart, wishlist, compare, overlays) + smooth scroll
│   └── ui/                         Logo, ProductImage/Vessel, primitives, overlay, toaster, JSON-LD
├── data/
│   ├── products.ts                 ← THE CATALOGUE (single source of truth)
│   ├── categories.ts · collections.ts · custom-options.ts · faq.ts · india.ts
│   ├── campaign.ts · campaign-images.json   ← campaign scenes + approved images (README §11)
│   └── site.ts                     ← brand settings (contact, shipping, discounts, campaign images)
├── lib/                            catalog queries, cart pricing, razorpay, orders, notify, forms, validation
│   ├── consultation/               questions, recommendation engine, client store
│   └── ai/                         server-only Anthropic client, guard-rails, rate limit
├── hooks/ · types/ · styles/globals.css (design system) · tailwind.config.ts (tokens)
├── public/
│   ├── products/                   79 product photographs × 2 sizes (640 / 1200 px WebP)
│   ├── campaign/                   19 studio cut-outs used in campaign moments
│   ├── brand/                      Official CO2 logo, favicons, DemiGod House LLP UPI QR
│   └── characters/                 Slot for real campaign photography (see README.txt there)
├── scripts/check-catalog.mjs       Verifies every image / collection reference
└── scripts/generate-campaign.ts    Generates / approves campaign images (README §11)
```

## 2. Setup and running locally

Requirements: Node.js 18.18+ (20 or 22 recommended).

```bash
npm install
cp .env.example .env.local      # fill in what you have; the site runs without keys
npm run dev                     # http://localhost:3000
```

Other scripts:

| Command | Purpose |
|---|---|
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | TypeScript check |
| `npm run check` | Catalogue integrity (images, cut-outs, collection slugs) |

**Without Razorpay keys**, checkout still works through the **UPI QR** option, which uses the supplied DemiGod House LLP QR. The card/UPI option shows as "not activated" until keys are added.

## 3. Environment variables

All variables are listed in `.env.example`. Only `NEXT_PUBLIC_*` values reach the browser.

| Variable | Required | What it does |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes (prod) | Canonical URL used in SEO, sitemap and Open Graph |
| `RAZORPAY_KEY_ID` | for Razorpay | Public key id. The browser gets it from `/api/razorpay/config` |
| `RAZORPAY_KEY_SECRET` | for Razorpay | **Server only.** Used to create orders and verify signatures |
| `RAZORPAY_WEBHOOK_SECRET` | recommended | Verifies `/api/payments/webhook` calls |
| `ORDERS_DIR` | optional | Where the JSON order store lives (default `./.data`) |
| `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `ADMIN_WHATSAPP_NUMBER` | optional | Admin order alerts via WhatsApp Cloud API |
| `ORDER_WEBHOOK_URL` | optional | Sends every paid or UPI order as JSON (Zapier, Make, n8n, Slack, Google Sheets) |
| `FORMS_WEBHOOK_URL` | optional | Forwards newsletter and contact submissions |
| `ANTHROPIC_API_KEY`, `CO2_AI_*` | optional | Customized Skincare AI layer — see §10 |
| `OPENAI_API_KEY`, `CO2_IMAGE_MODEL` | optional | Campaign image generation script only — see §11 |

## 4. Razorpay integration

The Razorpay account is registered under **DemiGod House LLP**.

1. In the Razorpay Dashboard → **Account & Settings → API Keys**, generate keys. Use `rzp_test_…` keys first.
2. Put them in `.env.local` (locally) or your host's environment settings:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   ```
3. Optional but recommended: Dashboard → **Webhooks** → add `https://<your-domain>/api/payments/webhook` with the events `payment.captured`, `payment.failed` and `order.paid`. Set a secret and copy it to `RAZORPAY_WEBHOOK_SECRET`.
4. Restart the server. Checkout now offers "Cards, UPI, net banking & wallets".

How a payment flows:

```
Browser                         Server                                   Razorpay
───────                         ──────                                   ────────
POST /api/orders  ───────────▶  validate fields, re-price from catalogue
                                create order (status "created") ───────▶ orders.create
                  ◀───────────  { orderId, razorpay.orderId, keyId }
open Checkout.js  ─────────────────────────────────────────────────────▶ customer pays
handler(resp)     ───────────▶  POST /api/payments/verify
                                HMAC-SHA256(order_id|payment_id, secret) == signature?
                                → status "paid" → WhatsApp/webhook notification
                  ◀───────────  order → redirect to /order/<id>
                                (webhook marks the order paid if the browser closed early)
```

- Totals are always recomputed on the server from `data/products.ts`. Prices sent by the browser are ignored.
- The secret never leaves the server: `lib/razorpay.ts` imports `server-only`.
- If a payment fails or the window is closed, the customer sees a clear message, the bag stays intact, and they can retry or switch to UPI QR.
- Test cards and UPI ids for test mode are in Razorpay's documentation.
- Go live by swapping in the `rzp_live_…` keys.

### UPI QR (no gateway)

The customer scans the DemiGod House LLP QR and enters the UTR. The order is saved as **pending verification**, and the admin is notified with the reference. The confirmation page tells the customer the order is confirmed once the payment is matched.

## 5. Orders and notifications

- **Order store**: `lib/orders.ts` writes to `ORDERS_DIR/orders.json`. This is right for a VPS, Docker or Render with a persistent disk.
- **Serverless hosts** (Vercel, Netlify) have a temporary filesystem, so replace `saveOrder` / `getOrder` / `updateOrder` with your database (Supabase, Postgres, Firestore…). Nothing else needs to change. The confirmation page also falls back to the copy saved in the customer's browser.
- **Each order records**: order id (`CO2-YYMMDD-XXXXXX`), customer name, email, phone, shipping address, items with quantity, shade and formula options, subtotal, discount, shipping, total, payment method and status, Razorpay ids or UPI reference, and dates.
- **Admin notification** (`lib/notify.ts`), sent on a verified payment or a submitted UPI reference:
  ```
  🛍️ New CO2 order CO2-261008-9QZ5VU
  Customer: … Phone: … Email: … City: …
  • Gloss Berry Rubin (Berry Rubin) × 2 — ₹1,300
  Total: ₹2,835   Payment: PAID ✅ · pay_…
  ```
  For WhatsApp, the Meta WhatsApp Cloud API needs a business number. For any other channel, use `ORDER_WEBHOOK_URL`.

## 6. Adding or updating products

Everything lives in **`data/products.ts`**, one object per product:

```ts
{
  id: "co2-059", slug: "new-product", name: "New Product", subtitle: "…",
  category: "face" | "body" | "hair" | "lips" | "made-personal",
  type: "cleansers" | "treatments" | "masks" | "moisturizers" | "body-care" | … ,
  shortDescription, description, lede, story: [],
  benefits: [{ title, text }], ingredients: [{ name, note }], keyIngredients: [],
  howToUse: [], size: "100 ml", price: 590, compareAtPrice: null,
  images: ["new-product-1", "new-product-2"],   // files in /public/products
  cutout: null,                                 // or a slug in /public/campaign
  availability: "in-stock", rating: null, reviewCount: 0, reviews: [],
  tags: [], badge: null, skinTypes: [], texture, finish, forWho,
  specs: [{ label, value }], shades: [],         // shades: [{ name, hex }] for colour products
  bestSeller: false, featured: false, custom: null, order: 59
}
```

1. Add the photographs as `public/products/<key>-640.webp` and `<key>-1200.webp` (square works best). Any image tool can export WebP. Square 1200 px is ideal.
2. Add the product object. It automatically appears in the shop, category and type pages, search, the homepage shelf, the sitemap, and gets its own page.
3. Optional: add it to a collection in `data/collections.ts`, or set `featured` / `bestSeller`.
4. Run `npm run check`.

- **Prices**: edit the `price` field.
- **Ratings** stay `null` until real reviews exist; stars and the rating filter appear automatically once they do.
- **Shipping threshold, fee and discount codes** are in `data/site.ts`. The starter code is `WELCOME10`.

## 7. Campaign character

No model photography was supplied, so the site uses the **CO2 Muse**, an original illustrated sculptural profile (`components/face-hero/Muse.tsx`). It doesn't depict a real person or imply a model identity.

To replace it with photorealistic images of people using CO2 products (AI-generated from the real product photos, or real photography), see **§11**. Approved images replace the Muse automatically. The older transparent-cut-out option (`site.campaign.heroCharacter` / `glossCharacter`, `public/characters/README.txt`) still works.

## 8. Deployment

**Vercel**
1. Push the folder to a Git repo and import it in Vercel.
2. Add the environment variables, then deploy.
3. Swap the order store for a database (see §5).

**VPS / Docker / Render / Railway**
```bash
npm ci && npm run build
ORDERS_DIR=/var/lib/co2 NODE_ENV=production npm start   # port 3000; put Nginx/Caddy in front for HTTPS
```

Point `NEXT_PUBLIC_SITE_URL` at the final domain and register the Razorpay webhook URL.

Images are served pre-optimised by a custom loader (`lib/image-loader.ts`). No image service is needed, and `/products`, `/campaign` and `/brand` get immutable cache headers.

## 9. Final QA checklist

Verified in this build:

- [x] **All 58 products present**: 52 photographed (79 photos) and 6 made-to-order. `npm run check` passes.
- [x] **All 58 product pages built** statically, with unique metadata and Product + Breadcrumb JSON-LD.
- [x] **Routes return 200**: every route in the brief plus `/order/[id]`. 404 page works.
- [x] **No errors**: no console errors, broken images or horizontal overflow on 19 pages at 1440 px and 390 px.
- [x] **Search, filters and sort**: overlay and shop search (name, category, ingredient, skin type), all filters, sorting, URL-synced views.
- [x] **Cart**: add, remove, quantity, discount code, free-shipping progress, persists across reloads and tabs.
- [x] **Checkout and UPI**: validation, UPI QR flow, order saved, admin notification text, confirmation page, account order history.
- [x] **Razorpay security** (tested on a production build with test secrets):
  - a valid signature marks the order paid;
  - a forged signature is rejected without changing the order;
  - the webhook signature is checked;
  - order lookup needs a matching email.
- [x] **Build**: TypeScript strict, `next build` passes, no secrets in client bundles.
- [x] **Accessibility**: skip link, focus states, labelled controls, dialogs with focus trap and Esc, `prefers-reduced-motion`.
- [x] **SEO**: per-page metadata, Open Graph, sitemap, robots, FAQ JSON-LD.

Before launch:

- [ ] Confirm the customer-care email, phone and Instagram handle in `data/site.ts` (marked TODO).
- [ ] Confirm prices, the `bestSeller` / `featured` picks and the `WELCOME10` discount.
- [ ] Have the shipping, returns, privacy and terms templates reviewed for DemiGod House LLP.
- [ ] Add live Razorpay keys and the webhook, then run one real ₹1 test order.
- [ ] Choose the order store for your host (§5) and set up WhatsApp or webhook notifications.
- [ ] Note that one supplied photograph (Sandal Glow Herbal Bar) shows "[EXACT CO2 LOGO]" placeholder text printed on the pack. Replace the photo when a final one is available.

## 10. Customized Skincare

> **Superseded (Oct 2026):** the skin consultation below was replaced by the five Make It Yours consultations (§00). `/customized-skincare` now redirects to `/make-it-yours/face`. The components, AI routes and engine described here are kept in the codebase for reference and re-use.

**Route:** `/customized-skincare` (consultation) → `/customized-skincare/results`. It's in the main navigation (desktop pill, mobile menu card), the footer, the homepage hero and §03, and on every product page.

### How it works

```
questions.ts ── answers (saved on this device as you go)
                    │
engine.ts ──────────┤  deterministic, always runs (browser + server)
                    │  • resolves skin type ("Not sure" → after-cleansing answer)
                    │  • scores every product from data/products.ts:
                    │    skinTypes, printed ingredients + notes, benefits,
                    │    texture, aromatic ingredients, price, howToUse timing
                    │  • excludes "avoid" ingredients, scrubs for very sensitive skin
                    │  • builds morning / evening / weekly / body / hair / lips
                    │  • pre-fills a made-to-order serum or moisturizer
                    │  • writes the limitations (no CO2 SPF, cosmetic not medical…)
                    ▼
results page ── optional AI layer: POST /api/consultation/recommend
                 Claude writes the intro, per-product explanations and tips
                 for the products the engine chose. It cannot add or swap products.
```

- **Questions** (`lib/consultation/questions.ts`): adapted from the original CO2 consultation — chapters, one question per screen, auto-advance on single choice, number-key shortcuts, review screen with Edit, answers kept on the device. Edit the wording or options there; the engine reads the option ids.
- **Every "why" line** quotes or paraphrases the pack data in `data/products.ts`. If you change a product's ingredients, benefits or skin types, its recommendations change with it.
- **Cart**: uses the existing store (`addToCart`). "Add routine to cart" adds every product; gloss is added in its shade; the made-to-order formula is added with its options, which `lib/cart.ts` already validates on the server.
- **Product pages**: a "Why this may suit you" box (same engine), "Add to my routine", and made-to-order options pre-filled from the consultation.
- **No account needed.** Results live in `localStorage` (`co2.consult.v1`, `co2.consult.result.v1`).

### AI configuration

| Variable | Required | What it does |
|---|---|---|
| `ANTHROPIC_API_KEY` | for AI | Server-only. Enables AI explanations and the "Ask about your routine" assistant |
| `CO2_AI_MODEL` | optional | Default `claude-sonnet-5-5` |
| `CO2_AI_ENABLED` | optional | `false` switches AI off without removing the key |
| `CO2_AI_PHOTO_ANALYSIS` | optional | `true` enables photo-based suggestions for the skin-type and concerns questions. Off by default |
| `CO2_AI_TIMEOUT_MS` | optional | Default 25000 |

Endpoints: `GET /api/ai/status` (booleans only, never the key) · `POST /api/consultation/recommend` · `POST /api/consultation/ask` · `POST /api/consultation/photo`.

**Safety and honesty rules in code:**
- Answers are whitelisted against the question options on the server (`sanitizeAnswers`).
- The model gets only catalogue facts. Its output is parsed as JSON. Product references to anything not in the catalogue are removed. Any explanation containing medical or unsupported claims ("cure", "clinically proven", "anti-ageing", "whitening", named conditions and similar) is dropped, and that product shows its catalogue reasons instead (`lib/ai/guard.ts`).
- The results page always says which layer produced the text: "Matched from CO2's product data" or "written by an AI model (name)". AI explanations carry an "AI" tag.
- If the key is missing, the API is down or a reply fails validation, the page falls back to the catalogue reasons and says so. The assistant says it isn't switched on and points to the contact page.
- Photo suggestions need the customer's tick-box consent. The image is resized in the browser, sent once, and never stored or logged. The customer must confirm before anything is filled in. Update your privacy policy before enabling it.
- Rate limits are in memory per server instance (`lib/ai/rate-limit.ts`). Behind a load balancer, use a shared store. The limiter trusts `x-forwarded-for`, so make sure your proxy sets it.

**Tested** against a local mock of the Messages API (the format follows docs.claude.com): the success path, a blocked claim, an invented product, an unreachable API, rate limiting and the not-configured state. **It has not been tested with a real key** — add one and run a consultation to confirm. `ANTHROPIC_BASE_URL` can point at a proxy or mock.

## 11. Campaign images (people using CO2 products)

No model photography exists yet. The homepage still shows the illustrated Muse, and the "On skin" section uses the real product photographs. Swapping in real-looking campaign images is built in:

1. **Scenes**: `data/campaign.ts` has ten scenes, each one person and one real product: dropper serum, cleanser lather, face cream, charcoal mask, blemish cream, body lotion, beard oil and the three glosses. The people vary in skin tone, age and gender.
2. **Generate** (on your machine; the key never touches the site):
   ```bash
   npx tsx scripts/generate-campaign.ts --dry-run          # see prompts + which product photo is used as reference
   OPENAI_API_KEY=sk-… npm run campaign                    # all scenes
   OPENAI_API_KEY=sk-… npm run campaign -- --only=elixir-dropper
   ```
   Each product's own photo or cut-out is sent as the packaging reference. Images are saved to `public/campaign/people/` with status **review**. The image-edit model name is configurable (`CO2_IMAGE_MODEL`). Check your provider's current model before running.
3. **Review**: check that it's the real product (shape, cap, colour, label not rewritten), that skin and hands look natural, that the person is clearly an adult, and that nothing implies a medical result. Then run:
   ```bash
   npx tsx scripts/generate-campaign.ts --approve elixir-dropper   # or --reject
   npx tsx scripts/generate-campaign.ts --list
   ```
4. **Publish**: rebuild and deploy. An approved `hero` scene replaces the Muse hero, approved `gloss` scenes replace the Muse in the gloss section, and approved `on-skin` scenes replace the product photo in §07. AI-generated images are labelled "AI-generated image" on the page.

Real photography works the same way: put the file in `public/campaign/people/` and add `{ "file": "/campaign/people/x.webp", "status": "approved", "source": "photography" }` under the scene id in `data/campaign-images.json`.
