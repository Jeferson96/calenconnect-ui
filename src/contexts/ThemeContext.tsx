import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    // Si hay un tema guardado, usarlo
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Si no hay tema guardado, usar 'dark' por defecto
      // Ya no usamos prefers-color-scheme como criterio
      setTheme('dark');
      document.documentElement.classList.add('dark');
      // Guardar preferencia en localStorage
      localStorage.setItem('theme', 'dark');
    }

    // Aplicar inmediatamente el tema para evitar parpadeos
    const applyTheme = () => {
      const currentTheme = localStorage.getItem('theme') as Theme || 'dark';
      document.documentElement.classList.toggle('dark', currentTheme === 'dark');
    };
    
    // Ejecutar antes de que el DOM se renderice por completo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyTheme);
    } else {
      applyTheme();
    }
    
    return () => {
      document.removeEventListener('DOMContentLoaded', applyTheme);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
