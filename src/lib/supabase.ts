
import { createClient } from '@supabase/supabase-js';

// Valores por defecto para el proyecto calenconnect-db
// Estos valores deben ser reemplazados por las variables de entorno en producción
const FALLBACK_SUPABASE_URL = 'https://calenconnect-db.supabase.co';

// IMPORTANTE: Debes reemplazar esta clave por tu clave anónima real de Supabase
// La clave debe tener el formato correcto y ser válida para tu proyecto
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbGVuY29ubmVjdC1kYiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE4ODQ1MjAwLCJleHAiOjIwMzQ0MjEyMDB9.W0YtIbBQZ4BFZXqbBjV-GWrpDNmWg9vUFbPjArhOVKs';

// Utiliza las variables de entorno si están disponibles, de lo contrario usa los valores por defecto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

// Comprueba si tenemos valores válidos
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Using fallback values for development.');
}

// Crea el cliente de Supabase con más opciones para mejorar el manejo de errores
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    // Corregido: Eliminamos el operador spread y simplemente pasamos la función fetch directamente
    fetch: fetch
  }
});

// Verifica la conexión
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Error connecting to Supabase:', error.message);
    console.error('Please check if your Supabase API key is valid and if you have internet connectivity.');
  } else {
    console.log('Successfully connected to Supabase!');
  }
});
