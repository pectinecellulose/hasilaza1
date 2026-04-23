import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Heart, Trash2, ArrowUpRight } from "lucide-react";
import { ClientSection } from "./ClientLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice, type Product } from "@/lib/products-data";
import { mapDbProduct, type DbProductRow } from "@/lib/products-mapper";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ClientFavorites() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("favorites")
      .select("product_id, products(*)")
      .eq("user_id", user.id);
    const mapped = ((data as { products: DbProductRow | null }[] | null) ?? [])
      .map((row) => row.products)
      .filter((p): p is DbProductRow => p !== null)
      .map(mapDbProduct);
    setProducts(mapped);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const remove = async (productId: string) => {
    if (!user) return;
    await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast({ title: "Retiré des favoris" });
  };

  return (
    <ClientSection title="Mes favoris" subtitle="Vos produits préférés en un clin d'œil">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground mb-4">Vous n'avez pas encore de favoris.</p>
          <Button asChild variant="outline">
            <Link to="/produits">Parcourir le catalogue</Link>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-muted/40 rounded-2xl border border-border p-4 flex gap-4">
              <Link to={`/produits/${p.slug}`} className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                <img
                  src={p.images[0] || "/placeholder.svg"}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/produits/${p.slug}`} className="font-semibold hover:text-primary truncate block">
                  {p.name}
                </Link>
                <p className="font-display font-bold text-primary mt-1">{formatPrice(p.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                    <Link to={`/produits/${p.slug}`}>
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      Voir
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(p.id)}
                    className="h-8 text-xs text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Retirer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ClientSection>
  );
}
