"use client";

import { Activity } from "@/lib/activity/actions";
import { ActivityItem } from "./activity-item";
import { Activity as ActivityIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <ActivityIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No activity yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Follow users and products to see their activity here
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/products">
              <Users className="h-4 w-4 mr-2" />
              Explore Products
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/following">View Following Feed</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
}
