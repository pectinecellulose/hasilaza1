import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Loader2, BookOpen } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { supabase } from "@/integrations/supabase/client";
import blogFallback from "@/assets/blog-fallback.jpg";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  author: string;
  published_at: string | null;
  reading_minutes: number;
}

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, cover_image, author, published_at, reading_minutes")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      setPosts((data as Post[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Blog Hasilaza Motor - Conseils Tricycles, Motos & Entretien Sénégal"
        description="Guides d'achat, conseils d'entretien et actualités sur les tricycles cargo, motos et pièces détachées au Sénégal."
        canonical="/blog"
        keywords="blog tricycle, conseils moto Sénégal, entretien tricycle cargo, guide achat moto Dakar"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Blog Hasilaza Motor",
          url: "https://hasilaza.com/blog",
          description: "Guides et conseils sur tricycles et motos au Sénégal",
        }}
      />
      <Header />

      <section className="relative pt-12 pb-10 md:pt-24 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-60" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-blob" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative container"
        >
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Le journal</span>
            <h1 className="font-display text-[2.5rem] sm:text-5xl md:text-7xl font-bold mt-3 mb-4 md:mb-5 text-balance leading-[1.05]">
              Blog & <span className="text-gradient-animated">conseils</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
              Guides d'achat, entretien tricycle, actualités du transport au Sénégal.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="pb-24">
        <div className="container">
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-32 bg-muted/30 rounded-3xl border border-border">
              <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun article pour le moment. Revenez bientôt !</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-ink transition-all duration-500 h-full"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={post.cover_image || blogFallback}
                        alt={post.title}
                        loading="lazy"
                        width={1280}
                        height={800}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.published_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {post.reading_minutes} min
                        </span>
                      </div>
                      <h2 className="font-display text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                        Lire l'article <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Blog;
