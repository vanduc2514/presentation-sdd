<!--markpress-opt
{
  "autoSplit": false,
  "sanitize": false,
  "title": "Your AI Doesn't Know What You Want"
}
markpress-opt-->

<!--slide-attr x=0 y=0 scale=1.2 -->

# Your AI Doesn't Know What You Want
## (And Neither Do You)

Spec-Driven Development for Real Projects

<!-- SPEAKER NOTES — Slide 1 (~1 min)
- Put the title up. Say nothing. Let it land.
-->

------

<!--slide-attr x=1700 y=-300 rotate=-2 scale=1.0 -->

# Reality Check

<div class="question-list">
<div class="question-item">Who has shipped AI-generated code that changed the <strong>wrong thing</strong>?</div>
<div class="question-item">Who noticed the output getting <strong>worse</strong> the longer the session ran?</div>
<div class="question-item">Who didn't know how to <strong>break the session</strong> and continue cleanly?</div>
</div>

<!-- SPEAKER NOTES — Slide 2 (~2 min)
- Ask each question as a show-of-hands moment. Pause between them.
- The goal is recognition — they're not alone. This is everyone's daily reality.
-->

------

<!--slide-attr x=3200 y=400 rotate=3 scale=1.0 -->

# Where Does It All Go Wrong?

<div class="problem-grid">
<div class="problem-item">We are already <strong>vibe coding in production</strong> — we just don't call it that</div>
<div class="problem-item">Our prompts are business-level: they say <em>what</em>, not <em>how</em></div>
<div class="problem-item">AI explores the codebase — but <strong>guesses</strong> the technical detail we left out</div>
<div class="problem-item">Vague intent → hallucinations → wrong class, wrong file, wrong assumption</div>
</div>

<!-- SPEAKER NOTES — Slide 3 (~2 min)
- Vibe coding isn't just a prototype habit. Any time you prompt without explicit technical intent, you're vibe coding.
- The prompt describes requirements in plain language — suitable for a ticket, not for a compiler.
- The AI doesn't refuse to act on vague input. It fills in the gaps by guessing. It explores the codebase, but it takes shortcuts and picks the path that looks most plausible.
- That's where hallucinations come from — not randomness, but confident guessing on incomplete information.
- And sessions compound the problem: the longer it runs, the more context drifts, and the worse the output gets.
-->

------

<!--slide-attr x=2400 y=1600 rotate=-5 scale=1.0 -->

# My Painful Story

<div class="story-list">
<div class="story-item">Microservice project: changes scattered across <strong>multiple repos + a legacy monolith</strong></div>
<div class="story-item">AI jumped straight to generating — no full-picture exploration</div>
<div class="story-item">Wrong code. Wrong changes. <strong>Line-by-line review of nonsense.</strong></div>
<div class="story-item">Performance dropped. Frustration rose.</div>
<div class="story-item">I started dreading the tool I was supposed to love.</div>
</div>

<!-- SPEAKER NOTES — Slide 4 (~2 min)
- This was a real professional project. The codebase was spread across services and a legacy system that the AI had only partial visibility into.
- It didn't know enough — it just started generating confidently.
- I only found the problems at review time, which was already too late. The AI had just enough context to be dangerous, but not enough to be correct.
- The review burden flipped from lightweight check to full audit. That's not sustainable.
-->

------

<!--slide-attr x=800 y=2300 rotate=2 scale=1.1 -->

# What Is Spec-Driven Development?

Write the specification first — everything else is derived from it

**The spec is the shared understanding between you and the AI**

`Plan → Spec → Tasks → Implement → Validation → Archive`

> Not a new idea: BDD, TDD, contract-first APIs are all in this family

<!-- SPEAKER NOTES — Slide 5a (~3 min)
- SDD isn't revolutionary — it's disciplined. The ideas behind it have existed in BDD, TDD, and API-first design for years.
- What's new is using the spec as the context layer you give to AI agents. The AI no longer guesses — it works inside boundaries you reviewed first.
- Each artifact feeds the next. You review each one before the AI proceeds.
-->

------

<!--slide-attr x=-900 y=2200 rotate=-2 scale=1.0 -->

# The SDD Workflow

| Stage | What Happens |
|-------|-------------|
| **Plan** | Understand the problem and scope |
| **Spec** | Define requirements and acceptance criteria |
| **Tasks** | Break the spec into discrete implementation steps |
| **Implement** | AI works inside defined constraints |
| **Validation** | Verify against the spec |
| **Archive** | Living documentation that stays in sync |

