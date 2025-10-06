"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export function TagsInput({
  value = [],
  onChange,
  placeholder = "Add tags...",
  maxTags,
  className,
}: TagsInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      onChange(value.slice(0, -1));
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) return;

    // Check if tag already exists (case insensitive)
    if (value.some((tag) => tag.toLowerCase() === trimmedValue.toLowerCase())) {
      setInputValue("");
      return;
    }

    // Check max tags limit
    if (maxTags && value.length >= maxTags) {
      setInputValue("");
      return;
    }

    onChange([...value, trimmedValue]);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const canAddMore = !maxTags || value.length < maxTags;

  return (
    <div
      onClick={handleContainerClick}
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-1 focus-within:ring-ring cursor-text",
        className
      )}
    >
      {value.map((tag, index) => (
        <Badge key={`${tag}-${index}`} variant="secondary" className="gap-1">
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            className="ml-1 rounded-full outline-none hover:bg-accent hover:text-accent-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : ""}
        disabled={!canAddMore}
        className="flex-1 border-0 bg-transparent p-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 min-w-[120px]"
      />
      {maxTags && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {value.length}/{maxTags}
        </span>
      )}
    </div>
  );
}
