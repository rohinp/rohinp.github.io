// Pure, dependency-free engine + content for the MathArt sandbox.
// This module deliberately avoids React and DOM APIs so the same code powers
// the interactive canvas and the offscreen export pipeline.

export type BaseId = "spirograph" | "resonance" | "mandelbrot" | "fern";
export type ModifierId = "wind" | "fracture" | "black-hole" | "neon";
export type BlockId = BaseId | ModifierId;
export type BlockRole = "base" | "modifier";

/** A strand is the atomic draw + colour unit: one batched run of points. */
export interface Strand {
  /** Flat [x0, y0, x1, y1, ...] coordinates in reference pixels. */
  pts: Float32Array;
  /** 0..1 colour coordinate used to sample the palette. */
  metric: number;
  /** "line" connects consecutive points, "points" draws an unconnected cloud. */
  mode: "line" | "points";
}

export interface GeometryEntry {
  strands: Strand[];
  /** Rotation per time unit, applied at render time so cached geometry stays static. */
  spin: number;
}

export type BlockParams = Record<string, number>;
export type MathArtParams = Record<BlockId, BlockParams>;

export interface ParamSpec {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
}

export interface BlockMeta {
  id: BlockId;
  label: string;
  role: BlockRole;
  blurb: string;
  equation: string;
}

export const REF_WIDTH = 760;
export const REF_HEIGHT = 520;
export const REF_HALF_W = REF_WIDTH / 2;
export const REF_HALF_H = REF_HEIGHT / 2;

/** Canonical stack order: generators first, then warping modifiers. */
export const blocks: BlockId[] = [
  "spirograph",
  "resonance",
  "mandelbrot",
  "fern",
  "wind",
  "fracture",
  "black-hole",
  "neon",
];

export const blockMeta: Record<BlockId, BlockMeta> = {
  spirograph: {
    id: "spirograph",
    label: "Spirograph ribbon",
    role: "base",
    blurb: "Parametric epitrochoid for looping ribbon shapes.",
    equation: "x(t) = (R + r) cos(t) - d cos((R + r)t / r)\ny(t) = (R + r) sin(t) - d sin((R + r)t / r)",
  },
  resonance: {
    id: "resonance",
    label: "Sound resonance",
    role: "base",
    blurb: "Chladni-style standing waves that breathe across a grid.",
    equation: "z = a sin(n pi x) sin(m pi y) + b sin(m pi x) sin(n pi y)",
  },
  mandelbrot: {
    id: "mandelbrot",
    label: "Infinite mirror",
    role: "base",
    blurb: "Escaping orbits of z^2 + c plotted as a nebula of points.",
    equation: "z(n + 1) = z(n)^2 + c",
  },
  fern: {
    id: "fern",
    label: "Nature's fern",
    role: "base",
    blurb: "A probabilistic affine system that grows an organic form.",
    equation: "x(n + 1) = ax(n) + by(n) + e\ny(n + 1) = cx(n) + dy(n) + f",
  },
  wind: {
    id: "wind",
    label: "Cosmic wind",
    role: "modifier",
    blurb: "Perlin noise displacement that bends every strand below it.",
    equation: "x' = x + fbm(x, y, t)\ny' = y + fbm(y, x, t)",
  },
  fracture: {
    id: "fracture",
    label: "Digital fracture",
    role: "modifier",
    blurb: "Quantises coordinates to a grid for pixel-sorted glitch cuts.",
    equation: "x' = round(x / m) * m",
  },
  "black-hole": {
    id: "black-hole",
    label: "Black hole pull",
    role: "modifier",
    blurb: "A distance-based attractor that drags strands toward the core.",
    equation: "p = min(k / |r|^q, p_max)\nx' = x (1 - p)",
  },
  neon: {
    id: "neon",
    label: "Neon wave shader",
    role: "modifier",
    blurb: "Ripples the palette and switches everything below to additive glow.",
    equation: "C(n) = 1/2 + 1/2 cos(a n + b)",
  },
};

