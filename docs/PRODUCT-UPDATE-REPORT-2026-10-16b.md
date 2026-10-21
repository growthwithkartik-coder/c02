# CO2 Cosmetics — lip products, Coffee Soap & logo update (16 Oct 2026, second batch)

Source: `drive-download-20261016T122303Z-1-001.zip` (7 image files). Project: `co2-cosmetics-site-update-2026-10-16.zip` (Next.js 15), updated in place.

## Drive inventory → website

| Drive file | Identified from the pack | Website | Category |
|---|---|---|---|
| Berry Rubin.png | Lip Stick – Berry Rubin, 6 ml | **Lipstick** › new shade *Berry Rubin* | Lips › Lipstick |
| Berry Rubin(1).png | byte-identical copy of the file above | not imported (duplicate) | — |
| Burgundy Spirit.png | Lipstick – Burgundy Spirit, 6 ml | **Lipstick** › new shade *Burgundy Spirit* | Lips › Lipstick |
| Lip Stick- Red Kiss + Matte.png | Lip Stick – Red Kiss, 6 ml, two finishes (Matte, Glossy) | **Lipstick** › new shades *Red Kiss Matte* and *Red Kiss Glossy* (same photo) | Lips › Lipstick |
| Lip Gloss - Red Kiss.jpg | Lip Gloss – Red Kiss, 5 ml; vitamin E, jojoba oil, shea butter | new product **Gloss Red Kiss** | Lips › Lip gloss |
| Lip Gloss - Secret Rose.jpg | Lip Gloss – Secret Rose, 5 ml; vitamin E, jojoba oil, shea butter | new product **Gloss Secret Rose** | Lips › Lip gloss |
| Coffee Soap.jpg | Coffee Soap, 75 g; coffee extract, coconut oil (Cocos nucifera), glycerin, soap base | new product **Coffee Soap** | Body Care › Body soaps |

7 supplied items (counting the two Red Kiss finishes separately) → 3 new catalogue products + 4 new shades of the existing Lipstick product. The site's existing pattern is one Lipstick product with a shade selector, a photo per shade and a virtual try-on, so the lipstick shades were added there instead of as separate listings (no duplicate "Lipstick" records). Catalogue: 52 → 55 products, 78 → 84 photographs.

The Lip Gloss Berry Rubin / Burgundy Spirit already on the site are different products (glass gloss bottles) from the Berry Rubin / Burgundy Spirit lipsticks in this batch; both are kept.

## Content
- Product names, sizes, ingredients and on-pack claims are copied from the packs only. No prices were supplied → the three new products are "Price coming soon" (not orderable); the Lipstick product was already price-pending.
- Lips copy updated everywhere it counted shades (category/department text, gloss collection, gloss trio combo, Make It Yours lip questions and the lip recommender now include Red Kiss and Secret Rose gloss). Coffee Soap added to the Body Soap Library collection and a "Coffee" ingredient filter.
- Content audit: duplicate short descriptions/ledes/"for who" lines on 12 earlier products rewritten so each product is unique; 10 Title-Case short descriptions changed to sentence case; product names "Multhani Mitti Face Mask" → "Multani Mitti Face Mask" and "Shikaikah Shampoo" → "Shikakai Shampoo" (the packs print the misspelling — artwork correction needed).

## Logo
- Supplied logo = `public/brand/CO2-final-logo-original.png` (same artwork; header, footer, favicons, checkout and structured data already used it).
- All 6 new photos: AI-rendered "CO2 COSMETICS" marks replaced with the official logo on every pack (boxes, tubes, gloss caps and bottles, soap lid), "[EXACT CO₂ LOGO]" placeholder removed, sparkle watermark removed.
- 3 existing lipstick photos: old on-pack marks replaced, the extra corner logo stamp removed.
- 12 campaign cut-outs and the brand film: old "CO2 Cosmetics" lettering replaced (rebuilt from the branded photos; film re-rendered).
- 3D packaging preview (Make It Yours builder): typographic "CO2" text replaced by the official logo image.
- Intro animation: the decorative molecule motif under the logo removed so the logo stands alone.

## Fixes
- Product gallery: with 6 thumbnails the strip overflowed the screen on mobile (horizontal scroll on the Lipstick page). Thumbnails now scroll inside their row.
- Try-on: "Glossy" lipstick shades render with the gloss finish.

## Needs your attention
1. **Prices** for Coffee Soap, Gloss Red Kiss, Gloss Secret Rose and Lipstick (`data/products.ts`, then set `availability: "in-stock"`).
2. **"Eight products"** — the ZIP holds 7 files; one is a duplicate. Counted with Red Kiss Matte/Glossy separately there are 7 items. If an eighth product was meant, it wasn't in the ZIP.
3. Lipstick ingredients are not printed on the lipstick packs, so none are listed.
4. Red Kiss Matte and Glossy share one photograph (both are in the same shot). A separate photo per finish would make the shade switch clearer.
5. The embossed mark on the physical soap bars is an approximation of the logo (as on all existing soap photos) and was left as photographed.
6. Pack artwork spells "Multhani" and "Shikaikah"; the website uses the correct spellings.
