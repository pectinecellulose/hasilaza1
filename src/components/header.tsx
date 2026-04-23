import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

import logo from "@/assets/logo.png";

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
    <>
      {/* Announcement bar */}
      <div className="hidden md:block bg-secondary text-secondary-foreground text-xs">
        <div className="container flex items-center justify-between h-9">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>Livraison gratuite sur Dakar · Garantie 2 ans incluse</span>
          </div>
          <a href="tel:+221769358317" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Phone className="w-3 h-3" />
            +221 76 935 83 17
          </a>
        </div>
      </div>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl backdrop-saturate-150 border-b border-border/60 shadow-elegant"
            : "bg-background/60 backdrop-blur-md border-b border-border/30"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-18">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-md opacity-30 group-hover:opacity-60 transition-opacity" />
                <div className="relative w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center shadow-elegant overflow-hidden p-1">
                  <img src={logo} alt="Logo Hasilaza Motor" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-base md:text-lg text-foreground">Hasilaza</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Motor</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 bg-muted/40 rounded-full p-1.5 border border-border/50">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.submenu && setActiveSubmenu(link.label)}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <Link
                    to={link.href}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                      isActive(link.href)
                        ? "text-primary-foreground"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {isActive(link.href) && (
                      <motion.span
                        layoutId="navActive"
                        className="absolute inset-0 bg-gradient-primary rounded-full shadow-elegant"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                    {link.submenu && <ChevronDown className="relative z-10 w-3.5 h-3.5" />}
                  </Link>

                  <AnimatePresence>
                    {link.submenu && activeSubmenu === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-56"
                      >
                        <div className="bg-card rounded-2xl shadow-ink border border-border p-2">
                          {link.submenu.map((sublink) => (
                            <Link
                              key={sublink.href}
                              to={sublink.href}
                              className="block px-4 py-2.5 rounded-xl text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
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

            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggle />
              <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow rounded-full h-10 px-5">
                <a
                  href="https://wa.me/221769358317?text=Bonjour, je suis intéressé par vos produits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  WhatsApp
                </a>
              </Button>
            </div>

            <div className="lg:hidden flex items-center gap-1">
              <ThemeToggle />
              <button
                className="p-2 rounded-xl hover:bg-muted active:scale-95 transition-all"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border overflow-hidden"
            >
              <div className="container py-5">
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                          isActive(link.href)
                            ? "bg-gradient-primary text-primary-foreground shadow-elegant"
                            : "text-foreground/80 hover:bg-muted"
                        }`}
                      >
                        {link.label}
                      </Link>
                      {link.submenu && (
                        <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-border pl-3">
                          {link.submenu.map((sublink) => (
                            <Link
                              key={sublink.href}
                              to={sublink.href}
                              className="block px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              {sublink.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </nav>

                <div className="flex flex-col gap-2 mt-5 pt-5 border-t border-border">
                  <a
                    href="tel:+221769358317"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 text-foreground"
                  >
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="font-medium">+221 76 935 83 17</span>
                  </a>
                  <a
                    href="tel:+221769358317"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 text-foreground"
                  >
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="font-medium">+221 76 935 83 17</span>
                  </a>
                  <Button asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90 w-full h-12 rounded-xl">
                    <a
                      href="https://wa.me/221769358317?text=Bonjour, je suis intéressé par vos produits"
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
    </>
  );
}

