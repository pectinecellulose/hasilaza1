import { useEffect, useState } from "react";
import { Loader2, Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/products-data";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number | null;
  total_price: number | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string;
  customer_city: string;
  message: string | null;
  status: string;
  created_at: string;
}

const STATUSES = [
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmée" },
  { value: "processing", label: "En préparation" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
];

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  confirmed: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  processing: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  shipped: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  delivered: "bg-green-500/10 text-green-700 dark:text-green-300",
  cancelled: "bg-red-500/10 text-red-700 dark:text-red-300",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as Order["status"] }).eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      toast({ title: "Statut mis à jour" });
    }
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Commandes</h2>
          <p className="text-muted-foreground">{orders.length} commande{orders.length > 1 ? "s" : ""}</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Aucune commande trouvée.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <Card key={o.id}>
              <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3">
                <div className="min-w-0">
                  <CardTitle className="text-lg">{o.product_name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Quantité : {o.quantity}
                    {o.total_price && <> — Total : <span className="font-semibold text-primary">{formatPrice(Number(o.total_price))}</span></>}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(o.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={statusColor[o.status]} variant="secondary">
                    {STATUSES.find((s) => s.value === o.status)?.label ?? o.status}
                  </Badge>
                  <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                    <SelectTrigger className="w-[160px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="border-t border-border pt-4">
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-semibold">{o.customer_name}</p>
                    <a href={`tel:${o.customer_phone}`} className="text-muted-foreground hover:text-primary flex items-center gap-2 mt-1">
                      <Phone className="w-3.5 h-3.5" />
                      {o.customer_phone}
                    </a>
                    {o.customer_email && (
                      <a href={`mailto:${o.customer_email}`} className="text-muted-foreground hover:text-primary flex items-center gap-2 mt-1">
                        <Mail className="w-3.5 h-3.5" />
                        {o.customer_email}
                      </a>
                    )}
                  </div>
                  <div className="text-muted-foreground flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{o.customer_address}, {o.customer_city}</span>
                  </div>
                </div>
                {o.message && (
                  <p className="mt-3 p-3 bg-muted/50 rounded-lg text-sm text-foreground/80">
                    {o.message}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
