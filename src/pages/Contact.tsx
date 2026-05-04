import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle2, Sparkles, Navigation, Calendar } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { sendTransactionalEmail, notifyAdmins } from "@/lib/notify-emails";

const contactInfos = [
  { icon: Phone, label: "Téléphone", value: "+221 76 935 83 17", href: "tel:+221769358317" },
  { icon: Mail, label: "Email", value: "hasilazasenegal@gmail.com", href: "mailto:hasilazasenegal@gmail.com" },
  { icon: MapPin, label: "Adresse", value: "HLM 2, Dakar, Sénégal" },
  { icon: Clock, label: "Horaires", value: "Lundi au Samedi · 9h - 18h" },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const messageId = crypto.randomUUID();
    const { error } = await supabase.from("contact_messages").insert({
      id: messageId,
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject,
      message: form.message,
    });
    if (error) {
      setStatus("idle");
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }

    const emailData = {
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      subject: form.subject,
      message: form.message,
    };
    await sendTransactionalEmail({
      templateName: "contact-confirmation",
      recipientEmail: form.email,
      idempotencyKey: `contact-confirm-${messageId}`,
      templateData: { name: form.name, subject: form.subject },
    });
    await notifyAdmins("contact-admin", `contact-admin-${messageId}`, emailData);

    setStatus("success");
    setTimeout(() => {
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setStatus("idle");
    }, 3000);
  };

  // Note : le schéma LocalBusiness complet est défini une seule fois dans index.html (#business)
  // pour éviter les doublons. Ici on déclare juste une ContactPage qui référence le business via @id.
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": "https://hasilaza.com/contact#page",
    url: "https://hasilaza.com/contact",
    name: "Contact Hasilaza Motor",
    description: "Adresse, horaires et coordonnées de Hasilaza Motor à Dakar.",
    inLanguage: "fr-SN",
    isPartOf: { "@id": "https://hasilaza.com/#website" },
    about: { "@id": "https://hasilaza.com/#business" },
    mainEntity: { "@id": "https://hasilaza.com/#business" },
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Contact Hasilaza Motor - Adresse & Horaires à Dakar"
        description="Visitez notre showroom à HLM 2, Dakar. Ouvert du lundi au samedi 9h-18h. WhatsApp +221 76 935 83 17. Livraison partout au Sénégal."
        canonical="/contact"
        keywords="contact Hasilaza Motor, showroom moto Dakar, adresse tricycle Dakar, HLM 2 Dakar moto, WhatsApp Hasilaza"
        jsonLd={contactPageSchema}
      />
      <Header />

      <section className="relative pt-12 pb-10 md:pt-24 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-60" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-blob" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative container"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-xs font-medium text-primary uppercase tracking-widest">Contact</span>
            </div>
            <h1 className="font-display text-[2.5rem] sm:text-5xl md:text-7xl font-bold mb-4 md:mb-5 text-balance leading-[1.05]">
              Parlons de votre <span className="text-gradient-animated">projet.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
              Une question, une commande spéciale ou un devis ? Notre équipe vous répond rapidement.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="pb-24">
        <div className="container">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
            <div className="space-y-3">
              {contactInfos.map((info, i) => {
                const Wrapper = (info.href ? "a" : "div") as keyof JSX.IntrinsicElements;
                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Wrapper
                      {...(info.href ? { href: info.href } : {})}
                      className="flex items-start gap-4 p-5 bg-card rounded-3xl border border-border hover:border-primary/40 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-elegant group-hover:scale-110 transition-transform">
                        <info.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">{info.label}</p>
                        <p className="font-display font-semibold text-foreground mt-0.5">{info.value}</p>
                      </div>
                    </Wrapper>
                  </motion.div>
                );
              })}

              <a
                href="https://wa.me/221769358317?text=Bonjour, j'ai une question"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-5 bg-gradient-primary text-primary-foreground rounded-3xl font-semibold hover:opacity-90 transition-all shadow-glow"
              >
                <WhatsAppIcon className="w-6 h-6" />
                Discuter sur WhatsApp
              </a>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-card border border-border rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-elegant"
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Envoyez-nous un message</h2>
              <p className="text-sm text-muted-foreground mb-7">Réponse garantie sous 24h ouvrées.</p>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-12"
                >
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-5 shadow-glow">
                    <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">Message envoyé !</h3>
                  <p className="text-muted-foreground">Nous vous répondrons dans les plus brefs délais.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom *</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="h-12 rounded-xl border-2 bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                        className="h-12 rounded-xl border-2 bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="h-12 rounded-xl border-2 bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                      className="h-12 rounded-xl border-2 bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      className="rounded-xl resize-none border-2 bg-background"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full h-14 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-2xl text-base font-semibold shadow-ink"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* TROUVEZ-NOUS - SEO LOCAL */}
      <section className="pb-24" id="trouvez-nous">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Notre showroom</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 text-balance">
              Venez nous rencontrer à <span className="text-gradient-animated">Dakar</span>
            </h2>
            <p className="text-muted-foreground mt-4">
              Découvrez notre showroom et nos véhicules en personne. Nos experts vous conseillent sur place.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
            {/* Carte Google Maps */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-[2rem] overflow-hidden border border-border shadow-elegant min-h-[380px] lg:min-h-[480px] bg-muted"
            >
              <iframe
                title="Localisation Hasilaza Motor à Dakar"
                src="https://www.google.com/maps?q=HLM+2+Dakar+Senegal&hl=fr&z=14&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full border-0"
              />
            </motion.div>

            {/* Infos pratiques + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card border border-border rounded-[2rem] p-6 sm:p-8 shadow-elegant flex flex-col"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-glow">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Adresse</p>
                  <p className="font-display font-semibold text-foreground mt-0.5">HLM 2, Dakar</p>
                  <p className="text-sm text-muted-foreground">Sénégal · Région de Dakar</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Horaires d'ouverture</p>
                  <ul className="space-y-1.5 text-sm">
                    <li className="flex justify-between gap-4 text-foreground">
                      <span>Lundi – Vendredi</span>
                      <span className="font-medium">9h – 18h</span>
                    </li>
                    <li className="flex justify-between gap-4 text-foreground">
                      <span>Samedi</span>
                      <span className="font-medium">9h – 18h</span>
                    </li>
                    <li className="flex justify-between gap-4 text-muted-foreground">
                      <span>Dimanche</span>
                      <span className="font-medium">Fermé</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Appel direct</p>
                  <a href="tel:+221769358317" className="font-display font-semibold text-foreground mt-0.5 hover:text-primary transition-colors block">
                    +221 76 935 83 17
                  </a>
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <Button
                  asChild
                  className="w-full h-13 bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-2xl text-base font-semibold shadow-glow"
                >
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=HLM+2+Dakar+Senegal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-5 h-5" />
                    Itinéraire Google Maps
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-13 border-2 rounded-2xl text-base font-semibold"
                >
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Hasilaza+Motor+HLM+2+Dakar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-5 h-5" />
                    Voir sur Google Maps
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
