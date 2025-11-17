import { apiClient } from './config';

export interface Incident {
  id: string;
  type: string;
  severity: string;
  zone: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  status: string;
  affected_workers: number;
  created_at: string;
  updated_at: string;
}

export type IncidentInsert = Omit<Incident, 'id' | 'created_at' | 'updated_at'>;
export type IncidentUpdate = Partial<IncidentInsert>;

// Get all incidents
export const getIncidents = async (): Promise<Incident[]> => {
  const response = await apiClient.get('/api/incidents');
  return response.data;
};

// Get incident by ID
export const getIncidentById = async (id: string): Promise<Incident> => {
  const response = await apiClient.get(`/api/incidents/${id}`);
  return response.data;
};

// Get incidents by status
export const getIncidentsByStatus = async (status: string): Promise<Incident[]> => {
  const response = await apiClient.get(`/api/incidents?status=${status}`);
  return response.data;
};

// Get incidents by severity
export const getIncidentsBySeverity = async (severity: string): Promise<Incident[]> => {
  const response = await apiClient.get(`/api/incidents?severity=${severity}`);
  return response.data;
};

// Get incidents by zone
export const getIncidentsByZone = async (zone: string): Promise<Incident[]> => {
  const response = await apiClient.get(`/api/incidents?zone=${zone}`);
  return response.data;
};

// Get active incidents
export const getActiveIncidents = async (): Promise<Incident[]> => {
  const response = await apiClient.get('/api/incidents/active');
  return response.data;
};

// Get critical incidents
export const getCriticalIncidents = async (): Promise<Incident[]> => {
  const response = await apiClient.get('/api/incidents/critical');
  return response.data;
};

// Add new incident
export const addIncident = async (incident: IncidentInsert): Promise<Incident> => {
  const response = await apiClient.post('/api/incidents', incident);
  return response.data;
};

// Update incident
export const updateIncident = async (id: string, updates: IncidentUpdate): Promise<Incident> => {
  const response = await apiClient.put(`/api/incidents/${id}`, updates);
  return response.data;
};

// Delete incident
export const deleteIncident = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/incidents/${id}`);
};

// Get incidents count by zone (for heatmap)
export const getIncidentsCountByZone = async (): Promise<Record<string, number>> => {
  const response = await apiClient.get('/api/incidents/heatmap');
  return response.data;
};
