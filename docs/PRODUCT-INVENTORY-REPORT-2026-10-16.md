# CO2 Cosmetics — product inventory update & audit (16 Oct 2026)

Source of truth: `drive-download-20261016T085801Z-1-001.zip` (66 files: 65 product photographs + `CO2 FInal Logo.png`; the `New Logo CO2/` folder in the ZIP is empty).
Project updated in place: `co2-cosmetics-site-update.zip` (Next.js 15). Every Drive photograph was opened and identified from the text printed on the pack, not from its filename.

---

## 1. Summary

| | Count |
|---|---|
| Product photographs in the Drive ZIP | 65 (+1 logo file) |
| Distinct products / pack presentations in the Drive ZIP | 64 (Chocolate Dream gloss has 2 photos) |
| Excluded by the brief (Section 7) | 4 |
| Lip shades in Drive not added (Makeup instruction — see §6) | 6 |
| **Products on the final website** | **52** (the 3 lipstick shades are one "Lipstick" product with 3 shades) |
| Already on the site with the correct image — unchanged | 29 |
| Already on the site — image replaced | 1 (Beetroot Soap) |
| Added from the Drive ZIP | 22 |
| Unauthorized products removed from the old site (not in Drive) | 20 |
| Specifically excluded products removed | 4 (+ "Chocolate Face Wash" and "Foot No." resolved — see §5) |
| "Empty bottle" made-to-order cards removed from the catalogue | 6 |
| Duplicate listings found | 0 |
| Authorized products with no usable image | 0 |

Arithmetic: 64 Drive products − 4 excluded − 6 lip shades held back = 54 photographed products → 52 catalogue entries (3 lipstick shades = 1 product).

---

## 2. Drive-to-website comparison (product by product)

Website names: products that were already on the site keep their existing website name (e.g. pack "Charcoal Face Wash" = site "Noir Charcoal Face Wash"); new products use the name printed on the pack. "Image" = file in `public/products/` (`-640.webp` and `-1200.webp`).

### Skincare (14)

| # | Pack name (Drive file) | Website product | On old site? | Image action | Section |
|---|---|---|---|---|---|
| 1 | 24K Gold Serum — face serum, dropper (`24K Gold Serum.png`) | 24K Gold Face Elixir | Yes | Unchanged (correct) | Serums & treatments |
| 2 | Acne & Pimple Cream, Face Care — aloe, neem, tulasi, turmeric (`Acne n Pimple CreamFace Care.jpg`) | Clarité Botanical Cream | Yes | Unchanged | Serums & treatments |
| 3 | No Marks Cream (`No Marks Cream.jpg`) | No Marks Cream | No | **Added** | Serums & treatments |
| 4 | Aloe Neem Face Wash — green, aloe/neem/cucumber/rose, 100 ml (`aloe neem face wash.jpg`) | Neem Rose Face Wash | Yes | Unchanged | Face wash & cleansers |
| 5 | Charcoal Face Wash (`Charcoal Face WashFace Care Products.jpg`) | Noir Charcoal Face Wash | Yes | Unchanged | Face wash & cleansers |
| 6 | Red Grapes Face Wash (`Red Grapes Face Wash.jpg`) | Red Grapes Face Wash | No | **Added** | Face wash & cleansers |
| 7 | Milk Cleanser (`Milk Cleanser.jpg`) | Milk Cleanser | No | **Added** | Face wash & cleansers |
| 8 | Anti-Aging Cream (`Anti-Aging Cream Face Care Products.jpg`) | Renew Firming Cream | Yes | Unchanged | Face creams & moisturizers |
| 9 | Moisturizing Cream with SPF (`Moisturizing Cream with SPF.jpg`) | Moisturizing Cream with SPF | No | **Added** | Face creams & moisturizers |
| 10 | Night Cream (`Night Cream.jpg`) | Night Cream | No | **Added** | Face creams & moisturizers |
| 11 | Sunscreen Lotion SPF 50+ (`Sunscreen Lotion (SPF 50+).jpg`) | Sunscreen Lotion SPF 50+ | No | **Added** | Sun protection (new section) |
| 12 | Charcoal Face Mask (`Charcoal Face MaskFace Care Products.jpg`) | Noir Charcoal Mask | Yes | Unchanged | Masks & scrubs |
| 13 | Multhani Mitti Face Mask (`Multhani Mitti Face Mask.jpg`) | Multhani Mitti Face Mask | No | **Added** | Masks & scrubs |
| 14 | Herbal Scrub (`Herbal Scrub.jpg`) | Herbal Scrub | No | **Added** | Masks & scrubs ⚑ |

