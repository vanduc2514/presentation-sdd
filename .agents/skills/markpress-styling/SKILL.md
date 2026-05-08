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

### NEVER use `backdrop-filter: blur()` on `.step`

impress.js keeps **all slides in the DOM simultaneously** as 3D-positioned elements. Applying `backdrop-filter: blur()` to `.step` forces the browser to create a separate composite layer for every slide and blur each one independently — even off-screen slides. This causes severe GPU thrashing and makes transitions feel sluggish regardless of the `data-transition-duration` value.

**Bad:**
```css
.step {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
```

**Fix:** Remove `backdrop-filter` entirely. Use `background` with `rgba()` transparency for a frosted-glass look without the GPU cost.

### Keep `data-transition-duration` under 600ms

Values above ~700ms feel sluggish in a live presentation. A good default is `550ms`. Set it via post-processing in `build.cjs`:

```js
stripped = stripped.replace(
  /(<div[^>]*id=["']impress["'][^>]*)(>)/,
  '$1 data-transition-duration="550"$2'
);
```

### Keep content entrance animation delays short

Total stagger delay (first child to last) should stay under ~400ms. Delays exceeding 500ms make the slide feel broken on arrival. Recommended caps:
- Per-child transition duration: ≤ 320ms
- Max stagger delay (nth child): ≤ 350ms
- List item animation duration: ≤ 300ms


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
