import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const MentionsLegales = () => (
  <main className="min-h-screen bg-background">
    <Header />
    <section className="pt-28 md:pt-36 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Mentions légales</h1>

        <div className="prose prose-lg max-w-none text-foreground/80 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">Éditeur du site</h2>
            <p>
              <strong>Hasilaza Motor</strong> — Entreprise commerciale spécialisée dans la vente de tricycles, motos
              et pièces détachées.
            </p>
            <p>Adresse : HLM 2, Dakar, Sénégal</p>
            <p>Téléphone : +221 781 094 091</p>
            <p>Email : Mortalla581@gmail.com</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">Hébergement</h2>
            <p>Ce site est hébergé sur l&apos;infrastructure cloud Lovable.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, logos, vidéos) est la propriété exclusive de
              Hasilaza Motor. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">Responsabilité</h2>
            <p>
              Hasilaza Motor met tout en œuvre pour fournir des informations exactes et à jour. Toutefois, nous ne
              pouvons garantir l&apos;absence d&apos;erreurs et déclinons toute responsabilité quant aux dommages
              directs ou indirects pouvant résulter de l&apos;utilisation de ce site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit sénégalais. Tout litige sera soumis aux
              tribunaux compétents de Dakar.
            </p>
          </section>
        </div>
      </div>
    </section>
    <Footer />
  </main>
);

export default MentionsLegales;
