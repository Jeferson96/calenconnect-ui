
import React from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

/**
 * Componente para gestionar las animaciones de transición entre rutas
 * Utiliza AnimatePresence de Framer Motion para animar la entrada y salida de componentes
 */
const AnimatePresenceWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {React.cloneElement(children as React.ReactElement, { key: location.pathname })}
    </AnimatePresence>
  );
};

export default AnimatePresenceWrapper;
