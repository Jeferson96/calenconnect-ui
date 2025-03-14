
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { authState, signOut } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 lg:px-8",
        scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">C</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">CalenConnect</span>
        </a>
        
        <nav className="hidden md:flex items-center space-x-8">
          <NavLinks />
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          {authState.user ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" className="border-secondary text-foreground hover:bg-secondary/10">
                  Mi Dashboard
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-secondary text-foreground hover:bg-secondary/10"
                onClick={() => signOut()}
              >
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="border-secondary text-foreground hover:bg-secondary/10">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-secondary text-primary hover:bg-secondary/90">
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </div>
        
        <button 
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 top-16 bg-background/95 backdrop-blur-sm z-40 md:hidden">
          <div className="container mx-auto py-8 flex flex-col items-center space-y-8">
            <nav className="flex flex-col items-center space-y-6 text-lg">
              <NavLinks onClick={() => setIsOpen(false)} />
            </nav>
            <div className="flex flex-col space-y-4 w-full max-w-xs">
              {authState.user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="border-secondary text-foreground hover:bg-secondary/10 w-full">
                      Mi Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="border-secondary text-foreground hover:bg-secondary/10 w-full"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="border-secondary text-foreground hover:bg-secondary/10 w-full">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button className="bg-secondary text-primary hover:bg-secondary/90 w-full">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const NavLinks = ({ onClick }: { onClick?: () => void }) => {
  return (
    <>
      <a 
        href="#como-funciona" 
        className="text-foreground hover:text-secondary transition-colors duration-200"
        onClick={onClick}
      >
        Cómo Funciona
      </a>
      <a 
        href="#beneficios" 
        className="text-foreground hover:text-secondary transition-colors duration-200"
        onClick={onClick}
      >
        Beneficios
      </a>
      <a 
        href="#testimonios" 
        className="text-foreground hover:text-secondary transition-colors duration-200"
        onClick={onClick}
      >
        Testimonios
      </a>
      <a 
        href="#comparacion" 
        className="text-foreground hover:text-secondary transition-colors duration-200"
        onClick={onClick}
      >
        Comparación
      </a>
    </>
  );
};

export default Navbar;
