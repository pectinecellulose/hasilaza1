import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Users, Award, Heart, ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

const values = [
  { icon: Target, title: "Qualité", desc: "Nous sélectionnons rigoureusement nos produits pour garantir une qualité irréprochable." },
  { icon: Heart, title: "Passion", desc: "Une équipe passionnée par les véhicules à 2 et 3 roues, à votre écoute au quotidien." },
  { icon: Users, title: "Proximité", desc: "Plus de 5000 clients satisfaits dans tout le Sénégal nous font confiance." },
  { icon: Award, title: "Expertise", desc: "Plus de 5 ans d'expérience dans la vente de motos, tricycles et pièces détachées." },
];

const APropos = () => (
  <main className="min-h-screen bg-background">
    <Header />

    <section className="pt-28 md:pt-36 pb-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary">À propos</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            L&apos;histoire de <span className="text-primary">Hasilaza Motor</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Depuis 2018, Hasilaza Motor est devenu un acteur majeur de la mobilité au Sénégal. Spécialisés dans la
            vente de tricycles cargo, de motos et de pièces détachées, nous accompagnons les professionnels et les
            particuliers avec des solutions fiables et accessibles.
          </p>
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">Notre mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Faciliter l&apos;accès à des moyens de transport et de travail performants pour tous les Sénégalais.
              Que ce soit pour développer une activité commerciale grâce à un tricycle cargo robuste, ou pour se
              déplacer en ville avec une moto fiable, nous offrons des produits adaptés à chaque besoin.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Notre engagement : un service après-vente expert, une garantie complète et des pièces détachées
              disponibles à tout moment.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/produits" className="flex items-center gap-2">
                Découvrir nos produits
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: "+5", label: "Années d'expérience" },
              { value: "5000+", label: "Clients satisfaits" },
              { value: "10K+", label: "Véhicules vendus" },
              { value: "100%", label: "Satisfaction" },
            ].map((s) => (
              <div key={s.label} className="bg-muted/50 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nos valeurs</h2>
          <p className="text-muted-foreground">
            Quatre piliers qui guident chaque décision et chaque relation client.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background border border-border rounded-2xl p-6 text-center"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </main>
);

export default APropos;
