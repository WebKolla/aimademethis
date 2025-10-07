import { getComments } from "@/lib/comments/actions";
import { createClient } from "@/lib/supabase/server";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { MessageCircleIcon } from "lucide-react";

interface CommentsSectionProps {
  productId: string;
}

export async function CommentsSection({ productId }: CommentsSectionProps) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get comments
  const { comments } = await getComments(productId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircleIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        <h2 className="text-2xl font-bold">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form - only show if logged in */}
      {user ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
          <CommentForm productId={productId} />
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Please{" "}
            <a href="/login" className="text-purple-600 dark:text-purple-400 hover:underline">
              sign in
            </a>{" "}
            to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
        <CommentList comments={comments} currentUserId={user?.id} productId={productId} />
      </div>
    </div>
  );
}
