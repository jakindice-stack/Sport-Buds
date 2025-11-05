# Workspace Rules
## Sport Buds – Development Standards and Collaboration Guidelines

---

### 1. Purpose
The purpose of this document is to establish professional standards for the Sport Buds project workspace.  
These rules ensure consistent organization, clear communication, version control discipline, and technical quality across all contributors.  
Following these standards will make development more efficient and help maintain a high-quality repository for review and grading.

All project members must follow these rules during the Scaffolding, Implementation, and Iteration phases.  
If working individually, these rules still apply to simulate real-world software collaboration.

---

### 2. Tools and Environment
The Sport Buds MVP will be developed using a set of approved tools designed to maintain a professional workflow.

**Primary Tools:**
- **Windsurf:** Used for local development, project scaffolding, and syncing changes with GitHub.  
- **GitHub:** Repository hosting for all source code, documentation, and commits.  
- **Supabase:** Acts as the database and authentication service for event, RSVP, and profile data.  
- **Vite + React:** Front-end framework for building the responsive user interface.  
- **Node.js + Express:** Backend environment for the RESTful API.  
- **VS Code Extensions (Optional):** Prettier, ESLint, Markdown Preview, and GitLens for clean and trackable code.

**Environment Requirements:**
- Node.js 20.x or higher  
- Stable Wi-Fi or Ethernet connection  
- Supabase account linked to environment variables stored in `.env`  
- GitHub account with access to the public Sport Buds repository  

All contributors are responsible for maintaining working local environments that can push and pull from the GitHub repository without conflicts.

---

### 3. Directory and File Structure
The following directory layout must be maintained throughout the project lifecycle.  
No files should be added or removed without instructor or team approval.


**Guidelines:**
- All documents must use lowercase filenames with hyphens (e.g., `event-card.jsx`, `profile-form.js`).  
- Do not push large files (over 20MB) or any `.env` files.  
- No personal experiments or unrelated files are allowed inside the main repo.  
- Before each push, run a local cleanup to remove temporary test code.

---

### 4. GitHub and Version Control
A clean version control history is essential for tracking development progress.

**Repository Rules:**
- The **main branch** must always remain clean, deployable, and error-free.  
- Work on features using **feature branches** named descriptively (e.g., `feature/create-event`, `fix/map-bug`).  
- **Never push directly to main** — use pull requests (PRs) for all merges.  
- Each commit must represent a logical change. Avoid “bulk dumps” of unrelated updates.

**Commit Message Standards:**
- Use clear, descriptive verbs:  
  - `Add` for new features  
  - `Fix` for bug resolutions  
  - `Update` for changes or improvements  
  - `Remove` for deletions  
- Example:  
  - ✅ `Add RSVP endpoint for event participation`  
  - ✅ `Fix validation issue on profile form`  
  - ❌ `stuff`, `update things`, `final changes`

**Pull Requests:**
- PRs should include a short summary of what was changed and why.  
- At least one peer (if applicable) should review the PR before merging.  
- Tag each PR with its corresponding user story number from the Task List.

---

### 5. Coding Conventions
All developers must maintain a consistent and readable codebase.

**General Guidelines:**
- Use 2-space indentation for all files.  
- Keep line length under 100 characters when possible.  
- Avoid commented-out blocks of unused code — delete them before commits.  
- All variables must use **camelCase** for JavaScript.  
- Components and hooks should use **PascalCase** (e.g., `EventCard.jsx`, `useAuth.js`).  
- Always include prop types or JSDoc comments where necessary.

**React Standards:**
- Use **functional components** with hooks (`useState`, `useEffect`, etc.).  
- Organize components by folder (e.g., `/components/events/`, `/components/users/`).  
- Each component should have a single responsibility.  
- Keep styling modular — use CSS Modules or inline styles scoped to components.  
- Maintain accessibility (alt text for images, aria-labels for inputs).

**Express Standards:**
- Follow RESTful API structure (`GET`, `POST`, `PUT`, `DELETE`).  
- Group routes logically by feature (`events.js`, `profiles.js`).  
- Use middleware for validation and error handling.  
- Always return proper HTTP status codes.  

---

### 6. Documentation and File Naming
Proper documentation helps maintain clarity and accountability.

**Documentation Rules:**
- All project documentation files (`PRD.md`, `TaskList.md`, `WorkspaceRules.md`, and `SiteMap.pdf`) must stay inside the `/docs` folder.  
- Update the documentation after each milestone or major change.  
- Every commit that modifies documentation should use a `docs:` prefix.  
  - Example: `docs: update PRD with feature revisions`.

