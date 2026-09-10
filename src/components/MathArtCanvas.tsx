"use client";

import { useEffect, useMemo, useRef, useState } from "react";
// Both p5 and gifshot execute browser-only code the moment their module is
// evaluated: p5's DOM addon pokes `navigator.mediaDevices`, and gifshot is an
// IIFE that reads `window.URL`. A plain import therefore puts them in the
// server bundle and crashes prerendering, so they are loaded lazily further
// down (see the mount effect and downloadGif). The type is still imported
// statically because it is erased at compile time.
import type p5 from "p5";
import {
  animateStrands,
  applyModifier,
  blockMeta,
  blocks,
  buildGeometry,
  cloneStrands,
  createNoise,
  defaultEnabled,
  defaultParams,
  hashSeed,
  hexToRgb,
  paletteRgb,
  paletteById,
  palettes,
  paramSpecs,
  presets,
  randomSeed,
  resolveColor,
  REF_HEIGHT,
  REF_WIDTH,
} from "@/lib/mathArt";
import type {
  BaseId,
  BlockId,
  GeometryEntry,
  MathArtParams,
  ModifierId,
  NoiseField,
  PaletteId,
  Preset,
  Strand,
} from "@/lib/mathArt";

interface EngineSettings {
  stack: BlockId[];
  params: MathArtParams;
  paletteId: PaletteId;
  speed: number;
  fade: number;
  bloom: number;
  playing: boolean;
  geometry: Record<BaseId, GeometryEntry>;
  noise: NoiseField;
}

interface RenderBuffer {
  strands: Strand[];
  neon: boolean;
  spin: number;
}

const INITIAL_SEED = "ROHIN";

