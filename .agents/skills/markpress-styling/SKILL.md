---
name: markpress-styling
description: Guide for customizing layout, slide positioning, animations, and visual styles in markpress HTML presentations. Use when adjusting how slides move, transition, or look in the generated impress.js output.
---

# Markpress Styling & Layout Skill

This skill covers layout generation, manual slide positioning (3D/rotation/scale), built-in themes, and custom CSS for markpress impress.js presentations.

## Key Principles

- **All base options are set inline** via `<!--markpress-opt-->` in the markdown file — not as CLI flags or `build.cjs` arguments.
- **Custom CSS injection and HTML post-processing** are done in `build.cjs` after markpress generates the HTML.
- The `build.cjs` calls markpress with an empty options object (`{}`); the embedded options in the markdown file take precedence.
- **No GPU-specific CSS** — do not use `will-change`, `contain`, or any GPU hint. Slides must work smoothly on non-GPU browsers.

## Decision Tree

```
Do you want automatic positioning?
  YES → Set "layout" in <!--markpress-opt-->. Remove all <!--slide-attr--> comments.
  NO  → Add <!--slide-attr x=... y=... --> before each slide.

Do you want a different color scheme?
  Built-in is enough → Set "theme" in <!--markpress-opt-->
  Need custom colors  → Add <style> block in slides.md, or inject CSS in build.cjs

Do you need animations beyond impress.js defaults?
  YES → Add CSS transitions/animations in <style> targeting .step classes
        or .impress-on-step-N body class for per-slide triggers.
        For global/reusable styles, inject via build.cjs post-processing.
```

## Performance Pitfalls

The camera transition works in impress.js by applying a single CSS `transform` to a `#canvas` element that contains **all slides simultaneously**. Every `.step` child is composited on every animation frame during that transform. The default markpress theme is butter-smooth because its `.step` has zero paint cost — just `position`, `box-sizing`, and `opacity`. Any expensive CSS on `.step` (not `.step.active`) multiplies by the total slide count.

### The Mental Model: multiply by N slides

Before adding any CSS rule to `.step`, ask: **"is this applied to all N slides at once?"**

| Applies to | Paint cost multiplier |
|---|---|
| `.step` (base rule) | × N (all slides) |
| `.step.active` | × 1 (only current slide) |
| `body`, `html` | × 1 (single element) |

Put cheap, static properties on `.step`. Move anything visually rich to `.step.active`.

---

### Rule 1 — Never use `rgba()` backgrounds on `.step`

Semi-transparent backgrounds on `.step` are the single most common cause of sluggish transitions discovered in practice. During the canvas transform, each slide sweeps across the body gradient. Semi-transparent slides must be **alpha-composited against the changing background** on every frame — that is a full software repaint, not a GPU blit.

**Bad:**
```css
.step {
  background: rgba(255, 255, 255, 0.78); /* alpha compositing × N slides every frame */
}
```

**Good:**
```css
.step {
  background: #faf9f7; /* fully opaque — trivial GPU blit */
}
```

This also means: **never use `rgba()` for `--line`, `--surface`, or any CSS variable that feeds into a `.step` background or border**. Replace all `rgba(r,g,b,alpha)` with the equivalent pre-multiplied hex color.

---

### Rule 2 — Never use `backdrop-filter` on `.step`

`backdrop-filter: blur()` on `.step` forces the browser to create a separate composite layer for every slide and blur each one independently — even invisible ones.

**Bad:**
```css
.step { backdrop-filter: blur(16px); }
```

**Fix:** Remove it entirely. Use an opaque background color instead.

---

### Rule 3 — Never use `overflow: hidden` on `.step`

`overflow: hidden` combined with `border-radius` on a 3D-transformed element forces a stacking context and a clipping layer per slide. Remove it — use `clip-path` on `.step.active` only if you need clipping, or just rely on `border-radius` without clipping.

---

### Rule 4 — Never use pseudo-elements (`::before`, `::after`) on `.step`

Each pseudo-element is an extra paint surface. Two pseudo-elements on `.step` = 2 × N extra composite layers during the camera animation.

**Bad:**
```css
.step::before { background: radial-gradient(...); } /* × N slides */
.step::after  { background: radial-gradient(...); } /* × N slides */
```

**Good:**
```css
.step.active::before { background: radial-gradient(...); } /* × 1 slide only */
```

---

### Rule 5 — Never use multi-layer `radial-gradient` on `body`

The body background repaints as the canvas moves. Multiple stacked `radial-gradient` layers on `body` or `html` are expensive even as a single element — the browser must evaluate all gradient layers on every repaint.

