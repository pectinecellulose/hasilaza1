import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Wrench, Star, X, Loader2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, subcategoriesMap, formatPrice, type Product } from "@/lib/products-data";
import { supabase } from "@/integrations/supabase/client";
import { mapDbProduct, type DbProductRow } from "@/lib/products-mapper";

const Produits = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      setProducts(((data as DbProductRow[]) ?? []).map(mapDbProduct));
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category") ?? "all";
    setActiveCategory(cat);
    setActiveSubcategory(null);
  }, [searchParams]);

  const filtered: Product[] = useMemo(() => {
    let list = products;
    if (activeCategory !== "all") list = list.filter((p) => p.category === activeCategory);
    if (activeSubcategory) list = list.filter((p) => p.subcategory === activeSubcategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [products, activeCategory, activeSubcategory, search]);

  const categoriesWithCount = useMemo(
    () =>
      categories.map((c) => ({
        ...c,
        count: c.id === "all" ? products.length : products.filter((p) => p.category === c.id).length,
      })),
    [products],
  );

  const subs = activeCategory !== "all"
    ? subcategoriesMap[activeCategory as keyof typeof subcategoriesMap] ?? []
    : [];

  const handleCategory = (id: string) => {
    setActiveSubcategory(null);
    if (id === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", id);
    }
    setSearchParams(searchParams);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-28 md:pt-36 pb-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <span className="text-sm font-semibold text-primary">Catalogue</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Tous nos <span className="text-primary">produits</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Découvrez notre sélection de tricycles, motos et pièces détachées de qualité.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit..."
                className="h-12 pl-12 rounded-xl"
              />
            </div>
            <Button
              variant="outline"
              className="h-12 rounded-xl lg:hidden"
              onClick={() => setShowFilters((v) => !v)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          <div className="grid lg:grid-cols-[260px_1fr] gap-8">
            <aside className={`${showFilters ? "block" : "hidden"} lg:block space-y-6`}>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Catégories</h3>
                <div className="space-y-1">
                  {categoriesWithCount.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCategory(c.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center justify-between transition-colors ${
                        activeCategory === c.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground/80"
                      }`}
                    >
                      <span className="font-medium">{c.name}</span>
                      <span className={`text-xs ${activeCategory === c.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {c.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {subs.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Sous-catégories</h3>
                  <div className="flex flex-wrap gap-2">
                    {subs.map((s) => (
                      <button
                        key={s}
                        onClick={() => setActiveSubcategory(activeSubcategory === s ? null : s)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
                          activeSubcategory === s
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:border-primary text-foreground/80"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(activeCategory !== "all" || activeSubcategory || search) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleCategory("all");
                    setSearch("");
                  }}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              )}
            </aside>

            <div>
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    {filtered.length} produit{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
                  </p>

                  {filtered.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-2xl">
                      <Wrench className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun produit ne correspond à votre recherche.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filtered.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Link
                            to={`/produits/${product.slug}`}
                            className="group block bg-background rounded-2xl overflow-hidden shadow-elegant border border-border hover:shadow-glow transition-all"
                          >
                            <div className="relative aspect-square overflow-hidden bg-muted flex items-center justify-center">
                              <Wrench className="w-16 h-16 text-muted-foreground/30" />
                              {product.isBestSeller && (
                                <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                                  Best-Seller
                                </span>
                              )}
                              {product.isNew && (
                                <span className="absolute top-3 left-3 px-3 py-1 bg-foreground text-background text-xs font-bold rounded-full">
                                  Nouveau
                                </span>
                              )}
                              {product.oldPrice && (
                                <span className="absolute top-3 right-3 px-3 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full">
                                  Promo
                                </span>
                              )}
                            </div>
                            <div className="p-5">
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {product.subcategory ?? product.category}
                              </span>
                              <h3 className="font-bold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                {product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {product.shortDescription}
                              </p>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">({product.reviews})</span>
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
                                {product.oldPrice && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {formatPrice(product.oldPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Produits;
