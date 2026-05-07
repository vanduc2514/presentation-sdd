'use strict';

const fs = require('fs');
const path = require('path');
const markpress = require('markpress');

const INPUT = path.resolve(__dirname, 'slides/slides.md');
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
      --bg: #f0ede8;
      --surface: rgba(255, 255, 255, 0.78);
      --surface-strong: rgba(255, 255, 255, 0.94);
      --ink: #18181b;
      --ink-dim: #52525b;
      --muted: #a1a1aa;
      --line: rgba(0, 0, 0, 0.07);
      --accent: #4f46e5;
      --accent-soft: rgba(79, 70, 229, 0.08);
      --accent2: #059669;
      --accent2-soft: rgba(5, 150, 105, 0.08);
      --shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
      --radius: 28px;
    }

    html,
    body {
      background:
        radial-gradient(ellipse at 18% 14%, rgba(79, 70, 229, 0.09) 0%, transparent 42%),
        radial-gradient(ellipse at 82% 78%, rgba(5, 150, 105, 0.07) 0%, transparent 40%),
        radial-gradient(ellipse at 52% 52%, rgba(244, 114, 182, 0.04) 0%, transparent 50%),
        var(--bg);
      color: var(--ink);
      font-family: "Inter", "Segoe UI", system-ui, sans-serif;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      background-image: radial-gradient(rgba(0, 0, 0, 0.045) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }

    .step {
      width: min(1160px, 84vw);
      min-height: min(680px, 75vh);
      padding: 3.6rem 4.2rem;
      box-sizing: border-box;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: linear-gradient(148deg, var(--surface), var(--surface-strong));
      box-shadow: var(--shadow);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      opacity: 0.18;
      transition:
        opacity 300ms ease,
        box-shadow 300ms ease;
      overflow: hidden;
    }

    .step::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: var(--radius);
      background: radial-gradient(ellipse at top right, rgba(79, 70, 229, 0.06), transparent 50%);
      pointer-events: none;
    }

    .step::after {
      content: "";
      position: absolute;
      bottom: -20%;
      right: -8%;
      width: 40%;
      aspect-ratio: 1;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(5, 150, 105, 0.07), transparent 70%);
      pointer-events: none;
    }

    .step.active {
      opacity: 1;
      box-shadow:
        0 28px 80px rgba(0, 0, 0, 0.11),
        0 0 0 1px rgba(79, 70, 229, 0.12),
        0 1px 0 rgba(255, 255, 255, 0.8) inset;
    }

    .step > *:first-child {
      margin-top: 0;
    }

    /* === CONTENT ENTRANCE ANIMATIONS === */
    .step > * {
      position: relative;
      z-index: 1;
      opacity: 0;
      transform: translateY(22px) scale(0.97);
      transition:
        opacity 380ms cubic-bezier(0.16, 1, 0.3, 1),
        transform 460ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .step.active > *,
    .step.present > * {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    /* Stagger each child with increasing delay */
    .step.active > *:nth-child(1),
    .step.present > *:nth-child(1) { transition-delay: 120ms; }
    .step.active > *:nth-child(2),
    .step.present > *:nth-child(2) { transition-delay: 210ms; }
    .step.active > *:nth-child(3),
    .step.present > *:nth-child(3) { transition-delay: 290ms; }
    .step.active > *:nth-child(4),
    .step.present > *:nth-child(4) { transition-delay: 360ms; }
    .step.active > *:nth-child(5),
    .step.present > *:nth-child(5) { transition-delay: 425ms; }
    .step.active > *:nth-child(n + 6),
    .step.present > *:nth-child(n + 6) { transition-delay: 480ms; }

    /* List items get their own stagger inside the ul */
    .step.active li,
    .step.present li {
      animation: itemIn 380ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .step.active li:nth-child(1), .step.present li:nth-child(1) { animation-delay: 260ms; }
    .step.active li:nth-child(2), .step.present li:nth-child(2) { animation-delay: 340ms; }
    .step.active li:nth-child(3), .step.present li:nth-child(3) { animation-delay: 410ms; }
    .step.active li:nth-child(4), .step.present li:nth-child(4) { animation-delay: 475ms; }
    .step.active li:nth-child(5), .step.present li:nth-child(5) { animation-delay: 535ms; }
    .step.active li:nth-child(n+6), .step.present li:nth-child(n+6) { animation-delay: 585ms; }

    @keyframes itemIn {
      from { opacity: 0; transform: translateX(-14px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    /* Table rows slide in from below */
    .step.active tbody tr,
    .step.present tbody tr {
      animation: rowIn 340ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .step.active tbody tr:nth-child(1), .step.present tbody tr:nth-child(1) { animation-delay: 340ms; }
    .step.active tbody tr:nth-child(2), .step.present tbody tr:nth-child(2) { animation-delay: 410ms; }
    .step.active tbody tr:nth-child(3), .step.present tbody tr:nth-child(3) { animation-delay: 475ms; }
    .step.active tbody tr:nth-child(4), .step.present tbody tr:nth-child(4) { animation-delay: 535ms; }
    .step.active tbody tr:nth-child(n+5), .step.present tbody tr:nth-child(n+5) { animation-delay: 590ms; }

    @keyframes rowIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

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
      background: rgba(79, 70, 229, 0.08);
      border: 1px solid rgba(79, 70, 229, 0.16);
      color: var(--accent);
      font-size: 0.88em;
      font-family: "SF Mono", "Fira Code", monospace;
    }

    .step pre {
      padding: 1.2rem 1.4rem;
      border-radius: 18px;
      border: 1px solid var(--line);
      background: #1e1e2e;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
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
      background: linear-gradient(90deg, var(--accent-soft), transparent 65%);
      border-radius: 0 12px 12px 0;
    }

    .step table {
      width: 100%;
      margin-top: 1.6rem;
      border-collapse: separate;
      border-spacing: 0;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.6);
    }

    .step thead th {
      background: rgba(79, 70, 229, 0.06);
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

    /* Title slide + Closing slide */
    #step-1,
    #step-10 {
      display: flex;
      flex-direction: column;
      justify-content: center;
      background:
        radial-gradient(ellipse at top right, rgba(79, 70, 229, 0.1), transparent 48%),
        radial-gradient(ellipse at bottom left, rgba(5, 150, 105, 0.07), transparent 42%),
        linear-gradient(148deg, rgba(255, 255, 255, 0.92), rgba(248, 246, 255, 0.88));
      border-color: rgba(79, 70, 229, 0.12);
    }

    #step-1 h1,
    #step-10 h1 {
      font-size: clamp(3.2rem, 6.4vmin, 6.4rem);
      font-weight: 200;
      letter-spacing: -0.04em;
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

    /* Section highlight slide */
    #step-5 h1 {
      background: linear-gradient(135deg, #18181b 20%, var(--accent2) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Smaller font for data-heavy tables */
    #step-6 table,
    #step-7 table,
    #step-9 table {
      font-size: clamp(0.88rem, 1.7vmin, 1.22rem);
    }

    @media (max-width: 900px) {
      .step {
        width: 88vw;
        min-height: 72vh;
        padding: 2rem 1.8rem;
        border-radius: 20px;
      }

      .step h1 {
        max-width: none;
      }

      .step table {
        font-size: 0.88em;
      }
    }
  </style>`;

markpress(INPUT, { theme: false }).then(({ html }) => {
  // Strip markpress theme <link> and <style> tags so our CSS is the sole source of truth
  let stripped = html
    .replace(/<link[^>]+markpress[^>]*>/gi, '')
    .replace(/<link[^>]+theme[^>]*>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, (match) => {
      if (/font-family|line-height|blockquote|pre\s*\{/.test(match)) return '';
      return match;
    });
  // Prezi-like transition: long swoop with eased camera
  stripped = stripped.replace(
    /(<div[^>]*id=["']impress["'][^>]*)(>)/,
    '$1 data-transition-duration="900"$2'
  );
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
