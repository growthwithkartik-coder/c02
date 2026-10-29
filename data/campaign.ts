/* ------------------------------------------------------------------
   CO2 campaign scenes — people using real CO2 products.

   Each scene pairs ONE catalogue product (its real photograph is sent
   as the packaging reference) with a person and an application moment.
   Images are produced by scripts/generate-campaign.mjs (or by a real
   photoshoot — drop the file in /public/campaign/people and register it
   in data/campaign-images.json with source "photography").

   Nothing appears on the site until an entry is marked "approved"
   after a human check. Until then every placement falls back to the
   real CO2 product photography — never to a fake or placeholder face.
------------------------------------------------------------------- */

/* "hero-portrait" and "lip-portrait" are the two beauty-model images on the
   homepage (hero, and the lip collection). */
export type Placement = "hero" | "on-skin" | "gloss" | "hero-portrait" | "lip-portrait";

export interface CampaignScene {
  id: string;
  product: string; // product slug
  placement: Placement[];
  person: string;
  action: string;
  setting: string;
  alt: string;
  /** ritual step shown in the On Skin section */
  step?: string;
  /** extra art direction appended to the shared style (beauty portraits) */
  direction?: string;
  /** output size requested from the image model, e.g. "1024x1536" */
  size?: string;
}

export const campaignScenes: CampaignScene[] = [
  /* ---- the two homepage beauty portraits ---- */
  {
    id: "hero-model",
    product: "24k-gold-face-elixir",
    placement: ["hero-portrait"],
    size: "1024x1536",
    person:
      "a South Asian woman in her late twenties with warm medium-deep skin, natural brows, softly defined eyes, bare luminous skin with real visible pores and fine texture, dark hair pulled back into a low sleek knot, small gold stud earrings",
    action:
      "a calm, confident beauty-campaign portrait from the chest up, head turned three-quarters toward the light, eyes looking just past the camera, lips relaxed and closed, one hand lightly holding the CO2 24K Gold Serum dropper bottle at collarbone height with relaxed, anatomically correct fingers",
    setting:
      "warm bone-to-beige seamless studio backdrop with a soft gradient, large soft key light from the left, gentle gold bounce fill, subtle window-shadow pattern on the backdrop",
    direction:
      "High-end cosmetics campaign, photographed not rendered. Real skin with natural micro-texture, peach fuzz and slight sheen on the high points of the face; no smoothing. Natural eyes with catchlights, symmetrical natural features, natural teeth hidden (lips closed), five natural fingers. Colour palette: bone, warm beige, charcoal, muted gold (#B8924F). Vertical 2:3 composition, subject centred with the eyes on the upper third.",
    alt: "CO2 campaign portrait: a woman with luminous skin holds the 24K Gold Serum",
  },
  {
    id: "lip-model",
    product: "gloss-berry-rubin",
    placement: ["lip-portrait"],
    size: "1024x1536",
    person:
      "a woman in her mid-twenties with medium olive skin, natural freckles, soft natural brows, minimal makeup apart from the lip colour",
    action:
      "a close-up beauty-editorial crop from the nose to the chin and jawline, lips slightly parted, wearing a deep berry-red high-shine gloss (colour #7D1F33) that shows the real lip texture, fine vertical lip lines and a crisp wet highlight on the lower lip; the gloss stays neatly within the natural lip line; the CO2 Gloss in Berry Rubin bottle held lightly near the chin with relaxed, anatomically correct fingers",
    setting:
      "deep berry-to-charcoal backdrop, soft beauty-dish key light from the front, subtle rim light, shallow depth of field",
    direction:
      "Luxury lip campaign macro photograph, photographed not rendered. The lips are the focus and in sharp detail; skin shows real pores and texture. Natural teeth only slightly visible or hidden, no distortion of the mouth, five natural fingers. Colour palette: berry, charcoal, bone, muted gold. Vertical 2:3 composition.",
    alt: "CO2 lip campaign: close-up of lips wearing Gloss in Berry Rubin",
  },

  {
    id: "elixir-dropper",
    product: "24k-gold-face-elixir",
    placement: ["hero", "on-skin"],
    step: "Treat",
    person: "a woman in her early thirties with deep brown skin, natural visible skin texture and pores, short natural hair, no visible makeup",
    action: "holding the glass dropper bottle in one hand and pressing a drop of the clear, gold-flecked serum onto her cheekbone with the other fingertips",
    setting: "warm bone-coloured studio wall, soft directional window light from the right",
    alt: "A woman presses a drop of CO2 24K Gold Serum onto her cheekbone",
  },
  {
    id: "noir-mask",
    product: "noir-charcoal-mask",
    placement: ["on-skin"],
    step: "Weekly mask",
    person: "an East Asian person in their mid-twenties with short hair, the black charcoal mask applied evenly over the face, avoiding eyes and lips",
    action: "holding the mask tube near their collarbone, relaxed, eyes open",
    setting: "charcoal-grey backdrop, soft top light",
    alt: "A person wearing CO2 Charcoal Face Mask holds the tube",
  },
  {
    id: "coco-body",
    product: "coco-glow-body-lotion",
    placement: ["on-skin"],
    step: "Body",
    person: "a woman in her thirties with medium-brown skin wearing a simple sleeveless cream top",
    action: "smoothing lotion along her forearm, the bottle on a stone ledge beside her",
    setting: "warm beige bathroom with stone ledge, daylight",
    alt: "A woman smooths CO2 Body Moisturizing Lotion – Coco Glow along her forearm",
  },
  {
    id: "beard-oil",
    product: "groom-beard-oil",
    placement: ["on-skin"],
    step: "Grooming",
    person: "a man in his fifties with dark skin and a full grey-and-black beard",
    action: "tipping a few drops of oil from the dropper bottle into his palm",
    setting: "charcoal backdrop, warm side light",
    alt: "A man tips CO2 Beard Oil into his palm",
  },
  {
    id: "gloss-berry-rubin",
    product: "gloss-berry-rubin",
    placement: ["gloss"],
    person: "a woman in her twenties with light olive skin, natural brows, minimal makeup apart from the gloss",
    action: "wearing the berry gloss on her lips, holding the gloss wand near her chin, three-quarter profile",
    setting: "deep berry-toned backdrop, soft beauty light",
    alt: "A woman wears CO2 Gloss in Berry Rubin",
  },
  {
    id: "gloss-burgundy-spirit",
    product: "gloss-burgundy-spirit",
    placement: ["gloss"],
    person: "a woman in her forties with deep brown skin and natural texture, minimal makeup apart from the gloss",
    action: "wearing the deep wine gloss on her lips, holding the closed gloss tube, three-quarter profile",
    setting: "deep wine-toned backdrop, soft beauty light",
    alt: "A woman wears CO2 Gloss in Burgundy Spirit",
  },
  {
    id: "gloss-chocolate-dream",
    product: "gloss-chocolate-dream",
    placement: ["gloss"],
    person: "a South Asian woman in her thirties with warm medium skin, minimal makeup apart from the gloss",
    action: "wearing the chocolate-brown gloss on her lips, applying it with the wand, three-quarter profile",
    setting: "deep cocoa-toned backdrop, soft beauty light",
    alt: "A woman applies CO2 Gloss in Chocolate Dream",
  },
];

/** Shared art direction — used by the generation script. */
export const campaignStyle =
  "Premium editorial skincare campaign photograph. Photorealistic, real unretouched skin with visible pores and natural texture, no airbrushing, no plastic or waxy skin. " +
  "Natural, flattering light; neutral warm palette of bone, beige, charcoal and soft gold. Shot on an 85mm lens, shallow depth of field, calm and intimate. " +
  "The CO2 product in the reference image must appear exactly as it is — same container shape, cap, colours and label artwork. Do not redraw, translate or invent label text; if the label cannot be reproduced exactly, angle it slightly away. " +
  "No text overlays, no extra logos, no other brands, no exaggerated results, no before/after, no cartoon or illustration styles. All people are adults.";
