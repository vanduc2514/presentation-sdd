# AGENTS.md — Spec-Driven Development Presentation

## Project Overview

This project contains a 20-minute conference talk on Spec-Driven Development (SDD) titled **"Your AI Doesn't Know What You Want (And Neither Do You)"**.

The talk targets experienced developers who already use AI tools but lack structure. OpenSpec is used as the practical implementation example — it is not the main subject of the talk.

## How to Build

```
npm run build    # renders slides.md → slides.html
npm run preview  # opens slides.html in the browser
```

Requires node 20 (pinned via `mise.toml`). Run `mise install` if switching environments.

## Presentation Content Rules

- **Slide is short and punchy** — audience-facing, not speaker notes
- **Speaker notes are in HTML comments** — verbose, narrative, story-driven
- **No live demo** — examples and diagrams only