### Hair Care (9)

| # | Pack name (Drive file) | Website product | On old site? | Image action | Section |
|---|---|---|---|---|---|
| 15 | Aloe Vera Shampoo (`Aloe Vera Shampoo.jpg`) | Aloe Nourish Shampoo | Yes | Unchanged | Shampoos |
| 16 | Anti Dandruff Shampoo (`Anti Dandruff Shampoo.jpg`) | Scalp Clear Shampoo | Yes | Unchanged — **moved** from "Scalp care" into Shampoos | Shampoos |
| 17 | Onion Shampoo (`Onion Shampoo.jpg`) | Onion Shampoo | No | **Added** | Shampoos |
| 18 | Shampoo – Herbal (`Shampoo - Herbal.jpg`) | Shampoo – Herbal | No | **Added** | Shampoos |
| 19 | Shikaikah Shampoo (`Shikaiah Shampoo.jpg`) | Shikaikah Shampoo (spelling as printed) | No | **Added** | Shampoos |
| 20 | Anti-Dandruff Hair Oil (`Anti-Dandruff Hair Oil.jpg`) | Scalp Clear Hair Oil | Yes | Unchanged — **moved** into Hair oils | Hair oils |
| 21 | Onion Hair Oil, 100 ml & 200 ml (`Onion Hair Oil.jpg`) | Onion Hair Oil | No | **Added** | Hair oils |
| 22 | Anti Dandruff Gel (`Anti Dandruff Gel.jpg`) | Scalp Clear Treatment Gel | Yes | Unchanged | Scalp treatments |
| 23 | Beard Oil (`beard oil.jpg`) | Groom Beard Oil | Yes | Unchanged | Beard care |

No conditioner exists in the Drive inventory, so there is no conditioner section.

### Body Care (25)

| # | Pack name (Drive file) | Website product | On old site? | Image action | Section |
|---|---|---|---|---|---|
| 24 | Body Moisturizing Lotion – Aloe Fresh | Aloe Veil Body Lotion | Yes | Unchanged | Lotions, creams & gels |
| 25 | Body Moisturizing Lotion – Coco Glow | Coco Glow Body Lotion | Yes | Unchanged | Lotions, creams & gels |
| 26 | Body Moisturizing Lotion – Herbal | Tulasi Balance Body Lotion | Yes | Unchanged | Lotions, creams & gels |
| 27 | Brightening & Lightening Lotion | Lumière Even-Tone Lotion | Yes | Unchanged | Lotions, creams & gels |
| 28 | Calamine Lotion | Calamine Calm Lotion | Yes | Unchanged | Lotions, creams & gels |
| 29 | Breast Cream | Décolleté Nourishing Cream | Yes | Unchanged | Lotions, creams & gels |
| 30 | Aloe Vera Gel | Aloe Pure Gel | Yes | Unchanged | Lotions, creams & gels |
| 31 | Stretch Marks Gel | Stretch Marks Gel | No | **Added** | Lotions, creams & gels |
| 32 | White Petroleum Jelly (100 g + 50 g jars) | White Petroleum Jelly | No | **Added** | Lotions, creams & gels |
| 33 | Body Wash (Lavender, Sandal & Mint) | Lavender Santal Body Wash | Yes | Unchanged | Body wash & shower gel |
| 34 | Shower Gel | Shower Gel | No | **Added** | Body wash & shower gel |
| 35 | Herbal Soap – Aloe Vera | Aloe Vera Herbal Bar | Yes | Unchanged | Body soaps |
| 36 | Herbal Soap – Lemon Zest | Lemon Zest Herbal Bar | Yes | Unchanged | Body soaps |
| 37 | Herbal Soap – Mint Cool | Mint Cool Herbal Bar | Yes | Unchanged | Body soaps |
| 38 | Herbal Soap – Neem Purify (100 g) | Neem Purify Herbal Bar | Yes | Unchanged | Body soaps |
| 39 | Herbal Soap – Sandal Glow (100 g) | Sandal Glow Herbal Bar | Yes | Unchanged | Body soaps |
| 40 | Herbal Soap – Goat Milk (`Goat Milk Soap.jpg`) | Goat Milk Herbal Bar | Yes | Unchanged | Body soaps |
| 41 | Beetroot Soap | Beetroot Soap | Yes | **Replaced** (old pack logo + corner stamp → official logo on the lid; `beetroot-soap-2`) | Body soaps |
| 42 | Kumkumadi Soap | Kumkumadi Soap | No | **Added** | Body soaps |
| 43 | Herbal Soap – Neem Soap (75 g) | Neem Soap | No | **Added** | Body soaps |
| 44 | Papaya Soap | Papaya Soap | No | **Added** | Body soaps |
| 45 | Red Wine Soap | Red Wine Soap | No | **Added** | Body soaps |
| 46 | Herbal Soap – Sandal Soap (75 g) | Sandal Soap | No | **Added** | Body soaps |
| 47 | Herbal Soap – Sunni Pindi Soap | Sunni Pindi Soap | No | **Added** | Body soaps |
| 48 | Turmeric Soap | Turmeric Soap | No | **Added** | Body soaps |

