"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StarRating } from "./star-rating";
import { ReviewForm } from "./review-form";
import { deleteReview } from "@/lib/reviews/actions";
import { PencilIcon, TrashIcon, Loader2Icon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
  product_id: string;
  profiles: {
    id: string;
    username: string;
    avatar_url: string | null;
    full_name: string | null;
  } | null;
}

interface ReviewCardProps {
  review: ReviewData;
  currentUserId?: string;
}

export function ReviewCard({ review, currentUserId }: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isOwner = currentUserId === review.user_id;
  const isEdited = review.updated_at && review.updated_at !== review.created_at;

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setIsDeleting(true);
    startTransition(async () => {
      const result = await deleteReview(review.id);

      if (result.error) {
        setError(result.error);
        setIsDeleting(false);
      }
    });
  };

  const profile = review.profiles;

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0">
      <div className="flex gap-4">
        {/* Avatar */}
        <Link href={`/profile/${profile?.username || ""}`}>
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.username}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <span className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                {profile?.username?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
          )}
        </Link>

        {/* Review Content */}
        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <Link
                href={`/profile/${profile?.username || ""}`}
                className="font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                {profile?.full_name || profile?.username || "Unknown User"}
              </Link>

              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {review.created_at &&
                    formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                </span>
                {isEdited && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">(edited)</span>
                )}
              </div>
            </div>

            {/* Actions */}
            {isOwner && !isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                  onClick={() => setIsEditing(true)}
                  disabled={isDeleting}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <TrashIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Comment or Edit Form */}
          {isEditing ? (
            <div className="mt-3">
              <ReviewForm
                productId={review.product_id}
                existingReview={{
                  id: review.id,
                  rating: review.rating,
                  comment: review.comment,
                }}
                onSuccess={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            review.comment && (
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                {review.comment}
              </p>
            )
          )}

          {error && !isEditing && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
