import Link from "next/link";

interface ProductTagsProps {
  tags: Array<{ id: string; name: string; slug: string }>;
}

export function ProductTags({ tags }: ProductTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
      <h3 className="text-lg font-semibold mb-4">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag.id} href={`/tags/${tag.slug}`}>
            <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-2 text-sm font-medium text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors cursor-pointer">
              #{tag.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
