/* ------------------------------------------------------------------
   CO2 virtual lip try-on — face tracking + lip colour renderer.

   Face tracking: MediaPipe Face Mesh (Google, Apache-2.0), 468 face
   landmarks + refined lip/iris landmarks. The model and WebAssembly
   runtime are served from this site (/public/mediapipe/face_mesh), so
   NOTHING is sent to a server or third party: every camera frame and
   uploaded photo is processed inside the customer's browser and is
   never stored.

   Rendering: the outer lip contour is filled, the inner mouth contour
   is cut out (so teeth and the inside of the mouth are never coloured),
   the edge is feathered, and the shade is applied per pixel using the
   lip's own luminance so natural shadows, lines and highlights stay
   visible. Gloss shades add a specular highlight derived from the
   lip's real highlights.
------------------------------------------------------------------- */

export type Pt = { x: number; y: number };
export type Landmarks = { x: number; y: number; z: number }[];

/* MediaPipe Face Mesh lip contours (canonical landmark indices) */
export const OUTER_LIP = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];
export const INNER_LIP = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];

/* ---------------- face mesh loader ---------------- */

type FaceMeshResults = { multiFaceLandmarks?: Landmarks[]; image: CanvasImageSource };
export interface FaceMeshLike {
  setOptions(o: Record<string, unknown>): void;
  onResults(cb: (r: FaceMeshResults) => void): void;
  initialize(): Promise<void>;
  send(i: { image: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement }): Promise<void>;
  reset(): void;
  close(): Promise<void>;
}

const BASE = "/mediapipe/face_mesh";
let scriptPromise: Promise<void> | null = null;

function loadScript() {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    if ((window as unknown as { FaceMesh?: unknown }).FaceMesh) return resolve();
    const s = document.createElement("script");
    s.src = `${BASE}/face_mesh.js`;
    s.async = true;
    s.crossOrigin = "anonymous";
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("The face-tracking library could not be loaded."));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/** Creates and initialises a Face Mesh instance. Results are delivered to `onResults`. */
export async function createFaceMesh(onResults: (landmarks: Landmarks | null, image: CanvasImageSource) => void): Promise<FaceMeshLike> {
  await loadScript();
  const Ctor = (window as unknown as { FaceMesh: new (o: { locateFile: (f: string) => string }) => FaceMeshLike }).FaceMesh;
  const fm = new Ctor({ locateFile: (f) => `${BASE}/${f}` });
  fm.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5, selfieMode: false });
  fm.onResults((r) => onResults(r.multiFaceLandmarks?.[0] ?? null, r.image));
  await fm.initialize();
  return fm;
}

/* ---------------- geometry ---------------- */

export function lipPoints(lm: Landmarks, w: number, h: number) {
  const map = (i: number) => ({ x: lm[i].x * w, y: lm[i].y * h });
  return { outer: OUTER_LIP.map(map), inner: INNER_LIP.map(map) };
}

/** Exponential smoothing for live video (reduces landmark jitter). */
export class LipSmoother {
  private prev: { outer: Pt[]; inner: Pt[] } | null = null;
  constructor(private alpha = 0.55) {}
  reset() {
    this.prev = null;
  }
  next(cur: { outer: Pt[]; inner: Pt[] }) {
    if (!this.prev) return (this.prev = cur);
    // larger movement → follow faster (keeps up with head turns)
    const d = Math.hypot(cur.outer[0].x - this.prev.outer[0].x, cur.outer[0].y - this.prev.outer[0].y);
    const width = Math.hypot(cur.outer[10].x - cur.outer[0].x, cur.outer[10].y - cur.outer[0].y) || 1;
    const a = Math.min(1, this.alpha + (d / width) * 2);
    const mix = (p: Pt[], q: Pt[]) => p.map((v, i) => ({ x: q[i].x + (v.x - q[i].x) * a, y: q[i].y + (v.y - q[i].y) * a }));
    this.prev = { outer: mix(cur.outer, this.prev.outer), inner: mix(cur.inner, this.prev.inner) };
    return this.prev;
  }
}

/** Smooth closed curve through the points (quadratic curves through midpoints). */
function tracePath(ctx: CanvasRenderingContext2D, pts: Pt[], dx = 0, dy = 0) {
  const n = pts.length;
  const mid = (a: Pt, b: Pt) => ({ x: (a.x + b.x) / 2 + dx, y: (a.y + b.y) / 2 + dy });
  let m = mid(pts[n - 1], pts[0]);
  ctx.moveTo(m.x, m.y);
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    m = mid(p, pts[(i + 1) % n]);
    ctx.quadraticCurveTo(p.x + dx, p.y + dy, m.x, m.y);
  }
  ctx.closePath();
}

