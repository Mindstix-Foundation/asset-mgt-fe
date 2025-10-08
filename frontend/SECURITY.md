# 🔒 Frontend Security Documentation - TrackStix Asset Management System

## Overview
This document outlines the security measures implemented in the TrackStix Asset Management System (Frontend/Vue.js).

**Last Updated:** October 7, 2025  
**Framework:** Vue 3 + TypeScript  
**Security Rating:** ⭐⭐⭐⭐⭐⭐⭐⭐⚪⚪ (8/10)

---

## 🛡️ Authentication Implementation

### Cookie-Based Authentication
The frontend uses HTTP-only cookies for authentication, which provides enhanced security:

```typescript
// No tokens stored in localStorage!
// All authentication via secure HTTP-only cookies
withCredentials: true  // Automatically sends cookies with requests
```

### Benefits
✅ **XSS Protection:** Cookies not accessible via JavaScript  
✅ **CSRF Protection:** SameSite cookie attribute  
✅ **Automatic Management:** Browser handles cookie security  
✅ **Token Refresh:** Transparent to user, handled automatically  

---

## 🔐 Auth Service Architecture

### Token Management
```typescript
// authService.ts
class AuthService {
  // HTTP-only cookies handle token storage
  // No token exposed to JavaScript
  
  // Automatic token refresh (every 12 minutes)
  private readonly REFRESH_INTERVAL = 12 * 60 * 1000
  
  // Browser fingerprinting for security
  generateFingerprint(): string {
    // Uses canvas, navigator, screen properties
    // Sent as X-Fingerprint header
  }
}
```

### Session Security
- **Browser Fingerprinting:** Unique identifier per browser
- **Automatic Refresh:** Tokens refreshed before expiry
- **Logout Cleanup:** All local data cleared
- **Session Validation:** Server validates on each request

---

## 🌐 API Client Security

### Axios Configuration
```typescript
// apiClient.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,  // Send cookies
  headers: {
    'Content-Type': 'application/json',
  }
})
```

### Security Interceptors
```typescript
// Request Interceptor
- Adds X-Fingerprint header
- Cookies sent automatically
- No manual token management

// Response Interceptor
- 401 errors trigger automatic token refresh
- Failed refresh triggers logout
- Retry original request after refresh
```

---

## 🚦 Route Protection

### Navigation Guards
```typescript
// router/index.ts
router.beforeEach((to, from, next) => {
  const isAuthenticated = authStore.isAuthenticated
  
  // Redirect authenticated users from login
  if (to.path === '/' && isAuthenticated) {
    next('/app/dashboard')
  }
  
  // Protect app routes
  if (to.path.startsWith('/app') && !isAuthenticated) {
    next('/')
  }
})
```

### Public Routes
- `/` - Login page
- `/login` - Login page (redirects to /)
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form

### Protected Routes
All routes under `/app/*` require authentication:
- Dashboard, Assets, Employees, Maintenance, Vendors, Reports, etc.

---

## 🔒 Browser Fingerprinting

### Implementation
```typescript
const generateFingerprint = (): string => {
  // Collects browser-specific data
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()  // Canvas fingerprinting
  ].join('|')
  
  // Simple hash function
  return hashFunction(data)
}
```

### Purpose
- **Session Validation:** Detect session hijacking
- **Anomaly Detection:** Identify suspicious activity
- **Additional Security Layer:** Beyond cookies

---

## 🛡️ Security Headers

### Development Server (Vite)
```typescript
// vite.config.ts
server: {
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }
}
```

### Header Explanations
- **X-Content-Type-Options:** Prevents MIME type sniffing
- **X-Frame-Options:** Prevents clickjacking attacks
- **X-XSS-Protection:** Browser XSS filter enabled
- **Referrer-Policy:** Limits referrer information
- **Permissions-Policy:** Restricts browser features

---

## 🔐 Input Validation & Sanitization

### Form Validation
All forms use Vue 3's built-in validation:

```vue
<!-- Example: Login Form -->
<template>
  <form @submit.prevent="handleLogin">
    <input 
      v-model="username" 
      required 
      minlength="1"
      maxlength="100"
    />
    <input 
      v-model="password" 
      type="password" 
      required
    />
  </form>
</template>
```

### TypeScript Type Safety
```typescript
// Strict typing prevents invalid data
interface LoginCredentials {
  username: string
  password: string
}

// Type-safe API calls
async login(credentials: LoginCredentials): Promise<LoginResponse>
```

---

## 🚨 Error Handling

### Secure Error Messages
```typescript
// Never expose sensitive information
try {
  await authService.login(credentials)
} catch (error) {
  // Generic error message to user
  showError('Login failed. Please check your credentials.')
  
  // Detailed error logged (development only)
  if (import.meta.env.DEV) {
    console.error('Login error:', error)
  }
}
```

