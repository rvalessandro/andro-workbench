# **NoOn Personal CRM \- Product Requirements Document**

## **Executive Summary**

Transform NoOn from a digital business card app into an intelligent Personal CRM that makes relationship maintenance effortless for professionals and entrepreneurs.

---

## **Problem Statement**

### **Current Reality**

**87% of professionals** say relationships are their most valuable career asset, yet **80% fail** to maintain them consistently.

#### **Pain Points**

1. **Contact Decay** \- Information becomes outdated within 6-12 months (job changes, new numbers)  
2. **Relationship Entropy** \- Valuable connections fade from lack of engagement, not lack of caring  
3. **Cognitive Overload** \- Professionals manage 500+ contacts but can only actively maintain \~150  
4. **Lost Opportunities** \- Miss critical moments (job changes, milestones) to reconnect meaningfully  
5. **Action Paralysis** \- Know who to contact but unsure what to say or when

### **Impact of Inaction**

- **Individual:** Career opportunities lost, weakened professional network, relationship guilt  
- **Business:** NoOn remains a commoditized digital business card in a crowded market  
- **Revenue:** One-time hardware sales vs. recurring SaaS with 70% margins

### **Future Vision**

Professionals wake up to 2-3 personalized relationship nudges daily. With one tap, they maintain meaningful connections that drive career growth, business opportunities, and personal fulfillment. Their network becomes an actively managed asset, not a decaying contact list.

---

## **Solution Architecture**

### **Core Value Propositions**

#### **1\. Intelligent Relationship Triage**

Transform 500+ contacts into actionable daily priorities using AI-driven categorization.

#### **2\. Crowdsourced Intelligence**

Privacy-preserving signals when mutual contacts change jobs or hit milestones.

#### **3\. Zero-Friction Engagement**

From nudge to sent message in under 10 seconds with AI-drafted, personalized outreach.

---

## **User Flows & Use Cases**

### **🎯 Core User Journeys**

#### **Journey 1: New User Onboarding (Day 1 Magic)**

**Goal:** Achieve "aha moment" within 5 minutes

```
1. Import Contacts (30 sec)
   → Google/Apple contacts auto-import
   → NFC ring sync existing users
   
2. Smart Categorization (2 min)
   → "Select your 5 inner circle contacts"
   → AI suggests categories for top 50 contacts
   → User validates/adjusts
   
3. First Value Moment (2 min)
   → Surface 3 immediate actions:
     • "John changed jobs 2 months ago - reconnect?"
     • "Sarah's birthday is tomorrow"  
     • "You haven't talked to mentor David in 4 months"
   
4. First Success (30 sec)
   → One-tap to send personalized WhatsApp
   → Contact responds positively
   → User feels immediate value
```

**Success Metrics:** 70% complete first outreach within 24 hours

---

#### **Journey 2: Daily Relationship Maintenance**

**Goal:** Build habit loop for consistent engagement

```
Morning Routine (8:00 AM):
📱 Push: "2 relationship nudges for today"

1. Open app → Personalized dashboard
2. See today's priorities:
   • "🔴 Inner Circle: Check in with investor Lisa (cooling - 3 months)"
   • "🟡 Key Contact: Congrats to Mark on new role at Google"
   
3. For each nudge:
   → See context (last interaction, talking points)
   → Review AI-drafted message
   → Edit if needed (system learns)
   → Send via WhatsApp/Email
   
4. Quick win celebration:
   → "✓ 2 relationships maintained"
   → Streak counter updates
   → See relationship health improve
```

**Success Metrics:** 60% daily active usage, 3.2 actions per session

---

#### **Journey 3: Offline Interaction Logging**

**Goal:** Capture real-world networking effortlessly

```
Scenario: After industry conference
   
1. End-of-day prompt (6 PM):
   → "Log today's connections?"
   
2. Smart suggestions:
   → Based on calendar: "Tech Summit 2024"
   → Based on location: "Hong Kong Convention Centre"
   → Shows likely contacts
   
3. Rapid logging:
   → Tap faces of people met
   → Add optional quick notes (voice or text)
   → Set follow-up reminders
   
4. Automated follow-ups:
   → Next day: "Send thank you to yesterday's connections?"
   → Pre-drafted messages ready
```

**Success Metrics:** 40% of users log offline interactions weekly

---

### **💡 Key Use Cases**

#### **Use Case 1: Dormant Relationship Revival**

**Trigger:** Important contact dormant \>6 months **Action:** Contextual re-engagement with shared interest **Value:** Reactivate valuable relationships before they're lost

