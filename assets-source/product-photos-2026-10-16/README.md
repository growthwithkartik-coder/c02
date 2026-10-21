# Product photos — 16 Oct 2026 (Drive inventory update)

Not served by the site. `masters/` holds the branded JPEG masters (from the Drive originals) for the 22 new products and Beetroot Soap (`beetroot-soap-2`).

Branding rule (same result as the existing site photos): the old "CO₂ Cosmetics" mark (and any "Cosmetics" wordmark / "[EXACT CO₂ LOGO]" placeholder line) is removed from the pack and the official logo (`public/brand/co2-logo-360.png`, from `CO2 FInal Logo.png`) is placed in the same box, centred, proportions kept. Nothing else on the label is changed.

Scripts (run from the folder that contains `drive/` and `site/`): `find.py` (template-matches the old mark), `brand.py` (writes `spec.json` box positions), `brand2.py` (removes the old mark, places the logo). `spec.json` lists the exact boxes used. Web sizes were exported as `<slug>-1-640.webp` and `<slug>-1-1200.webp`.
