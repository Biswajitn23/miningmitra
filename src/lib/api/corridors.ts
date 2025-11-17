import { apiClient } from './config';

export interface Corridor {
  id: string;
  name: string;
  from_location: string;
  to_location: string;
  score: number;
  risk_level: string;
  pollution: number;
  green_cover: number;
  temperature: number;
  traffic: number;
  compliance: number;
  latitude: number;
  longitude: number;
  route_end_lat: number;
  route_end_lng: number;
  created_at: string;
  updated_at: string;
}

export type CorridorInsert = Omit<Corridor, 'id' | 'created_at' | 'updated_at'>;
export type CorridorUpdate = Partial<CorridorInsert>;

// Get all corridors
export const getCorridors = async (): Promise<Corridor[]> => {
  const response = await apiClient.get('/api/corridors');
  return response.data;
};

// Get corridor by ID
export const getCorridorById = async (id: string): Promise<Corridor> => {
  const response = await apiClient.get(`/api/corridors/${id}`);
  return response.data;
};

// Get corridors by risk level
export const getCorridorsByRiskLevel = async (riskLevel: string): Promise<Corridor[]> => {
  const response = await apiClient.get(`/api/corridors?risk_level=${riskLevel}`);
  return response.data;
};

// Add new corridor
export const addCorridor = async (corridor: CorridorInsert): Promise<Corridor> => {
  const response = await apiClient.post('/api/corridors', corridor);
  return response.data;
};

// Update corridor
export const updateCorridor = async (id: string, updates: CorridorUpdate): Promise<Corridor> => {
  const response = await apiClient.put(`/api/corridors/${id}`, updates);
  return response.data;
};

// Delete corridor
export const deleteCorridor = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/corridors/${id}`);
};

// Get corridor history
export const getCorridorHistory = async (corridorId: string, limit = 10) => {
  const response = await apiClient.get(`/api/corridors/${corridorId}/history?limit=${limit}`);
  return response.data;
};

// Add corridor history record
export const addCorridorHistory = async (corridorId: string, score: number, pollution: number) => {
  const response = await apiClient.post(`/api/corridors/${corridorId}/history`, {
    score,
    pollution,
  });
  return response.data;
};

// Get average metrics across all corridors
export const getAverageMetrics = async () => {
  const response = await apiClient.get('/api/corridors/metrics/average');
  return response.data;
};
