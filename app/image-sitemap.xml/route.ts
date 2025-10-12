import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // Fetch products with images
  const { data: products } = await supabase
    .from("products")
    .select("slug, name, image_url, updated_at")
    .eq("status", "published")
    .not("image_url", "is", null)
    .order("updated_at", { ascending: false });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aimademethis.com";

  // Generate XML sitemap with image tags
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${
  products
    ?.map(
      (product) => `
  <url>
    <loc>${siteUrl}/products/${product.slug}</loc>
    <lastmod>${new Date(product.updated_at || "").toISOString()}</lastmod>
    <image:image>
      <image:loc>${product.image_url}</image:loc>
      <image:title>${product.name}</image:title>
    </image:image>
  </url>`
    )
    .join("") || ""
}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
    },
  });
}
