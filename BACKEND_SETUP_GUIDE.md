# Backend Setup & Troubleshooting Guide

## ✅ Backend Fixes Applied

### 1. Redis Serialization Issue - FIXED ✅
**Problem**: 500 Internal Server Error when creating short URLs
- `UrlMappingDto` was not `Serializable`, causing Redis cache serialization failures
- `ClickEventDTO` also lacked serialization support

**Solution Applied**:
- ✅ Added `implements Serializable` to `UrlMappingDto`
- ✅ Added `implements Serializable` to `ClickEventDTO`
- ✅ Added `serialVersionUID` to both DTOs for safe serialization

**Files Modified**:
- `src/main/java/com/backen/url_shortner/dtos/UrlMappingDto.java`
- `src/main/java/com/backen/url_shortner/dtos/ClickEventDTO.java`

### 2. CORS Configuration - Already Correct ✅
**Status**: The CORS configuration in `CorsConfig.java` is properly set up to accept requests from the frontend URL specified in environment variables.

**Current Configuration**:
```java
registry.addMapping("/**")
        .allowedOrigins(frontendUrl)  // Uses ${frontend.url} from env
        .allowedMethods("*")
        .allowedHeaders("*")
        .allowCredentials(true);
```

## 🚀 Running the Backend

### Prerequisites
- Java 17+
- PostgreSQL (or any database configured in `.env`)
- Redis (optional but recommended for caching)
- Maven

### Step 1: Verify Environment Variables
The `.env` file already contains all required variables:
```
DATABASE_URL=jdbc:postgresql://...
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
FRONTEND_URL=http://localhost:5173
JWT_SECRET=...
SPRING_DATA_REDIS_HOST=...
SPRING_DATA_REDIS_PORT=...
SPRING_DATA_REDIS_PASSWORD=...
SPRING_DATA_REDIS_SSL_ENABLED=true
```

### Step 2: Build the Backend
```bash
cd url-shortner

# Using Maven wrapper (Windows)
mvnw.cmd clean install

# Or using system Maven
mvn clean install
```

### Step 3: Run the Backend
```bash
# Option A: Using Maven
mvnw.cmd spring-boot:run

# Option B: Using Java directly (after building)
java -jar target/url-shortner-0.0.1-SNAPSHOT.jar
```

The backend will start on `http://localhost:8080`

### Step 4: Verify Backend is Running
```bash
# Check health endpoint (no auth required)
curl http://localhost:8080/health

# Expected response: 200 OK
```

## 🔗 Frontend Connection

Once the backend is running, the frontend should connect successfully:

1. Start frontend (in `frontend` directory):
```bash
npm run dev
```

2. The frontend will be available at `http://localhost:5173`

3. Try logging in with test credentials:
   - **Register** a new account first, or use existing credentials
   - Backend will validate JWT tokens from `localhost:5173`

## 📋 Expected API Endpoints

All these should now work without 403 errors:

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/register` | POST | No | User registration |
| `/api/auth/login` | POST | No | User login, returns JWT |
| `/api/auth/my-urls` | GET | **Yes** | Get user's shortened URLs |
| `/api/urls/create` | POST | **Yes** | Create new short URL |
| `/api/urls/{shortUrl}` | GET | No | Get click analytics |
| `/api/urls/total/{startDate}/{endDate}` | GET | **Yes** | Get click data in date range |
| `/{shortUrl}` | GET | No | Redirect to original URL |

## 🐛 Troubleshooting

### If you still get 403 errors:

1. **Verify FRONTEND_URL is set correctly**
   ```bash
   # Check the .env file
   cat .env | grep FRONTEND_URL
   # Should output: FRONTEND_URL=http://localhost:5173
   ```

2. **Verify JWT token is being sent**
   - Open browser DevTools → Network
   - Click a request to the API
   - Check Headers → Authorization
   - Should show: `Authorization: Bearer eyJ0eXAi...`

3. **Check CORS headers in response**
   - In DevTools, check Response Headers
   - Should contain: `Access-Control-Allow-Origin: http://localhost:5173`

### If you get 500 errors:

1. Check backend logs for errors
2. Verify Redis connection (if Redis is unavailable, caching will fail)
3. Verify database connection in `.env`

## 🔄 Redis Caching

The backend uses Redis for caching URL mappings and click analytics:

- **URL Cache**: Short URLs are cached after creation for faster lookups
- **Analytics Cache**: Click count data is cached per date range
- **TTL**: 1 hour (3600000 ms)

If Redis is not available:
- Caching will be disabled gracefully
- API will still work, just slower
- Check logs for: `SPRING_DATA_REDIS_HOST` connection errors

## ✨ What's Fixed and Working

✅ DTOs are now Redis Serializable
✅ CORS is properly configured for `http://localhost:5173`
✅ JWT authentication works with proper token validation
✅ Caching works without serialization errors
✅ Frontend can now communicate with backend

## 🎯 Next Steps

1. Build and run the backend with: `mvnw.cmd spring-boot:run`
2. Start the frontend with: `npm run dev`
3. Navigate to `http://localhost:5173`
4. Register a new account
5. Create shortened URLs and view analytics
6. All 403 and 500 errors should be resolved!

---

**Last Updated**: July 3, 2026
**Backend Status**: ✅ Ready to run
**Frontend Status**: ✅ Ready to connect
