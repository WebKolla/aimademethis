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
            <span className="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900/30 px-4 py-2 text-sm font-medium text-teal-800 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors cursor-pointer">
              #{tag.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
