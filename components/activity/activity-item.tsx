import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import type { Activity } from "@/lib/activity/actions";
import { Package, MessageCircle, Star, Sparkles } from "lucide-react";

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const timeAgo = formatDistanceToNow(new Date(activity.created_at), {
    addSuffix: true,
  });

  return (
    <div className="flex gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors">
      {/* Actor Avatar */}
      <Link
        href={`/profile/${activity.actor.username}`}
        className="shrink-0"
      >
        {activity.actor.avatar_url ? (
          <Image
            src={activity.actor.avatar_url}
            alt={activity.actor.username}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-semibold">
            {activity.actor.username[0].toUpperCase()}
          </div>
        )}
      </Link>

      {/* Activity Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/profile/${activity.actor.username}`}
              className="font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              {activity.actor.full_name || activity.actor.username}
            </Link>
            <span className="text-gray-500 dark:text-gray-400">
              {activity.type === "new_product" && (
                <span className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  launched a new product
                </span>
              )}
              {activity.type === "review" && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  reviewed
                </span>
              )}
              {activity.type === "comment" && (
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  commented on
                </span>
              )}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">
            {timeAgo}
          </span>
        </div>

        {/* Product Link */}
        <Link
          href={`/products/${activity.product.slug}`}
          className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium mb-2"
        >
          <Sparkles className="h-4 w-4" />
          {activity.product.name}
        </Link>

        {/* Activity Content (for reviews and comments) */}
        {activity.content && (
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
            {activity.content}
          </p>
        )}

        {/* Rating (for reviews) */}
        {activity.type === "review" && activity.rating && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < activity.rating!
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Image */}
      {activity.product.image_url && (
        <Link
          href={`/products/${activity.product.slug}`}
          className="shrink-0 hidden sm:block"
        >
          <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
            <Image
              src={activity.product.image_url}
              alt={activity.product.name}
              fill
              className="object-cover"
            />
          </div>
        </Link>
      )}
    </div>
  );
}
