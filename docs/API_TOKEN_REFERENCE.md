# API Contract & Token Reference

This document shows the exact API request/response format for the complete authentication flow.

---

## 📡 API Endpoints Reference

### 1. POST /otp/send-otp
**Purpose:** Send OTP to mobile or email

**Request:**
```json
{
  \"identifier_type\": 0,
  \"country_code\": \"1\",
  \"mobile_number\": \"5551234567\",
  \"purpose\": 0,
  \"via\": \"whatsapp\",
  \"product_key\": \"seaneb\"
}
```

**Response (Success):**
```json
{
  \"success\": true,
  \"message\": \"OTP sent\"
}
```

**Status Codes:**
- 200: OK - OTP sent successfully
- 400: Bad Request - Invalid parameters
- 429: Too Many Requests - Cooldown active

---

### 2. POST /otp/verify-otp
**Purpose:** Verify OTP and create session (if existing user)

**Request:**
```json
{
  \"identifier_type\": 0,
  \"country_code\": \"1\",
  \"mobile_number\": \"5551234567\",
  \"otp\": \"1234\",
  \"purpose\": 0,
  \"product_key\": \"seaneb\"
}
```

**Response Case A (First-Time User - No Session):**
```json
{
  \"success\": true,
  \"is_existing_user\": false
}
```
⚠️ NO tokens returned (user hasn't filled profile yet)

**Response Case B (Existing User - Session Created):**
```json
{
  \"success\": true,
  \"is_existing_user\": true,
  \"access_token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\",
  \"csrf_token\": \"a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4\",
  \"refresh_token\": \"ey...\" (if backend returns it)
}
```

**Cookies Set by Backend:**
```
Set-Cookie: refresh_token=abc123...; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=2592000
Set-Cookie: csrf-token=a1b2c3...; Path=/; Max-Age=21600
```

**Status Codes:**
- 200: OK - OTP verified
- 400: Bad Request - Invalid OTP
- 401: Unauthorized - OTP expired/invalid
- 429: Too Many Requests - Too many attempts

---

### 3. POST /auth/refresh
**Purpose:** Generate new access token using refresh token

**Request:**
```
POST /auth/refresh

Headers:
  x-csrf-token: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4
  Content-Type: application/json

Body:
{
  \"product_key\": \"seaneb\"
}

Cookies (Auto-sent by browser):
  refresh_token=abc123...; HttpOnly
```

**Response (Success):**
```json
{
  \"access_token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\",
  \"csrf_token\": \"a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4\"
}
```

**Status Codes:**
- 200: OK - Token refreshed successfully
- 401: Unauthorized - Refresh token invalid/expired (need to re-login)
- 403: Forbidden - CSRF token missing/invalid (check x-csrf-token header)
- 500: Server Error - Backend issue

---

### 4. GET /products
**Purpose:** Get list of available products (protected)

**Request:**
```
GET /products?product_key=seaneb

Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
```

**Response (Success):**
```json
[
  {
    \"product_id\": \"prod_001\",
    \"product_key\": \"seaneb\",
    \"product_name\": \"SeaNeB Real Estate\",
    \"description\": \"...\",
    \"created_at\": \"2024-01-01T00:00:00Z\"
  },
  {
    \"product_id\": \"prod_002\",
    \"product_key\": \"seaneb\",
    \"product_name\": \"Property Management\",
    \"description\": \"...\",
    \"created_at\": \"2024-01-02T00:00:00Z\"
  }
]
```

**Status Codes:**
- 200: OK - Products retrieved
- 401: Unauthorized - Access token invalid/expired (interceptor will refresh)
- 403: Forbidden - Access denied
- 500: Server Error

---

## 🕐 Token Lifetime Reference

```
┌──────────────────────────────────────────────────────────────────┐
│                    TOKEN LIFETIME CHART                          │
└──────────────────────────────────────────────────────────────────┘

Timeline (after OTP verification at 10:00):

10:00 ├─ Session Created (6 hours = until 16:00)
      │  ├─ access_token: e1e2e3... (15 min = until 10:15)
      │  ├─ refresh_token: r1r2r3... (30 days = until 2/9/2026)
      │  └─ csrf_token: c1c2c3...
      │
10:15 ├─ ACCESS TOKEN EXPIRES
      │  ├─ /products request → 401
      │  ├─ Interceptor: POST /auth/refresh
      │  ├─ New access_token: e2e3e4... (until 10:30)
      │  └─ Retry /products → 200 OK (user doesn't notice)
      │
10:30 ├─ ACCESS TOKEN EXPIRES (again)
      │  ├─ Same refresh cycle...
      │
16:00 ├─ SESSION EXPIRES (entire session)
      │  ├─ refresh_token still valid, but session deleted
      │  ├─ POST /auth/refresh → 401 SESSION_EXPIRED
      │  ├─ API interceptor clears all tokens
      │  ├─ Dashboard redirects to /auth/login
      │  └─ → User must verify OTP again
      │
9/8/2026 └─ REFRESH TOKEN EXPIRES (30 days)
          └─ Can't create new sessions anymore
             (never happens in normal use due to 6-hour session limit)
```

---

## 🔐 Token Storage & Access

### Access Token
```javascript
// Frontend Storage:
authStore.getAccessToken()      // Returns from authStore or sessionStorage
sessionStorage.getItem(\"access_token\")  // Direct access

// Used in:
Authorization: Bearer {access_token}  // Every API call

// Decoded (JWT):
{
  \"sub\": \"user_id_123\",
  \"exp\": 1644444900,          // 15 min from issue time
  \"iat\": 1644444000,
  \"iss\": \"dev.seaneb.com\",
  \"user_type\": \"broker\"
}
```

### Refresh Token
```javascript
// Frontend Storage:
document.cookie              // HttpOnly cookie (cannot read from JS)
authStore.getRefreshToken() // Only if backend returns it in body

// Used in:
POST /auth/refresh with withCredentials: true
// Browser automatically sends it in Cookie header

// Lifetime:
30 days (but only valid for 6 hours due to session expiry)
```

### CSRF Token
```javascript
// Frontend Storage:
sessionStorage.getItem(\"csrf_token\")  // Survives page reload
authStore.getCsrfToken()               // Also in-memory

// Used in:
POST /auth/refresh
Headers: {
  \"x-csrf-token\": csrf_token
}

// Backend Validation:
1. Extract CSRF from request header: x-csrf-token
2. Find matching csrf_token cookie
3. Compare: if match → allow, else → 403 Forbidden
```

---

## 🔄 Request/Response Flow Examples

### Example 1: Initial Login (Existing User)

```
┌─────────────────────────────────────────────────────────────┐
│ User: Enters phone + OTP                                     │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend: POST /otp/verify-otp                              │
│ Body: { country_code, mobile_number, otp, product_key }    │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Backend:                                                      │
│ 1. Verify OTP (check against SMS/email sent)               │
│ 2. Find user by phone                                        │
│ 3. User EXISTS → Create Session (6 hours)                  │
│ 4. Generate: access_token (15 min)                         │
│ 5. Generate: refresh_token (30 days)                       │
│ 6. Generate: csrf_token                                     │
│ 7. Set HttpOnly cookies (refresh_token, csrf_token)        │
│ 8. Return: { access_token, csrf_token } in body            │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend: authStore stores tokens                            │
│ • access_token → authStore + sessionStorage                │
│ • csrf_token → authStore + sessionStorage (PERSISTS!)      │
│ • refresh_token → httpOnly cookie (set by backend)         │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend: Redirect to /dashboard                             │
│ Dashboard: Render Products component                         │
└─────────────────────────────────────────────────────────────┘
```

---

### Example 2: Access Token Refresh (After 15 min)

```
┌─────────────────────────────────────────────────────────────┐
│ User: Clicks button that makes API call (15 min after login)│
│ (access_token from login expired 30 seconds ago)            │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend: GET /products                                      │
│ Headers: Authorization: Bearer {expired_token}             │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Backend: 401 Unauthorized (token expired)                   │
│ Response: { status: 401, reason: \"Token Expired\" }        │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Interceptor): 401 Detected                        │
│ Action: POST /auth/refresh                                  │
│ Headers: x-csrf-token: {csrf_from_sessionStorage}          │
│ Cookies: refresh_token (auto-sent by browser)              │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Backend:                                                      │
│ 1. Check CSRF header matches cookie ✓                       │
│ 2. Validate refresh_token ✓                                 │
│ 3. Check session still active ✓ (within 6 hours)           │
│ 4. Generate NEW access_token (15 min lifetime)             │
│ 5. Return: { access_token: \"new_token\" }                 │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Interceptor):                                      │
│ 1. Store new access_token                                   │
│ 2. Retry Original Request: GET /products                    │
│ 3. Headers: Authorization: Bearer {new_token}              │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Backend: 200 OK                                              │
│ Response: [{ product_id, product_name }, ...]              │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ User: Sees products list (didn't notice token wasn't fresh) │
└─────────────────────────────────────────────────────────────┘
```

---

### Example 3: Page Reload During Session

```
┌─────────────────────────────────────────────────────────────┐
│ User: On/dashboard, presses F5 (page reload)               │
│ • access_token lost from memory                             │
│ • csrf_token persisted in sessionStorage ✓ SURVIVES!       │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend: /dashboard page mounts                             │
│ Check: authStore.getAccessToken() → NOT FOUND              │
│ Action: Call bootstrapProductAuth()                         │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend: Get CSRF from sessionStorage ✓ FOUND              │
│ POST /auth/refresh                                           │
│ Headers: x-csrf-token: {csrf_from_sessionStorage}          │
│ Cookies: refresh_token (auto-sent)                         │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Backend:                                                      │
│ 1. Validate CSRF: match cookie + header ✓                   │
│ 2. Validate refresh_token ✓                                 │
│ 3. Check session active ✓ (within 6 hours)                 │
│ 4. Generate new access_token                                │
│ 5. Return: { access_token: \"new_token\" }                 │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend: Store new access_token in authStore               │
│ Dashboard: Ready = true                                      │
│ Render: Products component                                   │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ User: Products load normally (page reload succeeded!)       │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Common Error Conditions

### 401 Unauthorized
```
When it happens:
- access_token expired (15+ min)
- access_token invalid/tampered
- No token sent (missing Authorization header)

Flow:
GET /products (with expired token)
  ↓
Backend: 401
  ↓
Frontend Interceptor: POST /auth/refresh
  ↓
If refresh succeeds: Retry GET /products
If refresh fails: Clear tokens, redirect to login
```

### 403 Forbidden
```
When it happens:
- CSRF header missing (x-csrf-token)
- CSRF header doesn't match cookie
- User doesn't have permission

Check:
1. Does sessionStorage have csrf_token?
   sessionStorage.getItem(\"csrf_token\") → should be present
2. Does Network tab show x-csrf-token header?
   POST /auth/refresh → Headers → x-csrf-token: ???
3. Is CSRF value correct length (48+ chars)?
```

### SESSION_EXPIRED
```
When it happens:
- 6+ hours since login
- Backend session deleted
- refresh_token still valid but session gone

Flow:
GET /products
  ↓
Backend: 401 SESSION_EXPIRED
  ↓
Frontend: POST /auth/refresh
  ↓
Backend: 401 (session doesn't exist)
  ↓
Frontend: Clear all tokens,redirect to login
  ↓
User: Must verify OTP again
```

---

## 🧪 Testing with cURL/Postman

### Step 1: Send OTP
```bash
curl -X POST https://dev.seaneb.com/api/v1/otp/send-otp \\
  -H \"Content-Type: application/json\" \\
  -d '{
    \"identifier_type\": 0,
    \"country_code\": \"1\",
    \"mobile_number\": \"5551234567\",
    \"purpose\": 0,
    \"via\": \"whatsapp\",
    \"product_key\": \"seaneb\"
  }'
```

### Step 2: Verify OTP
```bash
curl -X POST https://dev.seaneb.com/api/v1/otp/verify-otp \\
  -H \"Content-Type: application/json\" \\
  -d '{
    \"identifier_type\": 0,
    \"country_code\": \"1\",
    \"mobile_number\": \"5551234567\",
    \"otp\": \"1234\",
    \"purpose\": 0,
    \"product_key\": \"seaneb\"
  }' \\
  -i  # Show headers (look for Set-Cookie)
```

Response headers should show:
```
Set-Cookie: refresh_token=...; HttpOnly; SameSite=None; Secure
Set-Cookie: csrf-token=...;
```

### Step 3: Refresh Token
```bash
curl -X POST https://dev.seaneb.com/api/v1/auth/refresh \\
  -H \"Content-Type: application/json\" \\
  -H \"x-csrf-token: {csrf_token_from_step_2}\" \\
  -b \"refresh_token={refresh_token_from_step_2_cookie}; csrf-token={csrf_token}\" \\
  -d '{
    \"product_key\": \"seaneb\"
  }' \\
  -i  # Show response