**Bad:**
```css
body {
  background:
    radial-gradient(ellipse at 18% 14%, rgba(79,70,229,0.09) 0%, transparent 42%),
    radial-gradient(ellipse at 82% 78%, rgba(5,150,105,0.07) 0%, transparent 40%),
    radial-gradient(ellipse at 52% 52%, rgba(244,114,182,0.04) 0%, transparent 50%),
    #f0ede8;
}
```

**Good — follow the markpress default theme approach:**
```css
body {
  background: radial-gradient(#f0ede8, #d8d2c8); /* single gradient, cheap */
}
```

---

### Rule 6 — No `box-shadow` on `.step` base rule

`box-shadow` is a blur operation over the element's bounding box. On all N slides simultaneously it adds significant repaint cost.

**Bad:**
```css
.step { box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
```

**Good:**
```css
.step.active { box-shadow: 0 20px 60px rgba(0,0,0,0.12); } /* only active slide */
```

---

### Rule 7 — No content entrance animations on `.step > *`

Transitions/animations on direct children of `.step` (e.g., `translateY` stagger) run while the slide is already visible. They don't help the camera transition but add style recalculation and paint cost on arrival.

If you want entrance effects, keep them minimal: `opacity` only on `.step.active > *`, no `transform`.

---

### Rule 8 — Remove tiled `radial-gradient` background patterns

A `body::before` with `background-image: radial-gradient(... 1px, transparent 1px); background-size: 40px 40px` creates a massive tiled raster surface that must be repainted every frame as the camera moves.

