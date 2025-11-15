# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
```bash
pnpm dev              # Start dev server on port 2000 (configured in vite.config.ts)
```

### Build & Preview
```bash
pnpm build            # TypeScript compilation + Vite build → dist/
pnpm preview          # Preview production build locally
```

### Testing
```bash
pnpm test             # Run Vitest test suite
```
Test setup: `tests/setUpTests.ts` | Environment: jsdom

### Code Quality
```bash
pnpm lint             # Run ESLint for code quality checks
```

### Package Management
- **Package Manager**: pnpm@10.15.1 (specified in package.json)
- Use `pnpm install` for dependencies
- CI/CD uses pnpm@9.12.2 (see .github/workflows/ci-cd.yml)

## Architecture Overview

### Multi-Role Application Structure
This is a **multi-tenant clearance management system** with three distinct user roles, each with isolated routes and layouts:

1. **Admin** (`/admin-side/*`) - System administration, user management
2. **Clearing Officer** (`/clearing-officer/*`) - Process clearances, manage requirements
3. **Enrollment Officer** (`/enrollment/*`) - Student enrollment, course management

### Authentication System Architecture
**Location**: `src/authentication/`

The authentication system uses a **JWT token-based approach** with automatic refresh:

- **AuthContext.tsx** - Main auth provider with login/logout/register logic
- **tokenService.ts** - Manages access tokens in localStorage and handles automatic refresh
  - Stores: `accessToken` and `userData` in localStorage
  - Implements token expiration checking via JWT payload decoding
  - Prevents duplicate refresh requests with promise caching
- **redirectService.ts** - Handles navigation after auth events
- **useAuth.ts** - Hook for consuming auth context

**Key Flow**:
1. Login → Store JWT access token + user data in localStorage
2. Axios interceptors automatically attach Bearer token to requests (except `/auth/*` endpoints)
3. On 401 response → Attempt refresh token request to `/auth/refresh-token`
4. Refresh uses httpOnly cookies for security
5. On refresh failure → Clear tokens and redirect to login

### API Integration
**Base Configuration**: `src/api/axios.ts`
- Base URL from env var: `VITE_API_URL`
- `withCredentials: true` for cookie-based refresh tokens
- All authenticated requests use Bearer token headers

**Interceptor Logic** (in `AuthContext.tsx`):
- Request interceptor: Attach current access token to headers
- Response interceptor: Handle 401 by refreshing token and retrying original request
- Skips refresh for `/auth/*` endpoints to prevent infinite loops

### Routing Architecture
**Main Router**: `src/routes/index.tsx`

**Route Protection Pattern**:
```tsx
<ProtectedRoute allowedRoles={["admin"]}>
  <AdminLayout />
</ProtectedRoute>
```

**Layout Hierarchy**:
- `Layout.tsx` - General public layout
- `AdminLayout.tsx` - Admin dashboard shell (sidebar: `AdminSidebarMenu.tsx`)
- `ClearingOfficerLayout.tsx` - Officer dashboard shell (sidebar: `SidebarMenu.tsx`)
- `EnrollmentLayout.tsx` - Enrollment system shell (sidebar: `EnrollmentSidebarMenu.tsx`)

Each layout wraps an `<Outlet />` for nested routes.

### State Management
**Redux Toolkit** is used for global state:
- Store: `src/store/index.ts`
- Slices: `src/store/slices/clearingOfficer/`
  - `studentSlice.ts`
  - `clearanceSlice.ts`

**AuthContext** handles authentication state separately from Redux.

### UI Component Strategy
This project uses **multiple UI libraries** simultaneously:

1. **Ant Design** - Primary component library for tables, forms, modals
2. **Radix UI** - Accessible primitives (dialogs, dropdowns, tooltips)
3. **Custom shadcn/ui components** - Located in `src/components/ui/`
4. **TailwindCSS** - Utility-first styling

**Path Alias**: `@/*` resolves to `src/*` (configured in tsconfig.json + vite.config.ts)

### Key Application Concepts

