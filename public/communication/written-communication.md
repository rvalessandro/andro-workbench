# Written Communication

How to write clearly and get to the point.

---

## TL;DR

- **Start with the conclusion** - Don't make people wait
- **No weasel words** - Be specific: numbers, names, dates
- **State your ask** - What do you need? By when?
- **Use BLUF/Minto Pyramid** - Conclusion → Key points → Supporting details

---

## The Framework: BLUF + Minto Pyramid

**Structure every message like this:**

1. **Conclusion first** - Your main point, recommendation, or ask
2. **Key points second** - 2-4 supporting arguments
3. **Details last** - Evidence, data, context (optional for reader)

**Why it works:** Respects reader's time. Busy people can stop reading after line 1 if they get it.

---

## Start with the Conclusion

**What it means:** Lead with your point. Don't bury it.

**How to do it:**
- First sentence = your ask, recommendation, or decision
- No warm-up, no "I was thinking..."
- Get to the point in <10 words

**Example:**

- **Bad:** "Hey, I've been thinking about our Q4 roadmap and noticed a few things. Last quarter we shipped late on 3 features, and I think we might have a similar problem this time. I wanted to discuss if maybe we should consider adjusting our approach. Do you have time to chat?"

- **Good:** "We need to cut 2 features from Q4 roadmap to ship on time. Here's why: [3 bullet points]. Can we discuss this in tomorrow's 1:1?"

---

## No Weasel Words

**What they are:** Vague language that avoids specifics.

**Common weasel words:**
- "Should", "Could", "Might", "Perhaps"
- "Improve", "Enhance", "Optimize" (without specifics)
- "Some", "Many", "Several"
- "Soon", "Later", "Eventually"

**How to fix:**
- Use numbers: "3 customers complained" not "some customers"
- Use names: "Sarah from sales" not "someone from sales"
- Use dates: "by Friday 5pm" not "soon"
- Use metrics: "reduce from 3.2s to <1s" not "improve performance"

**Example:**

- **Bad:** "We should improve the checkout flow soon because some users are having issues and conversion could be better."

- **Good:** "Reduce checkout time from 45 seconds to <20 seconds by March 15. This will increase conversion from 12% to 15% based on A/B test with 500 users."

**Reference:** [Don't use weasel words](https://medium.com/geekculture/the-importance-of-story-telling-in-software-engineering-99004efda25f#:~:text=4.%20Friends%20don%E2%80%99t%20let%20friends%20use%20weasel%20words)

---

## State Your Ask

**What it means:** Be explicit about what you need.

**How to do it:**
- End with clear next step
- Include who, what, by when
- Make it actionable

**Example:**

- **Bad:** "Thought you might want to know about the database migration. Let me know your thoughts."

- **Good:** "Approve database migration by EOD Thursday. I need your sign-off to proceed. If you have concerns, let's discuss in Slack by Wednesday."

---

## Common Pitfalls

### Pitfall 1: No Conclusion

**What it looks like:** Sharing information without a point.

**Example:**
"I looked at the metrics. Traffic is up 20%. Conversion is down 5%. Mobile bounce rate increased."

**Fix:** Add conclusion.
"Recommendation: Focus Q2 on mobile conversion. Traffic is up 20% but mobile bounce rate increased 15%, costing us $50K/month."

---

### Pitfall 2: Asking Permission First

**What it looks like:** "Do you have time?" before stating your ask.

**Example:**
"Hey, got a quick question about our strategy. Do you have 5 minutes?"

**Fix:** State the ask with context.
"Need your approval on vendor choice. Option A costs $10K less but ships 2 weeks later. Which do you prefer?"

---

### Pitfall 3: Burying the Point

**What it looks like:** Long intro before getting to the point.

**Example:**
"Last week we discussed Q4 planning and I've been thinking about our approach. Historically we've struggled with late deliveries and I noticed a pattern in our retrospectives. After analyzing the data, I think we have a capacity problem. What I'm trying to say is..."

**Fix:** Start with the point.
"We're over-committed by 40%. Cut 2 features from Q4 or push deadline to Jan 15. Here's the data: [bullets]."

---

### Pitfall 4: Insufficient Context

**What it looks like:** Vague question that requires follow-up.

**Example:**
"Got a quick question about our strategy?"

**Fix:** Provide full context upfront.
"Should we prioritize feature A (higher revenue, 2 months) or feature B (faster win, lower impact)? Need decision by Friday to start sprint planning."

---

### Pitfall 5: Leaving Your Thinking Visible

**What it looks like:** Unrevised draft showing your thought process.

**Example:**
"So I was looking at the data and first I checked Q3 numbers, then I compared to Q2, and I realized we might have an issue, so I dug deeper and found..."

**Fix:** Remove the journey, share the destination.
"Q4 revenue will miss target by $200K based on current conversion rate (12% vs 15% needed). Three options: [bullets]. Recommend option 2."

---

## How to Apply This

**Before sending any message:**

1. **What's my conclusion?** Move it to the first sentence.
2. **What's my ask?** Make it explicit at the end.
3. **Are there weasel words?** Replace with specifics (numbers, names, dates).
4. **Is my thinking visible?** Delete the journey, keep the conclusion.

**Good structure:**
```
[Conclusion/Ask in first sentence]

[2-4 key supporting points as bullets]

[Optional: Supporting data/context]

[Clear next step with deadline]
```

---

## Example: Good Message

**Subject:** Q4 Roadmap - Need decision by Friday

We need to cut 2 features from Q4 to ship on time.

**Why:**
- Current scope: 8 features, 12 weeks
- Team capacity: 6 features, 12 weeks (based on Q3 velocity)
- Risk: Without cuts, we'll ship in Jan instead of Dec 15

**Options:**
1. Cut features C and D (lowest impact, saves 4 weeks)
2. Push deadline to Jan 15 (affects year-end goals)
3. Add 2 contractors (cost: $80K, available in 2 weeks)

**Recommendation:** Option 1. Features C and D can move to Q1.

**Next step:** Approve by Friday 5pm so we can update sprint planning.

---

**References:**
- [Minto Pyramid](https://untools.co/minto-pyramid/)
- [BLUF](https://www.animalz.co/blog/bottom-line-up-front/)
- [Don't use weasel words](https://medium.com/geekculture/the-importance-of-story-telling-in-software-engineering-99004efda25f#:~:text=4.%20Friends%20don%E2%80%99t%20let%20friends%20use%20weasel%20words)
