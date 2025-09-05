---
applyTo: "**/*.ts,**/*.tsx"
---

# DevNotes Coding Standards for AI Agents

## Project and code guidelines

- Always use TypeScript with strict type hints
- JavaScript/TypeScript should use semicolons
- Use Next.js 15 App Router with server components by default
- JWT authentication via `jose` library stored in HTTP-only cookies
- Always verify sessions on protected routes before rendering
- Use `'use client'` directive only for interactive components
- Follow `app/[feature]/page.tsx` pattern for routes
- Use PascalCase for components, camelCase for functions/variables
- Use `@/` absolute imports from project root
- Use ShadCN/UI components with Tailwind CSS
- Use Prisma ORM with PostgreSQL database
- Wrap database operations in try-catch blocks
- Return consistent error responses with proper HTTP status codes
- Always follow good security practices
- Follow RESTful API design principles
- Use scripts to perform actions when available
