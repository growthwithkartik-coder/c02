// Verifies every product's images exist and every collection slug is real.
// Run: npm run check
import { readFileSync, existsSync } from "node:fs";
const src = readFileSync(new URL("../data/products.ts", import.meta.url), "utf8");
const json = src.slice(src.indexOf("= [") + 2).trim().replace(/;\s*$/, "");
const products = eval(json);
let bad = 0;
for (const p of products) {
  for (const img of p.images) for (const s of [640, 1200]) {
    const f = new URL(`../public/products/${img}-${s}.webp`, import.meta.url);
    if (!existsSync(f)) { console.error("missing image", p.slug, img, s); bad++; }
  }
  if (p.cutout && !existsSync(new URL(`../public/campaign/${p.cutout}.webp`, import.meta.url))) { console.error("missing cutout", p.slug); bad++; }
  if (!p.custom && !p.images.length) { console.error("no photo", p.slug); bad++; }
}
const cols = readFileSync(new URL("../data/collections.ts", import.meta.url), "utf8");
const slugs = new Set(products.map((p) => p.slug));
for (const m of cols.matchAll(/products: \[([^\]]*)\]/g)) for (const s of m[1].match(/"[^"]+"/g) ?? []) if (!slugs.has(s.slice(1, -1))) { console.error("collection refers to unknown", s); bad++; }
const photographed = products.filter((p) => !p.custom).length;
console.log(`${products.length} products (${photographed} photographed, ${products.length - photographed} made-to-order), ${products.reduce((n, p) => n + p.images.length, 0)} photographs — ${bad ? bad + " problem(s)" : "all OK"}`);
process.exit(bad ? 1 : 0);
