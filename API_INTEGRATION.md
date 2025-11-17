# API Integration Guide

## Overview
This frontend application is now configured to communicate with the backend API at `https://backend-b3ru.onrender.com`.

## Configuration

### Environment Variables
Create a `.env` file in the root directory with:

```env
VITE_BACKEND_URL=https://backend-b3ru.onrender.com
```

### API Client
The application uses Axios with the following configuration:
- **Base URL**: Configured via `VITE_BACKEND_URL`
- **Timeout**: 30 seconds
- **CORS**: Credentials enabled (`withCredentials: true`)
- **Headers**: `Content-Type: application/json`

## API Endpoints

### Workers
- `GET /api/workers` - Get all workers
- `GET /api/workers/:id` - Get worker by ID
- `GET /api/workers?status={status}` - Get workers by status
- `GET /api/workers?zone={zone}` - Get workers by zone
- `GET /api/workers/critical` - Get workers with critical health status
- `POST /api/workers` - Create new worker
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Delete worker

### Machinery
- `GET /api/machinery` - Get all machinery
- `GET /api/machinery/:id` - Get machinery by ID
- `GET /api/machinery?status={status}` - Get machinery by status
- `GET /api/machinery/critical` - Get critical machinery (health < 60)
- `GET /api/machinery/:id/performance?limit={limit}` - Get performance history
- `POST /api/machinery` - Create new machinery
- `POST /api/machinery/:id/performance` - Add performance record
- `PUT /api/machinery/:id` - Update machinery
- `DELETE /api/machinery/:id` - Delete machinery

### Incidents
- `GET /api/incidents` - Get all incidents
- `GET /api/incidents/:id` - Get incident by ID
- `GET /api/incidents?status={status}` - Get incidents by status
- `GET /api/incidents?severity={severity}` - Get incidents by severity
- `GET /api/incidents?zone={zone}` - Get incidents by zone
- `GET /api/incidents/active` - Get active incidents
- `GET /api/incidents/critical` - Get critical incidents
- `GET /api/incidents/heatmap` - Get incidents count by zone
- `POST /api/incidents` - Create new incident
- `PUT /api/incidents/:id` - Update incident
- `DELETE /api/incidents/:id` - Delete incident

### Corridors
- `GET /api/corridors` - Get all corridors
- `GET /api/corridors/:id` - Get corridor by ID
- `GET /api/corridors?risk_level={level}` - Get corridors by risk level
- `GET /api/corridors/:id/history?limit={limit}` - Get corridor history
- `GET /api/corridors/metrics/average` - Get average metrics
- `POST /api/corridors` - Create new corridor
- `POST /api/corridors/:id/history` - Add corridor history record
- `PUT /api/corridors/:id` - Update corridor
- `DELETE /api/corridors/:id` - Delete corridor

### Health Check
- `GET /health` - Check backend status

## CORS Configuration Required

The backend must have CORS configured to accept requests from your frontend domain. The backend should allow:

```javascript
// Example CORS configuration for Node.js/Express
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000',
    'https://your-frontend-domain.com', // Production domain
    'https://your-frontend-domain.vercel.app', // Vercel deployment
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## Usage in Components

Import the API functions from the respective modules:

```typescript
import { getWorkers, addWorker, updateWorker } from '@/lib/api/workers';
import { getMachinery, getCriticalMachinery } from '@/lib/api/machinery';
import { getIncidents, addIncident } from '@/lib/api/incidents';
import { getCorridors, getAverageMetrics } from '@/lib/api/corridors';

// Example usage
const fetchData = async () => {
  try {
    const workers = await getWorkers();
    const critical = await getCriticalMachinery();
    console.log('Workers:', workers);
    console.log('Critical Machinery:', critical);
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

## Error Handling

The API client includes interceptors for error handling:
- **Response Errors**: Logs status code and error data
- **Network Errors**: Logs when no response is received
- **Request Errors**: Logs errors in request setup

All API functions will throw errors that should be handled in components using try-catch blocks.

## Testing

To verify the backend connection:

1. Open the browser console
2. Look for the message: `✅ Backend connected successfully: {data}`
3. If connection fails, check:
   - Backend URL is correct in `.env`
   - Backend is running and accessible
   - CORS is properly configured on the backend
   - Network connectivity

## Migration Notes

The application has been migrated from Supabase to the REST API backend. The API layer maintains the same function signatures, so components using these functions don't need changes. The main differences:

- **Before**: Direct Supabase queries
- **After**: REST API calls via Axios
- **Benefits**: 
  - Better separation of concerns
  - Centralized error handling
  - Easier backend logic updates
  - More flexible authentication options
