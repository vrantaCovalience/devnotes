# DevNotes - Next.js Authentication & Note-Taking App

## Architecture Overview

**DevNotes** is a modern Next.js 15 authentication boilerplate designed for rapid development of note-taking applications with GitHub Copilot.

**For complete project architecture, mandatory requirements, and development patterns, see `core_principles.instructions.md`.**

## AI Agent Guidance: Document-First Approach

**Always use the Context 7 MCP server to fetch up-to-date documentation for all libraries and frameworks in this project (e.g., Next.js, Prisma, Tailwind CSS, shadcn/ui, jose, bcryptjs, etc).**

- Before generating or editing code, retrieve and consult the official documentation for the relevant library or API using the Context 7 MCP server.
- Prioritize solutions and code patterns that are directly supported and recommended by the official docs.
- If a user request is ambiguous, clarify which library or API is intended and fetch its documentation before proceeding.
- When in doubt, cite the documentation source or link to the relevant section.

**This document-first workflow ensures all code and suggestions are accurate, idiomatic, and up-to-date with the latest best practices.**

## Custom Hook Pattern for Component Logic

**Always extract all logic from a component into a custom React hook. Exclude components with no logic or very minimal logic and skip components under `components/ui`**

- For every component with logic, create a custom hook (e.g., `useLoginForm`) in the same folder as the component.
- The component file (`.tsx`) should contain only JSX and UI composition, calling the custom hook to get all state, handlers, and data.
- The custom hook file (`useLoginForm.ts`) should export a function returning all necessary state and logic for the component.
- This pattern improves testability, reusability, and separation of concerns.

**Example folder structure:**

```
app/login-form/
  LoginForm.tsx        # JSX/UI only, calls useLoginForm
  useLoginForm.ts      # All state, handlers, and logic
```

**Example usage:**

```tsx
// LoginForm.tsx
import { useLoginForm } from './useLoginForm'

export function LoginForm() {
  const { username, password, error, isLoading, handleChange, handleSubmit } = useLoginForm()
  // ...JSX using these values/handlers...
}
```

```ts
// useLoginForm.ts
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function useLoginForm() {
  // ...all state and logic here...
  return { username, password, error, isLoading, handleChange, handleSubmit }
}
```

**Apply this pattern to all new and refactored components with logic.**

## Development Workflow Commands

```bash
# Database & Development
npm run docker:up        # Start PostgreSQL container
npm run db:push         # Apply Prisma schema changes  
npm run db:seed         # Create demo user (alice/password123)
npm run dev            # Start Next.js dev server

# Production
npm run build          # Build for production
npm run start          # Start production server
```

## Implementation Examples

### Protected Routes Pattern
```typescript
// Standard pattern for protected pages
export default async function ProtectedPage() {
  const session = await verifySession()
  if (!session) redirect('/login')
  
  return <div>Protected content for {session.username}</div>
}
```

### API Route Authentication
```typescript
// Standard pattern for protected API routes
import { verifySession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await verifySession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // Handle authenticated request
}
```

## Environment Configuration
- **Development**: Uses docker-compose PostgreSQL with default credentials
- **Required Variables**: `DATABASE_URL`, `JWT_SECRET`
- **Database URL**: `postgresql://devnotes:devnotes@localhost:5432/devnotes`

## Future Extension Points

Based on `docs/DEVELOPMENT_ROADMAP.md`, the next development phase includes:

1. **Notes CRUD**: Extend Prisma schema with `Note` model linked to users
2. **Dashboard Enhancement**: Transform basic dashboard into notes listing with search/filters  
3. **Note Editor**: Rich text editing with auto-save functionality
4. **Theme System**: Dark/light mode with next-themes integration
5. **Note Management**: Categories, tags, bulk operations, archive functionality

When implementing these features, maintain the established patterns of server-side session verification, centralized error handling, and shadcn/ui component usage.