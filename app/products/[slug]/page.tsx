import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductHeader } from "@/components/products/product-header";
import { ProductDescription } from "@/components/products/product-description";
import { ProductCreatorCard } from "@/components/products/product-creator-card";
import { ProductTags } from "@/components/products/product-tags";
import { RelatedProducts } from "@/components/products/related-products";
import { VideoSection } from "@/components/products/display/video-section";
import { DevelopmentDetailsTabs } from "@/components/products/display/development-details-tabs";
import { incrementProductView } from "@/lib/products/view-actions";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("name, tagline, image_url, description")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | AIMadeThis`,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: product.image_url ? [product.image_url] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.tagline,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch product with relations
  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (id, name, slug),
      profiles (*)
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !product) {
    notFound();
  }

  // Fetch product tags - get tag IDs first, then fetch tag details
  const { data: productTagsData } = await supabase
    .from("product_tags")
    .select("tag_id")
    .eq("product_id", product.id);

  const tagIds = productTagsData?.map((pt) => pt.tag_id) || [];

  type TagType = { id: string; name: string; slug: string };
  let tags: TagType[] = [];

  if (tagIds.length > 0) {
    const { data: tagsData } = await supabase
      .from("tags")
      .select("id, name, slug")
      .in("id", tagIds);

    tags = tagsData || [];
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user has voted
  let userVoted = false;
  if (user) {
    const { data: userVote } = await supabase
      .from("votes")
      .select("id")
      .eq("product_id", product.id)
      .eq("user_id", user.id)
      .single();

    userVoted = !!userVote;
  }

  // Fetch product stats
  const [votesResult, bookmarksResult] = await Promise.all([
    supabase
      .from("votes")
      .select("id", { count: "exact", head: true })
      .eq("product_id", product.id),
    supabase
      .from("bookmarks")
      .select("id", { count: "exact", head: true })
      .eq("product_id", product.id),
  ]);

  const voteCount = votesResult.count || 0;
  const bookmarkCount = bookmarksResult.count || 0;

  // Fetch creator's product count
  const { count: creatorProductCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("user_id", product.user_id)
    .eq("status", "published");

  // Fetch related products (same category, exclude current)
  type RelatedProductData = {
    id: string;
    [key: string]: unknown;
  };

  let relatedProducts: RelatedProductData[] = [];
  if (product.category_id) {
    const { data } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (name, slug),
        profiles (username, avatar_url)
      `
      )
      .eq("category_id", product.category_id)
      .eq("status", "published")
      .neq("id", product.id)
      .limit(3);

    relatedProducts = (data as RelatedProductData[]) || [];
  }

  // Get vote/comment counts for related products
  const relatedWithCounts = await Promise.all(
    (relatedProducts || []).map(async (rp) => {
      const [votes, comments] = await Promise.all([
        supabase
          .from("votes")
          .select("id", { count: "exact", head: true })
          .eq("product_id", rp.id),
        supabase
          .from("comments")
          .select("id", { count: "exact", head: true })
          .eq("product_id", rp.id),
      ]);

      return {
        ...rp,
        votes_count: votes.count || 0,
        comments_count: comments.count || 0,
      };
    })
  );

  // Increment view count (async, don't await)
  incrementProductView(product.id);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <ProductHeader product={product} voteCount={voteCount} bookmarkCount={bookmarkCount} userVoted={userVoted} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Description & Tags */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">About {product.name}</h2>
              <ProductDescription description={product.description} />
            </div>

            <ProductTags tags={tags} />

            {/* Media Section */}
            <VideoSection
              videoUrl={product.video_url}
              demoVideoUrl={product.demo_video_url}
            />

            {/* Development Details */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Development Details</h2>
              <DevelopmentDetailsTabs
                // Tools
                ideUsed={product.ide_used}
                aiModelsUsed={product.ai_models_used}
                aiToolsUsed={product.ai_tools_used}
                voiceToolsUsed={product.voice_tools_used}
                // Stack
                techStack={product.tech_stack}
                uiFramework={product.ui_framework}
                mcpsUsed={product.mcps_used}
                cursorRules={product.cursor_rules}
                commandsUsed={product.commands_used}
                // Process
                developmentApproach={product.development_approach}
                projectManagementMethod={product.project_management_method}
                agenticWorkflowUsed={product.agentic_workflow_used}
                workflowDescription={product.workflow_description}
                // Prompts
                keyPrompts={product.key_prompts as { title: string; prompt: string; description: string }[] | null}
                // Metrics
                totalTokenCost={product.total_token_cost}
                totalCostUsd={product.total_cost_usd}
                developmentTimeHours={product.development_time_hours}
              />
            </div>
          </div>

          {/* Right Column - Creator Card */}
          <div className="lg:col-span-1">
            {product.profiles && (
              <ProductCreatorCard
                creator={product.profiles as never}
                productCount={creatorProductCount || 0}
              />
            )}
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts products={relatedWithCounts as never[]} />
      </div>
    </div>
  );
}

// Generate static params for static site generation (optional)
export async function generateStaticParams() {
  // Use admin client for static generation (no cookies needed)
  const { createClient: createAdminClient } = await import("@supabase/supabase-js");
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: products } = await supabase
    .from("products")
    .select("slug")
    .eq("status", "published")
    .limit(100);

  return (products || []).map((product) => ({
    slug: product.slug,
  }));
}
