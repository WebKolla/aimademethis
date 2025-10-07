"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, ThumbsUp, Star, X } from "lucide-react";
import type { UserNotification } from "@/lib/notifications/actions";
import { markAsRead, deleteNotification } from "@/lib/notifications/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  notification: UserNotification;
  onUpdate?: () => void;
}

export function NotificationItem({ notification, onUpdate }: NotificationItemProps) {
  const router = useRouter();

  const getIcon = () => {
    switch (notification.type) {
      case "comment":
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "vote":
        return <ThumbsUp className="w-4 h-4 text-emerald-500" />;
      case "review":
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleClick = async () => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
      onUpdate?.();
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(notification.id);
    onUpdate?.();
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer relative",
        !notification.is_read && "bg-emerald-50/50 dark:bg-emerald-950/20"
      )}
    >
      {/* Actor Avatar */}
      {notification.actor?.avatar_url ? (
        <Image
          src={notification.actor.avatar_url}
          alt={notification.actor.username}
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          {getIcon()}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {notification.title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {notification.created_at &&
            formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
            })}
        </p>
      </div>

      {/* Unread indicator & Delete */}
      <div className="flex items-center gap-2">
        {!notification.is_read && (
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDelete}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
