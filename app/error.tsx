"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="container-site flex min-h-[70vh] flex-col justify-center pt-[var(--nav-h)]">
      <p className="eyebrow text-taupe">Something went wrong</p>
      <h1 className="mt-4 font-display text-display-md">A small hiccup.</h1>
      <p className="mt-4 max-w-md text-ink-soft">Please try again. If it keeps happening, let us know.</p>
      <div className="mt-8 flex gap-3">
        <button onClick={reset} className="btn btn-primary">Try again</button>
        <Link href="/contact" className="btn btn-outline">Contact us</Link>
      </div>
    </section>
  );
}
