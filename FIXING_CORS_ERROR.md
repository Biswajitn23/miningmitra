# 🚨 FIXING YOUR CORS ERROR

## The Problem

You're getting this error:
```
AxiosError: Network Error
code: "ERR_NETWORK"
```

This is a **CORS (Cross-Origin Resource Sharing)** issue. Your backend at `https://backend-b3ru.onrender.com` is blocking requests from your frontend.

## Why This Happens

Browsers block requests between different domains for security. Since your frontend (`https://miningmitra.vercel.app` or `localhost:5173`) and backend (`https://backend-b3ru.onrender.com`) are on different domains, your backend needs to explicitly allow requests from your frontend.

## ✅ The Solution

### Step 1: Install CORS Package on Backend

SSH into your backend or update your code:

```bash
npm install cors
```

### Step 2: Add CORS Configuration to Backend

In your main server file (usually `server.js`, `app.js`, or `index.js`), add this **BEFORE** your routes:

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// ⬇️ ADD THIS CORS CONFIGURATION ⬇️
const corsOptions = {
  origin: [
    'http://localhost:5173',              // Local development
    'http://localhost:5174',              // Alternative local port
    'http://localhost:3000',              // Alternative local port
    'https://miningmitra.vercel.app',     // Your Vercel production
  ],
  credentials: true,                      // IMPORTANT: Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));      // Handle preflight requests

// Body parser (MUST come after CORS)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes here
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ... rest of your routes
```

### Step 3: Redeploy Backend on Render.com

1. Commit and push your changes to GitHub
2. Render.com will auto-deploy
3. Wait for deployment to complete (~2-5 minutes)

### Step 4: Test the Connection

#### Option A: Use the Test HTML File
Open `test-backend.html` in your browser and run the tests.

#### Option B: Test with curl
```bash
curl -H "Origin: https://miningmitra.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://backend-b3ru.onrender.com/health \
  --verbose
```

Look for these headers in the response:
```
Access-Control-Allow-Origin: https://miningmitra.vercel.app
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
```

#### Option C: Test in Browser Console
```javascript
fetch('https://backend-b3ru.onrender.com/health', {
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.error('❌ Failed:', err));
```

## 🔍 Troubleshooting

### Still Getting CORS Error After Adding Configuration?

1. **Make sure CORS is installed:**
   ```bash
   npm list cors
   ```

2. **Check package.json has cors:**
   ```json
   "dependencies": {
     "cors": "^2.8.5"
   }
   ```

3. **Verify CORS is applied BEFORE routes:**
   ```javascript
   app.use(cors(corsOptions));  // ← Must be here
   app.use(express.json());     // ← After CORS
   
   // Routes come after
   app.get('/api/workers', ...);
   ```

4. **Check Render.com deployment logs:**
   - Go to Render.com dashboard
   - Click on your backend service
   - Check "Logs" tab for errors

5. **Verify your origin URL is correct:**
   - Check `https://miningmitra.vercel.app` (no trailing slash)
   - Make sure it matches your actual Vercel URL

### Backend Returns 404 for All Endpoints?

Your endpoints might not be set up. Verify these exist:

```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/workers', (req, res) => {
  // Your logic here
});

app.get('/api/machinery', (req, res) => {
  // Your logic here
});

// etc...
```

### Getting "Cannot GET /api/workers"?

Check your route definitions:
```javascript
// ✅ Correct
app.get('/api/workers', ...);

// ❌ Wrong - missing leading slash
app.get('api/workers', ...);

// ❌ Wrong - wrong method
app.post('/api/workers', ...);  // This won't respond to GET
```

## 📝 Complete Backend Example

Here's a minimal working backend with CORS:

```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://miningmitra.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

// Body parser
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Workers endpoint
app.get('/api/workers', (req, res) => {
  res.json([
    { id: '1', name: 'John Doe', status: 'active' },
    // ... your data
  ]);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

## 🎯 Quick Checklist

- [ ] Install `cors` package on backend
- [ ] Add CORS configuration with your frontend URLs
- [ ] Place CORS middleware BEFORE routes
- [ ] Add `app.options('*', cors())` for preflight
- [ ] Commit and push to GitHub
- [ ] Wait for Render.com to redeploy
- [ ] Test with `test-backend.html` or browser console
- [ ] Check browser console shows "✅ Backend connected successfully"

## 🆘 Still Not Working?

1. Check Render.com service status (might be sleeping)
2. Share your backend code (especially CORS section)
3. Check browser DevTools → Network tab → Look at the failed request headers
4. Share the exact error message from browser console

## 📚 Additional Resources

- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS Package](https://www.npmjs.com/package/cors)
- [Render.com Documentation](https://render.com/docs)
