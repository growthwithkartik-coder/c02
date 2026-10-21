import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/catalog";
import { departments } from "@/data/taxonomy";
import { collections } from "@/data/collections";
import { site } from "@/data/site";
import { combos } from "@/data/combos";
import { flows } from "@/lib/customize/flows";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (path: string, priority = 0.6, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly") => ({ url: `${site.url}${path}`, lastModified: now, changeFrequency, priority });
  return [
    u("/", 1, "daily"),
    u("/shop", 0.9, "daily"),
    u("/make-it-yours", 0.95),
    ...flows.map((f) => u(`/make-it-yours/${f.id}`, 0.8)),
    u("/make-it-yours/build", 0.7),
    u("/combos", 0.85),
    ...combos.map((c) => u(`/combos/${c.slug}`, 0.7)),
    u("/sampling", 0.85),
    u("/guides/customization", 0.5, "monthly"),
    u("/guides/sampling", 0.5, "monthly"),
    u("/guides/product-care", 0.5, "monthly"),
    u("/cancellation", 0.2, "yearly"),
    u("/collections", 0.8),
    u("/about", 0.6, "monthly"),
    u("/ingredients", 0.6, "monthly"),
    u("/contact", 0.4, "yearly"),
    u("/faq", 0.4, "monthly"),
    u("/shipping", 0.3, "yearly"),
    u("/returns", 0.3, "yearly"),
    u("/privacy", 0.2, "yearly"),
    u("/terms", 0.2, "yearly"),
    ...departments.map((d) => u(`/shop/${d.id}`, 0.9)),
    u("/shop/bestsellers", 0.8),
    u("/customization", 0.8),
    u("/services", 0.8),
    ...collections.map((c) => u(`/collections/${c.slug}`, 0.7)),
    ...getAllProducts().map((p) => u(`/product/${p.slug}`, 0.8)),
  ];
}
