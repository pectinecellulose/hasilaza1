import { Link } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

const ComingSoon = ({ title, description }: ComingSoonProps) => (
  <main className="min-h-screen bg-background">
    <Header />
    <section className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Construction className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
          <p className="text-muted-foreground mb-8">
            {description ?? "Cette page sera disponible prochainement. Nous finalisons les derniers détails."}
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/">Retour à l&apos;accueil</Link>
          </Button>
        </div>
      </div>
    </section>
    <Footer />
  </main>
);

export default ComingSoon;
