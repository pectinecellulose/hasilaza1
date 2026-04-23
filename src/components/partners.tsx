import { motion } from "framer-motion";
import ancs from "@/assets/partners/ancs.png";
import enabel from "@/assets/partners/enabel.png";
import humanAppeal from "@/assets/partners/human-appeal.png";
import qatarCharity from "@/assets/partners/qatar-charity.png";
import socodevi from "@/assets/partners/socodevi.png";
import somaphy from "@/assets/partners/somaphy.png";

const partners = [
  { name: "ANCS", logo: ancs },
  { name: "Enabel", logo: enabel },
  { name: "Human Appeal", logo: humanAppeal },
  { name: "Qatar Charity", logo: qatarCharity },
  { name: "SOCODEVI", logo: socodevi },
  { name: "Somaphy West Africa", logo: somaphy },
];

export function Partners() {
  return (
    <section className="py-20 md:py-24 bg-background border-y border-border">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
            Ils nous font confiance
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-3 text-balance">
            Nos partenaires
          </h2>
          <p className="text-muted-foreground mt-4">
            Des organisations de référence qui collaborent avec Hasilaza Motor pour soutenir la mobilité au Sénégal et en Afrique de l'Ouest.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="group relative aspect-square bg-card border border-border rounded-2xl p-5 md:p-6 flex items-center justify-center hover:border-primary/40 hover:shadow-elegant transition-all duration-300"
            >
              <img
                src={partner.logo}
                alt={`Logo ${partner.name}`}
                loading="lazy"
                className="max-w-full max-h-full object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