function polygonArea(p: Pt[]) {
  let a = 0;
  for (let i = 0; i < p.length; i++) {
    const j = (i + 1) % p.length;
    a += p[i].x * p[j].y - p[j].x * p[i].y;
  }
  return Math.abs(a / 2);
}

/* ---------------- renderer ---------------- */

export interface LipStyle {
  hex: string;
  intensity: number; // 0.2 – 1
  finish: "gloss" | "satin";
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
}

const OFF = 20000; // shadow-offset trick: draws a blurred shape without ctx.filter (works in Safari)

export class LipRenderer {
  private mask = document.createElement("canvas");
  private mctx = this.mask.getContext("2d", { willReadFrequently: true })!;

  /**
   * Draws `source` into `ctx` (same pixel size) and colours the lips.
   * `beforeRect` (canvas px) is redrawn from the untouched source for the before/after view.
   */
  render(ctx: CanvasRenderingContext2D, source: CanvasImageSource, lips: { outer: Pt[]; inner: Pt[] } | null, style: LipStyle, beforeRect?: { x: number; y: number; w: number; h: number } | null) {
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(source, 0, 0, W, H);
    if (lips && polygonArea(lips.outer) > 30) this.colour(ctx, lips, style, W, H);
    if (beforeRect && beforeRect.w > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(beforeRect.x, beforeRect.y, beforeRect.w, beforeRect.h);
      ctx.clip();
      ctx.drawImage(source, 0, 0, W, H);
      ctx.restore();
    }
  }

  private colour(ctx: CanvasRenderingContext2D, lips: { outer: Pt[]; inner: Pt[] }, style: LipStyle, W: number, H: number) {
    const xs = lips.outer.map((p) => p.x);
    const ys = lips.outer.map((p) => p.y);
    const lipW = Math.max(...xs) - Math.min(...xs);
    const pad = Math.ceil(lipW * 0.12) + 4;
    const x0 = Math.max(0, Math.floor(Math.min(...xs) - pad));
    const y0 = Math.max(0, Math.floor(Math.min(...ys) - pad));
    const x1 = Math.min(W, Math.ceil(Math.max(...xs) + pad));
    const y1 = Math.min(H, Math.ceil(Math.max(...ys) + pad));
    const w = x1 - x0;
    const h = y1 - y0;
    if (w < 4 || h < 4) return;

    /* 1 — feathered lip mask (outer contour minus inner mouth) */
    const m = this.mask;
    if (m.width !== w || m.height !== h) {
      m.width = w;
      m.height = h;
    }
    const mc = this.mctx;
    mc.setTransform(1, 0, 0, 1, 0, 0);
    mc.globalCompositeOperation = "source-over";
    mc.clearRect(0, 0, w, h);
    const feather = Math.max(1.2, lipW * 0.026);
    const shift = (pts: Pt[]) => pts.map((p) => ({ x: p.x - x0, y: p.y - y0 }));
    const outer = shift(lips.outer);
    const inner = shift(lips.inner);
    mc.shadowColor = "#fff";
    mc.shadowBlur = feather * 2;
    mc.shadowOffsetX = OFF;
    mc.fillStyle = "#fff";
    mc.beginPath();
    tracePath(mc, outer, -OFF, 0);
    mc.fill();
    // cut the mouth opening, slightly enlarged so teeth edges stay untouched
    const innerArea = polygonArea(inner);
    if (innerArea > 4) {
      const cx = inner.reduce((s, p) => s + p.x, 0) / inner.length;
      const cy = inner.reduce((s, p) => s + p.y, 0) / inner.length;
      const grown = inner.map((p) => ({ x: cx + (p.x - cx) * 1.06, y: cy + (p.y - cy) * 1.12 }));
      mc.globalCompositeOperation = "destination-out";
      mc.shadowBlur = feather * 1.4;
      mc.beginPath();
      tracePath(mc, grown, -OFF, 0);
      mc.fill();
    }
    mc.shadowColor = "transparent";
    mc.shadowOffsetX = 0;
    mc.globalCompositeOperation = "source-over";

    /* 2 — per-pixel colour, preserving the lip's own light and texture */
    let img: ImageData;
    let mk: ImageData;
    try {
      img = ctx.getImageData(x0, y0, w, h);
      mk = mc.getImageData(0, 0, w, h);
    } catch {
      return; // tainted canvas — should not happen with local sources
    }
    const d = img.data;
    const md = mk.data;
    const [cr, cg, cb] = hexToRgb(style.hex);
    const Ls = Math.max(8, 0.299 * cr + 0.587 * cg + 0.114 * cb);

    // mean lip luminance (weighted by mask) → texture reference
    let sum = 0;
    let wsum = 0;
    for (let i = 0; i < d.length; i += 4) {
      const a = md[i + 3] / 255;
      if (a < 0.5) continue;
      const L = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      sum += L * a;
      wsum += a;
    }
    if (wsum < 8) return;
    const Lm = sum / wsum;
    const hi = Math.min(250, Lm * 1.3 + 14);
    const gloss = style.finish === "gloss";
    const strength = Math.max(0.15, Math.min(1, style.intensity));
    // On the lip a colour reads lighter than in the pot (it sits over the lip's own colour and light).
    // Target luminance sits between the lip and the shade; deeper payoff for satin than for gloss.
    const payoff = gloss ? 0.8 : 0.88;
    const Lt = Lm + (Ls - Lm) * payoff;
    const gain = Math.min(1.3, Math.max(0.8, Lt / Ls));

    for (let i = 0; i < d.length; i += 4) {
      const a = (md[i + 3] / 255) * strength;
      if (a <= 0.004) continue;
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const L = 0.299 * r + 0.587 * g + 0.114 * b;
      // relative light: creases stay darker, raised areas lighter → real texture survives
      const rel = Math.pow(Math.max(0.04, L / Lm), 1.05);
      let tr = cr * gain * rel;
      let tg = cg * gain * rel;
      let tb = cb * gain * rel;
      // specular highlight from the lip's own highlights (stronger for gloss)
      if (L > hi) {
        const s = Math.pow((L - hi) / (255 - hi + 1), 1.1) * (gloss ? 0.9 : 0.35);
        tr += (255 - tr) * s;
        tg += (255 - tg) * s;
        tb += (255 - tb) * s;
      }
      if (gloss) {
        // wet sheen on the fuller, lighter parts of the lip
        const s = Math.max(0, Math.min(1, (L - Lm * 0.95) / (hi - Lm * 0.95 + 1))) * 0.16;
        tr += (255 - tr) * s;
        tg += (255 - tg) * s;
        tb += (255 - tb) * s;
      }
      d[i] = r + (Math.min(255, tr) - r) * a;
      d[i + 1] = g + (Math.min(255, tg) - g) * a;
      d[i + 2] = b + (Math.min(255, tb) - b) * a;
    }
    ctx.putImageData(img, x0, y0);
  }
}

