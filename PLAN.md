# Site Improvement Plan

**Audience:** Python backend engineers, junior → senior, preparing for interviews.
**Scope:** DSA, Backend (Python), System Design. DevOps = basics only (what a dev still gets asked).
**Out of scope:** Frontend, JS/TS mirroring, quiz engines, spaced repetition.

---

## Guiding rules

- Every page skimmable in <60s.
- Typed `src/data/*.ts` is the single source of truth.
- Every non-trivial topic gets a `SeniorInsight` callout (the "what an interviewer wants to hear beyond the definition" line).
- Pattern-library thinking over exhaustive enumeration.
- No new abstractions unless a page repeats a shape 3+ times.

---

## Gaps being closed

1. Nav gives DevOps equal weight to DSA and Backend — contradicts the Python-backend positioning.
2. System Design is one scenario file — the section where seniors actually get graded is the thinnest.
3. No concurrency page — core Python BE territory (GIL, asyncio, threading, locks, idempotency).
4. No testing page — asked at every level.
5. APIs page is shallow on auth, retries, pagination, webhooks.
6. Python page is a notes dump, not a senior-grade language reference.
7. No behavioral page — STAR template is buried inside the playbook.

---

## Implementation order

### Step 1 — Nav rebalance

Primary groups become:
- **DSA** — Patterns, Data Structures, Sorting, Searching
- **Backend** — Principles, Python, SQL, APIs, Concurrency (new), Testing (new)
- **System Design** — promoted to its own group: Overview, Caching, Databases, Queues, Consistency, Scaling

Demote DevOps to a single trailing link labeled **"Platform (optional)"** that opens a landing page linking out to the existing Linux / Git / Networking / Docker / Kubernetes / Observability / Security pages. Keep the deep pages — just stop putting them in primary nav.

Trailing links unchanged: Titles, Resources.

### Step 2 — Expand System Design

Split `src/data/system-design.ts` into primitive files:
- `caching.ts` — cache types (CDN/edge/app/DB), write-through vs write-back vs write-around, invalidation strategies, cache stampede, TTL tradeoffs
- `databases.ts` — SQL vs NoSQL decision matrix, isolation levels, replication (sync/async/semi-sync), sharding strategies, partition keys
- `queues.ts` — Kafka / SQS / RabbitMQ semantics, DLQ, backpressure, ordering guarantees, at-least-once vs exactly-once
- `consistency.ts` — CAP, PACELC, eventual vs strong, linearizability vs serializability, quorum reads/writes
- `scaling.ts` — vertical vs horizontal, stateless services, read replicas, sharding, CDN, edge

Existing `scenarios` become capstones that cite these primitives. One landing page, five sub-pages or one long page with deep anchors — decide during implementation.

### Step 3 — `concurrency.astro` + `concurrency-notes.ts`

- Sync vs async vs parallel (mental model first)
- Python specifics: GIL, asyncio event loop, `async`/`await`, `concurrent.futures`, threading vs multiprocessing
- Locks / mutex / semaphore / condition var
- Deadlock (four conditions), livelock, starvation
- Optimistic vs pessimistic locking
- Idempotency keys
- "Exactly-once" myth — why it's really effectively-once via dedupe

### Step 4 — `testing.astro` + `testing-notes.ts`

- Test pyramid (unit / integration / e2e) and when each is wrong
- Test doubles: mock / fake / stub / spy (with Python examples)
- pytest idioms: fixtures, parametrize, `monkeypatch`, markers
- Fixtures vs factories
- Contract tests / consumer-driven contracts
- Flake causes and fixes (timing, shared state, network, ordering)
- When TDD pays rent and when it doesn't

### Step 5 — Expand APIs page

Add sections to `api-depth.ts` / `api-notes.ts`:
- OAuth2 flows (auth code + PKCE, client creds, device) with when-to-use
- JWT pitfalls (alg=none, key confusion, long expiry, no revocation)
- Session vs token tradeoffs
- Pagination: offset vs cursor vs keyset
- Webhook delivery: retries, signing, replay protection
- Retries / timeouts / circuit breakers / bulkheads
- Idempotency keys on write endpoints

### Step 6 — Expand Python page

Turn `python-notes.ts` into a senior-grade language reference:
- Data model / dunder methods (`__eq__`, `__hash__`, `__slots__`, `__repr__`)
- GIL and when it matters
- asyncio internals (event loop, tasks, cancellation, `gather` vs `as_completed`)
- Typing: generics, `TypeVar`, `Protocol`, variance, `Literal`, `TypedDict`
- Dataclasses vs Pydantic vs attrs
- Context managers (`__enter__`/`__exit__`, `contextlib`)
- Descriptors, metaclasses (brief — rarely asked but high signal)
- Iterators / generators / `yield from`
- Mutable default args, late binding in closures, common footguns

### Step 7 — `behavioral.astro` + `behavioral-notes.ts`

12–15 recurring prompts, each with jr / mid / sr answer shapes:
- Conflict with teammate
- Biggest failure
- Scope cut under deadline
- Leadership without authority
- Architectural decision you regret
- Mentoring someone struggling
- Disagreement with manager
- Scaling a team / on-call
- Prioritization with competing stakeholders
- Ambiguous requirements
- Production incident you led
- Trade-off call (speed vs quality)

Each prompt: what a junior says, what a mid says, what a senior says, red flags, one STAR example.

### Step 8 — Later

Tag `src/data/*.ts` entries with `level: 'jr' | 'mid' | 'sr'` and let the reader filter. Only worth it once the content exists.

---

## Execution cadence

- One step per sitting. No batching.
- Each step ends with the dev server running and the new page skimmed at <60s.
- If a step balloons past 2 hours of writing, cut scope — density over completeness.

---

## Risks

- **Scope creep** → enforce the <60s-skim rule per page.
- **DevOps demotion annoys platform readers** → keep pages intact, only demote in nav.
- **System-design rabbit hole** → cap each sub-file at ~8–12 entries. Cite primitives, don't re-teach them.
- **Behavioral page drifts from "cheat sheet" into "essays"** → every answer shape is ≤3 bullets.
