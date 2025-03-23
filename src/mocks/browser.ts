import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Configurar el service worker
export const worker = setupWorker(...handlers);

// Función para iniciar el worker
export function startMockWorker() {
  if (import.meta.env.DEV) {
    worker.start({
      onUnhandledRequest: 'bypass', // 'warn' para mensajes de advertencia
    }).catch(error => {
      console.error('Error al iniciar el mock service worker:', error);
    });
    
    console.log('[MSW] Mock Service Worker activado');
  }
} 