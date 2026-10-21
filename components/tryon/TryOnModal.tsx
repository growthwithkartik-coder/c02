"use client";

import Link from "next/link";
import { Camera, CameraOff, Check, ImageUp, Loader2, RotateCcw, ShieldCheck, SplitSquareHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Overlay } from "@/components/ui/Overlay";
import { useStore } from "@/components/providers/StoreProvider";
import { useTryOn } from "./TryOnProvider";
import { getProduct } from "@/lib/catalog";
import { getTryOnShades, type TryOnShade } from "@/lib/taxonomy";
import { cameraErrorMessage, createFaceMesh, fileToCanvas, LipRenderer, LipSmoother, lipPoints, startCamera, stopStream, type CameraError, type FaceMeshLike, type Landmarks } from "@/lib/tryon/lips";
import { cn, isPricePending, money } from "@/lib/utils";

import { priceWhatsAppHref } from "@/components/commerce/PriceOnRequest";
/* ------------------------------------------------------------------
   Virtual lip try-on (camera or photo). All processing happens in the
   browser; frames and photos never leave the device and are not saved.
------------------------------------------------------------------- */

type Mode = "choose" | "camera" | "photo";
type Status = "idle" | "loading-model" | "starting-camera" | "detecting" | "ready" | "no-face" | "error";

const shades = getTryOnShades();
const lipsticks = shades.filter((s) => s.line === "lipstick");
const glosses = shades.filter((s) => s.line === "gloss");
const families = shades.filter((s) => s.indicative);
const priceText = (slug: string) => {
  const p = getProduct(slug);
  if (!p) return "";
  return isPricePending(p) ? "Price on request" : money(p.price);
};

