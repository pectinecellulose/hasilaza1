import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Loader2, User, Share2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import NotFound from "@/pages/NotFound";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  keywords: string | null;
  author: string;
  published_at: string | null;
  updated_at: string;
  reading_minutes: number;
}

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";

// Very simple markdown-ish renderer (paragraphs, h2, h3, lists, bold)
function renderContent(md: string) {
  const blocks = md.split(/\n\n+/).filter(Boolean);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="font-display text-2xl md:text-3xl font-bold mt-10 mb-4">
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={i} className="font-display text-xl font-bold mt-8 mb-3">
          {trimmed.replace(/^###\s+/, "")}
        </h3>
      );
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items = trimmed.split("\n").map((l) => l.replace(/^[-*]\s+/, ""));
      return (
        <ul key={i} className="list-disc pl-6 space-y-2 my-4 text-foreground/85">
          {items.map((it, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: inlineFormat(it) }} />
          ))}
        </ul>
      );
    }
    return (
      <p
        key={i}
        className="text-foreground/85 leading-relaxed my-4"
        dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed) }}
      />
    );
  });
}

function inlineFormat(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary underline hover:text-primary/80">$1</a>');
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      setPost((data as Post) ?? null);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }
  if (!post) return <NotFound />;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image ?? undefined,
    datePublished: post.published_at ?? post.updated_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Hasilaza Motor",
      logo: { "@type": "ImageObject", url: "https://hasilaza.com/og-image.jpg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://hasilaza.com/blog/${post.slug}` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://hasilaza.com/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://hasilaza.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://hasilaza.com/blog/${post.slug}` },
    ],
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: post.title, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title={`${post.title} | Blog Hasilaza Motor`}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        type="article"
        image={post.cover_image ?? undefined}
        keywords={post.keywords ?? undefined}
        jsonLd={[articleJsonLd, breadcrumbJsonLd]}
      />
      <Header />

      <article className="pt-12 md:pt-16 pb-20">
        <div className="container max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour au blog
          </Link>

          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold leading-[1.1] mb-5 text-balance">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(post.published_at)}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.reading_minutes} min de lecture</span>
              <Button variant="ghost" size="sm" onClick={handleShare} className="ml-auto">
                <Share2 className="w-4 h-4 mr-1.5" /> Partager
              </Button>
            </div>
          </motion.header>

          {post.cover_image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-[16/9] rounded-3xl overflow-hidden bg-muted mb-12 border border-border shadow-ink"
            >
              <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 italic border-l-4 border-primary pl-5">
              {post.excerpt}
            </p>
            {renderContent(post.content)}
          </motion.div>

          <div className="mt-16 pt-8 border-t border-border">
            <div className="bg-card rounded-3xl p-8 border border-border text-center">
              <h3 className="font-display text-2xl font-bold mb-3">Besoin d'un tricycle ou d'une moto ?</h3>
              <p className="text-muted-foreground mb-6">Découvrez notre catalogue complet et obtenez votre devis sur WhatsApp.</p>
              <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground">
                <Link to="/produits">Voir nos produits</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
};

export default BlogPost;
