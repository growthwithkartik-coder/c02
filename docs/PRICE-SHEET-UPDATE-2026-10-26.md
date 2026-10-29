# Price-sheet update — 26 October 2026

Source: **CO2 Cosmetics Product Price Sheet.xlsx** (sheet "Product Price List", 80 rows).
The sheet is the single source of truth for product names, full-size prices, net weights
and travel sizes. URLs (slugs) and product photos are unchanged.

## Where the data lives

- `data/products.ts` — `name`, `size` (net weight) and `price` (full size) of every product.
- `data/sampling.ts` — travel sizes (`items`): net weight + price, only for products where the
  sheet gives **both** values. Products marked NA (or with one value missing) are not listed,
  so no travel-size option, label, row or placeholder appears for them anywhere.
- `components/ui/SizePrice.tsx` — the one component that renders full size / travel size
  on product cards (`CardSizePrice`) and on product pages + quick view (`DetailSizePrice`).
- `lib/utils.ts` — `PRICES_ON_REQUEST = false` (catalogue prices shown),
  `CUSTOM_PRICES_ON_REQUEST = true` (made-to-order formulas and the builder stay
  "price on request · as per customization" — they are not on the sheet). Services stay on request.

## Products matched (52 of 55)

| Slug (URL) | Previous site name | Sheet row | Name now shown | Full size | Travel size |
|---|---|---|---|---|---|
| `24k-gold-face-elixir` | 24K Gold Face Elixir | 24K Gold Serum | 24K Gold Serum | 30 ml · ₹2,250 | —  (not offered) |
| `no-marks-cream` | No Marks Cream | No Marks Cream | No Marks Cream | 100 g · ₹780 | 50 g · ₹390 |
| `clarite-botanical-cream` | Clarité Botanical Cream | Acne n Pimple Cream | Acne n Pimple Cream | 100 g · ₹1,000 | 20 g · ₹200 |
| `renew-firming-cream` | Renew Firming Cream | Anti-Aging Cream | Anti-Aging Cream | 50 g · ₹1,450 | —  (not offered) |
| `moisturizing-cream-spf` | Moisturizing Cream with SPF | Moisturizing Cream with SPF | Moisturizing Cream with SPF | 120 g · ₹3,000 | 50 g · ₹1,200 |
| `night-cream` | Night Cream | Night Cream | Night Cream | 50 g · ₹600 | —  (not offered) |
| `sunscreen-lotion-spf-50` | Sunscreen Lotion SPF 50+ | Sunscreen Lotion (SPF 50+) | Sunscreen Lotion (SPF 50+) | 100 ml · ₹2,650 | 50 ml · ₹1,325 |
| `neem-rose-face-wash` | Neem Rose Face Wash | Aloe Neem Face Wash | Aloe Neem Face Wash | 120 ml · ₹825 | 20 ml · ₹120 |
| `noir-charcoal-face-wash` | Noir Charcoal Face Wash | Charcoal Face Wash | Charcoal Face Wash | 120 ml · ₹825 | 50 ml · ₹350 |
| `milk-cleanser` | Milk Cleanser | Milk Cleanser | Milk Cleanser | 100 ml · ₹625 | 50 ml · ₹300 |
| `noir-charcoal-mask` | Noir Charcoal Mask | Charcoal Face Mask | Charcoal Face Mask | 100 g · ₹925 | 50 g · ₹460 |
| `multani-mitti-face-mask` | Multani Mitti Face Mask | Multani Mitti Face Mask | Multani Mitti Face Mask | 100 g · ₹875 | 50 g · ₹400 |
| `herbal-scrub` | Herbal Scrub | Scrub Cream - Herbal | Scrub Cream – Herbal | 100 g · ₹825 | 50 g · ₹400 |
| `aloe-veil-body-lotion` | Aloe Veil Body Lotion | Body Moisturizing Lotion - Aloe Fresh | Body Moisturizing Lotion – Aloe Fresh | 100 ml · ₹725 | 50 ml · ₹360 |
| `coco-glow-body-lotion` | Coco Glow Body Lotion | Body Moisturizing Lotion - Coco Glow | Body Moisturizing Lotion – Coco Glow | 100 ml · ₹550 | 50 ml · ₹275 |
| `tulasi-balance-body-lotion` | Tulasi Balance Body Lotion | Body Moisturizing Lotion - Herbal | Body Moisturizing Lotion – Herbal | 100 ml · ₹550 | 50 ml · ₹275 |
| `lumiere-even-tone-lotion` | Lumière Even-Tone Lotion | Brightening & Lightening Lotion | Brightening & Lightening Lotion | 100 ml · ₹725 | 50 ml · ₹360 |
| `calamine-calm-lotion` | Calamine Calm Lotion | Calamine Lotion | Calamine Lotion | 100 ml · ₹680 | 50 ml · ₹340 |
| `decollete-nourishing-cream` | Décolleté Nourishing Cream | Breast Cream | Breast Cream | 50 g · ₹1,625 | —  (not offered) |
| `aloe-pure-gel` | Aloe Pure Gel | Aloe Vera Gel | Aloe Vera Gel | 110 g · ₹625 | —  (not offered) |
| `stretch-marks-gel` | Stretch Marks Gel | Stretch Marks Gel | Stretch Marks Gel | 50 g · ₹1,000 | —  (not offered) |
| `white-petroleum-jelly` | White Petroleum Jelly | White Petroleum Jelly | White Petroleum Jelly | 50 g · ₹275 | —  (not offered) |
| `lavender-santal-body-wash` | Lavender Santal Body Wash | Body Wash (With Lavender, Sandal & Mint Fragrances) | Body Wash (With Lavender, Sandal & Mint Fragrances) | 270 ml · ₹1,000 | 50 ml · ₹300 |
| `shower-gel` | Shower Gel | Shower Gel | Shower Gel | 100 ml · ₹535 | 50 ml · ₹260 |
| `aloe-vera-herbal-bar` | Aloe Vera Herbal Bar | Herbal Soap - Aloe Vera | Herbal Soap – Aloe Vera | 75 g · ₹380 | 20 g · ₹100 |
| `lemon-zest-herbal-bar` | Lemon Zest Herbal Bar | Herbal Soap - Lemon | Herbal Soap – Lemon | 75 g · ₹380 | 20 g · ₹100 |
| `mint-cool-herbal-bar` | Mint Cool Herbal Bar | Herbal Soap - Mint | Herbal Soap – Mint | 75 g · ₹380 | 20 g · ₹100 |
| `neem-purify-herbal-bar` | Neem Purify Herbal Bar | Herbal Soap - Neem | Herbal Soap – Neem | 75 g · ₹380 | 20 g · ₹100 |
| `sandal-glow-herbal-bar` | Sandal Glow Herbal Bar | Herbal Soap - Sandal | Herbal Soap – Sandal | 75 g · ₹380 | 20 g · ₹100 |
| `goat-milk-herbal-bar` | Goat Milk Herbal Bar | Goat Milk Soap | Goat Milk Soap | 75 g · ₹380 | 20 g · ₹100 |
| `beetroot-soap` | Beetroot Soap | Beetroot Soap | Beetroot Soap | 100 g · ₹425 | 20 g · ₹100 |
| `kumkumadi-soap` | Kumkumadi Soap | Kumkumadi Soap | Kumkumadi Soap | 75 g · ₹380 | 20 g · ₹100 |
| `neem-soap` | Neem Soap | Neem Soap | Neem Soap | 100 g · ₹425 | 20 g · ₹100 |
| `papaya-soap` | Papaya Soap | Papaya Soap | Papaya Soap | 100 g · ₹425 | 20 g · ₹100 |
| `aloe-nourish-shampoo` | Aloe Nourish Shampoo | Aloe Vera Shampoo | Aloe Vera Shampoo | 100 ml · ₹710 | —  (not offered) |
| `sandal-soap` | Sandal Soap | Sandal Soap | Sandal Soap | 100 g · ₹425 | 20 g · ₹100 |
| `sunni-pindi-soap` | Sunni Pindi Soap | Sunni Pindi Soap | Sunni Pindi Soap | 100 g · ₹425 | 20 g · ₹100 |
| `turmeric-soap` | Turmeric Soap | Turmeric Soap | Turmeric Soap | 75 g · ₹380 | 20 g · ₹100 |
| `coffee-soap` | Coffee Soap | Coffee Soap | Coffee Soap | 100 g · ₹425 | 20 g · ₹100 |
| `onion-shampoo` | Onion Shampoo | Onion Shampoo | Onion Shampoo | 100 ml · ₹490 | 50 ml · ₹250 |
| `herbal-shampoo` | Shampoo – Herbal | Shampoo - Herbal | Shampoo – Herbal | 100 ml · ₹625 | 50 ml · ₹300 |
| `shikakai-shampoo` | Shikakai Shampoo | Shikhaiah Shampoo | Shikakai Shampoo | 100 ml · ₹575 | 50 ml · ₹280 |
| `scalp-clear-shampoo` | Scalp Clear Shampoo | Anti Dandruff Shampoo | Anti Dandruff Shampoo | 100 ml · ₹800 | 50 ml · ₹400 |
| `scalp-clear-hair-oil` | Scalp Clear Hair Oil | Anti-Dandruff Hair Oil | Anti-Dandruff Hair Oil | 100 ml · ₹1,500 | 50 ml · ₹750 |
| `onion-hair-oil` | Onion Hair Oil | Onion Hair Oil | Onion Hair Oil | 100 ml · ₹1,115 | 50 ml · ₹550 |
| `groom-beard-oil` | Groom Beard Oil | Beard Oil | Beard Oil | 50 ml · ₹1,000 | —  (not offered) |
| `gloss-berry-rubin` | Gloss Berry Rubin | Lip Gloss - Berry Rubin | Lip Gloss – Berry Rubin | 4 ml · ₹1,995 | —  (not offered) |
| `gloss-burgundy-spirit` | Gloss Burgundy Spirit | Lip Gloss - Burgundy Spirit | Lip Gloss – Burgundy Spirit | 4 ml · ₹1,995 | —  (not offered) |
| `gloss-chocolate-dream` | Gloss Chocolate Dream | Lip Gloss - Chocolate Dream | Lip Gloss – Chocolate Dream | 4 ml · ₹1,995 | —  (not offered) |
| `gloss-red-kiss` | Gloss Red Kiss | Lip Gloss - Red Kiss | Lip Gloss – Red Kiss | 4 ml · ₹1,995 | —  (not offered) |
| `gloss-secret-rose` | Gloss Secret Rose | Lip Gloss - Secret Rose | Lip Gloss – Secret Rose | 4 ml · ₹1,995 | —  (not offered) |
| `lipstick` | Lipstick | Lip Stick - Secret Rose | Lipstick | 4 g · ₹2,245 | —  (not offered) |

