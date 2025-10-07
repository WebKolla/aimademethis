"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface FilterSidebarProps {
  categories: Category[];
  tags: Tag[];
  selectedCategory?: string;
  selectedPricing?: string;
  selectedTags: string[];
  onCategoryChange: (categoryId: string) => void;
  onPricingChange: (pricing: string) => void;
  onTagsChange: (tagIds: string[]) => void;
  onClearFilters: () => void;
}

export function FilterSidebar({
  categories,
  tags,
  selectedCategory = "all",
  selectedPricing = "all",
  selectedTags,
  onCategoryChange,
  onPricingChange,
  onTagsChange,
  onClearFilters,
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedPricing !== "all" ||
    selectedTags.length > 0;

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 rounded-full bg-teal-600 text-white px-2 py-0.5 text-xs">
              Active
            </span>
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block space-y-6 pb-6 lg:pb-0`}
      >
        {/* Header with Clear */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Category</Label>
          <RadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="category-all" />
              <Label htmlFor="category-all" className="font-normal cursor-pointer">
                All Categories
              </Label>
            </div>
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.id} id={`category-${category.id}`} />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="font-normal cursor-pointer"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Pricing Filter */}
        <div className="space-y-3 pt-6 border-t">
          <Label className="text-base font-semibold">Pricing</Label>
          <RadioGroup value={selectedPricing} onValueChange={onPricingChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="pricing-all" />
              <Label htmlFor="pricing-all" className="font-normal cursor-pointer">
                All Pricing
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="free" id="pricing-free" />
              <Label htmlFor="pricing-free" className="font-normal cursor-pointer">
                Free
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="freemium" id="pricing-freemium" />
              <Label htmlFor="pricing-freemium" className="font-normal cursor-pointer">
                Freemium
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paid" id="pricing-paid" />
              <Label htmlFor="pricing-paid" className="font-normal cursor-pointer">
                Paid
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="subscription" id="pricing-subscription" />
              <Label htmlFor="pricing-subscription" className="font-normal cursor-pointer">
                Subscription
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Tags Filter */}
        {tags.length > 0 && (
          <div className="space-y-3 pt-6 border-t">
            <Label className="text-base font-semibold">Popular Tags</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {tags.slice(0, 15).map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={() => handleTagToggle(tag.id)}
                  />
                  <Label
                    htmlFor={`tag-${tag.id}`}
                    className="font-normal cursor-pointer text-sm"
                  >
                    {tag.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
