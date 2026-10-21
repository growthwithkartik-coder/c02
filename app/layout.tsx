import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { TryOnProvider } from "@/components/tryon/TryOnProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/navbar/Navbar";
import { MobileMenu } from "@/components/navbar/MobileMenu";
import { Footer } from "@/components/footer/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { QuickView } from "@/components/product-details/QuickView";
import { CompareTray } from "@/components/product-details/Compare";
import { Toaster } from "@/components/ui/Toaster";
import { Cursor } from "@/components/animations/Cursor";
import { Intro } from "@/components/animations/Intro";
import { JsonLd } from "@/components/ui/JsonLd";
import { HideOnRoutes } from "@/components/ui/HideOnRoutes";
import { FloatingActions } from "@/components/brand/FloatingActions";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `CO2 — ${site.tagline}`, template: "%s · CO2" },
  description: site.description,
  applicationName: "CO2",
  keywords: ["CO2 cosmetics", "personalized skincare", "custom skincare India", "made to order cosmetics", "travel size skincare", "24K gold serum", "lip gloss", "Indian skincare"],
  openGraph: {
    type: "website",
    siteName: "CO2",
    locale: site.locale,
    url: site.url,
    title: `CO2 — ${site.tagline}`,
    description: site.description,
    images: [{ url: "/products/24k-gold-face-elixir-1-1200.webp", width: 1200, height: 1200, alt: "CO2 24K Gold Face Elixir" }],
  },
  twitter: { card: "summary_large_image", title: `CO2 — ${site.tagline}`, description: site.description, images: ["/products/24k-gold-face-elixir-1-1200.webp"] },
  icons: { icon: [{ url: "/brand/favicon-64.png", sizes: "64x64" }], apple: "/brand/favicon-180.png" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [{ color: "#11100D" }],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-4 focus:py-2 focus:text-bone">
          Skip to content
        </a>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "CO2",
            legalName: site.legalName,
            url: site.url,
            logo: `${site.url}/brand/co2-logo-360.png`,
            slogan: site.tagline,
            contactPoint: [{ "@type": "ContactPoint", email: site.contact.email, telephone: site.contact.phone, contactType: "customer support", areaServed: "IN" }],
          }}
        />
        <StoreProvider>
          <TryOnProvider>
          <SmoothScroll />
          <Intro />
          <HideOnRoutes routes={["/checkout"]}>
            <Navbar />
          </HideOnRoutes>
          <MobileMenu />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <HideOnRoutes routes={["/checkout"]}>
            <Footer />
          </HideOnRoutes>
          <CartDrawer />
          <SearchOverlay />
          <QuickView />
          <CompareTray />
          <FloatingActions />
          <Toaster />
          <Cursor />
          </TryOnProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
