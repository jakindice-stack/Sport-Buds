# Workspace Rules

## 💻 Coding Workflow

### Naming Conventions
- Use **camelCase** for variables and functions  
- Use **PascalCase** for React components  
- File names should be **lowercase-with-dashes** (e.g., `event-form.js`)  
- Branch names follow this pattern:  
  `feature/<short-description>` or `fix/<issue>`

### Commit Message Guidelines
- Keep messages short, clear, and in the imperative mood  
  Examples:
  - `Add event creation form`
  - `Fix map filtering bug`
  - `Update profile styling`

### Pull Request & Review Process
1. Open a new **branch** for each feature.  
2. Push changes and open a **Pull Request (PR)** to `main`.  
3. At least one teammate reviews before merging.  
4. Use GitHub comments to discuss changes if needed.  

### Branching Strategy
- **main** — stable, production-ready code  
- **dev** — active development branch  
- **feature/** — individual task branches  
  Example: `feature/event-discovery-map`

🚀 How to Add These
You can add them directly on GitHub:

Go to your repo.

Click Add file → Create new file.

Name it (e.g., Task_List.md) and paste the content.

Commit directly to main.

Repeat for each file.

Or, if you’re in Windsurf:

bash
Copy code
touch Project_Overview.md Technical_Architecture.md Task_List.md Workspace_Rules.md
git add .
git commit -m "Add initial project documentation files"
git push origin main
