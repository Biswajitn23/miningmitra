# Backend CORS Configuration

## Required CORS Setup for Express.js Backend

Add this to your backend server (usually in `server.js` or `app.js`):

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',           // Vite dev server
      'http://localhost:3000',           // Alternative dev port
      'http://localhost:5174',           // Alternative Vite port
      'https://miningmitra.vercel.app',  // Production Vercel
      // Add your custom domain if you have one
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,                     // Enable cookies/credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parser middleware (must come after CORS)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes here
// ...

module.exports = app;
```

## Alternative: Simple CORS for Development

If you want to allow all origins during development (not recommended for production):

```javascript
const cors = require('cors');

// Development only - allows all origins
app.use(cors({
  origin: true,
  credentials: true,
}));
```

## For Production on Render.com

Make sure your Render.com backend environment variables include:

```env
NODE_ENV=production
PORT=10000
# Add your frontend URL
FRONTEND_URL=https://miningmitra.vercel.app
```

Then in your CORS config:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

## Testing CORS

After deploying, test CORS with:

```bash
# Test from command line
curl -H "Origin: https://miningmitra.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://backend-b3ru.onrender.com/health \
  --verbose
```

Look for these headers in the response:
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Credentials`

## Common CORS Issues

### Issue 1: "No 'Access-Control-Allow-Origin' header"
**Solution**: Ensure CORS middleware is applied before your routes

### Issue 2: "Credentials flag is true, but origin is '*'"
**Solution**: Specify exact origins instead of wildcard when using credentials

### Issue 3: Preflight OPTIONS request fails
**Solution**: Add explicit OPTIONS handler: `app.options('*', cors())`

### Issue 4: CORS works locally but not in production
**Solution**: Add your production domain to allowedOrigins array

## Installing CORS Package

If you haven't installed the CORS package:

```bash
npm install cors
# or
yarn add cors
```

## Health Check Endpoint

Make sure your backend has a health check endpoint:

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'MiningMitra Backend API',
  });
});
```
