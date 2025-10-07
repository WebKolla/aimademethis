"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleBookmark } from "@/lib/bookmarks/actions";
import { BookmarkIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
  productId: string;
  initialBookmarked: boolean;
  initialCount: number;
  showCount?: boolean;
}

export function BookmarkButton({
  productId,
  initialBookmarked,
  initialCount,
  showCount = true,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleBookmark = async () => {
    // Optimistic update
    const previousBookmarked = bookmarked;
    const previousCount = count;

    setBookmarked(!bookmarked);
    setCount(bookmarked ? count - 1 : count + 1);

    startTransition(async () => {
      const result = await toggleBookmark(productId);

      if (result.error) {
        // Revert on error
        setBookmarked(previousBookmarked);
        setCount(previousCount);

        // If user is not logged in, redirect to login
        if (result.error.includes("logged in")) {
          router.push(`/login?redirect=${window.location.pathname}`);
        }
      }
    });
  };

  return (
    <Button
      variant={bookmarked ? "default" : "outline"}
      size="lg"
      onClick={handleBookmark}
      disabled={isPending}
      className="gap-2"
    >
      {isPending ? (
        <Loader2Icon className="h-5 w-5 animate-spin" />
      ) : (
        <BookmarkIcon
          className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`}
        />
      )}
      {showCount && <span>{count}</span>}
      <span className="hidden sm:inline">
        {bookmarked ? "Bookmarked" : "Bookmark"}
      </span>
    </Button>
  );
}
