import { motion } from "framer-motion";
import { Wrench, Clock, Phone, MapPin, CheckCircle, Truck, Shield } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

const services = [
  { icon: Wrench, title: "Réparation moteur", desc: "Diagnostic et réparation complète des moteurs 2 et 3 roues." },
  { icon: Truck, title: "Dépannage sur place", desc: "Intervention rapide partout dans Dakar et environs." },
  { icon: Shield, title: "Entretien préventif", desc: "Révisions périodiques pour prolonger la vie de votre véhicule." },
  { icon: CheckCircle, title: "Pièces d'origine", desc: "Remplacement avec des pièces de qualité garanties." },
];

const steps = [
  { num: "01", title: "Appelez-nous", desc: "Décrivez votre panne par téléphone ou WhatsApp." },
  { num: "02", title: "Diagnostic", desc: "Notre expert évalue le problème et établit un devis." },
  { num: "03", title: "Intervention", desc: "Réparation rapide à l'atelier ou sur place." },
  { num: "04", title: "Garantie", desc: "Pièces et main-d'œuvre garanties après intervention." },
];

const Depannage = () => (
  <main className="min-h-screen bg-background">
    <Header />

    <section className="pt-28 md:pt-36 pb-16 bg-gradient-to-br from-primary/10 via-background to-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Service rapide 7j/7</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Dépannage & <span className="text-primary">Réparation</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Une panne ? Une révision ? Notre équipe technique intervient rapidement à Dakar et dans tout le Sénégal,
              pour vous remettre en route au plus vite.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-6">
                <a href="tel:+221781094091" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Appeler maintenant
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-6 border-2 hover:bg-muted bg-transparent"
              >
                <a
                  href="https://wa.me/221781094091?text=Bonjour, j'ai besoin d'un dépannage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border border-border rounded-3xl p-8 shadow-elegant"
          >
            <h3 className="font-bold text-xl mb-6">Disponibilité</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Lundi - Samedi</p>
                  <p className="text-sm text-muted-foreground">9h00 - 18h00</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Urgences</p>
                  <p className="text-sm text-muted-foreground">+221 781 094 091</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Atelier</p>
                  <p className="text-sm text-muted-foreground">HLM 2, Dakar</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nos services</h2>
          <p className="text-muted-foreground">Une expertise complète pour tous vos véhicules à 2 et 3 roues.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background border border-border rounded-2xl p-6"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <s.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Comment ça marche ?</h2>
          <p className="text-muted-foreground">Un processus simple et transparent en 4 étapes.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="bg-background border border-border rounded-2xl p-6 relative">
              <span className="text-5xl font-bold text-primary/20 absolute top-4 right-4">{s.num}</span>
              <h3 className="font-bold text-foreground mb-2 mt-8">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </main>
);

export default Depannage;
