
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

const Testimonials = () => {
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
    <section id="testimonios" className="section-padding relative overflow-hidden bg-accent/50">
      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-secondary/10 rounded-full filter blur-3xl opacity-60" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl opacity-50" />
      
      <div className="container mx-auto relative">
        <div 
          ref={(el) => elementsRef.current[0] = el}
          className="opacity-0 text-center mb-16"
        >
          <h2 className="section-title">Testimonios de Usuarios</h2>
          <p className="section-subtitle">
            Descubre lo que dicen nuestros usuarios sobre la experiencia con CalenConnect
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TestimonialCard 
            ref={(el) => elementsRef.current[1] = el}
            quote="Antes era difícil encontrar disponibilidad con mi psicólogo, ahora todo es rápido y fácil. Ya no tengo que hacer llamadas o enviar mensajes para coordinar."
            name="María López"
            role="Paciente"
            rating={5}
          />
          
          <TestimonialCard 
            ref={(el) => elementsRef.current[2] = el}
            quote="Gracias a este sistema, gestiono mi agenda sin preocupaciones. La reducción de citas perdidas ha mejorado considerablemente mi productividad diaria."
            name="Dr. Carlos Mendoza"
            role="Psicólogo"
            rating={5}
          />
          
          <TestimonialCard 
            ref={(el) => elementsRef.current[3] = el}
            quote="La interfaz es intuitiva y moderna. Como nutricionista, puedo gestionar mis citas desde cualquier dispositivo con extrema facilidad."
            name="Ana Martínez"
            role="Nutricionista"
            rating={5}
          />
          
          <TestimonialCard 
            ref={(el) => elementsRef.current[4] = el}
            quote="Las notificaciones automáticas han reducido mis cancelaciones en un 60%. La integración con mi calendario personal es perfecta."
            name="José Rodríguez"
            role="Fisioterapeuta"
            rating={5}
          />
        </div>
        
        <div 
          ref={(el) => elementsRef.current[5] = el}
          className="opacity-0 flex justify-center mt-12"
        >
          <Button variant="outline" className="border-secondary hover:bg-secondary/10">
            Ver Más Opiniones <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

const TestimonialCard = React.forwardRef<HTMLDivElement, TestimonialCardProps>(
  ({ quote, name, role, rating }, ref) => {
    return (
      <div 
        ref={ref}
        className="opacity-0 glass-card p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
      >
        <div className="flex text-secondary mb-4">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} size={18} fill="currentColor" />
          ))}
        </div>
        
        <blockquote className="text-lg mb-4">"{quote}"</blockquote>
        
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mr-3">
            {name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    );
  }
);

TestimonialCard.displayName = "TestimonialCard";

export default Testimonials;