/* ---------------- camera ---------------- */

export type CameraError = "insecure" | "unsupported" | "denied" | "notfound" | "busy" | "unknown";

export function cameraErrorMessage(e: CameraError) {
  switch (e) {
    case "insecure":
      return "Camera access needs a secure connection (HTTPS). Open the site over https://, or upload a photo instead.";
    case "unsupported":
      return "This browser doesn't support camera access. Try a recent Chrome, Safari, Edge or Firefox — or upload a photo instead.";
    case "denied":
      return "Camera permission was blocked. Allow camera access for this site in your browser's address bar or settings, then try the camera again — or upload a photo instead.";
    case "notfound":
      return "No camera was found on this device. You can upload a photo instead.";
    case "busy":
      return "Your camera is being used by another app or tab. Close it there and try again.";
    default:
      return "The camera couldn't be started. Please try again, or upload a photo instead.";
  }
}

export async function startCamera(video: HTMLVideoElement): Promise<MediaStream> {
  if (typeof window !== "undefined" && !window.isSecureContext) throw "insecure" as CameraError;
  if (!navigator.mediaDevices?.getUserMedia) throw "unsupported" as CameraError;
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } });
  } catch (err) {
    const name = (err as { name?: string })?.name;
    if (name === "NotAllowedError" || name === "SecurityError") throw "denied" as CameraError;
    if (name === "NotFoundError" || name === "OverconstrainedError") throw "notfound" as CameraError;
    if (name === "NotReadableError" || name === "AbortError") throw "busy" as CameraError;
    if (name === "NotSupportedError") throw "unsupported" as CameraError;
    throw "unknown" as CameraError;
  }
  video.srcObject = stream;
  video.muted = true;
  video.playsInline = true;
  await video.play().catch(() => undefined);
  if (!video.videoWidth) await new Promise<void>((r) => video.addEventListener("loadedmetadata", () => r(), { once: true }));
  return stream;
}

export function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((t) => t.stop());
}

/** Loads an uploaded file into a canvas no larger than `max` px on the long side (stays in memory only). */
export async function fileToCanvas(file: File, max = 1400): Promise<HTMLCanvasElement> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file (JPG, PNG, WebP or HEIC).");
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("This image couldn't be opened. Try a JPG or PNG photo."));
      i.src = url;
    });
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * k);
    c.height = Math.round(img.naturalHeight * k);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    return c;
  } finally {
    URL.revokeObjectURL(url);
  }
}
