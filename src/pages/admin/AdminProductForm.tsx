import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Plus, Trash2 } from "lucide-react";
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
import { ImageUpload } from "@/components/image-upload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

interface Spec { label: string; value: string }

const emptyForm = {
  slug: "",
  name: "",
  category: "moto" as "tricycle" | "moto" | "piece",
  subcategory: "",
  price: "",
  old_price: "",
  description: "",
  short_description: "",
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
  const [images, setImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [specs, setSpecs] = useState<Spec[]>([]);
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
        in_stock: data.in_stock,
        is_best_seller: data.is_best_seller,
        is_new: data.is_new,
        rating: String(data.rating),
        reviews: String(data.reviews),
      });
      setImages(Array.isArray(data.images) ? (data.images as string[]) : []);
      setFeatures(Array.isArray(data.features) ? (data.features as string[]) : []);
      setSpecs(Array.isArray(data.specifications) ? (data.specifications as Spec[]) : []);
      setLoading(false);
    })();
  }, [id, isNew, navigate, toast]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      slug: form.slug || slugify(form.name),
      name: form.name,
      category: form.category,
      subcategory: form.subcategory || null,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      description: form.description,
      short_description: form.short_description,
      specifications: specs.filter((s) => s.label && s.value) as never,
      features: features.filter((f) => f.trim()) as never,
      images: images as never,
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
            <CardTitle>Photos du produit</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload value={images} onChange={setImages} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Points forts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {features.map((f, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={f}
                  onChange={(e) => setFeatures(features.map((x, idx) => (idx === i ? e.target.value : x)))}
                  placeholder="Ex: Moteur 150cc 4 temps"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setFeatures([...features, ""])}>
              <Plus className="w-4 h-4 mr-2" /> Ajouter un point fort
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spécifications techniques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {specs.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input
                  value={s.label}
                  onChange={(e) => setSpecs(specs.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))}
                  placeholder="Caractéristique"
                />
                <Input
                  value={s.value}
                  onChange={(e) => setSpecs(specs.map((x, idx) => (idx === i ? { ...x, value: e.target.value } : x)))}
                  placeholder="Valeur"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setSpecs([...specs, { label: "", value: "" }])}>
              <Plus className="w-4 h-4 mr-2" /> Ajouter une spécification
            </Button>
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
