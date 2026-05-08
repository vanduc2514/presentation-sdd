# AGENTS.md — Spec-Driven Development Presentation

## Project Overview

This project contains a 20-minute conference talk on Spec-Driven Development (SDD) titled **"Your AI Doesn't Know What You Want (And Neither Do You)"**.

The talk targets experienced developers who already use AI tools but lack structure. OpenSpec is used as the practical implementation example — it is not the main subject of the talk.

## How to Build

```
npm run build    # renders slides.md → output/index.html
npm run preview  # opens output/index.html in the browser
```

Requires node 20 (pinned via `mise.toml`). Run `mise install` if switching environments.

## Git Commit Convention

Format: `<scope>: <short description>`

Common scopes: `slide`, `visual`, `action`, `agent`, `project`, `artifact`

## Presentation Content Rules

- **Slide is short and punchy** — audience-facing, not speaker notes
- **Speaker notes are in HTML comments** — verbose, narrative, story-driven
- **No live demo** — examples and diagrams only

## Workflow

Always follow these steps when changing the presentation:

1. Plan
2. Make the change
3. Render into HTML page
4. Verify with visual QA by using browser to verify for every slides in the presentation after you make the change for multiple screens
5. (Optional) If you implement in Cloud environment or have to comment in a Pull Request (PR) then you must include 3-5 screenshot of the slides for all screen in the comment / PR body