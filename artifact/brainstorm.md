# Brainstorm: Spec-Driven Development Talk

> **Context**: This file captures the ongoing brainstorm for a 20-minute tech conference talk on Spec-Driven Development.
> The talk targets developers who already use AI tools in their workflow but lack structure. OpenSpec is used as the practical implementation vehicle, not the focus. The broader theme of the conference is AI transforming SDLC.
>
> **Format**: 20-min talk, ~30 people, tech conference
> **Speaker**: Has hands-on experience with OpenSpec on side and professional projects

---

## Q&A — Shared Understanding Session

**Q1: Who is your audience and what is their daily reality?**
> Mostly experienced developers already exposed to and using AI tools daily, but not in a structured way. They vibe code. The talk should focus on SDD as a concept and methodology — OpenSpec is just the implementation example, not the main subject.

**Q2: What is the format and length?**
> 20-minute conference talk, small group (~30 people). The conference theme is AI changing the way we do software across the SDLC.

**Q3: What is the core pain you want to name for the audience?**
> We don't know how to apply AI properly in the SDLC. "Vibe coding" is the symptom. SDD is an evolution — a way to apply AI more effectively and deliberately throughout the development lifecycle.

**Q4: What is your personal experience with OpenSpec?**
> Heavy user of OpenSpec on both side and professional projects. Tried other SDD tools, consistently returns to OpenSpec.
>
> **Personal story to tell:**
> - Couldn't control AI output — AI made mistakes, prompts were unpredictable
> - Couldn't resume work cleanly across sessions (context window problem)
> - After discovering SDD: it felt like "ahead of time compilation" — review and validate before the AI ever writes a line of code
> - Pain of reviewing noisy specs from other tools (spec-kit, BMAD) before finding OpenSpec
>
> No live demo — examples and diagrams to illustrate OpenSpec concepts.

**Q5: What do you want the audience to do after the talk?**
> Primary: Understand the concept of SDD and why it matters for real projects (both greenfield AND brownfield).
> Secondary: Try OpenSpec as a practical way to apply SDD in their daily workflow.

**Q6: Is there a specific angle on custom schemas to highlight?**
> No — keep OpenSpec as the implementation vehicle, not a feature showcase. Custom schemas are not a talking point.

---

## Key Insight Synthesis

### The Core Message (one sentence)
> SDD is the missing structure between "I have an AI tool" and "I ship reliable software with it."

### The Golden Metaphor (from the speaker's own words)
> **"Ahead of time compilation"** — SDD lets you review and validate intent *before* the AI attempts anything. Just like a compiler catches errors before runtime, a spec catches misunderstandings before code generation.
>
> This is a perfect developer analogy. Use it as the centerpiece.

### The Emotional Arc of the Talk
1. **Recognition** — "Yes, I've been vibe coding. It kind of works... until it doesn't."
2. **The gap** — Speed without structure = compounding debt and unpredictable AI
3. **The evolution** — SDD is not a new idea; it's the old discipline reimagined for AI
4. **The lightbulb** — "Ahead of time compilation": you review intent, not code
5. **Real world** — It works for brownfield too, not just greenfield
6. **The tool** — OpenSpec makes this practical without drowning you in files
7. **Call to action** — Try it on your next feature

---

## Confirmed Decisions

| Item | Decision |
|------|----------|
| **Talk title** | *Your AI Doesn't Know What You Want (And Neither Do You)* |
| **Opening** | Audience challenge — "who has had AI break something / change the wrong thing?" |
| **Closing** | The "ahead of time compilation" metaphor — let it land and sink in |
| **OpenSpec role** | Implementation vehicle only — not the focus |
| **Custom schemas** | Not a talking point |
| **Demo** | No live demo — examples and diagrams only |
| **Audience** | ~30 developers, expert-level, already use AI, not structured |
| **Length** | 20 minutes |
| **Key diagrams** | SDD workflow loop / Before-after vibe coding vs SDD / Error cost curve |
| **AOT metaphor placement** | Mid-talk reveal (Slide 7) AND echoed in the closing |
| **Artifact example** | Fictional realistic example (e.g. login or notifications feature) |
| **Tool comparison** | Short comparison table: OpenSpec vs spec-kit vs BMAD — reason: less noise, works with casual workflow |
| **Things to avoid** | Nothing explicitly off-limits — tool comparison is a welcome addition |

---

## Confirmed Stories & Anchors

### Personal Story (PR chaos + session decay)
- A PR that changed the wrong class, the wrong thing — the AI misunderstood the scope
- The "session decay" problem: the longer a session runs, the worse the AI output becomes
- Didn't know how to break the session cleanly and continue in a new chat without losing context
- **Talk use**: Opens the audience challenge section or anchors the "what goes wrong" segment

### Brownfield Professional Project Story (microservices + legacy monolith)
- Microservice project: code changes scattered across multiple repos
- Also required understanding a legacy monolithic system
- Without SDD: AI had no exploration phase — it jumped straight to generating code
- Result: wrong code, wrong changes, couldn't spot errors until AI was already done
- Had to review nonsensical code line by line — exhausting and demoralizing
- Effect: reduced performance, increased frustration, made the developer *not want to use AI*
- **This is the core brownfield pain story** — it perfectly illustrates why an `explore` phase before coding matters
- **Talk use**: The concrete brownfield example in the "Why SDD matters for real projects" section

---

## Open Brainstorm Items

- [ ] Sketch the fictional artifact example for the OpenSpec slide (e.g. a login / notification feature)
- [ ] Draft the short tool comparison table (OpenSpec vs spec-kit vs BMAD) — keep it factual, no bashing
