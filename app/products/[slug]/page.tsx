import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductHero } from "@/components/products/product-hero";
import { ProductDescription } from "@/components/products/product-description";
import { ProductCreatorCard } from "@/components/products/product-creator-card";
import { ProductTags } from "@/components/products/product-tags";
import { RelatedProducts } from "@/components/products/related-products";
import { VideoSection } from "@/components/products/display/video-section";
import { DevelopmentDetailsTabs } from "@/components/products/display/development-details-tabs";
import { CommentsSection } from "@/components/comments/comments-section";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { ProductViewTracker } from "@/components/products/product-view-tracker";
import { getAverageRating } from "@/lib/reviews/actions";
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
    title: `${product.name} | AIMMT`,
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

  // Check if user has voted, bookmarked, and is following
  let userVoted = false;
  let userBookmarked = false;
  let userFollowing = false;
  if (user) {
    const [voteResult, bookmarkResult, followResult] = await Promise.all([
      supabase
        .from("votes")
        .select("id")
        .eq("product_id", product.id)
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("bookmarks")
        .select("id")
        .eq("product_id", product.id)
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("follows")
        .select("id")
        .eq("product_id", product.id)
        .eq("follower_id", user.id)
        .single(),
    ]);

    userVoted = !!voteResult.data;
    userBookmarked = !!bookmarkResult.data;
    userFollowing = !!followResult.data;
  }

  // Fetch product stats
  const [votesResult, bookmarksResult, followersResult, ratingData] = await Promise.all([
    supabase
      .from("votes")
      .select("id", { count: "exact", head: true })
      .eq("product_id", product.id),
    supabase
      .from("bookmarks")
      .select("id", { count: "exact", head: true })
      .eq("product_id", product.id),
    supabase
      .from("follows")
      .select("id", { count: "exact", head: true })
      .eq("product_id", product.id),
    getAverageRating(product.id),
  ]);

  const voteCount = votesResult.count || 0;
  const bookmarkCount = bookmarksResult.count || 0;
  const followerCount = followersResult.count || 0;
  const { averageRating, totalReviews } = ratingData;

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Track product view on client side */}
      <ProductViewTracker productId={product.id} />

      {/* Hero Section */}
      <ProductHero
        product={product}
        voteCount={voteCount}
        bookmarkCount={bookmarkCount}
        followerCount={followerCount}
        userVoted={userVoted}
        userBookmarked={userBookmarked}
        userFollowing={userFollowing}
        averageRating={averageRating}
        totalReviews={totalReviews}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
                About {product.name}
              </h2>
              <ProductDescription description={product.description} />
            </div>

            {/* Tags Section */}
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
                Tags & Categories
              </h2>
              <ProductTags tags={tags} />
            </div>

            {/* Video Section */}
            {(product.video_url || product.demo_video_url) && (
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg overflow-hidden">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
                  Product Demo
                </h2>
                <VideoSection
                  videoUrl={product.video_url}
                  demoVideoUrl={product.demo_video_url}
                />
              </div>
            )}

            {/* Development Details */}
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
              <div className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-6">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  Development Details
                </h2>
              </div>
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

          {/* Right Column - Sticky Creator Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {product.profiles && (
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <ProductCreatorCard
                    creator={product.profiles as never}
                    productCount={creatorProductCount || 0}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-8">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                User Reviews
              </h2>
            </div>
            <div className="p-8">
              <ReviewsSection productId={product.id} />
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-8">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Discussion
              </h2>
            </div>
            <div className="p-8">
              <CommentsSection productId={product.id} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-24 pb-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              You Might Also Like
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Discover more amazing AI products in the same category
            </p>
          </div>
          <RelatedProducts products={relatedWithCounts as never[]} />
        </div>
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