export const paramSpecs: Record<BlockId, ParamSpec[]> = {
  spirograph: [
    { key: "R", label: "Outer radius R", min: 60, max: 280, step: 1 },
    { key: "r", label: "Inner radius r", min: 8, max: 90, step: 1 },
    { key: "d", label: "Pen offset d", min: 10, max: 160, step: 1 },
    { key: "turns", label: "Turns", min: 4, max: 36, step: 1 },
  ],
  resonance: [
    { key: "n", label: "Mode n", min: 1, max: 12, step: 1 },
    { key: "m", label: "Mode m", min: 1, max: 12, step: 1 },
    { key: "amp", label: "Amplitude", min: 2, max: 48, step: 1 },
    { key: "spacing", label: "Grid spacing", min: 10, max: 42, step: 1 },
  ],
  mandelbrot: [
    { key: "zoom", label: "Zoom", min: 40, max: 360, step: 1 },
    { key: "iterations", label: "Escape iterations", min: 8, max: 72, step: 1 },
    { key: "panX", label: "Pan X", min: -80, max: 40, step: 1 },
    { key: "panY", label: "Pan Y", min: -60, max: 60, step: 1 },
  ],
  fern: [
    { key: "points", label: "Points", min: 400, max: 9000, step: 100 },
    { key: "size", label: "Scale", min: 20, max: 80, step: 1 },
  ],
  wind: [
    { key: "scale", label: "Noise scale", min: 4, max: 90, step: 1 },
    { key: "strength", label: "Strength", min: 0, max: 70, step: 1 },
    { key: "octaves", label: "Octaves", min: 1, max: 5, step: 1 },
    { key: "drift", label: "Drift", min: 0, max: 3, step: 0.1 },
  ],
  fracture: [{ key: "cell", label: "Cell size", min: 2, max: 48, step: 1 }],
  "black-hole": [
    { key: "strength", label: "Max pull", min: 0, max: 70, step: 1 },
    { key: "radius", label: "Event radius", min: 40, max: 260, step: 1 },
    { key: "power", label: "Falloff", min: 5, max: 35, step: 1 },
  ],
  neon: [
    { key: "freq", label: "Ripple frequency", min: 0.2, max: 4, step: 0.1 },
    { key: "ripple", label: "Ripple mix", min: 0, max: 1, step: 0.05 },
    { key: "glow", label: "Glow", min: 0, max: 1, step: 0.05 },
  ],
};

export const defaultParams: MathArtParams = {
  spirograph: { R: 115, r: 38, d: 52, turns: 18 },
  resonance: { n: 3, m: 4, amp: 14, spacing: 18 },
  mandelbrot: { zoom: 145, iterations: 28, panX: -52, panY: 0 },
  fern: { points: 2800, size: 48 },
  wind: { scale: 25, strength: 16, octaves: 2, drift: 1 },
  fracture: { cell: 9 },
  "black-hole": { strength: 28, radius: 120, power: 12 },
  neon: { freq: 1, ripple: 0.5, glow: 0.6 },
};

/**
 * One generator (so the canvas shows a single figure) plus the wind warp and the
 * neon colour pass. Enabling two generators at once composites two figures into
 * the same canvas, which reads as "two visuals" rather than one.
 */
export const defaultEnabled: BlockId[] = ["spirograph", "wind", "neon"];

export type PaletteId = "aurora" | "ember" | "neon" | "lagoon" | "mono" | "candy";

export interface Palette {
  id: PaletteId;
  label: string;
  background: string;
  colors: string[];
}

