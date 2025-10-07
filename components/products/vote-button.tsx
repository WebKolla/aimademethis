"use client";

import { useState, useTransition } from "react";
import { toggleVote } from "@/lib/votes/actions";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface VoteButtonProps {
  productId: string;
  initialVoted: boolean;
  initialCount: number;
  variant?: "default" | "compact";
}

export function VoteButton({
  productId,
  initialVoted,
  initialCount,
  variant = "default",
}: VoteButtonProps) {
  const [voted, setVoted] = useState(initialVoted);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleVote = async () => {
    // Optimistic update
    const previousVoted = voted;
    const previousCount = count;

    setVoted(!voted);
    setCount(voted ? count - 1 : count + 1);

    startTransition(async () => {
      const result = await toggleVote(productId);

      if (result.error) {
        // Revert optimistic update on error
        setVoted(previousVoted);
        setCount(previousCount);

        // If not logged in, redirect to login
        if (result.error === "You must be logged in to vote") {
          router.push(`/login?redirect=/products`);
        }
      } else {
        // Update with server response
        setVoted(result.voted || false);
      }
    });
  };

  if (variant === "compact") {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "flex items-center gap-1 px-3 h-8",
          voted && "text-purple-600 dark:text-purple-400"
        )}
        onClick={handleVote}
        disabled={isPending}
      >
        <ArrowUp className={cn("h-4 w-4", voted && "fill-current")} />
        <span className="text-sm font-medium">{count}</span>
      </Button>
    );
  }

  return (
    <Button
      variant={voted ? "default" : "outline"}
      size="sm"
      className={cn(
        "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-[60px]",
        voted && "bg-purple-600 hover:bg-purple-700 text-white"
      )}
      onClick={handleVote}
      disabled={isPending}
    >
      <ArrowUp className={cn("h-5 w-5", voted && "fill-current")} />
      <span className="text-xs font-semibold">{count}</span>
    </Button>
  );
}
