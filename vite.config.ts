
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Asegurarse de que las variables de entorno estén disponibles
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://calenconnect-db.supabase.co'),
    // Si no hay una variable de entorno, usamos la misma clave que en supabase.ts
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbGVuY29ubmVjdC1kYiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE4ODQ1MjAwLCJleHAiOjIwMzQ0MjEyMDB9.W0YtIbBQZ4BFZXqbBjV-GWrpDNmWg9vUFbPjArhOVKs'),
  }
}));
