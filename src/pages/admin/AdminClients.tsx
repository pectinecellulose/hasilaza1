import { useEffect, useState } from "react";
import { Users, Loader2, Search, Mail, Phone, MapPin, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/products-data";

interface ClientRow {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  address: string | null;
  created_at: string;
  email?: string;
  orderCount: number;
  totalSpent: number;
}

const AdminClients = () => {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [profilesRes, ordersRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, user_id, full_name, phone, city, address, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("orders").select("user_id, total_price, status, customer_email"),
      ]);

      const profiles = (profilesRes.data ?? []) as Omit<ClientRow, "orderCount" | "totalSpent">[];
      const orders = (ordersRes.data ?? []) as { user_id: string | null; total_price: number | null; status: string; customer_email: string | null }[];

      // Map orders by user
      const orderMap = new Map<string, { count: number; spent: number; email?: string }>();
      orders.forEach((o) => {
        if (!o.user_id) return;
        const cur = orderMap.get(o.user_id) ?? { count: 0, spent: 0 };
        cur.count += 1;
        if (["confirmed", "processing", "shipped", "delivered"].includes(o.status)) {
          cur.spent += Number(o.total_price ?? 0);
        }
        if (o.customer_email) cur.email = o.customer_email;
        orderMap.set(o.user_id, cur);
      });

      const merged = profiles.map((p) => {
        const meta = orderMap.get(p.user_id) ?? { count: 0, spent: 0 };
        return { ...p, orderCount: meta.count, totalSpent: meta.spent, email: meta.email };
      });

      setClients(merged);
      setLoading(false);
    })();
  }, []);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.full_name ?? "").toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q) ||
      (c.phone ?? "").includes(q) ||
      (c.city ?? "").toLowerCase().includes(q)
    );
  });

  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);
  const activeClients = clients.filter((c) => c.orderCount > 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">CRM</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Clients</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Carnet d'adresses, historique d'achats et fidélité.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-primary opacity-10" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Clients enregistrés</p>
            <p className="font-display text-2xl font-bold mt-1">{clients.length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-3xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-3">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Clients actifs</p>
          <p className="font-display text-2xl font-bold mt-1">{activeClients}</p>
        </div>
        <div className="bg-card border border-border rounded-3xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mb-3">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenu cumulé</p>
          <p className="font-display text-2xl font-bold mt-1 text-primary">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher (nom, email, téléphone, ville)..."
          className="pl-11 h-11 rounded-xl"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-3xl">
          <Users className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground text-sm">Aucun client trouvé.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="group bg-card border border-border rounded-3xl p-5 hover:border-primary/40 hover:shadow-elegant transition-all"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold shrink-0">
                  {(c.full_name ?? "?")[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold text-base truncate">{c.full_name || "Sans nom"}</p>
                  <p className="text-xs text-muted-foreground">
                    Inscrit le {new Date(c.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                {c.orderCount > 0 && (
                  <Badge className="rounded-full bg-primary/10 text-primary border-primary/20" variant="outline">
                    Actif
                  </Badge>
                )}
              </div>

              <div className="space-y-2 mb-4 text-sm">
                {c.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                )}
                {c.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{c.phone}</span>
                  </div>
                )}
                {(c.city || c.address) && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="truncate">{[c.address, c.city].filter(Boolean).join(", ")}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Commandes</p>
                  <p className="font-display font-bold text-lg">{c.orderCount}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total dépensé</p>
                  <p className="font-display font-bold text-lg text-primary">{formatPrice(c.totalSpent)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminClients;
