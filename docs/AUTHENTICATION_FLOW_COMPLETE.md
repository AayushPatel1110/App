# Complete Authentication Flow Implementation

## Overview
Your authentication system now implements the complete OTP → Token → Auto-Refresh → Products flow according to your specification.

---

## 🔐 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE AUTHENTICATION FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

1️⃣ USER ENTERS MOBILE NUMBER
   ↓
   Browser: /auth/login
   Action: Enter mobile + country code
   Stores: otp_context (mobile, country_code) in cookie
   
2️⃣ SEND OTP
   ↓
   POST /otp/send-otp
   Request: { identifier_type, country_code, mobile_number, purpose, via, product_key }
   Response: { success: true }
   
3️⃣ USER ENTERS & SUBMITS OTP
   ↓
   Browser: /auth/otp
   Action: Enter 4-digit OTP
   Payload verified with otp_context cookie
   
4️⃣ OTP VERIFICATION → BACKEND DECISION
   ├─ if first_time_user:
   │  POST /otp/verify-otp
   │  Response: { success: true, is_existing_user: false }
   │  → NO TOKENS YET (user completes profile first)
   │  → Redirect to /auth/complete-profile
   │
   └─ if existing_user:
      POST /otp/verify-otp
      Response:
      {
        success: true,
        is_existing_user: true,
        access_token: "xxx...",
        csrf_token: "yyy...",
        refresh_token (httpOnly cookie)
      }
      
      Backend Actions:
      • Create Session (6 hours lifetime)
      • Generate access_token (15 min)
      • Generate refresh_token (30 days, httpOnly cookie)
      • Generate csrf_token
      
      Frontend Actions:
      ✓ CSRF token → sessionStorage (survives page reload)
      ✓ Access token → authStore + sessionStorage
      ✓ Refresh token → authStore (if returned) + httpOnly cookie (set by backend)
      → Redirect to /dashboard
      
5️⃣ DASHBOARD ARRIVES
   ↓
   Browser: /dashboard
   Init: dashboard/page.jsx → check for access_token
   
   ├─ if access_token exists (from OTP):
   │  ✓ Skip bootstrap
   │  ✓ Render Products component
   │
   └─ if access_token missing (page reload after OTP):
      • Call bootstrapProductAuth()
      • Look for CSRF in sessionStorage (persists across reload!)
      • POST /auth/refresh
        {
          product_key,
          x-csrf-token: "yyy..."  (header)
          refresh_token             (httpOnly cookie, auto-sent)
        }
      • Response: { access_token: "new_xxx..." }
      • Store new access_token in authStore
      ✓ Render Products component
      
