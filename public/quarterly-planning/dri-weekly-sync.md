# DRI Weekly Sync

Weekly meeting for DRIs to stay on track.

---

## TL;DR

- **When:** Weekly
- **Who:** All DRIs
- **What:** Current status, blockers, insights (one-liners)
- **Why:** Unblock each other, share learnings

---

## Template

**Date: [Insert Date]**

**Person 1**

**Project 1**
- **Current Status:** [One-liner. E.g. "API shipped. Frontend waiting on design. Timeline: Jan 15 → Jan 20"]
- **Blockers:**
  - Challenge A → Proposed solution → Action taken
- **Insights:** [What's working / not working]

**Project 2**
- **Current Status:** [One-liner]
- **Blockers:**
  - Challenge B → Proposed solution → Action taken
- **Insights:** [What's working / not working]

---

**Person 2**

**Project 3**
- **Current Status:** [One-liner]
- **Blockers:**
  - Challenge C → Proposed solution → Action taken
- **Insights:** [What's working / not working]

---

## Example: Jan 6, 2025

**Sarah (DRI: Payments)**

**Launch Payments in Malaysia**
- **Current Status:** On track for Jan 15 launch. API done. Frontend 60% complete (was 40% last week). Testing blocked on sandbox access.
- **Blockers:**
  - Sandbox delayed 1 week (vendor issue) → Using mock data for frontend dev → Dev team has mocks, real sandbox arrives Friday. No launch impact.
- **Insights:** Mock data strategy working well—frontend dev continued without blocking. Should do by default. Contract signing took 3 weeks longer than expected (2 weeks vs 5 weeks). Start legal reviews 1 month earlier next time.

---

**Alex (DRI: Fraud Detection)**

**Implement Fraud Scoring**
- **Current Status:** On track for Jan 15 launch. Model training complete. Checkout integration 70% done (was 30% last week).
- **Blockers:**
  - False positive rate 8%, need <5% for launch → Adding user behavior features (session time, device fingerprint) → Data team pulling features today, retraining Wed. If rate stays >5%, push launch 1 week.
- **Insights:** Should have included data team in kickoff (lost 1 week on feature discussion). Feature flags working great—rolling out to 1% Friday for real-world testing before full launch.

---

## How to Run This

**Before (15 min):**
- Everyone updates their section
- One-liners only
- Send 30 min before meeting

**During (30-45 min):**
1. **Quick round (15 min):** Each DRI reads update
2. **Deep dive blockers (15 min):** Top 2-3 blockers across all projects
3. **Insights (10 min):** What's working? What should change?

**After (5 min):**
- Document decisions
- Add action items to tracker (owners + deadlines)
- Follow up on blockers within 24 hours

---

## Common Mistakes

**Mistake 1: No Pre-Work**

Meeting becomes status update instead of problem-solving.

**Fix:** Everyone writes update before meeting.

---

**Mistake 2: Too Much Detail**

Meeting runs over. Key blockers don't get addressed.

**Fix:** One-liners only. If discussion >5 minutes, take offline.

---

**Mistake 3: No Follow-Up**

Blockers discussed but not resolved.

**Fix:** Assign owner and deadline for each blocker. Follow up in 24 hours.

---

**Mistake 4: Only Problems**

Team gets demoralized.

**Fix:** Always share what's working. Celebrate wins.

---

**Mistake 5: Vague Status Updates**

**What it looks like:**
> "Milestones updated due team member need to switch to other projects. M2: Still on development. M3: Start Oct 29. Stage test: Nov 4."

**Why it fails:**
- Can't tell if on track or delayed
- No context on what changed or why
- No clear impact or ask
- Reader has to guess what help is needed

**Fix:** State track status, give context, show impact, clear ask.

**Good version:**
> "Payments Malaysia delayed 2 weeks (Jan 15 → Jan 29). Sarah switched to Supply project (CEO priority). Impact: Q1 revenue target drops $50K. Need decision: hire contractor ($15K) to stay on Jan 15, or accept Jan 29 date?"

**What makes it good:**
- Clear status: "delayed 2 weeks"
- Specific dates: "Jan 15 → Jan 29"
- Reason with context: "Sarah to Supply (CEO priority)"
- Business impact: "$50K revenue drop"
- Clear decision needed: "hire contractor or accept delay?"
- Specific numbers: "$15K contractor cost"

---

Related: [Rock Sizing](/quarterly-planning/rock-sizing) • [DRI Responsibilities](/quarterly-planning/dri-responsibilities) • [Written Communication](/communication/written-communication)
