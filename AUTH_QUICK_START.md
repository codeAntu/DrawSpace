# Authentication Quick Reference

## 🎯 **Best Practice: HTTP-Only Cookies** ✅

Your authentication is now set up using **HTTP-only cookies** - the most secure method for web applications.

## What Was Implemented

### Backend (Express)

- ✅ JWT tokens stored in HTTP-only cookies
- ✅ CORS enabled with credentials support
- ✅ Auth middleware supporting both cookies and headers
- ✅ Endpoints: `/signup`, `/login`, `/logout`, `/me`

### Frontend (Next.js)

- ✅ API route proxies for auth operations
- ✅ AuthContext for global auth state
- ✅ Middleware for route protection
- ✅ Updated login/signup forms

## Key Files Created/Modified

```
apps/
  http-backend/
    src/
      ✏️ index.ts (added cookie support)
      ✏️ middleware.ts (updated to read cookies)

  web/
    app/
      api/auth/
        ✨ login/route.ts
        ✨ signup/route.ts
        ✨ logout/route.ts
        ✨ me/route.ts
      contexts/
        ✨ AuthContext.tsx
      components/
        ✏️ auth.tsx (connected to API)
      ✏️ layout.tsx (added AuthProvider)
      ✏️ page.tsx (example usage)
    ✨ middleware.ts (route protection)
    ✨ .env.example

AUTHENTICATION.md (full documentation)
```

## Quick Start

1. **Set up environment variables:**

   ```bash
   # Backend (.env)
   JWT_SECRET=your-secret-key
   FRONTEND_URL=http://localhost:3000

   # Frontend (.env.local)
   BACKEND_URL=http://localhost:3001
   ```

2. **Start both servers:**

   ```bash
   # Terminal 1 - Backend
   cd apps/http-backend && bun run src/index.ts

   # Terminal 2 - Frontend
   cd apps/web && bun run dev
   ```

3. **Test it:**
   - Go to http://localhost:3000
   - You'll be redirected to /login
   - Sign up or login
   - Cookie is automatically set and managed

## Using Auth in Your Code

```tsx
"use client";
import { useAuth } from "@/app/contexts/AuthContext";

export default function MyPage() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <h1>Welcome {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Why HTTP-Only Cookies?

| Method                   | Security              | SSR Support | Complexity |
| ------------------------ | --------------------- | ----------- | ---------- |
| **HTTP-Only Cookies** ✅ | ⭐⭐⭐⭐⭐            | ✅ Yes      | Medium     |
| localStorage             | ⭐⭐ (XSS vulnerable) | ❌ No       | Easy       |
| Session Storage          | ⭐⭐ (XSS vulnerable) | ❌ No       | Easy       |

## Important Security Notes

⚠️ **Before Production:**

1. Add password hashing (bcrypt)
2. Use HTTPS (required for secure cookies)
3. Use a strong JWT secret
4. Implement rate limiting
5. Add CSRF protection

## Common Issues

**Cookies not being set?**

- Check CORS is enabled with `credentials: true`
- Verify `credentials: "include"` in fetch requests
- Check browser cookies in DevTools

**Authentication not persisting?**

- Verify JWT_SECRET is set
- Check cookie expiration
- Ensure cookie name matches ("auth_token")

## Next Steps

- [ ] Add bcrypt for password hashing
- [ ] Set up refresh tokens
- [ ] Add email verification
- [ ] Implement OAuth (Google, GitHub)

---

📖 See **AUTHENTICATION.md** for complete documentation
