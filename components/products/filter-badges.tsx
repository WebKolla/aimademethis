"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FilterBadgesProps {
  filters: {
    query?: string;
    category?: { id: string; name: string };
    pricing?: string;
    tags?: Array<{ id: string; name: string }>;
    aiModels?: string[];
    aiTools?: string[];
  };
  onRemoveFilter: (type: string, value?: string) => void;
  onClearAll: () => void;
}

export function FilterBadges({ filters, onRemoveFilter, onClearAll }: FilterBadgesProps) {
  const hasFilters =
    filters.query ||
    filters.category ||
    filters.pricing ||
    (filters.tags && filters.tags.length > 0) ||
    (filters.aiModels && filters.aiModels.length > 0) ||
    (filters.aiTools && filters.aiTools.length > 0);

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Active Filters:
      </span>

      {filters.query && (
        <Badge variant="secondary" className="gap-1">
          Search: {filters.query}
          <button
            onClick={() => onRemoveFilter("query")}
            className="ml-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.category && (
        <Badge variant="secondary" className="gap-1">
          {filters.category.name}
          <button
            onClick={() => onRemoveFilter("category")}
            className="ml-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.pricing && filters.pricing !== "all" && (
        <Badge variant="secondary" className="gap-1 capitalize">
          {filters.pricing}
          <button
            onClick={() => onRemoveFilter("pricing")}
            className="ml-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.tags?.map((tag) => (
        <Badge key={tag.id} variant="secondary" className="gap-1">
          {tag.name}
          <button
            onClick={() => onRemoveFilter("tag", tag.id)}
            className="ml-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {filters.aiModels?.map((model) => (
        <Badge key={model} variant="secondary" className="gap-1">
          {model}
          <button
            onClick={() => onRemoveFilter("aiModel", model)}
            className="ml-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {filters.aiTools?.map((tool) => (
        <Badge key={tool} variant="secondary" className="gap-1">
          {tool}
          <button
            onClick={() => onRemoveFilter("aiTool", tool)}
            className="ml-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="ml-auto text-xs"
      >
        Clear All
      </Button>
    </div>
  );
}
