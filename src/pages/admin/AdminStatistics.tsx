import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Package,
  ShoppingCart,
  Loader2,
  Award,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/products-data";

interface MonthlyPoint {
  month: string;
  revenue: number;
  orders: number;
}

interface CategoryShare {
  name: string;
  value: number;
}

interface TopProduct {
  product_name: string;
  total_sold: number;
  revenue: number;
}

const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--primary-glow))", "hsl(220 30% 40%)"];

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  processing: "Traitement",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const AdminStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [monthly, setMonthly] = useState<MonthlyPoint[]>([]);
  const [categories, setCategories] = useState<CategoryShare[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<{ status: string; count: number }[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [totals, setTotals] = useState({ revenue: 0, orders: 0, avg: 0 });

  useEffect(() => {
    (async () => {
      const [ordersRes, productsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("created_at, total_price, status, product_name, quantity")
          .order("created_at", { ascending: true }),
        supabase.from("products").select("category"),
      ]);

      const orders = (ordersRes.data ?? []) as {
        created_at: string;
        total_price: number | null;
        status: string;
        product_name: string;
        quantity: number;
      }[];

      // Monthly aggregation last 6 months
      const monthBuckets = new Map<string, MonthlyPoint>();
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthBuckets.set(key, {
          month: d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
          revenue: 0,
          orders: 0,
        });
      }
      let totalRevenue = 0;
      let confirmedCount = 0;
      orders.forEach((o) => {
        const d = new Date(o.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const bucket = monthBuckets.get(key);
        if (bucket) {
          bucket.orders += 1;
          if (["confirmed", "processing", "shipped", "delivered"].includes(o.status)) {
            const price = Number(o.total_price ?? 0);
            bucket.revenue += price;
            totalRevenue += price;
            confirmedCount += 1;
          }
        }
      });

      // Status breakdown
      const statusMap = new Map<string, number>();
      orders.forEach((o) => {
        statusMap.set(o.status, (statusMap.get(o.status) ?? 0) + 1);
      });
      const statusArr = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }));

      // Top products
      const productMap = new Map<string, { qty: number; rev: number }>();
      orders.forEach((o) => {
        const cur = productMap.get(o.product_name) ?? { qty: 0, rev: 0 };
        cur.qty += o.quantity;
        if (["confirmed", "processing", "shipped", "delivered"].includes(o.status)) {
          cur.rev += Number(o.total_price ?? 0);
        }
        productMap.set(o.product_name, cur);
      });
      const top = Array.from(productMap.entries())
        .map(([product_name, v]) => ({ product_name, total_sold: v.qty, revenue: v.rev }))
        .sort((a, b) => b.total_sold - a.total_sold)
        .slice(0, 5);

      // Categories
      const products = (productsRes.data ?? []) as { category: string }[];
      const catMap = new Map<string, number>();
      products.forEach((p) => catMap.set(p.category, (catMap.get(p.category) ?? 0) + 1));
      const cats = Array.from(catMap.entries()).map(([name, value]) => ({
        name: name === "tricycle" ? "Tricycles" : name === "moto" ? "Motos" : "Pièces",
        value,
      }));

      setMonthly(Array.from(monthBuckets.values()));
      setStatusBreakdown(statusArr);
      setTopProducts(top);
      setCategories(cats);
      setTotals({
        revenue: totalRevenue,
        orders: orders.length,
        avg: confirmedCount > 0 ? totalRevenue / confirmedCount : 0,
      });
      setLoading(false);
    })();
  }, []);

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
        <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Analytique</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Statistiques</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Performance commerciale et tendances sur les 6 derniers mois.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-primary opacity-10" />
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-elegant">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Revenu total
            </p>
            <p className="font-display text-2xl md:text-3xl font-bold">{formatPrice(totals.revenue)}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-blue-500/15" />
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-4 shadow-elegant">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Commandes totales
            </p>
            <p className="font-display text-2xl md:text-3xl font-bold">{totals.orders}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-purple-500/15" />
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-4 shadow-elegant">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Panier moyen
            </p>
            <p className="font-display text-2xl md:text-3xl font-bold">{formatPrice(totals.avg)}</p>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6">
          <h2 className="font-display font-bold text-lg mb-1">Revenu mensuel</h2>
          <p className="text-xs text-muted-foreground mb-5">6 derniers mois</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <defs>
                  <linearGradient id="barRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--primary-glow))" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [formatPrice(value), "Revenu"]}
                />
                <Bar dataKey="revenue" fill="url(#barRev)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6">
          <h2 className="font-display font-bold text-lg mb-1">Catalogue</h2>
          <p className="text-xs text-muted-foreground mb-5">Répartition des produits</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categories.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top products & status */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Award className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">Top produits</h2>
              <p className="text-xs text-muted-foreground">Les plus vendus</p>
            </div>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucune vente enregistrée.</p>
          ) : (
            <div className="space-y-2">
              {topProducts.map((p, i) => (
                <div key={p.product_name} className="flex items-center gap-3 p-3 rounded-2xl border border-border hover:bg-muted/30 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs shrink-0 ${i === 0 ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{p.product_name}</p>
                    <p className="text-xs text-muted-foreground">{p.total_sold} unité(s) vendue(s)</p>
                  </div>
                  <p className="font-display font-bold text-sm shrink-0">{formatPrice(p.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">Statuts des commandes</h2>
              <p className="text-xs text-muted-foreground">Répartition globale</p>
            </div>
          </div>
          {statusBreakdown.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucune commande.</p>
          ) : (
            <div className="space-y-3">
              {statusBreakdown.map((s) => {
                const total = statusBreakdown.reduce((sum, x) => sum + x.count, 0);
                const pct = total > 0 ? (s.count / total) * 100 : 0;
                return (
                  <div key={s.status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <Badge variant="outline" className="rounded-full text-xs">
                        {STATUS_LABELS[s.status] ?? s.status}
                      </Badge>
                      <span className="text-sm font-semibold">{s.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
