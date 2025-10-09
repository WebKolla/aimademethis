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
}

// Note: Vote functionality has been moved to the product detail page
// This component now just wraps the regular ProductCard for backward compatibility
export async function ProductCardWithVote({
  product,
}: ProductCardWithVoteProps) {
  return <ProductCard product={product} />;
}