export const palettes: Palette[] = [
  { id: "aurora", label: "Aurora", background: "#050a12", colors: ["#1b3b6f", "#2ec4b6", "#8affc1", "#eafff5"] },
  { id: "ember", label: "Ember", background: "#0a0503", colors: ["#3a0d0d", "#b3241c", "#ff7b00", "#ffd166"] },
  { id: "neon", label: "Neon", background: "#05010a", colors: ["#ff2fb9", "#7b2ff7", "#00e5ff", "#b6ff00"] },
  { id: "lagoon", label: "Lagoon", background: "#02110f", colors: ["#083d3d", "#0fa3a3", "#5ce1e6", "#d6fff8"] },
  { id: "mono", label: "Mono", background: "#06070a", colors: ["#2b3a55", "#7f8ca8", "#d7dee9", "#ffffff"] },
  { id: "candy", label: "Candy", background: "#0b0612", colors: ["#ff5d8f", "#ffca3a", "#8ac926", "#1982c4"] },
];

export const paletteById: Record<PaletteId, Palette> = palettes.reduce(
  (map, palette) => {
    map[palette.id] = palette;
    return map;
  },
  {} as Record<PaletteId, Palette>,
);

export interface Preset {
  id: string;
  label: string;
  description: string;
  palette: PaletteId;
  stack: BlockId[];
  params?: Partial<Record<BlockId, BlockParams>>;
}

export const presets: Preset[] = [
  {
    id: "celestial",
    label: "Celestial",
    description: "Rotating ribbon swept by gentle noise.",
    palette: "aurora",
    stack: ["spirograph", "wind", "neon"],
    params: { spirograph: { R: 128, r: 34, d: 62, turns: 22 }, wind: { scale: 18, strength: 22, octaves: 3, drift: 1 } },
  },
  {
    id: "deep-space",
    label: "Deep space",
    description: "Fractal nebula squeezed toward a gravity well.",
    palette: "neon",
    stack: ["mandelbrot", "black-hole", "neon"],
    params: { mandelbrot: { zoom: 190, iterations: 44, panX: -74, panY: 6 } },
  },
  {
    id: "silk",
    label: "Silk",
    description: "Layered ribbons and standing waves in lagoon tones.",
    palette: "lagoon",
    stack: ["spirograph", "resonance", "wind", "neon"],
    params: { resonance: { n: 5, m: 7, amp: 26, spacing: 14 }, wind: { scale: 12, strength: 14, octaves: 2, drift: 0.6 } },
  },
  {
    id: "blueprint",
    label: "Blueprint",
    description: "Technical nodal grid cut into modular cells.",
    palette: "mono",
    stack: ["resonance", "fracture"],
    params: { resonance: { n: 2, m: 9, amp: 34, spacing: 20 } },
  },
  {
    id: "garden",
    label: "Garden",
    description: "An IFS fern grown through a drift of noise.",
    palette: "candy",
    stack: ["fern", "wind", "neon"],
    params: { fern: { points: 5200, size: 46 }, wind: { scale: 8, strength: 20, octaves: 3, drift: 1.2 } },
  },
  {
    id: "storm",
    label: "Storm",
    description: "Waves, nebula and gravity braided by wind and fracture.",
    palette: "ember",
    stack: ["resonance", "mandelbrot", "wind", "fracture", "black-hole"],
    params: { wind: { scale: 30, strength: 40, octaves: 4, drift: 1.6 } },
  },
];

