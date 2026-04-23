import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, MessageCircle, Mail, Phone, User, MapPin, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Product, formatPrice } from "@/lib/products-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface OrderModalProps {
  product: Product;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
}

type OrderStatus = "idle" | "loading" | "success" | "error";

export function OrderModal({ product, quantity, isOpen, onClose }: OrderModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    message: "",
  });
  const [status, setStatus] = useState<OrderStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const totalPrice = product.price * quantity;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const { error } = await supabase.from("orders").insert({
        user_id: user?.id ?? null,
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        quantity,
        unit_price: product.price,
        total_price: product.category === "piece" ? null : totalPrice,
        customer_name: formData.fullName,
        customer_phone: formData.phone,
        customer_email: formData.email || user?.email || null,
        customer_address: formData.address,
        customer_city: formData.city,
        message: formData.message || null,
      });
      if (error) throw error;
      setStatus("success");
      setTimeout(() => {
        setFormData({ fullName: "", phone: "", email: "", address: "", city: "", message: "" });
        setStatus("idle");
        onClose();
      }, 3000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Une erreur est survenue");
    }
  };

  const handleWhatsAppOrder = () => {
    const priceInfo =
      product.category === "piece"
        ? `- Prix : à confirmer`
        : `- Prix unitaire : ${formatPrice(product.price)}\n- Total : ${formatPrice(totalPrice)}`;
    const message = `Bonjour Hasilaza Motor,

Je souhaite commander :
- Produit : ${product.name}
- Quantité : ${quantity}
${priceInfo}

Mes informations :
- Nom : ${formData.fullName || "[À compléter]"}
- Téléphone : ${formData.phone || "[À compléter]"}
- Email : ${formData.email || "[Non fourni]"}
- Adresse : ${formData.address || "[À compléter]"}, ${formData.city || "[À compléter]"}

${formData.message ? `Message : ${formData.message}` : ""}

Merci de me confirmer la disponibilité et les modalités de livraison.`;

    window.open(`https://wa.me/221769358317?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-background rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Commander ce produit</h2>
                  <p className="text-sm text-muted-foreground">Remplissez vos informations</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Commande envoyée !</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Votre commande a été transmise. Vous recevrez une confirmation par email et WhatsApp très bientôt.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="bg-muted/50 rounded-2xl p-4 mb-6">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden shrink-0">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">Quantité : {quantity}</p>
                        {product.category !== "piece" && (
                          <>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm text-muted-foreground">Prix unitaire :</span>
                              <span className="font-medium">{formatPrice(product.price)}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-border mt-2 pt-2">
                              <span className="font-semibold">Total :</span>
                              <span className="text-lg font-bold text-primary">{formatPrice(totalPrice)}</span>
                            </div>
                          </>
                        )}
                        {product.category === "piece" && (
                          <div className="mt-2 pt-2 border-t border-border">
                            <span className="text-sm text-muted-foreground">Prix sur demande</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-destructive">Erreur</p>
                        <p className="text-sm text-destructive/80">{errorMessage}</p>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          Nom complet *
                        </Label>
                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Votre nom complet" required className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          Téléphone *
                        </Label>
                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+221 XX XXX XX XX" required className="h-12 rounded-xl" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        Email
                      </Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="votre@email.com" className="h-12 rounded-xl" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          Adresse *
                        </Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Votre adresse" required className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville *</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Ex : Dakar" required className="h-12 rounded-xl" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message (optionnel)</Label>
                      <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Instructions spéciales, questions..." rows={3} className="rounded-xl resize-none" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button type="submit" disabled={status === "loading"} className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base font-semibold">
                        {status === "loading" ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Mail className="w-5 h-5 mr-2" />
                            Commander par email
                          </>
                        )}
                      </Button>

                      <Button type="button" onClick={handleWhatsAppOrder} variant="outline" className="flex-1 h-14 border-2 border-primary text-primary hover:bg-primary/5 rounded-xl text-base font-semibold bg-transparent">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Commander via WhatsApp
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center pt-2">
                      En commandant, vous acceptez nos conditions de vente. L&apos;équipe Hasilaza recevra votre demande
                      par email et WhatsApp.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
