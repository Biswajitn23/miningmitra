import { apiClient } from './config';

export interface Worker {
  id: string;
  name: string;
  role: string;
  zone: string;
  latitude: number;
  longitude: number;
  heart_rate: number;
  temperature: number;
  oxygen_level: number;
  fatigue_level: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export type WorkerInsert = Omit<Worker, 'id' | 'created_at' | 'updated_at'>;
export type WorkerUpdate = Partial<WorkerInsert>;

// Get all workers
export const getWorkers = async (): Promise<Worker[]> => {
  const response = await apiClient.get('/api/workers');
  return response.data;
};

// Get worker by ID
export const getWorkerById = async (id: string): Promise<Worker> => {
  const response = await apiClient.get(`/api/workers/${id}`);
  return response.data;
};

// Get workers by status
export const getWorkersByStatus = async (status: string): Promise<Worker[]> => {
  const response = await apiClient.get(`/api/workers?status=${status}`);
  return response.data;
};

// Get workers by zone
export const getWorkersByZone = async (zone: string): Promise<Worker[]> => {
  const response = await apiClient.get(`/api/workers?zone=${zone}`);
  return response.data;
};

// Add new worker
export const addWorker = async (worker: WorkerInsert): Promise<Worker> => {
  const response = await apiClient.post('/api/workers', worker);
  return response.data;
};

// Update worker
export const updateWorker = async (id: string, updates: WorkerUpdate): Promise<Worker> => {
  const response = await apiClient.put(`/api/workers/${id}`, updates);
  return response.data;
};

// Delete worker
export const deleteWorker = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/workers/${id}`);
};

// Get workers with critical health status
export const getCriticalWorkers = async (): Promise<Worker[]> => {
  const response = await apiClient.get('/api/workers/critical');
  return response.data;
};
