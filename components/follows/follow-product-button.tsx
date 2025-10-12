"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Loader2, Crown } from "lucide-react";
import { followProduct, unfollowProduct } from "@/lib/follows/actions";
import { useRouter } from "next/navigation";
import { useHasPlan } from "@/hooks/use-feature-access";
import { toast } from "sonner";

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

  // Check if user has Pro or Pro Plus for following
  const hasPro = useHasPlan("pro");

  const handleFollow = () => {
    // Show upgrade prompt if user doesn't have Pro or Pro Plus
    if (!hasPro && !isFollowing) {
      toast.error("Following products requires Pro or Pro Plus subscription", {
        description: "Upgrade to Pro to follow products and get notifications",
        action: {
          label: "Upgrade",
          onClick: () => router.push("/pricing"),
        },
        duration: 5000,
      });
      return;
    }

    startTransition(async () => {
      if (isFollowing) {
        const result = await unfollowProduct(productId);
        if (result.success) {
          setIsFollowing(false);
          router.refresh();
        } else if (result.error) {
          toast.error(result.error);
        }
      } else {
        const result = await followProduct(productId);
        if (result.success) {
          setIsFollowing(true);
          router.refresh();
          toast.success("Following product!");
        } else if (result.error) {
          toast.error(result.error);
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
            ) : !hasPro ? (
              <Crown className="h-4 w-4" />
            ) : (
              <Bell className="h-4 w-4" />
            ))}
          {showText && (
            <span className={showIcon ? "ml-2" : ""}>
              {isFollowing ? "Following" : !hasPro ? "Follow (Pro)" : "Follow"}
            </span>
          )}
        </>
      )}
    </Button>
  );
}
