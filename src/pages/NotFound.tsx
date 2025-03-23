
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { MapPinOff, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuario intentó acceder a ruta no existente:",
      location.pathname
    );
  }, [location.pathname]);

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

  const iconVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        className="text-center space-y-6 max-w-lg"
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
              className="absolute inset-0 rounded-full bg-destructive/20 -z-10"
              variants={pulseVariants}
              animate="pulse"
            />
            <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center border border-border">
              <motion.div variants={iconVariants} animate="float">
                <MapPinOff size={48} className="text-destructive" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.h1 
          className="text-5xl font-bold tracking-tight"
          variants={itemVariants}
          custom={2}
        >
          404
        </motion.h1>

        <motion.h2 
          className="text-2xl font-medium"
          variants={itemVariants}
          custom={3}
        >
          Página no encontrada
        </motion.h2>

        <motion.p 
          className="text-muted-foreground"
          variants={itemVariants}
          custom={4}
        >
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </motion.p>

        <motion.div 
          className="pt-4"
          variants={itemVariants}
          custom={5}
        >
          <Card>
            <CardContent className="pt-6 pb-4">
              <p className="text-muted-foreground mb-2">¿Qué deseas hacer ahora?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                <Button asChild variant="default">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Ir al inicio
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to={-1 as any}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver atrás
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p 
          className="text-sm text-muted-foreground pt-6"
          variants={itemVariants}
          custom={6}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1 } }}
        >
          Ruta: <code className="bg-muted px-1 py-0.5 rounded text-xs">{location.pathname}</code>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;
