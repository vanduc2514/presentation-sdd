# Spec-Driven Development — Research Brief

> Research date: May 2026 | For presentation brainstorming

---

## 1. What Is Spec-Driven Development?

Spec-driven development (SDD) is a software methodology where a **formal specification becomes the single source of truth** before any code is written. The spec defines intent, requirements, acceptance criteria, and design — and all downstream work (implementation, tests, documentation) is derived from it.

**Core premise:** *Define what should be built, then build it — never the other way around.*

This contrasts with two common alternatives:
- **Code-first**: Write code, then generate docs/tests from it (the default for most teams)
- **Vibe coding**: Conversational AI prompting with no formal structure (great for prototypes, dangerous for production)

---

## 2. A Brief History & Context

| Era | Dominant Approach | Problem It Solved |
|-----|-------------------|-------------------|
| Pre-2000s | Waterfall specs (massive Word docs) | No surprises at delivery |
| 2000s | Agile/TDD/BDD | Specs were too rigid, code drove reality |
| 2010s | OpenAPI / contract-first APIs | Frontend/backend parallel work |
| 2020-2023 | "Just prompt the AI" / vibe coding | Speed of generation |
| 2024-2026 | Spec-driven development (SDD) | Structure + AI speed without chaos |

SDD is partly a **rediscovery of old best practices**, rephrased for the AI coding era.

---

## 3. The Core Workflow

A typical SDD workflow follows this pattern:

```
Idea → Specification → Design → Tasks → Implementation → Validation
```

### The Spec Document Contains:
1. **Problem statement** — what pain are we solving?
2. **Users** — who needs this?
3. **Desired outcome** — what does success look like?
4. **Functional requirements** — what must the system do?
5. **Non-goals** — explicit exclusions (scope control)
6. **Edge cases** — failure modes and boundary conditions
7. **Acceptance criteria** — verifiable conditions for "done"
8. **Non-functional requirements** — performance, security, scalability

### The Three Artifacts (Kiro model):
- `requirements.md` — user stories with acceptance criteria
- `design.md` — system architecture, sequence diagrams, data flow, error handling
- `tasks.md` — discrete, executable implementation steps

---

## 4. SDD in the AI Coding Era

This is the dominant reason SDD is surging in 2025-2026.

**The problem with AI-only workflows:**
- AI generates plausible but architecturally incoherent code
- No shared context across sessions = context drift
- Technical debt accumulates faster than it gets generated
- "Vibe coding" works for prototypes; it breaks for production systems

**How SDD fixes this:**
- The spec becomes the **context layer** fed to AI agents
- AI works inside defined constraints rather than guessing intent
- Consistent output across multiple sessions and team members
- Spec = living documentation that doesn't drift from reality

**Stats supporting the trend:**
- 76% of developers using or planning to use AI tools (Stack Overflow 2024)
- GitHub Copilot users complete tasks 55% faster
- But speed without structure = chaos → SDD is the answer

---

## 5. Key Flavors and Subsets of SDD

### 5a. Contract-First / API-First (OpenAPI)
- Define API contracts (endpoints, schemas, auth, errors) in OpenAPI/YAML **before** writing any code
- Frontend and backend can work in parallel from day one
- Tools: Swagger, Stoplight, Spectral, Prism (mock servers)
- Auto-generate: client SDKs, server stubs, tests, documentation
- Industry standard for REST APIs (AsyncAPI for event-driven)

### 5b. BDD (Behavior-Driven Development)
- Specs written in human-readable Given/When/Then format
- Bridges business stakeholders and developers
- Tools: Cucumber, SpecFlow, Gherkin syntax
- Acceptance criteria become executable tests

### 5c. TDD (Test-Driven Development)
- Tests written before implementation (tests = the spec)
- Narrower scope: function/unit level vs. feature/system level
- SDD subsumes TDD — a spec drives tests which drive code

### 5d. Agentic SDD (New in 2025-2026)
- Tools: **Kiro** (AWS), **spec-kit** (GitHub), **Intent** (Augment Code)
- AI agents consume specs and generate + maintain code
- Spec → Design → Tasks → Agent executes each task autonomously
- "Hooks" — agents run automatically on file changes, git events, etc.

---

## 6. The Tools Landscape (2025-2026)

