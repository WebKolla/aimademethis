"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { ChevronDown, X, Filter } from "lucide-react";
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

interface HorizontalFiltersProps {
  categories: Category[];
  tags: Tag[];
  aiModels?: string[];
  aiTools?: string[];
  selectedCategory?: string;
  selectedPricing?: string;
  selectedTags: string[];
  selectedAIModels?: string[];
  selectedAITools?: string[];
  onCategoryChange: (categoryId: string) => void;
  onPricingChange: (pricing: string) => void;
  onTagsChange: (tagIds: string[]) => void;
  onAIModelsChange?: (models: string[]) => void;
  onAIToolsChange?: (tools: string[]) => void;
  onClearFilters: () => void;
}

export function HorizontalFilters({
  categories,
  tags,
  aiModels = [],
  aiTools = [],
  selectedCategory = "all",
  selectedPricing = "all",
  selectedTags,
  selectedAIModels = [],
  selectedAITools = [],
  onCategoryChange,
  onPricingChange,
  onTagsChange,
  onAIModelsChange,
  onAIToolsChange,
  onClearFilters,
}: HorizontalFiltersProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedPricing !== "all" ||
    selectedTags.length > 0 ||
    selectedAIModels.length > 0 ||
    selectedAITools.length > 0;

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const handleAIModelToggle = (model: string) => {
    if (!onAIModelsChange) return;
    if (selectedAIModels.includes(model)) {
      onAIModelsChange(selectedAIModels.filter((m) => m !== model));
    } else {
      onAIModelsChange([...selectedAIModels, model]);
    }
  };

  const handleAIToolToggle = (tool: string) => {
    if (!onAIToolsChange) return;
    if (selectedAITools.includes(tool)) {
      onAIToolsChange(selectedAITools.filter((t) => t !== tool));
    } else {
      onAIToolsChange([...selectedAITools, tool]);
    }
  };

  const toggleFilter = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const handleCategoryChange = (categoryId: string) => {
    onCategoryChange(categoryId);
    setOpenFilter(null); // Close dropdown after selection
  };

  const handlePricingChange = (pricing: string) => {
    onPricingChange(pricing);
    setOpenFilter(null); // Close dropdown after selection
  };

  const categoryCount = selectedCategory !== "all" ? 1 : 0;
  const pricingCount = selectedPricing !== "all" ? 1 : 0;

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center gap-3">

          {/* Category Filter */}
          <div className="relative">
            <Collapsible open={openFilter === "category"} onOpenChange={() => toggleFilter("category")}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  Category
                  <ChevronDown className={`h-4 w-4 transition-transform ${openFilter === "category" ? "rotate-180" : ""}`} />
                  {categoryCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                      {categoryCount}
                    </Badge>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="absolute mt-2 w-64 rounded-lg border border-border bg-[hsl(var(--popover))] backdrop-blur-md p-4 shadow-xl shadow-black/10 dark:shadow-black/30 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                <RadioGroup value={selectedCategory} onValueChange={handleCategoryChange} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="h-category-all" />
                    <Label htmlFor="h-category-all" className="font-normal cursor-pointer text-sm">
                      All Categories
                    </Label>
                  </div>
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={category.id} id={`h-category-${category.id}`} />
                      <Label
                        htmlFor={`h-category-${category.id}`}
                        className="font-normal cursor-pointer text-sm"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Pricing Filter */}
          <div className="relative">
            <Collapsible open={openFilter === "pricing"} onOpenChange={() => toggleFilter("pricing")}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  Pricing
                  <ChevronDown className={`h-4 w-4 transition-transform ${openFilter === "pricing" ? "rotate-180" : ""}`} />
                  {pricingCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                      {pricingCount}
                    </Badge>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="absolute mt-2 w-56 rounded-lg border border-border bg-[hsl(var(--popover))] backdrop-blur-md p-4 shadow-xl shadow-black/10 dark:shadow-black/30 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                <RadioGroup value={selectedPricing} onValueChange={handlePricingChange} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="h-pricing-all" />
                    <Label htmlFor="h-pricing-all" className="font-normal cursor-pointer text-sm">
                      All Pricing
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="free" id="h-pricing-free" />
                    <Label htmlFor="h-pricing-free" className="font-normal cursor-pointer text-sm">
                      Free
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="freemium" id="h-pricing-freemium" />
                    <Label htmlFor="h-pricing-freemium" className="font-normal cursor-pointer text-sm">
                      Freemium
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paid" id="h-pricing-paid" />
                    <Label htmlFor="h-pricing-paid" className="font-normal cursor-pointer text-sm">
                      Paid
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="subscription" id="h-pricing-subscription" />
                    <Label htmlFor="h-pricing-subscription" className="font-normal cursor-pointer text-sm">
                      Subscription
                    </Label>
                  </div>
                </RadioGroup>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Tags Filter */}
          {tags.length > 0 && (
            <div className="relative">
              <Collapsible open={openFilter === "tags"} onOpenChange={() => toggleFilter("tags")}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    Tags
                    <ChevronDown className={`h-4 w-4 transition-transform ${openFilter === "tags" ? "rotate-180" : ""}`} />
                    {selectedTags.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                        {selectedTags.length}
                      </Badge>
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="absolute mt-2 w-72 rounded-lg border border-border bg-[hsl(var(--popover))] backdrop-blur-md p-4 shadow-xl shadow-black/10 dark:shadow-black/30 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                  <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-900">
                    {tags.slice(0, 20).map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`h-tag-${tag.id}`}
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={() => handleTagToggle(tag.id)}
                        />
                        <Label
                          htmlFor={`h-tag-${tag.id}`}
                          className="font-normal cursor-pointer text-sm"
                        >
                          {tag.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {/* AI Models Filter */}
          {aiModels.length > 0 && (
            <div className="relative">
              <Collapsible open={openFilter === "aiModels"} onOpenChange={() => toggleFilter("aiModels")}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    AI Models
                    <ChevronDown className={`h-4 w-4 transition-transform ${openFilter === "aiModels" ? "rotate-180" : ""}`} />
                    {selectedAIModels.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                        {selectedAIModels.length}
                      </Badge>
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="absolute mt-2 w-72 rounded-lg border border-border bg-[hsl(var(--popover))] backdrop-blur-md p-4 shadow-xl shadow-black/10 dark:shadow-black/30 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                  <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-900">
                    {aiModels.map((model) => (
                      <div key={model} className="flex items-center space-x-2">
                        <Checkbox
                          id={`h-model-${model}`}
                          checked={selectedAIModels.includes(model)}
                          onCheckedChange={() => handleAIModelToggle(model)}
                        />
                        <Label
                          htmlFor={`h-model-${model}`}
                          className="font-normal cursor-pointer text-sm"
                        >
                          {model}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {/* AI Tools Filter */}
          {aiTools.length > 0 && (
            <div className="relative">
              <Collapsible open={openFilter === "aiTools"} onOpenChange={() => toggleFilter("aiTools")}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    AI Tools
                    <ChevronDown className={`h-4 w-4 transition-transform ${openFilter === "aiTools" ? "rotate-180" : ""}`} />
                    {selectedAITools.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                        {selectedAITools.length}
                      </Badge>
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="absolute mt-2 w-72 rounded-lg border border-border bg-[hsl(var(--popover))] backdrop-blur-md p-4 shadow-xl shadow-black/10 dark:shadow-black/30 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                  <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-900">
                    {aiTools.map((tool) => (
                      <div key={tool} className="flex items-center space-x-2">
                        <Checkbox
                          id={`h-tool-${tool}`}
                          checked={selectedAITools.includes(tool)}
                          onCheckedChange={() => handleAIToolToggle(tool)}
                        />
                        <Label
                          htmlFor={`h-tool-${tool}`}
                          className="font-normal cursor-pointer text-sm"
                        >
                          {tool}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {/* Clear All Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
