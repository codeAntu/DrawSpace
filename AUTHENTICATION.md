# Authentication Setup Guide

## Overview

This project uses **HTTP-only cookies** for authentication, which is the most secure approach for web applications. The authentication flow uses JWT tokens stored in HTTP-only cookies.

## Architecture

- **Backend (Express)**: Handles authentication logic, JWT signing, and cookie management
- **Frontend (Next.js)**: Proxies auth requests through API routes and manages UI state
- **Cookies**: Tokens stored in HTTP-only cookies (not accessible via JavaScript)

## Security Benefits

✅ **XSS Protection**: Cookies are HTTP-only, preventing JavaScript access  
✅ **CSRF Protection**: Using SameSite cookie attribute  
✅ **SSR Support**: Cookies accessible on server-side for authentication  
✅ **Automatic Logout**: Cookies can be cleared server-side

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd apps/http-backend
   ```

2. Create a `.env` file (copy from `.env.example`):

   ```bash
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=your-super-secret-jwt-key-change-this
   DATABASE_URL=your-database-url
   NODE_ENV=development
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

4. Start the backend:
   ```bash
   bun run src/index.ts
   ```

### 2. Frontend Setup

1. Navigate to the web folder:

   ```bash
   cd apps/web
   ```

2. Create a `.env.local` file (copy from `.env.example`):

   ```bash
   BACKEND_URL=http://localhost:3001
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

4. Start the development server:
   ```bash
   bun run dev
   ```

## API Endpoints

### Backend Endpoints (Express)

- `POST /signup` - Create new user account
- `POST /login` - Login and receive auth cookie
- `POST /logout` - Clear auth cookie
- `GET /me` - Get current user info (requires auth)

### Frontend API Routes (Next.js)

- `POST /api/auth/signup` - Proxy to backend signup
- `POST /api/auth/login` - Proxy to backend login
- `POST /api/auth/logout` - Proxy to backend logout
- `GET /api/auth/me` - Proxy to backend user info

## Usage

### In Your Components

```tsx
import { useAuth } from "@/app/contexts/AuthContext";

function MyComponent() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

The middleware (`apps/web/middleware.ts`) automatically:

- Redirects unauthenticated users to `/login`
- Redirects authenticated users away from `/login` and `/signup`

### Making Authenticated Requests

From the frontend, always include `credentials: "include"`:

```typescript
const response = await fetch("/api/some-endpoint", {
  credentials: "include",
});
```

## How It Works

1. **Signup/Login**: User submits credentials → Backend creates JWT → Sets HTTP-only cookie
2. **Authenticated Requests**: Browser automatically sends cookie → Backend validates JWT
3. **User State**: Frontend fetches user info on mount → Stores in React Context
4. **Logout**: Clear cookie → Clear frontend state → Redirect to login

## Security Considerations

### Production Checklist

- [ ] Use strong JWT secret (random, at least 32 characters)
- [ ] Enable HTTPS (required for secure cookies)
- [ ] Set `secure: true` in cookie options
- [ ] Use environment variables for secrets
- [ ] Hash passwords before storing (use bcrypt)
- [ ] Implement rate limiting on auth endpoints
- [ ] Add CSRF tokens for extra protection

### Password Security

**Important**: Currently, passwords are stored in plain text. Before production:

```bash
cd apps/http-backend
bun add bcrypt
bun add -d @types/bcrypt
```

Then update signup/login to hash passwords:

```typescript
import bcrypt from "bcrypt";

// Signup
const hashedPassword = await bcrypt.hash(password, 10);

// Login
const isValid = await bcrypt.compare(password, user.password);
```

## Troubleshooting

### Cookies Not Being Set

- Check CORS configuration (credentials must be enabled)
- Verify `sameSite` and `secure` settings match your environment
- Check browser dev tools → Application → Cookies

### Authentication Not Persisting

- Ensure `credentials: "include"` is in all fetch requests
- Check cookie expiration time
- Verify JWT secret is the same across requests

### Middleware Redirect Loop

- Check that public routes are correctly defined in middleware config
- Verify cookie name matches between backend and frontend

## Alternative Approaches

If you need to use localStorage instead (not recommended):

1. Remove cookie logic from backend
2. Return token in response body
3. Store in localStorage: `localStorage.setItem('token', token)`
4. Send in headers: `Authorization: Bearer ${token}`

**Note**: This is less secure and doesn't work with SSR.

## Next Steps

- [ ] Add password hashing (bcrypt)
- [ ] Implement email verification
- [ ] Add "Remember Me" functionality
- [ ] Set up refresh tokens for better security
- [ ] Add social login (OAuth)
- [ ] Implement 2FA (Two-Factor Authentication)
