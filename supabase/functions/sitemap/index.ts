import { createClient } from "npm:@supabase/supabase-js@2";

const SITE_URL = "https://hasilaza.com";

const STATIC_ROUTES: { path: string; priority: number; changefreq: string }[] = [
  { path: "/", priority: 1.0, changefreq: "daily" },
  { path: "/produits", priority: 0.9, changefreq: "daily" },
  { path: "/blog", priority: 0.8, changefreq: "weekly" },
  { path: "/depannage", priority: 0.8, changefreq: "monthly" },
  { path: "/a-propos", priority: 0.6, changefreq: "monthly" },
  { path: "/contact", priority: 0.7, changefreq: "monthly" },
  { path: "/mentions-legales", priority: 0.3, changefreq: "yearly" },
  { path: "/politique-confidentialite", priority: 0.3, changefreq: "yearly" },
];

function escapeXml(str: string): string {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const today = new Date().toISOString().split("T")[0];

  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at, images")
    .order("updated_at", { ascending: false });

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, cover_image, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const urls: string[] = [];

  for (const route of STATIC_ROUTES) {
    urls.push(`  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`);
  }

  for (const p of (products ?? []) as any[]) {
    const lastmod = (p.updated_at ?? today).split("T")[0];
    const firstImg = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null;
    const imageBlock = firstImg
      ? `\n    <image:image><image:loc>${escapeXml(firstImg)}</image:loc></image:image>`
      : "";
    urls.push(`  <url>
    <loc>${SITE_URL}/produits/${escapeXml(p.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>${imageBlock}
  </url>`);
  }

  for (const post of (posts ?? []) as any[]) {
    const lastmod = (post.updated_at ?? post.published_at ?? today).split("T")[0];
    const imageBlock = post.cover_image
      ? `\n    <image:image><image:loc>${escapeXml(post.cover_image)}</image:loc></image:image>`
      : "";
    urls.push(`  <url>
    <loc>${SITE_URL}/blog/${escapeXml(post.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${imageBlock}
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
