import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Package, ChevronRight } from "lucide-react";
import { ClientSection } from "./ClientLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice } from "@/lib/products-data";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  product_name: string;
  product_slug: string | null;
  quantity: number;
  total_price: number | null;
  status: string;
  created_at: string;
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "En attente", variant: "secondary" },
  confirmed: { label: "Confirmée", variant: "default" },
  processing: { label: "En préparation", variant: "default" },
  shipped: { label: "Expédiée", variant: "default" },
  delivered: { label: "Livrée", variant: "default" },
  cancelled: { label: "Annulée", variant: "destructive" },
};

export default function ClientOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, product_name, product_slug, quantity, total_price, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setOrders((data as Order[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  return (
    <ClientSection title="Mes commandes" subtitle="Historique de toutes vos commandes passées">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground mb-4">Vous n'avez pas encore passé de commande.</p>
          <Link to="/produits" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
            Voir le catalogue <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const status = statusLabels[o.status] ?? { label: o.status, variant: "secondary" as const };
            return (
              <div
                key={o.id}
                className="flex items-center gap-4 p-4 bg-muted/40 rounded-2xl border border-border hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{o.product_name}</h3>
                    <Badge variant={status.variant} className="shrink-0">
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Quantité: {o.quantity} ·{" "}
                    {new Date(o.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  {o.total_price && (
                    <p className="font-display font-bold">{formatPrice(Number(o.total_price))}</p>
                  )}
                  {o.product_slug && (
                    <Link
                      to={`/produits/${o.product_slug}`}
                      className="text-xs text-primary hover:underline"
                    >
                      Voir le produit
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ClientSection>
  );
}
