import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, MessageSquare, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/products-data";

interface Stats {
  products: number;
  orders: number;
  pendingOrders: number;
  messages: number;
  unreadMessages: number;
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

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [productsRes, ordersRes, pendingRes, messagesRes, unreadRes, revenueRes, recentRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("orders").select("total_price").in("status", ["confirmed", "processing", "shipped", "delivered"]),
        supabase
          .from("orders")
          .select("id, customer_name, product_name, total_price, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const revenue = (revenueRes.data ?? []).reduce((sum, r: { total_price: number | null }) => sum + Number(r.total_price ?? 0), 0);

      setStats({
        products: productsRes.count ?? 0,
        orders: ordersRes.count ?? 0,
        pendingOrders: pendingRes.count ?? 0,
        messages: messagesRes.count ?? 0,
        unreadMessages: unreadRes.count ?? 0,
        revenue,
      });
      setRecent((recentRes.data as RecentOrder[]) ?? []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
    confirmed: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    processing: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
    shipped: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    delivered: "bg-green-500/10 text-green-700 dark:text-green-300",
    cancelled: "bg-red-500/10 text-red-700 dark:text-red-300",
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Tableau de bord</h2>
        <p className="text-muted-foreground">Vue d&apos;ensemble de votre activité.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produits</CardTitle>
            <Package className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.products}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Commandes</CardTitle>
            <ShoppingCart className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.orders}</p>
            <p className="text-xs text-muted-foreground mt-1">{stats?.pendingOrders} en attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages</CardTitle>
            <MessageSquare className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.messages}</p>
            <p className="text-xs text-muted-foreground mt-1">{stats?.unreadMessages} non lus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenu confirmé</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{formatPrice(stats?.revenue ?? 0)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Commandes récentes</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/commandes">Voir tout</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">Aucune commande pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {recent.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{o.customer_name}</p>
                    <p className="text-sm text-muted-foreground truncate">{o.product_name}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="font-semibold text-sm">{o.total_price ? formatPrice(Number(o.total_price)) : "—"}</p>
                    <Badge className={`${statusColor[o.status] ?? ""} mt-1`} variant="secondary">
                      {o.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