### 401 Unauthorized Handling
```typescript
// Automatic token refresh on 401
if (error.response?.status === 401) {
  const refreshSuccess = await authService.refreshToken()
  if (refreshSuccess) {
    return apiClient(originalRequest)  // Retry
  } else {
    await authService.logout()  // Failed, logout user
  }
}
```

---

## 🔍 Security Best Practices Implemented

### ✅ Data Storage
- **No tokens in localStorage:** HTTP-only cookies only
- **Minimal client storage:** Only non-sensitive user data
- **Automatic cleanup:** Data cleared on logout

### ✅ Network Security
- **HTTPS in production:** All communication encrypted
- **withCredentials:** Cookies sent securely
- **CORS configured:** Only trusted origins allowed

### ✅ XSS Prevention
- **Vue's reactivity:** Automatic HTML escaping
- **v-html avoided:** Never use raw HTML from API
- **Content Security Policy:** Restricts inline scripts

### ✅ CSRF Prevention
- **SameSite cookies:** Backend sets SameSite=strict
- **Origin validation:** Backend validates request origin
- **Browser fingerprinting:** Additional validation layer

---

## 🚀 Production Deployment Checklist

### Environment Configuration
```bash
# .env.production
VITE_API_BASE_URL=https://api.your-domain.com/api

# Ensure NO sensitive data in .env files committed to git!
```

### Build Configuration
```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

### Security Checks Before Deploy
- [ ] VITE_API_BASE_URL points to production API
- [ ] No console.logs with sensitive data
- [ ] All dependencies updated (`npm audit`)
- [ ] Source maps disabled in production
- [ ] HTTPS enabled on hosting
- [ ] Security headers configured on CDN/hosting
- [ ] CSP headers configured

---

## 🐛 Known Limitations & Future Improvements

### Current Limitations
1. **Basic Browser Fingerprinting**
   - Simple hash function
   - Could be more sophisticated

2. **No Content Security Policy Nonce**
   - Using 'unsafe-inline' for styles
   - Could implement nonce-based CSP

3. **Limited Client-Side Validation**
   - Relies heavily on backend validation
   - Could add more frontend validation

### Planned Improvements
- [ ] Enhanced browser fingerprinting
- [ ] Nonce-based CSP for styles
- [ ] Subresource Integrity (SRI) for CDN assets
- [ ] Web Authentication API (WebAuthn) for passwordless
- [ ] Real-time security monitoring
- [ ] Session management UI

---

## 🔒 Secure Coding Guidelines

### For Developers

#### ✅ DO
```typescript
// ✅ Use typed API responses
interface User {
  id: number
  username: string
  email: string
}

// ✅ Validate user input
if (!email || !validateEmail(email)) {
  throw new Error('Invalid email')
}

// ✅ Use environment variables
const apiUrl = import.meta.env.VITE_API_BASE_URL

// ✅ Handle errors gracefully
try {
  await apiCall()
} catch (error) {
  showUserFriendlyError()
}
```

#### ❌ DON'T
```typescript
// ❌ Never store tokens in localStorage
localStorage.setItem('token', token)

// ❌ Never use v-html with API data
<div v-html="apiData.content"></div>

// ❌ Never expose sensitive data in logs
console.log('Password:', password)

// ❌ Never hardcode credentials
const API_KEY = 'sk_test_123456'
```

---

## 🎯 Security Testing

### Manual Testing Checklist
- [ ] Test authentication flow
- [ ] Test token refresh mechanism
- [ ] Test logout functionality
- [ ] Test route guards
- [ ] Test error handling
- [ ] Test with dev tools (check cookies)

### Automated Testing
```bash
# Run unit tests
npm run test:unit

# Run e2e tests (if available)
npm run test:e2e
```

---

## 📞 Security Contact

### Reporting Issues
Found a security vulnerability? Please report it responsibly:

1. **DO NOT** open a public GitHub issue
2. Email: security@trackstix.com
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Your contact information

### Response Time
- Critical vulnerabilities: 24 hours
- High severity: 48 hours
- Medium/Low severity: 1 week

---

## 📚 Additional Resources

### Vue.js Security
- [Vue.js Security Best Practices](https://vuejs.org/guide/best-practices/security.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Web Security
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Web.dev Security](https://web.dev/secure/)

### Tools
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Dependency vulnerability scanning
- [Snyk](https://snyk.io/) - Security vulnerability scanner
- [OWASP ZAP](https://www.zaproxy.org/) - Web application security testing

---

## 🔄 Update History

| Version | Date | Changes |
|---------|------|---------|
| 1.2.0 | 2025-10-07 | Added fingerprinting, security headers, improved error handling |
| 1.1.0 | 2025-09-30 | Migrated to HTTP-only cookies |
| 1.0.0 | 2025-09-15 | Initial security implementation |

---

**Remember:** Security is an ongoing process, not a one-time implementation. Regularly review and update security measures as new threats emerge.

