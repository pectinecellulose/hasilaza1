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

  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.shortDescription,
    image: product.images && product.images.length > 0 ? product.images : undefined,
    sku: product.id,
    mpn: product.slug,
    category: product.category,
    brand: { "@type": "Brand", name: "Hasilaza Motor" },
    manufacturer: { "@type": "Organization", name: "Hasilaza Motor" },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: Math.max(product.reviews ?? 1, 1),
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "XOF",
      price: product.category !== "piece" && product.price > 0 ? product.price : undefined,
      priceValidUntil,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://hasilaza.com/produits/${product.slug}`,
      seller: { "@type": "Organization", name: "Hasilaza Motor" },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "XOF" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "SN" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 5, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "SN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
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
        title={`${product.name}${product.category === "piece" ? "" : ` - ${formatPrice(product.price)}`} | Hasilaza Motor Sénégal`}
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
            <motion.div
              ref={heroRef}
              initial={{ opacity: 0, x: -40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: 1200 }}
            >
              <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-[2rem] overflow-hidden flex items-center justify-center border border-border group shadow-ink"
              >
                {/* Animated glow */}
                <motion.div
                  className="absolute -inset-10 bg-gradient-radial opacity-40 pointer-events-none"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Shimmer sweep */}
                <div className="absolute inset-0 shimmer pointer-events-none opacity-50" />

                {product.images && product.images.length > 0 ? (
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.img
                      key={activeImage}
                      src={product.images[activeImage] ?? product.images[0]}
                      alt={`${product.name} - vue ${activeImage + 1}`}
                      loading="eager"
                      custom={direction}
                      initial={{ opacity: 0, x: direction * 60, scale: 1.05, filter: "blur(8px)" }}
                      animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: direction * -60, scale: 0.95, filter: "blur(8px)" }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      style={{ y: imageY, scale: imageScale }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                ) : (
                  <motion.div
                    animate={{ rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Wrench className="relative w-40 h-40 text-muted-foreground/30" strokeWidth={1} />
                  </motion.div>
                )}

                {product.images && product.images.length > 1 && (
                  <>
                    <motion.button
                      onClick={prevImage}
                      whileHover={{ scale: 1.15, x: -3 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-elegant z-10"
                      aria-label="Image précédente"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={nextImage}
                      whileHover={{ scale: 1.15, x: 3 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-elegant z-10"
                      aria-label="Image suivante"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                    <motion.div
                      key={`counter-${activeImage}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border text-xs font-bold tracking-wider z-10"
                    >
                      {String(activeImage + 1).padStart(2, "0")} / {String(product.images.length).padStart(2, "0")}
                    </motion.div>
                  </>
                )}

                <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
                  {product.isBestSeller && (
                    <motion.span
                      initial={{ opacity: 0, x: -20, rotate: -10 }}
                      animate={{ opacity: 1, x: 0, rotate: 0 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                      className="px-3 py-1.5 bg-gradient-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-glow animate-pulse-glow"
                    >
                      ★ Best-Seller
                    </motion.span>
                  )}
                  {product.isNew && (
                    <motion.span
                      initial={{ opacity: 0, x: -20, rotate: -10 }}
                      animate={{ opacity: 1, x: 0, rotate: 0 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      className="px-3 py-1.5 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-elegant"
                    >
                      ✨ Nouveau
                    </motion.span>
                  )}
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="absolute top-5 right-5 z-10"
                >
                  <FavoriteButton productId={product.id} />
                </motion.div>
              </motion.div>

              {product.images && product.images.length > 1 && (
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
                  }}
                  className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 mt-4"
                >
                  {product.images.map((img, idx) => (
                    <motion.button
                      key={img + idx}
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.8 },
                        show: { opacity: 1, y: 0, scale: 1 },
                      }}
                      whileHover={{ y: -4, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => goToImage(idx)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                        activeImage === idx
                          ? "border-primary shadow-glow"
                          : "border-border hover:border-primary/40 opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`Voir image ${idx + 1}`}
                    >
                      {activeImage === idx && (
                        <motion.div
                          layoutId="thumbActive"
                          className="absolute inset-0 ring-2 ring-primary rounded-2xl z-10 pointer-events-none"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <img src={img} alt={`miniature ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
              }}
            >
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="flex items-center gap-2 flex-wrap"
              >
                <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
                  {product.subcategory ?? product.category}
                </span>
                {product.inStock && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    En stock · Livraison rapide
                  </span>
                )}
              </motion.div>
              <motion.h1
                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
                className="font-display text-3xl md:text-5xl font-bold mt-3 mb-5 leading-tight text-balance"
              >
                {product.name}
              </motion.h1>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + i * 0.08, type: "spring", stiffness: 200 }}
                    >
                      <Star
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted"}`}
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} · {product.reviews} avis vérifiés
                </span>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="flex items-baseline gap-3 mb-6 pb-6 border-b border-border"
              >
                {product.category === "piece" ? (
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
                    className="font-display text-3xl md:text-4xl font-bold text-gradient"
                  >
                    Prix sur demande
                  </motion.span>
                ) : product.price > 0 ? (
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
                    className="font-display text-4xl md:text-5xl font-bold text-gradient"
                  >
                    {formatPrice(product.price)}
                  </motion.span>
                ) : (
                  <span className="font-display text-3xl md:text-4xl font-bold text-gradient">Sur demande</span>
                )}
                {product.category !== "piece" && product.oldPrice && (
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                )}
              </motion.div>

              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="text-muted-foreground leading-relaxed mb-7"
              >
                {product.shortDescription}
              </motion.p>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 mb-7 p-4 rounded-2xl bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors"
              >
                <motion.div
                  animate={{ rotate: [0, -12, 12, -12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                  className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
                >
                  <Phone className="w-5 h-5 text-primary" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Besoin de conseils ?</p>
                  <a href="tel:+221769358317" className="font-display font-bold text-foreground hover:text-primary transition-colors">
                    +221 76 935 83 17
                  </a>
                </div>
              </motion.div>

              {product.category !== "piece" && (
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  className="flex items-center gap-4 mb-6"
                >
                  <span className="text-sm font-medium text-foreground">Quantité</span>
                  <div className="flex items-center bg-muted/50 border border-border rounded-2xl">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-11 h-11 flex items-center justify-center hover:bg-muted rounded-l-2xl transition-colors"
                      aria-label="Diminuer"
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={quantity}
                        initial={{ y: -15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 15, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-12 text-center font-display font-bold"
                      >
                        {quantity}
                      </motion.span>
                    </AnimatePresence>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-11 h-11 flex items-center justify-center hover:bg-muted rounded-r-2xl transition-colors"
                      aria-label="Augmenter"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="flex flex-col sm:flex-row gap-3 mb-10"
              >
                <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    size="lg"
                    onClick={() => setOrderOpen(true)}
                    className="w-full h-14 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-2xl text-base font-semibold shadow-ink relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Commander
                    </span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="w-full h-14 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-2xl text-base font-semibold bg-transparent"
                  >
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="grid grid-cols-3 gap-4 p-5 bg-muted/40 rounded-2xl border border-border"
              >
                {[
                  { icon: Truck, label: "Livraison Dakar" },
                  { icon: Shield, label: "Garantie 2 ans" },
                  { icon: Wrench, label: "SAV expert" },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ y: -4, scale: 1.05 }}
                    className="text-center cursor-default"
                  >
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="inline-block">
                      <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    </motion.div>
                    <p className="text-[11px] text-muted-foreground font-medium">{item.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Tout savoir</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-8">À propos de ce produit</h2>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="h-auto p-1.5 bg-muted/60 rounded-2xl flex flex-wrap gap-1 w-full sm:w-auto sm:inline-flex">
                <TabsTrigger
                  value="description"
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-elegant gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-elegant gap-2 transition-all"
                >
                  <Package className="w-4 h-4" />
                  Spécifications
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-elegant gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Caractéristiques
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <motion.div
                  key="desc"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-card rounded-3xl border border-border p-6 md:p-10 relative overflow-hidden"
                >
                  <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-radial opacity-30 pointer-events-none" />
                  <div className="prose prose-neutral dark:prose-invert max-w-none relative">
                    <p className="text-foreground/85 leading-relaxed text-base md:text-lg whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                {product.specifications.length > 0 ? (
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
                    className="bg-card rounded-3xl border border-border overflow-hidden"
                  >
                    <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                      <div className="divide-y divide-border">
                        {product.specifications
                          .filter((_, i) => i % 2 === 0)
                          .map((spec) => (
                            <motion.div
                              key={spec.label}
                              variants={{
                                hidden: { opacity: 0, x: -20 },
                                show: { opacity: 1, x: 0 },
                              }}
                              whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)", x: 4 }}
                              className="flex items-center justify-between gap-4 px-6 py-4 transition-colors"
                            >
                              <dt className="font-medium text-muted-foreground text-sm">{spec.label}</dt>
                              <dd className="font-display font-semibold text-foreground text-sm text-right">
                                {spec.value}
                              </dd>
                            </motion.div>
                          ))}
                      </div>
                      <div className="divide-y divide-border">
                        {product.specifications
                          .filter((_, i) => i % 2 === 1)
                          .map((spec) => (
                            <motion.div
                              key={spec.label}
                              variants={{
                                hidden: { opacity: 0, x: 20 },
                                show: { opacity: 1, x: 0 },
                              }}
                              whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)", x: -4 }}
                              className="flex items-center justify-between gap-4 px-6 py-4 transition-colors"
                            >
                              <dt className="font-medium text-muted-foreground text-sm">{spec.label}</dt>
                              <dd className="font-display font-semibold text-foreground text-sm text-right">
                                {spec.value}
                              </dd>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-card rounded-3xl border border-border p-10 text-center text-muted-foreground">
                    Aucune spécification disponible pour ce produit.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                {product.features.length > 0 ? (
                  <div className="bg-card rounded-3xl border border-border p-6 md:p-8">
                    <motion.div
                      initial="hidden"
                      animate="show"
                      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                      className="grid sm:grid-cols-2 gap-3"
                    >
                      {product.features.map((feature) => (
                        <motion.div
                          key={feature}
                          variants={{
                            hidden: { opacity: 0, y: 20, scale: 0.95 },
                            show: { opacity: 1, y: 0, scale: 1 },
                          }}
                          whileHover={{ y: -4, scale: 1.02 }}
                          className="flex items-start gap-3 p-4 rounded-2xl bg-muted/40 border border-border/50 hover:border-primary/40 hover:bg-muted/60 hover:shadow-elegant transition-all cursor-default"
                        >
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
                          >
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          </motion.div>
                          <span className="text-foreground/90 text-sm leading-relaxed pt-1">{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                ) : (
                  <div className="bg-card rounded-3xl border border-border p-10 text-center text-muted-foreground">
                    Aucune caractéristique disponible pour ce produit.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>

          {related.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="mt-24"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Vous aimerez aussi</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-8">Produits similaires</h2>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {related.map((p) => (
                  <motion.div
                    key={p.id}
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.95 },
                      show: { opacity: 1, y: 0, scale: 1 },
                    }}
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <Link
                      to={`/produits/${p.slug}`}
                      className="group block bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-ink transition-all duration-500"
                    >
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Wrench className="w-14 h-14 text-muted-foreground/30 group-hover:rotate-12 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-display font-bold text-sm group-hover:text-primary transition-colors line-clamp-1 mb-1">
                          {p.name}
                        </h3>
                        <span className="font-display text-base font-bold">
                          {p.category === "piece" ? "Prix sur demande" : formatPrice(p.price)}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      <OrderModal product={product} quantity={quantity} isOpen={orderOpen} onClose={() => setOrderOpen(false)} />

      <Footer />
    </main>
  );
};

export default ProduitDetail;
