"use client";

import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Rise + fade when the element enters the viewport (once). */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "article" | "span";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

/** Masked line-by-line reveal for display headings. Pass lines as an array. */
export function LineReveal({ lines, className, lineClassName, delay = 0, immediate = false }: { lines: React.ReactNode[]; className?: string; lineClassName?: string; delay?: number; immediate?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const show = immediate || inView;
  return (
    <span ref={ref} className={cn("block", className)}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={cn("block", lineClassName)}
            initial={reduce ? false : { y: "110%" }}
            animate={show ? { y: "0%" } : undefined}
            transition={{ duration: 1.2, ease: EASE, delay: delay + i * 0.09 }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Scroll-scrubbed word highlight (words go from faint to full as you scroll). */
export function ScrubWords({ text, className, wordClassName }: { text: string; className?: string; wordClassName?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} className={wordClassName}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range, className }: { children: string; progress: MotionValue<number>; range: [number, number]; className?: string }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className={cn("inline-block", className)}>
      {children}&nbsp;
    </motion.span>
  );
}

/** Vertical parallax relative to the element's own scroll progress. */
export function Parallax({ children, className, speed = 0.15 }: { children: React.ReactNode; className?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/** Magnetic hover for CTAs (fine pointers only). */
export function Magnetic({ children, strength = 0.25, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const x = useSpring(0, { stiffness: 220, damping: 18 });
  const y = useSpring(0, { stiffness: 220, damping: 18 });
  useEffect(() => {
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={enabled ? { x, y } : undefined}
      onPointerMove={(e) => {
        if (!enabled || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Infinite marquee row. */
export function Marquee({ children, className, reverse }: { children: React.ReactNode; className?: string; reverse?: boolean }) {
  return (
    <div className={cn("flex overflow-hidden", className)} aria-hidden="true">
      <div className={cn("flex min-w-max shrink-0 animate-marquee", reverse && "[animation-direction:reverse]")}>
        {children}
        {children}
      </div>
    </div>
  );
}
