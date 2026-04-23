import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Wrench, Star, X, Loader2, ArrowUpRight, SlidersHorizontal } from "lucide-react";
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

      <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-60" />
        <div className="relative container">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Catalogue</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mt-3 mb-5 text-balance">
              Tous nos <span className="text-gradient">produits</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Explorez notre sélection de tricycles cargo, motos urbaines et pièces détachées de qualité.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit..."
                className="h-14 pl-14 rounded-2xl border-2 bg-card text-base"
              />
            </div>
            <Button
              variant="outline"
              className="h-14 rounded-2xl lg:hidden border-2"
              onClick={() => setShowFilters((v) => !v)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <div className="sticky top-28 space-y-8 bg-card border border-border rounded-3xl p-6">
                <div>
                  <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Catégories
                  </h3>
                  <div className="space-y-1.5">
                    {categoriesWithCount.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleCategory(c.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all ${
                          activeCategory === c.id
                            ? "bg-secondary text-secondary-foreground shadow-elegant"
                            : "hover:bg-muted text-foreground/80"
                        }`}
                      >
                        <span className="font-medium text-sm">{c.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === c.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          {c.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {subs.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-foreground mb-4">Sous-catégories</h3>
                    <div className="flex flex-wrap gap-2">
                      {subs.map((s) => (
                        <button
                          key={s}
                          onClick={() => setActiveSubcategory(activeSubcategory === s ? null : s)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            activeSubcategory === s
                              ? "bg-primary text-primary-foreground border-primary shadow-elegant"
                              : "border-border hover:border-primary/40 text-foreground/80 bg-background"
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
                    className="w-full text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            </aside>

            <div>
              {loading ? (
                <div className="flex justify-center py-32">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-display font-bold text-foreground text-base">{filtered.length}</span>{" "}
                      produit{filtered.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  {filtered.length === 0 ? (
                    <div className="text-center py-32 bg-muted/30 rounded-3xl border border-border">
                      <Wrench className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun produit ne correspond à votre recherche.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {filtered.map((product, i) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.03 }}
                        >
                          <Link
                            to={`/produits/${product.slug}`}
                            className="group block bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-ink transition-all duration-500"
                          >
                            <div className="relative aspect-square overflow-hidden bg-muted">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  loading="lazy"
                                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Wrench className="w-20 h-20 text-muted-foreground/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                                </div>
                              )}
                              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                {product.isBestSeller && (
                                  <span className="px-2.5 py-1 bg-gradient-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-elegant">
                                    Best-Seller
                                  </span>
                                )}
                                {product.isNew && (
                                  <span className="px-2.5 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-elegant">
                                    Nouveau
                                  </span>
                                )}
                                {product.oldPrice && (
                                  <span className="px-2.5 py-1 bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-elegant">
                                    Promo
                                  </span>
                                )}
                              </div>
                              <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                <ArrowUpRight className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="p-5">
                              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">
                                {product.subcategory ?? product.category}
                              </span>
                              <h3 className="font-display font-bold text-foreground mt-1.5 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.shortDescription}</p>
                              <div className="flex items-end justify-between pt-4 border-t border-border">
                                <div>
                                  {product.price > 0 ? (
                                    <span className="font-display text-xl font-bold">{formatPrice(product.price)}</span>
                                  ) : (
                                    <span className="font-display text-sm font-bold text-primary">Sur demande</span>
                                  )}
                                  {product.oldPrice && (
                                    <span className="text-xs text-muted-foreground line-through ml-2">
                                      {formatPrice(product.oldPrice)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-0.5">
                                  {[...Array(5)].map((_, idx) => (
                                    <Star
                                      key={idx}
                                      className={`w-3 h-3 ${idx < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted"}`}
                                    />
                                  ))}
                                </div>
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
