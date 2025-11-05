# Task List
## Sport Buds – MVP Development

---

### Overview
This Task List expands all nine approved user stories into actionable development steps. Each includes its own acceptance criteria. All work will be done in Windsurf, committed to GitHub, and synced with Supabase.

---

### 1. Create Sports Event
- Build `events` table with id, title, sport, time, location, skill_level, host_id.
- Create event form in React with input validation.
- Add POST route `/api/events/create` to Supabase.
- Display created events on map after submission.
- **Acceptance:** Event saves to database, displays on map, form validation works.

---

### 2. Filter by Sport
- Add dropdown menu to select a sport type.
- Query Supabase to return events by chosen sport.
- Refresh event markers dynamically when filter changes.
- **Acceptance:** Selecting sport updates map instantly and persists until cleared.

---

### 3. Map-Based Discovery
- Integrate Leaflet.js map with location permissions.
- Load user’s current location as map center.
- Display nearby events with clickable markers.
- **Acceptance:** Map loads, location centers, event popups show correct details.

---

### 4. RSVP to Event
- Build `rsvps` table linking event_id and user_id.
- Create RSVP button and POST `/api/events/:id/rsvp`.
- Prevent duplicate RSVPs and show confirmation.
- **Acceptance:** User can RSVP once, data saves, RSVP count updates instantly.

---

### 5. Host RSVP Tracking
- Add RSVP counter in Host Dashboard.
- Display attendee totals using Supabase query.
- Trigger full alert when event capacity reached.
- **Acceptance:** Totals update in real time and warn when event is full.

---

### 6. Profile Creation
- Create `profiles` table with name, sport, skill_level, photo.
- Build profile page with edit functionality.
- Add API `/api/profile/create` and `/api/profile/update`.
- **Acceptance:** Users can create/edit profiles; data loads correctly from Supabase.

---

### 7. Event Reporting
- Add “Report Event” button to event details popup.
- Create `reports` table for event_id, user_id, and reason.
- Add route `/api/report/create` with modal form.
- **Acceptance:** Reports submit successfully, appear in admin logs, confirmation shown.

---

### 8. Host Reliability Rating
- Add `ratings` table with host_id, rating, comment.
- Create modal to submit host reviews.
- Display average rating on host profile and event card.
- **Acceptance:** Ratings save once per user, averages update correctly.

---

### 9. Integration and QA
- Connect all features with Supabase backend.
- Test CRUD operations for events, RSVPs, profiles, and ratings.
- Fix UI or logic bugs before submission.
- **Acceptance:** No console errors; all acceptance tests pass.

---

### 10. Documentation and Workflow
- Finalize `README.md`, `PRD.md`, and `WorkspaceRules.md`.
- Confirm directory structure matches rubric.
- Push all commits with clear messages.
- **Acceptance:** Repo public, organized, and fully documented.

---

### ✅ Completion Standard
Sport Buds MVP is complete when all user stories function correctly, documentation is uploaded, and Windsurf + GitHub show full sync with no missing tasks or errors.
