"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { editComment, deleteComment } from "@/lib/comments/actions";
import { MessageCircleIcon, PencilIcon, TrashIcon, Loader2Icon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface CommentData {
  id: string;
  content: string;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
  parent_id: string | null;
  product_id: string;
  profiles: {
    id: string;
    username: string;
    avatar_url: string | null;
    full_name: string | null;
  } | null;
}

interface CommentProps {
  comment: CommentData;
  currentUserId?: string;
  productId: string;
  onReply?: () => void;
  showReplyButton?: boolean;
}

export function Comment({
  comment,
  currentUserId,
  productId,
  onReply,
  showReplyButton = true,
}: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = currentUserId === comment.user_id;
  const isEdited = comment.updated_at && comment.updated_at !== comment.created_at;

  const handleEdit = () => {
    setError("");
    startTransition(async () => {
      const result = await editComment(comment.id, editContent);

      if (result.error) {
        setError(result.error);
      } else {
        setIsEditing(false);
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setIsDeleting(true);
    startTransition(async () => {
      const result = await deleteComment(comment.id, productId);

      if (result.error) {
        setError(result.error);
        setIsDeleting(false);
      }
    });
  };

  const profile = comment.profiles;

  return (
    <div className="group">
      <div className="flex gap-3">
        {/* Avatar */}
        <Link href={`/profile/${profile?.username || ""}`}>
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.username}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {profile?.username?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
          )}
        </Link>

        {/* Comment Content */}
        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/profile/${profile?.username || ""}`}
              className="font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              {profile?.full_name || profile?.username || "Unknown User"}
            </Link>

            <span className="text-sm text-gray-500 dark:text-gray-400">
              {comment.created_at &&
                formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>

            {isEdited && (
              <span className="text-xs text-gray-400 dark:text-gray-500">(edited)</span>
            )}
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px]"
                disabled={isPending}
                maxLength={2000}
              />

              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleEdit}
                  disabled={isPending || !editContent.trim()}
                >
                  {isPending && <Loader2Icon className="mr-2 h-3 w-3 animate-spin" />}
                  Save
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                    setError("");
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                {comment.content}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {showReplyButton && onReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                    onClick={onReply}
                  >
                    <MessageCircleIcon className="mr-1 h-3 w-3" />
                    Reply
                  </Button>
                )}

                {isOwner && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                      onClick={() => setIsEditing(true)}
                      disabled={isDeleting}
                    >
                      <PencilIcon className="mr-1 h-3 w-3" />
                      Edit
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2Icon className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <TrashIcon className="mr-1 h-3 w-3" />
                      )}
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </>
          )}

          {error && !isEditing && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
