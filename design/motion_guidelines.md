# Motion Guidelines

## 3D Page Transitions
- **Cube Rotation** – Pages rotate like a 3D cube on navigation. Duration: 800ms, easing: `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Slide‑In Layers** – New page slides in from the right while previous page slides out left with depth offset. Duration: 600ms.
- **Page Flip** – Quick flip effect for modal dialogs, 500ms.

## Parallax Sections
- **Background Parallax** – Background gradient moves slower than foreground content on scroll (ratio 0.3).
- **Card Parallax Hover** – Floating holographic cards shift on mouse move, subtle Z‑translation (0‑10px).

## Magnetic Button Interactions
- Buttons attract cursor within 40px radius, creating a magnetic pull effect. Scale up to 1.05x, glow intensifies.

## Floating Card Hover Animations
- Cards lift 12px on hover, add soft shadow and inner glow. Transition 300ms.

## Volumetric Lighting & Soft Shadows
- Use CSS `box‑shadow: 0 20px 40px rgba(0,0,0,0.25)` and `filter: drop‑shadow(0 0 10px var(--color-cyan))` for depth.

## Implementation Notes
- All animations defined as CSS variables for easy tweaking.
- Prefer `will-change: transform, opacity` for performance.
- Use `prefers-reduced-motion` media query to disable heavy 3D effects for accessibility.
