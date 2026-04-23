import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const sections = [
  {
    title: "Éditeur du site",
    body: (
      <>
        <p><strong>Hasilaza Motor</strong> — Entreprise commerciale spécialisée dans la vente de tricycles, motos et pièces détachées.</p>
        <p>Adresse : HLM 2, Dakar, Sénégal</p>
        <p>Téléphone : +221 76 935 83 17</p>
        <p>Email : hasilazasenegal@gmail.com</p>
      </>
    ),
  },
  { title: "Hébergement", body: <p>Ce site est hébergé sur l'infrastructure cloud Lovable.</p> },
  {
    title: "Propriété intellectuelle",
    body: (
      <p>
        L'ensemble du contenu de ce site (textes, images, logos, vidéos) est la propriété exclusive de Hasilaza Motor.
        Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.
      </p>
    ),
  },
  {
    title: "Responsabilité",
    body: (
      <p>
        Hasilaza Motor met tout en œuvre pour fournir des informations exactes et à jour. Toutefois, nous ne pouvons
        garantir l'absence d'erreurs et déclinons toute responsabilité quant aux dommages directs ou indirects
        pouvant résulter de l'utilisation de ce site.
      </p>
    ),
  },
  {
    title: "Droit applicable",
    body: (
      <p>
        Les présentes mentions légales sont régies par le droit sénégalais. Tout litige sera soumis aux tribunaux
        compétents de Dakar.
      </p>
    ),
  },
];

const MentionsLegales = () => (
  <main className="min-h-screen bg-background">
    <Header />
    <section className="relative pt-16 md:pt-24 pb-24">
      <div className="absolute inset-0 bg-gradient-radial opacity-40" />
      <div className="relative container max-w-3xl">
        <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Légal</span>
        <h1 className="font-display text-5xl md:text-6xl font-bold mt-3 mb-12">Mentions légales</h1>

        <div className="space-y-5">
          {sections.map((s) => (
            <div key={s.title} className="bg-card border border-border rounded-3xl p-7">
              <h2 className="font-display text-xl font-bold mb-3">{s.title}</h2>
              <div className="text-foreground/70 space-y-2 text-sm leading-relaxed">{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </main>
);

export default MentionsLegales;
