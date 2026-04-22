import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ShoppingBag, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

const navLinks: { href: string; label: string; submenu?: { href: string; label: string }[] }[] = [
  { href: "/", label: "Accueil" },
  {
    href: "/produits",
    label: "Produits",
    submenu: [
      { href: "/produits?category=tricycle", label: "Tricycles" },
      { href: "/produits?category=moto", label: "Motos" },
      { href: "/produits?category=piece", label: "Pièces détachées" },
    ],
  },
  { href: "/depannage", label: "Dépannage" },
  { href: "/a-propos", label: "À Propos" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => location.pathname === href.split("?")[0];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border" : "bg-transparent"
      }`}
    >
      {/* Top Bar */}
      <div
        className={`hidden md:block bg-primary text-primary-foreground text-sm transition-all duration-300 ${
          isScrolled ? "h-0 overflow-hidden" : "h-10"
        }`}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <span>Livraison gratuite sur Dakar pour toute commande</span>
          <a href="tel:+221781094091" className="flex items-center gap-1 hover:underline">
            <Phone className="w-3 h-3" />
            +221 781 094 091
          </a>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-20">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 md:w-11 md:h-11 rounded-xl overflow-hidden shadow-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-black text-lg"
            >
              H
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg leading-tight text-foreground">Hasilaza Motor</span>
              <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">Leader au Sénégal</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.submenu && setActiveSubmenu(link.label)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  to={link.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1 ${
                    isActive(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.label}
                  {link.submenu && <ChevronDown className="w-4 h-4" />}
                </Link>

                <AnimatePresence>
                  {link.submenu && activeSubmenu === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 pt-2"
                    >
                      <div className="bg-background rounded-xl shadow-xl border border-border p-2 min-w-[200px]">
                        {link.submenu.map((sublink) => (
                          <Link
                            key={sublink.href}
                            to={sublink.href}
                            className="block px-4 py-2 rounded-lg text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                          >
                            {sublink.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild className="border-primary/30 hover:border-primary hover:bg-primary/5 bg-transparent">
              <Link to="/produits" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Catalogue
              </Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant">
              <a
                href="https://wa.me/221781094091?text=Bonjour, je suis intéressé par vos produits"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp
              </a>
            </Button>
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg hover:bg-muted"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Link
                      to={link.href}
                      className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive(link.href)
                          ? "text-primary bg-primary/10"
                          : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.submenu && (
                      <div className="ml-4 mt-1 space-y-1">
                        {link.submenu.map((sublink) => (
                          <Link
                            key={sublink.href}
                            to={sublink.href}
                            className="block px-4 py-2 text-sm text-foreground/60 hover:text-primary transition-colors"
                          >
                            {sublink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </nav>

              <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-border">
                <a href="tel:+221781094091" className="flex items-center gap-3 text-primary font-semibold px-4 py-2">
                  <Phone className="w-5 h-5" />
                  +221 781 094 091
                </a>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
                  <a
                    href="https://wa.me/221781094091?text=Bonjour, je suis intéressé par vos produits"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    Discuter sur WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