Neem Soap (75 g; neem, coconut oil, glycerin) and Neem Purify Herbal Bar (100 g; neem extract, glycerin, vitamin E, coconut oil, peppermint) are different packs with different weights and ingredients, so both are listed. The same applies to Sandal Soap (75 g) and Sandal Glow Herbal Bar (100 g).

### Lips (4 products, 6 shades)

| # | Pack name (Drive file) | Website product | On old site? | Image action |
|---|---|---|---|---|
| 49 | Lip Gloss – Berry Rubin | Gloss Berry Rubin | Yes | Unchanged |
| 50 | Lip Gloss – Burgundy Spirit | Gloss Burgundy Spirit | Yes | Unchanged |
| 51 | Lip Gloss – Chocolate Dream (2 photos) | Gloss Chocolate Dream | Yes | Unchanged (2 views of one product) |
| 52 | Lipstick – Secret Rose / Coral Crush / Chocolate Dream | Lipstick (3 shades) | Yes | Unchanged ⚑ |

### Excluded by the brief (not on the website)

| Drive file | Product | Old site name | Result |
|---|---|---|---|
| `Acne n Pimple Cream.jpg` | Acne n Pimple Cream — salicylic acid, niacinamide, tea tree, aloe vera | Clarité Blemish Cream | **Removed** (listing, page, image, collections, combos, sample set, concern tile, campaign scene). URL now 404 |
| `Aloe Neem Facewash.jpg` | Aloe Neem Face Wash — aloe vera gel, neem extract, tea tree oil, vitamin E (50 g) | Neem Clarity Face Wash | **Removed** everywhere; cut-out deleted. URL 404 |
| `anti dandruff jelly.jpg` | Anti Dandruff Jelly | Scalp Clear Jelly | **Removed** everywhere. URL 404. The "four-step Scalp Clear system" is now a three-step anti-dandruff routine |
| `24 k glod serum.jpg` | 24K Gold Serum Body Care — round flip-top bottle | 24K Gold Radiance Serum | **Removed** (incorrect bottle). See §5 |

---

## 3. Products removed from the old website that are not in the Drive inventory (20)

Removed from the product data, every grid, search, collections, combos, sample sets, concern tiles, campaign scenes and the brand film. Their images and cut-outs were deleted and their URLs return 404.

Daybreak Cream (Day Cream) · Santal Silk Face Cream (Face Cream) · Saffron Gold Face Wash (Gold Face Wash) · Verde Apple Face Wash (Green Apple) · Tulasi Herbal Face Wash · Espresso Face Wash (Coffee Face Wash) · Dead Sea Mineral Mask · Cacao Velvet Mask (Chocolate Face Mask) · Espresso Polish Scrub (Coffee Scrub Cream) · Serenity Massage Oil (De-Stress Massage Oil) · Verdant Hair & Body Wash · Soft Ritual Gentle Wash · Orchard Rose Hand Wash · Cloud Foaming Hand Wash · Sole Repair Foot Cream (Foot Care Cream) · Goat Milk Glycerine Bar · Noir Charcoal Bar (Charcoal Soap) · Hibiscus Silk Conditioner · Frost Hair Oil (Ice Cool Hair Oil) · Sculpt Styling Gel

