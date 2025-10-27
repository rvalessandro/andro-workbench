# Engineering Mental Models

How to think about building systems that scale.

---

## TL;DR

**Core Mindsets:**
- Separate deploy from release - Ship code != change user experience
- Dual write migrations - Change systems without breaking them
- Make things reversible - Fast forward, instant rollback
- Fail gracefully - Stop, don't cascade
- Optimize for iteration speed - Perfect later, working now

---

## Separate Deploy from Release

**What it is:** Deploying code ≠ changing user experience.

**The insight:**
- **Deploy** = technical process (build, test, roll out code)
- **Release** = business decision (change user-facing features)

These are different operations. Treating them the same creates unnecessary friction.

**How to think about it:**
- Ship code to production multiple times per day (deploy)
- Control feature visibility independently (release)
- Product/marketing decides when users see changes, not engineering timeline

**Example:**
- Bad: "We can't launch the feature until Friday because that's when we deploy"
- Good: "Code shipped Monday. Marketing turns on the feature Friday at 10am for launch."

**Why it matters:** Speed and safety. Deploy fast, release deliberately.

**When to use:** Every feature. Wrap in feature flags by default.

---

## Dual Write Migrations

**What it is:** Change systems without breaking them.

**The insight:** Don't switch systems in one step. Write to both, switch reads gradually.

**How to think about it:**
1. Old system is source of truth
2. Add writes to new system (dual write)
3. Verify new system matches old
4. Switch reads to new system (now source of truth)
5. Stop writing to old system
6. Delete old system

**Example:**
Moving from MongoDB to PostgreSQL:
- Week 1: Write both, read Mongo (old is truth)
- Week 2: Write both, read Postgres (new is truth, old is backup)
- Week 3: Write Postgres only, delete Mongo

**Why it matters:** Zero downtime migrations. Instant rollback if new system fails.

**When to use:** Database migrations, system rewrites, API changes.

---

## Make Things Reversible

**What it is:** Fast forward, instant rollback.

**The insight:** Most changes should be reversible in <1 minute.

**How to think about it:**
- Ship new code to production (not live yet)
- Turn on for 1% of users
- If it breaks, turn off instantly
- If it works, ramp to 100%

**Example:**
- Bad: Deploy breaks production, need 2 hours to rollback and redeploy
- Good: Feature breaks production, turn off flag in 30 seconds

**Why it matters:** Reduces fear of shipping. Encourages experimentation.

**When to use:** Every deploy. Every feature.

---

## Fail Gracefully

**What it is:** When something breaks, stop. Don't cascade.

**The insight:** Failing services should fail fast, not slow down everything.

**How to think about it:**
- If payment API is down, stop calling it
- Return cached data or error message
- Don't let one slow service make your whole system slow

**Example:**
- Bad: Payment API times out after 30 seconds. Every checkout request waits 30 seconds before failing.
- Good: After 5 failures, stop calling payment API. Return error immediately.

**Why it matters:** One failure shouldn't cascade to everything. Protect the rest of the system.

**When to use:** Calling external APIs, microservices, third-party dependencies.

---

## Optimize for Iteration Speed

**What it is:** Ship fast, learn fast, fix fast.

**The insight:** Perfect code that ships in 6 months loses to working code that ships in 1 week.

**How to think about it:**
- Ship MVP fast
- Measure what breaks
- Fix what matters
- Ignore what doesn't

**Example:**
- Bad: "Let's build the perfect architecture before launch. 6 months to ship."
- Good: "Ship monolith in 1 week. If we hit 10M users, then split into microservices."

**Why it matters:** Speed of iteration beats perfection. Learn from real users, not assumptions.

**When to use:** Always. Default to fast iteration.

---

## Build for Observability

**What it is:** You can't fix what you can't see.

**The insight:** Logs, metrics, traces should be built in from day 1, not added later.

**How to think about it:**
- Every critical path should be measurable
- Know when things break before users tell you
- Understand what's slow and why

**Example:**
- Bad: "We don't know why checkouts are slow. No metrics."
- Good: "Payment API at 3.2s, database query at 0.8s, rest negligible. Fix payment API."

**Why it matters:** Can't improve what you don't measure. Can't debug what you can't see.

**When to use:** From day 1. Not an afterthought.

---

## Design for Failure

**What it is:** Everything will fail. Plan for it.

**The insight:** Assume services will be down. Assume networks will be slow. Design for it.

**How to think about it:**
- What happens if this API is down?
- What happens if this database is slow?
- Can we degrade gracefully instead of breaking completely?

**Example:**
- Bad: Payment API down = users can't browse products
- Good: Payment API down = users can browse, add to cart, checkout disabled with message

**Why it matters:** Failures are inevitable. Graceful degradation is better than total outage.

**When to use:** Designing every system, especially critical paths.

---

## Keep it Simple

**What it is:** Simple systems are easier to understand, debug, and maintain.

**The insight:** Complexity kills. Every abstraction has a cost.

**How to think about it:**
- Start simple (monolith)
- Add complexity only when necessary (microservices when monolith can't scale)
- Ask: "What's the simplest thing that could work?"

**Example:**
- Bad: "Let's use microservices from day 1 because that's best practice"
- Good: "Ship monolith. Split into microservices at 10M users if needed."

**Why it matters:** Simple systems ship faster, break less, and are easier to fix.

**When to use:** Always. Default to simplicity.

---

Inspired by [Charity Majors](https://charity.wtf/2023/03/08/deploys-are-the-%E2%9C%A8wrong%E2%9C%A8-way-to-change-user-experience/) and engineering leaders.
