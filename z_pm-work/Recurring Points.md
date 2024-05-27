# Recurring Points

Author: Blessing Ojediran @productive

### **The Problem**

Currently, the oss.gg reward system only recognizes one-off contributions. Ongoing work like community management doesn't receive ongoing recognition.

### **The Solution**

Introduce a "Recurring Points" system to reward contributors for sustained efforts.

### **Benefits**

- **Motivates Ongoing Work:** Provides consistent recognition for tasks performed regularly (e.g., weekly community management).
- **Value Long-Term Contributors:** Rewards individuals for their dedicated service to the community.
- **Improves Community Engagement:** Encourages continued participation and fosters a sense of accomplishment.

### User Stories

**User Story 1:** As an assignee (Merci, the community manager), I want to receive recurring points for managing the OSS community every week so that I feel valued for my ongoing contribution.

- My [oss.gg](http://oss.gg) profile should reflect the total points accumulated through recurring rewards.

**User Story 2:** As a project maintainer, I want to define recurring rewards for specific ongoing tasks within my project so that I can incentivise continued contributions like community management or code reviews.

- I should be able to define recurring tasks specific to my project (e.g., "weekly community management post", "monthly code review").
- The system should allow me to assign a point value to each recurring task.
- I should be able to view a list of all defined recurring tasks for my project and edit them as needed.

### **Implementation**

- Define specific tasks eligible for recurring points. These include:
    
    ```html
    - Weekly community management posts 
    - Other periodic / maintenance tasks
    
    Recurring issues cannot have a bounty attached.
    ```
    

- Create a unique label on Github e.g. `recurring` `recurring-weekly`
- Set a reward value for each recurring tasks e.g.  `50 points` .
- Allow modification (admins can define new recurring tasks and point values).

### **Next Steps**

- Finalise list of eligible tasks and point values.
- Design and develop interface to manage recurring rewards.
- Integrate recurring points into the existing oss.gg rewards system.

### **Expected Outcome**

- Increased motivation and engagement for contributors with ongoing responsibilities.
- Improved recognition of valuable contributions to the OSS community.

### Workflow

1. Github issue changes to a recurring issue when a maintainer runs `/recurring` with the following check:
    
    ```html
    Is the issue on the list of eligible tasks? - Should be True
    Does the issue have a bounty attached? - Should be False
    ```
    
2. `recurring` label is applied to issue above.
3. Maintainer assigns issue to a contributor or contributor self assigns themselves.
4. Assignee must log their contributions on Github at least once a week. 
5. Points are awarded after every 7 days of being assigned to the issue with the following checks:
    
    ```html
    - Has assignee has made contributions in the past 7 days? - Should be True
    ```
    
- Points are updated on assignee’s [oss.gg](http://oss.gg) dashboard

---

End.
