/* Custom next/image loader.
   Product photographs ship pre-optimised at 640 and 1200 px
   (/products/<key>-640.webp | -1200.webp). The loader picks the right
   file for the requested width so no runtime image server is needed
   and the site can deploy anywhere (Vercel, Netlify, a VPS, static CDN). */
/* Images under /products, /campaign, /brand and /video are served with a
   one-year "immutable" cache. Bump ASSET_VERSION whenever any of those files
   change, so browsers and CDNs fetch the new file instead of a cached copy. */
export const ASSET_VERSION = "20261018c";
export const versioned = (src: string) => (/^\/(products|campaign|brand|video)\//.test(src) && !/[?&]v=/.test(src) ? `${src}${src.includes("?") ? "&" : "?"}v=${ASSET_VERSION}` : src);

export default function co2ImageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const m = src.split("?")[0].match(/^\/products\/(.+)-(640|1200)\.webp$/);
  if (m) {
    const size = width <= 700 ? 640 : 1200;
    return versioned(`/products/${m[1]}-${size}.webp`);
  }
  // campaign cutouts / brand assets are already sized; append width so
  // the srcset entries stay unique (ignored by the static server)
  const v = versioned(src);
  return `${v}${v.includes("?") ? "&" : "?"}w=${width}`;
}
