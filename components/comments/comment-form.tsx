"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment } from "@/lib/comments/actions";
import { Loader2Icon } from "lucide-react";

interface CommentFormProps {
  productId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CommentForm({
  productId,
  parentId,
  onSuccess,
  onCancel,
  placeholder = "Share your thoughts...",
  autoFocus = false,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Please enter a comment");
      return;
    }

    startTransition(async () => {
      const result = await addComment(productId, content, parentId);

      if (result.error) {
        setError(result.error);
      } else {
        setContent("");
        if (onSuccess) {
          onSuccess();
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px] resize-none"
        disabled={isPending}
        autoFocus={autoFocus}
        maxLength={2000}
      />

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {content.length}/2000 characters
        </span>

        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
              Cancel
            </Button>
          )}

          <Button type="submit" disabled={isPending || !content.trim()}>
            {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            {parentId ? "Reply" : "Comment"}
          </Button>
        </div>
      </div>
    </form>
  );
}
