# 403 Forbidden Error - CORS & JWT Configuration Fix

## Problem
You're getting **403 Forbidden** errors when trying to access protected endpoints from the frontend even after login.

```
Failed to load resource: the server responded with a status of 403 ()
axios Error: Request failed with status code 403
```

## Root Cause
The backend's CORS configuration requires the `FRONTEND_URL` environment variable to be set. Without it, requests from `localhost:5173` are being rejected.

## Solution

### Option 1: Run Backend with Environment Variable (Recommended for Local Development)

#### On Windows (Command Prompt):
```cmd
cd url-shortner
set FRONTEND_URL=http://localhost:5173
set JWT_SECRET=your-super-secret-key-min-32-chars
set DATABASE_URL=jdbc:postgresql://localhost:5432/url_shortener
set DATABASE_USERNAME=postgres
set DATABASE_PASSWORD=your_db_password
mvn spring-boot:run
```

#### On Windows (PowerShell):
```powershell
cd url-shortner
$env:FRONTEND_URL="http://localhost:5173"
$env:JWT_SECRET="your-super-secret-key-min-32-chars"
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/url_shortener"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="your_db_password"
mvn spring-boot:run
```

#### On Linux/Mac:
```bash
cd url-shortner
export FRONTEND_URL=http://localhost:5173
export JWT_SECRET=your-super-secret-key-min-32-chars
export DATABASE_URL=jdbc:postgresql://localhost:5432/url_shortener
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=your_db_password
mvn spring-boot:run
```

### Option 2: Create application-local.properties File

Create a new file: `url-shortner/src/main/resources/application-local.properties`

```properties
spring.application.name=url-shortner

# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/url_shortener
spring.datasource.username=postgres
spring.datasource.password=your_password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.show-sql=false

# JWT
jwt.secret=your-super-secret-key-min-32-characters-long

# Frontend URL - IMPORTANT FOR CORS
frontend.url=http://localhost:5173

# Logging
logging.level.org.springframework.security=DEBUG
```

Then run with:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"
```

### Option 3: Modify CorsConfig Temporarily (Not Recommended for Production)

Edit `src/main/java/com/backen/url_shortner/security/CorsConfig.java`:

```java
@Override
public void addCorsMappings(CorsRegistry registry){
    registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173", "http://localhost:3000")
            .allowedMethods("*")
            .allowedHeaders("*")
            .allowCredentials(true);
}
```

## Verify JWT Token Setup

### 1. Check JWT Secret
Ensure your JWT_SECRET is set and is at least 32 characters long:

```bash
echo $JWT_SECRET  # Linux/Mac
echo %JWT_SECRET%  # Windows CMD
echo $env:JWT_SECRET  # Windows PowerShell
```

If not set, set it:
```bash
export JWT_SECRET="a-very-long-secret-key-with-at-least-32-characters-1234567890"
```

### 2. Verify Token Storage
Open browser DevTools → Application → LocalStorage and check if `token` is present after login.

If not present:
- Check if login response includes `token` field
- Check browser console for error messages
- Verify the login endpoint works

### 3. Check Token Format
In DevTools Console, paste:
```javascript
console.log(localStorage.getItem('token'));
```

The token should start with `eyJ` (base64 JWT header).

## Complete Setup Steps

### 1. Start PostgreSQL Database
```bash
# Windows (if using WSL or installed PostgreSQL)
sudo service postgresql start

# Or use Docker
docker run --name postgres-url-shortener -e POSTGRES_PASSWORD=your_password -p 5432:5432 -d postgres:15

# Create database
psql -U postgres -c "CREATE DATABASE url_shortener;"
```

### 2. Start Backend with All Environment Variables
```bash
cd url-shortner

# Windows PowerShell
$env:FRONTEND_URL="http://localhost:5173"
$env:JWT_SECRET="a-very-long-secret-key-with-at-least-32-characters-1234567890"
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/url_shortener"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="your_password"
mvn spring-boot:run
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

### 4. Test Login
1. Go to http://localhost:5173/register
2. Create a test account
3. Login with those credentials
4. Check if dashboard loads without 403 errors

## Troubleshooting

### Still Getting 403 Errors?

**Step 1: Check Browser Console**
- Open DevTools (F12)
- Go to Network tab
- Try to login
- Look for failed requests and check response headers

**Step 2: Check Backend Logs**
Look for CORS-related messages:
```
Cross-Origin Request Blocked: ... (Reason: Credentials mode is 'include')
CORS policy: Access-Control-Allow-Origin header missing
```

**Step 3: Verify Environment Variables**
```bash
# Check if backend sees the environment variable
java -jar target/url-shortner-*.jar -DPrintEnvironmentVariables=true
```

**Step 4: Check Token in Headers**
In DevTools → Network → any request → Headers tab
Look for:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

If missing, token is not being sent.

### Token Not Sent in Headers?

Check `src/services/api.js`:

```javascript
// Add this debug code
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Auth header set:', config.headers.Authorization);
  }
  return config;
});
```

Then check browser console for the logs.

### Token Not Stored After Login?

Check `src/pages/Login.jsx`:

```javascript
// Add this debug code in handleSubmit
console.log('Login response:', response.data);
if (response.data && response.data.token) {
  setToken(response.data.token);
  console.log('Token saved:', response.data.token);
} else {
  console.error('No token in response:', response.data);
}
```

Check browser console for the logs.

## Environment Variables Summary

| Variable | Example | Description |
|----------|---------|-------------|
| `FRONTEND_URL` | `http://localhost:5173` | Frontend URL for CORS |
| `JWT_SECRET` | `long-secret-key-32chars` | Secret key for JWT signing |
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/url_shortener` | Database connection URL |
| `DATABASE_USERNAME` | `postgres` | Database username |
| `DATABASE_PASSWORD` | `password` | Database password |
| `SPRING_DATA_REDIS_HOST` | `localhost` | Redis host (optional) |
| `SPRING_DATA_REDIS_PORT` | `6379` | Redis port (optional) |

## Production Deployment

For production, set these environment variables on your deployment platform:

**Vercel/Netlify:**
```
VITE_API_URL=https://your-api-domain.com/api
```

**Backend Environment:**
```
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=production-secret-key-min-32-chars
DATABASE_URL=production-database-url
```

## Quick Verification Checklist

- [ ] `FRONTEND_URL` environment variable is set
- [ ] `JWT_SECRET` is at least 32 characters
- [ ] PostgreSQL database is running and accessible
- [ ] Backend starts without errors
- [ ] Frontend can access http://localhost:8080/api/auth/login
- [ ] Login returns a token
- [ ] Token is saved in localStorage
- [ ] Authorization header is sent in subsequent requests
- [ ] Dashboard loads without 403 errors

---

**If you're still having issues after following this guide, check:**

1. Backend console logs for security errors
2. Browser Network tab for request/response details
3. CORS error messages in browser console
4. JWT token format in localStorage (should start with `eyJ`)
5. Make sure you logged in with correct credentials

**Common Mistakes:**
- JWT_SECRET not set or too short
- FRONTEND_URL not set or incorrect
- Database connection failing silently
- Token not being sent in Authorization header
- Using wrong backend URL in API service