**Clearance Process**:
- Students submit clearance requirements to clearing officers
- Officers review and approve/reject submissions
- Upon approval, QR-coded exam permits are generated
- Public route `/permit` allows viewing permits via token query param

**Role-Specific Features**:
- **Admin**: Add students, add clearing officers, view analytics
- **Clearing Officer**: Process clearances, manage requirements, track events
- **Enrollment**: Manage students, courses, semesters, and enrollment records

## Important Implementation Details

### Environment Variables
Required in `.env.local`:
```env
VITE_API_URL=http://localhost:3000  # Backend API base URL
```

### Protected Routes Implementation
**File**: `src/components/ProtectedRoute.tsx`

Checks:
1. Authentication status
2. User object exists
3. Role matches `allowedRoles` array

On failure → Redirect to `/login` or `/unauthorized`

### Guest Routes
**File**: `src/components/GuestRoute.tsx`

Prevents authenticated users from accessing login/register pages.

### Token Storage Strategy
- **Access Token**: localStorage (short-lived, attached to requests)
- **Refresh Token**: httpOnly cookie (long-lived, backend-managed)

This prevents XSS attacks from stealing refresh tokens.

### CI/CD Pipeline
**File**: `.github/workflows/ci-cd.yml`

Workflow:
1. Runs on push/PR to `main`
2. Node 20.x + pnpm installation
3. Build with `pnpm run build`
4. Upload `dist/` artifact

Note: Tests are currently skipped (placeholder in workflow).

## Code Style & Patterns

### Following Cursor Rules
This project includes **`.cursor/rules/agent-coder.mdc`** with these principles:
- Production-grade, clean code with comments
- DRY, KISS, SOLID principles
- Modern, stable technologies (React 19, TypeScript 5.8)
- Security: OWASP best practices, input sanitization
- Clear architecture patterns (see multi-role layout structure above)

### File Naming Conventions
- Components: PascalCase (`Dashboard.tsx`, `ProtectedRoute.tsx`)
- Utilities/services: camelCase (`tokenService.ts`, `redirectService.ts`)
- UI components: kebab-case (`src/components/ui/dropdown-menu.tsx`)

### Import Alias Usage
Always prefer `@/` imports over relative paths:
```tsx
import { useAuth } from "@/authentication/useAuth";  // ✅ Good
import { useAuth } from "../../../authentication/useAuth";  // ❌ Avoid
```

## Common Workflows

### Adding a New Protected Page
1. Create page component in appropriate directory (`admin-side/`, `clearing-officer/`, etc.)
2. Add route in `src/routes/index.tsx` under correct layout
3. Add navigation item to corresponding sidebar component
4. Ensure `ProtectedRoute` wraps parent layout with correct `allowedRoles`

### Working with Authentication
- Use `useAuth()` hook to access: `{ user, role, isAuthenticated, login, logout }`
- Access token automatically attached by interceptors - no manual header management needed
- Logout clears both localStorage and server-side session

### API Request Pattern
```tsx
import axiosInstance from "@/api/axios";

// Token automatically attached by interceptor
const response = await axiosInstance.get("/api/students");
```

### Testing Strategy
- Test files: Adjacent to source with `.test.ts` or `.test.tsx` suffix
- Setup: `tests/setUpTests.ts` configures jsdom and testing library
- Run: `pnpm test`

## Project-Specific Notes

### Multi-Library UI Approach
When adding new UI components:
1. Check if Ant Design has the component first (tables, forms, dates)
2. Use Radix UI for accessible primitives not in Ant Design
3. Extend `src/components/ui/` for custom shadcn-style components
4. Style with TailwindCSS utilities

### Vite Development Server
- Custom port: **2000** (not default 5173)
- Host: `::` (IPv6, allows external access)
- Configured in `vite.config.ts`

### Role-Based Redirects
After login, users are redirected based on role:
- `admin` → `/admin-side`
- `clearingOfficer` → `/clearing-officer`
- Default → `/`

Implemented in `redirectService.ts`.
