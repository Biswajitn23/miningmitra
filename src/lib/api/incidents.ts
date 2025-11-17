import { supabase, Database } from '@/lib/supabase';

type Incident = Database['public']['Tables']['incidents']['Row'];
type IncidentInsert = Database['public']['Tables']['incidents']['Insert'];
type IncidentUpdate = Database['public']['Tables']['incidents']['Update'];

// Get all incidents
export const getIncidents = async () => {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Incident[];
};

// Get incident by ID
export const getIncidentById = async (id: string) => {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Incident;
};

// Get incidents by status
export const getIncidentsByStatus = async (status: string) => {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Incident[];
};

// Get incidents by severity
export const getIncidentsBySeverity = async (severity: string) => {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('severity', severity)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Incident[];
};

// Get incidents by zone
export const getIncidentsByZone = async (zone: string) => {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('zone', zone)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Incident[];
};

// Get active incidents
export const getActiveIncidents = async () => {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .in('status', ['active', 'investigating'])
    .order('severity', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Incident[];
};

// Get critical incidents
export const getCriticalIncidents = async () => {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('severity', 'critical')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Incident[];
};

// Add new incident
export const addIncident = async (incident: IncidentInsert) => {
  const { data, error } = await supabase
    .from('incidents')
    .insert(incident)
    .select()
    .single();

  if (error) throw error;
  return data as Incident;
};

// Update incident
export const updateIncident = async (id: string, updates: IncidentUpdate) => {
  const { data, error } = await supabase
    .from('incidents')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Incident;
};

// Delete incident
export const deleteIncident = async (id: string) => {
  const { error } = await supabase
    .from('incidents')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Get incidents count by zone (for heatmap)
export const getIncidentsCountByZone = async () => {
  const { data, error } = await supabase
    .from('incidents')
    .select('zone')
    .order('zone');

  if (error) throw error;

  // Count incidents per zone
  const zoneCounts: Record<string, number> = {};
  data?.forEach((incident) => {
    zoneCounts[incident.zone] = (zoneCounts[incident.zone] || 0) + 1;
  });

  return zoneCounts;
};
