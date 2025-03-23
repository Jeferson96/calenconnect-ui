
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Cog, Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const SettingsPage = () => {
  useEffect(() => {
    // Log para fines de seguimiento
    console.log("Usuario accedió a la página de configuración en desarrollo");
  }, []);

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
    rotate: {
      rotate: [0, 15, -15, 10, -10, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
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
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          className="text-center space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="flex justify-center mb-8" 
            variants={itemVariants}
            animate="rotate"
            custom={1}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-secondary/30 -z-10"
                variants={pulseVariants}
                animate="pulse"
              />
              <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center border border-border">
                <motion.div variants={iconVariants} animate="rotate">
                  <Construction size={48} className="text-secondary" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl font-bold tracking-tight"
            variants={itemVariants}
            custom={2}
          >
            Configuración <span className="text-secondary">en desarrollo</span>
          </motion.h1>

          <motion.p 
            className="text-lg text-muted-foreground max-w-xl mx-auto"
            variants={itemVariants}
            custom={3}
          >
            Estamos trabajando para traerte opciones de personalización avanzadas para tu cuenta y preferencias de CalenConnect.
          </motion.p>

          <motion.div 
            className="pt-4"
            variants={itemVariants}
            custom={4}
          >
            <Card className="max-w-lg mx-auto">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Cog className="text-primary h-5 w-5" />
                  Próximamente
                </h3>
                <ul className="space-y-3 text-left">
                  {[
                    "Personalización de notificaciones",
                    "Configuración de privacidad",
                    "Integración con calendario",
                    "Preferencias de idioma",
                    "Administración de dispositivos conectados",
                  ].map((feature, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center gap-2 text-muted-foreground"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: 0.5 + (index * 0.1) }
                      }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
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
    </DashboardLayout>
  );
};

export default SettingsPage;