| Tool | Type | Key Feature |
|------|------|-------------|
| **Kiro** (AWS) | Agentic IDE | Spec-first workflow, EARS notation, Bedrock-backed |
| **spec-kit** (GitHub) | VS Code workflow | Constitution → Specify → Plan → Tasks |
| **BMAD-METHOD** | Multi-agent framework | Full SDLC with role-separated AI agents (Analyst, PM, Architect, etc.) |
| **Get Shit Done (GSD)** | Meta-prompting system | Context engineering + spec-driven workflow |
| **Intent** (Augment Code) | Desktop workspace | Living specs that self-update as code changes |
| **OpenSpec** | Lean SDD tool | Delta specs, custom schemas, brownfield-first |
| **OpenAPI/Swagger** | API spec standard | Contract-first REST API design |
| **Cursor + CLAUDE.md** | Editor + steering | Spec-like steering documents guide AI |
| **Gherkin/Cucumber** | BDD spec | Executable behavior specifications |

---

## 6a. Deep Dive: OpenSpec

> Source: [intent-driven.dev/knowledge/openspec](https://intent-driven.dev/knowledge/openspec/)

### What It Is

OpenSpec is a lean spec-driven development tool built around **delta specs** — each change is a self-contained folder with its own artifacts, rather than one monolithic spec document. Released in January 2026 (v1.0), with v1.2 in February 2026.

### Core Workflow

```
/opsx:explore → /opsx:propose → /opsx:apply → /opsx:archive
```

Or with the custom profile (step-by-step artifact review):

```
explore → proposal.md → specs.md → design.md → tasks.md → implement
```

The `/opsx:ff` (fast-forward) command produces all artifacts at once when you already know what you want.

### Key Differentiators

**1. Delta Specs (not monolithic specs)**
- Each change has its own scoped spec: `ADDED`, `MODIFIED`, `REMOVED` sections
- Docs stay compact and reviewable — no sprawling documents
- Easy to diff and verify implementation against plan

**2. Custom Schemas**
- The default `spec-driven` schema produces: `proposal.md → specs.md → design.md → tasks.md`
- You can define custom schemas per-project or user-level:
  - **Minimalist**: Only `spec.md` + `tasks.md` — cuts noise for simple changes
  - **Event-driven**: Specialized artifacts for event-driven architectures
  - **ADR schema**: Makes Architectural Decision Records a first-class artifact
- Schema resolution order: project-level → user-level → built-in (project always wins)

**3. Brownfield / Legacy Project Support**
- The `explore` command analyzes existing codebase before writing any spec
- Incremental approach: apply SDD one change at a time without reverse-engineering everything
- Works with [Repomix](https://github.com/yamadashy/repomix) to package existing code context for AI analysis
- "Start where the work is, build specs that reflect genuine intent, let brownfield gradually transform"

**4. Profiles (v1.2)**
- **Core Profile** (default): Simplified `explore → propose → apply → archive`
- **Custom Profile**: Step through artifacts individually for more review control

**5. Lean Artifact Set vs. Competitors**

| Dimension | BMAD | Spec-Kit | OpenSpec |
|-----------|------|----------|----------|
| Specification quality | 4 | 2 | 4 |
| Human review checkpoints | 2 | 3 | 5 |
| Developer experience | 2 | 3 | 4 |
| Parallel development support | 2 | 5 | 5 |
| Mid-feature course correction | 5 | 2 | 4 |
| AI coding tool compatibility | 4 | 4 | 5 |
| **Final score** | 3.65 | 2.77 | **4.00** |

*(Source: "I Tested Three Spec-Driven AI Tools. Here's My Honest Take." — ranthebuilder.cloud)*

### Why Other Tools Create "Noise"

- **spec-kit**: Generates many markdown files with repetitive checklists and content. Martin Fowler noted: "They were repetitive, both with each other, and with the code that already existed. Some contained code already. Overall they were just very verbose and tedious to review."
- **BMAD**: Multi-agent setup (Analyst, PM, Architect, Scrum Master, Developer) generates a LOT of files and ceremony. "Really noisy to work with... the multi-agent setup generates a LOT of files and ceremony for what can be simple tasks."
- **GSD (Get Shit Done)**: Community feedback: "Required far too much back and forth. Ate too many tokens... 80%+ of what I did was planning. When it came to getting things done, I didn't need this at all."
- **Kiro**: "Using a sledgehammer to crack a nut" for small changes — a bug fix turned into 4 user stories and 16 acceptance criteria.

OpenSpec's **delta spec approach** directly solves this: each change is scoped, compact, and reviewable without drowning in repetitive context.

---

## 7. Benefits

- **Parallel development**: frontend, backend, QA can all work simultaneously from the spec
- **Reduced rework**: problems are caught at the specification stage (cheapest to fix)
- **AI consistency**: spec is context → AI output is predictable and aligned
- **Living documentation**: the spec IS the docs — no drift
- **Onboarding**: new developers understand intent immediately
- **Stakeholder alignment**: non-technical stakeholders can review specs before code
- **Testability**: acceptance criteria map directly to tests

---

## 8. Challenges & Honest Critiques

- **Upfront investment**: writing good specs takes time and skill
- **Overhead for small tasks**: using SDD for a small bug fix is a sledgehammer for a nail
- **Spec drift**: specs can become outdated if not maintained (the "living spec" problem)
- **Learning curve**: developers resist structured thinking before coding
- **False precision**: detailed specs can give false confidence if requirements are wrong
- **Tool lock-in**: Kiro ties you to AWS Bedrock; spec-kit ties workflows to GitHub

**Zach Lloyd (Warp) quote:** "The truth is, investing in clean, provable code is not optional. It's a multiplier."

---

## 9. Relationship to Existing Practices

| SDD resembles... | But differs because... |
|------------------|----------------------|
| Waterfall specs | SDD specs are lean, iterative, and machine-consumable |
| Agile user stories | SDD adds design + architecture artifacts, not just stories |
| TDD | SDD operates at the feature/system level, not just unit level |
| BDD | SDD is broader — BDD focuses on behavior; SDD covers design too |
| Architecture Decision Records (ADRs) | SDD includes implementation tasks, not just decisions |

---

## 10. The Human Element — What AI Cannot Replace

Even in a fully AI-assisted SDD workflow, humans remain responsible for:

- **Identifying the right problem to solve**
- **Writing the spec** (the thinking, not the typing)
- **Validating acceptance criteria** against real user needs
- **Architectural judgment** — making tradeoffs
- **Stakeholder communication** — translating business → spec

SDD does not reduce the importance of developers. It **elevates the quality of thinking** required before a single line of code is written.

---

## 11. Potential Presentation Angles

1. **The pendulum story**: From waterfall specs → agile freedom → AI chaos → SDD discipline
2. **The AI productivity angle**: Why vibe coding fails at scale and how SDD fixes it
3. **The API-first story**: Practical, concrete, and universally relatable for backend/fullstack teams
4. **The team collaboration angle**: How specs enable parallel work and reduce integration pain
5. **The "old school rules still apply" angle**: SDD as a return to fundamentals, powered by new tools
6. **The developer experience angle**: How specs improve onboarding, reduce cognitive load, and create accountability
7. **Hands-on demo angle**: Live Kiro/spec-kit walkthrough from idea → spec → code

---

## 12. OpenSpec-Centered Presentation Angles

1. **The brownfield problem**: Most teams live in legacy codebases — SDD tools assume greenfield. OpenSpec is the exception.
2. **The noise problem**: Other SDD tools generate too many files; developers stop reviewing them. Delta specs fix this.
3. **Extensibility story**: Custom schemas let teams fit the tool to their domain, not the other way around.
4. **Incremental adoption**: You don't need to commit to SDD everywhere — OpenSpec lets you apply it change by change.
5. **The review bottleneck**: Speed without reviewability is dangerous. OpenSpec optimizes for human review checkpoints.

---

## 13. Open Questions for Brainstorming

- What is your audience? (developers, tech leads, architects, non-technical?)
- What is the context? (conference talk, internal team session, workshop?)
- Do you have personal experience working on brownfield projects with AI tools?
- Is the focus practical (how to adopt it) or conceptual (why it matters)?
- What is the pain your audience currently feels — too much AI noise? Poor AI output quality? Brownfield complexity?
- What is the one thing you want the audience to walk away believing or doing differently?
- Have you personally used OpenSpec or are you planning to showcase it live?
