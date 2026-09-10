# Product Specification: MathArt Sandbox (Pure Frontend Engine)
> A zero-backend, modular visual playground where users stack mathematical phenomena to render complex generative art, which can be downloaded instantly.

---

## 🎨 1. Core Architecture (100% Frontend)

Because all rendering happens in the browser, your architecture relies on a fast client-side rendering loop.

*   **State Management:** A simple UI array (e.g., `activeStack = [ "Spirograph", "Cosmic Wind" ]`) dictates the render order.
*   **The Render Loop:** A `requestAnimationFrame` loop that clears an HTML5 `<canvas>` element and recalculates the pixel coordinates ($x, y$) based on the active mathematical block formulas.
*   **Export Pipeline:**
    *   *PNG Export:* Built-in `canvas.toDataURL("image/png")` allows instantaneous high-res image saving.
    *   *GIF Export:* Use **gifshot** or **html2canvas** to sample 30 frames of the canvas over a `Time` loop variable and compile it into an animated GIF client-side.

---

## 🧱 2. Expanded Semantic Block Library

To give users massive creative freedom, here are **8 intuitive building blocks** spanning the deep math world, translated into friendly, non-technical terms.

### 🧬 Category A: Base Structures (The Canvas Cores)

#### 1. 🧵 Spirograph Ribbon (Parametric Epitrochoid)
*   **What it does:** Generates sweeping geometric loops, planetary orbits, and silk-like drapes.
*   **The Math:** 
    $x(t) = (R + r)\cos(t) - d\cos\left(\frac{R+r}{r}t\right)$
    $y(t) = (R + r)\sin(t) - d\sin\left(\frac{R+r}{r}t\right)$

#### 2. 🔊 Sound Resonance (Chladni Acoustic Equations)
*   **What it does:** Generates symmetric geometric grids, nodal lines, and cybernetic blueprint structures.
*   **The Math:** 
    $z = a\sin(n\pi x)\sin(m\pi y) + b\sin(m\pi x)\sin(n\pi y)$

#### 3. 🌀 Infinite Mirror (The Mandelbrot / Julia Fractal)
*   **What it does:** Generates infinite self-similar detail, psychedelic webs, and deep-space fractal nebulae.
*   **The Math:** 
    $Z_{n+1} = Z_n^2 + C$

#### 4. 🌿 Nature's Fern (Barnsley Fractal / Iterated Function Systems)
*   **What it does:** Uses matrix probabilities to grow highly detailed, organic plant structures, branches, and trees out of pure random dots.
*   **The Math:** Stochastic affine transformations:
    $x_{n+1} = ax_n + by_n + e$,  $y_{n+1} = cx_n + dy_n + f$ (using variable probability matrices).

---

### 🌪️ Category B: Warping Modifiers (The Distorters)

#### 5. 💨 Cosmic Wind (Perlin / Simplex Noise Vectors)
*   **What it does:** Injects organic, fluid-like turbulence, making rigid math structures look windswept, smoky, or liquid.
*   **The Math:** Generates a pseudo-random continuous field where output coordinates scale smoothly: 
    $x_{\text{new}} = x + \text{Noise}(x, y, z)$

#### 6. 🎛️ Digital Fracture (Modular Step Arithmetic)
*   **What it does:** Introduces harsh pixel-sorting cuts, glitch art steps, and architectural interference patterns.
*   **The Math:** Drops smooth transitions by wrapping data using remainder operators: 
    $f(x,y) = (x \times y) \pmod m$

#### 7. 🌀 Black Hole Pull (Attractor Equations / Clifford Attractors)
*   **What it does:** Pulls all coordinate lines toward invisible gravitational points, wrapping lines into dense, chaotic digital gravity wells.
*   **The Math:** 
    $x_{n+1} = \sin(ay_n) + c\cos(ax_n)$
    $y_{n+1} = \sin(bx_n) + d\cos(by_n)$

#### 8. 🌈 Neon Wave Shader (Trigonometric Color Ripples)
*   **What it does:** Controls how color waves flow through the coordinates, mapping frequencies to shifting gradients.
*   **The Math:** Maps iteration depth or coordinate density to smooth cosine waves: 
    $\text{Color}(n) = \frac{1}{2} + \frac{1}{2}\cos(a \cdot n + b)$

---

## 💻 3. The Frontend Tech Stack Selection

To build this quickly without writing raw WebGL matrix logic by hand, use these developer-friendly frontend libraries:

*   **Canvas Framework:** **p5.js** or **Three.js (GLSL Shaders)**. p5.js is incredibly approachable for senior developers trying to spin up generative art quickly, providing immediate access to noise, parametric vectors, and canvas state.
*   **UI Layout:** **Tailwind CSS + React/Svelte**. This lets you create a clean, elegant layout where blocks resemble vertical layers that can be toggled on/off or rearranged.
*   **Client-Side GIF Rendering:** **gifshot** (by Yahoo) handles canvas snapshotting and packages everything into an optimized `.gif` download directly in the client browser.

---

## 🛠️ 4. Recommended Roadmap to Launch MVP

1.  **Step 1:** Set up a single fullscreen HTML5 Canvas wrapped in a basic UI container.
2.  **Step 2:** Write a centralized JavaScript controller that inputs an array of active block functions and calculates pixel coordinates sequentially.
3.  **Step 3:** Bind basic HTML slider controls to the variables inside your math equations (e.g., a slider changing the $R$ and $r$ values of the *Spirograph* block).
4.  **Step 4:** Hook up a simple trigger function utilizing `canvas.toDataURL()` linked to a **"Download Image"** button.
