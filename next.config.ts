import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    deviceSizes: [480, 640, 828, 1080, 1200, 1600],
    imageSizes: [64, 128, 256, 384],
  },
  async redirects() {
    return [
      // the earlier skin-only consultation now lives in Make It Yours
      { source: "/customized-skincare", destination: "/make-it-yours/face", permanent: true },
      { source: "/customized-skincare/results", destination: "/make-it-yours/face/results", permanent: true },
      // Oct 2026: Makeup section and made-to-order catalogue cards removed;
      // customization has its own section
      { source: "/shop/made-personal", destination: "/customization", permanent: true },
      { source: "/collections/made-personal", destination: "/customization", permanent: true },
      { source: "/shop/makeup", destination: "/shop", permanent: true },
      { source: "/make-it-yours/makeup", destination: "/make-it-yours", permanent: true },
      { source: "/make-it-yours/makeup/results", destination: "/make-it-yours", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(products|campaign|brand|video)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
