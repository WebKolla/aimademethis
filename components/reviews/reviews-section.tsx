import { getProductReviews, getUserReview } from "@/lib/reviews/actions";
import { createClient } from "@/lib/supabase/server";
import { ReviewForm } from "./review-form";
import { ReviewCard } from "./review-card";
import { StarIcon } from "lucide-react";

interface ReviewsSectionProps {
  productId: string;
}

export async function ReviewsSection({ productId }: ReviewsSectionProps) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get all reviews
  const { reviews } = await getProductReviews(productId);

  // Get user's existing review if logged in
  const { review: userReview } = user ? await getUserReview(productId) : { review: null };

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 = 1 star, Index 4 = 5 stars
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <StarIcon className="h-6 w-6 text-yellow-400 fill-yellow-400" />
        <h2 className="text-2xl font-bold">
          Reviews ({reviews.length})
        </h2>
      </div>

      {/* Rating Distribution */}
      {reviews.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
          <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingCounts[star - 1];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
                    {star} {star === 1 ? "star" : "stars"}
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review Form - only show if logged in and hasn't reviewed yet */}
      {user && !userReview && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          <ReviewForm productId={productId} />
        </div>
      )}

      {/* User's existing review - show at top if exists */}
      {userReview && (
        <div className="rounded-lg border-2 border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/20 p-6">
          <h3 className="text-lg font-semibold mb-4">Your Review</h3>
          <ReviewCard review={userReview as never} currentUserId={user?.id} />
        </div>
      )}

      {/* Not logged in message */}
      {!user && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Please{" "}
            <a href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline">
              sign in
            </a>{" "}
            to leave a review
          </p>
        </div>
      )}

      {/* All Reviews */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
        <h3 className="text-lg font-semibold mb-4">All Reviews</h3>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews
              .filter((review) => review.user_id !== user?.id) // Don't show user's review again
              .map((review) => (
                <ReviewCard key={review.id} review={review as never} currentUserId={user?.id} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
