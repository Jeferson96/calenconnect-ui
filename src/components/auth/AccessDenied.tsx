import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldAlertIcon, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AccessDenied = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Animación del icono
  const iconAnimations = {
    rotate: {
      rotate: [0, 15, -15, 10, -10, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
        repeatDelay: 2
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-20 md:pb-6">
      <motion.div
        className="text-center space-y-6 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex justify-center mb-8" 
          variants={itemVariants}
          custom={1}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-secondary/30 -z-10"
              variants={pulseVariants}
              animate="pulse"
            />
            <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center border border-border">
              <motion.div 
                animate={iconAnimations.rotate}
              >
                <ShieldAlertIcon size={48} className="text-secondary" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.h1 
          className="text-4xl font-bold tracking-tight"
          variants={itemVariants}
          custom={2}
        >
          Acceso <span className="text-secondary">Denegado</span>
        </motion.h1>

        <motion.p 
          className="text-lg text-muted-foreground max-w-xl mx-auto"
          variants={itemVariants}
          custom={3}
        >
          No tienes permisos suficientes para acceder a esta página.
        </motion.p>

        <motion.div 
          className="pt-4"
          variants={itemVariants}
          custom={4}
        >
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <ShieldAlertIcon className="text-primary h-5 w-5" />
                Nota importante
              </h3>
              <p className="text-muted-foreground text-left">
                Para acceder a esta sección, necesitas tener los permisos adecuados según tu rol en la plataforma. Si crees que deberías tener acceso, por favor contacta al administrador del sistema.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="pt-8"
          variants={itemVariants}
          custom={5}
        >
          <Button asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccessDenied; 