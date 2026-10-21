/* Verifies the Make It Yours / sampling / combos configuration against the
   catalogue. Run: npm run check:config */
import { products } from "../data/products";
import { customFormulas } from "../data/custom-formulas";
import { sampling } from "../data/sampling";
import { combos } from "../data/combos";
import { buildProducts, containers, packColours, capFinishes, formatToBuild } from "../data/customize";
import { flows } from "../lib/customize/flows";

const bySlug = new Map([...products, ...customFormulas].map((p) => [p.slug, p]));
const errors: string[] = [];
for (const p of products) if (p.custom) errors.push(`catalogue: ${p.slug} is a made-to-order formula — it belongs in data/custom-formulas.ts`);
for (const [slug, s] of Object.entries(sampling.items)) {
  const p = bySlug.get(slug);
  if (!p) errors.push(`sampling: unknown product ${slug}`);
  else if (p.custom) errors.push(`sampling: ${slug} is made to order`);
  if (!(s.price > 0)) errors.push(`sampling: ${slug} has no price`);
}
for (const set of sampling.sets) for (const s of set.slugs) if (!sampling.items[s]) errors.push(`sample set ${set.id}: ${s} has no travel size`);
for (const c of combos) for (const i of c.items) if (!bySlug.has(i.slug)) errors.push(`combo ${c.slug}: unknown product ${i.slug}`);
for (const b of buildProducts) {
  if (b.mode === "listed" && (!b.slug || !bySlug.get(b.slug)?.custom)) errors.push(`builder ${b.id}: listed formula must point to a made-to-order product`);
  b.containers.forEach((c) => !containers[c] && errors.push(`builder ${b.id}: unknown container ${c}`));
  b.colours.forEach((c) => !packColours[c] && errors.push(`builder ${b.id}: unknown colour ${c}`));
  b.caps.forEach((c) => !capFinishes[c] && errors.push(`builder ${b.id}: unknown cap ${c}`));
}
for (const [f, id] of Object.entries(formatToBuild)) if (!buildProducts.some((b) => b.id === id)) errors.push(`formatToBuild ${f}: unknown builder product ${id}`);
for (const f of flows) {
  const ids = f.questions.map((q) => q.id);
  if (new Set(ids).size !== ids.length) errors.push(`flow ${f.id}: duplicate question ids`);
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`config OK — ${Object.keys(sampling.items).length} travel sizes, ${sampling.sets.length} sample sets, ${combos.length} combos, ${buildProducts.length} customizable products, ${flows.length} consultations`);
