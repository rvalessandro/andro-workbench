## **Retrospective**

1. Person  
   1. **Issue:** One liner  
      1. **What I did to help create this situation:** one liner  
      2. **Proposed solution:** one liner  
   2. **Issue:** One liner  
      1. **What I did to help create this situation:** one liner  
      2. **Proposed solution:** one liner  
2. Person  
   1. **Issue:** One liner  
      1. **What I did to help create this situation:** one liner  
      2. **Proposed solution:** one liner  
   2. **Issue:** One liner  
      1. **What I did to help create this situation:** one liner  
      2. **Proposed solution:** one liner

## **Example: Mobile App Feature Launch Delay**

**Context:** You're at a fintech startup. The team committed to launching in-app budgeting tools by Q1 end. It's now mid-Q1, and the feature won't ship on time due to expanding requirements and technical issues.

### **Using the Template:**

1. **Sarah (Product Manager)**  
   1. **Issue:** Budgeting feature will miss Q1 launch by 3 weeks due to 40% scope increase  
      1. **What I did to help create this situation:** Added 4 new requirements after dev started without adjusting timeline  
      2. **Proposed solution:** Ship MVP with core tracking only; remaining features in Q2 update  
   2. **Issue:** Engineers context-switching between budgeting feature and urgent bug fixes \-   
      1. **What I did to help create this situation:** Didn't establish bug triage process; treated all bugs as P0s  
      2. **Proposed solution:** Dedicate 2 engineers to budgeting until launch; rotate 1 engineer for P0 bugs only  
2. **Alex (Senior Engineer)**  
   1. **Issue:** Backend can't handle concurrent budget calculations for \>1000 users  
      1. **What I did to help create this situation:** Didn't load test early; assumed our auth service architecture would work  
      2. **Proposed solution:** Implement queue system this week; scale horizontally if needed by Friday  
   2. **Issue:** Frontend-backend contract changes breaking mobile app weekly  
      1. **What I did to help create this situation:** Skipped API versioning to "move faster"; made breaking changes directly  
      2. **Proposed solution:** Freeze API changes today; implement versioning before next sprint

This format shows how different roles own different aspects of the same problem, with no finger-pointing and clear next steps.

