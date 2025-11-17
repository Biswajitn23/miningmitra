# 🎯 Backend Status: FOUND THE ISSUE!

## Current Status

✅ **Backend is RUNNING** at `https://backend-b3ru.onrender.com`
✅ **Root endpoint works**: Returns `{"message":"MiningMitra Backend Running Successfully"}`
❌ **API endpoints are MISSING**: All `/api/*` endpoints return 404

## The Problem

Your backend server is running but **doesn't have the API endpoints** that the frontend is trying to call.

### Missing Endpoints:
- ❌ `/api/workers` → 404 Not Found
- ❌ `/api/machinery` → 404 Not Found
- ❌ `/api/incidents` → 404 Not Found
- ❌ `/api/corridors` → 404 Not Found

## Solution: Add API Endpoints to Backend

You need to add these endpoints to your backend. Here's a complete example:

### 1. Install Required Packages

```bash
npm install express cors mongoose body-parser
# or if using PostgreSQL
npm install express cors pg
```

### 2. Complete Backend Code Example

Create/update your backend server file (e.g., `server.js` or `index.js`):

```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// ============================================
// CORS Configuration (CRITICAL!)
// ============================================
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://miningmitra.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Health/Root Endpoints
// ============================================
app.get('/', (req, res) => {
  res.json({ 
    message: 'MiningMitra Backend Running Successfully',
    version: '1.0.0',
    endpoints: [
      '/api/workers',
      '/api/machinery',
      '/api/incidents',
      '/api/corridors'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// ============================================
// WORKERS API
// ============================================
app.get('/api/workers', async (req, res) => {
  try {
    // TODO: Fetch from your database
    const workers = [
      {
        id: '1',
        name: 'John Doe',
        role: 'Miner',
        zone: 'Zone A',
        latitude: 23.5820,
        longitude: 87.2718,
        heart_rate: 75,
        temperature: 37.2,
        oxygen_level: 98,
        fatigue_level: 'low',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      // Add more workers...
    ];
    
    res.json(workers);
  } catch (error) {
    console.error('Error fetching workers:', error);
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});

app.get('/api/workers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Fetch specific worker from database
    res.json({ id, name: 'John Doe', status: 'active' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch worker' });
  }
});

app.get('/api/workers/critical', async (req, res) => {
  try {
    // TODO: Fetch workers with critical health status
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch critical workers' });
  }
});

app.post('/api/workers', async (req, res) => {
  try {
    const workerData = req.body;
    // TODO: Save to database
    res.status(201).json({ id: 'new-id', ...workerData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create worker' });
  }
});

app.put('/api/workers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    // TODO: Update in database
    res.json({ id, ...updates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update worker' });
  }
});

app.delete('/api/workers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Delete from database
    res.json({ message: 'Worker deleted', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete worker' });
  }
});

// ============================================
// MACHINERY API
// ============================================
app.get('/api/machinery', async (req, res) => {
  try {
    const machinery = [
      {
        id: '1',
        name: 'Excavator 1',
        type: 'Excavator',
        location: 'Zone A',
        health: 85,
        status: 'operational',
        operating_hours: 1200,
        efficiency: 92,
        vibration: 3.2,
        temperature: 65,
        next_maintenance: '2025-12-01',
        predicted_failure_risk: 'low',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      // Add more machinery...
    ];
    res.json(machinery);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch machinery' });
  }
});

app.get('/api/machinery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ id, name: 'Excavator 1', status: 'operational' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch machinery' });
  }
});

app.get('/api/machinery/critical', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch critical machinery' });
  }
});

app.post('/api/machinery', async (req, res) => {
  try {
    const machineryData = req.body;
    res.status(201).json({ id: 'new-id', ...machineryData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create machinery' });
  }
});

app.put('/api/machinery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    res.json({ id, ...updates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update machinery' });
  }
});

app.delete('/api/machinery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ message: 'Machinery deleted', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete machinery' });
  }
});

// ============================================
// INCIDENTS API
// ============================================
app.get('/api/incidents', async (req, res) => {
  try {
    const incidents = [
      {
        id: '1',
        type: 'Gas Leak',
        severity: 'high',
        zone: 'Zone B',
        latitude: 23.5825,
        longitude: 87.2720,
        title: 'Gas Leak Detected',
        description: 'Elevated methane levels detected',
        status: 'active',
        affected_workers: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      // Add more incidents...
    ];
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

app.get('/api/incidents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ id, type: 'Gas Leak', status: 'active' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch incident' });
  }
});

app.get('/api/incidents/active', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active incidents' });
  }
});

app.get('/api/incidents/critical', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch critical incidents' });
  }
});

app.get('/api/incidents/heatmap', async (req, res) => {
  try {
    res.json({
      'Zone A': 3,
      'Zone B': 5,
      'Zone C': 2,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch heatmap data' });
  }
});

app.post('/api/incidents', async (req, res) => {
  try {
    const incidentData = req.body;
    res.status(201).json({ id: 'new-id', ...incidentData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

app.put('/api/incidents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    res.json({ id, ...updates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update incident' });
  }
});

app.delete('/api/incidents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ message: 'Incident deleted', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete incident' });
  }
});

// ============================================
// CORRIDORS API
// ============================================
app.get('/api/corridors', async (req, res) => {
  try {
    const corridors = [
      {
        id: '1',
        name: 'Main Tunnel',
        from_location: 'Entrance A',
        to_location: 'Zone B',
        score: 75,
        risk_level: 'medium',
        pollution: 45,
        green_cover: 20,
        temperature: 28,
        traffic: 60,
        compliance: 85,
        latitude: 23.5820,
        longitude: 87.2718,
        route_end_lat: 23.5830,
        route_end_lng: 87.2730,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      // Add more corridors...
    ];
    res.json(corridors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch corridors' });
  }
});

app.get('/api/corridors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ id, name: 'Main Tunnel', risk_level: 'medium' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch corridor' });
  }
});

app.get('/api/corridors/metrics/average', async (req, res) => {
  try {
    res.json({
      pollution: 45,
      greenCover: 20,
      temperature: 28,
      traffic: 60,
      compliance: 85,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch average metrics' });
  }
});

app.post('/api/corridors', async (req, res) => {
  try {
    const corridorData = req.body;
    res.status(201).json({ id: 'new-id', ...corridorData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create corridor' });
  }
});

app.put('/api/corridors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    res.json({ id, ...updates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update corridor' });
  }
});

app.delete('/api/corridors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ message: 'Corridor deleted', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete corridor' });
  }
});

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/workers',
      'GET /api/machinery',
      'GET /api/incidents',
      'GET /api/corridors',
    ]
  });
});

// ============================================
// Error Handler
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`✅ MiningMitra Backend running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;
```

### 3. Deploy to Render.com

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add API endpoints"
   git push
   ```

