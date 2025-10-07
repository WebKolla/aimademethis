import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "./product-card";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { name: string; slug: string } | null;
  profiles: { username: string; avatar_url: string | null } | null;
  votes_count?: number;
  comments_count?: number;
};

interface ProductCardWithVoteProps {
  product: Product;
  showVotes?: boolean;
}

export async function ProductCardWithVote({
  product,
  showVotes = true,
}: ProductCardWithVoteProps) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user has voted
  let userVoted = false;
  if (user) {
    const { data: vote } = await supabase
      .from("votes")
      .select("id")
      .eq("product_id", product.id)
      .eq("user_id", user.id)
      .single();

    userVoted = !!vote;
  }

  return (
    <ProductCard
      product={product}
      showVotes={showVotes}
      userVoted={userVoted}
    />
  );
}
