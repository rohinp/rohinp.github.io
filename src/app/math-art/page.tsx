import type { Metadata } from "next";
import MathArtCanvas from "@/components/MathArtCanvas";

export const metadata: Metadata = {
  title: "Math Art Sandbox",
  description: "A browser-only mathematical generative art playground.",
};

export default function MathArtPage() {
  return (
    <div className="page-shell math-art-shell">
      <header className="page-header">
        <div>
          <p className="page-label">MathArt Sandbox</p>
          <h1>Stack mathematics. Make something unexpected.</h1>
          <p className="page-subtitle">
            Stack generative structures, warp them with noise and colour, tune every
            parameter, then export a still or a looping GIF. Everything renders locally.
          </p>
        </div>
      </header>
      <MathArtCanvas />
    </div>
  );
}
