# 🌿 AgroVision AI — Backend

> Production-ready Express.js + MongoDB REST API for AgroVision AI.
> Node.js · Express · MongoDB · Mongoose · JWT · Winston

---

## 📁 Project Structure

```
agrovision-backend/
│
├── src/
│   ├── server.js                    ← Entry point: DB connect → HTTP listen → graceful shutdown
│   ├── app.js                       ← Express factory: all middleware in order
│   │
│   ├── config/
│   │   ├── env.js                   ← Load .env, validate required vars, export frozen config
│   │   └── database.js              ← Mongoose connect with retry + graceful disconnect
│   │
│   ├── middleware/
│   │   ├── auth.js                  ← JWT authenticate + RBAC authorize + optionalAuth
│   │   ├── errorHandler.js          ← Global error handler: normalises ALL error types
│   │   ├── notFound.js              ← 404 handler for unmatched routes
│   │   ├── rateLimiter.js           ← Tiered limiters: general / auth / ml / upload
│   │   ├── requestLogger.js         ← Morgan → Winston stream
│   │   ├── upload.js                ← Multer: disk + memory storage, MIME whitelist
│   │   └── validate.js              ← express-validator result checker
│   │
│   ├── models/
│   │   ├── User.js                  ← User schema: bcrypt, JWT generation, RBAC roles
│   │   ├── CropScan.js              ← Disease scan result schema
│   │   └── CropRecommendation.js    ← Crop recommendation history schema
│   │
│   ├── controllers/
│   │   ├── healthController.js      ← /health + /health/deep (liveness + readiness)
│   │   ├── authController.js        ← register, login, refresh, logout, getMe
│   │   ├── diagnosisController.js   ← scanCrop, history, getById, delete
│   │   ├── recommendController.js   ← getCropRecommendation, history, getById
│   │   └── weatherController.js     ← getCurrent, getForecast (OpenWeatherMap proxy)
│   │
│   ├── routes/
│   │   ├── index.js                 ← Master router: mounts all sub-routers
│   │   ├── healthRoutes.js
│   │   ├── authRoutes.js
│   │   ├── diagnosisRoutes.js
│   │   ├── recommendRoutes.js
│   │   ├── weatherRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── utils/
│   │   ├── ApiResponse.js           ← Standardised response envelope helper
│   │   ├── ApiError.js              ← Custom error class with HTTP status codes
│   │   ├── asyncHandler.js          ← Wraps async handlers — eliminates try/catch
│   │   ├── logger.js                ← Winston: rotating files + console + Morgan stream
│   │   └── pagination.js            ← Mongoose pagination helpers
│   │
│   └── validators/
│       └── commonValidators.js      ← Reusable express-validator chains
│
├── scripts/
│   └── seed.js                      ← Dev seed: admin + farmer + sample data
│
├── logs/                            ← Auto-created: combined-*.log, error-*.log
├── uploads/                         ← Auto-created: user uploaded images
│
├── .env.example                     ← All env vars documented
├── .gitignore
└── package.json
```

---

## ⚡ Quick Start

### 1. Install

```bash
cd agrovision-backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env — fill in MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, COOKIE_SECRET
```

Minimum required `.env` for local dev:
```env
MONGO_URI=mongodb://localhost:27017/agrovision
JWT_SECRET=a_very_long_random_string_at_least_64_characters_here_replace_me
JWT_REFRESH_SECRET=another_very_long_random_string_for_refresh_tokens_here
COOKIE_SECRET=one_more_long_random_string_for_signing_cookies_replace_me
```

### 3. Seed database (optional)

```bash
npm run seed
# Creates: admin@agrovision.ai / Admin@1234
#          arjun@demo.com     / Farmer@1234
```

### 4. Start dev server

```bash
npm run dev
# → Server starts on http://localhost:5000
# → Health: http://localhost:5000/api/v1/health
```

---

## 📡 API Endpoints

All endpoints prefixed with `/api/v1`

### Health
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | ✗ | Liveness probe |
| GET | `/health/deep` | ✗ | Readiness: DB + ML service check |

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | ✗ | Create account |
| POST | `/auth/login` | ✗ | Login, receive JWT |
| POST | `/auth/refresh` | ✗ | Rotate refresh token |
| POST | `/auth/logout` | ✗ | Clear auth cookies |
| GET | `/auth/me` | ✓ | Get current user |

### Disease Diagnosis
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/diagnosis` | ✓ | Upload image → disease scan |
| GET | `/diagnosis` | ✓ | Scan history (paginated) |
| GET | `/diagnosis/:id` | ✓ | Single scan |
| DELETE | `/diagnosis/:id` | ✓ | Delete scan |

### Crop Recommendation
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/recommend` | ✓ | Get crop recommendation |
| GET | `/recommend` | ✓ | Recommendation history |
| GET | `/recommend/:id` | ✓ | Single recommendation |

### Weather
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/weather/current?lat=&lon=` | ✓ | Current conditions |
| GET | `/weather/forecast?lat=&lon=` | ✓ | 7-day forecast |

### Users
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/users/profile` | ✓ | any | Own profile |
| PATCH | `/users/profile` | ✓ | any | Update profile |
| PATCH | `/users/password` | ✓ | any | Change password |
| GET | `/users/stats` | ✓ | any | Dashboard stats |
| GET | `/users` | ✓ | admin | List all users |

---

## 🔒 Security Layers

| Layer | Implementation |
|-------|---------------|
| Security headers | `helmet` |
| CORS with whitelist | Custom origin validator |
| Rate limiting | 3 tiers: general (100/15m), auth (10/15m), ML (30/15m) |
| NoSQL injection | `express-mongo-sanitize` |
| XSS prevention | `xss-clean` |
| HTTP param pollution | `hpp` |
| JWT auth | httpOnly cookie + Bearer header |
| Password hashing | `bcryptjs` with 12 salt rounds |
| Input validation | `express-validator` on all routes |
| File upload safety | MIME whitelist, size limit, UUID filenames |
| Error sanitisation | Stack traces hidden in production |

---

## 🌳 Standard API Response Shapes

**Success:**
```json
{
  "success": true,
  "message": "Recommended crop: Wheat",
  "data": { ... },
  "meta": { "page": 1, "total": 42, "pages": 3 }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Must be a valid email address", "value": "notanemail" }
  ]
}
```

---

## 🔌 Connecting to Frontend

The frontend's `vite.config.js` should proxy API calls in development:

```js
// In agrovision-ai/vite.config.js:
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

---

## 📦 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | ✅ | — | MongoDB connection string |
| `JWT_SECRET` | ✅ | — | Access token signing key (≥64 chars) |
| `JWT_REFRESH_SECRET` | ✅ | — | Refresh token signing key |
| `COOKIE_SECRET` | ✅ | — | Cookie signing secret |
| `PORT` | ✗ | 5000 | HTTP port |
| `NODE_ENV` | ✗ | development | Environment |
| `ALLOWED_ORIGINS` | ✗ | localhost:5173 | CORS whitelist (comma-separated) |
| `OPENWEATHER_API_KEY` | ✗ | — | OpenWeatherMap key |
| `ML_SERVICE_URL` | ✗ | localhost:8000 | Python ML service URL |
| `MAX_FILE_SIZE_MB` | ✗ | 10 | Max upload size |
| `LOG_LEVEL` | ✗ | debug | Winston log level |
