import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Users, Award, Heart, ArrowUpRight, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

const values = [
  { icon: Target, title: "Qualité", desc: "Sélection rigoureuse pour garantir une qualité irréprochable." },
  { icon: Heart, title: "Passion", desc: "Une équipe passionnée par les véhicules à 2 et 3 roues." },
  { icon: Users, title: "Proximité", desc: "+5000 clients satisfaits dans tout le Sénégal." },
  { icon: Award, title: "Expertise", desc: "5 ans d'expérience et un savoir-faire reconnu." },
];

const milestones = [
  { year: "2018", title: "Fondation", desc: "Lancement de Hasilaza Motor à Dakar avec une vision claire : démocratiser la mobilité." },
  { year: "2020", title: "Expansion", desc: "Ouverture de l'atelier SAV et lancement de la gamme tricycles cargo." },
  { year: "2022", title: "Leader", desc: "Plus de 5000 clients servis et une présence dans toutes les régions." },
  { year: "2024", title: "Innovation", desc: "Digitalisation complète et lancement de la plateforme en ligne." },
];

const APropos = () => (
  <main className="min-h-screen bg-background">
    <Header />

    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial opacity-60" />
      <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />

      <div className="relative container">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-widest">Notre histoire</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-balance leading-[1.05]">
            Plus qu'une entreprise,{" "}
            <span className="text-gradient">une mission.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Depuis 2018, Hasilaza Motor accompagne les Sénégalais dans leur mobilité.
            Tricycles cargo, motos, pièces détachées : nous proposons des solutions
            fiables pour les professionnels et les particuliers.
          </p>
        </div>
      </div>
    </section>

    <section className="py-20 bg-muted/30 border-y border-border">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Notre mission</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6 text-balance">
              Faciliter la mobilité au Sénégal.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Que ce soit pour développer une activité commerciale grâce à un tricycle cargo robuste, ou pour se
              déplacer en ville avec une moto fiable, nous offrons des produits adaptés à chaque besoin.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Notre engagement : un service après-vente expert, une garantie complète et des pièces détachées
              disponibles à tout moment.
            </p>
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full h-12 px-6 group">
              <Link to="/produits" className="flex items-center gap-2">
                Découvrir nos produits
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: "+5", label: "Années d'expérience" },
              { value: "5K+", label: "Clients satisfaits" },
              { value: "10K+", label: "Véhicules vendus" },
              { value: "100%", label: "Engagement qualité" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-card rounded-3xl p-7 border border-border ${i === 0 || i === 3 ? "translate-y-6" : ""}`}
              >
                <div className="font-display text-4xl md:text-5xl font-bold text-gradient mb-2">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="py-24">
      <div className="container">
        <div className="max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Parcours</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-balance">
            Notre évolution depuis 2018.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-card border border-border rounded-3xl p-6 hover:border-primary/40 transition-all"
            >
              <div className="font-display text-5xl font-bold text-gradient mb-4">{m.year}</div>
              <h3 className="font-display font-bold mb-2">{m.title}</h3>
              <p className="text-sm text-muted-foreground">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial opacity-40" />
      <div className="relative container">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Nos valeurs</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-balance">
            Quatre piliers, une seule promesse.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 backdrop-blur rounded-3xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-glow">
                <v.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-secondary-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-secondary-foreground/70">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </main>
);

export default APropos;