```

### Step 4: Get Products
```bash
curl -X GET \"https://dev.seaneb.com/api/v1/products?product_key=seaneb\" \\
  -H \"Authorization: Bearer {access_token_from_step_2_or_3}\" \\
  -H \"Content-Type: application/json\"
```

---

## ✅ Verification Checklist

After implementation, verify these responses:

- [ ] POST /otp/verify-otp returns access_token in body (existing user)
- [ ] POST /otp/verify-otp returns csrf_token in body or headers
- [ ] POST /otp/verify-otp sets HttpOnly refresh_token cookie
- [ ] POST /auth/refresh requires x-csrf-token header (test without it = 403)
- [ ] POST /auth/refresh requires valid refresh_token cookie (test without it = 401)
- [ ] POST /auth/refresh returns new access_token
- [ ] GET /products requires Authorization header (test without it = 401)
- [ ] GET /products returns array of product objects

---

## 📞 Debugging Requests

### Check what headers are being sent
```javascript
// In browser DevTools Network tab
// 1. Filter by endpoint: /products or /auth/refresh
// 2. Click request
// 3. Go to \"Headers\" tab
// 4. Look for:
//    - Authorization: Bearer...
//    - x-csrf-token: ...
//    - Cookie: refresh_token=...; csrf-token=...
```

### Check what response headers are returned
```javascript
// In browser DevTools Network tab
// 1. Filter by /otp/verify-otp
// 2. Click request
// 3. Go to \"Response Headers\" tab
// 4. Look for:
//    - Set-Cookie: refresh_token=...
//    - Set-Cookie: csrf-token=...
\"    - Any x-csrf-token: ...
```

---

## 🎯 Quick Reference

**After OTP Verify (existing user):**
- Frontend has: access_token, csrf_token (sessionStorage)
- Cookies have: refresh_token (httpOnly)
- Status: Ready to call APIs

**After 15+ minutes:**
- API call gets 401
- Interceptor calls /auth/refresh
- New access_token returned
- Original request retried

**After page reload:**
- access_token lost from memory
- csrf_token persists in sessionStorage ← KEY!
- Bootstrap finds CSRF, calls /auth/refresh
- New access_token regenerated
- Dashboard loads

**After 6 hours:**
- Next API call gets 401
- /auth/refresh also fails (session expired)
- Redirect to login
- User must verify OTP again
