"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { followProduct, unfollowProduct } from "@/lib/follows/actions";
import { useRouter } from "next/navigation";

interface FollowProductButtonProps {
  productId: string;
  initialIsFollowing: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

export function FollowProductButton({
  productId,
  initialIsFollowing,
  variant = "outline",
  size = "default",
  showIcon = true,
  showText = true,
  className,
}: FollowProductButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleFollow = () => {
    startTransition(async () => {
      if (isFollowing) {
        const result = await unfollowProduct(productId);
        if (result.success) {
          setIsFollowing(false);
          router.refresh();
        }
      } else {
        const result = await followProduct(productId);
        if (result.success) {
          setIsFollowing(true);
          router.refresh();
        }
      }
    });
  };

  return (
    <Button
      variant={isFollowing ? "default" : variant}
      size={size}
      onClick={handleFollow}
      disabled={isPending}
      className={className}
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {showText && (
            <span className="ml-2">
              {isFollowing ? "Unfollowing..." : "Following..."}
            </span>
          )}
        </>
      ) : (
        <>
          {showIcon &&
            (isFollowing ? (
              <BellOff className="h-4 w-4" />
            ) : (
              <Bell className="h-4 w-4" />
            ))}
          {showText && (
            <span className={showIcon ? "ml-2" : ""}>
              {isFollowing ? "Following" : "Follow"}
            </span>
          )}
        </>
      )}
    </Button>
  );
}
