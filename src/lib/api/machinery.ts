import { supabase, Database } from '@/lib/supabase';

type Machinery = Database['public']['Tables']['machinery']['Row'];
type MachineryInsert = Database['public']['Tables']['machinery']['Insert'];
type MachineryUpdate = Database['public']['Tables']['machinery']['Update'];

// Get all machinery
export const getMachinery = async () => {
  const { data, error } = await supabase
    .from('machinery')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Machinery[];
};

// Get machinery by ID
export const getMachineryById = async (id: string) => {
  const { data, error } = await supabase
    .from('machinery')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Machinery;
};

// Get machinery by status
export const getMachineryByStatus = async (status: string) => {
  const { data, error } = await supabase
    .from('machinery')
    .select('*')
    .eq('status', status)
    .order('health', { ascending: true });

  if (error) throw error;
  return data as Machinery[];
};

// Get critical machinery (health < 60)
export const getCriticalMachinery = async () => {
  const { data, error } = await supabase
    .from('machinery')
    .select('*')
    .lt('health', 60)
    .order('health', { ascending: true });

  if (error) throw error;
  return data as Machinery[];
};

// Add new machinery
export const addMachinery = async (machinery: MachineryInsert) => {
  const { data, error } = await supabase
    .from('machinery')
    .insert(machinery)
    .select()
    .single();

  if (error) throw error;
  return data as Machinery;
};

// Update machinery
export const updateMachinery = async (id: string, updates: MachineryUpdate) => {
  const { data, error } = await supabase
    .from('machinery')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Machinery;
};

// Delete machinery
export const deleteMachinery = async (id: string) => {
  const { error } = await supabase
    .from('machinery')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Get machinery performance history
export const getMachineryPerformance = async (machineryId: string, limit = 10) => {
  const { data, error } = await supabase
    .from('machinery_performance')
    .select('*')
    .eq('machinery_id', machineryId)
    .order('recorded_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

// Add performance record
export const addPerformanceRecord = async (machineryId: string, health: number, efficiency: number) => {
  const { data, error } = await supabase
    .from('machinery_performance')
    .insert({
      machinery_id: machineryId,
      health,
      efficiency,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
