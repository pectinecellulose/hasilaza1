import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Phone, Truck, Shield, Wrench, Star } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { formatPrice, type Product } from "@/lib/products-data";
import { supabase } from "@/integrations/supabase/client";
import { mapDbProduct, type DbProductRow } from "@/lib/products-mapper";

const features = [
  "Livraison gratuite sur Dakar",
  "Garantie 2 ans incluse",
  "Service après-vente réactif",
];

const stats = [
  { value: "+5", label: "Années d'expérience" },
  { value: "5000+", label: "Clients satisfaits" },
  { value: "10K+", label: "Véhicules vendus" },
  { value: "N°1", label: "Au Sénégal" },
];

const advantages = [
  { icon: Truck, title: "Livraison rapide", desc: "Partout au Sénégal, gratuite sur Dakar" },
  { icon: Shield, title: "Garantie 2 ans", desc: "Pièces et main-d'œuvre incluses" },
  { icon: Wrench, title: "SAV expert", desc: "Atelier équipé et techniciens qualifiés" },
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
      <Header />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-background pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-primary">Leader au Sénégal depuis 2018</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 text-balance">
                Motos & Tricycles de <span className="text-primary">Qualité</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                Hasilaza Motor est votre partenaire de confiance pour l&apos;achat de tricycles cargo, motos et pièces
                détachées. Nous offrons les meilleurs prix du marché avec une garantie complète.
              </p>

              <ul className="flex flex-wrap gap-4 mb-10">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-4 mb-12">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 text-base shadow-elegant">
                  <Link to="/produits" className="flex items-center gap-2">
                    Voir nos produits
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-14 px-8 text-base border-2 hover:bg-muted bg-transparent">
                  <a href="https://wa.me/221781094091" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <WhatsAppIcon className="w-5 h-5" />
                    Contactez-nous
                  </a>
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl lg:text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl rotate-6" />
                <div className="relative bg-gradient-primary rounded-3xl overflow-hidden shadow-2xl aspect-square flex items-center justify-center">
                  <div className="text-primary-foreground text-center p-8">
                    <Wrench className="w-24 h-24 mx-auto mb-4 opacity-80" />
                    <p className="text-2xl font-bold">Hasilaza Motor</p>
                    <p className="text-sm opacity-80 mt-2">Tricycles · Motos · Pièces</p>
                  </div>
                  <div className="absolute top-6 right-6 bg-background text-foreground px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    Best-Seller
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <span className="text-sm font-semibold text-primary">Nos avantages</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Pourquoi choisir <span className="text-primary">Hasilaza</span> ?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {advantages.map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-background border border-border rounded-2xl p-8 shadow-elegant"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                <span className="text-sm font-semibold text-primary">Nos produits</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Découvrez nos <span className="text-primary">best-sellers</span>
              </h2>
            </div>
            <Button asChild variant="outline" size="lg" className="border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary bg-transparent">
              <Link to="/produits" className="flex items-center gap-2">
                Voir tout le catalogue
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((product) => (
              <Link key={product.id} to={`/produits/${product.slug}`} className="group block bg-background rounded-2xl overflow-hidden shadow-elegant border border-border hover:shadow-glow transition-all">
                <div className="relative aspect-square overflow-hidden bg-muted flex items-center justify-center">
                  <Wrench className="w-16 h-16 text-muted-foreground/30" />
                  {product.isBestSeller && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                      Best-Seller
                    </span>
                  )}
                  {product.isNew && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-foreground text-background text-xs font-bold rounded-full">
                      Nouveau
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {product.subcategory ?? product.category}
                  </span>
                  <h3 className="font-bold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>
                  <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-6 text-balance">
            Prêt à transformer votre activité ?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Contactez-nous dès aujourd&apos;hui pour obtenir un devis personnalisé et découvrir nos offres spéciales.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-background text-primary hover:bg-background/90 h-14 px-8">
              <Link to="/produits">Voir le catalogue</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-background text-background hover:bg-background hover:text-primary h-14 px-8 bg-transparent">
              <a href="tel:+221781094091" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                +221 781 094 091
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Index;
