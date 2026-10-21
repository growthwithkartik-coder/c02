import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/checkout", "/cart", "/account", "/wishlist", "/order/"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
