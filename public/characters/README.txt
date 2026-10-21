CO2 campaign portraits (homepage)

The homepage has two beauty-model slots:
  1. Hero portrait        → scene id "hero-model"  (placement "hero-portrait")
  2. Lip collection model → scene id "lip-model"   (placement "lip-portrait")

The full prompts are in data/campaign.ts. Until an image for a slot is
approved, the slot shows the real CO2 product photograph (24K Gold Face
Elixir in the hero, Gloss Chocolate Dream in the lip section) — never an
illustration or a placeholder face.

Generate with your image provider (key stays on your machine):
  npx tsx scripts/generate-campaign.ts --dry-run --only=hero-model,lip-model
  OPENAI_API_KEY=sk-... npm run campaign -- --only=hero-model,lip-model
  npx tsx scripts/generate-campaign.ts --approve hero-model
  npx tsx scripts/generate-campaign.ts --approve lip-model

Or use any image tool / a real photoshoot: save the file in
public/campaign/people/ and register it in data/campaign-images.json:
  "hero-model": { "file": "/campaign/people/hero-model.webp", "status": "approved", "source": "ai-generated" }
("source": "photography" for real photos — AI images get an "AI-generated image" label.)
Recommended: 1024×1536 (2:3) or larger, WebP, under ~350 KB.
