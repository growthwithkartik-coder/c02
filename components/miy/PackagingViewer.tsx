"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Minus, Plus, RotateCw } from "lucide-react";
import type { ContainerId } from "@/data/customize";
import { cn } from "@/lib/utils";
import { versioned } from "@/lib/image-loader";

/* ------------------------------------------------------------------
   3D packaging preview (three.js, loaded only on the builder).

   The containers are modelled procedurally (lathe profiles) to show
   the STYLE of each container, its colour, cap finish and label
   placement — they are not scans or photographs of finished CO2
   products, and the UI says so. Drag to rotate, buttons/scroll or
   pinch to zoom. Falls back to a flat illustration when WebGL isn't
   available, and never auto-spins with prefers-reduced-motion.
------------------------------------------------------------------- */

export interface PackSpec {
  container: ContainerId;
  bodyHex: string;
  clarity: number; // 0 opaque … 1 clear
  capHex: string;
  capMetal: boolean;
  fillHex: string;
  title: string; // product label line
  name?: string; // personal label
}

type Three = typeof import("three");

export function PackagingViewer({ spec, className }: { spec: PackSpec; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ update: (s: PackSpec) => void; zoom: (d: number) => void; reset: () => void; dispose: () => void } | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "fallback">("loading");
  const specRef = useRef(spec);
  specRef.current = spec;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const el = host.current;
      if (!el) return;
      const canvasTest = document.createElement("canvas");
      const gl = canvasTest.getContext("webgl2") || canvasTest.getContext("webgl");
      if (!gl) {
        setState("fallback");
        return;
      }
      try {
        const THREE = await import("three");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
        const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
        if (cancelled) return;
        api.current = createScene(THREE, OrbitControls, RoomEnvironment, el, specRef.current);
        setState("ready");
      } catch (e) {
        console.warn("[PackagingViewer] falling back:", e);
        setState("fallback");
      }
    })();
    return () => {
      cancelled = true;
      api.current?.dispose();
      api.current = null;
    };
  }, []);

  useEffect(() => {
    api.current?.update(spec);
  }, [spec]);

  return (
    <div className={cn("relative overflow-hidden bg-[radial-gradient(70%_60%_at_50%_40%,#2a2620,#11100d)]", className)}>
      <div ref={host} className="absolute inset-0 touch-none" aria-hidden={state !== "ready"} />
      {state === "ready" && (
        <p className="sr-only" aria-live="polite">3D preview: {spec.title}, {spec.container} with {spec.name ? `label “${spec.name}”` : "no personal label"}.</p>
      )}
      {state === "loading" && <div className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[0.18em] text-bone/50">Loading 3D preview…</div>}
      {state === "fallback" && <FlatPack spec={spec} />}
      {state === "ready" && (
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          <button type="button" onClick={() => api.current?.zoom(-1)} className="grid h-9 w-9 place-items-center rounded-full border border-bone/25 bg-carbon/60 text-bone backdrop-blur hover:bg-bone hover:text-carbon" aria-label="Zoom in"><Plus className="h-4 w-4" /></button>
          <button type="button" onClick={() => api.current?.zoom(1)} className="grid h-9 w-9 place-items-center rounded-full border border-bone/25 bg-carbon/60 text-bone backdrop-blur hover:bg-bone hover:text-carbon" aria-label="Zoom out"><Minus className="h-4 w-4" /></button>
          <button type="button" onClick={() => api.current?.reset()} className="grid h-9 w-9 place-items-center rounded-full border border-bone/25 bg-carbon/60 text-bone backdrop-blur hover:bg-bone hover:text-carbon" aria-label="Reset view"><RotateCw className="h-4 w-4" /></button>
        </div>
      )}
      <p className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-carbon/60 px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.16em] text-bone/70 backdrop-blur">
        <Box className="h-3 w-3" /> {state === "fallback" ? "Packaging illustration" : "3D packaging preview · drag to rotate"}
      </p>
    </div>
  );
}

/* ---------------- scene ---------------- */

