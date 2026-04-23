import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Phone,
  Truck,
  Shield,
  Wrench,
  Star,
  Sparkles,
  Bike,
  Cog,
  TrendingUp,
  Quote,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Partners } from "@/components/partners";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { SEO } from "@/components/seo";
import { formatPrice, type Product } from "@/lib/products-data";
import { supabase } from "@/integrations/supabase/client";
import { mapDbProduct, type DbProductRow } from "@/lib/products-mapper";
import logo from "@/assets/logo.png";

const stats = [
  { value: "5+", label: "Années" },
  { value: "5K+", label: "Clients" },
  { value: "10K+", label: "Véhicules" },
  { value: "N°1", label: "Sénégal" },
];

const advantages = [
  { icon: Truck, title: "Livraison rapide", desc: "Partout au Sénégal, gratuite sur Dakar pour toute commande." },
  { icon: Shield, title: "Garantie 2 ans", desc: "Pièces et main-d'œuvre incluses sur tous nos véhicules." },
  { icon: Wrench, title: "SAV expert", desc: "Atelier équipé et techniciens qualifiés à votre service." },
  { icon: TrendingUp, title: "Meilleurs prix", desc: "Importation directe pour vous offrir des tarifs compétitifs." },
];

const categories = [
  {
    icon: Truck,
    title: "Tricycles cargo",
    desc: "Robustes pour le transport de marchandises jusqu'à 800kg.",
    href: "/produits?category=tricycle",
    accent: "from-primary to-primary-glow",
  },
  {
    icon: Bike,
    title: "Motos urbaines",
    desc: "Fiables et économiques, parfaites pour la ville.",
    href: "/produits?category=moto",
    accent: "from-primary-glow to-primary",
  },
  {
    icon: Cog,
    title: "Pièces détachées",
    desc: "Stock complet pour entretien et réparation.",
    href: "/produits?category=piece",
    accent: "from-primary to-primary-glow",
  },
];

const testimonials = [
  {
    name: "Ousmane D.",
    role: "Commerçant à Pikine",
    text: "Mon tricycle a transformé mon activité. La livraison était rapide et le SAV impeccable.",
  },
  {
    name: "Aïssatou M.",
    role: "Livreuse, Dakar",
    text: "Très satisfaite de ma moto. Hasilaza propose vraiment les meilleurs prix du marché.",
  },
  {
    name: "Mamadou K.",
    role: "Garagiste, Thiès",
    text: "Je commande toutes mes pièces ici. Qualité au rendez-vous, livraison toujours à l'heure.",
  },
];

