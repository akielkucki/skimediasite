/**
 * Generates the site's local placeholder imagery.
 *
 * Everything under /public/placeholders is produced by this script — abstract,
 * procedurally-drawn alpine compositions (ridgelines, contour intervals, ski
 * tracks, weather-map banding). No third-party photography is used, so there
 * are no licensing questions and nothing implies a real sponsorship.
 *
 * Run:  npm run placeholders
 *
 * Outputs:
 *   public/placeholders/*.jpg            master images
 *   src/data/placeholders.generated.ts   typed manifest incl. blur data URLs
 *
 * Replace these with real photography by dropping files into
 * /public/placeholders (same filenames) or by pointing the CMS at real assets —
 * the app reads image data through `ImageAsset`, never these paths directly.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "placeholders");
const MANIFEST = path.join(ROOT, "src", "data", "placeholders.generated.ts");

/* ── Deterministic RNG so repeat runs produce identical files ──────────── */
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

/* ── Palette: ice white → pale blue → slate → charcoal → near black ────── */
const PALETTES = [
  { sky: ["#EEF4FA", "#C8D8E8"], ridges: ["#A8BCD0", "#8397AE", "#5E7186", "#3A4756", "#1B2129"] },
  { sky: ["#F5F8FB", "#DDE7F0"], ridges: ["#BCCCDA", "#93A6B8", "#6B7C8E", "#414D5B", "#151A20"] },
  { sky: ["#151A20", "#2B3542"], ridges: ["#3E4B5B", "#586878", "#7E90A2", "#AFC0CF", "#E6EEF5"] },
  { sky: ["#0C0F13", "#1E2732"], ridges: ["#2A3440", "#3D4A59", "#5A6B7D", "#8698AA", "#C6D4E0"] },
];

/** Fractal midpoint displacement — gives ridgelines a believable silhouette. */
function ridgeline(rng, width, baseY, amplitude, roughness = 0.55) {
  let points = [
    [0, baseY + (rng() - 0.5) * amplitude],
    [width, baseY + (rng() - 0.5) * amplitude],
  ];
  let amp = amplitude;
  for (let pass = 0; pass < 7; pass++) {
    const next = [points[0]];
    for (let i = 1; i < points.length; i++) {
      const [x0, y0] = points[i - 1];
      const [x1, y1] = points[i];
      next.push([(x0 + x1) / 2, (y0 + y1) / 2 + (rng() - 0.5) * amp]);
      next.push(points[i]);
    }
    points = next;
    amp *= roughness;
  }
  return points;
}

const toPath = (pts) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** Contour intervals traced across a ridge face, like a topo map. */
function contours(rng, pts, height, count) {
  const out = [];
  for (let i = 1; i <= count; i++) {
    const drop = (height / (count + 1)) * i;
    const jitter = 4 + rng() * 10;
    const line = pts
      .filter((_, idx) => idx % 3 === 0)
      .map(([x, y]) => [x, y + drop + Math.sin(x / (60 + jitter)) * jitter]);
    out.push(toPath(line));
  }
  return out;
}

/** A carved line down the fall line. */
function skiTrack(rng, width, height) {
  const startX = width * (0.25 + rng() * 0.5);
  const segs = [`M ${startX.toFixed(1)} ${(height * 0.32).toFixed(1)}`];
  const turns = 4 + Math.floor(rng() * 3);
  for (let i = 0; i < turns; i++) {
    const dx = (rng() > 0.5 ? 1 : -1) * (40 + rng() * 90);
    const dy = (height * 0.62) / turns;
    segs.push(
      `q ${dx.toFixed(1)} ${(dy * 0.5).toFixed(1)} ${(dx * 0.15).toFixed(1)} ${dy.toFixed(1)}`,
    );
  }
  return segs.join(" ");
}

