import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { OrderModal } from "@/components/order-modal";
import { SEO } from "@/components/seo";
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

  useEffect(() => {
    if (!slug) return;
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

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-[2rem] overflow-hidden flex items-center justify-center border border-border">
                <div className="absolute inset-0 bg-gradient-radial opacity-30" />
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="eager"
                    className="relative w-full h-full object-cover"
                  />
                ) : (
                  <Wrench className="relative w-40 h-40 text-muted-foreground/30" strokeWidth={1} />
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
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
                {product.subcategory ?? product.category}
              </span>
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
                  {product.rating} · {product.reviews} avis
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

              <p className="text-muted-foreground leading-relaxed mb-7">{product.description}</p>

              <div className="space-y-2.5 mb-8">
                {product.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80 text-sm">{feature}</span>
                  </div>
                ))}
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
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Spécifications</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-8">Détails techniques</h2>
            <div className="bg-card rounded-3xl border border-border overflow-hidden">
              <dl className="divide-y divide-border">
                {product.specifications.map((spec) => (
                  <div key={spec.label} className="grid grid-cols-2 px-6 py-4 hover:bg-muted/30 transition-colors">
                    <dt className="font-medium text-foreground text-sm">{spec.label}</dt>
                    <dd className="text-muted-foreground text-sm">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
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
