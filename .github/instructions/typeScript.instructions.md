---
applyTo: "**/.ts"
---

## TypeScript Instructions

This is a TypeScript project using Next.js 15 with App Router, React Server Components, and TypeScript. The code follows modern React patterns with custom hooks, server-side authentication, and Prisma ORM.

### Key TypeScript Patterns

- use `I` before every custom interface name (e.g., `IUser`, `INote`)
- all the api response should have `Response` suffix (e.g., `IUserResponse`, `INotesResponse`)
- all the API responses should be typed using these interfaces

### Project-Specific Rules

#### Custom Hook Types
- Custom hooks should export typed return objects with descriptive property names
- Use proper TypeScript generics for reusable hooks
- Always type form handlers and event callbacks

#### API Route Types
- Use proper Next.js `NextRequest` and `NextResponse` types
- Define request/response interfaces for all API endpoints
- Use proper HTTP status codes with typed error responses

#### Database Types
- Leverage Prisma generated types (e.g., `User`, `Prisma.UserCreateInput`)
- Create custom interfaces only when extending or transforming Prisma types
- Use Prisma's `$Enums` for enum types from the schema

#### Authentication Types
- Define session interfaces with required fields (`userId`, `username`)
- Type JWT payload interfaces with proper claims
- Use branded types for sensitive data (user IDs, tokens)

### TypeScript Configuration Rules

- Use strict mode with `"strict": true`
- Enable `"noUncheckedIndexedAccess": true` for safer array/object access
- Use `"exactOptionalPropertyTypes": true` for precise optional properties
- Prefer explicit return types for public functions and API routes

## Patterns to Follow

### ✅ Type-Safe Custom Hooks
- Define clear interfaces for hook return values with state and handlers separated
- Use proper TypeScript generics for reusable hooks
- Always type form handlers and event callbacks explicitly
- Return objects with descriptive property names

### ✅ API Route Type Safety
- Define request and response interfaces for all API endpoints
- Use proper Next.js `NextRequest` and `NextResponse` types
- Include optional fields for conditional response data
- Use Promise return types with proper generic typing

### ✅ Database Type Extensions
- Extend Prisma types when adding computed or joined data
- Use `Omit` utility type to exclude fields when creating subset interfaces
- Include count objects for related data aggregations
- Leverage Prisma's generated types as base interfaces

### ✅ Session Type Safety
- Define JWT payload interfaces with all required claims
- Create verified session interfaces for authenticated contexts
- Include expiration and issued-at timestamps
- Separate authentication payload from user session data

### ✅ Form Event Handling
- Use specific React event types for form submissions and input changes
- Always include Promise return types for async handlers
- Prevent default behavior explicitly in event handlers
- Type event parameters with proper generic constraints

## Patterns to Avoid

### ❌ Avoid Any Types
- Never use `any` type for API responses or database queries
- Always create proper interfaces for external data
- Use unknown type instead of any when type is truly unknown
- Leverage TypeScript's strict mode to catch any usage

### ❌ Avoid Non-Null Assertions Without Checks
- Don't use non-null assertion operator without null checks
- Always validate session and user data before accessing properties
- Use optional chaining and nullish coalescing instead
- Throw descriptive errors for missing required data

### ❌ Avoid Implicit Returns in Complex Functions
- Always specify return types for public functions and API routes
- Use explicit return statements in complex authentication logic
- Include null handling in function signatures
- Avoid chained ternary operators in return statements

### ❌ Avoid Untyped Environment Variables
- Always validate environment variables at runtime
- Throw descriptive errors for missing required environment variables
- Create typed configuration objects for environment access
- Use string literal types for known environment values

### ❌ Avoid Generic Error Objects
- Create structured error interfaces with error codes
- Include optional details for debugging information
- Use proper HTTP status codes with typed error responses
- Handle different error types (validation, authentication, server errors)

### ❌ Avoid Mixing Server and Client Types
- Don't pass server-specific types to client components
- Use serializable interfaces for server-to-client data transfer
- Separate server action types from client component props
- Ensure all passed data can be JSON serialized
