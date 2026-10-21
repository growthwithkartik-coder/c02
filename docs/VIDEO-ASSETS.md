# CO2 — video & image asset brief

## What ships now

`public/video/` holds a short brand film rendered by `scripts/make-brand-film.py`
from the **real product cut-outs** in `public/campaign/` (no stock footage, no
generated imagery, no product demonstrations). Products are always fully in
frame; the camera only drifts slowly with cross-fades.

| File | Size | Used by |
|---|---|---|
| `co2-film-1600.mp4` / `.webm` | 1600×900 · ~16 s loop | Homepage film breaker, "Meet your next everyday essential" breaker, About page |
| `co2-film-900.mp4` | 896×1120 (4:5) | Same sections on phones (≤640 px) |
| `co2-film-poster.webp` / `-portrait.webp` | stills | Poster frame + fallback if the video can't load |

Re-render after changing products: `python3 scripts/make-brand-film.py` (needs Pillow + ffmpeg).

Behaviour (`components/brand/BrandFilm.tsx`): muted, looped, `playsInline`,
plays only while on screen, never autoplays with *prefers-reduced-motion*,
has a pause/play button and falls back to the poster on error.

## Footage to commission (replace the files above, same names)

Shoot on the real products only. Avoid before/after results or anything that
implies a clinical effect.

| # | Subject | Aspect | Length | Style | Placement |
|---|---|---|---|---|---|
| 1 | 24K Gold Face Elixir: dropper drawing up serum, gold flecks catching light | 16:9 + 4:5 | 8–12 s loop | Macro, warm carbon background, slow | Homepage film breaker |
| 2 | Creams (Santal Silk, Renew Firming) — texture swatch spreading on glass | 16:9 | 6–8 s | Top-down macro, bone background | Product texture sections, ingredient story |
| 3 | Gloss shades — wand pulling from tube, swatch on a hand | 4:5 | 6 s | Close-up, dark | Lips category, PDP gallery |
| 4 | Packaging details — caps, pumps, droppers, labels; bottles being arranged | 16:9 | 10 s | Studio, slow pan | Make It Yours landing, builder intro |
| 5 | A person following a simple routine (cleanse → serum → moisturize) | 4:5 | 12–15 s | Natural light, real skin, no retouching claims | About page, homepage hero option |
| 6 | Travel sizes lined up next to full sizes | 16:9 | 6 s | Overhead | Sampling Studio hero |

Export: H.264 MP4 (CRF ~24, `+faststart`) and VP9 WebM, no audio, ≤ 3 MB per clip.

## Photography still missing

- Founder photography for the About page (`founders` array in `app/about/page.tsx`).
- Texture / swatch photography per product (the gallery shows packshots only).
- Real travel-size packshots (sample cards currently show the full-size photo labelled with the travel size).
- Product photos for the made-to-order formulas (they render as a drawn vessel).
