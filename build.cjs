'use strict';

const fs = require('fs');
const path = require('path');
const markpress = require('markpress');

const INPUT = path.resolve(__dirname, 'slides/presentation.md');
const OUTPUT_DIR = path.resolve(__dirname, 'output');
const OUTPUT = path.resolve(OUTPUT_DIR, 'index.html');

const googleFonts = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,200..700;1,14..32,200..700&display=swap" rel="stylesheet">
`;

const customCss = `
  <style>
    :root {
      --ink: #18181b;
      --ink-dim: #52525b;
      --muted: #a1a1aa;
      --line: #e4e4e7;
      --accent: #4f46e5;
      --accent2: #059669;
      --radius: 28px;
    }

    /* Simple solid background — same approach as markpress default theme.
       No multi-layer gradients; those repaint every frame during canvas transform. */
    html, body {
      background: radial-gradient(#f0ede8, #d8d2c8);
      color: var(--ink);
      font-family: "Inter", "Segoe UI", system-ui, sans-serif;
    }

    /* All 10 slides live in the DOM simultaneously inside the moving canvas.
       Keep base .step completely flat — opaque solid, no pseudo-elements, no shadow.
       Only opacity animates; the browser can blit it as a plain layer. */
    .step {
      width: min(1160px, 84vw);
      min-height: min(680px, 75vh);
      padding: 3.6rem 4.2rem;
      box-sizing: border-box;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: #faf9f7;
      opacity: 0;
      transition: opacity 200ms ease;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    /* Active slide: add shadow. Only 1 slide active at a time — cost is minimal. */
    .step.active {
      opacity: 1;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .step > *:first-child {
      margin-top: 0;
    }

    /* ── Typography ───────────────────────────────── */
    .step h1,
    .step h2,
    .step h3 {
      font-family: "Inter", system-ui, sans-serif;
      letter-spacing: -0.03em;
      line-height: 1.0;
      color: var(--ink);
      margin-bottom: 0.65rem;
      border-bottom: 0;
    }

    .step h1 {
      font-size: clamp(2.6rem, 5.2vmin, 5.2rem);
      font-weight: 300;
      max-width: 820px;
    }

    .step h2 {
      font-size: clamp(1.1rem, 2.1vmin, 1.85rem);
      color: var(--ink-dim);
      font-weight: 400;
      letter-spacing: -0.01em;
      line-height: 1.3;
      max-width: 34ch;
    }

    .step h3 {
      font-size: clamp(0.85rem, 1.6vmin, 1.2rem);
      color: var(--accent);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .step p,
    .step li,
    .step td,
    .step th,
    .step blockquote {
      font-size: clamp(1.05rem, 2.0vmin, 1.6rem);
      line-height: 1.55;
      color: var(--ink);
      font-weight: 400;
    }

    .step ul,
    .step ol {
      margin-top: 1.2rem;
      padding-left: 1.1em;
    }

    .step li {
      margin: 0.65rem 0;
      padding-left: 0.3rem;
    }

    .step li::marker {
      color: var(--accent);
      content: "▸  ";
    }

    .step strong {
      color: var(--accent);
      font-weight: 600;
    }

    .step code {
      display: inline-block;
      padding: 0.1em 0.52em;
      border-radius: 6px;
      background: #edeafc;
      border: 1px solid #c7c3f0;
      color: var(--accent);
      font-size: 0.88em;
      font-family: "SF Mono", "Fira Code", monospace;
    }

    .step pre {
      padding: 1.2rem 1.4rem;
      border-radius: 18px;
      border: 1px solid var(--line);
      background: #1e1e2e;
    }

    .step pre code {
      display: block;
      padding: 0;
      background: transparent;
      border: 0;
      color: #cdd6f4;
      border-radius: 0;
    }

    .step blockquote {
      margin: 1.4rem 0 0;
      padding: 1rem 0 1rem 1.4rem;
      border-left: 3px solid var(--accent);
      color: var(--ink-dim);
      background: #f0effe;
      border-radius: 0 12px 12px 0;
    }

    .step table {
      width: 100%;
      margin-top: 1.6rem;
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid var(--line);
      border-radius: 20px;
      background: #ffffff;
    }

    .step thead th {
      background: #f0effe;
      color: var(--accent);
      font-size: clamp(0.8rem, 1.45vmin, 1.05rem);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .step th,
    .step td {
      padding: 0.9rem 1.1rem;
      border: 0;
      border-bottom: 1px solid var(--line);
      vertical-align: top;
      font-weight: 400;
    }

    .step tr:last-child td {
      border-bottom: 0;
    }

    .step td strong {
      color: var(--accent2);
      font-weight: 600;
    }

    /* ── Per-slide overrides ──────────────────────── */
    #step-1,
    #step-10 {
      background: #f8f7ff;
      border-color: #d4d0f5;
    }

    #step-1 h1,
    #step-10 h1 {
      font-size: clamp(3.2rem, 6.4vmin, 6.4rem);
      font-weight: 200;
      letter-spacing: -0.04em;
      line-height: 1.08;
      padding-bottom: 0.08em;
      max-width: none;
      background: linear-gradient(135deg, #18181b 25%, var(--accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    #step-1 h2,
    #step-10 h2 {
      font-size: clamp(1.1rem, 2.1vmin, 1.85rem);
      max-width: 28ch;
      margin-top: 0.7rem;
      font-weight: 400;
      color: var(--ink-dim);
      -webkit-text-fill-color: var(--ink-dim);
    }

    #step-1 p,
    #step-10 p {
      font-size: clamp(1rem, 1.9vmin, 1.5rem);
      color: var(--muted);
      font-weight: 400;
    }

    #step-5 h1 {
      background: linear-gradient(135deg, #18181b 20%, var(--accent2) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    #step-6 table,
    #step-7 table,
    #step-9 table {
      font-size: clamp(0.88rem, 1.7vmin, 1.22rem);
    }

    /* ── Story timeline (slide 4) ──────────────────── */
    .story-list {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      margin-top: 1.6rem;
      gap: 0;
    }

    .story-item {
      padding: 1rem 1.5rem;
      border-left: 3px solid var(--line);
      font-size: clamp(1.1rem, 2.1vmin, 1.6rem);
      line-height: 1.5;
      color: var(--ink);
      margin: 0.4rem 0;
    }

    /* ── Question cards (slide 2) ──────────────────── */
    .question-list {
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
      margin-top: 1.8rem;
    }

    .question-item {
      padding: 1.4rem 2rem;
      background: #f9f8ff;
      border: 1px solid #e0def5;
      border-radius: 18px;
      font-size: clamp(1.2rem, 2.3vmin, 1.75rem);
      line-height: 1.45;
      color: var(--ink);
    }

    #step-11 .question-list {
      margin-top: 1.4rem;
      gap: 0.9rem;
    }

    #step-11 .question-item {
      font-size: clamp(1.05rem, 2.0vmin, 1.45rem);
      padding: 1rem 1.35rem;
    }

    #step-9 .question-list {
      margin-top: 1.2rem;
      gap: 0.85rem;
    }

    #step-9 .question-item {
      font-size: clamp(1.05rem, 2.0vmin, 1.45rem);
      padding: 0.95rem 1.3rem;
    }

    /* ── Takeaway cards (slide 10) ─────────────────── */
    .takeaway-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 0.8rem;
    }

    .takeaway-item {
      padding: 1.2rem 1.8rem;
      background: #f9f8ff;
      border: 1px solid #e0def5;
      border-radius: 18px;
      font-size: clamp(1.2rem, 2.2vmin, 1.7rem);
      line-height: 1.45;
      color: var(--ink);
    }

    /* Step 10 has lavender bg — use white cards for contrast */
    #step-10 .takeaway-item {
      background: #ffffff;
      border-color: #c8c5f0;
    }

    /* ── Two-column layout (slide 8) ──────────────── */
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.4rem;
      align-items: start;
      margin-top: 0.8rem;
    }

    .col-left > *:first-child {
      margin-top: 0;
    }

    .col-right ul {
      padding-left: 0;
      list-style: none;
      margin-top: 0;
    }

    .col-right li {
      padding: 0.85rem 1.1rem 0.85rem 1.25rem;
      margin: 0.5rem 0;
      border-radius: 10px;
      font-weight: 500;
      font-size: clamp(0.95rem, 1.85vmin, 1.4rem);
    }

    .col-right li::marker { content: none; }

    .col-right li:nth-child(1) { background: #ecfdf5; color: #059669; border-left: 3px solid #059669; }
    .col-right li:nth-child(2) { background: #f0fdf4; color: #65a30d; border-left: 3px solid #65a30d; }
    .col-right li:nth-child(3) { background: #fffbeb; color: #d97706; border-left: 3px solid #d97706; }
    .col-right li:nth-child(4) { background: #fff7ed; color: #ea580c; border-left: 3px solid #ea580c; }
    .col-right li:nth-child(5) { background: #fef2f2; color: #dc2626; border-left: 3px solid #dc2626; font-weight: 700; }

    /* ── Problem grid (2×2) for slide 3 ──────────── */
    .problem-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.1rem;
      margin-top: 1.4rem;
      counter-reset: problem-num;
    }

    .problem-item {
      padding: 2.2rem 1.5rem 1.4rem;
      background: #f5f4ff;
      border: 1px solid #e0def8;
      border-radius: 18px;
      font-size: clamp(1rem, 1.85vmin, 1.4rem);
      line-height: 1.55;
      color: var(--ink);
      counter-increment: problem-num;
      position: relative;
    }

    .problem-item::before {
      content: "0" counter(problem-num);
      position: absolute;
      top: 1rem;
      left: 1.4rem;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--accent);
      font-family: "SF Mono", "Fira Code", monospace;
      opacity: 0.6;
    }

    /* ── SDD Workflow slide: content + image side by side ──── */
    #step-7 {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
      grid-template-rows: auto 1fr;
      column-gap: 2rem;
      align-items: stretch;
      height: min(680px, 75vh);
    }

    #step-7 > h1 {
      grid-column: 1 / -1;
      grid-row: 1;
    }

    #step-7 > table {
      grid-column: 1;
      grid-row: 2;
      align-self: start;
    }

    #step-7 > p:has(img) {
      grid-column: 2;
      grid-row: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
    }

    #step-7 img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center center;
      display: block;
      border-radius: 12px;
    }

    @media (max-width: 900px) {
      .step {
        width: 88vw;
        min-height: 72vh;
        padding: 2rem 1.8rem;
        border-radius: 20px;
      }

      .step h1 { max-width: none; }
      .step table { font-size: 0.88em; }

      /* On mobile: stack vertically, image below content */
      #step-7 {
        display: flex;
        flex-direction: column;
      }

      #step-7 > p:has(img) {
        order: 10;
        margin-top: 1.2rem;
      }

      #step-7 img {
        max-height: 38vh;
        width: 100%;
      }
    }
  </style>`;

/**
 * Mirrors what impress.js does at runtime: assign sequential id="step-N"
 * to each .step div that has no id yet. Must run before other transforms.
 */
function addStepIds(html) {
  let counter = 0;
  return html.replace(/<div class="step"(?=[^>]*>)/g, () => {
    counter++;
    return `<div id="step-${counter}" class="step"`;
  });
}

/**
 * Within a specific impress.js step, wraps the <ul> in a custom container div
 * and converts each <li> to a styled <div>. Assumes no nested divs in step content.
 */
function wrapStepList(html, stepId, wrapperClass, itemClass) {
  const stepRe = new RegExp(`(<div[^>]*id="${stepId}"[^>]*>)([\\s\\S]*?)(<\\/div>)`);
  return html.replace(stepRe, (_, open, content, close) => {
    const newContent = content.replace(/<ul>([\s\S]*?)<\/ul>/, (__, ulContent) => {
      const items = ulContent.replace(/<li>([\s\S]*?)<\/li>/g, (_, liContent) => {
        // Strip wrapping <p> tags that markdown-it adds for loose lists
        const inner = liContent.replace(/^\s*<p>([\s\S]*?)<\/p>\s*$/, '$1').trim();
        return `<div class="${itemClass}">${inner}</div>\n`;
      });
      return `<div class="${wrapperClass}">\n${items}</div>`;
    });
    return `${open}${newContent}${close}`;
  });
}

/**
 * Within a specific step, splits content into a two-column layout:
 * everything between <h1> and <ul> becomes col-left; <ul> becomes col-right.
 */
function wrapStepTwoCol(html, stepId) {
  const stepRe = new RegExp(`(<div[^>]*id="${stepId}"[^>]*>)([\\s\\S]*?)(<\\/div>)`);
  return html.replace(stepRe, (_, open, content, close) => {
    const ulMatch = content.match(/<ul>[\s\S]*?<\/ul>/);
    if (!ulMatch) return _;
    const h1End = content.indexOf('</h1>') + 5;
    const ulStart = content.indexOf(ulMatch[0]);
    const h1 = content.slice(0, h1End);
    const leftContent = content.slice(h1End, ulStart).trim();
    const afterUl = content.slice(ulStart + ulMatch[0].length);
    const newContent = `${h1}\n<div class="two-col">\n<div class="col-left">${leftContent}</div>\n<div class="col-right">${ulMatch[0]}</div>\n</div>${afterUl}`;
    return `${open}${newContent}${close}`;
  });
}

markpress(INPUT, { theme: false }).then(({ html }) => {
  // Strip markpress theme <link> and <style> tags so our CSS is the sole source of truth
  let stripped = html
    .replace(/<link[^>]+markpress[^>]*>/gi, '')
    .replace(/<link[^>]+theme[^>]*>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, (match) => {
      if (/font-family|line-height|blockquote|pre\s*\{/.test(match)) return '';
      return match;
    });
  // Smooth but snappy camera transition
  stripped = stripped.replace(
    /(<div[^>]*id=["']impress["'][^>]*)(>)/,
    '$1 data-transition-duration="200"$2'
  );
  // Transform markdown-rendered lists into styled component wrappers
  stripped = addStepIds(stripped);
  stripped = wrapStepList(stripped, 'step-2', 'question-list', 'question-item');
  stripped = wrapStepList(stripped, 'step-3', 'problem-grid', 'problem-item');
  stripped = wrapStepList(stripped, 'step-4', 'story-list', 'story-item');
  stripped = wrapStepList(stripped, 'step-9', 'question-list', 'question-item');
  stripped = wrapStepTwoCol(stripped, 'step-8');
  stripped = wrapStepList(stripped, 'step-10', 'takeaway-list', 'takeaway-item');
  stripped = wrapStepList(stripped, 'step-11', 'question-list', 'question-item');
  const finalHtml = stripped
    .replace('<head>', `<head>\n${googleFonts}`)
    .replace('</head>', `${customCss}\n</head>`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT, finalHtml, 'utf8');
  console.log(`Built: ${OUTPUT}`);
}).catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