## Not matched — left as "Price on request" for review (3)

| Product on site | Closest sheet row | Why it was not assigned |
|---|---|---|
| Red Grapes Face Wash (`red-grapes-face-wash`) | Beetroot Face Wash — 120 ml ₹725, travel 50 ml ₹360 | Pack says "Red Grapes Face Wash" (beetroot / red grape extract). Same product? Not certain. |
| Red Wine Soap (`red-wine-soap`) | none (Beetroot Soap is already its own product) | No row in the sheet. |
| Scalp Clear Treatment Gel (`scalp-clear-treatment-gel`, pack: "Anti Dandruff Gel", 50 g) | Anti Dandruff Jelly — 50 g ₹670 | Gel vs jelly; an "Anti-Dandruff Jelly" was removed from the site on 16 Oct as a different product. Its old ₹560 price was removed. |

To price one, set `price` and `availability: "in-stock"` in `data/products.ts` (and add a line to
`data/sampling.ts` if it has a travel size).

## Decisions and notes

- **Aloe Vera Shampoo:** the sheet gives a travel price (₹355) but no travel net weight, so no
  travel size is shown. Add the weight to `data/sampling.ts` to enable it.
- **Shikakai Shampoo:** the sheet spells it "Shikhaiah Shampoo"; the site keeps the correct
  spelling "Shikakai" (pack text was corrected on 18 Oct). Prices/weights are from the sheet.
