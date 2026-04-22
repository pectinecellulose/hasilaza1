import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { user, isAdmin, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
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
    const { error } = mode === "signin" ? await signIn(email, password) : await signUp(email, password);
    setSubmitting(false);
    if (error) {
      toast({ title: "Erreur", description: error, variant: "destructive" });
    } else if (mode === "signup") {
      toast({ title: "Compte créé", description: "Vérifiez votre email pour confirmer (si activé)." });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>

        <div className="bg-background border border-border rounded-3xl p-8 shadow-elegant">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-black text-xl">
              H
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Espace Admin</h1>
              <p className="text-sm text-muted-foreground">Hasilaza Motor</p>
            </div>
          </div>

          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "signin" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "signup" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Inscription
            </button>
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
                className="h-12 rounded-xl"
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
                className="h-12 rounded-xl"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === "signin" ? (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Se connecter
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Créer mon compte
                </>
              )}
            </Button>
          </form>

          {mode === "signup" && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Le rôle administrateur doit être assigné par un admin existant.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Auth;
