import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileHeaderProps {
  profile: Profile;
  productCount: number;
  isOwnProfile: boolean;
}

export function ProfileHeader({ profile, productCount, isOwnProfile }: ProfileHeaderProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 pb-8">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Avatar */}
        <div className="relative">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.username}
              width={120}
              height={120}
              className="rounded-full"
            />
          ) : (
            <div className="h-[120px] w-[120px] rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-4xl">
              👤
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {profile.full_name || profile.username}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">@{profile.username}</p>
            </div>

            {isOwnProfile && (
              <Link href="/profile/settings">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-2xl">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="flex gap-6 text-sm mb-4">
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">{productCount}</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">
                {productCount === 1 ? "Product" : "Products"}
              </span>
            </div>
          </div>

          {/* Social Links */}
          {(profile.website || profile.twitter || profile.github) && (
            <div className="flex flex-wrap gap-3">
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                  🌐 Website
                </a>
              )}
              {profile.twitter && (
                <a
                  href={`https://twitter.com/${profile.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                  🐦 Twitter
                </a>
              )}
              {profile.github && (
                <a
                  href={`https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                  💻 GitHub
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