**File Naming Conventions:**
- JavaScript files: lowercase with hyphens → `event-service.js`  
- React components: PascalCase → `EventForm.jsx`  
- CSS files: lowercase → `styles.css`  
- Image assets: lowercase with underscores → `logo_white.png`  

All filenames must remain consistent across branches to avoid merge conflicts.

---

### 7. Collaboration and Task Ownership
Each team member (or individual developer) is responsible for the timely completion of assigned tasks.

**Workflow Steps:**
1. Select a user story from the Task List.  
2. Create a corresponding branch (e.g., `feature/profile-setup`).  
3. Implement tasks based on listed acceptance criteria.  
4. Push commits daily with clear notes.  
5. Submit a pull request for review.  
6. Once merged, mark the story as “Done” in the Task List.  

If working individually, follow this same pattern to demonstrate simulated collaboration.

**Communication Standards:**
- Use Windsurf comments or GitHub Issues to report blockers.  
- Respond to feedback promptly.  
- Do not overwrite or delete another teammate’s code.  
- Always pull from main before beginning new work to avoid conflicts.

---

### 8. Testing and Quality Assurance
Testing ensures that all Sport Buds features meet MVP acceptance standards.

**Manual Testing Requirements:**
- Each user story must undergo manual testing in the browser.  
- Verify all forms submit correctly and data persists to Supabase.  
- Confirm UI renders consistently across Chrome, Safari, and Firefox.  
- Test on both mobile and desktop breakpoints (min-width: 375px, max-width: 1440px).  
- Record any found issues and fix before merging.

**Checklist Before Merging:**
- [ ] Feature functions as intended  
- [ ] No console errors or warnings  
- [ ] All API calls succeed with correct data  
- [ ] Acceptance criteria satisfied  
- [ ] Documentation updated if needed  

**Error Logging:**
- Use `console.warn()` for minor debugging only during development.  
- Remove all debug logs before committing.  
- If an issue repeats, create a GitHub Issue rather than ignoring it.

---

### 9. Workflow and Task Integration
To maintain alignment between developers and documentation:

- Update the TaskList.md after completing any major feature.  
- Cross-reference the PR number with the user story ID in commit notes.  
- Keep feature branches small and focused (one story per branch).  
- Avoid overlapping edits in the same file between developers.  
- Conduct weekly code reviews to clean and refactor redundant code.

**Daily Routine (Recommended):**
1. Open Windsurf and pull latest main branch.  
2. Work only within your assigned branch.  
3. Commit every few hours with descriptive notes.  
4. Push changes before closing Windsurf for the day.  
5. Review all changes visually using GitHub’s diff view.  

---

### 10. Delivery and Repository Readiness
The repository must be clean, organized, and publicly accessible at submission time.

**Before Submitting:**
- Verify the presence of:
  - README.md  
  - PRD.md  
  - TaskList.md  
  - WorkspaceRules.md  
  - SiteMap.pdf  
- Confirm that the repository’s folder structure matches the PRD specification.  
- Ensure all commits have descriptive messages.  
- Test that cloning and running the project locally works with no missing dependencies.  
- Push the final commit titled `Final MVP Submission`.

**Post-Submission Maintenance:**
- Leave repository public for grading access.  
- Do not modify the main branch after submission unless instructed.  
- If new features are added later, create a new branch labeled `post-submission-updates`.

---

### 11. Professionalism and Conduct
All team members must demonstrate professionalism in communication, collaboration, and documentation.

**Conduct Expectations:**
- Be respectful in all written communication and commit notes.  
- Support teammates by providing constructive feedback during PR reviews.  
- Do not share or reuse this repository outside the assigned course.  
- Take responsibility for mistakes — fix issues promptly and document corrections.  

**Ethical Standards:**
- Do not submit AI-generated code without review or modification.  
- All work must be original or appropriately credited.  
- Use AI (like ChatGPT or Windsurf assist tools) only as a drafting or learning resource, not as a substitute for personal understanding.

---

### 12. Project Quality and Success Criteria
The Sport Buds MVP will be considered successful when:
- All nine selected user stories are completed and functional.  
- The repository includes full documentation and readable commit history.  
- The app runs without critical bugs, crashes, or missing features.  
- The instructor can navigate files clearly to evaluate your structure.  
- All workspace rules have been followed during development.  

A complete project includes organization, clarity, functionality, and evidence of collaboration — not just working code.

---

### ✅ Summary
By following these Workspace Rules, the Sport Buds development environment will remain structured, transparent, and professional.  
These standards support high-quality work, clear communication, and reliable version control.  
Every commit, document, and feature should reflect care, accuracy, and pride in craftsmanship — ensuring that the Sport Buds MVP meets academic and professional expectations.
