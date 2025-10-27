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
- **Current Status:** API done. Frontend 60% complete. Testing blocked on sandbox access.
- **Blockers:**
  - Sandbox delayed 1 week → Use mock data for frontend → Dev team using mocks, sandbox Friday
- **Insights:** Mock data working well. Should do by default. Contract signing took 3 weeks longer than expected. Start legal reviews 1 month earlier.

---

**Alex (DRI: Fraud Detection)**

**Implement Fraud Scoring**
- **Current Status:** Model training complete. Checkout integration in progress. Launch Jan 15.
- **Blockers:**
  - False positive rate 8% (target <5%) → Add user behavior features → Data team pulling features, retraining this week
- **Insights:** Should have included data team earlier (lost 1 week). Feature flags working great. Rolling out to 1% Friday.

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

Related: [Rock Sizing](/quarterly-planning/rock-sizing) • [DRI Responsibilities](/quarterly-planning/dri-responsibilities)
