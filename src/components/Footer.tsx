import React, { useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const [legalDialogOpen, setLegalDialogOpen] = useState(false);
  const [legalContent, setLegalContent] = useState({ title: '', content: '' });

  const showLegalContent = (title: string, content: string) => {
    setLegalContent({ title, content });
    setLegalDialogOpen(true);
  };

  // Función para manejar el scroll a secciones específicas
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Función para manejar los links de redes sociales
  const handleSocialClick = (platform: string) => {
    // En un caso real, aquí irían las URLs reales de las redes sociales
    const socialUrls = {
      facebook: "https://facebook.com/calenconnect",
      twitter: "https://twitter.com/calenconnect",
      instagram: "https://instagram.com/calenconnect",
      linkedin: "https://linkedin.com/company/calenconnect"
    };
    
    window.open(socialUrls[platform as keyof typeof socialUrls], '_blank');
  };

  return (
    <>
      <footer className="bg-primary text-white">
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">C</span>
                </div>
                <span className="font-bold text-xl">CalenConnect</span>
              </div>
              
              <p className="text-white/70 mb-6">
                Sistema inteligente de agendamiento de citas para optimizar la gestión del tiempo entre profesionales y pacientes.
              </p>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleSocialClick('facebook')}
                  className="text-white/70 hover:text-secondary transition-colors"
                  aria-label="Visitar Facebook"
                >
                  <Facebook size={20} />
                </button>
                <button 
                  onClick={() => handleSocialClick('twitter')}
                  className="text-white/70 hover:text-secondary transition-colors"
                  aria-label="Visitar Twitter"
                >
                  <Twitter size={20} />
                </button>
                <button 
                  onClick={() => handleSocialClick('instagram')}
                  className="text-white/70 hover:text-secondary transition-colors"
                  aria-label="Visitar Instagram"
                >
                  <Instagram size={20} />
                </button>
                <button 
                  onClick={() => handleSocialClick('linkedin')}
                  className="text-white/70 hover:text-secondary transition-colors"
                  aria-label="Visitar LinkedIn"
                >
                  <Linkedin size={20} />
                </button>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Enlaces Rápidos</h3>
              <ul className="space-y-4">
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-white/70 hover:text-secondary transition-colors"
                  >
                    Inicio
                  </a>
                </li>
                <li>
                  <a 
                    href="#como-funciona" 
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('como-funciona');
                    }}
                    className="text-white/70 hover:text-secondary transition-colors"
                  >
                    Cómo Funciona
                  </a>
                </li>
                <li>
                  <a 
                    href="#beneficios" 
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('beneficios');
                    }}
                    className="text-white/70 hover:text-secondary transition-colors"
                  >
                    Beneficios
                  </a>
                </li>
                <li>
                  <a 
                    href="#testimonios" 
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('testimonios');
                    }}
                    className="text-white/70 hover:text-secondary transition-colors"
                  >
                    Testimonios
                  </a>
                </li>
                <li>
                  <a 
                    href="#comparacion" 
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('comparacion');
                    }}
                    className="text-white/70 hover:text-secondary transition-colors"
                  >
                    Comparación
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <button 
                    onClick={() => showLegalContent(
                      'Términos y Condiciones',
                      'Estos son los términos y condiciones del servicio de CalenConnect. Al utilizar nuestra plataforma, usted acepta estos términos y condiciones en su totalidad. Si no está de acuerdo con estos términos y condiciones o cualquier parte de estos términos y condiciones, no debe utilizar este servicio...'
                    )}
                    className="text-white/70 hover:text-secondary transition-colors"
                  >
                    Términos y Condiciones
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => showLegalContent(
                      'Política de Privacidad',
                      'En CalenConnect, nos comprometemos a proteger y respetar su privacidad. Esta política, junto con nuestros términos de servicio, establece la base sobre la cual cualquier dato personal que recopilemos de usted, o que usted nos proporcione, será procesado por nosotros...'
                    )}
                    className="text-white/70 hover:text-secondary transition-colors"
                  >
                    Política de Privacidad
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => showLegalContent(
                      'Política de Cookies',
                      'CalenConnect utiliza cookies para mejorar su experiencia en nuestro sitio web. Esta política de cookies explica qué son las cookies, cómo las utilizamos, qué tipos de cookies utilizamos, es decir, la información que recopilamos utilizando cookies y cómo se utiliza esa información...'
                    )}
                    className="text-white/70 hover:text-secondary transition-colors"
                  >
                    Política de Cookies
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => showLegalContent(
                      'Preguntas Frecuentes',
                      'Aquí encontrará respuestas a las preguntas más comunes sobre nuestro servicio, funcionalidad y soporte técnico...'
                    )}
                    className="text-white/70 hover:text-secondary transition-colors"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Contacto</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Mail size={18} className="text-secondary mr-2" />
                  <a href="mailto:info@calenconnect.com" className="text-white/70 hover:text-secondary transition-colors">
                    info@calenconnect.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone size={18} className="text-secondary mr-2" />
                  <a href="tel:+123456789" className="text-white/70 hover:text-secondary transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60 text-sm">
            <p>© {new Date().getFullYear()} CalenConnect. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Legal Content Dialog */}
      <Dialog open={legalDialogOpen} onOpenChange={setLegalDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{legalContent.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground whitespace-pre-line">{legalContent.content}</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Entendido</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;
