import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProductCreatorCardProps {
  creator: Profile;
  productCount?: number;
}

export function ProductCreatorCard({ creator, productCount = 0 }: ProductCreatorCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
      <h3 className="text-lg font-semibold mb-4">About the Creator</h3>

      <div className="space-y-4">
        {/* Creator Avatar & Info */}
        <div className="flex items-start gap-4">
          {creator.avatar_url ? (
            <Image
              src={creator.avatar_url}
              alt={creator.username}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-2xl">
              👤
            </div>
          )}

          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {creator.full_name || creator.username}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">@{creator.username}</p>
          </div>
        </div>

        {/* Bio */}
        {creator.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{creator.bio}</p>
        )}

        {/* Stats */}
        <div className="flex gap-4 text-sm border-t border-gray-100 dark:border-gray-800 pt-4">
          <div>
            <span className="font-semibold text-gray-900 dark:text-white">{productCount}</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">
              {productCount === 1 ? "Product" : "Products"}
            </span>
          </div>
        </div>

        {/* Social Links */}
        {(creator.twitter || creator.website) && (
          <div className="flex gap-2 border-t border-gray-100 dark:border-gray-800 pt-4">
            {creator.website && (
              <a href={creator.website} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  🌐 Website
                </Button>
              </a>
            )}
            {creator.twitter && (
              <a
                href={`https://twitter.com/${creator.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  🐦 Twitter
                </Button>
              </a>
            )}
          </div>
        )}

        {/* View Profile Button */}
        <Link href={`/profile/${creator.username}`} className="block">
          <Button variant="outline" className="w-full">
            View Full Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
