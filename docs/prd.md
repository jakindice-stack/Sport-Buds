# Product Requirements Document (PRD)
## Sport Buds – MVP Web Application

---

### 1. Project Overview
Sport Buds is a mobile-first web app designed to connect student athletes and local sports enthusiasts with nearby sports events, practices, and tournaments. The app makes it easier for users to discover, host, and join activities that match their sport, skill level, and schedule.  
This project will be developed using Windsurf for structured workspace management and GitHub for version control. The MVP focuses on core event and participation features that build the foundation for later iterations.

---

### 2. Goals and Objectives
- Connect students and local athletes through shared sports events.  
- Simplify the process of finding and joining nearby games and practices.  
- Build trust and safety with host reliability ratings and event reporting.  
- Support inclusivity by welcoming users of all skill levels.  
- Establish a clean technical foundation for future iterations.

---

### 3. Key Features (MVP Scope)
Each feature is based on the Analyst’s approved user stories.

| # | Feature | Description | Acceptance Criteria |
|---|----------|--------------|----------------------|
| 1 | Create Sports Event | Hosts can create new events by entering name, time, location, and skill level. | Event saves and displays on map. |
| 2 | Filter by Sport | Users can view only events for their preferred sport. | Filter updates map and list correctly. |
| 3 | Map-Based Discovery | Events appear on an interactive map using location permissions. | Map loads nearby events successfully. |
| 4 | RSVP System | Users can RSVP to an event with one click. | RSVP confirmation updates instantly. |
| 5 | Host RSVP Tracking | Hosts can view total RSVPs for their event. | Host dashboard shows live attendee count. |
| 6 | Profile Creation | Users can create profiles showing sports and skill levels. | Profile data saves and displays properly. |
| 7 | Event Reporting | Users can flag unsafe or inappropriate events. | Reports submit and are logged in the database. |
| 8 | Host Reliability Rating | Participants can rate hosts after events. | Ratings average and update automatically. |

---

### 4. Out of Scope
To keep MVP realistic, the following features are deferred for later versions:
- Messaging or following users.  
- Payment processing or ticketing.  
- Push notifications or live GPS tracking.  
- Attendance analytics or participation history.  
- External fitness or social app integrations.

---

### 5. Technical Architecture
**Front-End:** React (Vite)  
**Back-End:** Node.js (Express)  
**Database:** Supabase (PostgreSQL)  
**Version Control:** GitHub  
**Development Environment:** Windsurf  

**Directory Structure:**
```bash
/client/        # React PWA (local dev: Vite)
/api/           # Express API (local dev: Node)
/supabase/      # SQL migrations + seeds
/docs/          # PRD, site map, OpenAPI, deployment notes
README.md

.gitignore must include: node_modules/, .env, .DS_Store, build artifacts
