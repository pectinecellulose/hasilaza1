import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, LogIn, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/seo";

const Auth = () => {
  const { user, isAdmin, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate(isAdmin ? "/admin" : "/", { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast({ title: "Erreur", description: error, variant: "destructive" });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-12">
      <SEO title="Connexion | Hasilaza Motor" description="Espace de connexion réservé." canonical="/auth" noindex />
      <div className="absolute inset-0 bg-gradient-radial opacity-60" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-primary-glow/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 text-sm group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
        </Link>

        <div className="bg-card border border-border rounded-[2rem] p-8 shadow-ink backdrop-blur">
          <div className="flex items-center gap-3 mb-7">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-md opacity-60" />
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl shadow-elegant">
                H
              </div>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">Espace Admin</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Hasilaza Motor</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-2 bg-background"
                placeholder="vous@exemple.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-12 rounded-xl border-2 bg-background"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl shadow-ink"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Se connecter
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            Accès réservé aux administrateurs autorisés.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Auth;
