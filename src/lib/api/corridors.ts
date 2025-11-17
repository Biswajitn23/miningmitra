import { supabase, Database } from '@/lib/supabase';

type Corridor = Database['public']['Tables']['corridors']['Row'];
type CorridorInsert = Database['public']['Tables']['corridors']['Insert'];
type CorridorUpdate = Database['public']['Tables']['corridors']['Update'];

// Get all corridors
export const getCorridors = async () => {
  const { data, error } = await supabase
    .from('corridors')
    .select('*')
    .order('score', { ascending: false });

  if (error) throw error;
  return data as Corridor[];
};

// Get corridor by ID
export const getCorridorById = async (id: string) => {
  const { data, error } = await supabase
    .from('corridors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Corridor;
};

// Get corridors by risk level
export const getCorridorsByRiskLevel = async (riskLevel: string) => {
  const { data, error } = await supabase
    .from('corridors')
    .select('*')
    .eq('risk_level', riskLevel)
    .order('score', { ascending: false });

  if (error) throw error;
  return data as Corridor[];
};

// Add new corridor
export const addCorridor = async (corridor: CorridorInsert) => {
  const { data, error } = await supabase
    .from('corridors')
    .insert(corridor)
    .select()
    .single();

  if (error) throw error;
  return data as Corridor;
};

// Update corridor
export const updateCorridor = async (id: string, updates: CorridorUpdate) => {
  const { data, error } = await supabase
    .from('corridors')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Corridor;
};

// Delete corridor
export const deleteCorridor = async (id: string) => {
  const { error } = await supabase
    .from('corridors')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Get corridor history
export const getCorridorHistory = async (corridorId: string, limit = 10) => {
  const { data, error } = await supabase
    .from('corridor_history')
    .select('*')
    .eq('corridor_id', corridorId)
    .order('recorded_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

// Add corridor history record
export const addCorridorHistory = async (corridorId: string, score: number, pollution: number) => {
  const { data, error } = await supabase
    .from('corridor_history')
    .insert({
      corridor_id: corridorId,
      score,
      pollution,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get average metrics across all corridors
export const getAverageMetrics = async () => {
  const { data, error } = await supabase
    .from('corridors')
    .select('pollution, green_cover, temperature, traffic, compliance');

  if (error) throw error;

  if (!data || data.length === 0) {
    return {
      pollution: 0,
      greenCover: 0,
      temperature: 0,
      traffic: 0,
      compliance: 0,
    };
  }

  const avg = {
    pollution: Math.round(data.reduce((sum, c) => sum + c.pollution, 0) / data.length),
    greenCover: Math.round(data.reduce((sum, c) => sum + c.green_cover, 0) / data.length),
    temperature: Math.round(data.reduce((sum, c) => sum + c.temperature, 0) / data.length),
    traffic: Math.round(data.reduce((sum, c) => sum + c.traffic, 0) / data.length),
    compliance: Math.round(data.reduce((sum, c) => sum + c.compliance, 0) / data.length),
  };

  return avg;
};
