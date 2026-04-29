import { useEffect, useState } from "react";
import { FileText, Loader2, Download, Search, Printer, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/products-data";

const COMPANY = {
  name: "Hasilaza Motor",
  address: "HLM 2, Dakar, Sénégal",
  phone: "+221 76 935 83 17",
  email: "hasilazasenegal@gmail.com",
  rccm: "SN DKR 2022 B 41650",
  ninea: "009893216",
};

interface InvoiceOrder {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  customer_city: string;
  product_name: string;
  quantity: number;
  unit_price: number | null;
  total_price: number | null;
  status: string;
  created_at: string;
}

const statusColor: Record<string, string> = {
  delivered: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  shipped: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
  processing: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/20",
  confirmed: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20",
};

const formatInvoiceNumber = (id: string, date: string) => {
  const d = new Date(date);
  return `FAC-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}-${id.slice(0, 6).toUpperCase()}`;
};

const printInvoice = (order: InvoiceOrder) => {
  const number = formatInvoiceNumber(order.id, order.created_at);
  const date = new Date(order.created_at).toLocaleDateString("fr-FR");
  const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${number}</title><style>
    *{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif}
    body{padding:48px;color:#0a0a0a;background:#fff}
    .head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px;padding-bottom:24px;border-bottom:2px solid #e57e5c}
    h1{font-size:14px;color:#666;text-transform:uppercase;letter-spacing:.2em;margin-bottom:8px}
    .num{font-size:32px;font-weight:800;color:#e57e5c}
    .brand{text-align:right}
    .brand .name{font-size:24px;font-weight:800}
    .brand .info{font-size:12px;color:#666;margin-top:4px;line-height:1.6}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:48px}
    .block h3{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:.15em;margin-bottom:8px}
    .block p{font-size:14px;line-height:1.6}
    table{width:100%;border-collapse:collapse;margin-bottom:32px}
    th{background:#f5f5f5;padding:12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#666}
    td{padding:16px 12px;border-bottom:1px solid #eee;font-size:14px}
    .right{text-align:right}
    .total{display:flex;justify-content:flex-end;margin-bottom:48px}
    .total .box{width:300px;background:#fafafa;padding:24px;border-radius:12px}
    .total .row{display:flex;justify-content:space-between;padding:6px 0;font-size:14px}
    .total .grand{margin-top:8px;padding-top:12px;border-top:2px solid #e57e5c;font-size:18px;font-weight:800;color:#e57e5c}
    .footer{text-align:center;font-size:11px;color:#999;padding-top:32px;border-top:1px solid #eee;line-height:1.8}
    @media print{body{padding:24px}}
  </style></head><body>
    <div class="head">
      <div>
        <h1>Facture</h1>
        <div class="num">${number}</div>
        <div style="font-size:13px;color:#666;margin-top:8px">Émise le ${date}</div>
      </div>
      <div class="brand">
        <div class="name">${COMPANY.name}</div>
        <div class="info">${COMPANY.address}<br/>${COMPANY.phone}<br/>${COMPANY.email}<br/><strong>RCCM:</strong> ${COMPANY.rccm}<br/><strong>NINEA:</strong> ${COMPANY.ninea}</div>
      </div>
    </div>
    <div class="grid">
      <div class="block"><h3>Facturé à</h3>
        <p><strong>${order.customer_name}</strong><br/>${order.customer_phone}<br/>${order.customer_email ?? ""}<br/>${order.customer_city}</p>
      </div>
      <div class="block" style="text-align:right"><h3>Statut</h3>
        <p><strong style="text-transform:capitalize">${order.status}</strong></p>
      </div>
    </div>
    <table>
      <thead><tr><th>Description</th><th class="right">Qté</th><th class="right">PU</th><th class="right">Total</th></tr></thead>
      <tbody><tr>
        <td><strong>${order.product_name}</strong></td>
        <td class="right">${order.quantity}</td>
        <td class="right">${order.unit_price ? formatPrice(Number(order.unit_price)) : "—"}</td>
        <td class="right"><strong>${order.total_price ? formatPrice(Number(order.total_price)) : "—"}</strong></td>
      </tr></tbody>
    </table>
    <div class="total"><div class="box">
      <div class="row"><span>Sous-total</span><span>${order.total_price ? formatPrice(Number(order.total_price)) : "—"}</span></div>
      <div class="row"><span>Livraison</span><span>Gratuite</span></div>
      <div class="row grand"><span>Total TTC</span><span>${order.total_price ? formatPrice(Number(order.total_price)) : "—"}</span></div>
    </div></div>
    <div class="footer">Merci de votre confiance.<br/>Hasilaza Motor — Tricycles, motos et pièces détachées au Sénégal</div>
  </body></html>`;
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 250);
  }
};

const AdminInvoices = () => {
  const [orders, setOrders] = useState<InvoiceOrder[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, customer_name, customer_email, customer_phone, customer_city, product_name, quantity, unit_price, total_price, status, created_at")
        .order("created_at", { ascending: false });
      setOrders((data as InvoiceOrder[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.customer_name.toLowerCase().includes(q) ||
      o.product_name.toLowerCase().includes(q) ||
      formatInvoiceNumber(o.id, o.created_at).toLowerCase().includes(q)
    );
  });

  const totalAmount = filtered
    .filter((o) => o.status !== "cancelled" && o.status !== "pending")
    .reduce((sum, o) => sum + Number(o.total_price ?? 0), 0);

  const exportCSV = () => {
    const rows = [
      ["Facture", "Date", "Client", "Téléphone", "Produit", "Qté", "Total", "Statut"],
      ...filtered.map((o) => [
        formatInvoiceNumber(o.id, o.created_at),
        new Date(o.created_at).toLocaleDateString("fr-FR"),
        o.customer_name,
        o.customer_phone,
        o.product_name,
        o.quantity.toString(),
        o.total_price?.toString() ?? "",
        o.status,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `factures-hasilaza-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Facturation</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Factures</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Historique complet et impression PDF de toutes les factures.
          </p>
        </div>
        <Button onClick={exportCSV} variant="outline" className="rounded-xl">
          <Download className="w-4 h-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-3xl p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Factures</p>
          <p className="font-display text-2xl font-bold mt-2">{filtered.length}</p>
        </div>
        <div className="bg-card border border-border rounded-3xl p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Montant facturé</p>
          <p className="font-display text-2xl font-bold mt-2 text-primary">{formatPrice(totalAmount)}</p>
        </div>
        <div className="bg-card border border-border rounded-3xl p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Période</p>
          <p className="font-display text-2xl font-bold mt-2">
            {orders.length > 0
              ? new Date(orders[orders.length - 1].created_at).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
              : "—"}{" "}
            →{" "}
            {orders.length > 0
              ? new Date(orders[0].created_at).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
              : "—"}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher (client, produit, n° facture)..."
          className="pl-11 h-11 rounded-xl"
        />
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-sm">Aucune facture trouvée.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((o) => (
              <div
                key={o.id}
                className="flex flex-col md:flex-row md:items-center gap-4 p-5 hover:bg-muted/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1 grid md:grid-cols-3 gap-2 md:gap-6 items-center">
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm">{formatInvoiceNumber(o.id, o.created_at)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{o.customer_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{o.product_name} × {o.quantity}</p>
                  </div>
                  <div className="flex items-center gap-3 md:justify-end">
                    <div className="text-right">
                      <p className="font-display font-bold">{o.total_price ? formatPrice(Number(o.total_price)) : "—"}</p>
                      <Badge variant="outline" className={`${statusColor[o.status]} mt-1 text-[10px] border rounded-full`}>
                        {o.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl shrink-0"
                  onClick={() => printInvoice(o)}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInvoices;