export default function MathArtCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<p5 | null>(null);
  const renderRef = useRef<((g: p5, width: number, height: number, time: number, fresh?: boolean) => void) | null>(null);
  const phaseRef = useRef(0);

  const [order, setOrder] = useState<BlockId[]>(blocks);
  const [enabled, setEnabled] = useState<BlockId[]>(defaultEnabled);
  const [params, setParams] = useState<MathArtParams>(defaultParams);
  const [paletteId, setPaletteId] = useState<PaletteId>("aurora");
  const [speed, setSpeed] = useState(1);
  const [fade, setFade] = useState(0);
  const [bloom, setBloom] = useState(0.5);
  const [seed, setSeed] = useState(INITIAL_SEED);
  const [playing, setPlaying] = useState(true);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [exportScale, setExportScale] = useState(2);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [openParamGroups, setOpenParamGroups] = useState<Record<string, boolean>>({});
  const [openEquation, setOpenEquation] = useState<BlockId | null>(null);

  const seedNum = useMemo(() => hashSeed(seed), [seed]);
  const geometry = useMemo(() => buildGeometry(params, seedNum), [params, seedNum]);
  const noise = useMemo(() => createNoise(seedNum), [seedNum]);
  const stack = useMemo(() => order.filter((id) => enabled.includes(id)), [order, enabled]);

  const settingsRef = useRef<EngineSettings>({ stack, params, paletteId, speed, fade, bloom, playing, geometry, noise });

  useEffect(() => {
    settingsRef.current = { stack, params, paletteId, speed, fade, bloom, playing, geometry, noise };
  }, [stack, params, paletteId, speed, fade, bloom, playing, geometry, noise]);

  // Pause the field for visitors who prefer reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    let instance: p5 | null = null;
    let cancelled = false;

    const sketch = (instance: p5) => {
      let phase = 0;
      let firstFrame = true;

      const drawBuffer = (
        g: p5,
        buffer: RenderBuffer,
        colors: [number, number, number][],
        neon: { freq: number; ripple: number } | null,
        time: number,
        pass: "glow" | "core",
        intensity: number,
      ) => {
        const activeNeon = buffer.neon ? neon : null;
        g.push();
        g.rotate(buffer.spin * time);
        for (const strand of buffer.strands) {
          const [r, green, blue] = resolveColor(colors, strand.metric, time, activeNeon);
          const isPoints = strand.mode === "points";
          if (pass === "glow") {
            g.strokeWeight(isPoints ? 4 : 3.2);
            g.stroke(r, green, blue, Math.min(96, 140 * intensity) * (isPoints ? 0.6 : 1));
          } else {
            g.strokeWeight(isPoints ? 1.7 : 1.5);
            g.stroke(r, green, blue, isPoints ? 150 : 205);
          }
          const pts = strand.pts;
          if (isPoints) g.beginShape(instance.POINTS);
          else g.beginShape();
          for (let i = 0; i < pts.length; i += 2) g.vertex(pts[i], pts[i + 1]);
          g.endShape();
        }
        g.pop();
      };

      const render = (g: p5, width: number, height: number, time: number, fresh = false) => {
        const s = settingsRef.current;
        const palette = paletteById[s.paletteId];
        const bg = hexToRgb(palette.background);
        const ctx = g.drawingContext as CanvasRenderingContext2D;
        const colors = paletteRgb(palette);
        const neon = s.stack.includes("neon") ? { freq: s.params.neon.freq, ripple: s.params.neon.ripple } : null;
        const neonGlow = s.stack.includes("neon") ? s.params.neon.glow : 0;

        const useTrails = !fresh && s.fade > 0.01 && s.playing && !firstFrame;
        if (useTrails) {
          g.noStroke();
          g.fill(bg[0], bg[1], bg[2], 255 * s.fade);
          g.rect(0, 0, width, height);
        } else {
          g.background(bg[0], bg[1], bg[2]);
        }
        if (!fresh) firstFrame = false;

        g.push();
        g.translate(width / 2, height / 2);
        g.scale(height / REF_HEIGHT);
        g.noFill();

        // Walk the stack: generators emit strands, modifiers warp everything below them.
        const buffers: RenderBuffer[] = [];
        for (const id of s.stack) {
          const meta = blockMeta[id];
          if (meta.role === "base") {
            const entry = s.geometry[id as BaseId];
            const strands = cloneStrands(entry.strands);
            animateStrands(id as BaseId, strands, s.params, time);
            buffers.push({ strands, neon: false, spin: entry.spin });
          } else if (id === "neon") {
            for (const buffer of buffers) buffer.neon = true;
          } else {
            applyModifier(id as ModifierId, buffers.flatMap((buffer) => buffer.strands), s.params, time, s.noise);
          }
        }

        if (Math.max(s.bloom, neonGlow) > 0.01) {
          ctx.globalCompositeOperation = "lighter";
          for (const buffer of buffers) {
            drawBuffer(g, buffer, colors, neon, time, "glow", Math.max(s.bloom, buffer.neon ? neonGlow : 0));
          }
        }
        for (const buffer of buffers) {
          ctx.globalCompositeOperation = buffer.neon ? "lighter" : "source-over";
          drawBuffer(g, buffer, colors, neon, time, "core", 0);
        }
        ctx.globalCompositeOperation = "source-over";
        g.pop();
      };

      renderRef.current = render;

      instance.setup = () => {
        instanceRef.current = instance;
        const canvas = instance.createCanvas(REF_WIDTH, REF_HEIGHT);
        canvas.parent(mountRef.current!);
        instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
      };

      instance.draw = () => {
        const s = settingsRef.current;
        if (s.playing) phase += 0.015 * s.speed;
        phaseRef.current = phase;
        render(instance, instance.width, instance.height, phase);
      };
    };

    // Loaded on demand so p5 never reaches the server bundle. The cleanup flag
    // covers React's StrictMode double-invoke: the first run is torn down before
    // its import resolves, so it must not create an orphan canvas.
    void (async () => {
      const { default: P5 } = await import("p5");
      if (cancelled) return;
      instance = new P5(sketch);
    })();

    return () => {
      cancelled = true;
      instance?.remove();
      instanceRef.current = null;
      renderRef.current = null;
    };
  }, []);

  const updateParam = (id: BlockId, key: string, value: number) => {
    setParams((current) => ({ ...current, [id]: { ...current[id], [key]: value } }));
    setActivePreset(null);
  };

  const toggleBlock = (id: BlockId) => {
    setEnabled((current) => (current.includes(id) ? current.filter((block) => block !== id) : [...current, id]));
    setActivePreset(null);
  };

  const moveBlock = (id: BlockId, direction: -1 | 1) => {
    setOrder((current) => {
      const index = current.indexOf(id);
      const next = index + direction;
      if (index < 0 || next < 0 || next >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
    setActivePreset(null);
  };

  const applyPreset = (preset: Preset) => {
    const merged = { ...defaultParams };
    for (const id of blocks) {
      merged[id] = { ...defaultParams[id], ...(preset.params?.[id] ?? {}) };
    }
    setParams(merged);
    setPaletteId(preset.palette);
    setEnabled(preset.stack);
    setOrder([...preset.stack, ...blocks.filter((id) => !preset.stack.includes(id))]);
    setActivePreset(preset.id);
  };

  const reset = () => {
    setParams(defaultParams);
    setOrder(blocks);
    setEnabled(defaultEnabled);
    setPaletteId("aurora");
    setSpeed(1);
    setFade(0);
    setBloom(0.5);
    setActivePreset(null);
  };

  const downloadPng = () => {
    const instance = instanceRef.current;
    const render = renderRef.current;
    if (!instance || !render) return;
    const width = REF_WIDTH * exportScale;
    const height = REF_HEIGHT * exportScale;
    const buffer = instance.createGraphics(width, height);
    buffer.pixelDensity(1);
    render(buffer, width, height, phaseRef.current, true);
    const canvas = (buffer as unknown as { canvas: HTMLCanvasElement }).canvas;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `math-art-${seed}-${exportScale}x.png`;
    link.click();
    buffer.remove();
  };

  const downloadGif = async () => {
    const instance = instanceRef.current;
    const render = renderRef.current;
    if (!instance || !render || exporting) return;
    setExporting(true);
    setExportProgress(0);
    const gifWidth = 480;
    const gifHeight = Math.round((gifWidth * REF_HEIGHT) / REF_WIDTH);
    const buffer = instance.createGraphics(gifWidth, gifHeight);
    buffer.pixelDensity(1);
    const frames = 24;
    const step = 0.55;
    const base = phaseRef.current;
    const images: string[] = [];
    const canvas = (buffer as unknown as { canvas: HTMLCanvasElement }).canvas;
    for (let i = 0; i < frames; i += 1) {
      render(buffer, gifWidth, gifHeight, base + i * step, true);
      images.push(canvas.toDataURL("image/png"));
      setExportProgress(Math.round(((i + 1) / frames) * 40));
    }
    buffer.remove();
    // Fetched on demand: gifshot reads `window` while its module evaluates.
    const { createGIF } = await import("gifshot");
    createGIF(
      {
        images,
        gifWidth,
        gifHeight,
        interval: 0.06,
        progressCallback: (value: number) => setExportProgress(40 + Math.round(value * 60)),
      },
      (result) => {
        setExporting(false);
        if (result.error || !result.image) {
          window.alert(result.errorMsg ?? "GIF export failed.");
          return;
        }
        const link = document.createElement("a");
        link.href = result.image;
        link.download = `math-art-${seed}.gif`;
        link.click();
      },
    );
  };

  const slider = (
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    onChange: (value: number) => void,
  ) => (
    <label className="math-art-slider" key={label}>
      <span>
        {label} <strong>{step < 1 ? value.toFixed(2) : Math.round(value)}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );

  // Describes what each enabled block contributes to the single composited image.
  const layerVerb = (id: BlockId) => {
    if (id === "neon") return "colours";
    return blockMeta[id].role === "base" ? "generates" : "warps";
  };

  // Keep one parameter group expanded by default so the panel stays short,
  // but let visitors collapse or open exactly what they need.
  const isGroupOpen = (id: BlockId, index: number) => openParamGroups[id] ?? index === 0;

  return (
    <section className="math-art-workbench">
      <aside className="material-card math-art-controls math-art-controls--left">
        <div className="math-art-panel-head">
          <p className="page-label">Active stack</p>
          <h2>Shape the field</h2>
        </div>

        <div className="math-art-section math-art-section--first">
          <p className="label">Render order</p>
          <ol className="math-art-stack">
            {order.map((id, index) => {
              const meta = blockMeta[id];
              const isOn = enabled.includes(id);
              return (
                <li key={id} className={isOn ? "math-art-stack-row is-on" : "math-art-stack-row"}>
                  <label className="math-art-stack-toggle">
                    <input type="checkbox" checked={isOn} onChange={() => toggleBlock(id)} />
                    <span className="math-art-stack-label">{meta.label}</span>
                  </label>
                  <span className={`math-art-role math-art-role--${meta.role}`}>{meta.role}</span>
                  <span className="math-art-reorder">
                    <button type="button" onClick={() => moveBlock(id, -1)} disabled={index === 0} aria-label={`Move ${meta.label} earlier`}>
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlock(id, 1)}
                      disabled={index === order.length - 1}
                      aria-label={`Move ${meta.label} later`}
                    >
                      ▼
                    </button>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="math-art-section">
          <p className="label">Palette</p>
          <div className="math-art-palettes">
            {palettes.map((palette) => (
              <button
                key={palette.id}
                type="button"
                className={palette.id === paletteId ? "math-art-palette is-active" : "math-art-palette"}
                onClick={() => {
                  setPaletteId(palette.id);
                  setActivePreset(null);
                }}
              >
                <span className="math-art-palette-swatches">
                  {palette.colors.map((color) => (
                    <i key={color} style={{ background: color }} />
                  ))}
                </span>
                <span>{palette.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="math-art-section">
          <p className="label">Presets</p>
          <div className="math-art-presets">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={activePreset === preset.id ? "math-art-preset is-active" : "math-art-preset"}
                onClick={() => applyPreset(preset)}
              >
                <strong>{preset.label}</strong>
                <small>{preset.description}</small>
              </button>
            ))}
          </div>
        </div>

      </aside>

      <div className="material-card math-art-stage">
        <div className="math-art-toolbar">
          <button className="button" type="button" onClick={() => setPlaying((current) => !current)}>
            {playing ? "Pause" : "Play"}
          </button>
          <label className="math-art-seed">
            <span className="label">Seed</span>
            <input
              type="text"
              value={seed}
              maxLength={12}
              spellCheck={false}
              onChange={(event) => {
                setSeed(event.target.value.toUpperCase());
                setActivePreset(null);
              }}
            />
          </label>
          <button className="button ghost" type="button" onClick={() => { setSeed(randomSeed()); setActivePreset(null); }}>
            Randomise
          </button>
          <button className="button ghost" type="button" onClick={reset}>
            Reset
          </button>
          <span className="math-art-toolbar-note">
            {enabled.length === 0
              ? "No layers enabled"
              : `${enabled.length} ${enabled.length === 1 ? "layer" : "layers"} combined below`}
          </span>
        </div>

        <div ref={mountRef} className="math-art-canvas" />

        <div className="math-art-layers">
          <span className="label">Layers combined</span>
          {stack.length === 0 ? (
            <span className="math-art-note">Nothing enabled — the canvas is empty.</span>
          ) : (
            <ol className="math-art-layer-list">
              {stack.map((id) => (
                <li key={id} className={`math-art-layer math-art-layer--${blockMeta[id].role}`}>
                  <span className="math-art-layer-verb">{layerVerb(id)}</span>
                  <span className="math-art-layer-label">{blockMeta[id].label}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="math-art-export">
          <span className="label">Export</span>
          <span className="math-art-scale" role="group" aria-label="Export scale">
            {[1, 2, 3, 4].map((scale) => (
              <button
                key={scale}
                type="button"
                className={exportScale === scale ? "is-active" : undefined}
                aria-pressed={exportScale === scale}
                onClick={() => setExportScale(scale)}
              >
                {scale}×
              </button>
            ))}
          </span>
          <button className="button" type="button" onClick={downloadPng}>
            Download PNG
          </button>
          <button className="button ghost" type="button" onClick={downloadGif} disabled={exporting}>
            {exporting ? `Rendering GIF ${exportProgress}%` : "Download GIF"}
          </button>
          {exporting ? (
            <p className="math-art-note" aria-live="polite">
              Exporting animation… {exportProgress}%
            </p>
          ) : null}
        </div>

        <div className="math-art-section math-art-equations">
          <p className="label">Equations in this stack</p>
          {stack.length === 0 ? (
            <p className="math-art-note">Enable a building block to inspect its equation.</p>
          ) : (
            stack.map((id) => (
              <details
                key={id}
                className="math-art-equation"
                open={openEquation === id}
                onToggle={(event) => {
                  // Read the DOM flag up front: React may run the updater later,
                  // by which point event.currentTarget is already null.
                  if (event.currentTarget.open) setOpenEquation(id);
                  else setOpenEquation((current) => (current === id ? null : current));
                }}
              >
                <summary>{blockMeta[id].label}</summary>
                <pre>{blockMeta[id].equation}</pre>
                <p>{blockMeta[id].blurb}</p>
              </details>
            ))
          )}
        </div>
      </div>

      <aside className="material-card math-art-controls math-art-controls--right">
        <div className="math-art-panel-head">
          <p className="page-label">Tuning</p>
          <h2>Motion &amp; parameters</h2>
        </div>

        <div className="math-art-section math-art-section--first">
          <p className="label">Motion</p>
          {slider("Speed", speed, 0, 3, 0.05, setSpeed)}
          {slider("Trails", fade, 0, 0.92, 0.02, setFade)}
          {slider("Bloom", bloom, 0, 1, 0.05, setBloom)}
        </div>

        <div className="math-art-section">
          <p className="label">Block parameters</p>
          {enabled.length === 0 ? (
            <p className="math-art-note">Enable a block to tune it.</p>
          ) : (
            enabled.map((id, index) => (
              <details
                key={id}
                className="math-art-param-group"
                open={isGroupOpen(id, index)}
                onToggle={(event) => {
                  // Snapshot before setState: the updater can run during render,
                  // when event.currentTarget has already been nulled out.
                  const { open } = event.currentTarget;
                  setOpenParamGroups((current) => ({ ...current, [id]: open }));
                }}
              >
                <summary>{blockMeta[id].label}</summary>
                {paramSpecs[id].map((spec) =>
                  slider(
                    spec.label,
                    params[id][spec.key],
                    spec.min,
                    spec.max,
                    spec.step,
                    (value) => updateParam(id, spec.key, value),
                  ),
                )}
              </details>
            ))
          )}
        </div>
      </aside>
    </section>
  );
}