function createScene(
  THREE: Three,
  OrbitControls: typeof import("three/examples/jsm/controls/OrbitControls.js").OrbitControls,
  RoomEnvironment: typeof import("three/examples/jsm/environments/RoomEnvironment.js").RoomEnvironment,
  el: HTMLDivElement,
  initial: PackSpec,
) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  el.appendChild(renderer.domElement);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  const home = new THREE.Vector3(0, 1.1, 6.2);
  camera.position.copy(home);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 3.2;
  controls.maxDistance = 9;
  controls.minPolarAngle = Math.PI * 0.18;
  controls.maxPolarAngle = Math.PI * 0.62;
  controls.target.set(0, 0.85, 0);
  controls.autoRotate = !reduce;
  controls.autoRotateSpeed = 1.2;
  controls.addEventListener("start", () => (controls.autoRotate = false));

  scene.add(new THREE.HemisphereLight(0xfff4e6, 0x1a1712, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xe2c68c, 1.2);
  rim.position.set(-4, 3, -3);
  scene.add(rim);

  // soft contact shadow
  const sc = document.createElement("canvas");
  sc.width = sc.height = 128;
  const sctx = sc.getContext("2d")!;
  const g = sctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, "rgba(0,0,0,.55)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  sctx.fillStyle = g;
  sctx.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.001;
  scene.add(shadow);

  let group = new THREE.Group();
  scene.add(group);

  const resize = () => {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();

  let raf = 0;
  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(el);
  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (!visible) return;
    controls.update();
    renderer.render(scene, camera);
  };
  tick();

  const disposeGroup = (gr: import("three").Group) => {
    gr.traverse((o) => {
      const m = o as import("three").Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as import("three").Material | import("three").Material[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => {
        const mm = x as import("three").MeshStandardMaterial;
        mm.map?.dispose();
        x.dispose();
      });
    });
  };

  const update = (s: PackSpec) => {
    scene.remove(group);
    disposeGroup(group);
    group = buildPack(THREE, s);
    scene.add(group);
    // frame the model
    const box = new THREE.Box3().setFromObject(group);
    const size = box.getSize(new THREE.Vector3());
    controls.target.set(0, size.y * 0.5, 0);
    shadow.scale.setScalar(Math.max(size.x, size.z) * 0.9 + 0.3);
  };
  update(initial);

  return {
    update,
    zoom(d: number) {
      const dir = camera.position.clone().sub(controls.target);
      const len = Math.min(controls.maxDistance, Math.max(controls.minDistance, dir.length() * (d > 0 ? 1.18 : 0.85)));
      camera.position.copy(controls.target.clone().add(dir.setLength(len)));
    },
    reset() {
      camera.position.copy(home);
      controls.autoRotate = !reduce;
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      disposeGroup(group);
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

/* ---------------- models ---------------- */

function labelTexture(THREE: Three, s: PackSpec, dark: boolean) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const x = c.getContext("2d")!;
  x.fillStyle = dark ? "#f4efe7" : "#1a1814";
  x.textAlign = "center";
  x.fillStyle = dark ? "#f4efe7" : "#1a1814";
  x.font = "500 44px 'Inter Tight', system-ui, sans-serif";
  x.fillText(s.title.toUpperCase().slice(0, 26), 512, 260);
  x.fillRect(432, 290, 160, 2);
  if (s.name) {
    x.font = "italic 400 72px 'Instrument Serif', Georgia, serif";
    x.fillText(s.name.slice(0, 18), 512, 380);
  } else {
    x.font = "400 30px 'Inter Tight', system-ui, sans-serif";
    x.fillText("MADE FOR YOU", 512, 360);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  // brand mark: the official CO2 logo artwork (never redrawn or recoloured), proportions kept
  const logo = new Image();
  logo.onload = () => {
    const h = 150;
    const w = (logo.naturalWidth / logo.naturalHeight) * h;
    x.drawImage(logo, 512 - w / 2, 22, w, h);
    t.needsUpdate = true;
  };
  logo.src = versioned("/brand/co2-logo-360.png");
  return t;
}

function lathe(THREE: Three, pts: [number, number][], seg = 64) {
  return new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);
}

/** A rounded-shoulder bottle profile. */
function bottleProfile(r: number, h: number, neckR: number, shoulder = 0.28, base = 0.06): [number, number][] {
  const pts: [number, number][] = [[0, 0], [r - base, 0], [r, base]];
  const sh = h - shoulder;
  pts.push([r, sh]);
  for (let i = 1; i <= 8; i++) {
    const a = (i / 8) * (Math.PI / 2);
    pts.push([neckR + (r - neckR) * Math.cos(a), sh + shoulder * Math.sin(a)]);
  }
  pts.push([neckR, h], [neckR, h + 0.12], [0, h + 0.12]);
  return pts;
}

function buildPack(THREE: Three, s: PackSpec) {
  const g = new THREE.Group();
  const clear = s.clarity > 0;
  const body = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(s.bodyHex),
    roughness: clear ? 0.12 : 0.42,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
    transparent: clear,
    opacity: clear ? 1 - s.clarity * 0.55 : 1,
    side: THREE.DoubleSide,
  });
  const cap = new THREE.MeshStandardMaterial({ color: new THREE.Color(s.capHex), metalness: s.capMetal ? 1 : 0.1, roughness: s.capMetal ? 0.28 : 0.55 });
  const fill = new THREE.MeshStandardMaterial({ color: new THREE.Color(s.fillHex), roughness: 0.35, transparent: true, opacity: 0.92 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x1b1916, roughness: 0.7 });
  const darkBody = new THREE.Color(s.bodyHex).getHSL({ h: 0, s: 0, l: 0 }).l < 0.45 && !clear;
  const labelMat = new THREE.MeshStandardMaterial({ map: labelTexture(THREE, s, darkBody), transparent: true, roughness: 0.6 });
  const mesh = (geo: import("three").BufferGeometry, m: import("three").Material, y = 0) => {
    const x = new THREE.Mesh(geo, m);
    x.position.y = y;
    g.add(x);
    return x;
  };
  const wrapLabel = (r: number, y: number, h: number, arc = Math.PI * 0.8) => {
    // theta 0 faces +Z (the camera); centre the label there so text reads left-to-right
    const geo = new THREE.CylinderGeometry(r * 1.006, r * 1.006, h, 64, 1, true, -arc / 2, arc);
    return mesh(geo, labelMat, y);
  };
  const topLabel = (r: number, y: number) => {
    const m = mesh(new THREE.CircleGeometry(r, 64), labelMat, y);
    m.rotation.x = -Math.PI / 2;
  };

  switch (s.container) {
    case "dropper": {
      mesh(lathe(THREE, bottleProfile(0.55, 1.35, 0.2)), body);
      if (clear) mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.95, 48), fill, 0.52);
      wrapLabel(0.55, 0.6, 0.62);
      mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.32, 48), cap, 1.58);
      mesh(lathe(THREE, [[0, 0], [0.2, 0], [0.21, 0.12], [0.19, 0.35], [0.12, 0.52], [0, 0.56]]), rubber, 1.74);
      break;
    }
    case "airless": {
      mesh(lathe(THREE, [[0, 0], [0.36, 0], [0.4, 0.05], [0.4, 1.55], [0.37, 1.6], [0, 1.6]]), body);
      wrapLabel(0.4, 0.75, 0.75);
      mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 48), cap, 1.65);
      mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.22, 32), cap, 1.81);
      const nozzle = mesh(new THREE.BoxGeometry(0.3, 0.07, 0.1), cap, 1.9);
      nozzle.position.z = 0.15;
      break;
    }
    case "pump": {
      mesh(lathe(THREE, bottleProfile(0.52, 1.4, 0.18, 0.32)), body);
      if (clear) mesh(new THREE.CylinderGeometry(0.47, 0.47, 1.0, 48), fill, 0.55);
      wrapLabel(0.52, 0.62, 0.66);
      mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.2, 48), cap, 1.62);
      mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.25, 16), cap, 1.82);
      const head = mesh(new THREE.BoxGeometry(0.22, 0.14, 0.5), cap, 1.98);
      head.position.z = 0.12;
      break;
    }
    case "jar": {
      mesh(lathe(THREE, [[0, 0], [0.74, 0], [0.8, 0.06], [0.8, 0.62], [0.7, 0.68], [0, 0.68]]), body);
      if (clear) mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.5, 64), fill, 0.32);
      wrapLabel(0.8, 0.34, 0.36, Math.PI * 0.9);
      mesh(lathe(THREE, [[0, 0], [0.82, 0], [0.84, 0.04], [0.84, 0.28], [0.8, 0.32], [0, 0.32]]), cap, 0.66);
      topLabel(0.62, 0.985);
      break;
    }
    case "tube": {
      // stands on its cap
      mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.38, 48), cap);
      mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.12, 32), cap, 0.43);
      const t = mesh(lathe(THREE, [[0, 0], [0.4, 0], [0.42, 0.25], [0.42, 1.25], [0.38, 1.45], [0.05, 1.6], [0, 1.6]]), body, 0.48);
      t.scale.z = 0.72;
      const crimp = mesh(new THREE.BoxGeometry(0.82, 0.12, 0.05), body, 2.12);
      crimp.scale.x = 1;
      const lbl = wrapLabel(0.42, 1.2, 0.7, Math.PI * 0.7);
      lbl.scale.z = 0.72;
      break;
    }
    case "compact": {
      mesh(lathe(THREE, [[0, 0], [0.82, 0], [0.86, 0.05], [0.86, 0.18], [0, 0.18]]), body);
      mesh(new THREE.TorusGeometry(0.86, 0.018, 12, 96), cap, 0.19).rotation.x = Math.PI / 2;
      mesh(lathe(THREE, [[0, 0], [0.86, 0], [0.86, 0.12], [0.8, 0.16], [0, 0.16]]), body, 0.2);
      topLabel(0.55, 0.365);
      break;
    }
    case "bullet": {
      mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.85, 48), body);
      g.children[g.children.length - 1].position.y = 0.425;
      mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.05, 48), cap, 0.87);
      mesh(lathe(THREE, [[0, 0], [0.3, 0], [0.3, 0.78], [0.27, 0.82], [0, 0.82]]), cap, 0.9);
      wrapLabel(0.28, 0.45, 0.36, Math.PI * 0.6);
      break;
    }
    case "bottle": {
      mesh(lathe(THREE, bottleProfile(0.5, 1.45, 0.3, 0.22)), body);
      if (clear) mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.05, 48), fill, 0.58);
      wrapLabel(0.5, 0.66, 0.7);
      mesh(lathe(THREE, [[0, 0], [0.36, 0], [0.37, 0.3], [0.3, 0.36], [0, 0.36]]), cap, 1.55);
      break;
    }
  }
  return g;
}

