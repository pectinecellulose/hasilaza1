import { useEffect, useState, type ReactNode } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, User as UserIcon, Wrench, LogOut, Loader2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const tabs: { to: string; label: string; icon: typeof ShoppingBag }[] = [
  { to: "/compte", label: "Mes commandes", icon: ShoppingBag },
  { to: "/compte/favoris", label: "Favoris", icon: Heart },
  { to: "/compte/depannage", label: "Mes dépannages", icon: Wrench },
  { to: "/compte/profil", label: "Profil", icon: UserIcon },
];

export default function ClientLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setDisplayName(data?.full_name || user.email || ""));
  }, [user]);

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="pt-10 pb-20">
        <div className="container">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Mon compte</span>
            <h1 className="font-display text-3xl md:text-5xl font-bold mt-3">
              Bonjour {displayName.split(" ")[0] || "👋"}
            </h1>
            <p className="text-muted-foreground mt-2">Gérez vos commandes, favoris et informations personnelles.</p>
          </div>

          <div className="grid lg:grid-cols-[260px_1fr] gap-6">
            <aside className="space-y-1.5 lg:sticky lg:top-24 self-start">
              {tabs.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.to === "/compte"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-primary text-primary-foreground shadow-elegant"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </NavLink>
              ))}
              <Button
                variant="ghost"
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
                className="w-full justify-start gap-3 px-4 py-3 h-auto rounded-2xl text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            </aside>

            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 min-h-[400px]">
              <Outlet />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export function ClientSection({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>}
      {children}
    </div>
  );
}
