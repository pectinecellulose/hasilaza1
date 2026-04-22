import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/products-data";
import { useToast } from "@/hooks/use-toast";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number | string;
  in_stock: boolean;
  is_best_seller: boolean;
}

const AdminProducts = () => {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<ProductRow | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id, slug, name, category, price, in_stock, is_best_seller")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    setRows((data as ProductRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("products").delete().eq("id", toDelete.id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Produit supprimé" });
      setRows((r) => r.filter((p) => p.id !== toDelete.id));
    }
    setToDelete(null);
  };

  const filtered = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Produits</h2>
          <p className="text-muted-foreground">Gérez votre catalogue.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link to="/admin/produits/nouveau" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="pl-9"
        />
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Aucun produit
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{p.category}</Badge>
                    </TableCell>
                    <TableCell>{formatPrice(Number(p.price))}</TableCell>
                    <TableCell className="space-x-1">
                      {p.in_stock ? (
                        <Badge className="bg-green-500/10 text-green-700 dark:text-green-300">En stock</Badge>
                      ) : (
                        <Badge variant="secondary">Rupture</Badge>
                      )}
                      {p.is_best_seller && <Badge className="bg-primary/10 text-primary">Best</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon">
                        <Link to={`/admin/produits/${p.id}`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setToDelete(p)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit « {toDelete?.name} » sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
