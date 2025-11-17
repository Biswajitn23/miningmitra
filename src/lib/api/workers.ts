import { supabase, Database } from '@/lib/supabase';

type Worker = Database['public']['Tables']['workers']['Row'];
type WorkerInsert = Database['public']['Tables']['workers']['Insert'];
type WorkerUpdate = Database['public']['Tables']['workers']['Update'];

// Get all workers
export const getWorkers = async () => {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Worker[];
};

// Get worker by ID
export const getWorkerById = async (id: string) => {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Worker;
};

// Get workers by status
export const getWorkersByStatus = async (status: string) => {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Worker[];
};

// Get workers by zone
export const getWorkersByZone = async (zone: string) => {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('zone', zone)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Worker[];
};

// Add new worker
export const addWorker = async (worker: WorkerInsert) => {
  const { data, error } = await supabase
    .from('workers')
    .insert(worker)
    .select()
    .single();

  if (error) throw error;
  return data as Worker;
};

// Update worker
export const updateWorker = async (id: string, updates: WorkerUpdate) => {
  const { data, error } = await supabase
    .from('workers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Worker;
};

// Delete worker
export const deleteWorker = async (id: string) => {
  const { error } = await supabase
    .from('workers')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Get workers with critical health status
export const getCriticalWorkers = async () => {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .or('heart_rate.gt.100,temperature.gt.38,oxygen_level.lt.95')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Worker[];
};
