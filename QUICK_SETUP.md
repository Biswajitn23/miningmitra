# Quick Setup Guide - Frontend to Backend Integration

## ✅ What Was Done (Frontend)

1. **Created API Configuration** (`src/lib/api/config.ts`)
   - Axios client with base URL: `https://backend-b3ru.onrender.com`
   - CORS credentials enabled
   - Request/response interceptors
   - Health check function

2. **Updated API Modules** (Changed from Supabase to REST API)
   - `src/lib/api/workers.ts`
   - `src/lib/api/machinery.ts`
   - `src/lib/api/incidents.ts`
   - `src/lib/api/corridors.ts`

3. **Updated App.tsx**
   - Added health check on app startup
   - Logs connection status to console

4. **Updated Environment Variables**
   - Added `VITE_BACKEND_URL=https://backend-b3ru.onrender.com` to `.env`

## 🚨 REQUIRED: Backend CORS Setup

**⚠️ Your backend MUST have CORS configured or the frontend won't work!**

Add this to your backend (Express.js example):

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',              // Local development
    'https://your-vercel-domain.app',     // Production domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());
```

## 🧪 Quick Test

1. **Start your frontend**:
   ```bash
   npm run dev
   ```

2. **Open browser console** and look for:
   ```
   ✅ Backend connected successfully: {data}
   ```

3. **If you see errors**:
   - `❌ Backend connection failed` → Backend is down or CORS not configured
   - CORS error → Add your frontend URL to backend CORS config
   - Network error → Check backend URL in `.env`

## 📝 Required Backend Endpoints

Your backend needs these endpoints (examples):

```
GET    /health
GET    /api/workers
POST   /api/workers
GET    /api/workers/:id
PUT    /api/workers/:id
DELETE /api/workers/:id
GET    /api/workers/critical
GET    /api/machinery
GET    /api/machinery/critical
GET    /api/incidents
GET    /api/incidents/active
GET    /api/corridors
GET    /api/corridors/metrics/average
```

*(See `API_INTEGRATION.md` for complete endpoint list)*

## 🔑 Environment Variables Needed

**Frontend** (`.env`):
```env
VITE_BACKEND_URL=https://backend-b3ru.onrender.com
VITE_PERPLEXITY_API_KEY=your_key
VITE_GOOGLE_MAPS_API_KEY=your_key
```

**Backend** (Render.com):
```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-vercel-app.vercel.app
DATABASE_URL=your_database_url
```

## 🎯 Deployment Checklist

### Backend (Render.com)
- [ ] CORS package installed (`npm install cors`)
- [ ] CORS configured with frontend URL
- [ ] All API endpoints implemented
- [ ] Health endpoint responds at `/health`
- [ ] Environment variables set

### Frontend (Vercel/Local)
- [ ] `VITE_BACKEND_URL` set in environment variables
- [ ] Application rebuilds after env var change
- [ ] Browser console shows successful connection
- [ ] API calls work (check Network tab)

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Add frontend URL to backend CORS config |
| 404 errors | Verify endpoint paths match documentation |
| Network timeout | Check backend is running on Render.com |
| No response | Verify backend URL in `.env` |

## 📚 Documentation Files

- `API_INTEGRATION.md` - Complete API documentation
- `BACKEND_CORS_SETUP.md` - CORS configuration guide
- `INTEGRATION_SUMMARY.md` - Detailed implementation summary
- This file - Quick reference

## ✨ You're Done!

Your frontend is now configured to call your backend. Just make sure:
1. Backend has CORS configured ✅
2. Backend endpoints match the expected structure ✅
3. Environment variables are set ✅

**Need help?** Check the detailed documentation files listed above.
