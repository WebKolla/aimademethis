"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationItem } from "./notification-item";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  deleteAllNotifications,
  type UserNotification,
} from "@/lib/notifications/actions";
import { createClient } from "@/lib/supabase/client";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    const [notifs, count] = await Promise.all([
      getNotifications(20),
      getUnreadCount(),
    ]);

    if (notifs.notifications) {
      setNotifications(notifs.notifications);
    }
    if (count.count !== undefined) {
      setUnreadCount(count.count);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();

    // Set up real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    loadNotifications();
  };

  const handleDeleteAll = async () => {
    await deleteAllNotifications();
    loadNotifications();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <div className="flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <Button
                variant="link"
                size="sm"
                className="text-xs h-auto p-0"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Bell className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  No notifications yet
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
                  You&apos;ll see notifications here when people interact with your products
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onUpdate={() => {
                      loadNotifications();
                      setOpen(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t flex justify-between items-center bg-slate-50 dark:bg-slate-900">
              <Button
                variant="link"
                size="sm"
                className="text-xs h-auto p-0 text-red-600 hover:text-red-700"
                onClick={handleDeleteAll}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