<!-- SPEAKER NOTES — Slide 5b
- Walk through each stage: Plan scopes the problem. Spec details requirements. Tasks break it into execution steps. Then the AI implements. Validation checks against the spec. Archive keeps context alive.
- The key insight: every stage is a review gate. The AI only moves forward once you've approved the previous artifact.
-->

------

<!--slide-attr x=-2200 y=1200 rotate=4 scale=1.0 -->

# Vibe Coding vs Spec-Driven

| Vibe Coding | Spec-Driven |
|-------------|-------------|
| Prompt → hope | Spec → directed output |
| AI guesses scope | AI works inside defined scope |
| Session decays | Resume anywhere from the spec |
| Review code (too late) | Review intent (before code exists) |
| One long chaotic session | Small, scoped, archivable changes |

<!-- SPEAKER NOTES — Slide 6 (~2 min)
- The biggest shift is *when* you review. In vibe coding, you review code after it's written — when it's already expensive to change.
- With SDD, you review intent before the AI writes a single line. Cheap to fix at that stage.
- The session decay problem is solved by the spec itself — you can close a session, open a new one, hand it the spec, and continue exactly where you left off.
-->

------

<!--slide-attr x=-2500 y=100 rotate=-3 scale=1.05 -->

# The Intent Compiler

<div class="two-col"><div class="col-left">
<blockquote><p>A compiler catches errors before your code runs.<br>SDD catches misunderstandings before your AI codes.</p></blockquote>
<p><strong>You don't review the output — you review the intent.</strong></p>
</div>
<div class="col-right"><ul>
<li>Spec stage → cheapest to fix</li>
<li>Design stage → cheap to fix</li>
<li>Code stage → expensive to fix</li>
<li>PR stage → very expensive</li>
<li>Production → catastrophic</li>
</ul></div></div>

<!-- SPEAKER NOTES — Slide 7 (~2 min)
- Every developer knows you don't skip compilation. It catches errors early, when they're cheap.
- SDD is the same idea applied to intent. You compile your requirements before the AI touches the keyboard.
- The error cost curve is well-established in software engineering — bugs caught at spec stage cost a fraction of bugs caught at production. SDD moves the review gate to the earliest possible moment.
- This is the frame I want you to carry for the rest of the talk.
-->

------

<!--slide-attr x=-1400 y=-850 rotate=2 scale=1.0 -->

# SDD with OpenSpec

**The problem with most SDD tools:** too many files → developers stop reviewing → specs become theater

**OpenSpec's approach:** delta specs — one scoped, reviewable artifact per change

| | spec-kit | GSD | OpenSpec |
|-|----------|-----|----------|
| Artifact volume | High | Very high | **Low** |
| Human review checkpoints | Medium | Low | **High** |
| Brownfield support | Limited | Limited | **First-class** |
| Noise level | High | Very high | **Low** |

<!-- SPEAKER NOTES — Slide 8 (~2 min)
- I tried spec-kit and GSD (Get Shit Done) before landing on OpenSpec. Both are capable tools, but they generate a lot of files — GSD alone creates PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md plus a full research folder per milestone.
- When review is tedious, developers skip it. A spec nobody reads is just documentation debt.
- OpenSpec works differently: each change is a delta — scoped to exactly what's changing, nothing more.
- The explore step is what made it click for brownfield work. Before writing any spec, it understands your existing codebase. The spec it generates is grounded in your actual code, not imagination.
-->

------

<!--slide-attr x=0 y=-200 scale=1.3 -->

# Closing

Your AI know what you want if it has enough context

<div class="takeaway-list">
<div class="takeaway-item">The answer isn't a better prompt. It's a clearer spec.</div>
<div class="takeaway-item">SDD is ahead-of-time compilation for your intent.</div>
<div class="takeaway-item">Apply SDD for implementing a feature then evaluate.</div>
</div>

<!-- SPEAKER NOTES — Slide 9 (~4 min)
- Return to the title. The joke lands differently now — it's not just a punchline, it's a diagnosis.
- The audience has been prompting their AI with business language and hoping the technical gaps fill themselves. They do — just not correctly.
- SDD doesn't slow you down. It moves the thinking earlier, when it's cheap, and frees the AI to execute reliably rather than guess.
- Close with the compiler analogy one more time: "You wouldn't ship without compiling. Don't build without speccing."
- Leave them with one action: pick the next feature on your backlog. Write a spec for it before you touch the AI. Just try it once.
-->