- **Lipstick:** one product with seven shades on the site; every "Lip Stick – …" row in the sheet
  is 4 g · ₹2,245, so the product shows 4 g · ₹2,245 (the "Red Kiss + Matte" row covers the
  Red Kiss Matte and Red Kiss Glossy shades).
- **Categories:** the site keeps its use-based departments (Skincare / Hair Care / Body Care / Lips).
  The sheet files 24K Gold Serum, Moisturizing Cream with SPF and Sunscreen Lotion (SPF 50+) under
  "Body Care Products"; on the site they stay in Skincare, where they are used on the face.
  Every other product already sits in the matching group.
- **Weights differ from some pack photos** (the sheet wins): e.g. Aloe Neem / Charcoal / Beetroot
  face washes 120 ml (pack 100 ml), herbal bars 75 g (pack 100 g), cream soaps 100 g (pack 75 g),
  body lotions 100 ml (pack 180–200 ml), Breast Cream / Stretch Marks Gel / White Petroleum Jelly 50 g
  (pack 100 g), lip gloss 4 ml (pack 5 ml), lipstick 4 g (pack 6 ml). Photos were not edited.
- **Sample sets** were rebuilt only from products that have travel sizes (24K Gold Serum,
  Anti-Aging Cream and Aloe Vera Shampoo no longer have one).