/** FNV-1a hash: turns a human seed string into a stable 32-bit integer. */
export function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function randomSeed(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface NoiseField {
  noise3: (x: number, y: number, z: number) => number;
  fbm: (x: number, y: number, z: number, octaves: number) => number;
}

/** Seeded classic Perlin noise (Ken Perlin's reference gradient function). */
export function createNoise(seed: number): NoiseField {
  const rng = mulberry32(seed || 1);
  const source = new Uint8Array(256);
  for (let i = 0; i < 256; i += 1) source[i] = i;
  for (let i = 255; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = source[i];
    source[i] = source[j];
    source[j] = tmp;
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i += 1) perm[i] = source[i & 255];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number, z: number) => {
    switch (hash & 15) {
      case 0: return x + y;
      case 1: return -x + y;
      case 2: return x - y;
      case 3: return -x - y;
      case 4: return x + z;
      case 5: return -x + z;
      case 6: return x - z;
      case 7: return -x - z;
      case 8: return y + z;
      case 9: return -y + z;
      case 10: return y - z;
      case 11: return -y - z;
      case 12: return y + x;
      case 13: return -y + z;
      case 14: return y - x;
      default: return -y - z;
    }
  };

  const noise3 = (x: number, y: number, z: number): number => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const zi = Math.floor(z) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);
    const u = fade(xf);
    const v = fade(yf);
    const w = fade(zf);
    const a = perm[xi] + yi;
    const aa = perm[a] + zi;
    const ab = perm[a + 1] + zi;
    const b = perm[xi + 1] + yi;
    const ba = perm[b] + zi;
    const bb = perm[b + 1] + zi;
    return lerp(
      lerp(
        lerp(grad(perm[aa], xf, yf, zf), grad(perm[ba], xf - 1, yf, zf), u),
        lerp(grad(perm[ab], xf, yf - 1, zf), grad(perm[bb], xf - 1, yf - 1, zf), u),
        v,
      ),
      lerp(
        lerp(grad(perm[aa + 1], xf, yf, zf - 1), grad(perm[ba + 1], xf - 1, yf, zf - 1), u),
        lerp(grad(perm[ab + 1], xf, yf - 1, zf - 1), grad(perm[bb + 1], xf - 1, yf - 1, zf - 1), u),
        v,
      ),
      w,
    );
  };

  const fbm = (x: number, y: number, z: number, octaves: number): number => {
    const count = Math.max(1, Math.round(octaves));
    let amplitude = 0.5;
    let frequency = 1;
    let sum = 0;
    let norm = 0;
    for (let i = 0; i < count; i += 1) {
      sum += amplitude * noise3(x * frequency, y * frequency, z * frequency);
      norm += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }
    return norm === 0 ? 0 : sum / norm;
  };

  return { noise3, fbm };
}

export function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** Splits a flat polyline into `chunks` overlapping runs so each can take its own colour. */
function splitLine(pts: Float32Array, chunks: number): Strand[] {
  const count = pts.length / 2;
  const out: Strand[] = [];
  for (let c = 0; c < chunks; c += 1) {
    const start = Math.floor((c * (count - 1)) / chunks);
    const end = Math.floor(((c + 1) * (count - 1)) / chunks);
    out.push({
      pts: pts.slice(start * 2, (end + 1) * 2),
      metric: chunks <= 1 ? 0 : c / (chunks - 1),
      mode: "line",
    });
  }
  return out;
}

function buildSpirograph(params: BlockParams): GeometryEntry {
  const outer = params.R + params.r;
  const inner = Math.max(1, params.r);
  const maxT = Math.PI * params.turns;
  const step = 0.035;
  const total = Math.max(2, Math.floor(maxT / step));
  const pts = new Float32Array(total * 2);
  const ratio = outer / inner;
  for (let i = 0; i < total; i += 1) {
    const t = i * step;
    pts[i * 2] = outer * Math.cos(t) - params.d * Math.cos(ratio * t);
    pts[i * 2 + 1] = outer * Math.sin(t) - params.d * Math.sin(ratio * t);
  }
  return { strands: splitLine(pts, 90), spin: 0.35 };
}

function buildResonance(params: BlockParams): GeometryEntry {
  const spacing = Math.max(4, params.spacing);
  const columns: number[] = [];
  for (let x = -REF_HALF_W + spacing / 2; x < REF_HALF_W; x += spacing) columns.push(x);
  const strands: Strand[] = columns.map((x, index) => {
    const rows = Math.floor(REF_HEIGHT / 8) + 1;
    const pts = new Float32Array(rows * 2);
    for (let i = 0; i < rows; i += 1) {
      pts[i * 2] = x;
      pts[i * 2 + 1] = -REF_HALF_H + i * 8;
    }
    return { pts, metric: columns.length <= 1 ? 0 : index / (columns.length - 1), mode: "line" as const };
  });
  return { strands, spin: 0 };
}

