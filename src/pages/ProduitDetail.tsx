import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  Wrench,
  MessageCircle,
  ArrowUpRight,
  Phone,
  Sparkles,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { OrderModal } from "@/components/order-modal";
import { SEO } from "@/components/seo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice, type Product } from "@/lib/products-data";
import { supabase } from "@/integrations/supabase/client";
import { mapDbProduct, type DbProductRow } from "@/lib/products-mapper";
import { FavoriteButton } from "@/components/favorite-button";
import NotFound from "@/pages/NotFound";

const ProduitDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [orderOpen, setOrderOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Parallax scroll for hero image
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // 3D tilt on image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const goToImage = (idx: number) => {
    setDirection(idx > activeImage ? 1 : -1);
    setActiveImage(idx);
  };
  const nextImage = () => {
    if (!product?.images) return;
    setDirection(1);
    setActiveImage((i) => (i === product.images.length - 1 ? 0 : i + 1));
  };
  const prevImage = () => {
    if (!product?.images) return;
    setDirection(-1);
    setActiveImage((i) => (i === 0 ? product.images.length - 1 : i - 1));
  };


  useEffect(() => {
    if (!slug) return;
    setActiveImage(0);
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
      if (data) {
        const p = mapDbProduct(data as DbProductRow);
        setProduct(p);
        const { data: rel } = await supabase
          .from("products")
          .select("*")
          .eq("category", p.category)
          .neq("id", p.id)
          .limit(4);
        setRelated(((rel as DbProductRow[]) ?? []).map(mapDbProduct));
      } else {
        setProduct(null);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!product) return <NotFound />;

  const whatsappLink = `https://wa.me/221769358317?text=${encodeURIComponent(
    `Bonjour, je suis intéressé par : ${product.name}`,
  )}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images && product.images.length > 0 ? product.images : undefined,
    sku: product.id,
    category: product.category,
    brand: { "@type": "Brand", name: "Hasilaza Motor" },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: Math.max(product.reviews ?? 1, 1),
        }
      : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "XOF",
      price: product.price > 0 ? product.price : undefined,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://hasilaza.com/produits/${product.slug}`,
      seller: { "@type": "Organization", name: "Hasilaza Motor" },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://hasilaza.com/" },
      { "@type": "ListItem", position: 2, name: "Produits", item: "https://hasilaza.com/produits" },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://hasilaza.com/produits/${product.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title={`${product.name} - ${formatPrice(product.price)} | Hasilaza Motor Sénégal`}
        description={`${product.shortDescription} Livraison Dakar gratuite, garantie 2 ans. Commandez maintenant.`}
        canonical={`/produits/${product.slug}`}
        type="product"
        image={product.images?.[0]}
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />
      <Header />

      <section className="pt-12 md:pt-16 pb-20">
        <div className="container">
          <Link
            to="/produits"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour au catalogue
          </Link>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-[2rem] overflow-hidden flex items-center justify-center border border-border group">
                <div className="absolute inset-0 bg-gradient-radial opacity-30" />
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[activeImage] ?? product.images[0]}
                    alt={`${product.name} - vue ${activeImage + 1}`}
                    loading="eager"
                    className="relative w-full h-full object-cover transition-opacity duration-300"
                  />
                ) : (
                  <Wrench className="relative w-40 h-40 text-muted-foreground/30" strokeWidth={1} />
                )}

                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImage((i) => (i === 0 ? product.images.length - 1 : i - 1))
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-background hover:scale-110"
                      aria-label="Image précédente"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImage((i) => (i === product.images.length - 1 ? 0 : i + 1))
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-background hover:scale-110"
                      aria-label="Image suivante"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border text-xs font-medium">
                      {activeImage + 1} / {product.images.length}
                    </div>
                  </>
                )}

                <div className="absolute top-5 left-5 flex flex-col gap-2">
                  {product.isBestSeller && (
                    <span className="px-3 py-1.5 bg-gradient-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-elegant">
                      Best-Seller
                    </span>
                  )}
                  {product.isNew && (
                    <span className="px-3 py-1.5 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-elegant">
                      Nouveau
                    </span>
                  )}
                </div>
                <div className="absolute top-5 right-5">
                  <FavoriteButton productId={product.id} />
                </div>
              </div>

              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 mt-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={img + idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                        activeImage === idx
                          ? "border-primary shadow-elegant scale-[1.02]"
                          : "border-border hover:border-primary/40 opacity-70 hover:opacity-100"
                      }`}
                      aria-label={`Voir image ${idx + 1}`}
                    >
                      <img src={img} alt={`miniature ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
                  {product.subcategory ?? product.category}
                </span>
                {product.inStock && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    En stock · Livraison rapide
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold mt-3 mb-5 leading-tight text-balance">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} · {product.reviews} avis vérifiés
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-border">
                {product.price > 0 ? (
                  <span className="font-display text-4xl md:text-5xl font-bold text-gradient">{formatPrice(product.price)}</span>
                ) : (
                  <span className="font-display text-3xl md:text-4xl font-bold text-gradient">Sur demande</span>
                )}
                {product.oldPrice && (
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-7">{product.shortDescription}</p>

              <div className="flex items-center gap-3 mb-7 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Besoin de conseils ?</p>
                  <a href="tel:+221769358317" className="font-display font-bold text-foreground hover:text-primary transition-colors">
                    +221 76 935 83 17
                  </a>
                </div>
              </div>

              {product.category !== "piece" && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-foreground">Quantité</span>
                  <div className="flex items-center bg-muted/50 border border-border rounded-2xl">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-11 h-11 flex items-center justify-center hover:bg-muted rounded-l-2xl active:scale-95 transition-all"
                      aria-label="Diminuer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-display font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-11 h-11 flex items-center justify-center hover:bg-muted rounded-r-2xl active:scale-95 transition-all"
                      aria-label="Augmenter"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Button
                  size="lg"
                  onClick={() => setOrderOpen(true)}
                  className="flex-1 h-14 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-2xl text-base font-semibold shadow-ink"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Commander
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="flex-1 h-14 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-2xl text-base font-semibold bg-transparent"
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 p-5 bg-muted/40 rounded-2xl border border-border">
                {[
                  { icon: Truck, label: "Livraison Dakar" },
                  { icon: Shield, label: "Garantie 2 ans" },
                  { icon: Wrench, label: "SAV expert" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-[11px] text-muted-foreground font-medium">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="mt-20">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Tout savoir</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-8">À propos de ce produit</h2>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="h-auto p-1.5 bg-muted/60 rounded-2xl flex flex-wrap gap-1 w-full sm:w-auto sm:inline-flex">
                <TabsTrigger
                  value="description"
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-elegant gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-elegant gap-2"
                >
                  <Package className="w-4 h-4" />
                  Spécifications
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-elegant gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Caractéristiques
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="bg-card rounded-3xl border border-border p-6 md:p-10">
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="text-foreground/85 leading-relaxed text-base md:text-lg whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                {product.specifications.length > 0 ? (
                  <div className="bg-card rounded-3xl border border-border overflow-hidden">
                    <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                      <div className="divide-y divide-border">
                        {product.specifications
                          .filter((_, i) => i % 2 === 0)
                          .map((spec) => (
                            <div
                              key={spec.label}
                              className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
                            >
                              <dt className="font-medium text-muted-foreground text-sm">{spec.label}</dt>
                              <dd className="font-display font-semibold text-foreground text-sm text-right">
                                {spec.value}
                              </dd>
                            </div>
                          ))}
                      </div>
                      <div className="divide-y divide-border">
                        {product.specifications
                          .filter((_, i) => i % 2 === 1)
                          .map((spec) => (
                            <div
                              key={spec.label}
                              className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
                            >
                              <dt className="font-medium text-muted-foreground text-sm">{spec.label}</dt>
                              <dd className="font-display font-semibold text-foreground text-sm text-right">
                                {spec.value}
                              </dd>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-card rounded-3xl border border-border p-10 text-center text-muted-foreground">
                    Aucune spécification disponible pour ce produit.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                {product.features.length > 0 ? (
                  <div className="bg-card rounded-3xl border border-border p-6 md:p-8">
                    <div className="grid sm:grid-cols-2 gap-3">
                      {product.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-3 p-4 rounded-2xl bg-muted/40 border border-border/50 hover:border-primary/40 hover:bg-muted/60 transition-all"
                        >
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-foreground/90 text-sm leading-relaxed pt-1">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-card rounded-3xl border border-border p-10 text-center text-muted-foreground">
                    Aucune caractéristique disponible pour ce produit.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {related.length > 0 && (
            <div className="mt-24">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Vous aimerez aussi</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-8">Produits similaires</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/produits/${p.slug}`}
                    className="group block bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-ink transition-all duration-500"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Wrench className="w-14 h-14 text-muted-foreground/30 group-hover:rotate-12 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-bold text-sm group-hover:text-primary transition-colors line-clamp-1 mb-1">
                        {p.name}
                      </h3>
                      <span className="font-display text-base font-bold">{formatPrice(p.price)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <OrderModal product={product} quantity={quantity} isOpen={orderOpen} onClose={() => setOrderOpen(false)} />

      <Footer />
    </main>
  );
};

export default ProduitDetail;
