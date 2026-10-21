#!/usr/bin/env python3
"""
CO2 brand film — rendered from the REAL product cut-outs in public/campaign.

No stock footage, no generated imagery: every frame is composed from the
actual product photographs (transparent cut-outs) on a warm carbon ground,
with slow camera drift and cross-fades. Products are always fully in frame
(never cropped).

Outputs (public/video/):
  co2-film-1600.mp4 / .webm   16:9 for desktop
  co2-film-900.mp4            4:5 for mobile
  co2-film-poster.webp        poster / fallback frame

Usage:  python3 scripts/make-brand-film.py
Needs:  Pillow, ffmpeg on PATH
"""
import math
import os
import shutil
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CUT = os.path.join(ROOT, "public", "campaign")
OUT = os.path.join(ROOT, "public", "video")
FPS = 30

SCENES = [
    # (cut-out slugs, seconds, glow colour)
    (["24k-gold-face-elixir"], 3.6, (184, 146, 79)),
    (["noir-charcoal-mask", "renew-firming-cream"], 3.6, (170, 120, 70)),
    (["gloss-berry-rubin", "gloss-burgundy-spirit", "gloss-chocolate-dream"], 3.6, (150, 50, 70)),
    (["coco-glow-body-lotion", "goat-milk-herbal-bar", "sandal-glow-herbal-bar"], 3.4, (190, 140, 90)),
    (["scalp-clear-hair-oil", "aloe-nourish-shampoo"], 3.4, (120, 140, 90)),
]
FADE = 0.8


def ease(t):
    return 0.5 - 0.5 * math.cos(math.pi * max(0, min(1, t)))


def background(w, h, glow, t):
    bg = Image.new("RGB", (w, h), (17, 16, 13))
    g = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(g)
    cx = w * (0.5 + 0.04 * math.sin(t * 0.6))
    cy = h * 0.55
    r = min(w, h) * 0.62
    d.ellipse([cx - r, cy - r * 0.8, cx + r, cy + r * 0.8], fill=150)
    g = g.filter(ImageFilter.GaussianBlur(min(w, h) * 0.18))
    col = Image.new("RGB", (w, h), glow)
    bg = Image.composite(col, bg, g.point(lambda v: int(v * 0.55)))
    # floor line
    floor = Image.new("L", (w, h), 0)
    ImageDraw.Draw(floor).rectangle([0, int(h * 0.80), w, h], fill=70)
    floor = floor.filter(ImageFilter.GaussianBlur(h * 0.05))
    bg = Image.composite(Image.new("RGB", (w, h), (8, 7, 6)), bg, floor)
    return bg


_cache = {}


def cutout(slug):
    if slug not in _cache:
        im = Image.open(os.path.join(CUT, slug + ".webp")).convert("RGBA")
        bbox = im.getbbox()
        _cache[slug] = im.crop(bbox) if bbox else im
    return _cache[slug]


def compose(w, h, scene, local_t, dur):
    slugs, _, glow = scene
    p = local_t / dur
    frame = background(w, h, glow, local_t)
    n = len(slugs)
    portrait = h > w
    # available box for products — products are always fully inside the frame
    box_h = h * (0.62 if not portrait else 0.48)
    gap = w * 0.03
    scale_push = 0.92 + 0.07 * ease(p)
    imgs = [cutout(s) for s in slugs]
    target_h = box_h * scale_push * (1.0 if n == 1 else 0.86)
    sized = []
    for im in imgs:
        s = target_h / im.height
        sized.append(im.resize((max(1, int(im.width * s)), max(1, int(target_h))), Image.LANCZOS))
    total_w = sum(i.width for i in sized) + gap * (n - 1)
    max_w = w * (0.82 if not portrait else 0.9)
    if total_w > max_w:
        k = max_w / total_w
        sized = [i.resize((max(1, int(i.width * k)), max(1, int(i.height * k))), Image.LANCZOS) for i in sized]
        total_w = sum(i.width for i in sized) + gap * k * (n - 1)
        gap *= k
    x = (w - total_w) / 2 + w * 0.015 * math.sin(local_t * 0.5)
    base_y = h * (0.80 if not portrait else 0.74)
    for idx, im in enumerate(sized):
        drift = h * 0.008 * math.sin(local_t * 0.9 + idx)
        y = base_y - im.height + drift
        # soft shadow
        sh = Image.new("L", (im.width, max(1, im.height // 10)), 0)
        ImageDraw.Draw(sh).ellipse([0, 0, im.width, sh.height], fill=120)
        sh = sh.filter(ImageFilter.GaussianBlur(max(2, im.width // 18)))
        frame.paste((0, 0, 0), (int(x), int(base_y - sh.height // 2)), sh)
        frame.paste(im, (int(x), int(y)), im)
        x += im.width + gap
    return frame


def render(w, h, path_mp4, path_webm=None, poster=None):
    tmp = tempfile.mkdtemp()
    try:
        timeline = []
        t0 = 0.0
        for sc in SCENES:
            timeline.append((t0, sc))
            t0 += sc[1] - FADE
        total = t0 + FADE
        frames = int(total * FPS)
        for f in range(frames):
            t = f / FPS
            active = [(s0, sc) for s0, sc in timeline if s0 <= t < s0 + sc[1]]
            # loop seam: fade last scene into first
            img = None
            for s0, sc in active:
                fr = compose(w, h, sc, t - s0, sc[1])
                alpha = 1.0
                if t - s0 < FADE and s0 > 0:
                    alpha = ease((t - s0) / FADE)
                img = fr if img is None else Image.blend(img, fr, alpha)
            if t > total - FADE:
                first = compose(w, h, SCENES[0], 0, SCENES[0][1])
                img = Image.blend(img, first, ease((t - (total - FADE)) / FADE))
            img.save(os.path.join(tmp, f"f{f:05d}.jpg"), quality=92)
            if poster and f == int(FPS * 1.6):
                img.save(poster, quality=82)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(tmp, "f%05d.jpg"),
                        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-profile:v", "high", "-crf", "26", "-preset", "slow",
                        "-movflags", "+faststart", "-an", path_mp4], check=True)
        if path_webm:
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(tmp, "f%05d.jpg"),
                            "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40", "-row-mt", "1", "-an", path_webm], check=True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    only_portrait = "--portrait" in sys.argv
    if not only_portrait:
        render(1600, 900, os.path.join(OUT, "co2-film-1600.mp4"), os.path.join(OUT, "co2-film-1600.webm"), os.path.join(OUT, "co2-film-poster.webp"))
    render(896, 1120, os.path.join(OUT, "co2-film-900.mp4"), None, os.path.join(OUT, "co2-film-poster-portrait.webp"))
    print("done", file=sys.stderr)
