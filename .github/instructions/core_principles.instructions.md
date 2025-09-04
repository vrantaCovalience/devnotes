---
applyTo: "**"
---

# DevNotes Project Overview

- **Framework:** Next.js 15 with App Router, React Server Components, and TypeScript
- **Database:** PostgreSQL with Prisma ORM for type-safe database operations
- **Authentication:** JWT-based session management with HTTP-only cookies
- **UI Framework:** Tailwind CSS + shadcn/ui components (Radix UI primitives)
- **Development Environment:** Docker Compose for PostgreSQL container

## Directory Structure

- `app/` — Next.js App Router pages and API routes
  - `api/auth/` — Authentication endpoints (login, logout, verify)
  - `api/notes/` — Notes CRUD API endpoints
  - `dashboard/` — Protected dashboard with notes management
  - `login/` — Public login flow and form components
- `components/ui/` — shadcn/ui reusable components
- `lib/` — Core utilities (auth, database, utils)
- `prisma/` — Database schema and seeding scripts
- `docs/` — Project documentation and roadmaps

## Architecture Requirements

### **MANDATORY Core Patterns**

- **MANDATORY**: Use custom hook pattern for all component logic (extract logic to `useComponentName.ts`)
- **MANDATORY**: Server-side session verification for all protected routes and API endpoints
- **MANDATORY**: Prisma ORM for all database operations with proper type safety
- **MANDATORY**: Document-first approach using Context 7 MCP server for library documentation
- **MANDATORY**: Always prefer React Server Components over Client Components. Use server-side rendering as much as possible. Split components so that client code is minimized in any page or feature. Only use Client Components when absolutely necessary (e.g., for interactivity or browser APIs).

### **MANDATORY Authentication Requirements**

- **MANDATORY**: JWT tokens stored in HTTP-only cookies for security
- **MANDATORY**: Session verification using `verifySession()` from `lib/auth.ts`
- **MANDATORY**: Redirect unauthenticated users to `/login`
- **MANDATORY**: Protect all API routes with session verification

### **MANDATORY Database Requirements**

- **MANDATORY**: Use Prisma client singleton from `lib/db.ts`
- **MANDATORY**: Leverage Prisma generated types (User, Note, Prisma.UserCreateInput)
- **MANDATORY**: Proper error handling for database operations
- **MANDATORY**: Use transactions for complex multi-table operations

### **MANDATORY UI/UX Requirements**

- **MANDATORY**: shadcn/ui components only (no custom component libraries)
- **MANDATORY**: Tailwind CSS for styling with design system consistency
- **MANDATORY**: Responsive design with mobile-first approach
- **MANDATORY**: Loading states and error handling for all async operations

## Development Workflow Requirements

### Environment Setup
- Docker Compose for local PostgreSQL development
- Prisma schema migrations and seeding
- Environment variables validation at startup

### Code Quality Standards
- TypeScript strict mode enabled
- Proper error boundaries and error handling
- Consistent file naming conventions
- Custom hook pattern for component logic separation

### Security Requirements
- HTTP-only cookies for authentication tokens
- Server-side session validation
- Input validation and sanitization
- Secure password hashing with bcrypt

## Patterns to Follow

### ✅ Component Architecture
- Extract all logic to custom hooks (e.g., `useLoginForm.ts`)
- Keep components focused on JSX and UI composition only
- Use proper TypeScript interfaces for props and state
- Implement proper loading and error states

### ✅ Authentication Flow
- Always verify session on server-side for protected routes
- Use `verifySession()` function consistently across the application
- Implement proper logout with cookie clearing
- Handle authentication errors gracefully with redirects

### ✅ Database Operations
- Use Prisma client for all database interactions
- Implement proper error handling for database failures
- Use Prisma transactions for multi-step operations
- Leverage Prisma's type safety and generated types

### ✅ API Route Design
- Implement proper HTTP status codes and error responses
- Use TypeScript interfaces for request/response types
- Include session verification for protected endpoints
- Return consistent error message formats

### ✅ State Management
- Use React's built-in state management (useState, useEffect)
- Custom hooks for complex state logic
- Server-side data fetching with proper caching
- Avoid client-side global state unless absolutely necessary

## Patterns to Avoid

### ❌ Authentication Anti-Patterns
- Never store JWT tokens in localStorage or sessionStorage
- Don't skip server-side session verification
- Avoid client-side only authentication checks
- Don't expose sensitive user data in client components

### ❌ Database Anti-Patterns
- Never use raw SQL queries instead of Prisma
- Don't skip error handling for database operations
- Avoid N+1 queries without proper includes/selects
- Don't bypass Prisma's type safety with any types

### ❌ Component Anti-Patterns
- Don't mix business logic with UI components
- Avoid creating components without proper TypeScript types
- Don't skip loading states for async operations
- Avoid inline styles instead of Tailwind classes

### ❌ API Route Anti-Patterns
- Don't return inconsistent response formats
- Avoid skipping input validation and sanitization
- Don't expose internal error details to clients
- Avoid using GET requests for data mutations

### ❌ Performance Anti-Patterns
- Don't skip React Server Components where appropriate
- Avoid unnecessary client-side JavaScript
- Don't ignore proper caching strategies
- Avoid blocking the main thread with heavy computations

## File Organization Standards

### Naming Conventions
- Use kebab-case for file and directory names
- Custom hooks: `useComponentName.ts`
- Components: `ComponentName.tsx`
- API routes: `route.ts` in appropriate directory
- Utilities: descriptive names in `lib/` directory

### Import Organization
- External libraries first
- Internal utilities and types
- Components and hooks
- Relative imports last
- Use path aliases (`@/lib`, `@/components`)

### Code Structure Standards
- Single responsibility principle for functions and components
- Consistent error handling patterns
- Proper TypeScript typing for all functions and variables
- Clear separation between server and client code
