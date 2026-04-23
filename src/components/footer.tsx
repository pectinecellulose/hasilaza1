import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, MapPin, Facebook, ArrowUp, ArrowUpRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import logo from "@/assets/logo.png";

const productLinks = [
  { href: "/produits?category=tricycle", label: "Tricycles" },
  { href: "/produits?category=moto", label: "Motos" },
  { href: "/produits?category=piece", label: "Pièces détachées" },
  { href: "/produits", label: "Tout le catalogue" },
];

const companyLinks = [
  { href: "/a-propos", label: "Qui sommes-nous" },
  { href: "/depannage", label: "Dépannage & SAV" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-confidentialite", label: "Confidentialité" },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-secondary text-secondary-foreground overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative container py-20">
        {/* CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mb-20 rounded-3xl overflow-hidden border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-primary" />
          <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12">
            <div>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-3 text-balance">
                Démarrez votre projet aujourd'hui
              </h3>
              <p className="text-primary-foreground/80 max-w-md">
                Notre équipe vous accompagne pour trouver le véhicule parfait, négocier le meilleur prix et organiser la livraison.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:justify-end items-stretch md:items-center gap-3">
              <a
                href="tel:+221769358317"
                className="flex items-center justify-center gap-2 px-6 h-13 py-4 bg-secondary text-secondary-foreground rounded-2xl font-semibold hover:bg-secondary/90 transition-all hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                Appeler
              </a>
              <a
                href="https://wa.me/221769358317?text=Bonjour, je souhaite passer commande"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 h-13 py-4 bg-background text-foreground rounded-2xl font-semibold hover:bg-background/90 transition-all hover:scale-105"
              >
                <WhatsAppIcon className="w-5 h-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        {/* Main grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-glow overflow-hidden p-1.5">
                <img src={logo} alt="Logo Hasilaza Motor" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-display font-bold text-xl block">Hasilaza Motor</span>
                <span className="text-xs text-secondary-foreground/50 uppercase tracking-widest">Depuis 2018</span>
              </div>
            </Link>
            <p className="text-secondary-foreground/70 mb-6 leading-relaxed max-w-sm">
              Leader sénégalais de la vente de tricycles cargo, motos et pièces détachées. Qualité, garantie et SAV expert.
            </p>
            <div className="flex gap-2">
              {[
                { href: "https://www.facebook.com/share/1KvPQqW7kd/", label: "Facebook", icon: <Facebook className="w-4 h-4" /> },
                {
                  href: "https://www.tiktok.com/@hasilata1",
                  label: "TikTok",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" />
                    </svg>
                  ),
                },
                {
                  href: "https://www.youtube.com/@HasilazaMotor/shorts",
                  label: "YouTube",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold mb-5 text-sm uppercase tracking-widest text-secondary-foreground/50">Produits</h4>
            <ul className="space-y-3">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm inline-flex items-center gap-1 group">
                    {l.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold mb-5 text-sm uppercase tracking-widest text-secondary-foreground/50">Société</h4>
            <ul className="space-y-3">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm inline-flex items-center gap-1 group">
                    {l.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-secondary-foreground/60 hover:text-primary transition-colors text-xs">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="font-display font-semibold mb-5 text-sm uppercase tracking-widest text-secondary-foreground/50">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+221769358317" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                    <Phone className="w-4 h-4 group-hover:text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-foreground/50">Téléphone</p>
                    <p className="text-sm font-medium">+221 76 935 83 17</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:hasilazasenegal@gmail.com" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                    <Mail className="w-4 h-4 group-hover:text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-foreground/50">Email</p>
                    <p className="text-sm font-medium">hasilazasenegal@gmail.com</p>
                  </div>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-secondary-foreground/50">Adresse</p>
                  <p className="text-sm font-medium">HLM 2, Dakar, Sénégal</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-secondary-foreground/50">Horaires</p>
                  <p className="text-sm font-medium">Lun – Sam · 9h-18h</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-foreground/50 text-xs">
            © {new Date().getFullYear()} Hasilaza Motor — Tous droits réservés. Conçu avec passion au Sénégal.
          </p>
          <button
            onClick={scrollToTop}
            aria-label="Retour en haut"
            className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground hover:scale-110 active:scale-95 transition-transform shadow-glow"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
