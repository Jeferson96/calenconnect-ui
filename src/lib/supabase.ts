import { createClient } from '@supabase/supabase-js';

// Valores por defecto para el proyecto calenconnect-db
// Estos valores deben ser reemplazados por las variables de entorno en producción
const FALLBACK_SUPABASE_URL = 'https://dvbqvvgltduwpmkwhlcf.supabase.co';

// IMPORTANTE: Debes reemplazar esta clave por tu clave anónima real de Supabase
// La clave debe tener el formato correcto y ser válida para tu proyecto
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2YnF2dmdsdGR1d3Bta3dobGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MzcyMTMsImV4cCI6MjA1NjUxMzIxM30.v3aGxMCUXIaVpXC_9TzTPE_jnnLPNfInhE8UDYFhX14';

// Utiliza las variables de entorno si están disponibles, de lo contrario usa los valores por defecto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

// Comprueba si tenemos valores válidos
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Using fallback values for development.');
}

// Variable para rastrear el estado de la conexión
let isSupabaseConnected = false;

// Crea el cliente de Supabase con opciones mejoradas para manejar errores de red
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: fetch
  },
  // Agregamos retry para intentar reconectar en caso de fallos de red
  db: {
    schema: 'public'
  }
});

// Función para verificar la conexión
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    isSupabaseConnected = !error;
    return isSupabaseConnected;
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    isSupabaseConnected = false;
    return false;
  }
};

// Verificar la conexión inicial y mostrar mensaje
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Error connecting to Supabase:', error.message);
    console.error('Please check if your Supabase API key is valid and if you have internet connectivity.');
    isSupabaseConnected = false;
  } else {
    console.log('Successfully connected to Supabase!');
    isSupabaseConnected = true;
  }
}).catch(err => {
  console.error('Unexpected error during Supabase initialization:', err);
  isSupabaseConnected = false;
});

// Exportamos el estado de la conexión
export const getConnectionStatus = () => isSupabaseConnected;
