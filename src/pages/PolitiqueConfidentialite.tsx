import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const sections = [
  {
    title: "Collecte des données",
    body: (
      <p>
        Hasilaza Motor collecte uniquement les données nécessaires au traitement de vos commandes et demandes : nom,
        prénom, téléphone, email et adresse de livraison.
      </p>
    ),
  },
  {
    title: "Utilisation des données",
    body: (
      <>
        <p>Vos données personnelles sont utilisées exclusivement pour :</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Le traitement et le suivi de vos commandes</li>
          <li>La communication relative à nos services</li>
          <li>L'amélioration de l'expérience client</li>
        </ul>
      </>
    ),
  },
  {
    title: "Conservation des données",
    body: (
      <p>
        Vos données sont conservées pendant la durée nécessaire à la fourniture du service, puis archivées conformément
        aux obligations légales.
      </p>
    ),
  },
  {
    title: "Vos droits",
    body: (
      <p>
        Conformément à la législation en vigueur, vous disposez d'un droit d'accès, de rectification, d'opposition et
        de suppression de vos données. Pour exercer ces droits, contactez-nous à hasilazasenegal@gmail.com.
      </p>
    ),
  },
  {
    title: "Cookies",
    body: (
      <p>
        Ce site utilise des cookies techniques nécessaires au bon fonctionnement. Aucun cookie publicitaire ou de
        tracking tiers n'est utilisé sans votre consentement.
      </p>
    ),
  },
  {
    title: "Sécurité",
    body: (
      <p>
        Nous mettons en place toutes les mesures techniques et organisationnelles nécessaires pour protéger vos données
        contre tout accès non autorisé, altération ou destruction.
      </p>
    ),
  },
];

const PolitiqueConfidentialite = () => (
  <main className="min-h-screen bg-background">
    <Header />
    <section className="relative pt-16 md:pt-24 pb-24">
      <div className="absolute inset-0 bg-gradient-radial opacity-40" />
      <div className="relative container max-w-3xl">
        <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Confidentialité</span>
        <h1 className="font-display text-5xl md:text-6xl font-bold mt-3 mb-12 text-balance">
          Politique de confidentialité
        </h1>

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

export default PolitiqueConfidentialite;
