"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="trending">🔥 Trending</SelectItem>
          <SelectItem value="newest">⏰ Newest First</SelectItem>
          <SelectItem value="votes">👍 Most Voted</SelectItem>
          <SelectItem value="views">👀 Most Viewed</SelectItem>
          <SelectItem value="reviews">⭐ Most Reviewed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
