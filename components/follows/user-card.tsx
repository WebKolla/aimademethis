import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "./follow-button";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface UserCardProps {
  profile: Profile;
  isFollowing: boolean;
  showFollowButton?: boolean;
  isOwnProfile?: boolean;
}

export function UserCard({
  profile,
  isFollowing,
  showFollowButton = true,
  isOwnProfile = false,
}: UserCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-600 transition-colors">
      <Link href={`/profile/${profile.username}`} className="flex items-center gap-4 flex-1">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.username}
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-xl">
            👤
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {profile.full_name || profile.username}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">@{profile.username}</p>
          {profile.bio && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
              {profile.bio}
            </p>
          )}
        </div>
      </Link>
      {showFollowButton && !isOwnProfile && (
        <FollowButton
          userId={profile.id}
          initialIsFollowing={isFollowing}
          size="sm"
          showIcon={false}
        />
      )}
    </div>
  );
}
