# Writing Guidelines

Guidelines for creating content for this site.

---

## Core Principles

1. **Everything must be actionable, concise, and avoid weasel words**
2. **No repetition** - Don't repeat what's already in tables or previous sections
3. **TL;DR at the top** - Always start with a quick summary
4. **Examples over explanation** - Show, don't tell
5. **One-liners** - Keep it brief

---

## Style

### Actionable

Every section should tell the reader what to do, not just what something is.

- Bad: "Rock sizing is a framework for prioritizing work"
- Good: "Start with 1-3 rocks for the quarter. Fill with pebbles. Leave 20-30% for sand."

### Concise

Remove unnecessary words. Get to the point.

- Bad: "In order to effectively prioritize your work, you should consider..."
- Good: "Prioritize: 1-3 rocks, fill with pebbles, leave 20-30% for sand."

### No Weasel Words

No vague language. Use specific numbers, names, dates.

- Bad: "We should improve performance"
- Good: "Reduce API response time from 3.2s to <1s by Friday"

Weasel words to avoid:
- "Should", "Could", "Might", "Perhaps"
- "Improve", "Enhance", "Optimize" (without specifics)
- "Some", "Many", "Several"
- "Soon", "Later", "Eventually"

### No Repetition

If information is in a table, don't repeat it in prose below.

- Bad: Having a table of rock/pebble/sand attributes, then explaining each attribute again
- Good: Table with attributes, then actionable "How to Prioritize" section

### Examples

Every concept needs a concrete example with real-world context.

- Include Good/Bad comparisons
- Use specific names, numbers, dates
- Make it feel real
- Show concrete use cases ("Use case: Slow user login" not just "Indexing improves performance")
- Include before/after with metrics ("Before: 2 seconds. After: 10ms")

### Concrete Use Cases

Don't just explain concepts. Show when and why to use them.

- Bad: "The outbox pattern helps with reliability"
- Good: "Use case: Complete order + capture Stripe payment in background. Problem: Stripe is slow (2s), user waiting. Solution: Outbox pattern processes payment async."

### Decision Frameworks

Help readers make decisions, not just understand concepts.

- Include "When to use X vs Y" comparisons
- Show tradeoffs with specific costs/benefits
- Add decision criteria with real numbers
- Example: "Kubernetes: Don't use for <10 services. Do use for 50+ microservices across multiple regions."

### How to Know

Show readers how to diagnose problems themselves.

- Bad: "Use indexing for slow queries"
- Good: "How to know what to index: Use EXPLAIN query. Look for 'Seq Scan' = slow. Add index. Re-run EXPLAIN. 'Index Scan' = fast."

### Progressive Complexity

Start simple, explain when to advance.

- Show the simple way first
- Explain when it breaks ("Works until 1M users, then...")
- Show the advanced solution
- Include cost comparison where relevant ("Vertical: $160/month. Horizontal: $50/month for same capacity.")

---

## Document Structure

Every document should have:

1. **Title**
2. **One-line description**
3. **TL;DR section** (bullet points)
4. **Main content** (actionable sections with concrete use cases)
5. **Common Mistakes** section (with fixes)
6. **Related links** at bottom

For technical content, also include:
- **Use case** for each concept (real-world scenario)
- **Before/after** with metrics (2s → 10ms)
- **Decision criteria** (when to use X vs Y)
- **How to diagnose** (teach readers to identify problems)
- **Cost tradeoffs** where relevant ($160/month vs $50/month)

---

## Tone

- Direct, not corporate
- Casual but professional
- No fluff
- No motivational language unless asked

---

## What to Avoid

1. **Repetition** - If it's in the table, don't explain it again
2. **Weasel words** - Be specific
3. **Long explanations** - Keep it short
4. **Vague examples** - Use real names, numbers, dates
5. **Missing TL;DR** - Always include at top
6. **No action items** - Tell people what to do
7. **Theory without practice** - Every concept needs a real use case
8. **Missing metrics** - Show before/after numbers
9. **No decision criteria** - Help readers choose between options
10. **Jumping to advanced solutions** - Start simple, show when to advance

---

This document guides all content creation for the site.