/* ---------------- 2D fallback ---------------- */

function FlatPack({ spec }: { spec: PackSpec }) {
  const { container: c, bodyHex, capHex, title, name } = spec;
  return (
    <svg viewBox="0 0 200 260" className="absolute inset-0 m-auto h-[80%] w-auto" role="img" aria-label={`${title} — ${c} illustration`}>
      <ellipse cx="100" cy="246" rx="60" ry="8" fill="#000" opacity=".35" />
      {c === "jar" || c === "compact" ? (
        <>
          <rect x="35" y="150" width="130" height={c === "jar" ? 92 : 40} rx="10" fill={bodyHex} transform={c === "compact" ? "translate(0,52)" : undefined} />
          <rect x="32" y={c === "jar" ? 112 : 172} width="136" height={c === "jar" ? 42 : 30} rx="8" fill={capHex} />
        </>
      ) : (
        <>
          <rect x="60" y="80" width="80" height="164" rx={c === "bullet" ? 8 : 18} fill={bodyHex} />
          <rect x="74" y="34" width="52" height="50" rx="6" fill={capHex} />
        </>
      )}
      <text x="100" y="170" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="18" fill="#C9A464">CO2</text>
      <text x="100" y="190" textAnchor="middle" fontSize="7" letterSpacing="1" fill="#f4efe7">{title.toUpperCase().slice(0, 22)}</text>
      {name && <text x="100" y="206" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="#f4efe7">{name}</text>}
    </svg>
  );
}
