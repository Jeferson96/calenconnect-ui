
import React from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente para aplicar animaciones de transición a las páginas
 * Envuelve el contenido de la página con animaciones fade-in y slide-up
 */
const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.61, 1, 0.88, 1],
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
