import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const PolitiqueConfidentialite = () => (
  <main className="min-h-screen bg-background">
    <Header />
    <section className="pt-28 md:pt-36 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Politique de confidentialité</h1>

        <div className="space-y-6 text-foreground/80">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">Collecte des données</h2>
            <p>
              Hasilaza Motor collecte uniquement les données nécessaires au traitement de vos commandes et demandes :
              nom, prénom, téléphone, email et adresse de livraison.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">Utilisation des données</h2>
            <p>Vos données personnelles sont utilisées exclusivement pour :</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Le traitement et le suivi de vos commandes</li>
              <li>La communication relative à nos services</li>
              <li>L&apos;amélioration de l&apos;expérience client</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">Conservation des données</h2>
            <p>
              Vos données sont conservées pendant la durée nécessaire à la fourniture du service, puis archivées
              conformément aux obligations légales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">Vos droits</h2>
            <p>
              Conformément à la législation en vigueur, vous disposez d&apos;un droit d&apos;accès, de rectification,
              d&apos;opposition et de suppression de vos données. Pour exercer ces droits, contactez-nous à
              Mortalla581@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">Cookies</h2>
            <p>
              Ce site utilise des cookies techniques nécessaires au bon fonctionnement. Aucun cookie publicitaire ou
              de tracking tiers n&apos;est utilisé sans votre consentement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">Sécurité</h2>
            <p>
              Nous mettons en place toutes les mesures techniques et organisationnelles nécessaires pour protéger vos
              données contre tout accès non autorisé, altération ou destruction.
            </p>
          </section>
        </div>
      </div>
    </section>
    <Footer />
  </main>
);

export default PolitiqueConfidentialite;
