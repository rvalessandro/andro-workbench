# Retrospective Framework

How to run retrospectives that actually lead to improvement.

---

## Core Principle

**100% responsibility, zero blame.**

Everyone owns their part in creating the problem. No finger-pointing at external factors. Focus on what you control.

---

## Two Types of Retros

### [Project/Issue Retro](/retrospectives/project-issue)

**When:** After a project ships or when a major issue happens.

**Purpose:** Understand what happened, what each person contributed, how to improve.

**Duration:** 30-45 minutes.

**Format:** Each person writes their issues, what they did to create them, and proposed solutions.

**Use this when:**
- Project missed deadline
- Major production issue
- Feature didn't deliver expected results
- Team conflict needs resolving

### [Quarterly Review](/retrospectives/quarterly-review)

**When:** End of every quarter.

**Purpose:** Celebrate wins, surface problems, prioritize fixes for next quarter.

**Duration:** 60 minutes.

**Format:** Wins (personal + commends) + Problems (issue + your contribution + solution).

**Use this when:**
- Regular quarterly cadence
- Want to build team accountability culture
- Need to identify systemic issues

---

## The Rules (Non-Negotiable)

### 1. One-Liners Only

If you can't say it in one line, you haven't clarified the issue.

**Bad:** "We had some challenges with the deployment process and there were multiple factors that contributed to the delay including infrastructure issues and communication gaps."

**Good:** "Deploy failed twice, costing 2 days, because I didn't test staging environment first."

### 2. Use Real Numbers

No vague words. Use: users, weeks, dollars, percentages.

**Bad:** "Performance was slow for some users."

**Good:** "API latency was 3.2s for 2,000 users with >50 linked accounts."

### 3. Name Names in Commends

Give specific credit. "Alex did X" not "engineering helped."

**Bad:** "The team helped us ship faster."

**Good:** "Alex built payment adapter in 4 hours, saving our Q3 launch."

### 4. Own Your Contribution

Every problem needs YOUR contribution. No blaming external factors.

**Bad:** "Customer didn't provide requirements on time."

**Good:** "I didn't set a requirements deadline upfront, so customer delayed us 3 weeks."

### 5. Solutions Need Deadlines

"We should improve X" is not a solution. "Do X by Y date" is.

**Bad:** "Better load testing going forward."

**Good:** "Thursday 3pm weekly load test with 10x production traffic starting Oct 10."

---

## How to Run a Retro

### Before the Meeting (15 min)

1. Everyone fills out their section
2. Keep it to one-liners
3. Include specific numbers/names
4. Send to team 30 min before meeting

### During the Meeting

**Project/Issue Retro (30-45 min):**
1. **Run through (20 min):** Each person reads their issues
2. **Identify patterns (10 min):** What issues overlap? What's the root cause?
3. **Action items (10 min):** Assign DRI and deadline for each fix
4. **Document (5 min):** Share in Slack/Notion immediately

**Quarterly Review (60 min):**
1. **Wins (15 min):** Everyone shares personal wins + commends
2. **Problems (30 min):** Each person reads their issues
3. **Vote (5 min):** Team votes on top 3 problems to fix in next quarter
4. **Assign (10 min):** Each problem gets DRI and deadline

### After the Meeting (5 min)

1. Post retro notes in team channel
2. Add action items to project tracker with deadlines
3. Schedule follow-up check-in for 2 weeks out

---

## Common Mistakes

**Mistake 1: Blaming external factors**

"The customer changed requirements" is blame.

"I didn't set a scope freeze date" is ownership.

**Mistake 2: Solutions without deadlines**

"We should do better testing" won't happen.

"Weekly load test every Thursday at 3pm starting Oct 10" will.

**Mistake 3: Too much discussion**

Retros are for capturing problems and assigning fixes, not solving them.

If a discussion goes >5 minutes, table it: "Alex + Sarah sync offline, report back Friday."

**Mistake 4: No follow-up**

Most retros fail because action items don't get done.

Schedule 2-week check-in: "Did we implement the fixes?"

**Mistake 5: Making it a blame session**

If someone says "Marketing didn't give us assets on time" →

Redirect: "What did you do to help create this? Did you set a deadline? Did you follow up?"

---

## Example: What Good Looks Like

**Bad retro item:**
- Issue: "The project was delayed."
- What I did: "Nothing, it was out of my control."
- Solution: "Better planning next time."

**Good retro item:**
- Issue: "Feature shipped 3 weeks late, missing $200K revenue target."
- What I did: "Added 4 requirements mid-sprint without adjusting timeline."
- Solution: "Scope freeze after day 2 of sprint; new requests go to next sprint. Starting Oct 10."

---

## Templates

Choose the right template for your situation:

**[Project/Issue Template](/retrospectives/project-issue)** - Use after a project or major issue

**[Quarterly Review Template](/retrospectives/quarterly-review)** - Use at end of quarter

---

## TL;DR

**Retros that work:**
- 100% responsibility, zero blame
- One-liners with real numbers
- Name names in commends
- Every problem has your contribution
- Solutions have deadlines and DRIs

**Two formats:**
- Project/Issue (30-45 min) - After projects or issues
- Quarterly Review (60 min) - Every quarter

**The key:** Action items with deadlines, tracked and followed up.