#### **Use Case 2: Birthday/Milestone Outreach**

**Trigger:** Important date approaching **Action:** Personalized message beyond generic "Happy Birthday" **Value:** Stand out with thoughtful, timely outreach

#### **Use Case 3: Network Request Facilitator**

**Trigger:** Contact asks for introduction/help **Action:** Surface relevant connections from network **Value:** Become valuable connector, strengthen relationships

#### **Use Case 4: Quarterly Relationship Review**

**Trigger:** End of quarter **Action:** Visual health report of all key relationships **Value:** Strategic relationship planning, never lose important contacts

---

## **Technical Requirements**

### **Core Capabilities**

#### **1\. Data & Intelligence Layer**

- **Interaction Tracking:** In-person logging  
- **AI Categorization:** Smart tagging and relationship scoring  
- **Privacy-First Architecture:** Zero-knowledge crowdsourcing

#### **2\. Engagement Engine**

- **Smart Notifications:** ML-optimized timing (not just 8 AM)  
- **Message Generation:** GPT-powered with style learning  
- **Multi-Channel Delivery:** WhatsApp API, Email, SMS  
- **Response Tracking:** Sentiment analysis on replies

#### **3\. Analytics Dashboard**

- **Relationship Health Scores:** Visual network status  
- **Engagement Metrics:** Response rates, interaction frequency  
- **ROI Tracking:** Opportunities generated from outreach  
- **Network Growth:** Quality vs quantity metrics

### **Non-Functional Requirements**

- **Performance:** \<2 sec load time, offline capability  
- **Security:** End-to-end encryption, GDPR compliant  
- **Scalability:** Support 10K+ contacts per user  
- **Availability:** 99.9% uptime for notifications

---

## **Delivery Roadmap**

### **Phase 1: Foundation (Sprints 1-4) \- 8 Weeks**

**Goal:** Core Personal CRM with immediate value

#### **Sprint 1-2: Data Foundation**

- Contact import/sync (Google, Apple, NFC)  
- 3-layer categorization system  
- Basic interaction tracking  
- **Deliverable:** Users can organize and track relationships

#### **Sprint 3-4: Intelligence Layer**

- Relationship health scoring algorithm  
- Basic nudge system (birthdays, dormancy)  
- AI message drafting (template-based)  
- **Deliverable:** Users receive 3 daily actionable nudges

**Milestone:** Beta launch with 100 power users

---

### **Phase 2: Network Effects (Sprints 5-8) \- 8 Weeks**

**Goal:** Build viral growth mechanisms

#### **Sprint 5-6: Crowdsourced Intelligence**

- Privacy-preserving change detection  
- Mutual contact notifications  
- Network strength visualization  
- **Deliverable:** "Your network updated John's info" notifications

#### **Sprint 7-8: Engagement Optimization**

- Smart notification timing (ML-based)  
- WhatsApp/Email integration  
- Quick action widgets  
- Offline interaction logging  
- **Deliverable:** One-tap engagement from notification to sent message

**Milestone:** Public launch, 1,000 users

---

### **Phase 3: Stickiness (Sprints 9-12) \- 8 Weeks**

**Goal:** Drive daily active usage

#### **Sprint 9-10: Habit Formation**

- Streak tracking and rewards  
- Morning routine optimization  
- Weekly relationship reports  
- Voice note transcription  
- **Deliverable:** 60% weekly active users

#### **Sprint 11-12: Advanced Intelligence**

- Conversation intelligence (analyze replies)  
- Predictive relationship risks  
- Smart introduction suggestions  
- LinkedIn integration  
- **Deliverable:** AI predicts relationship needs with 75% accuracy

**Milestone:** 10,000 users, 50% DAU

---

### **Phase 4: Monetization (Sprints 13-16) \- 8 Weeks**

**Goal:** Revenue generation and enterprise features

#### **Sprint 13-14: Premium Features**

- Unlimited contacts (vs 150 free)  
- Advanced analytics dashboard  
- Bulk actions and automation  
- Priority AI processing  
- **Deliverable:** 15% conversion to paid

#### **Sprint 15-16: Enterprise Tools**

- Team collaboration features  
- CRM integration (Salesforce, HubSpot)  
- Admin dashboard for companies  
- Compliance and audit tools  
- **Deliverable:** First 10 enterprise customers

**Milestone:** $50K MRR

---

## **Risk Mitigation**

### **Technical Risks**

