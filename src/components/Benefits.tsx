
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Bell, Layout, Calendar, ArrowRight } from "lucide-react";

const Benefits = () => {
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    elementsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      elementsRef.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section id="beneficios" className="section-padding relative overflow-hidden">
      <div className="container mx-auto relative">
        <div 
          ref={(el) => elementsRef.current[0] = el}
          className="opacity-0 text-center mb-16"
        >
          <h2 className="section-title">Beneficios Claves</h2>
          <p className="section-subtitle">
            Descubre por qué CalenConnect es la mejor opción para la gestión de tus citas
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <BenefitCard 
            ref={(el) => elementsRef.current[1] = el}
            icon={<Clock size={24} />}
            title="Disponibilidad en Tiempo Real"
            description="Sincronización automática que muestra solo los horarios realmente disponibles."
            delay="delay-0"
          />
          
          <BenefitCard 
            ref={(el) => elementsRef.current[2] = el}
            icon={<Bell size={24} />}
            title="Notificaciones Inteligentes"
            description="Alertas personalizadas por correo y plataforma para no perder ninguna cita."
            delay="delay-100"
          />
          
          <BenefitCard 
            ref={(el) => elementsRef.current[3] = el}
            icon={<Layout size={24} />}
            title="Interfaz Intuitiva"
            description="Experiencia de usuario optimizada para todos los dispositivos y niveles de habilidad."
            delay="delay-200"
          />
          
          <BenefitCard 
            ref={(el) => elementsRef.current[4] = el}
            icon={<Calendar size={24} />}
            title="Gestión Flexible de Horarios"
            description="Bloquea fechas y franjas horarias con facilidad según tus necesidades específicas."
            delay="delay-300"
          />
        </div>
        
        <div 
          ref={(el) => elementsRef.current[5] = el}
          className="opacity-0 flex justify-center mt-12"
        >
          <Button variant="outline" className="border-secondary hover:bg-secondary/10">
            Descubrir Más <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const BenefitCard = React.forwardRef<HTMLDivElement, BenefitCardProps>(
  ({ icon, title, description, delay }, ref) => {
    return (
      <div 
        ref={ref}
        className="opacity-0 glass-card p-6 rounded-xl transition-all duration-300 hover:translate-y-[-5px]"
      >
        <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4 text-secondary">
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    );
  }
);

BenefitCard.displayName = "BenefitCard";

export default Benefits;
