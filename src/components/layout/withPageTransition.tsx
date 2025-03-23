
import React from "react";
import PageTransition from "./PageTransition";

/**
 * HOC para agregar animaciones de transición a los componentes de página
 * @param Component Componente de página a envolver con animaciones
 * @returns Componente envuelto con animaciones de transición
 */
function withPageTransition<P extends object>(Component: React.ComponentType<P>) {
  return function WithPageTransitionComponent(props: P) {
    return (
      <PageTransition>
        <Component {...props} />
      </PageTransition>
    );
  };
}

export default withPageTransition;