- Copy that named products by their old names (combos, campaign alt text, FAQs, sample sets)
  now uses the sheet names. Price wording ("prices on request") in FAQs, About, Terms,
  Combos and the announcement bar was updated to match listed prices.

## Sheet rows with no product on the site (not added — no product photo)

Anti Dandruff Jelly (see above), Charcoal Soap, Chocolate Face Mask, Coffee Face Wash, Coffee Scrub Cream,
Day Cream, De Stress Massage Oil, Dead Sea Mud Face Mask, Face Cream, Face pack (Herbal Cream),
Foaming Hand Wash, Foot Care Cream, Gentle Wash, Gold Face Wash, Green Apple Face Wash, Hair & Body Wash,
Hair Conditioner, Hair Styling Gel, Hair Wash (With Lemon, Rose, Tulasi, Camphor & Orange Fragrances),
Herbal Face Wash, Ice Cool Hair Oil, Lip Gloss – Coral Crush, Beetroot Face Wash (see above).

Sheet values that look unusual (not on the site, reported only): Day Cream travel 20 g at ₹100
against ₹1,800 full size; Dead Sea Mud Face Mask travel size given in ml for a 100 g mask.

## Testing

- `tsc --noEmit` clean; `next build` succeeds; `npm run check` — 55 products, 84 photos OK.
- Automated crawl of all 55 product pages and 13 listing pages: name, full-size price, net weight and
  travel size match the sheet on every product page and every `/shop` card (55 cards, no duplicates);
  no "NA"/"N/A", "not available" or "no travel size" text; no ₹0 prices (the only ₹0 is the empty
  running total of the build-your-own sample set before anything is picked).
- Travel size → Add to bag → cart subtotal ₹200 (Acne n Pimple Cream 20 g) verified.
- No horizontal scroll at 375 px on home, shop, departments, product pages, sampling and combos.

## Follow-up — the three "not matched" products, now priced (owner-confirmed)

| Slug | Name shown | Full size | Travel size |
|---|---|---|---|
| `red-grapes-face-wash` (sheet: Beetroot Face Wash) | Red Grapes Face Wash | 120 ml · ₹725 | 50 ml · ₹360 |
| `red-wine-soap` (existing entry, no duplicate) | Red Wine Soap | 100 g · ₹425 | 20 g · ₹100 |
| `scalp-clear-treatment-gel` (sheet: Anti Dandruff Jelly) | Anti-Dandruff Gel | 50 g · ₹670 | none — no travel size added |

Changes: `data/products.ts` (size, price, availability `in-stock`; gel renamed) and
`data/sampling.ts` (travel sizes for the face wash and soap only). URLs, photos and all other products are untouched.
