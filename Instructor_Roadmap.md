# 🧑‍🏫 Instructor-Focused Roadmap

## Workshop Theme
Using GitHub Copilot + Context7 MCP to build and extend a **Note-Taking App** while teaching debugging, context management, and AI-assisted workflows.

---

## Phase 1: Warm-Up with Copilot Ask Mode
1. **Resolve TypeScript Issue**
   - Demo: open `login/page.tsx`, trigger an error.
   - Use **Ask Mode** to debug + explain fix.
   - Pause: let participants try.
   - Teaching point: Copilot can teach, not just code.

2. **Custom Hook for API Calling**
   - Ask Mode for explanation + generation.
   - Show cleaner error handling without repetitive try/catch.

---

## Phase 2: Project Context Setup
3. **Create `instructions.md`**
   - Demo generating project-level instructions in VS Code.
   - Explain how this reduces Copilot’s “cold start.”
   - Explain how anyone can create those and what to think when creating those files. 

4. **Agent Mode – Database + API**
   - Use Agent Mode to build:
     - **Task 1:** Prisma Notes model.
     - **Task 2:** Basic Notes API.
   - Q&A: highlight multi-file development workflow.

5. **Coding Standards Instructions**
   - Create `coding-standard.instruction`.
   - Refine `instructions.md` with folder structure + docs lookup guide.

6. **Introduce Context7 MCP**
   - Explain MCP & benefits.
   - Demo enabling Context7 MCP.
   - Show how it keeps Copilot consistent across files.

---

## Phase 3: Feature Development with Agent Mode
7. **Dashboard – First Step Only**
   - Agent Mode creates **dashboard page** showing all notes.
   - Intentionally keep it minimal.

8. **Docs Generation**
   - Use Agent Mode to create a `docs/` folder.
   - Generate technical documentation for implemented features.

9. **Custom Chatbot Planning**
   - Build a chatbot to **plan remaining dashboard features** (search, filters, pagination).
   - Demo: chatbot suggests steps.

10. **Implement Next Features via Agent Mode**
   - Follow chatbot’s steps to implement:
     - **Note Creation**
     - **Note Editing**
     - **Note Management**

---

## Phase 4: Closing & Best Practices
11. **Review & Refactor**
   - Use Copilot Review + Refactor on `login/page.tsx` or `dashboard/page.tsx`.
   - Show improvements in code quality + readability.
   - Wrap-up: “Build → Document → Review → Refactor” cycle.

---

⏱️ **Time Management**:
- Warm-up (1–2): ~20 mins
- Context Setup (3–6): ~40 mins
- Feature Dev (7–10): ~70 mins
- Closing (11): ~20 mins
