# Authentication Implementation Guide

## Overview

This application now uses a secure, in-memory token storage system with automatic token refresh and persistent sessions.

## Key Features

### 1. **In-Memory Token Storage**

- Access tokens are stored in memory (not localStorage) for enhanced security
- Refresh tokens are stored in httpOnly cookies (managed by backend)
- Tokens are automatically cleared on logout or expiry

### 2. **Automatic Token Refresh**

- Tokens are automatically refreshed 30 seconds before expiry
- Silent refresh happens in the background without user interaction
- If refresh fails (refresh token expired), user is redirected to login

### 3. **Persistent Sessions**

- Sessions persist across page refreshes using refresh tokens
- On app load, the system automatically attempts to restore the session
- Loading state is shown while checking authentication

## How It Works

### Login Flow

1. User enters credentials
2. Backend validates and returns:
   - Access token (short-lived, ~15 minutes)
   - Refresh token (httpOnly cookie, longer-lived)
3. Access token is stored in memory
4. Automatic refresh timer is set up

### Token Refresh Flow

1. When access token is about to expire (or has expired)
2. System automatically calls `/auth/refresh-token` endpoint
3. Backend validates refresh token from httpOnly cookie
4. If valid, returns new access token
5. If invalid/expired, redirects to login

### Request Flow

1. Every API request includes the access token in Authorization header
2. If request returns 401 (unauthorized):
   - System attempts to refresh the token
   - Retries the original request with new token
   - If refresh fails, redirects to login

## Usage Examples

### Protected Routes

```tsx
// Routes that require authentication
<ProtectedRoute allowedRoles={["admin"]}>
  <AdminDashboard />
</ProtectedRoute>
```

### Guest Routes

```tsx
// Routes only for non-authenticated users
<GuestRoute>
  <LoginPage />
</GuestRoute>
```

### Using Authentication in Components

```tsx
import { useAuth } from "@/authentication/useAuth";

function MyComponent() {
  const { isAuthenticated, role, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Role: {role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```tsx
import axiosInstance from "@/api/axios";

// The axios instance automatically includes the token
const fetchData = async () => {
  const response = await axiosInstance.get("/api/data");
  return response.data;
};
```

## Security Benefits

1. **No tokens in localStorage** - Prevents XSS attacks from stealing tokens
2. **HttpOnly cookies for refresh tokens** - Prevents JavaScript access to refresh tokens
3. **Short-lived access tokens** - Limits exposure if token is compromised
4. **Automatic token rotation** - Regular token refresh reduces risk
5. **Secure logout** - Clears all tokens and invalidates session on backend

## Backend Requirements

Your backend should implement:

1. **POST /auth/login**

   - Returns: `{ accessToken, user: { role } }`
   - Sets httpOnly cookie with refresh token

2. **POST /auth/refresh-token**

   - Reads refresh token from httpOnly cookie
   - Returns: `{ accessToken, user: { role } }`
   - Returns 401 if refresh token is invalid/expired

3. **POST /auth/logout**
   - Clears refresh token cookie
   - Invalidates refresh token in database

## Environment Variables

Make sure to set:

```env
VITE_API_URL=http://your-backend-url
```

## Troubleshooting

### Session not persisting after refresh

- Check if backend is setting httpOnly cookie correctly
- Verify CORS settings allow credentials

### Getting logged out frequently

- Check access token expiry time (should be at least 5 minutes)
- Verify refresh endpoint is working correctly

### Infinite redirect loops

- Ensure auth endpoints are excluded from token injection
- Check that refresh token endpoint doesn't require access token

## Migration Notes

If migrating from localStorage-based auth:

1. Clear all localStorage tokens
2. Users will need to login again
3. Update any code that directly accesses localStorage for tokens
4. Use the `useAuth` hook instead