Empty "Hands & feet" and "Styling" sections disappeared with them.

## 4. "Empty bottle" made-to-order cards (6) → Customization section

Custom Foundation, Custom Skin Tint, Custom Cream Blush (makeup — deleted with the Makeup section), and Custom Serum, Custom Moisturizer, Custom Lip Colour (moved to `data/custom-formulas.ts`). None of them appears in a product grid, search, collection or the shop any more; their old product URLs open the builder instead. They are offered only on the new **Customize Your Product** page (`/customization`) and in the Make It Yours builder.

---

## 5. Removal confirmation

| Item | Status |
|---|---|
| Makeup section removed | ✅ Navigation, footer, mega menu, home category tile, department page, Makeup consultation (questions + recommender), makeup FAQ, makeup combos and makeup formulas removed. `/shop/makeup` and `/make-it-yours/makeup` redirect to the shop / Make It Yours |
| Empty-bottle samples removed from the catalogue | ✅ All 6 drawn-bottle cards removed from grids, search, collections and combos; `/shop/made-personal` redirects to `/customization` |
| Separate customization section created | ✅ `/customization` ("Customize Your Product") in the main nav, footer, mobile menu and Shop mega menu: container styles, pack colours, cap finishes, made-to-order and on-request formulas with their existing sizes, travel sizes, and a request form (posts to the existing `/api/customize/request`; tested). Only options already in the project are shown — no sizes, prices or materials invented |
| Clarité Blemish Cream removed | ✅ |
| Aloe Neem Face Wash (aloe vera gel, neem, tea tree) removed | ✅ |
| Chocolate Face Wash removed | ✅ No product of that exact name existed. The two chocolate-brown items — Espresso Face Wash ("Coffee Face Wash") and Cacao Velvet Mask ("Chocolate Face Mask") — are both removed; neither is in the Drive ZIP |
| Anti-Dandruff Jelly removed | ✅ |
| Incorrect 24K Gold Serum bottle | ✅ The round flip-top "24K Gold Serum Body Care" presentation is removed. The only serum-bottle photograph in the Drive ZIP is the dropper bottle labelled "Radiance & Rejuvenating **Face** Serum" (24K gold, hyaluronic acid, niacinamide, vitamin E), which is already on the site as 24K Gold Face Elixir under Skincare. Its label and ingredients differ from the body-care serum (grape seed, rice bran, almond, rose oils), so it was **not** reused for a body-care listing |
| Foot No. removed | ✅ Matched to "Sole Repair Foot Cream" (pack: "Foot Care Cream") — the only foot product on the site; removed. It is also not in the Drive ZIP |
| Correct CO2 logo applied | ✅ Website header, footer and favicons already used `CO2 FInal Logo.png` (byte-identical). All 22 new photos and the Beetroot Soap photo were branded on the pack (see §7) |

---

## 6. Needs your decision / could not be matched with full confidence

