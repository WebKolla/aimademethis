"use client";

import { useState } from "react";
import { Comment, type CommentData } from "./comment";
import { CommentForm } from "./comment-form";

interface CommentListProps {
  comments: CommentData[];
  currentUserId?: string;
  productId: string;
}

export function CommentList({ comments, currentUserId, productId }: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Organize comments into top-level and replies
  const topLevelComments = comments.filter((c) => !c.parent_id);
  const repliesMap = comments.reduce((acc, comment) => {
    if (comment.parent_id) {
      if (!acc[comment.parent_id]) {
        acc[comment.parent_id] = [];
      }
      acc[comment.parent_id].push(comment);
    }
    return acc;
  }, {} as Record<string, CommentData[]>);

  if (topLevelComments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  const renderComment = (comment: CommentData, depth: number = 0) => {
    const replies = repliesMap[comment.id] || [];
    const isReplying = replyingTo === comment.id;

    return (
      <div key={comment.id} className={depth > 0 ? "ml-12" : ""}>
        <Comment
          comment={comment}
          currentUserId={currentUserId}
          productId={productId}
          onReply={() => setReplyingTo(comment.id)}
          showReplyButton={currentUserId !== undefined}
        />

        {/* Reply Form */}
        {isReplying && (
          <div className="ml-12 mt-4">
            <CommentForm
              productId={productId}
              parentId={comment.id}
              placeholder="Write your reply..."
              onSuccess={() => setReplyingTo(null)}
              onCancel={() => setReplyingTo(null)}
              autoFocus
            />
          </div>
        )}

        {/* Render replies */}
        {replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {topLevelComments.map((comment) => renderComment(comment))}
    </div>
  );
}
