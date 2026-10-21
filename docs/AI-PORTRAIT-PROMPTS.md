# CO2 — AI beauty portrait prompts

Image generation was **not available** in the environment this redesign was built in, so the two portraits were **not generated**. The slots are built and wired; until an image is approved they show the real CO2 product photography (no illustrated or placeholder faces). Generate the images with these prompts, check them, then approve them (see `public/characters/README.txt`).

The same prompts live in `data/campaign.ts` and are used by `npm run campaign`, which also sends the real product photo as the packaging reference.

---

## 1 · Hero portrait — `hero-model` (vertical 2:3, ≥ 1024×1536)

> Premium editorial cosmetics campaign photograph, photographed not rendered. A South Asian woman in her late twenties with warm medium-deep skin, natural brows, softly defined eyes and bare luminous skin with real visible pores, fine texture and peach fuzz; dark hair pulled back into a low sleek knot; small gold stud earrings. Calm, confident beauty portrait from the chest up, head turned three-quarters toward the light, eyes looking just past the camera, lips relaxed and closed. One hand lightly holds a clear glass dropper bottle of gold-flecked face serum (the CO2 24K Gold Face Elixir — use the reference photo, keep its shape, silver dropper and label exactly) at collarbone height, relaxed anatomically correct fingers. Warm bone-to-beige seamless studio backdrop with a soft gradient and a subtle window-shadow pattern; large soft key light from the left, gentle gold bounce fill. Palette: bone, warm beige, charcoal, muted gold (#B8924F). 85 mm lens, shallow depth of field. Subject centred, eyes on the upper third.

**Avoid:** airbrushed or plastic skin, waxy texture, extra or fused fingers, asymmetrical or uncanny eyes, visible teeth, text, logos other than the product's own, invented label text, cartoon / illustration / 3D-render look, heavy makeup, exaggerated results.

---

## 2 · Lip collection model — `lip-model` (vertical 2:3, ≥ 1024×1536)

> Luxury lip-campaign macro photograph, photographed not rendered. Close-up beauty-editorial crop from the nose to the chin and jawline of a woman in her mid-twenties with medium olive skin, natural freckles and real pores. Lips slightly parted, wearing a deep berry-red high-shine lip gloss (colour #7D1F33 — CO2 Gloss in Berry Rubin) that shows the real lip texture and fine vertical lip lines, with a crisp wet highlight on the lower lip; the gloss stays neatly inside the natural lip line. The round glass CO2 lip-gloss bottle (use the reference photo exactly) is held lightly near the chin with relaxed, anatomically correct fingers. Deep berry-to-charcoal backdrop, soft beauty-dish key light from the front, subtle rim light, shallow depth of field. Palette: berry, charcoal, bone, muted gold. Lips in sharp focus.

**Avoid:** distorted mouth, strange or too many teeth, colour bleeding outside the lip line, plastic skin, extra fingers, text, invented label text, cartoon / CGI look.

---

### Review checklist before approving
- It is clearly an adult and looks like a real photograph (skin, eyes, hands, teeth).
- The product matches the real CO2 packaging (shape, cap, colour, label) — or is angled so the label isn't legible.
- Nothing implies a medical or "before/after" result.
- Hero: the face reads well when cropped to 4:5 (the hero frame) — eyes in the upper third.
