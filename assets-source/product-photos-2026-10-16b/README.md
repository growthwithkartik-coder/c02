# Product photos — 16 Oct 2026 (second Drive batch: lip products + Coffee Soap)

Not served by the site. `masters/` holds the branded JPEG masters.

Source: `drive-download-20261016T122303Z-1-001.zip` (7 files; `Berry Rubin(1).png` is byte-identical to `Berry Rubin.png`).

| Master | Drive file | Used for |
|---|---|---|
| lipstick-berry-rubin-1 | Berry Rubin.png | Lipstick › Berry Rubin shade |
| lipstick-burgundy-spirit-1 | Burgundy Spirit.png | Lipstick › Burgundy Spirit shade |
| lipstick-red-kiss-1 | Lip Stick- Red Kiss + Matte.png | Lipstick › Red Kiss Matte and Red Kiss Glossy shades |
| gloss-red-kiss-1 | Lip Gloss - Red Kiss.jpg | Gloss Red Kiss |
| gloss-secret-rose-1 | Lip Gloss - Secret Rose.jpg | Gloss Secret Rose |
| coffee-soap-1 | Coffee Soap.jpg | Coffee Soap |
| lipstick-secret-rose-1, -coral-crush-1, -chocolate-dream-1 | existing site photos | re-branded (see below) |

Branding (`brand3.py`, specs `spec3.json` and `spec3-existing-lipsticks.json`, boxes actually used in `spec_used.json`):
the AI-rendered "CO2 COSMETICS" pack marks (and the "Cosmetics" wordmark, and the "[EXACT CO₂ LOGO]" placeholder on the soap lid) are detected, removed by inpainting and replaced by the official logo (`public/brand/co2-logo-360.png`) centred in the same area, proportions kept. The image-generator sparkle watermark is removed. On the three existing lipstick photos the extra corner logo stamp from the previous update was removed so each pack carries only the official logo.
The embossed mark on the physical soap bar is left as photographed.

Campaign cut-outs (`public/campaign/*.webp`) still showed the old "CO2 Cosmetics" lettering. `align.py` / `recut.py` align each cut-out to its branded product photo and take the pixels from that photo (original cut-out alpha and edges kept), so the cut-outs and the brand film now carry the official logo. The film was re-rendered with `npm run film`.

Run (from a folder holding `drive/`): `python3 brand3.py <drive dir> <out dir> <path to co2-logo-360.png>`; `SPEC=spec3-existing-lipsticks.json` for the existing lipstick photos.
