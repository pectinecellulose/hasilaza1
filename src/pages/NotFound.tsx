import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-radial opacity-60" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-primary-glow/10 rounded-full blur-3xl" />

      <div className="relative text-center max-w-lg">
        <div className="font-display text-[140px] md:text-[200px] font-bold text-gradient leading-none mb-4">404</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Page introuvable</h1>
        <p className="text-muted-foreground mb-8">
          La page que vous cherchez n'existe pas ou a été déplacée. Retournez à l'accueil pour continuer la navigation.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full h-12 px-6 shadow-ink">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-2 rounded-full h-12 px-6">
            <Link to="/produits" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voir le catalogue
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