6️⃣ PRODUCTS API CALL
   ↓
   GET /products?product_key=seaneb
   
   Request Interceptor:
   • Get access_token from authStore
   • Add: Authorization: Bearer xxx...
   
   Response Interceptor:
   ├─ if 200 OK:
   │  ✓ Render products list
   │
   └─ if 401 Unauthorized:
      ► Access token expired (15 min lifetime)
      ► Call refreshAccessToken()
      ► Get CSRF from sessionStorage
      ► POST /auth/refresh (same as step 5)
      ► Get new access_token
      ► Retry original /products request
      ► (User doesn't notice!)
      
7️⃣ TIME-BASED EVENTS
   ├─ if 15 minutes pass:
   │  • Access token expires
   │  • Next API call gets 401
   │  • Interceptor calls /auth/refresh
   │  • New access_token issued
   │  • User continues working
   │
   └─ if 6 hours pass (session expires):
      • /auth/refresh also fails (SESSION_EXPIRED)
      • All tokens cleared
      • Redirect to /auth/login
      • User must verify OTP again
```

---

## 📋 Token Lifecycle

### Access Token (15 minutes)
```
Created:  After OTP verification
Returned: /otp/verify-otp response
Stored:   authStore + sessionStorage
Used:     Authorization: Bearer {token} header
Lifetime: 15 minutes
Refresh:  Automatically via /auth/refresh
Purpose:  Fast authentication for API calls
Safety:   Short life = less damage if stolen
```

### Refresh Token (30 days)
```
Created:  After OTP verification
Returned: httpOnly cookie from /otp/verify-otp
Stored:   HttpOnly cookie (cannot read from JS)
Lifetime: 30 days
Purpose:  Generate new access_token without login
Browser:  Automatically sent with each request
Security: Hashed in database
```

### CSRF Token (Session lifetime = 6 hours)
```
Created:  After OTP verification
Returned: /otp/verify-otp response body
Stored:   sessionStorage (survives page reload!)
Purpose:  Protect /auth/refresh endpoint
How it works:
  • Frontend sends: x-csrf-token header
  • Backend checks: cookie + header match
  • Prevents: Fake websites making refresh requests
```

---

## 🎯 Key Implementation Details

### 1. CSRF Token Persistence (CRITICAL)
**Problem Solved:** CSRF was lost on page reload, breaking token refresh

**Solution:**
```javascript
// src/services/store/authStore.js

setCsrfToken(token) {
  // Store in both:
  this.csrfToken = token;  // In-memory (fast)
  sessionStorage.setItem("csrf_token", token);  // Survives page reload!
}

getCsrfToken() {
  // Priority: sessionStorage > authStore > cookie
  if (this.csrfToken) return this.csrfToken;
  
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("csrf_token");
    if (token) {
      this.csrfToken = token;
      return token;
    }
  }
  return null;
}
```

**Result:** CSRF persists across page reloads, refresh endpoint always has matching token

---

### 2. Centralized Token Refresh
**Problem Solved:** Refresh logic was scattered, inconsistent implementations

**Solution:**
```javascript
// src/services/authservice.js

export const refreshAccessToken = async () => {
  // Single trusted implementation
  // Called from:
  // - API interceptor on 401
  // - Bootstrap on page reload
  // - Dashboard init if no token
  
  // Get CSRF (priority: sessionStorage > authStore > cookie)
  const csrf = sessionStorage.getItem("csrf_token") || ...
  
  // Call endpoint with both:
  const res = await axios.post(
    "/auth/refresh",
    { product_key: "seaneb" },
    {
      withCredentials: true,  // Sends httpOnly refresh cookie automatically
      headers: {
        "x-csrf-token": csrf,  // Frontend sends CSRF in header
      }
    }
  );
  
  // Return new access_token
  return res.data.access_token;
};
```

**Result:** Consistent, reliable token refresh from all parts of the app

---

### 3. Bootstrap on Page Reload
**Problem Solved:** Users got logged out when refreshing dashboard

**Solution:**
```javascript
// src/services/auth.bootstrap.js

export const bootstrapProductAuth = async () => {
  // Called on /dashboard mount if no access_token
  
  // Get CSRF from sessionStorage (exists because persisted from OTP)
  const csrf = sessionStorage.getItem("csrf_token");
  
  // Call refresh endpoint (same as after 15 min timeout)
  const res = await axios.post(
    "/auth/refresh",
    { product_key: "seaneb" },
    {
      withCredentials: true,
      headers: { "x-csrf-token": csrf }
    }
  );
  
  // Store new access_token
  authStore.setAccessToken(res.data.access_token);
};
```

**Used in:**
```javascript
// src/app/dashboard/page.jsx

useEffect(() => {
  const existing = authStore.getAccessToken();
  
  if (!existing) {
    // Page reloaded, need to regenerate token
    await bootstrapProductAuth();
  }
  
  setAuthReady(true);
}, []);
```

**Result:** Page reload → CSRF found in sessionStorage → Token regenerated → Dashboard ready

---

### 4. Auto-Refresh on API 401
**Problem Solved:** API calls failed silently when token expired

**Solution:**
```javascript
// src/services/api.js

