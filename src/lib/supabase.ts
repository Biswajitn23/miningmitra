import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Database features will be disabled.');
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Database types (will be updated based on your schema)
export interface Database {
  public: {
    Tables: {
      workers: {
        Row: {
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
        };
        Insert: Omit<Database['public']['Tables']['workers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['workers']['Insert']>;
      };
      machinery: {
        Row: {
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
        };
        Insert: Omit<Database['public']['Tables']['machinery']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['machinery']['Insert']>;
      };
      incidents: {
        Row: {
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
        };
        Insert: Omit<Database['public']['Tables']['incidents']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['incidents']['Insert']>;
      };
      corridors: {
        Row: {
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
        };
        Insert: Omit<Database['public']['Tables']['corridors']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['corridors']['Insert']>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Helper function to check connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('workers').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
};

// Real-time subscription helpers
export const subscribeToWorkers = (callback: (payload: any) => void) => {
  return supabase
    .channel('workers-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'workers' }, callback)
    .subscribe();
};

export const subscribeToIncidents = (callback: (payload: any) => void) => {
  return supabase
    .channel('incidents-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, callback)
    .subscribe();
};

export const subscribeToMachinery = (callback: (payload: any) => void) => {
  return supabase
    .channel('machinery-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'machinery' }, callback)
    .subscribe();
};
