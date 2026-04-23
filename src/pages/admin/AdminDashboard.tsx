import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  Loader2,
  ArrowUpRight,
  Users,
  Wrench,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/products-data";

interface Stats {
  products: number;
  orders: number;
  pendingOrders: number;
  deliveredOrders: number;
  messages: number;
  unreadMessages: number;
  customers: number;
  repairs: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  customer_name: string;
  product_name: string;
  total_price: number | null;
  status: string;
  created_at: string;
}

interface ChartPoint {
  date: string;
  revenue: number;
  orders: number;
}

const statusColor: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
  confirmed: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20",
  processing: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/20",
  shipped: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
  delivered: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20",
};

const statusLabel: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  processing: "Traitement",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentOrder[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [
        productsRes,
        ordersRes,
        pendingRes,
        deliveredRes,
        messagesRes,
        unreadRes,
        customersRes,
        repairsRes,
        revenueRes,
        recentRes,
        chartRes,
      ] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "delivered"),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("repair_requests").select("id", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("total_price")
          .in("status", ["confirmed", "processing", "shipped", "delivered"]),
        supabase
          .from("orders")
          .select("id, customer_name, product_name, total_price, status, created_at")
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("orders")
          .select("created_at, total_price, status")
          .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order("created_at", { ascending: true }),
      ]);

      const revenue = (revenueRes.data ?? []).reduce(
        (sum, r: { total_price: number | null }) => sum + Number(r.total_price ?? 0),
        0,
      );

      // Build daily chart data for last 14 days
      const buckets = new Map<string, ChartPoint>();
      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        buckets.set(key, {
          date: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
          revenue: 0,
          orders: 0,
        });
      }
      ((chartRes.data as { created_at: string; total_price: number | null; status: string }[]) ?? []).forEach((row) => {
        const key = row.created_at.slice(0, 10);
        const point = buckets.get(key);
        if (point) {
          point.orders += 1;
          if (["confirmed", "processing", "shipped", "delivered"].includes(row.status)) {
            point.revenue += Number(row.total_price ?? 0);
          }
        }
      });

      setStats({
        products: productsRes.count ?? 0,
        orders: ordersRes.count ?? 0,
        pendingOrders: pendingRes.count ?? 0,
        deliveredOrders: deliveredRes.count ?? 0,
        messages: messagesRes.count ?? 0,
        unreadMessages: unreadRes.count ?? 0,
        customers: customersRes.count ?? 0,
        repairs: repairsRes.count ?? 0,
        revenue,
      });
      setRecent((recentRes.data as RecentOrder[]) ?? []);
      setChartData(Array.from(buckets.values()));
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Revenu confirmé",
      value: formatPrice(stats?.revenue ?? 0),
      icon: TrendingUp,
      gradient: "from-primary to-primary-glow",
      hint: `${stats?.deliveredOrders ?? 0} livrées`,
    },
    {
      label: "Commandes",
      value: stats?.orders ?? 0,
      icon: ShoppingCart,
      gradient: "from-blue-500 to-cyan-400",
      hint: `${stats?.pendingOrders ?? 0} en attente`,
    },
    {
      label: "Clients",
      value: stats?.customers ?? 0,
      icon: Users,
      gradient: "from-purple-500 to-pink-400",
      hint: "Comptes actifs",
    },
    {
      label: "Produits",
      value: stats?.products ?? 0,
      icon: Package,
      gradient: "from-emerald-500 to-teal-400",
      hint: "Au catalogue",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Vue d'ensemble</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Tableau de bord</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Pilotez votre activité Hasilaza Motor en temps réel.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link to="/admin/commandes">Voir les commandes</Link>
          </Button>
          <Button asChild size="sm" className="rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Link to="/admin/produits/nouveau">Nouveau produit</Link>
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="group relative overflow-hidden bg-card border border-border rounded-3xl p-5 hover:shadow-elegant transition-all"
          >
            <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className="relative flex items-start justify-between mb-4">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{card.label}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-elegant`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="relative">
              <p className="font-display text-2xl md:text-3xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.hint}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + side panel */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-lg">Évolution sur 14 jours</h2>
              <p className="text-xs text-muted-foreground">Revenu et nombre de commandes</p>
            </div>
            <Badge variant="secondary" className="rounded-full">14 derniers jours</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name: string) => [name === "revenue" ? formatPrice(value) : value, name === "revenue" ? "Revenu" : "Commandes"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#revenueFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
          <div>
            <h2 className="font-display font-bold text-lg">Activité</h2>
            <p className="text-xs text-muted-foreground">À surveiller</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm">{stats?.pendingOrders} commandes</p>
                <p className="text-xs text-muted-foreground">en attente de traitement</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm">{stats?.unreadMessages} messages</p>
                <p className="text-xs text-muted-foreground">non lus</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm">{stats?.repairs} dépannages</p>
                <p className="text-xs text-muted-foreground">demandes au total</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm">{stats?.deliveredOrders} livraisons</p>
                <p className="text-xs text-muted-foreground">finalisées avec succès</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-card border border-border rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-lg">Commandes récentes</h2>
            <p className="text-xs text-muted-foreground">Les 6 dernières commandes reçues</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="rounded-xl group">
            <Link to="/admin/commandes" className="flex items-center gap-1">
              Voir tout
              <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </Link>
          </Button>
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-sm">Aucune commande pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((o) => (
              <div
                key={o.id}
                className="flex items-center gap-4 p-3 rounded-2xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm shrink-0">
                  {o.customer_name[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate text-sm">{o.customer_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{o.product_name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display font-bold text-sm">
                    {o.total_price ? formatPrice(Number(o.total_price)) : "—"}
                  </p>
                  <Badge
                    className={`${statusColor[o.status] ?? ""} mt-1 text-[10px] border rounded-full`}
                    variant="outline"
                  >
                    {statusLabel[o.status] ?? o.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
