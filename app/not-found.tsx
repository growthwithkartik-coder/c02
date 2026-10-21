import Link from "next/link";
import { Muse } from "@/components/face-hero/Muse";
import { NavTheme } from "@/components/navbar/nav-theme";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-carbon text-bone">
      <NavTheme tone="dark" />
      <div className="pointer-events-none absolute bottom-0 right-[-20%] aspect-[900/1100] h-[90%] opacity-60 md:right-0">
        <Muse className="h-full w-full" mirror />
      </div>
      <div className="container-site relative">
        <p className="eyebrow text-gold-light">404</p>
        <h1 className="mt-4 font-display text-display-lg">This page has <span className="italic text-gold-light">evaporated.</span></h1>
        <p className="mt-6 max-w-md text-bone/70">The link may be old, or the product may have moved. Everything else is right where you left it.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/shop" className="btn btn-gold btn-lg">Shop all products</Link>
          <Link href="/" className="btn btn-outline-light btn-lg">Back home</Link>
        </div>
      </div>
    </section>
  );
}