1. **Lip shades not added (6).** Drive contains Lip Gloss Coral Crush, Red Kiss and Secret Rose, and Lipstick Berry Rubin, Burgundy Spirit and Red Kiss (matte + glossy). Because the brief says to remove Makeup and not to add makeup products automatically, these were **not** added. The existing Lips section (3 glosses + Lipstick in 3 shades, with virtual try-on) was kept because it was already on the site, is its own category and all its photos are in Drive. Say the word and the 6 shades can be added, or Lips removed entirely.
2. **24K Gold Serum Body Care.** If you want a body-care serum listed, a photograph of it in a serum bottle is needed — none exists in the Drive ZIP.
3. **Herbal Scrub** — the pack doesn't say face or body; it is filed under Skincare › Masks & scrubs. **Sunscreen Lotion SPF 50+** is filed under Skincare › Sun protection. **White Petroleum Jelly** under Body Care.
4. **Aloe Neem Face Wash (green, 100 ml)** — a second, different Aloe Neem Face Wash (aloe vera, neem, cucumber, rose) is in Drive. It was already on the site as Neem Rose Face Wash and does not match the description you gave (aloe vera gel, neem, tea tree), so it was kept. Remove it too if you meant both.
5. **Clarité Botanical Cream** is the second Drive "Acne & Pimple Cream" (aloe vera, neem, tulasi, turmeric; 100 g). It does not match the salicylic/niacinamide/tea tree description, so it was kept.
6. **Lipstick photos** carry the old "CO2 Cosmetics" mark on the tiny box and tube; the official logo sits in the top-left corner of those photos (previous update). The on-pack marks are too small and curved to replace cleanly without reconstructing the image, so they were left. Same for the Drive lip photos that were not added.
7. **Pack artwork placeholders.** Papaya Soap's lid prints "[Optional: Colour]" and Turmeric Soap's prints "[Optional: Essential Oils]"; the White Petroleum Jelly side panels have illegible placeholder fine print. These are part of the label design and were not edited (the brief says not to redesign labels) — they are left out of the ingredient lists. Correct artwork would fix them.
8. **Prices.** No prices were supplied for the 22 new products, so none were invented: they show **"Price coming soon"** and can't be added to the bag (same as Beetroot Soap and Lipstick). Set `price` and change `availability` to `"in-stock"` in `data/products.ts`.

## 7. Logo work

- Official logo: `CO2 FInal Logo.png` (gold infinity CO, two green leaves, green 2) — identical to `public/brand/CO2-final-logo-original.png`, already used by the header, footer, favicons and every existing product photo.
- 22 new Drive photos + Beetroot Soap showed the old "CO₂ Cosmetics" lettering or an approximate infinity mark with a "Cosmetics" wordmark, and 8 soap lids printed "[EXACT CO₂ LOGO]". On each pack the old mark was removed and the supplied logo placed at the same position and proportion (never stretched); the placeholder text was retouched out. Two-pack photos (Onion Hair Oil, White Petroleum Jelly) were branded on both packs. Product names, ingredients, sizes and label layout are untouched.
- Masters, the detection/branding scripts and the box positions used are in `assets-source/product-photos-2026-10-16/`.

## 8. Missing image report

All 52 authorized products on the website have a matching photograph from the Drive ZIP. No image was generated, substituted or taken from another product.

## 9. Tests run

| Check | Result |
|---|---|
| `npm ci` | ✅ |
| `npx tsc --noEmit` | ✅ no errors |
| `npm run check` (every product image + cut-out exists, collections reference real products) | ✅ "52 products, 78 photographs — all OK" |
| `npm run check:config` (sampling, combos, builder, consultations) | ✅ 18 travel sizes, 5 sample sets, 6 combos, 11 customizable products, 4 consultations |
| `npm run build` (clean `.next`) | ✅ no errors or warnings |
| Source scan for every removed slug / name | ✅ none left in pages, components, data or rendered HTML |
| Routes: removed product, collection and combo URLs | ✅ 404 (e.g. `/product/clarite-blemish-cream`, `/product/scalp-clear-jelly`, `/collections/the-gold-edit`) |
| Redirects: `/shop/makeup`, `/shop/made-personal`, `/collections/made-personal`, `/make-it-yours/makeup` | ✅ 308 |
| Browser (Chromium) desktop 1440 px and mobile 390 px: home, shop, Skincare, Hair Care, Body Care, Lips, Customization, product pages, collections, combos, Make It Yours, builder, sampling, search | ✅ no console errors, no broken images, no horizontal scroll |
| Customization request form (UI submit + API) | ✅ returns a `REQ-…` reference, "pending confirmation" |
| Search: "chocolate", "foot", "makeup", "jelly" | ✅ only authorized products (Chocolate Dream lip shades) / no results |

Not tested here: live Razorpay payments, WhatsApp/webhook delivery and AI features (need your production keys), and real devices/Safari.

Known leftover from the source photos: several Drive photographs (new and existing) carry a faint sparkle watermark near the bottom-right corner, and Herbal Scrub's original has visible compression artefacts. The sparkle was removed on White Petroleum Jelly only; the rest were left as supplied.
