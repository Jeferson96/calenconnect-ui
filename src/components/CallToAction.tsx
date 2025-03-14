
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
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
    <section className="relative py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-primary/95 -z-10"></div>
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent -z-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/30 rounded-full filter blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl opacity-30 -z-10"></div>
      
      <div className="container mx-auto px-4 relative">
        <div 
          ref={(el) => elementsRef.current[0] = el}
          className="opacity-0 max-w-3xl mx-auto text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
            Empieza a gestionar tus citas de manera inteligente y eficiente desde hoy mismo
          </h2>
          
          <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto">
            Simplifica tu agenda, optimiza tu tiempo y mejora la experiencia de tus pacientes con nuestra plataforma intuitiva
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary-foreground">
              Registrarme Gratis <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Solicitar una Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
