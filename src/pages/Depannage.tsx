import { motion } from "framer-motion";
import { Wrench, Clock, Phone, MapPin, CheckCircle2, Truck, Shield, Zap, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { RepairRequestForm } from "@/components/repair-request-form";

const services = [
  { icon: Wrench, title: "Réparation moteur", desc: "Diagnostic et réparation complète des moteurs 2 et 3 roues." },
  { icon: Truck, title: "Dépannage sur place", desc: "Intervention rapide partout dans Dakar et environs." },
  { icon: Shield, title: "Entretien préventif", desc: "Révisions périodiques pour prolonger la vie de votre véhicule." },
  { icon: CheckCircle2, title: "Pièces d'origine", desc: "Remplacement avec des pièces de qualité garanties." },
];

const steps = [
  { num: "01", title: "Appelez-nous", desc: "Décrivez votre panne par téléphone ou WhatsApp." },
  { num: "02", title: "Diagnostic", desc: "Notre expert évalue le problème et établit un devis." },
  { num: "03", title: "Intervention", desc: "Réparation rapide à l'atelier ou sur place." },
  { num: "04", title: "Garantie", desc: "Pièces et main-d'œuvre garanties après intervention." },
];

const Depannage = () => (
  <main className="min-h-screen bg-background">
    <SEO
      title="Dépannage Moto & Tricycle à Dakar - SAV Hasilaza Motor"
      description="Service de dépannage rapide pour tricycles et motos au Sénégal. Diagnostic, réparation, pièces d'origine. Intervention sur place à Dakar."
      canonical="/depannage"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: "Réparation et dépannage moto et tricycle",
        provider: { "@type": "Organization", name: "Hasilaza Motor" },
        areaServed: { "@type": "Country", name: "Sénégal" },
      }}
    />
    <Header />

    <section className="relative pt-12 pb-16 md:pt-24 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial opacity-60" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 -left-20 w-72 h-72 bg-primary-glow/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="relative container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-xs font-medium text-primary uppercase tracking-widest">Service rapide 6j/7</span>
            </div>
            <h1 className="font-display text-[2.5rem] sm:text-5xl md:text-7xl font-bold mb-5 md:mb-6 text-balance leading-[1.05]">
              Dépannage <span className="text-gradient-animated">express.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-lg">
              Une panne ? Une révision ? Notre équipe technique intervient rapidement à Dakar et dans tout le Sénégal,
              pour vous remettre en route au plus vite.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-14 px-7 rounded-full shadow-ink">
                  <a href="tel:+221769358317" className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Appeler maintenant
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-7 border-2 rounded-full bg-background/50 backdrop-blur"
                >
                  <a
                    href="https://wa.me/221769358317?text=Bonjour, j'ai besoin d'un dépannage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    WhatsApp
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-3xl rounded-[3rem]" />
            <div className="relative bg-card border border-border rounded-[2rem] p-8 shadow-ink">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">Disponibilité</h3>
                  <p className="text-xs text-muted-foreground">Service technique</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { icon: Clock, title: "Lundi - Samedi", desc: "9h00 - 18h00" },
                  { icon: Phone, title: "Urgences", desc: "+221 76 935 83 17" },
                  { icon: MapPin, title: "Atelier", desc: "HLM 2, Dakar" },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors">
                    <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    <section className="py-24 bg-muted/30 border-y border-border">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Services</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-balance">
            Une expertise complète.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-card border border-border rounded-3xl p-6 hover:border-primary/40 hover:shadow-elegant transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <s.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-24">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Processus</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-balance">
            Simple et transparent.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-card border border-border rounded-3xl p-6 hover:border-primary/40 transition-all overflow-hidden"
            >
              <span className="absolute top-3 right-4 font-display text-7xl font-bold text-primary/10">{s.num}</span>
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-gradient-primary mb-12" />
                <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-24 bg-muted/30 border-t border-border">
      <div className="container max-w-3xl">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Demande en ligne</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-balance">
            Demandez une intervention.
          </h2>
          <p className="text-muted-foreground mt-3">
            Remplissez le formulaire, notre équipe vous rappelle sous 24h.
          </p>
        </div>
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-elegant">
          <RepairRequestForm />
        </div>
      </div>
    </section>

    <Footer />
  </main>
);

export default Depannage;
