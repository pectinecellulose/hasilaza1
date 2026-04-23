import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { supabase } from "@/integrations/supabase/client";

type State = "loading" | "valid" | "already" | "invalid" | "submitting" | "success" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    const validate = async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`;
        const res = await fetch(url, {
          headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        });
        const data = await res.json();
        if (data.valid) setState("valid");
        else if (data.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      } catch {
        setState("invalid");
      }
    };
    validate();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setState("submitting");
    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        "handle-email-unsubscribe",
        { body: { token } },
      );
      if (invokeError) throw invokeError;
      if (data?.success) setState("success");
      else if (data?.reason === "already_unsubscribed") setState("already");
      else {
        setError(data?.error ?? "Une erreur est survenue.");
        setState("error");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setState("error");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="container max-w-xl py-24">
        <div className="bg-card border border-border rounded-3xl p-8 text-center shadow-elegant">
          {state === "loading" && (
            <>
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Vérification du lien...</p>
            </>
          )}

          {state === "valid" && (
            <>
              <h1 className="font-display text-2xl font-bold mb-3">Se désabonner</h1>
              <p className="text-muted-foreground mb-6">
                Confirmez le désabonnement pour ne plus recevoir nos emails.
              </p>
              <Button onClick={handleConfirm} className="h-12 px-8 rounded-xl">
                Confirmer le désabonnement
              </Button>
            </>
          )}

          {state === "submitting" && (
            <>
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Traitement en cours...</p>
            </>
          )}

          {state === "success" && (
            <>
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold mb-2">Désabonnement confirmé</h1>
              <p className="text-muted-foreground">Vous ne recevrez plus nos emails.</p>
            </>
          )}

          {state === "already" && (
            <>
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold mb-2">Déjà désabonné</h1>
              <p className="text-muted-foreground">Cette adresse a déjà été désabonnée.</p>
            </>
          )}

          {state === "invalid" && (
            <>
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold mb-2">Lien invalide</h1>
              <p className="text-muted-foreground">Ce lien de désabonnement n'est pas valide ou a expiré.</p>
            </>
          )}

          {state === "error" && (
            <>
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold mb-2">Une erreur est survenue</h1>
              <p className="text-muted-foreground">{error}</p>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Unsubscribe;