- **WhatsApp API Restrictions:** Build Email/SMS fallbacks  
- **AI Message Quality:** Human review in early stages  
- **Privacy Concerns:** Clear opt-in, transparent data usage

### **Business Risks**

- **User Habit Formation:** Daily nudges, streak mechanics  
- **Competition from CRMs:** Focus on individual simplicity  
- **Contact Import Friction:** One-click import, NFC advantage

### **Mitigation Strategy**

1. Start with power users who feel the pain most  
2. Build viral mechanics early (crowdsourcing)  
3. Focus on time-to-value (\<5 minutes)  
4. Leverage existing NFC ring user base

---

## **Conclusion**

NoOn's evolution from digital business card to Personal CRM represents a 10x value increase for users and shifts the business model from one-time hardware sales to recurring SaaS with network effects.

**The Ask:** 6-month development timeline, 6-8-person team

**The Return:** 5-6 figure ARR potential in Year 1, category-defining position in Personal CRM space  
---

## **Appendix: Investment Analysis**

### **The Opportunity Cost of Waiting**

**Every month of delay costs:**

1. Lost MRR due to lack of users  
2. 500+ users captured by emerging competitors (Dex, Clay, Folk)  
3. Market position as Personal CRM category crystallizes in 2025  
4. Acquisition window closing as LinkedIn/Salesforce build similar features

---

### **Payment Structure (Revised)**

#### **Option A: Success-Aligned Sprint Model**

**Fixed scope with milestone gates**

- **Phase 1:** SGD $18,000 (prove concept with 100 users)  
  - Stop here if not working \- minimal risk  
- **Phase 2:** SGD $18,000  
  - Viral mechanics must show 10x user growth  
- **Phase 3:** SGD $18,000  
  - 50% DAU proves stickiness  
- **Phase 4:** SGD $18,000  
  - Expansion.

**Total: SGD $72,000 if all milestones hit**

**Sprint Model Constraints:**

- **Scope locked:** Must define all features upfront for each phase  
- **Change requests:** Require contract amendments  
- **Learning limitations:** Can't pivot easily based on user feedback mid-sprint  
- **Discovery risk:** If requirements are unclear, may build wrong features

#### **Option B: Monthly Partnership Model (RECOMMENDED)**

**Best value for iterative product development**

- **SGD $8,500/month** with 6-month minimum commitment  
- **Total: SGD $68,000** for initial 8 months  
- **More development time:** \~22 working days/month vs 20 days per 2 sprints  
- **Flexibility:** Adjust priorities based on user feedback without contract changes

**True Cost Comparison:**

- **Sprint-based:** SGD $72,000 for 160 development days (16 sprints × 10 days)  
  - **Cost per day:** SGD $450  
- **Monthly model:** SGD $68,000 for 176 development days (8 months × 22 days)  
  - **Cost per day:** SGD $386

    
**You get:**

- 16 extra development days (10% more work)  
- SGD $4,000 absolute savings  
- 14% **lower daily rate** ($386 vs $450)  
- **Plus flexibility** to pivot based on learnings

**Why this is ideal for NoOn:**

- Current product needs iteration \= requirements will evolve  
- No scope lock-in \= pivot based on user feedback without contract changes  
- Can stop after 6 months if needed (SGD $51,000 total)  
- Can extend month-by-month based on results

---

### **Competitive Reality Check**

| Competitor | Funding | Valuation | Their Weakness | Our Advantage |
| :---- | :---- | :---- | :---- | :---- |
| Dex | $1.3M | $10M+ | Complex, tech-heavy | NoOn's simplicity \+ NFC entry |
| Clay | $8M | $50M+ | Enterprise focus | Personal use case focus |
| Folk | $3.5M | $25M+ | European market | Asia-Pacific opportunity |
| Monica CRM | Bootstrapped | $5M+ | Feature bloat | Focused on relationships only |

**Window:** 6-12 months before a major player dominates Personal CRM

---

### **Risk Mitigation**

**"What if it doesn't work?"**

**Worst Case:** Platform becomes a better contact manager

- Still improves current app (protecting existing revenue)  
- Features can be unbundled and sold separately  
- Technology assets (AI, crowdsourcing) have independent value

**Realistic Case:** Capture very small part of target market

- 3,500 users × $9 \= SGD $31,500/month  
- **SGD $378,000 annual revenue**  
- 500+% ROI even in failure scenario

**Best Case:** Follow Dex/Clay trajectory

- 50,000 users in Year 2  
- Acquisition offers at 10x revenue  
- **SGD $5-10M exit potential**