export function TryOnModal() {
  const { isOpen, close, shadeId, setShadeId } = useTryOn();
  const { addToCart } = useStore();
  const shade = shades.find((s) => s.id === shadeId) ?? shades[0];

  const [mode, setMode] = useState<Mode>("choose");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(0.8);
  const [compare, setCompare] = useState(false);
  const [split, setSplit] = useState(0.5);
  const [mirror, setMirror] = useState(true);
  const [added, setAdded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fmRef = useRef<FaceMeshLike | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const renderer = useRef<LipRenderer | null>(null);
  const smoother = useRef(new LipSmoother());
  const photoRef = useRef<HTMLCanvasElement | null>(null);
  const lastLips = useRef<ReturnType<typeof lipPoints> | null>(null);
  const lastImage = useRef<CanvasImageSource | null>(null);
  const modeRef = useRef<Mode>("choose");
  const styleRef = useRef({ hex: shade.hex, intensity, finish: shade.finish as "gloss" | "satin" });
  const viewRef = useRef({ compare, split, mirror });
  const photoWaiter = useRef<((ok: boolean) => void) | null>(null);

  styleRef.current = { hex: shade.hex, intensity, finish: shade.finish };
  viewRef.current = { compare, split, mirror: mode === "camera" && mirror };
  modeRef.current = mode;

  /* ---------- drawing ---------- */
  const draw = useCallback(() => {
    const c = canvasRef.current;
    const src = lastImage.current;
    if (!c || !src) return;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    renderer.current ??= new LipRenderer();
    const { compare: cmp, split: sp, mirror: mir } = viewRef.current;
    // "Before" is the LEFT side of the screen. When the camera view is mirrored, screen-left is canvas-right.
    const before = cmp ? (mir ? { x: c.width * (1 - sp), y: 0, w: c.width * sp, h: c.height } : { x: 0, y: 0, w: c.width * sp, h: c.height }) : null;
    renderer.current.render(ctx, src, lastLips.current, styleRef.current, before);
  }, []);

  // redraw a still photo whenever the shade / intensity / compare view changes
  useEffect(() => {
    if (mode === "photo") draw();
  }, [mode, shadeId, intensity, compare, split, draw]);

  /* ---------- face mesh ---------- */
  const ensureModel = useCallback(async () => {
    if (fmRef.current) return fmRef.current;
    setStatus("loading-model");
    const fm = await createFaceMesh((lm: Landmarks | null, image) => {
      const c = canvasRef.current;
      if (!c) return;
      if (modeRef.current === "camera") {
        const v = videoRef.current!;
        lastImage.current = v;
        if (lm) {
          lastLips.current = smoother.current.next(lipPoints(lm, c.width, c.height));
        } else {
          smoother.current.reset();
          lastLips.current = null;
        }
        setStatus((s) => (lm ? "ready" : s === "ready" || s === "detecting" ? "no-face" : s));
        if (lm) setStatus("ready");
        draw();
      } else if (modeRef.current === "photo") {
        lastImage.current = photoRef.current ?? image;
        lastLips.current = lm ? lipPoints(lm, c.width, c.height) : null;
        photoWaiter.current?.(!!lm);
        photoWaiter.current = null;
      }
    });
    fmRef.current = fm;
    return fm;
  }, [draw]);

  /* ---------- camera ---------- */
  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    stopStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const startCam = useCallback(async () => {
    setMessage(null);
    setCompare(false);
    stopCamera();
    setMode("camera");
    modeRef.current = "camera";
    lastLips.current = null;
    lastImage.current = null;
    smoother.current.reset();
    try {
      setStatus("starting-camera");
      const v = videoRef.current!;
      streamRef.current = await startCamera(v);
      const c = canvasRef.current!;
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      const fm = await ensureModel();
      if (modeRef.current !== "camera") return;
      setStatus("detecting");
      let busy = false;
      const loop = async () => {
        if (modeRef.current !== "camera" || !streamRef.current) return;
        if (!busy && v.readyState >= 2) {
          busy = true;
          try {
            await fm.send({ image: v });
          } catch {
            /* dropped frame */
          }
          busy = false;
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch (e) {
      stopCamera();
      setStatus("error");
      setMessage(typeof e === "string" ? cameraErrorMessage(e as CameraError) : (e as Error)?.message || cameraErrorMessage("unknown"));
    }
  }, [ensureModel, stopCamera]);

  /* ---------- photo ---------- */
  const loadPhoto = useCallback(
    async (file: File) => {
      stopCamera();
      setMessage(null);
      setCompare(false);
      setMode("photo");
      modeRef.current = "photo";
      lastLips.current = null;
      try {
        const pc = await fileToCanvas(file);
        photoRef.current = pc;
        const c = canvasRef.current!;
        c.width = pc.width;
        c.height = pc.height;
        lastImage.current = pc;
        draw();
        const fm = await ensureModel();
        setStatus("detecting");
        fm.reset();
        const found = await new Promise<boolean>((resolve) => {
          photoWaiter.current = resolve;
          fm.send({ image: pc }).catch(() => resolve(false));
        });
        lastImage.current = pc;
        draw();
        if (found) setStatus("ready");
        else {
          setStatus("no-face");
          setMessage("We couldn't find lips in this photo. Use a clear, well-lit, front-facing photo with your whole mouth visible.");
        }
      } catch (e) {
        setStatus("error");
        setMessage((e as Error)?.message || "This photo couldn't be processed.");
      }
    },
    [draw, ensureModel, stopCamera],
  );

  const reset = useCallback(() => {
    stopCamera();
    photoRef.current = null;
    lastImage.current = null;
    lastLips.current = null;
    setMode("choose");
    setStatus("idle");
    setMessage(null);
    setIntensity(0.8);
    setCompare(false);
    setSplit(0.5);
    if (fileRef.current) fileRef.current.value = "";
  }, [stopCamera]);

  // closing the dialog always switches the camera off and forgets the photo
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);
  useEffect(
    () => () => {
      stopCamera();
      fmRef.current?.close().catch(() => undefined);
      fmRef.current = null;
    },
    [stopCamera],
  );

  /* ---------- before/after divider ---------- */
  const dragSplit = (e: React.PointerEvent) => {
    const el = canvasRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setSplit(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  };

  const product = getProduct(shade.slug);
  const busy = status === "loading-model" || status === "starting-camera" || status === "detecting";

  const pending = isPricePending(product);

  function addShade() {
    if (!product || pending) return;
    if (shade.indicative) return; // made-to-order: goes to the product page to set options
    addToCart(product.slug, 1, { shade: shade.name });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <Overlay open={isOpen} onClose={close} label="Virtual lip try-on" side="center" className="max-md:inset-0 max-md:h-[100dvh] max-md:max-h-none max-md:w-full md:h-[min(780px,92dvh)]">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 md:px-6">
        <div>
          <p className="eyebrow text-taupe">Virtual try-on</p>
          <p className="font-display text-2xl leading-tight md:text-3xl">Try lip shades on your face</p>
        </div>
        <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full border border-line hover:border-ink" aria-label="Close try-on">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[minmax(0,1fr)_340px] md:grid-rows-1">
        {/* stage */}
        <div className="relative flex min-h-0 flex-[1.35] flex-col bg-carbon text-bone md:flex-none">
          <div ref={stageRef} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
            <video ref={videoRef} className="hidden" playsInline muted aria-hidden />
            <canvas
              ref={canvasRef}
              className={cn("max-h-full max-w-full", mode === "choose" && "hidden", mode === "camera" && mirror && "-scale-x-100")}
              aria-label={mode === "camera" ? "Live camera preview with the selected lip shade" : "Your photo with the selected lip shade"}
              role="img"
              data-testid="tryon-canvas"
            />

            {/* before / after divider (screen-space, never mirrored) */}
            {compare && mode !== "choose" && (
              <CompareDivider split={split} setSplit={setSplit} onDrag={dragSplit} canvas={canvasRef} />
            )}

            {mode === "choose" && (
              <div className="w-full max-w-md px-6 text-center">
                <p className="font-display text-3xl leading-tight">See the shade on you.</p>
                <p className="mt-3 text-sm leading-relaxed text-bone/70">Use your camera for a live preview, or upload a clear front-facing photo. The colour follows your lip shape and leaves your teeth and skin untouched.</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={startCam} className="btn btn-gold" data-testid="tryon-camera">
                    <Camera className="h-4 w-4" /> Try with camera
                  </button>
                  <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-outline-light" data-testid="tryon-upload">
                    <ImageUp className="h-4 w-4" /> Upload a photo
                  </button>
                </div>
                <p className="mt-6 flex items-start justify-center gap-2 text-left text-xs leading-relaxed text-bone/55">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" aria-hidden />
                  Processed on your device. Your camera feed and photos are never uploaded or saved.
                </p>
              </div>
            )}

            {/* status overlays */}
            {busy && mode !== "choose" && (
              <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-carbon/80 px-4 py-2 text-xs text-bone">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  {status === "loading-model" ? "Loading face tracking (first time only)…" : status === "starting-camera" ? "Waiting for camera permission…" : "Finding your lips…"}
                </span>
              </div>
            )}
            {status === "no-face" && mode === "camera" && (
              <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center">
                <span className="rounded-full bg-carbon/80 px-4 py-2 text-xs text-bone">Face the camera in good light so we can find your lips.</span>
              </div>
            )}
            {message && (
              <div className="absolute inset-x-4 bottom-4 mx-auto max-w-lg border border-gold-light/40 bg-carbon/90 p-4 text-sm leading-relaxed text-bone" role="alert">
                {message}
                <div className="mt-3 flex flex-wrap gap-2">
                  {mode !== "photo" && <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-sm btn-light">Upload a photo</button>}
                  {mode === "photo" && <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-sm btn-light">Choose another photo</button>}
                  <button type="button" onClick={startCam} className="btn btn-sm btn-outline-light">Try camera again</button>
                </div>
              </div>
            )}
            {compare && mode !== "choose" && (
              <>
                <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-carbon/70 px-3 py-1 text-[0.6875rem] uppercase tracking-[0.16em]">Before</span>
                <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-carbon/70 px-3 py-1 text-[0.6875rem] uppercase tracking-[0.16em]">After</span>
              </>
            )}
          </div>

          {/* stage controls */}
          {mode !== "choose" && (
            <div className="flex items-center gap-2 overflow-x-auto border-t border-line-dark px-3 py-2.5 no-scrollbar md:flex-wrap md:px-4 [&_.btn]:shrink-0">
              {mode === "camera" ? (
                <button type="button" onClick={() => { stopCamera(); setMode("choose"); setStatus("idle"); }} className="btn btn-sm btn-outline-light" data-testid="tryon-stop">
                  <CameraOff className="h-3.5 w-3.5" /> Stop camera
                </button>
              ) : (
                <button type="button" onClick={startCam} className="btn btn-sm btn-outline-light">
                  <Camera className="h-3.5 w-3.5" /> Use camera
                </button>
              )}
              <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-sm btn-outline-light">
                <ImageUp className="h-3.5 w-3.5" /> {mode === "photo" ? "New photo" : "Upload photo"}
              </button>
              <button type="button" onClick={() => setCompare((c) => !c)} aria-pressed={compare} className={cn("btn btn-sm", compare ? "btn-light" : "btn-outline-light")} data-testid="tryon-compare">
                <SplitSquareHorizontal className="h-3.5 w-3.5" /> Before / after
              </button>
              <button type="button" onClick={reset} className="btn btn-sm btn-outline-light" data-testid="tryon-reset">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              {mode === "camera" && (
                <label className="ml-auto flex shrink-0 items-center gap-2 pl-2 text-xs text-bone/70">
                  <input type="checkbox" checked={mirror} onChange={(e) => setMirror(e.target.checked)} className="accent-[#E2C68C]" /> Mirror
                </label>
              )}
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-label="Upload a photo of your face"
            data-testid="tryon-file"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) loadPhoto(f);
            }}
          />
        </div>

        {/* shade panel */}
        <div className="min-h-0 flex-1 overflow-y-auto border-t border-line md:border-l md:border-t-0" data-lenis-prevent>
          <div className="p-4 md:p-6">
            <div className="flex items-center gap-3" aria-live="polite">
              <span className="h-10 w-10 shrink-0 rounded-full ring-1 ring-black/10" style={{ background: shade.hex }} aria-hidden />
              <div className="min-w-0">
                <p className="eyebrow text-taupe">Selected shade</p>
                <p className="truncate font-display text-2xl leading-tight" data-testid="tryon-shade-name">{shade.name}</p>
                <p className="text-xs text-ink-soft">{shade.indicative ? "Made-to-order colour family · indicative" : `${product?.name} · ${priceText(shade.slug)}`}</p>
              </div>
            </div>

            {[
              { label: "CO2 lipstick", list: lipsticks },
              { label: "CO2 lip gloss", list: glosses },
            ]
              .filter((g) => g.list.length)
              .map((g) => (
                <fieldset key={g.label} className="mt-6">
                  <legend className="label">{g.label}</legend>
                  <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 no-scrollbar md:mx-0 md:grid md:grid-cols-1 md:px-0">
                    {g.list.map((s) => <ShadeButton key={s.id} s={s} active={s.id === shade.id} onSelect={() => setShadeId(s.id)} />)}
                  </div>
                </fieldset>
              ))}

            <fieldset className="mt-6">
              <legend className="label">Made-to-order lip colour</legend>
              <p className="mt-1 text-xs text-taupe">Colour families for the custom lip formula. The final colour is matched to you.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {families.map((s) => (
                  <button key={s.id} type="button" onClick={() => setShadeId(s.id)} aria-pressed={s.id === shade.id} aria-label={`${s.name} (indicative)`} title={s.name} className={cn("h-9 w-9 rounded-full ring-offset-2 ring-offset-bone transition", s.id === shade.id ? "ring-2 ring-ink" : "ring-1 ring-black/10 hover:ring-taupe")} style={{ background: s.hex }} />
                ))}
              </div>
            </fieldset>

            <div className="mt-6">
              <label htmlFor="tryon-intensity" className="label flex justify-between">
                <span>Intensity</span>
                <span className="normal-case tracking-normal text-ink">{Math.round(intensity * 100)}%</span>
              </label>
              <input id="tryon-intensity" type="range" min={0.3} max={1} step={0.05} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="mt-3 w-full accent-[#1A1814]" />
              <p className="mt-1 text-xs text-taupe">Lower for a sheer wash of colour, higher for full payoff.</p>
            </div>

            <div className="mt-6 space-y-2">
              {shade.indicative ? (
                <Link href="/make-it-yours/build?product=custom-lip" onClick={close} className="btn btn-primary w-full">Personalize lip colour</Link>
              ) : pending ? (
                <>
                  <p className="border border-line bg-bone-2/60 p-3 text-center text-sm text-ink-soft" data-testid="tryon-price-pending">{shade.name} — price on request · as per customization</p>
                  {product && <a target="_blank" rel="noopener noreferrer" data-whatsapp-price href={priceWhatsAppHref(`${product.name} — ${shade.name}`)} onClick={close} className="btn btn-primary w-full">Request price</a>}
                </>
              ) : (
                <button type="button" onClick={addShade} className="btn btn-primary w-full" data-testid="tryon-add">
                  {added ? <><Check className="h-4 w-4" /> Added to bag</> : <>Add {shade.name} — {product ? money(product.price) : ""}</>}
                </button>
              )}
              {product && (
                <Link href={`/product/${product.slug}`} onClick={close} className="btn btn-outline w-full">View product</Link>
              )}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-taupe">A digital preview: real colour varies with your natural lip colour, lighting and screen. Camera access needs HTTPS.</p>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

function ShadeButton({ s, active, onSelect }: { s: TryOnShade; active: boolean; onSelect: () => void }) {
  const p = getProduct(s.slug);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      data-testid={`tryon-shade-${s.id}`}
      className={cn("flex shrink-0 items-center gap-3 border p-2 pr-3 text-left transition-colors md:w-full", active ? "border-ink bg-ink text-bone" : "border-line hover:border-ink")}
    >
      <span className="h-8 w-8 shrink-0 rounded-full ring-1 ring-white/30" style={{ background: s.hex }} aria-hidden />
      <span className="min-w-0">
        <span className="block text-sm font-medium">{s.name}</span>
        <span className={cn("block text-xs", active ? "text-bone/60" : "text-taupe")}>{s.line === "lipstick" ? "Lipstick" : "High-shine gloss"}{p ? ` · ${priceText(p.slug)}` : ""}</span>
      </span>
      {active && <Check className="ml-auto hidden h-4 w-4 md:block" aria-hidden />}
    </button>
  );
}

function CompareDivider({ split, setSplit, onDrag, canvas }: { split: number; setSplit: (n: number) => void; onDrag: (e: React.PointerEvent) => void; canvas: React.RefObject<HTMLCanvasElement | null> }) {
  const [rect, setRect] = useState<{ left: number; width: number; top: number; height: number } | null>(null);
  useEffect(() => {
    const update = () => {
      const c = canvas.current;
      const parent = c?.parentElement;
      if (!c || !parent) return;
      const r = c.getBoundingClientRect();
      const p = parent.getBoundingClientRect();
      setRect({ left: r.left - p.left, width: r.width, top: r.top - p.top, height: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    if (canvas.current) ro.observe(canvas.current);
    return () => ro.disconnect();
  }, [canvas]);
  if (!rect) return null;
  return (
    <div
      className="absolute cursor-ew-resize touch-none"
      style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        onDrag(e);
      }}
      onPointerMove={(e) => e.buttons && onDrag(e)}
    >
      <div className="absolute inset-y-0 w-px bg-bone" style={{ left: `${split * 100}%` }}>
        <span className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-bone text-carbon shadow">
          <SplitSquareHorizontal className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(split * 100)}
        onChange={(e) => setSplit(Number(e.target.value) / 100)}
        aria-label="Before and after divider position"
        className="sr-only"
      />
    </div>
  );
}
