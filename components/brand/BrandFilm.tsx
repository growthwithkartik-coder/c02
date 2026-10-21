"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { versioned } from "@/lib/image-loader";

/* The CO2 brand film — composed from the real product cut-outs
   (scripts/make-brand-film.py). Autoplays muted and looped where allowed,
   pauses off-screen, never autoplays with prefers-reduced-motion, and
   falls back to the poster frame if the video can't load.
   Replace the files in /public/video to use new footage — the asset
   brief is in docs/VIDEO-ASSETS.md. */

export const FILM = {
  mp4: versioned("/video/co2-film-1600.mp4"),
  webm: versioned("/video/co2-film-1600.webm"),
  portrait: versioned("/video/co2-film-900.mp4"),
  poster: versioned("/video/co2-film-poster.webp"),
  posterPortrait: versioned("/video/co2-film-poster-portrait.webp"),
};

export function BrandFilm({
  className,
  overlay = true,
  children,
  label = "CO2 products in slow motion — serum, creams, glosses, body and hair care",
}: {
  className?: string;
  overlay?: boolean;
  children?: React.ReactNode;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(r);
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (r) return;
        if (e.isIntersecting) v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        else {
          v.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className={cn("relative overflow-hidden bg-carbon", className)}>
      {failed ? (
        <picture>
          <source media="(max-width: 640px)" srcSet={FILM.posterPortrait} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FILM.poster} alt={label} className="absolute inset-0 h-full w-full object-cover" />
        </picture>
      ) : (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          poster={FILM.poster}
          aria-label={label}
          onError={() => setFailed(true)}
        >
          <source src={FILM.portrait} type="video/mp4" media="(max-width: 640px)" />
          <source src={FILM.webm} type="video/webm" />
          <source src={FILM.mp4} type="video/mp4" />
        </video>
      )}
      {overlay && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/80 via-carbon/20 to-carbon/30" aria-hidden />}
      {children && <div className="relative h-full">{children}</div>}
      {!failed && (
        <button
          type="button"
          onClick={toggle}
          className="absolute bottom-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-bone/30 bg-carbon/50 text-bone backdrop-blur transition-colors hover:bg-bone hover:text-carbon"
          aria-label={playing ? "Pause video" : "Play video"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      )}
      {reduce && !playing && <span className="sr-only">Video paused because reduced motion is on. Use the play button to start it.</span>}
    </div>
  );
}
