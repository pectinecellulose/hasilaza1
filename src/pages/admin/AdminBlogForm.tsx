import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/image-upload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "").slice(0, 80);

interface FormState {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  keywords: string;
  author: string;
  reading_minutes: number;
  published: boolean;
}

const empty: FormState = {
  slug: "", title: "", excerpt: "", content: "", cover_image: "",
  keywords: "", author: "Hasilaza Motor", reading_minutes: 5, published: false,
};

const AdminBlogForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEdit = !!id && id !== "nouveau";

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    (async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
      if (data) {
        setForm({
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          cover_image: data.cover_image ?? "",
          keywords: data.keywords ?? "",
          author: data.author,
          reading_minutes: data.reading_minutes,
          published: data.status === "published",
        });
      }
      setLoading(false);
    })();
  }, [id, isEdit]);

  const handleTitleChange = (v: string) => {
    setForm((f) => ({ ...f, title: v, slug: f.slug || slugify(v) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.content || !form.slug) {
      toast({ title: "Champs requis manquants", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      cover_image: form.cover_image || null,
      keywords: form.keywords || null,
      author: form.author,
      reading_minutes: form.reading_minutes,
      status: form.published ? ("published" as const) : ("draft" as const),
      published_at: form.published ? new Date().toISOString() : null,
    };
    const { error } = isEdit
      ? await supabase.from("blog_posts").update(payload).eq("id", id!)
      : await supabase.from("blog_posts").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isEdit ? "Article mis à jour" : "Article créé" });
      navigate("/admin/blog");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link to="/admin/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>
        <Button type="submit" disabled={saving} className="bg-gradient-primary text-primary-foreground">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isEdit ? "Mettre à jour" : "Créer"}
        </Button>
      </div>

      <div>
        <h1 className="font-display text-3xl font-bold">{isEdit ? "Modifier l'article" : "Nouvel article"}</h1>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input id="title" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required className="mt-1.5" />
        </div>

        <div>
          <Label htmlFor="slug">Slug (URL) *</Label>
          <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} required className="mt-1.5" />
          <p className="text-xs text-muted-foreground mt-1">URL : /blog/{form.slug || "..."}</p>
        </div>

        <div>
          <Label htmlFor="excerpt">Résumé (160 car. recommandés pour SEO) *</Label>
          <Textarea id="excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} maxLength={300} required className="mt-1.5" />
          <p className="text-xs text-muted-foreground mt-1">{form.excerpt.length}/300</p>
        </div>

        <div>
          <Label htmlFor="keywords">Mots-clés SEO (séparés par virgules)</Label>
          <Input id="keywords" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="tricycle, cargo, Sénégal" className="mt-1.5" />
        </div>

        <div>
          <Label>Image de couverture</Label>
          <div className="mt-1.5">
            <ImageUpload
              value={form.cover_image ? [form.cover_image] : []}
              onChange={(urls) => setForm({ ...form, cover_image: urls[0] ?? "" })}
              maxFiles={1}
              folder="blog"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="content">Contenu (Markdown supporté : ## titre, **gras**, - liste) *</Label>
          <Textarea id="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={20} required className="mt-1.5 font-mono text-sm" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="author">Auteur</Label>
            <Input id="author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="reading">Temps de lecture (min)</Label>
            <Input id="reading" type="number" min={1} value={form.reading_minutes} onChange={(e) => setForm({ ...form, reading_minutes: parseInt(e.target.value) || 5 })} className="mt-1.5" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <Label htmlFor="published" className="text-base">Publier l'article</Label>
            <p className="text-xs text-muted-foreground">Visible publiquement sur le site et dans le sitemap</p>
          </div>
          <Switch id="published" checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
        </div>
      </div>
    </form>
  );
};

export default AdminBlogForm;
