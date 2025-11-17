import { apiClient } from './config';

export interface Machinery {
  id: string;
  name: string;
  type: string;
  location: string;
  health: number;
  status: string;
  operating_hours: number;
  efficiency: number;
  vibration: number;
  temperature: number;
  next_maintenance: string;
  predicted_failure_risk: string;
  created_at: string;
  updated_at: string;
}

export type MachineryInsert = Omit<Machinery, 'id' | 'created_at' | 'updated_at'>;
export type MachineryUpdate = Partial<MachineryInsert>;

// Get all machinery
export const getMachinery = async (): Promise<Machinery[]> => {
  const response = await apiClient.get('/api/machinery');
  return response.data;
};

// Get machinery by ID
export const getMachineryById = async (id: string): Promise<Machinery> => {
  const response = await apiClient.get(`/api/machinery/${id}`);
  return response.data;
};

// Get machinery by status
export const getMachineryByStatus = async (status: string): Promise<Machinery[]> => {
  const response = await apiClient.get(`/api/machinery?status=${status}`);
  return response.data;
};

// Get critical machinery (health < 60)
export const getCriticalMachinery = async (): Promise<Machinery[]> => {
  const response = await apiClient.get('/api/machinery/critical');
  return response.data;
};

// Add new machinery
export const addMachinery = async (machinery: MachineryInsert): Promise<Machinery> => {
  const response = await apiClient.post('/api/machinery', machinery);
  return response.data;
};

// Update machinery
export const updateMachinery = async (id: string, updates: MachineryUpdate): Promise<Machinery> => {
  const response = await apiClient.put(`/api/machinery/${id}`, updates);
  return response.data;
};

// Delete machinery
export const deleteMachinery = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/machinery/${id}`);
};

// Get machinery performance history
export const getMachineryPerformance = async (machineryId: string, limit = 10) => {
  const response = await apiClient.get(`/api/machinery/${machineryId}/performance?limit=${limit}`);
  return response.data;
};

// Add performance record
export const addPerformanceRecord = async (machineryId: string, health: number, efficiency: number) => {
  const response = await apiClient.post(`/api/machinery/${machineryId}/performance`, {
    health,
    efficiency,
  });
  return response.data;
};