**Bad:**
```css
body::before {
  background-image: radial-gradient(rgba(0,0,0,0.045) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

**Fix:** Remove it entirely. Use a solid or simple gradient body background.

---

### Rule 9 — Avoid `rotate-y` and `z` on slide positions

`data-rotate-y` and large `data-z` values on individual slides force the browser to compute per-slide 3D perspective matrices every frame. This is distinct from the camera transform — each slide's own 3D transform compounds the cost.

**Avoid:**
```
<!--slide-attr x=3000 y=-500 z=-900 rotate-y=7 -->
```

**Prefer 2D only:**
```
<!--slide-attr x=1700 y=-300 rotate=-2 -->
```

Use `rotate` (z-axis only) for visual variety. Reserve `rotate-y`/`rotate-x`/`z` for specific intentional 3D moments, not as a general layout choice.

---

### Rule 10 — Set `opacity: 0` (not `0.15`) on inactive `.step`

Inactive slides at `opacity: 0` are skipped by the compositor entirely — no paint, no blit. At `opacity: 0.15` they are still composited (just dimly). Zero is free; anything above zero has a cost.

```css
.step {
  opacity: 0;
  transition: opacity 200ms ease;
}
.step.active { opacity: 1; }
```

This also eliminates the "ghost slide" problem where nearby slides bleed into the viewport.

---

### Keep `data-transition-duration` at 200ms

A good default for a 2D flat layout. Set it via post-processing in `build.cjs`:

```js
stripped = stripped.replace(
  /(<div[^>]*id=["']impress["'][^>]*)(>)/,
  '$1 data-transition-duration="200"$2'
);
```

---

### The Safe CSS Checklist for `.step`

Before shipping, verify the base `.step` rule contains **only**:

- `position`, `width`, `min-height`, `padding`, `box-sizing`
- `border` (with fully opaque color — no `rgba`)
- `border-radius`
- `background` (fully opaque hex — no `rgba`, no gradients)
- `opacity: 0`
- `transition: opacity Xms ease`

Everything else belongs on `.step.active` or a per-slide `#step-N` rule.


## 1. Automatic Layout Generation

Set the `layout` option **inline** in the `<!--markpress-opt-->` block at the top of the markdown file. **Remove all `<!--slide-attr ...-->` comments first** — any positioning comment disables auto-layout.

### Available layouts

| Layout | Description | Effect |
|---|---|---|
| `horizontal` (default) | Slides along the X axis | Classic left-to-right |
| `vertical` | Slides along the Y axis | Top-to-bottom |
| `3d-push` | Slides along Z (deeper = later) | Camera zooms in |
| `3d-pull` | Slides along Z (higher = later) | Camera pulls back |
| `grid` | X and Y grid arrangement | Spatial overview |
| `random` | Random 5D space (x,y,z,rotate,scale) | Cinematic, re-run until satisfied |
| `random-7d` | Random 7D (+ rotate-x, rotate-y) | Very messy, use sparingly |

### Inline options (preferred)

```markdown
<!--markpress-opt
{
  "layout": "grid",
  "theme": "light",
  "autoSplit": false,
  "sanitize": false,
  "title": "My Presentation"
}
markpress-opt-->
```

## 2. Manual Slide Positioning with `<!--slide-attr-->`

Place an HTML comment **immediately before a slide's content** (after the `------` separator) to set its exact position in 3D space. This maps directly to impress.js `data-*` attributes.

### Syntax

```
<!--slide-attr x=<int> y=<int> z=<int> rotate=<deg> rotate-x=<deg> rotate-y=<deg> rotate-z=<deg> scale=<float> -->
```

All attributes are optional. Units are pixels for position, degrees for rotation, and a multiplier for scale.

### Attribute reference

| Attribute | impress.js mapping | Effect |
|---|---|---|
| `x` | `data-x` | Horizontal position (px) |
| `y` | `data-y` | Vertical position (px) |
| `z` | `data-z` | Depth position (px) |
| `rotate` | `data-rotate` | 2D rotation (degrees) |
| `rotate-x` | `data-rotate-x` | 3D tilt around X axis |
| `rotate-y` | `data-rotate-y` | 3D tilt around Y axis |
| `rotate-z` | `data-rotate-z` | 3D tilt around Z axis (same as `rotate`) |
| `scale` | `data-scale` | Zoom scale (1 = normal, 2 = 2× bigger) |

### Example — custom layout

```markdown
<!--slide-attr x=0 y=0 -->

# First slide

------
<!--slide-attr x=2600 y=0 -->

# Second slide — to the right

------
<!--slide-attr x=0 y=2600 rotate=90 -->

# Third slide — below, rotated

------
<!--slide-attr x=1200 y=1500 z=500 rotate-x=90 scale=0.5 -->

# Fourth slide — tilted in 3D, half size

------
<!-- zoom-out overview slide -->
<!--slide-attr x=1200 y=2000 z=4000 scale=2 -->

# Overview

```

### Rules
- Only one `<!--slide-attr-->` comment per slide.
- Comment must appear **after** the separator and **before** any content on that slide.
- Regular HTML comments (`<!-- ... -->`) that do not contain `slide-attr` are ignored.
- Mixing manual positioning and `--layout` is not supported; manual wins.

## 3. Themes

> Theme Customization is not possible to create new theme so you need to inject custom html css javascript in the build.cjs file and disbale default theme

Set the theme **inline** in `<!--markpress-opt-->`.

| Theme | Description |
|---|---|
| `light` (default) | White background, sans-serif font |
| `dark` | Dark background, sans-serif font |
| `light-serif` | White background, serif font |
| `dark-serif` | Dark background, serif font |

```markdown
<!--markpress-opt
{ "theme": "dark" }
markpress-opt-->
```

Base styles are derived from **GitHub Markdown CSS** for prose and **Atom syntax themes** for code highlighting (dark/light variants auto-selected by theme). 

## 4. Custom CSS — two approaches

### A. Inline `<style>` tags (slide-level overrides)

Inject CSS inside any slide using a `<style>` block. Requires `"sanitize": false` (the default).

### Example — global overrides via inline `<style>`

```markdown
<style>
  .step {
    font-family: 'Inter', sans-serif;
    font-size: 2.5vmin;
  }
  #step-3 {
    background: #1a1a2e;
    color: #e0e0e0;
  }
</style>

------

# My styled slide
```

### B. `build.cjs` post-processing (global, reusable overrides)

For CSS or HTML that applies to every build and shouldn't live inside the markdown, inject it in `build.cjs` after markpress generates the output:

```js
markpress(INPUT, {}).then(({ html }) => {
  const customCss = `<style>
    .step { font-family: 'Inter', sans-serif; }
    /* ... more overrides ... */
  </style>`;
  const finalHtml = html.replace('</head>', `${customCss}\n</head>`);
  fs.writeFileSync(OUTPUT, finalHtml, 'utf8');
});
```

### impress.js selectors to target

| Selector | Targets |
|---|---|
| `.step` | Every slide |
| `#step-1`, `#step-2`, … | Individual slides by order |
| `.impress-on-step-3` | Applied to `<body>` when slide 3 is active |
| `.impress-not-supported` | Fallback for unsupported browsers |
| `#impress-toolbar` | Built-in progress toolbar |

### Tip — avoid empty slides with auto-split

When using `autoSplit: true`, a `<style>` block at the top of the file is treated as a slide. Place style blocks after the first `------` separator, or within any slide body.

## 5. Responsive & Adaptive Sizing

Markpress uses `vmin`/`vmax` units throughout so the presentation scales automatically to the viewport. Avoid fixed `px` font sizes in custom CSS — prefer `vmin` to maintain responsiveness.
