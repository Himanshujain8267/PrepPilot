# Authentication API Documentation

## Overview
This document describes the authentication routes for the PrepPilot application. The API uses Google OAuth-based authentication with JWT tokens stored in secure HTTP-only cookies for session management.

---

## Base URL
```
http://localhost:8000/api/auth
```

---

## Authentication Flow

### How It Works:
1. **User logs in with Google** → Google credentials sent to backend
2. **User lookup/creation** → Check if user exists, if not create new user
3. **JWT token generated** → Token created based on user ID with 7-day expiration
4. **Token stored in cookie** → Secure HTTP-only cookie set in browser
5. **User data returned** → Client receives user information
6. **Automatic authentication** → Cookie automatically sent with subsequent requests

### Cookie Security Options:
- **httpOnly**: `true` - Prevents XSS attacks by blocking JavaScript access
- **secure**: `false` - For localhost development (should be `true` in production with HTTPS)
- **sameSite**: `strict` - Prevents CSRF attacks
- **maxAge**: 7 days - Cookie automatically expires after 7 days

---

## Endpoints

### 1. Google Authentication
**POST** `/google`

#### Description
Authenticates user via Google OAuth. Creates new user if they don't exist in the database.

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String | Yes | User's full name from Google account |
| `email` | String | Yes | User's email from Google account |

#### Response - Success (200)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "createdAt": "2024-06-18T10:30:00.000Z",
  "updatedAt": "2024-06-18T10:30:00.000Z"
}
```

**Cookie Set:**
```
Set-Cookie: token=<JWT_TOKEN>; HttpOnly; SameSite=Strict; Max-Age=604800
```

#### Response - Error (500)
```json
{
  "message": "Google auth error [error details]"
}
```

#### Example cURL
```bash
curl -X POST http://localhost:8000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com"
  }'
```

#### Example JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:8000/api/auth/google', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include', // Important: Include cookies
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john.doe@example.com'
  })
});

const user = await response.json();
console.log(user);
```

---

### 2. Logout
**GET** `/logout`

#### Description
Logs out the user by clearing the authentication cookie. The token is added to a blacklist to prevent reuse.

#### Request Headers
```
Cookie: token=<JWT_TOKEN>
```

#### Request Parameters
None

#### Response - Success (200)
```json
{
  "message": "LogOut Successfully"
}
```

#### Response - Error (500)
```json
{
  "message": "Logout error [error details]"
}
```

#### Example cURL
```bash
curl -X GET http://localhost:8000/api/auth/logout \
  -H "Cookie: token=<JWT_TOKEN>"
```

#### Example JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:8000/api/auth/logout', {
  method: 'GET',
  credentials: 'include' // Important: Include cookies
});

const result = await response.json();
console.log(result);
```

---

## Token & Cookie Information

### JWT Token
- **Type**: JSON Web Token (JWT)
- **Payload**: User ID (`userId`)
- **Expiration**: 7 days
- **Storage**: HTTP-only cookie (automatic with requests)
- **Secret**: Stored in `process.env.JWT_SECRET`

### Token Structure
```
Header.Payload.Signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE3MTg2NzQ2MDAsImV4cCI6MTcxOTI3OTQwMH0.
signature
```

---

## Security Features

### 1. Token Blacklisting
When a user logs out, their token is added to a blacklist:
- Prevents token reuse after logout
- Old tokens cannot authenticate new requests
- **Note**: In production, use Redis or Database for persistence across server restarts

### 2. Cookie Security
- **httpOnly**: Prevents malicious JavaScript from accessing the token
- **sameSite=strict**: Only sends cookie to your domain, preventing CSRF attacks
- **secure flag**: Should be `true` in production (currently `false` for localhost HTTP)

### 3. Authentication Middleware
Protected routes use `isAuth` middleware which:
- Checks if token exists in cookies
- Verifies token is not blacklisted
- Validates token signature using JWT_SECRET
- Extracts user ID for subsequent operations

---

## Environment Variables

Required environment variables:
```
JWT_SECRET=your_secret_key_here
MONGODB_URI=your_mongodb_connection_string
```

---

## Error Handling

### Common Errors

| Error | Status | Cause | Solution |
|-------|--------|-------|----------|
| Google auth error | 500 | Server error during authentication | Check server logs, verify DB connection |
| Logout error | 500 | Server error during logout | Check server logs |
| Token revoked | 401 | Token is blacklisted (already logged out) | User needs to login again |
| Invalid token | 400 | Token signature invalid or expired | User needs to login again |
| No token | 400 | User doesn't have a token (not logged in) | User needs to login |

---

## Usage Example - Complete Flow

### 1. Login (Google Auth)
```javascript
// Step 1: Send user data from Google to backend
const loginResponse = await fetch('http://localhost:8000/api/auth/google', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
});

const user = await loginResponse.json();
console.log('User logged in:', user);
// Token automatically stored in cookie
```

### 2. Access Protected Route
```javascript
// Step 2: Access protected route (token sent automatically in cookie)
const protectedResponse = await fetch('http://localhost:8000/api/user/current-user', {
  method: 'GET',
  credentials: 'include' // Include cookies
});

const currentUser = await protectedResponse.json();
console.log('Current user:', currentUser);
```

### 3. Logout
```javascript
// Step 3: Logout
const logoutResponse = await fetch('http://localhost:8000/api/auth/logout', {
  method: 'GET',
  credentials: 'include'
});

const result = await logoutResponse.json();
console.log(result.message); // "LogOut Successfully"
// Token removed from cookies and blacklisted
```

---

## Production Checklist

- [ ] Set `secure: true` in cookie options (requires HTTPS)
- [ ] Use environment-specific JWT_SECRET
- [ ] Implement Redis for token blacklist persistence
- [ ] Add rate limiting to prevent brute force attacks
- [ ] Add CORS configuration for frontend domain
- [ ] Enable HTTPS/SSL
- [ ] Implement refresh token mechanism for better security
- [ ] Add logging and monitoring
- [ ] Set up error tracking (e.g., Sentry)

---

## Testing

### Test with Postman or Insomnia

**1. Post Google Auth Request**
```
POST http://localhost:8000/api/auth/google
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com"
}
```

**2. Get Logout Request**
```
GET http://localhost:8000/api/auth/logout
```

---

## Troubleshooting

### Token Not Being Sent
- Ensure `credentials: 'include'` is set in fetch requests
- Check browser cookie settings in DevTools (Application > Cookies)

### CORS Issues
- Configure CORS middleware in main server file
- Ensure frontend domain is whitelisted

### Token Expired
- Token expires after 7 days
- User must login again to get a new token
- Consider implementing refresh tokens

### Database Connection Errors
- Verify MongoDB connection string in `.env`
- Check database is running and accessible

---

## Related Routes
- `GET /api/user/current-user` - Get current authenticated user (requires token)
- `POST /api/auth/google` - Google authentication
- `GET /api/auth/logout` - Logout and blacklist token

---

## Support
For issues or questions, please contact the development team or check the server logs for detailed error messages.
