# Todo App Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### I. Full-Stack Approach
Modern web application with clear separation of concerns between frontend and backend; Both components must be independently deployable, tested, and documented; Clear API contracts defined between layers.

### II. User Isolation
Each authenticated user can only access their own data; Proper authentication and authorization checks implemented at all levels; Data privacy and security as non-negotiable requirements.

### III. Test-First (NON-NEGOTIABLE)
TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced for all features.

### IV. Authentication-First
Security implemented from day one with JWT-based authentication; All endpoints protected by default; Proper token validation and refresh mechanisms in place.

### V. Performance & Simplicity
Fast loading times with optimized database queries; Minimal dependencies; Start simple, YAGNI principles applied; Progressive enhancement where possible.

### VI. API-First Design


Well-defined RESTful API contracts that support both web and potential mobile clients; Versioning strategy implemented early; Consistent error handling and response formats.

## Technology Stack Requirements
Next.js 14+ for frontend with App Router, FastAPI for backend, Neon Serverless PostgreSQL for database, Better Auth for authentication, Tailwind CSS for styling.

## Development Workflow
Feature branches from main, PR reviews required, automated tests must pass, security scanning included; Code review checklist includes authentication checks, database query optimization, and accessibility considerations.

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

Constitution supersedes all other practices; All PRs must verify authentication/authorization compliance; Complexity must be justified with performance benchmarks; Use CLAUDE.md for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-01-31 | **Last Amended**: 2026-01-31
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->
