"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRatingInput } from "./star-rating-input";
import { addReview, editReview } from "@/lib/reviews/actions";
import { Loader2Icon } from "lucide-react";

interface ReviewFormProps {
  productId: string;
  existingReview?: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ productId, existingReview, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const isEditing = !!existingReview;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    startTransition(async () => {
      const result = isEditing
        ? await editReview(existingReview.id, rating, comment)
        : await addReview(productId, rating, comment);

      if (result.error) {
        setError(result.error);
      } else {
        setRating(0);
        setComment("");
        if (onSuccess) {
          onSuccess();
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Rating *
        </label>
        <StarRatingInput
          value={rating}
          onChange={setRating}
          disabled={isPending}
        />
      </div>

      {/* Comment Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Review (Optional)
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          className="min-h-[120px] resize-none"
          disabled={isPending}
          maxLength={1000}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {comment.length}/1000 characters
        </p>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending || rating === 0}>
          {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Update Review" : "Submit Review"}
        </Button>

        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
