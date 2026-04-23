import { useEffect, useState } from "react";
import { Loader2, Wrench, Calendar } from "lucide-react";
import { ClientSection } from "./ClientLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

interface Repair {
  id: string;
  vehicle_type: string;
  vehicle_brand: string | null;
  problem_description: string;
  city: string;
  preferred_date: string | null;
  status: string;
  created_at: string;
  admin_notes: string | null;
}

const statusLabel: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "En attente", variant: "secondary" },
  contacted: { label: "Contacté", variant: "default" },
  scheduled: { label: "Planifié", variant: "default" },
  completed: { label: "Terminé", variant: "default" },
  cancelled: { label: "Annulé", variant: "destructive" },
};

export default function ClientRepairs() {
  const { user } = useAuth();
  const [items, setItems] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("repair_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems((data as Repair[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  return (
    <ClientSection title="Mes demandes de dépannage" subtitle="Suivez vos demandes d'intervention">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <Wrench className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">Aucune demande de dépannage pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => {
            const s = statusLabel[r.status] ?? { label: r.status, variant: "secondary" as const };
            return (
              <div key={r.id} className="p-4 bg-muted/40 border border-border rounded-2xl">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-semibold">
                      {r.vehicle_type} {r.vehicle_brand && `· ${r.vehicle_brand}`}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(r.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {r.city && ` · ${r.city}`}
                    </p>
                  </div>
                  <Badge variant={s.variant}>{s.label}</Badge>
                </div>
                <p className="text-sm text-foreground/80 mb-2">{r.problem_description}</p>
                {r.admin_notes && (
                  <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                    <p className="text-xs font-medium text-primary mb-1">Note de l'équipe</p>
                    <p className="text-sm">{r.admin_notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </ClientSection>
  );
}
