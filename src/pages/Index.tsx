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
import categoryTricycle from "@/assets/category-tricycle.jpg";
import categoryMoto from "@/assets/category-moto.jpg";
import categoryPieces from "@/assets/category-pieces.jpg";

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
    image: categoryTricycle,
    count: "3 modèles",
    tag: "Best-seller",
  },
  {
    icon: Bike,
    title: "Motos urbaines",
    desc: "Fiables et économiques, parfaites pour la ville.",
    href: "/produits?category=moto",
    image: categoryMoto,
    count: "4 modèles",
    tag: "Populaire",
  },
  {
    icon: Cog,
    title: "Pièces détachées",
    desc: "Stock complet pour entretien et réparation.",
    href: "/produits?category=piece",
    image: categoryPieces,
    count: "8+ références",
    tag: "En stock",
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
        .order("created_at", { ascending: false })
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
        <div className="absolute top-1/3 -right-40 w-[500px] md:w-[600px] h-[500px] md:h-[600px] bg-primary/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-primary-glow/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

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

              <h1 className="font-display text-[2.5rem] sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] mb-6 sm:mb-8 text-balance">
                La mobilité,{" "}
                <span className="relative inline-block">
                  <span className="text-gradient-animated">repensée</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
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

              <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-xl leading-relaxed">
                Tricycles cargo, motos urbaines et pièces détachées de qualité.
                Hasilaza Motor accompagne votre activité depuis 2018.
              </p>

              <div className="flex flex-wrap gap-3 mb-12">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-14 px-7 rounded-full text-base shadow-ink group">
                    <Link to="/produits" className="flex items-center gap-2">
                      Voir le catalogue
                      <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" size="lg" asChild className="h-14 px-7 text-base border-2 rounded-full bg-background/50 backdrop-blur hover:bg-background">
                    <a href="https://wa.me/221769358317" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <WhatsAppIcon className="w-5 h-5" />
                      Discuter
                    </a>
                  </Button>
                </motion.div>
              </div>

              <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-xl">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
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
      <section className="py-20 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-14"
          >
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Catégories</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 text-balance">
                Une gamme complète pour tous vos besoins.
              </h2>
            </div>
            <Link
              to="/produits"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors group story-link"
            >
              Voir tous les produits
              <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
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
                  className="group relative block aspect-[4/5] rounded-3xl overflow-hidden bg-muted border border-border hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                >
                  {/* Image */}
                  <img
                    src={cat.image}
                    alt={cat.title}
                    loading="lazy"
                    width={1024}
                    height={1280}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Top badges */}
                  <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                    <span className="px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border text-[11px] font-medium uppercase tracking-wider text-foreground">
                      {cat.tag}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-background/80 backdrop-blur-md border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                      <cat.icon className="w-5 h-5 text-foreground group-hover:text-primary-foreground transition-colors" strokeWidth={1.75} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {cat.count}
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-5 line-clamp-2">
                      {cat.desc}
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      Découvrir la gamme
                      <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="py-20 md:py-24 bg-muted/30 border-y border-border relative overflow-hidden">
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-blob" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-12 gap-8 md:gap-10 mb-12 md:mb-14"
          >
            <div className="lg:col-span-5">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Pourquoi nous</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 text-balance">
                L'excellence à chaque étape.
              </h2>
            </div>
            <div className="lg:col-span-7 lg:pt-12">
              <p className="text-base sm:text-lg text-muted-foreground">
                Plus qu'un fournisseur, nous sommes votre partenaire de confiance. De la sélection rigoureuse de nos
                véhicules à un service après-vente expert, nous engageons notre réputation sur chaque commande.
              </p>
            </div>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {advantages.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="group bg-card border border-border rounded-3xl p-6 hover:border-primary/40 hover:shadow-ink transition-all duration-500"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.15 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center mb-5 shadow-glow"
                >
                  <item.icon className="w-6 h-6 text-primary-foreground" strokeWidth={2} />
                </motion.div>
                <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12"
          >
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Best-sellers</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 text-balance">
                Nos produits les plus demandés.
              </h2>
            </div>
            <Button asChild size="lg" variant="outline" className="border-2 rounded-full h-12 px-6 group hover:bg-secondary hover:text-secondary-foreground hover:border-secondary self-start md:self-auto">
              <Link to="/produits" className="flex items-center gap-2">
                Tout voir
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                whileHover={{ y: -6 }}
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
      <section className="py-20 md:py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-40" />
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-primary-glow/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className="relative container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mb-12 md:mb-14"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Témoignages</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 text-balance">
              Ils nous font confiance.
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 40, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, rotate: 1 }}
                className="bg-white/5 border border-white/10 backdrop-blur rounded-3xl p-7 hover:bg-white/10 hover:border-primary/30 transition-colors"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 + 0.2, type: "spring", stiffness: 200 }}
                >
                  <Quote className="w-8 h-8 text-primary mb-4" />
                </motion.div>
                <p className="text-secondary-foreground/90 leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground shadow-glow">
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
      <section className="py-20 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-gradient-primary p-8 sm:p-12 md:p-20 text-center"
          >
            <div className="absolute inset-0 grain opacity-50" />
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "5s" }} />
            <div className="relative max-w-3xl mx-auto">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6"
              >
                <Sparkles className="w-12 h-12 text-primary-foreground/80 mx-auto" />
              </motion.div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-primary-foreground mb-6 text-balance">
                Prêt à transformer votre activité ?
              </h2>
              <p className="text-base sm:text-lg text-primary-foreground/90 mb-8 md:mb-10 max-w-xl mx-auto">
                Contactez-nous pour un devis personnalisé et découvrez nos offres exclusives.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-14 px-8 rounded-full text-base w-full">
                    <Link to="/produits">Voir le catalogue</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button asChild size="lg" variant="outline" className="border-2 border-primary-foreground/40 text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary h-14 px-8 rounded-full text-base w-full">
                    <a href="tel:+221769358317" className="flex items-center justify-center gap-2">
                      <Phone className="w-5 h-5" />
                      +221 76 935 83 17
                    </a>
                  </Button>
                </motion.div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 md:mt-10 text-sm text-primary-foreground/80">
                {["Sans engagement", "Devis gratuit", "Réponse sous 24h"].map((f, i) => (
                  <motion.span
                    key={f}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {f}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SHOWROOM LOCAL - SEO */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-center"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Showroom Dakar</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-5 text-balance">
                Visitez notre <span className="text-gradient-animated">showroom</span> à Dakar
              </h2>
              <p className="text-muted-foreground mb-8">
                Tricycles, motos et pièces détachées exposés. Nos conseillers vous accompagnent et vous présentent
                chaque modèle. Essais possibles sur rendez-vous.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Adresse</p>
                    <p className="font-display font-semibold">HLM 2, Dakar — Sénégal</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Horaires</p>
                    <p className="font-display font-semibold">Lun – Sam · 9h – 18h</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90 h-12 px-6 rounded-full shadow-glow">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=HLM+2+Dakar+Senegal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                    Itinéraire Google Maps
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-12 px-6 rounded-full border-2">
                  <Link to="/contact#trouvez-nous">Tous les contacts</Link>
                </Button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative rounded-[2rem] overflow-hidden border border-border shadow-elegant aspect-[4/3] lg:aspect-[5/4] bg-muted"
            >
              <iframe
                title="Carte Hasilaza Motor à Dakar"
                src="https://www.google.com/maps?q=HLM+2+Dakar+Senegal&hl=fr&z=14&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full border-0"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Index;
