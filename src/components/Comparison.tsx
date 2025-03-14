
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X } from "lucide-react";

const Comparison = () => {
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
    <section id="comparacion" className="section-padding relative overflow-hidden">
      <div className="container mx-auto relative">
        <div 
          ref={(el) => elementsRef.current[0] = el}
          className="opacity-0 text-center mb-16"
        >
          <h2 className="section-title">Comparación con Otras Soluciones</h2>
          <p className="section-subtitle">
            Descubre cómo CalenConnect se destaca frente a los métodos tradicionales
          </p>
        </div>
        
        <div 
          ref={(el) => elementsRef.current[1] = el}
          className="opacity-0 overflow-x-auto pb-4"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left">Característica</th>
                <th className="p-4 text-center bg-secondary/20 rounded-t-lg font-semibold">CalenConnect</th>
                <th className="p-4 text-center bg-muted/30 rounded-t-lg font-semibold">Métodos Tradicionales</th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow 
                feature="Disponibilidad en tiempo real" 
                ours={true} 
                others={false} 
              />
              <ComparisonRow 
                feature="Notificaciones automáticas" 
                ours={true} 
                others={false} 
              />
              <ComparisonRow 
                feature="Bloqueo de agenda configurable" 
                ours={true} 
                others={false} 
              />
              <ComparisonRow 
                feature="Interfaz moderna y adaptable" 
                ours={true} 
                others={false} 
              />
              <ComparisonRow 
                feature="Integración con otros calendarios" 
                ours={true} 
                others={false} 
              />
              <ComparisonRow 
                feature="Gestión de cancelaciones" 
                ours={true} 
                others={false} 
              />
              <ComparisonRow 
                feature="Acceso desde cualquier dispositivo" 
                ours={true} 
                others={false} 
                last={true}
              />
            </tbody>
          </table>
        </div>
        
        <div 
          ref={(el) => elementsRef.current[2] = el}
          className="opacity-0 flex justify-center mt-12"
        >
          <Button className="bg-secondary hover:bg-secondary/90 text-primary-foreground">
            Pruébalo Gratis <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

interface ComparisonRowProps {
  feature: string;
  ours: boolean;
  others: boolean;
  last?: boolean;
}

const ComparisonRow = ({ feature, ours, others, last = false }: ComparisonRowProps) => {
  return (
    <tr className="border-b border-border/50 last:border-0">
      <td className="p-4 text-left">{feature}</td>
      <td className={`p-4 text-center ${last ? "rounded-b-lg" : ""} bg-secondary/10`}>
        {ours ? (
          <div className="flex justify-center">
            <Check className="text-secondary" size={20} />
          </div>
        ) : (
          <div className="flex justify-center">
            <X className="text-destructive/70" size={20} />
          </div>
        )}
      </td>
      <td className={`p-4 text-center ${last ? "rounded-b-lg" : ""} bg-muted/20`}>
        {others ? (
          <div className="flex justify-center">
            <Check className="text-secondary" size={20} />
          </div>
        ) : (
          <div className="flex justify-center">
            <X className="text-destructive/70" size={20} />
          </div>
        )}
      </td>
    </tr>
  );
};

export default Comparison;