api.interceptors.response.use(
  (res) => res,  // 200 responses pass through
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, refresh it
      const newToken = await refreshAccessToken();
      
      // Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);
```

**Result:** 
- User calls `/products` at 14:59 (token expires at 15:00)
- At 15:05: API returns 401
- Interceptor: POST /auth/refresh, get new token
- Interceptor: Retry GET /products
- User sees products without knowing token was refreshed

---

## 🔄 Token Refresh Cycle

### Scenario 1: Access Token Expires (15 minutes)
```
Timeline:
  14:45 - User logs in (access_token issued, expires at 15:00)
  14:45-15:00 - All API calls work (token valid)
  15:05 - User clicks "Get Products" button
  
Flow:
  1. GET /products → 401 (token expired)
  2. Interceptor catches 401
  3. Interceptor calls refreshAccessToken()
  4. refreshAccessToken() gets CSRF from sessionStorage
  5. POST /auth/refresh with CSRF header + httpOnly cookie
  6. Backend returns new access_token (expires at 15:20)
  7. Interceptor retries GET /products with new token
  8. Products display (user doesn't notice 401)
```

### Scenario 2: Page Reload During Active Session
```
Timeline:
  15:10 - User on dashboard, access_token in memory (expires at 15:20)
  15:11 - User refreshes page (usually F5)
  15:11 - Access token lost from memory (sessionStorage also empty)
  
Flow:
  1. Dashboard mounts
  2. Check authStore.getAccessToken() → NOT FOUND
  3. Call bootstrapProductAuth()
  4. Get CSRF from sessionStorage → FOUND (persisted from OTP!)
  5. POST /auth/refresh with CSRF header + httpOnly cookie
  6. Backend returns new access_token (expires at 15:31)
  7. Products display as normal
```

### Scenario 3: Session Expires (6 hours)
```
Timeline:
  10:00 - User logs in (session created, expires at 16:00)
  15:30 - User on dashboard
  16:05 - Session has expired
  
Flow:
  1. User tries any API call
  2. Interceptor includes old Bearer token
  3. Backend returns 401 SESSION_EXPIRED
  4. Interceptor tries refreshAccessToken()
  5. POST /auth/refresh fails (session expired)
  6. Backend returns 401 or SESSION_EXPIRED
  7. Interceptor clears authStore.clearAll()
  8. Dashboard redirects to /auth/login
  9. User must enter phone + verify OTP again
```

---

## 🧪 Testing the Complete Flow

### Test 1: First-Time User (Case A)
```
Steps:
1. Go to /auth/login
2. Enter mobile: +1-5551234567
3. Send OTP
4. Wait for SMS/WhatsApp
5. Enter OTP: (4 digits)
6. Verify: should redirect to /auth/complete-profile
   ✓ No access_token (expected for new user)
   ✓ No CSRF stored (expected, backend didn't create session)
7. Console should show:
   [OTP Service] New User - Case A
   → Session NOT created, tokens NOT received
```

### Test 2: Existing User (Case B)
```
Steps:
1. Go to /auth/login
2. Enter mobile: +1-5551234567 (your existing account)
3. Send OTP
4. Enter OTP: (4 digits)
5. Verify: should redirect to /dashboard
   ✓ access_token stored (first-time in this session)
   ✓ csrf_token in sessionStorage
   ✓ Products list displays
6. Console should show:
   [OTP Service] Existing User - Case B
   → Session created, tokens received
   [bootstrap] Access token already present from OTP flow
   [Products Service] Successfully fetched products
```

### Test 3: Page Reload During Session
```
Steps:
1. After login (from Test 2), you're on /dashboard
2. Press F5 to reload page
3. Dashboard should display products again
   ✓ No flash or redirect to login
4. Console should show:
   [bootstrap] Page reloaded - regenerating access token
   [refreshAccessToken] Found CSRF in sessionStorage
   [refreshAccessToken] Successfully refreshed access token
   [Products Service] Successfully fetched products
```

### Test 4: 15-Minute Token Expiry
```
Can't realistically test without waiting 15 min, but:
1. Login and go to /dashboard
2. Look at console logs to find token expiry time (optional JWT decode)
3. Wait 15+ minutes
4. Click "Get Products" or interact with dashboard
5. Console should show:
   [api-interceptor] 401 detected - access token expired
   [refreshAccessToken] Refresh successful
   [api-interceptor] Retrying original request
```

### Test 5: Session Expiry (6 Hours)
```
Can't realistically test, but when it happens:
1. Any API call after 6 hours shows:
   [api-interceptor] Refresh failed: STATUS 401
   [Dashboard] Authentication init failed
2. Redirects to /auth/login
3. User logs in again
```

---

## 📊 Token Storage Summary

| Token | Storage | Lifetime | Purpose |
|-------|---------|----------|---------|
| **access_token** | authStore + sessionStorage | 15 min | API Authorization header |
| **refresh_token** | httpOnly cookie | 30 days | Generate new access_token |
| **csrf_token** | sessionStorage + authStore | 6 hours | Protect /auth/refresh |
| **session** | Backend + httpOnly cookie | 6 hours | User identity |

---

## 🐛 Debugging Console Logs

The system now includes comprehensive logging prefixed with emoji:

```javascript
🔐 [OTP Service]        - OTP verification flow
🔐 [authservice]        - Auth service operations
🔐 [authStore]          - Token storage operations
🔑 [refreshAccessToken] - Token refresh operations
🚀 [bootstrap]          - Page reload initialization
📡 [api-request]        - Outgoing API requests
📥 [api-response]       - API responses
🔄 [api-interceptor]    - Interceptor operations
📦 [Products Service]   - Products API calls
🏠 [Products Component] - Frontend component rendering
👤 [OtpVerification]    - User flow decisions
```

**To debug:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Perform action (login, refresh, etc)
4. Look for prefixed logs showing the flow

---

## ✅ Verification Checklist

After implementing, verify:

- [ ] OTP verify captures CSRF from response headers
- [ ] CSRF persisted to sessionStorage (check: `sessionStorage.csrf_token`)
- [ ] Access token stored in authStore (check: `authStore.getAccessToken()`)
- [ ] Page reload → bootstrap regenerates token (no 401)
- [ ] 15-min timeout → API returns 401 → interceptor refreshes
- [ ] Products display after OTP verify (both first-time and existing)
- [ ] All console logs show proper flow (check prefixed logs)

---

## 🚀 Next Steps

1. **Test the complete flow** in your Next.js dev server:
   ```bash
   npm run dev
   ```

2. **Monitor console logs** as you go through:
   - Login → OTP → Submit → Dashboard → Products

3. **Check Network tab** for:
   - POST /otp/verify-otp (contains csrf_token in response)
   - POST /auth/refresh (includes x-csrf-token header)
   - GET /products (has Bearer token)

4. **Test page reload** while on dashboard:
   - Browser should regenerate token from CSRF
   - Products should reload without 403 errors

5. **Verify token lifetime**:
   - Wait ~15 minutes and try API call
   - Should see 401 → refresh → retry → success in console

---

## 💡 Key Takeaways

✅ **CSRF Token Persistence** - Stored in sessionStorage, survives page reload
✅ **Centralized Refresh** - Single implementation handles all refresh scenarios
✅ **Auto-Refresh on 401** - API interceptor handles token expiry transparently
✅ **Bootstrap on Reload** - Dashboard regenerates tokens when needed
✅ **HttpOnly Cookies** - Refresh token stored securely by backend
✅ **Case A & B Handling** - New users vs existing users handled correctly
✅ **6-Hour Session** - After expiry, user forced to re-login

This implementation ensures your users can:
1. ✓ Login with OTP
2. ✓ See products immediately
3. ✓ Reload page without losing session
4. ✓ Make API calls that auto-refresh on token expiry
5. ✓ Stay logged in for 6 hours without re-login
