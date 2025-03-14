
import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
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
              <a href="#" className="text-white/70 hover:text-secondary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-secondary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-secondary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-secondary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-white/70 hover:text-secondary transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="text-white/70 hover:text-secondary transition-colors">
                  Cómo Funciona
                </a>
              </li>
              <li>
                <a href="#beneficios" className="text-white/70 hover:text-secondary transition-colors">
                  Beneficios
                </a>
              </li>
              <li>
                <a href="#testimonios" className="text-white/70 hover:text-secondary transition-colors">
                  Testimonios
                </a>
              </li>
              <li>
                <a href="#comparacion" className="text-white/70 hover:text-secondary transition-colors">
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
                <a href="#" className="text-white/70 hover:text-secondary transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-secondary transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-secondary transition-colors">
                  Política de Cookies
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-secondary transition-colors">
                  FAQ
                </a>
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
  );
};

export default Footer;
