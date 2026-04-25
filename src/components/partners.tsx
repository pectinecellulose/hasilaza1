import ancs from "@/assets/partners/ancs.png";
import enabel from "@/assets/partners/enabel.png";
import humanAppeal from "@/assets/partners/human-appeal.png";
import qatarCharity from "@/assets/partners/qatar-charity.png";
import socodevi from "@/assets/partners/socodevi.png";
import somaphy from "@/assets/partners/somaphy.png";
import sogepal from "@/assets/partners/sogepal.webp";

const partners = [
  { name: "ANCS", logo: ancs },
  { name: "Enabel", logo: enabel },
  { name: "Human Appeal", logo: humanAppeal },
  { name: "Qatar Charity", logo: qatarCharity },
  { name: "SOCODEVI", logo: socodevi },
  { name: "Somaphy West Africa", logo: somaphy },
  { name: "SOGEPAL", logo: sogepal },
];

export function Partners() {
  const looped = [...partners, ...partners];

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

        {/* Mobile: défilement automatique */}
        <div className="md:hidden -mx-4 overflow-hidden relative">
          <div className="flex gap-3 w-max animate-marquee">
            {looped.map((partner, i) => (
              <div
                key={`m-${partner.name}-${i}`}
                className="relative shrink-0 w-32 h-32 bg-card border border-border rounded-2xl p-4 flex items-center justify-center"
              >
                <img
                  src={partner.logo}
                  alt={`Logo ${partner.name}`}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: défilement automatique */}
        <div className="hidden md:block overflow-hidden relative group">
          <div className="flex gap-4 w-max animate-marquee group-hover:[animation-play-state:paused]">
            {looped.map((partner, i) => (
              <div
                key={`d-${partner.name}-${i}`}
                className="relative shrink-0 w-40 h-40 lg:w-44 lg:h-44 bg-card border border-border rounded-2xl p-6 flex items-center justify-center hover:border-primary/40 hover:shadow-elegant transition-all duration-300"
              >
                <img
                  src={partner.logo}
                  alt={`Logo ${partner.name}`}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
