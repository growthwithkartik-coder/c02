/* ------------------------------------------------------------------
   CO2 campaign image generator (run on your machine, never in the browser)

   Generates photorealistic campaign images of people using real CO2
   products, using each product's own photograph as the packaging
   reference. Results land in /public/campaign/people and are registered
   in data/campaign-images.json with status "review" — they do NOT appear
   on the site until you approve them.

   Usage
     npx tsx scripts/generate-campaign.ts --list
     npx tsx scripts/generate-campaign.ts --dry-run            # print prompts, no API calls
     OPENAI_API_KEY=… npx tsx scripts/generate-campaign.ts      # all scenes
     OPENAI_API_KEY=… npx tsx scripts/generate-campaign.ts --only=elixir-dropper,noir-mask
     npx tsx scripts/generate-campaign.ts --approve elixir-dropper
     npx tsx scripts/generate-campaign.ts --reject elixir-dropper

   Environment
     OPENAI_API_KEY        required to generate (server/terminal only)
     CO2_IMAGE_MODEL       default "gpt-image-1" — check your provider's current image-edit model
     CO2_IMAGE_SIZE        default "1024x1536" (portrait)
     CO2_IMAGE_QUALITY     default "high"

   Review checklist before approving: the product is the real CO2 product
   (shape, cap, colour, label not rewritten), skin looks real, hands and
   fingers are correct, the person is clearly an adult, nothing suggests
   a medical result.
------------------------------------------------------------------- */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { campaignScenes, campaignStyle } from "../data/campaign";
import { products } from "../data/products";

const ROOT = path.resolve(__dirname, "..");
const JSON_PATH = path.join(ROOT, "data/campaign-images.json");
const OUT_DIR = path.join(ROOT, "public/campaign/people");

type Entry = { file: string; status: "review" | "approved" | "rejected"; source: "ai-generated" | "photography"; model?: string; createdAt?: string; width?: number; height?: number };
type Store = { _readme?: string; images: Record<string, Entry> };

const args = process.argv.slice(2);
const flag = (n: string) => args.includes(`--${n}`);
const opt = (n: string) => {
  const i = args.findIndex((a) => a === `--${n}` || a.startsWith(`--${n}=`));
  if (i < 0) return undefined;
  return args[i].includes("=") ? args[i].split("=")[1] : args[i + 1];
};

function load(): Store {
  return JSON.parse(readFileSync(JSON_PATH, "utf8"));
}
function save(s: Store) {
  writeFileSync(JSON_PATH, JSON.stringify(s, null, 2) + "\n");
}

function promptFor(id: string) {
  const sc = campaignScenes.find((s) => s.id === id)!;
  const p = products.find((x) => x.slug === sc.product);
  if (!p) throw new Error(`Scene ${id} references unknown product ${sc.product}`);
  const prompt = [
    campaignStyle,
    `Subject: ${sc.person}.`,
    `Action: ${sc.action}.`,
    `Setting: ${sc.setting}.`,
    `Product (from the reference image): CO2 ${p.name} — ${p.subtitle}, ${p.size.replace(/\.$/, "")}. Texture: ${p.texture}.`,
    ...(sc.direction ? [`Direction: ${sc.direction}`] : []),
  ].join("\n");
  const cut = p.cutout ? path.join(ROOT, "public/campaign", `${p.cutout}.webp`) : null;
  const photo = p.images[0] ? path.join(ROOT, "public/products", `${p.images[0]}-1200.webp`) : null;
  const ref = cut && existsSync(cut) ? cut : photo;
  if (!ref || !existsSync(ref)) throw new Error(`No reference image for ${p.slug}`);
  return { sc, p, prompt, ref };
}

async function generate(id: string, store: Store) {
  const { prompt, ref } = promptFor(id);
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set. Use --dry-run to preview prompts without it.");
  const model = process.env.CO2_IMAGE_MODEL || "gpt-image-1";
  const size = campaignScenes.find((s) => s.id === id)?.size || process.env.CO2_IMAGE_SIZE || "1024x1536";
  const form = new FormData();
  form.append("model", model);
  form.append("prompt", prompt);
  form.append("size", size);
  form.append("quality", process.env.CO2_IMAGE_QUALITY || "high");
  form.append("n", "1");
  form.append("image", new Blob([readFileSync(ref)], { type: "image/webp" }), path.basename(ref));

  const res = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: `Bearer ${key}` }, body: form });
  if (!res.ok) throw new Error(`Image API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("Image API returned no image");

  mkdirSync(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12);
  const file = `${id}-${stamp}.png`;
  writeFileSync(path.join(OUT_DIR, file), Buffer.from(b64, "base64"));
  const [w, h] = size.split("x").map(Number);
  store.images[id] = { file: `/campaign/people/${file}`, status: "review", source: "ai-generated", model, createdAt: new Date().toISOString(), width: w, height: h };
  save(store);
  console.log(`✓ ${id} → public/campaign/people/${file} (status: review)`);
}

async function main() {
  const store = load();

  if (flag("list")) {
    for (const s of campaignScenes) {
      const e = store.images[s.id];
      console.log(`${s.id.padEnd(24)} ${s.product.padEnd(26)} ${(e?.status ?? "—").padEnd(9)} ${e?.file ?? ""}`);
    }
    return;
  }

  for (const action of ["approve", "reject"] as const) {
    const id = opt(action);
    if (id) {
      if (!store.images[id]) throw new Error(`No generated image for ${id}`);
      store.images[id].status = action === "approve" ? "approved" : "rejected";
      save(store);
      console.log(`${id}: ${store.images[id].status}. Rebuild/redeploy the site to publish.`);
      return;
    }
  }

  const only = opt("only")?.split(",").map((s) => s.trim());
  const ids = campaignScenes.map((s) => s.id).filter((id) => !only || only.includes(id));
  if (!ids.length) throw new Error("No matching scenes.");

  for (const id of ids) {
    if (flag("dry-run")) {
      const { prompt, ref } = promptFor(id);
      console.log(`\n--- ${id}\nreference: ${path.relative(ROOT, ref)}\n${prompt}`);
      continue;
    }
    try {
      await generate(id, store);
    } catch (e) {
      console.error(`✗ ${id}: ${(e as Error).message}`);
      process.exitCode = 1;
    }
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
