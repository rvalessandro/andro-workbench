## **How to Run This (60 minutes)**

**Prep (before meeting):**

1. Everyone fills out their section  
2. Keep it to one-liners with specific numbers/names

**Meeting:**

1. Run thru (30 min): Run through the notes and actionables  
2. Assign (15 min): Each problem gets one DRI and deadline  
3. Document (15 min): Share in Slack immediately

**Rules:**

1. One-liners only \- if you can't say it in one line, you haven't clarified the issue  
2. Use real numbers: 2,000 users, 4 weeks, $4M, 80% reduction  
3. Name names in commends: "Alex did X" not "engineering helped"  
4. Every problem needs YOUR contribution \- no blaming external factors  
5. Solutions must have deadlines

## **Retrospective**

1. Person   
   1. Wins  
      1. **Personal:**   
         1. Things you're proud of having achieved. One liners.  
      2. **Commends:**   
         1. Things that you appreciate and want to highlight from other people. One liners.  
   2. Problems  
      1. **Issue:** One liner  
         1. **What I did to help create this situation:** one liner  
         2. **Proposed solution:** one liner

## **Example: Q3 Fintech App Team**

1. **Sarah \- Product Manager**  
   1. **Wins**  
      1. **Personal:**  
         1. Cut instant transfers scope by 70% and still hit $4M daily transaction volume  
         2. Reduced PRD review cycle from 2 weeks to 3 days by killing committee reviews  
      2. **Commends:**  
         1. Alex built adapter for payment API change in 4 hours, saving our Q3 launch  
         2. Jordan killed her own "beautiful" slider design when data showed 92% type amounts  
   2. **Problems**  
      1. **Issue:** Budget calculator crashed for 2,000 users with \>50 linked accounts on launch day  
         1. **What I did to help create this situation:** Only tested with my own 5 accounts; never checked actual user data  
         2. **Proposed solution:** Pull user distribution data for every feature; add to PRD template by Oct 10  
      2. **Issue:** Lost 15 engineering days to platform consistency debates across 3 features  
         1. **What I did to help create this situation:** Didn't set iOS-first or Android-first decision upfront  
         2. **Proposed solution:** Page 1 of every PRD states lead platform; other follows without debate  
2. **Alex \- Senior Engineer**  
   1. **Wins**  
      1. **Personal:**  
         1. Shipped instant transfers in 4 days by reusing payment webhook handler from last quarter  
         2. Reduced API response time from 3.2s to 0.8s by fixing N+1 query in account aggregation  
      2. **Commends:**  
         1. Sarah killed 8 features from instant transfers; cleanest PRD I've ever implemented  
         2. Jordan provided Figma specs with exact padding values; zero design-dev ping pong  
   2. **Problems**  
      1. **Issue:** Budget calculator crashed for 2,000 users with \>50 linked accounts on launch day  
         1. **What I did to help create this situation:** Loaded all accounts into memory; never tested beyond 10 concurrent users  
         2. **Proposed solution:** Thursday 3pm weekly load test with 10x production traffic before any launch  
      2. **Issue:** Search feature slipped 4 weeks after discovering Elasticsearch version incompatibility  
         1. **What I did to help create this situation:** Said "fuzzy search is easy" without checking our ES version supports it  
         2. **Proposed solution:** 2-hour technical spike required before any feature commitment; results in PRD  
3. **Jordan \- Designer**  
   1. **Wins**  
      1. **Personal:**  
         1. Instant transfers built in 4 days using only system components; zero custom UI  
         2. Reduced design QA bugs by 80% by adding interaction videos to every Figma frame  
      2. **Commends:**  
         1. Alex implemented complex transfer animation perfectly after one video walkthrough  
         2. Sarah pulled support tickets proving users don't want "delightful" features; just working ones  
   2. **Problems**  
      1. **Issue:** Budget calculator crashed for 2,000 users with \>50 linked accounts on launch day  
         1. **What I did to help create this situation:** Designed cards layout for max 5 accounts; never made list view fallback  
         2. **Proposed solution:** Every design includes stress test: 0, 1, 10, 100+ items documented in Figma  
      2. **Issue:** Wasted 2 weeks on high-fidelity designs for technically impossible features  
         1. **What I did to help create this situation:** Went straight to pixel-perfect without engineering input  
         2. **Proposed solution:** Wireframes only until Alex confirms "buildable in sprint"; then high-fidelity

---

## **Team Problem Inventory**

After individual sections, vote on top 3 to fix in Q4:

1. ✅ Budget calculator crashes → DRI: Alex → Fix by: Oct 15  
2. ✅ Platform debate waste → DRI: Sarah → Fix by: Tomorrow  
3. ✅ Design before feasibility → DRI: Jordan → Fix by: Monday  
4. ⏸️ Search delays → Backlog for Q4  
5. ⏸️ \[Other problems\] → Document for later

