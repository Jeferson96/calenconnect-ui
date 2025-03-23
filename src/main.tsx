import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

async function startApp() {
  // En desarrollo, inicializamos el mock service worker
  if (import.meta.env.DEV) {
    const { startMockWorker } = await import('./mocks/browser');
    startMockWorker();
  }
  
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

startApp();