function buildMandelbrot(params: BlockParams): GeometryEntry {
  const zoom = Math.max(10, params.zoom);
  const maxIter = Math.max(4, Math.round(params.iterations));
  const panX = params.panX / 100;
  const panY = params.panY / 100;
  const buckets: number[][] = Array.from({ length: maxIter }, () => []);
  for (let x = -210; x < 210; x += 5) {
    for (let y = -155; y < 155; y += 5) {
      let zx = 0;
      let zy = 0;
      const cx = x / zoom + panX;
      const cy = y / zoom + panY;
      let iteration = 0;
      while (zx * zx + zy * zy < 4 && iteration < maxIter) {
        const next = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = next;
        iteration += 1;
      }
      if (iteration < maxIter) buckets[iteration].push(x, y);
    }
  }
  const strands: Strand[] = [];
  for (let i = 0; i < maxIter; i += 1) {
    if (buckets[i].length === 0) continue;
    strands.push({
      pts: new Float32Array(buckets[i]),
      metric: maxIter <= 1 ? 0 : i / (maxIter - 1),
      mode: "points",
    });
  }
  return { strands, spin: 0.04 };
}

function buildFern(params: BlockParams, rng: () => number): GeometryEntry {
  const total = Math.max(100, Math.round(params.points));
  const scale = params.size;
  const xs = new Float32Array(total);
  const ys = new Float32Array(total);
  let x = 0;
  let y = 0;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < total; i += 1) {
    const r = rng();
    let nx: number;
    let ny: number;
    if (r < 0.01) {
      nx = 0;
      ny = 0.16 * y;
    } else if (r < 0.86) {
      nx = 0.85 * x + 0.04 * y;
      ny = -0.04 * x + 0.85 * y + 1.6;
    } else if (r < 0.93) {
      nx = 0.2 * x - 0.26 * y;
      ny = 0.23 * x + 0.22 * y + 1.6;
    } else {
      nx = -0.15 * x + 0.28 * y;
      ny = 0.26 * x + 0.24 * y + 0.44;
    }
    x = nx;
    y = ny;
    const py = -y * scale + 125;
    xs[i] = x * scale;
    ys[i] = py;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;
  }
  const span = Math.max(1, maxY - minY);
  const chunkCount = 40;
  const per = Math.ceil(total / chunkCount);
  const strands: Strand[] = [];
  for (let start = 0; start < total; start += per) {
    const end = Math.min(total, start + per);
    const count = end - start;
    const pts = new Float32Array(count * 2);
    let sum = 0;
    for (let i = 0; i < count; i += 1) {
      pts[i * 2] = xs[start + i];
      pts[i * 2 + 1] = ys[start + i];
      sum += ys[start + i];
    }
    strands.push({ pts, metric: clamp01(((sum / count) - minY) / span), mode: "points" });
  }
  return { strands, spin: 0 };
}

export function buildGeometry(params: MathArtParams, seed: number): Record<BaseId, GeometryEntry> {
  return {
    spirograph: buildSpirograph(params.spirograph),
    resonance: buildResonance(params.resonance),
    mandelbrot: buildMandelbrot(params.mandelbrot),
    fern: buildFern(params.fern, mulberry32(seed ^ 0x9e3779b9)),
  };
}

/** Deep-copies strands so cached geometry can be warped per frame. */
export function cloneStrands(strands: Strand[]): Strand[] {
  return strands.map((strand) => ({ metric: strand.metric, mode: strand.mode, pts: strand.pts.slice() }));
}

/** Time-dependent generator motion that stays out of the geometry cache. */
export function animateStrands(id: BaseId, strands: Strand[], params: MathArtParams, time: number): void {
  if (id !== "resonance") return;
  const { n, m, amp } = params.resonance;
  for (const strand of strands) {
    const pts = strand.pts;
    for (let i = 0; i < pts.length; i += 2) {
      const x = pts[i] + REF_HALF_W;
      const y = pts[i + 1] + REF_HALF_H;
      const a = Math.sin((n * Math.PI * x) / REF_WIDTH) * Math.sin((m * Math.PI * y) / REF_HEIGHT);
      const b = Math.sin((m * Math.PI * x) / REF_WIDTH) * Math.sin((n * Math.PI * y) / REF_HEIGHT);
      const z = (amp * (a + b)) / 2;
      pts[i] += z * Math.sin(time);
      pts[i + 1] += z * Math.cos(time);
    }
  }
}

