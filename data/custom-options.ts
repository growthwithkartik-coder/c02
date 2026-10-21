/* Choices offered on made-to-order product pages. Option names come
   from each product's `custom.options`; anything not listed here
   becomes a free-text field. */
export const customOptionChoices: Record<string, string[]> = {
  Shade: ["Fair", "Light", "Light-medium", "Medium", "Tan", "Deep", "Rich"],
  Undertone: ["Cool", "Neutral", "Warm", "Olive"],
  Coverage: ["Sheer", "Light", "Medium", "Full"],
  "Coverage (sheer–light)": ["Sheer", "Light"],
  Finish: ["Matte", "Natural", "Satin", "Dewy"],
  Texture: ["Fluid", "Cream", "Gel", "Balm"],
  Base: ["Water", "Serum", "Gel", "Light emulsion"],
  Scent: ["Fragrance-free", "Light botanical"],
  "Colour family": ["Rose", "Coral", "Berry", "Nude", "Terracotta", "Red"],
  Intensity: ["Sheer", "Buildable", "Bold"],
  "Skin type": ["Dry", "Oily", "Combination", "Normal", "Sensitive", "Dehydrated"],
  Goals: ["Hydration", "Radiance", "Even look", "Oil balance", "Comfort"],
  "Cosmetic goals": ["Hydration", "Radiance", "Even look", "Oil balance", "Comfort"],
  Weight: ["Light", "Medium", "Rich"],
};
