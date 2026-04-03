---
name: repository-standards
description: Repository-specific coding standards, conventions, and architectural patterns learned from codebase
type: reference
last_updated: 2026-04-03
---

# Repository Standards

This file captures conventions and patterns specific to this repository, learned from analyzing commit history and existing code structure. The agent uses this to enforce consistency with the existing codebase.

## Code Organization

### File Naming Convention
**Observed pattern:** `kebab-case` for filenames, e.g., `user-controller.ts`, `email-service.ts`  
**Applies to:** All TypeScript/JavaScript files  
**How to enforce:** Flag new files using `PascalCase.ts` or `snake_case.ts`

### Directory Structure
**Pattern:** Feature-based organization under `src/`
```
src/
├── controllers/  # HTTP request handlers
├── services/     # Business logic
├── models/       # Data models
├── utils/        # Pure functions
└── middleware/   # Express middleware
```
**How to enforce:** New feature files should follow this structure; flag PRs creating new top-level directories without discussion

### Test File Placement
**Pattern:** Tests co-located with source, e.g., `user-service.ts` → `user-service.test.ts`  
**How to enforce:** Flag PRs adding source files without corresponding `.test.ts` in same directory

## Coding Conventions

### Function Naming
**Pattern:** Async functions prefixed with verb + noun, e.g., `getUserById()`, `sendEmail()`  
**How to enforce:** Flag async functions with unclear names like `process()`, `handle()`, `doThing()`

### Error Handling
**Pattern:** All async operations wrapped in try-catch with structured error logging
```typescript
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', { operation: 'riskyOperation', error });
  throw new ServiceError('Failed to...', { cause: error });
}
```
**How to enforce:** Flag async functions without try-catch or with generic catch blocks

### Type Safety
**Pattern:** Strict TypeScript with no `any` types except in test mocks  
**How to enforce:** Request changes for new code introducing `any` (excluding `*.test.ts`)

## API Conventions

### Endpoint Naming
**Pattern:** RESTful resource naming with plural nouns
- `GET /api/users` - list users
- `POST /api/users` - create user
- `GET /api/users/:id` - get user
- `PUT /api/users/:id` - update user
- `DELETE /api/users/:id` - delete user

**How to enforce:** Flag non-RESTful endpoints like `/api/getUsers`, `/api/user-list`

### Response Format
**Pattern:** Consistent JSON structure
```json
{
  "success": true,
  "data": { ... },
  "meta": { "timestamp": "...", "requestId": "..." }
}
```
**How to enforce:** Check that new endpoints return responses matching this shape

### Error Response Format
**Pattern:** RFC 9457 Problem Details
```json
{
  "type": "https://api.example.com/errors/validation",
  "title": "Validation Failed",
  "status": 400,
  "detail": "Email format is invalid",
  "instance": "/api/users",
  "requestId": "abc-123"
}
```
**How to enforce:** Flag error handlers not using standard error response utility

## Database Patterns

### Query Style
**Pattern:** All queries use ORM (Prisma) or parameterized SQL via query builder  
**Never:** String concatenation in queries  
**How to enforce:** Auto-reject template literals in SQL strings

### Migration Pattern
**Pattern:** Migrations named with timestamp and description: `20260403120000_add_user_email_index.sql`  
**How to enforce:** Check migration files follow naming convention

### Transaction Handling
**Pattern:** Explicit transactions for multi-step operations
```typescript
await prisma.$transaction(async (tx) => {
  await tx.user.create(...);
  await tx.audit.create(...);
});
```
**How to enforce:** Flag multi-step database operations without transaction wrapper

## Security Patterns

### Authentication
**Pattern:** JWT tokens stored in HTTP-only cookies, validated via middleware  
**Never:** Tokens in localStorage or URL params  
**How to enforce:** Flag any `localStorage.setItem('token')` or `?token=` query params

### Authorization
**Pattern:** Role checks via decorators/middleware, never inline in handlers
```typescript
@RequireRole('admin')
async deleteUser() { ... }
```
**How to enforce:** Flag inline permission checks in controller methods

### Input Validation
**Pattern:** Validation at controller boundary using Zod schemas  
**How to enforce:** New endpoints must have corresponding schema validation

## Testing Patterns

### Test Structure
**Pattern:** AAA (Arrange, Act, Assert) with descriptive test names
```typescript
describe('UserService.createUser', () => {
  it('should create user with hashed password', async () => {
    // Arrange
    const userData = { email: 'test@example.com', password: 'Pass123!' };
    
    // Act
    const user = await service.createUser(userData);
    
    // Assert
    expect(user.password).not.toBe('Pass123!');
    expect(user.email).toBe('test@example.com');
  });
});
```

### Test Coverage Requirements
- Unit tests: 80% minimum line coverage
- Integration tests required for: auth, payment processing, data exports
- E2E tests required for: critical user flows (signup, checkout)

**How to enforce:** Flag PRs that reduce coverage below 80% or add critical code without integration tests

## Commit Standards

### Commit Message Format
**Pattern:** Conventional Commits with scope
```
type(scope): description

feat(auth): add OAuth2 provider support
fix(api): handle null email in user creation
docs(readme): update installation instructions
```

### Commit Scope
**Scopes in use:** auth, api, db, ui, docs, test, config  
**How to enforce:** Suggest appropriate scope if PR commits lack it

---

## How Standards Are Learned

This file is populated by:

1. **Git history analysis** - Common patterns in existing commits
2. **Code structure analysis** - Directory and file organization
3. **PR reviews** - Repeated feedback becomes codified standard
4. **Explicit decisions** - Team discussions captured in past PRs

When the agent detects a new pattern violation (3+ times), it should suggest adding it to this file.

## Self-Improving Mechanism

When the agent finds an issue not covered by existing standards:

1. **First occurrence** - Note in review as observation
2. **Second occurrence** - Mention inconsistency with past PR
3. **Third occurrence** - Propose adding to `repository-standards.md` via PR

This allows standards to evolve with the team rather than being static.
