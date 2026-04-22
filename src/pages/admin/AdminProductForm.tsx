import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const emptyForm = {
  slug: "",
  name: "",
  category: "moto" as "tricycle" | "moto" | "piece",
  subcategory: "",
  price: "",
  old_price: "",
  description: "",
  short_description: "",
  specifications: "[]",
  features: "[]",
  images: "[]",
  in_stock: true,
  is_best_seller: false,
  is_new: false,
  rating: "5",
  reviews: "0",
};

const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "nouveau";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (error || !data) {
        toast({ title: "Produit introuvable", variant: "destructive" });
        navigate("/admin/produits");
        return;
      }
      setForm({
        slug: data.slug,
        name: data.name,
        category: data.category,
        subcategory: data.subcategory ?? "",
        price: String(data.price),
        old_price: data.old_price != null ? String(data.old_price) : "",
        description: data.description,
        short_description: data.short_description,
        specifications: JSON.stringify(data.specifications, null, 2),
        features: JSON.stringify(data.features, null, 2),
        images: JSON.stringify(data.images, null, 2),
        in_stock: data.in_stock,
        is_best_seller: data.is_best_seller,
        is_new: data.is_new,
        rating: String(data.rating),
        reviews: String(data.reviews),
      });
      setLoading(false);
    })();
  }, [id, isNew, navigate, toast]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let specs: unknown[], feats: unknown[], imgs: unknown[];
    try {
      specs = JSON.parse(form.specifications || "[]");
      feats = JSON.parse(form.features || "[]");
      imgs = JSON.parse(form.images || "[]");
    } catch {
      toast({ title: "JSON invalide", description: "Vérifiez les champs spécifications, fonctionnalités et images.", variant: "destructive" });
      setSaving(false);
      return;
    }

    const payload = {
      slug: form.slug || slugify(form.name),
      name: form.name,
      category: form.category,
      subcategory: form.subcategory || null,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      description: form.description,
      short_description: form.short_description,
      specifications: specs as never,
      features: feats as never,
      images: imgs as never,
      in_stock: form.in_stock,
      is_best_seller: form.is_best_seller,
      is_new: form.is_new,
      rating: Number(form.rating),
      reviews: Number(form.reviews),
    };

    const { error } = isNew
      ? await supabase.from("products").insert(payload)
      : await supabase.from("products").update(payload).eq("id", id!);

    setSaving(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isNew ? "Produit créé" : "Produit mis à jour" });
      navigate("/admin/produits");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link to="/admin/produits" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm">
        <ArrowLeft className="w-4 h-4" />
        Retour aux produits
      </Link>

      <h2 className="text-3xl font-bold text-foreground">
        {isNew ? "Nouveau produit" : "Modifier le produit"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v as typeof form.category })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tricycle">Tricycle</SelectItem>
                    <SelectItem value="moto">Moto</SelectItem>
                    <SelectItem value="piece">Pièce détachée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Sous-catégorie</Label>
                <Input id="subcategory" value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (FCFA) *</Label>
                <Input id="price" type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="old_price">Ancien prix</Label>
                <Input id="old_price" type="number" min={0} value={form.old_price} onChange={(e) => setForm({ ...form, old_price: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short">Description courte *</Label>
              <Input id="short" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description complète *</Label>
              <Textarea id="desc" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Données structurées (JSON)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specs">Spécifications</Label>
              <Textarea id="specs" rows={6} className="font-mono text-xs" value={form.specifications} onChange={(e) => setForm({ ...form, specifications: e.target.value })} />
              <p className="text-xs text-muted-foreground">Format : [{"{"}\"label\":\"...\",\"value\":\"...\"{"}"}]</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feats">Fonctionnalités</Label>
              <Textarea id="feats" rows={5} className="font-mono text-xs" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
              <p className="text-xs text-muted-foreground">Format : [\"...\", \"...\"]</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imgs">Images (URL)</Label>
              <Textarea id="imgs" rows={3} className="font-mono text-xs" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
              <p className="text-xs text-muted-foreground">Format : [\"/images/photo.jpg\"]</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut & affichage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label htmlFor="in_stock">En stock</Label>
                <Switch id="in_stock" checked={form.in_stock} onCheckedChange={(v) => setForm({ ...form, in_stock: v })} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label htmlFor="best">Best-seller</Label>
                <Switch id="best" checked={form.is_best_seller} onCheckedChange={(v) => setForm({ ...form, is_best_seller: v })} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label htmlFor="new">Nouveau</Label>
                <Switch id="new" checked={form.is_new} onCheckedChange={(v) => setForm({ ...form, is_new: v })} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Note (0-5)</Label>
                <Input id="rating" type="number" step={0.1} min={0} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviews">Nb d&apos;avis</Label>
                <Input id="reviews" type="number" min={0} value={form.reviews} onChange={(e) => setForm({ ...form, reviews: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/produits")}>
            Annuler
          </Button>
          <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
