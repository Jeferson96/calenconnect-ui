
import { createClient } from '@supabase/supabase-js';

// Valores por defecto para el proyecto calenconnect-db
// Estos valores deben ser reemplazados por las variables de entorno en producción
const FALLBACK_SUPABASE_URL = 'https://calenconnect-db.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbGVuY29ubmVjdC1kYiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE4ODQ1MjAwLCJleHAiOjIwMzQ0MjEyMDB9.placeHolderKey123456789';

// Utiliza las variables de entorno si están disponibles, de lo contrario usa los valores por defecto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

// Comprueba si tenemos valores válidos
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Using fallback values for development.');
}

// Crea el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Verifica la conexión
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Error connecting to Supabase:', error.message);
  } else {
    console.log('Successfully connected to Supabase!');
  }
});
