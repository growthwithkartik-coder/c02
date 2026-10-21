"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { site } from "@/data/site";
import { sampling } from "@/data/sampling";
import { cn } from "@/lib/utils";

/* Two floating actions:
   1. WhatsApp — bottom-right, direct chat with the real business number
      from data/site.ts (never invented), with a short pre-filled message.
   2. Try Sampling — a compact pill, bottom-left, opening the Sampling Studio.
   Both lift above the product page's sticky buy bar and are hidden on
   checkout / cart, where they would cover essential controls. The sampling
   pill can be dismissed for the session. */

const HIDE_ON = ["/checkout", "/cart"];

export function FloatingActions() {
  const pathname = usePathname();
  const [raised, setRaised] = useState(false);
  const [samplingHidden, setSamplingHidden] = useState(false);
  const [msg, setMsg] = useState(encodeURIComponent("Hi CO2 — I have a question."));
  useEffect(() => {
    // read the page title after mount (not during render) to keep SSR and client markup identical
    const t = window.setTimeout(() => {
      const name = pathname.startsWith("/product/") ? document.title.split("·")[0].split("—")[0].trim() : "";
      setMsg(encodeURIComponent(`Hi CO2 — I have a question${name ? ` about ${name}` : ""}.`));
    }, 300);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    try {
      setSamplingHidden(sessionStorage.getItem("co2.float.sampling") === "0");
    } catch {}
    const el = document.documentElement;
    const read = () => setRaised(el.dataset.buybar === "true");
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ["data-buybar"] });
    return () => mo.disconnect();
  }, []);

  if (HIDE_ON.some((r) => pathname === r || pathname.startsWith(r + "/"))) return null;
  const onSampling = pathname.startsWith("/sampling");
  const onBuilder = pathname.startsWith("/make-it-yours/");
  const bottom = raised ? "bottom-[5.5rem] sm:bottom-24" : "bottom-4 sm:bottom-6";

  return (
    <>
      <a
        href={`https://wa.me/${site.contact.whatsapp}?text=${msg}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with CO2 on WhatsApp (opens in a new tab)"
        className={cn(
          "fixed right-4 z-[45] grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,.45)] transition-[bottom,transform] duration-500 ease-expo hover:scale-105 focus-visible:outline-offset-4 sm:right-6",
          bottom,
        )}
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="currentColor">
          <path d="M16.004 3C8.82 3 3 8.82 3 16c0 2.29.6 4.53 1.74 6.5L3 29l6.67-1.71A12.95 12.95 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16.004 3Zm0 23.64c-2.02 0-4-.54-5.72-1.57l-.41-.24-3.96 1.02 1.06-3.86-.27-.4A10.58 10.58 0 0 1 5.4 16c0-5.85 4.76-10.6 10.6-10.6 5.85 0 10.6 4.76 10.6 10.6 0 5.85-4.75 10.64-10.6 10.64Zm5.82-7.94c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.72.16-.21.32-.82 1.03-1 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65 0 1.56 1.14 3.07 1.3 3.28.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" />
        </svg>
      </a>

      {sampling.enabled && !samplingHidden && !onSampling && !onBuilder && (
        <div className={cn("fixed left-4 z-[44] flex items-center transition-[bottom] duration-500 ease-expo sm:left-6", bottom)}>
          <Link
            href="/sampling"
            className="group inline-flex h-11 items-center gap-2.5 rounded-full border border-gold/60 bg-carbon pl-2 pr-4 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-bone shadow-[0_10px_30px_-10px_rgba(0,0,0,.5)] transition-colors hover:bg-gold hover:text-carbon"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-light text-carbon transition-colors group-hover:bg-carbon group-hover:text-gold-light" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 3h6M10 3v4.5L5.5 17A2.5 2.5 0 0 0 7.8 20.5h8.4a2.5 2.5 0 0 0 2.3-3.5L14 7.5V3" /><path d="M7.5 14h9" /></svg>
            </span>
            Try sampling
          </Link>
          <button
            type="button"
            onClick={() => {
              setSamplingHidden(true);
              try {
                sessionStorage.setItem("co2.float.sampling", "0");
              } catch {}
            }}
            className="ml-1 grid h-7 w-7 place-items-center rounded-full bg-bone/90 text-ink shadow ring-1 ring-line hover:bg-bone"
            aria-label="Hide the Try sampling button"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </>
  );
}
