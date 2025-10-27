# Task List

This document breaks down the Analyst’s final user stories into actionable development tasks.

---

## 🏀 Feature: Event Creation
**User Story:**  
As an event host, I want to create a sports event so others can join.

**Tasks:**
- Design "Create Event" form (inputs for type, time, skill level)
- Build form validation and submission to backend
- Display confirmation modal after successful creation

**Acceptance Criteria:**
- Form successfully creates an event stored in database
- Required fields cannot be empty
- Confirmation message appears on submit

---

## 🗺️ Feature: Event Discovery
**User Story:**  
As a student-athlete, I want to see nearby events on a map.

**Tasks:**
- Integrate Google Maps API
- Add event markers by location and sport type
- Implement filters (sport, skill level)

**Acceptance Criteria:**
- Map loads with accurate event markers
- Filters dynamically update visible events

---

## 👤 Feature: Profiles
**User Story:**  
As a student-athlete, I want to create a profile with sports and skill level.

**Tasks:**
- Build profile creation form
- Store data in user database
- Display user’s events and skill info

**Acceptance Criteria:**
- User data persists in database
- Profile displays correctly after saving