/** Warps every strand in place. Neon is a colour modifier and handled at render time. */
export function applyModifier(
  id: ModifierId,
  strands: Strand[],
  params: MathArtParams,
  time: number,
  noise: NoiseField,
): void {
  if (id === "wind") {
    const { scale, strength, octaves, drift } = params.wind;
    const frequency = scale / 1000;
    for (const strand of strands) {
      const pts = strand.pts;
      for (let i = 0; i < pts.length; i += 2) {
        const x = pts[i];
        const y = pts[i + 1];
        const n1 = noise.fbm(x * frequency, y * frequency, time * 0.35 * drift, octaves);
        const n2 = noise.fbm(y * frequency + 5.2, x * frequency - 1.3, time * 0.35 * drift + 3.7, octaves);
        pts[i] = x + n1 * strength;
        pts[i + 1] = y + n2 * strength;
      }
    }
    return;
  }
  if (id === "fracture") {
    const cell = Math.max(1, params.fracture.cell);
    for (const strand of strands) {
      const pts = strand.pts;
      for (let i = 0; i < pts.length; i += 2) {
        pts[i] = Math.round(pts[i] / cell) * cell;
        pts[i + 1] = Math.round(pts[i + 1] / cell) * cell;
      }
    }
    return;
  }
  if (id === "black-hole") {
    const { strength, radius, power } = params["black-hole"];
    const maxPull = strength / 100;
    const falloff = power / 10;
    for (const strand of strands) {
      const pts = strand.pts;
      for (let i = 0; i < pts.length; i += 2) {
        const x = pts[i];
        const y = pts[i + 1];
        const distance = Math.max(70, Math.hypot(x, y));
        const pull = Math.min(maxPull, Math.pow(radius / distance, falloff));
        pts[i] = x * (1 - pull);
        pts[i + 1] = y * (1 - pull);
      }
    }
  }
}

const rgbCache = new Map<string, [number, number, number]>();

export function hexToRgb(hex: string): [number, number, number] {
  const cached = rgbCache.get(hex);
  if (cached) return cached;
  const value = hex.replace("#", "");
  const expanded = value.length === 3 ? value.replace(/(.)/g, "$1$1") : value;
  const int = Number.parseInt(expanded, 16);
  const rgb: [number, number, number] = [(int >> 16) & 255, (int >> 8) & 255, int & 255];
  rgbCache.set(hex, rgb);
  return rgb;
}

export function paletteRgb(palette: Palette): [number, number, number][] {
  return palette.colors.map(hexToRgb);
}

export function samplePalette(colors: [number, number, number][], m: number): [number, number, number] {
  if (colors.length === 1) return colors[0];
  const scaled = clamp01(m) * (colors.length - 1);
  const index = Math.min(colors.length - 2, Math.floor(scaled));
  const t = scaled - index;
  const a = colors[index];
  const b = colors[index + 1];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export interface NeonOptions {
  freq: number;
  ripple: number;
}

/** Maps a strand metric through the palette, optionally rippled by the neon shader. */
export function resolveColor(
  colors: [number, number, number][],
  metric: number,
  time: number,
  neon: NeonOptions | null,
): [number, number, number] {
  let m = clamp01(metric);
  if (neon) {
    const wave = 0.5 + 0.5 * Math.cos(neon.freq * Math.PI * 2 * m + time * 1.6);
    const mix = clamp01(neon.ripple);
    m = clamp01(m * (1 - mix) + wave * mix);
  }
  return samplePalette(colors, m);
}
