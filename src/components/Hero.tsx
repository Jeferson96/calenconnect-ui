
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock, ArrowRight } from "lucide-react";

const Hero = () => {
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
    <section className="min-h-screen pt-24 pb-16 flex items-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-40 right-0 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl opacity-60" />
      <div className="absolute bottom-40 left-0 w-60 h-60 bg-primary/20 rounded-full filter blur-3xl opacity-50" />
      
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Text content */}
        <div 
          ref={(el) => elementsRef.current[0] = el}
          className="opacity-0 flex flex-col items-start space-y-6 max-w-xl"
        >
          <span className="bg-secondary/20 text-secondary-foreground px-4 py-1 rounded-full text-sm font-medium">
            Sistema de Agendamiento de Citas
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold !leading-tight">
            Simplifica la Gestión de 
            <span className="heading-gradient"> Citas y Optimiza </span> 
            tu Disponibilidad
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Una plataforma intuitiva para profesionales y pacientes que facilita la programación y gestión de citas en línea.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary-foreground">
              Agendar una Cita <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-secondary hover:bg-secondary/10">
              Gestionar mi Disponibilidad
            </Button>
          </div>
          
          <div className="flex items-center space-x-4 pt-4">
            <div className="flex items-center">
              <Clock className="text-secondary h-5 w-5 mr-2" />
              <span className="text-sm">Disponibilidad en tiempo real</span>
            </div>
            <div className="flex items-center">
              <CalendarCheck className="text-secondary h-5 w-5 mr-2" />
              <span className="text-sm">Confirmación instantánea</span>
            </div>
          </div>
        </div>
        
        {/* Illustration */}
        <div 
          ref={(el) => elementsRef.current[1] = el}
          className="opacity-0 flex justify-center"
        >
          <div className="relative w-full max-w-lg">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-secondary/30 rounded-full filter blur-3xl opacity-50 animate-pulse-soft" />
            <div className="absolute -bottom-10 right-4 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl opacity-50 animate-pulse-soft animation-delay-1000" />
            
            <div className="relative glass-card p-8 animate-float">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-semibold text-lg">Calendario de Citas</h3>
                  <p className="text-sm text-muted-foreground">Marzo 2023</p>
                </div>
                <CalendarCheck className="text-secondary h-6 w-6" />
              </div>
              
              <div className="grid grid-cols-7 gap-2 mb-6">
                {["L", "M", "X", "J", "V", "S", "D"].map((day, i) => (
                  <div key={i} className="text-xs text-center font-medium">
                    {day}
                  </div>
                ))}
                
                {Array.from({ length: 31 }, (_, i) => (
                  <div 
                    key={i}
                    className={`text-xs rounded-full w-8 h-8 flex items-center justify-center ${
                      i === 9 || i === 17 || i === 24
                        ? "bg-secondary text-primary font-medium"
                        : "hover:bg-muted/50 cursor-pointer"
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-secondary/20 flex items-center">
                  <div className="w-2 h-8 bg-secondary rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Consulta con Dr. López</p>
                    <p className="text-xs text-muted-foreground">10:30 - 11:15</p>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-muted/30 flex items-center">
                  <div className="w-2 h-8 bg-muted-foreground rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Terapia con Dra. Martínez</p>
                    <p className="text-xs text-muted-foreground">16:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
