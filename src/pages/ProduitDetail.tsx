import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  Wrench,
  MessageCircle,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { OrderModal } from "@/components/order-modal";
import { getProductBySlug, products, formatPrice } from "@/lib/products-data";
import NotFound from "@/pages/NotFound";

const ProduitDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;
  const [quantity, setQuantity] = useState(1);
  const [orderOpen, setOrderOpen] = useState(false);

  if (!product) return <NotFound />;

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const whatsappLink = `https://wa.me/221781094091?text=${encodeURIComponent(
    `Bonjour, je suis intéressé par : ${product.name}`,
  )}`;

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-28 md:pt-36 pb-16">
        <div className="container mx-auto px-4">
          <Link
            to="/produits"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au catalogue
          </Link>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Visuals */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="relative aspect-square bg-muted rounded-3xl overflow-hidden flex items-center justify-center">
                <Wrench className="w-32 h-32 text-muted-foreground/30" />
                {product.isBestSeller && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    Best-Seller
                  </span>
                )}
                {product.isNew && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-foreground text-background text-xs font-bold rounded-full">
                    Nouveau
                  </span>
                )}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {product.subcategory ?? product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">{product.name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} avis)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-primary">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-xl text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              <div className="space-y-3 mb-8">
                {product.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>

              {product.category !== "piece" && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-semibold text-foreground">Quantité :</span>
                  <div className="flex items-center border border-border rounded-xl">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-l-xl"
                      aria-label="Diminuer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-r-xl"
                      aria-label="Augmenter"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button
                  size="lg"
                  onClick={() => setOrderOpen(true)}
                  className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base font-semibold"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Commander
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="flex-1 h-14 border-2 border-primary text-primary hover:bg-primary/5 rounded-xl text-base font-semibold bg-transparent"
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Livraison Dakar</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Garantie 2 ans</p>
                </div>
                <div className="text-center">
                  <Wrench className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">SAV expert</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Specifications */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Spécifications techniques</h2>
            <div className="bg-muted/30 rounded-2xl overflow-hidden">
              <dl className="divide-y divide-border">
                {product.specifications.map((spec) => (
                  <div key={spec.label} className="grid grid-cols-2 px-6 py-4">
                    <dt className="font-medium text-foreground">{spec.label}</dt>
                    <dd className="text-muted-foreground">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-foreground mb-8">Produits similaires</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/produits/${p.slug}`}
                    className="group block bg-background rounded-2xl overflow-hidden shadow-elegant border border-border hover:shadow-glow transition-all"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted flex items-center justify-center">
                      <Wrench className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                      <span className="text-primary font-bold mt-2 block">{formatPrice(p.price)}</span>
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