const Index = () => {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .neq("category", "piece")
        .limit(8);
      setFeatured(((data as DbProductRow[]) ?? []).map(mapDbProduct));
    })();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Hasilaza Motor - Tricycles & Motos au Sénégal | Cargo 200/250/300CC"
        description="N°1 des tricycles cargo (200, 250, 300CC) et motos 150CC au Sénégal. Livraison Dakar gratuite, garantie 2 ans, SAV expert. Devis WhatsApp immédiat."
        canonical="/"
        keywords="tricycle Sénégal, tricycle cargo Dakar, moto 150cc, tricycle 250cc, tricycle 300cc, Hasilaza Motor, vente moto Dakar"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Hasilaza Motor",
          url: "https://hasilaza.com",
          logo: "https://hasilaza.com/og-image.jpg",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+221769358317",
            contactType: "sales",
            areaServed: "SN",
            availableLanguage: ["fr"],
          },
        }}
      />
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary-glow/15 rounded-full blur-3xl" />

        <div className="relative container pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-widest">Leader au Sénégal</span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] mb-8 text-balance">
                La mobilité,{" "}
                <span className="relative inline-block">
                  <span className="text-gradient">repensée</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 9C50 3 100 3 198 9"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <br />
                pour le Sénégal.
              </h1>

              <p className="text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
                Tricycles cargo, motos urbaines et pièces détachées de qualité.
                Hasilaza Motor accompagne votre activité depuis 2018.
              </p>

              <div className="flex flex-wrap gap-3 mb-12">
                <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-14 px-7 rounded-full text-base shadow-ink group">
                  <Link to="/produits" className="flex items-center gap-2">
                    Voir le catalogue
                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-14 px-7 text-base border-2 rounded-full bg-background/50 backdrop-blur hover:bg-background">
                  <a href="https://wa.me/221769358317" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <WhatsAppIcon className="w-5 h-5" />
                    Discuter
                  </a>
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-6 max-w-xl">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                  >
                    <div className="font-display text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -16, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -left-6 z-20 bg-card border border-border rounded-2xl p-4 shadow-ink"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Star className="w-5 h-5 text-primary fill-primary" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm">4.9 / 5</div>
                      <div className="text-xs text-muted-foreground">+5000 avis</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -right-4 z-20 bg-card border border-border rounded-2xl p-4 shadow-ink"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm">Garantie 2 ans</div>
                      <div className="text-xs text-muted-foreground">Pièces & MO</div>
                    </div>
                  </div>
                </motion.div>

                {/* Main visual */}
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-primary rounded-[2.5rem] blur-3xl opacity-40 animate-pulse" />
                  <div className="relative w-full h-full bg-secondary rounded-[2.5rem] overflow-hidden shadow-ink border border-white/10">
                    <div className="absolute inset-0 bg-gradient-radial opacity-50" />
                    <div className="absolute inset-0 grain" />
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-10 text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute"
                      >
                        <Cog className="w-72 h-72 text-primary/10" />
                      </motion.div>
                      <div className="relative flex flex-col items-center">
                        <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl bg-white/95 flex items-center justify-center shadow-glow p-5 mb-6">
                          <img src={logo} alt="Logo Hasilaza Motor" className="w-full h-full object-contain" />
                        </div>
                        <p className="font-display text-3xl font-bold text-secondary-foreground mb-2">Hasilaza</p>
                        <p className="text-sm text-secondary-foreground/60 uppercase tracking-[0.3em]">Motor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Marquee */}
        <div className="relative border-y border-border/50 bg-background/50 backdrop-blur py-5 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-12 px-6">
                {["Tricycles 200cc", "Motos 125cc", "Pièces d'origine", "Livraison Dakar", "Garantie 2 ans", "SAV expert", "Meilleurs prix"].map(
                  (item) => (
                    <span key={item} className="font-display text-2xl md:text-3xl font-bold text-foreground/80 flex items-center gap-12">
                      {item}
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    </span>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-2xl mb-14">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Catégories</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-balance">
              Une gamme complète pour tous vos besoins.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Link
                  to={cat.href}
                  className="group relative block aspect-[4/5] rounded-3xl overflow-hidden bg-secondary border border-border hover:border-primary/50 transition-all"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="absolute inset-0 bg-gradient-radial opacity-30" />

                  <div className="relative h-full p-8 flex flex-col justify-between">
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur group-hover:bg-secondary group-hover:scale-110 transition-all duration-500">
                        <cat.icon className="w-7 h-7 text-primary group-hover:text-primary" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display text-3xl font-bold text-secondary-foreground mb-3">{cat.title}</h3>
                      <p className="text-secondary-foreground/70 mb-6 group-hover:text-primary-foreground/90 transition-colors">
                        {cat.desc}
                      </p>
                      <div className="flex items-center gap-2 text-secondary-foreground font-medium">
                        Découvrir
                        <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-5">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Pourquoi nous</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-balance">
                L'excellence à chaque étape.
              </h2>
            </div>
            <div className="lg:col-span-7 lg:pt-12">
              <p className="text-lg text-muted-foreground">
                Plus qu'un fournisseur, nous sommes votre partenaire de confiance. De la sélection rigoureuse de nos
                véhicules à un service après-vente expert, nous engageons notre réputation sur chaque commande.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {advantages.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-card border border-border rounded-3xl p-6 hover:border-primary/40 hover:shadow-elegant transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-primary-foreground" strokeWidth={2} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Best-sellers</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-balance">
                Nos produits les plus demandés.
              </h2>
            </div>
            <Button asChild size="lg" variant="outline" className="border-2 rounded-full h-12 px-6 group hover:bg-secondary hover:text-secondary-foreground hover:border-secondary">
              <Link to="/produits" className="flex items-center gap-2">
                Tout voir
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/produits/${product.slug}`}
                  className="group block bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-ink transition-all duration-500"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Wrench className="w-20 h-20 text-muted-foreground/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {product.isBestSeller && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-gradient-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-elegant">
                        Best-Seller
                      </span>
                    )}
                    {product.isNew && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-elegant">
                        Nouveau
                      </span>
                    )}
                    <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">
                      {product.subcategory ?? product.category}
                    </span>
                    <h3 className="font-display font-bold text-foreground mt-1.5 mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xl font-bold">{formatPrice(product.price)}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${idx < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-40" />
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        <div className="relative container">
          <div className="max-w-2xl mb-14">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Témoignages</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-balance">
              Ils nous font confiance.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 backdrop-blur rounded-3xl p-7"
              >
                <Quote className="w-8 h-8 text-primary mb-4" />
                <p className="text-secondary-foreground/90 leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-secondary-foreground">{t.name}</div>
                    <div className="text-xs text-secondary-foreground/60">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <Partners />

      {/* CTA */}
      <section className="py-24">
        <div className="container">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-primary p-12 md:p-20 text-center">
            <div className="absolute inset-0 grain opacity-50" />
            <div className="relative max-w-3xl mx-auto">
              <Sparkles className="w-12 h-12 text-primary-foreground/80 mx-auto mb-6" />
              <h2 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6 text-balance">
                Prêt à transformer votre activité ?
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-10 max-w-xl mx-auto">
                Contactez-nous pour un devis personnalisé et découvrez nos offres exclusives.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-14 px-8 rounded-full text-base">
                  <Link to="/produits">Voir le catalogue</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-secondary text-secondary bg-transparent hover:bg-secondary hover:text-secondary-foreground h-14 px-8 rounded-full text-base">
                  <a href="tel:+221769358317" className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    +221 76 935 83 17
                  </a>
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-primary-foreground/80">
                {["Sans engagement", "Devis gratuit", "Réponse sous 24h"].map((f) => (
                  <span key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Index;