2. **Render.com will auto-deploy** (wait 2-5 minutes)

3. **Verify deployment:**
   - Check Render.com dashboard logs
   - Should see: "✅ MiningMitra Backend running on port 10000"

### 4. Test Endpoints

After deployment, test with:

```bash
curl https://backend-b3ru.onrender.com/api/workers
curl https://backend-b3ru.onrender.com/api/machinery
curl https://backend-b3ru.onrender.com/api/incidents
curl https://backend-b3ru.onrender.com/api/corridors
```

All should return JSON data (not 404).

## Quick Checklist

- [ ] Backend code has all API endpoints
- [ ] CORS is configured with frontend URL
- [ ] Code is pushed to GitHub
- [ ] Render.com has redeployed
- [ ] Test endpoints return data (not 404)
- [ ] Frontend can connect successfully

## Next Steps After Adding Endpoints

1. **Connect to Database** (MongoDB/PostgreSQL)
2. **Replace mock data** with real database queries
3. **Add authentication** (JWT tokens)
4. **Add validation** (joi/express-validator)
5. **Add rate limiting**
6. **Add logging** (winston/morgan)

## Need Help?

If you already have backend code but endpoints are missing:
1. Check your route files
2. Make sure routes are imported and used: `app.use('/api', routes)`
3. Verify endpoint paths match exactly
4. Check for typos in route definitions
