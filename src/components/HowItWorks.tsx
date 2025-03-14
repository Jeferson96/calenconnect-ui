
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, Clock, Calendar, Bell, ArrowRight, UserCircle, CalendarRange } from "lucide-react";

const HowItWorks = () => {
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
    <section id="como-funciona" className="section-padding relative overflow-hidden bg-accent/50">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-secondary/10 rounded-full filter blur-3xl opacity-60" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl opacity-50" />
      
      <div className="container mx-auto relative">
        <div 
          ref={(el) => elementsRef.current[0] = el}
          className="opacity-0 text-center mb-16"
        >
          <h2 className="section-title">Cómo Funciona el Sistema</h2>
          <p className="section-subtitle">
            Un proceso simple y eficiente diseñado para ambas partes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* For Patients */}
          <div 
            ref={(el) => elementsRef.current[1] = el}
            className="opacity-0"
          >
            <div className="glass-card p-6 md:p-8 rounded-3xl">
              <div className="bg-secondary/20 text-secondary-foreground w-fit px-4 py-1 rounded-full text-sm font-medium mb-8">
                Para Pacientes
              </div>
              
              <div className="space-y-8">
                <Step 
                  number={1}
                  icon={<UserCircle className="h-6 w-6 text-secondary" />}
                  title="Elige un profesional"
                  description="Selecciona al especialista que necesitas según tu disponibilidad y preferencias."
                />
                
                <Step 
                  number={2}
                  icon={<Calendar className="h-6 w-6 text-secondary" />}
                  title="Selecciona fecha y hora"
                  description="Visualiza los horarios disponibles en tiempo real y escoge el que mejor se adapte a ti."
                />
                
                <Step 
                  number={3}
                  icon={<Check className="h-6 w-6 text-secondary" />}
                  title="Confirma la cita"
                  description="Recibe una notificación instantánea de confirmación a tu correo o teléfono."
                />
              </div>
            </div>
          </div>
          
          {/* For Professionals */}
          <div 
            ref={(el) => elementsRef.current[2] = el}
            className="opacity-0"
          >
            <div className="glass-card p-6 md:p-8 rounded-3xl">
              <div className="bg-primary/20 text-foreground w-fit px-4 py-1 rounded-full text-sm font-medium mb-8">
                Para Profesionales
              </div>
              
              <div className="space-y-8">
                <Step 
                  number={1}
                  icon={<CalendarRange className="h-6 w-6 text-secondary" />}
                  title="Configura tu disponibilidad"
                  description="Define tus horarios y bloquea fechas específicas según tus necesidades."
                />
                
                <Step 
                  number={2}
                  icon={<Clock className="h-6 w-6 text-secondary" />}
                  title="Gestiona tus citas"
                  description="Accede a un panel intuitivo para administrar todas tus reservas."
                />
                
                <Step 
                  number={3}
                  icon={<Bell className="h-6 w-6 text-secondary" />}
                  title="Recibe notificaciones"
                  description="Mantente informado de nuevas reservas o cancelaciones automáticamente."
                />
              </div>
            </div>
          </div>
        </div>
        
        <div 
          ref={(el) => elementsRef.current[3] = el}
          className="opacity-0 flex justify-center mt-12"
        >
          <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary-foreground">
            Comenzar Ahora <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Step = ({ number, icon, title, description }: StepProps) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background shadow-sm mr-4 shrink-0">
        <span className="font-semibold">{number}</span>
      </div>
      
      <div>
        <div className="flex items-center mb-2">
          {icon}
          <h3 className="font-semibold text-lg ml-2">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default HowItWorks;
