import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, MapPin, Facebook, ArrowUp } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

const quickLinks = [
  { href: "/", label: "Accueil" },
  { href: "/produits", label: "Tous les produits" },
  { href: "/produits?category=tricycle", label: "Tricycles" },
  { href: "/produits?category=moto", label: "Motos" },
  { href: "/produits?category=piece", label: "Pièces détachées" },
];

const companyLinks = [
  { href: "/a-propos", label: "Qui sommes-nous" },
  { href: "/depannage", label: "Dépannage & Réparation" },
  { href: "/contact", label: "Contactez-nous" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-confidentialite", label: "Politique de confidentialité" },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      {/* CTA */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/10 rounded-2xl p-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">Prêt à passer commande ?</h3>
              <p className="text-background/70">Contactez-nous dès maintenant pour un devis personnalisé</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:+221781094091"
                className="px-6 py-3 bg-background text-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-background/90 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Appelez-nous
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/221781094091?text=Bonjour, je souhaite passer commande"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
                WhatsApp
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          <motion.div variants={fadeInUp}>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-black text-xl">
                H
              </div>
              <div>
                <span className="font-bold text-xl block">Hasilaza Motor</span>
                <span className="text-xs text-background/50">Depuis 2018</span>
              </div>
            </Link>
            <p className="text-background/70 mb-6 leading-relaxed">
              Entreprise commerciale spécialisée dans l&apos;usinage de tricycles et la grande distribution. Leader de
              la vente de motos et pièces détachées au Sénégal.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/share/1KvPQqW7kd/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@hasilata1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@HasilazaMotor/shorts"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="font-bold text-lg mb-6">Produits</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-background/70 hover:text-primary transition-colors inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="font-bold text-lg mb-6">Entreprise</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-background/70 hover:text-primary transition-colors inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="font-bold text-lg mb-6">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+221781094091" className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="block text-sm text-background/50">Téléphone</span>
                    <span className="font-medium text-background">+221 781 094 091</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:Mortalla581@gmail.com" className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="block text-sm text-background/50">Email</span>
                    <span className="font-medium text-background text-sm">Mortalla581@gmail.com</span>
                  </div>
                </a>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="block text-sm text-background/50">Horaires</span>
                  <span className="font-medium text-background">Lun-Sam : 9h - 18h</span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="block text-sm text-background/50">Adresse</span>
                  <span className="font-medium text-background">HLM 2, Dakar, Sénégal</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/50 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Hasilaza Motor. Tous droits réservés.
              <span className="hidden md:inline"> | </span>
              <span className="block md:inline">Conçu avec passion au Sénégal</span>
            </p>
            <motion.button
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              aria-label="Retour en haut"
              className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <ArrowUp className="w-5 h-5 text-primary-foreground" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