function buildScene({ seed, width, height, paletteIndex, style }) {
  const rng = makeRng(seed);
  const p = PALETTES[paletteIndex % PALETTES.length];
  const layers = [];

  // Sky / atmosphere
  layers.push(`<rect width="${width}" height="${height}" fill="url(#sky)"/>`);

  // Weather-map banding — faint horizontal isobars in the upper third.
  if (style !== "clean") {
    for (let i = 0; i < 9; i++) {
      const y = height * 0.06 + i * (height * 0.028);
      layers.push(
        `<path d="M 0 ${y.toFixed(1)} Q ${width * 0.35} ${(y - 18 - i * 2).toFixed(1)} ${width} ${(y + 10).toFixed(1)}" fill="none" stroke="${p.ridges[0]}" stroke-opacity="0.16" stroke-width="1.25"/>`,
      );
    }
  }

  // A cold sun / high-altitude glare disc
  if (style === "sun") {
    const cx = width * (0.6 + rng() * 0.25);
    const cy = height * (0.18 + rng() * 0.1);
    layers.push(`<circle cx="${cx}" cy="${cy}" r="${height * 0.16}" fill="url(#glare)"/>`);
  }

  // Ridgelines, far to near
  const count = p.ridges.length;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const baseY = height * (0.34 + t * 0.5);
    const amp = height * (0.3 - t * 0.14);
    const pts = ridgeline(rng, width, baseY, amp, 0.52 + t * 0.06);
    const poly = `${toPath(pts)} ${width},${height} 0,${height}`;
    layers.push(`<polygon points="${poly}" fill="${p.ridges[i]}"/>`);

    // Contour intervals on the two nearest faces only.
    if (i >= count - 2) {
      for (const c of contours(rng, pts, height * 0.22, 5)) {
        layers.push(
          `<polyline points="${c}" fill="none" stroke="${p.sky[0]}" stroke-opacity="0.13" stroke-width="1.4"/>`,
        );
      }
    }
  }

  // Carved tracks across the foreground
  if (style === "tracks" || style === "sun") {
    const strokes = 1 + Math.floor(rng() * 2);
    for (let i = 0; i < strokes; i++) {
      layers.push(
        `<path d="${skiTrack(rng, width, height)}" fill="none" stroke="${p.sky[0]}" stroke-opacity="0.28" stroke-width="${(2 + rng() * 2).toFixed(1)}" stroke-linecap="round"/>`,
      );
    }
  }

  // Torn-edge geometric slab — the "editorial cut" motif
  if (style === "slab") {
    const y = height * (0.55 + rng() * 0.1);
    layers.push(
      `<polygon points="0,${y.toFixed(1)} ${width},${(y - height * 0.12).toFixed(1)} ${width},${height} 0,${height}" fill="${p.ridges[count - 1]}" fill-opacity="0.88"/>`,
    );
  }

  // Vignette to keep overlaid type legible
  layers.push(`<rect width="${width}" height="${height}" fill="url(#vignette)"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0.15" y2="1">
      <stop offset="0%" stop-color="${p.sky[0]}"/>
      <stop offset="100%" stop-color="${p.sky[1]}"/>
    </linearGradient>
    <radialGradient id="glare" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#05070A" stop-opacity="0.10"/>
      <stop offset="55%" stop-color="#05070A" stop-opacity="0"/>
      <stop offset="100%" stop-color="#05070A" stop-opacity="0.42"/>
    </linearGradient>
  </defs>
  ${layers.join("\n  ")}
</svg>`;
}

/** Film-grain overlay built as a raw RGBA buffer (no SVG filters involved). */
async function grainLayer(width, height, seed, strength = 22) {
  const w = Math.max(2, Math.round(width / 3));
  const h = Math.max(2, Math.round(height / 3));
  const rng = makeRng(seed ^ 0x9e3779b9);
  const buf = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const v = Math.round(rng() * 255);
    buf[i * 4] = v;
    buf[i * 4 + 1] = v;
    buf[i * 4 + 2] = v;
    buf[i * 4 + 3] = strength;
  }
  return sharp(buf, { raw: { width: w, height: h, channels: 4 } })
    .resize(width, height, { kernel: "nearest" })
    .png()
    .toBuffer();
}

async function render(scene) {
  const svg = buildScene(scene);
  const base = sharp(Buffer.from(svg)).composite([
    { input: await grainLayer(scene.width, scene.height, scene.seed), blend: "overlay" },
  ]);
  const jpeg = await base.jpeg({ quality: 74, mozjpeg: true }).toBuffer();
  await writeFile(path.join(OUT_DIR, `${scene.name}.jpg`), jpeg);

  const blur = await sharp(jpeg).resize(16).blur(1).jpeg({ quality: 40 }).toBuffer();
  return {
    key: scene.name,
    src: `/placeholders/${scene.name}.jpg`,
    width: scene.width,
    height: scene.height,
    blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`,
    bytes: jpeg.length,
  };
}

/* ── Scene manifest ────────────────────────────────────────────────────── */
const LANDSCAPE = { width: 1920, height: 1080 };
const PORTRAIT = { width: 1000, height: 1500 };
const SQUARE = { width: 512, height: 512 };

const STYLES = ["tracks", "sun", "slab", "clean", "tracks", "sun"];

const scenes = [
  ...Array.from({ length: 18 }, (_, i) => ({
    name: `alpine-${String(i + 1).padStart(2, "0")}`,
    seed: 1013 + i * 7919,
    paletteIndex: i % PALETTES.length,
    style: STYLES[i % STYLES.length],
    ...LANDSCAPE,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    name: `poster-${String(i + 1).padStart(2, "0")}`,
    seed: 50021 + i * 4813,
    paletteIndex: (i + 2) % PALETTES.length,
    style: i % 2 === 0 ? "slab" : "sun",
    ...PORTRAIT,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    name: `portrait-${String(i + 1).padStart(2, "0")}`,
    seed: 90001 + i * 3271,
    paletteIndex: (i + 1) % PALETTES.length,
    style: "clean",
    ...SQUARE,
  })),
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const results = [];
  for (const scene of scenes) {
    results.push(await render(scene));
    process.stdout.write(".");
  }
  process.stdout.write("\n");

  const entries = results
    .map(
      (r) =>
        `  "${r.key}": {\n    src: "${r.src}",\n    width: ${r.width},\n    height: ${r.height},\n    blurDataURL:\n      "${r.blurDataURL}",\n  },`,
    )
    .join("\n");

  await writeFile(
    MANIFEST,
    `// GENERATED FILE — do not edit by hand.
// Produced by \`npm run placeholders\` (scripts/generate-placeholders.mjs).

export type GeneratedPlaceholder = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
};

export const placeholders = {
${entries}
} as const satisfies Record<string, GeneratedPlaceholder>;

export type PlaceholderKey = keyof typeof placeholders;
`,
    "utf8",
  );

  const total = results.reduce((n, r) => n + r.bytes, 0);
  console.log(
    `Generated ${results.length} placeholders (${(total / 1024 / 1024).toFixed(2)} MB) → public/placeholders`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
