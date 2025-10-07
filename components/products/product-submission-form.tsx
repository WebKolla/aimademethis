"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  productSubmissionSchema,
  type ProductSubmissionData,
} from "@/lib/products/schemas";
import { submitProduct, uploadProductImage } from "@/lib/products/actions";
import { DevelopmentToolsSection } from "./form/development-tools-section";
import { DevelopmentProcessSection } from "./form/development-process-section";
import { TechStackSection } from "./form/tech-stack-section";
import { MetricsWorkflowSection } from "./form/metrics-workflow-section";
import type { KeyPrompt } from "./form/key-prompts-input";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductSubmissionFormProps {
  categories: Category[];
}

export function ProductSubmissionForm({ categories }: ProductSubmissionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Collapsible section states
  const [showMediaSection, setShowMediaSection] = useState(false);
  const [showToolsSection, setShowToolsSection] = useState(false);
  const [showProcessSection, setShowProcessSection] = useState(false);
  const [showStackSection, setShowStackSection] = useState(false);
  const [showMetricsSection, setShowMetricsSection] = useState(false);

  // New field states
  const [videoUrl, setVideoUrl] = useState("");
  const [demoVideoUrl, setDemoVideoUrl] = useState("");
  const [ideUsed, setIdeUsed] = useState<string[]>([]);
  const [aiModels, setAiModels] = useState<string[]>([]);
  const [aiTools, setAiTools] = useState<string[]>([]);
  const [voiceTools, setVoiceTools] = useState<string[]>([]);
  const [devApproach, setDevApproach] = useState("");
  const [projectManagement, setProjectManagement] = useState("");
  const [agenticWorkflow, setAgenticWorkflow] = useState(false);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [uiFramework, setUiFramework] = useState("");
  const [mcpsUsed, setMcpsUsed] = useState<string[]>([]);
  const [cursorRules, setCursorRules] = useState("");
  const [commandsUsed, setCommandsUsed] = useState<string[]>([]);
  const [totalTokens, setTotalTokens] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [devTime, setDevTime] = useState<number | null>(null);
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [keyPrompts, setKeyPrompts] = useState<KeyPrompt[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(productSubmissionSchema),
    defaultValues: {
      status: "draft" as const,
      tags: [],
    },
  });

  const pricingType = watch("pricing_type");

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue("tags", newTags);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Only JPEG, PNG, WebP, and GIF images are allowed");
        return;
      }

      setImageFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProductSubmissionData) => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        // Merge all the new fields into the submission data
        const enrichedData: ProductSubmissionData = {
          ...data,
          // Media
          video_url: videoUrl || "",
          demo_video_url: demoVideoUrl || "",
          // Development Tools
          ide_used: ideUsed.length > 0 ? ideUsed : undefined,
          ai_models_used: aiModels.length > 0 ? aiModels : undefined,
          ai_tools_used: aiTools.length > 0 ? aiTools : undefined,
          voice_tools_used: voiceTools.length > 0 ? voiceTools : undefined,
          // Development Process
          development_approach: (devApproach as "pure_prompting" | "ai_assisted" | "manual" | "hybrid" | undefined) || undefined,
          project_management_method: (projectManagement as "agile" | "waterfall" | "kanban" | "agentic" | "none" | "other" | undefined) || undefined,
          agentic_workflow_used: agenticWorkflow || undefined,
          // Technical Stack
          tech_stack: techStack.length > 0 ? techStack : undefined,
          ui_framework: uiFramework || "",
          mcps_used: mcpsUsed.length > 0 ? mcpsUsed : undefined,
          cursor_rules: cursorRules || "",
          commands_used: commandsUsed.length > 0 ? commandsUsed : undefined,
          // Cost & Metrics
          total_token_cost: totalTokens,
          total_cost_usd: totalCost,
          development_time_hours: devTime,
          // Workflow & Prompts
          workflow_description: workflowDescription || "",
          key_prompts: keyPrompts.length > 0 ? keyPrompts : undefined,
        };

        // Submit product
        const result = await submitProduct(enrichedData);

        if (!result.success) {
          setError(result.error || "Failed to submit product");
          return;
        }

        // Upload image if provided
        if (imageFile && result.product) {
          const imageResult = await uploadProductImage(result.product.id, imageFile);
          if (!imageResult.success) {
            console.error("Image upload failed:", imageResult.error);
            // Don't fail the entire submission if image upload fails
          }
        }

        setSuccess(true);

        // Redirect to product page or products list
        setTimeout(() => {
          if (result.slug) {
            router.push(`/product/${result.slug}`);
          } else {
            router.push("/products");
          }
        }, 1500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded">
          Product submitted successfully! Redirecting...
        </div>
      )}

      {/* Product Name */}
      <div>
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="My AI Product"
          className="mt-1"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Tagline */}
      <div>
        <Label htmlFor="tagline">Tagline *</Label>
        <Input
          id="tagline"
          {...register("tagline")}
          placeholder="A brief, catchy description of your product"
          className="mt-1"
        />
        {errors.tagline && (
          <p className="text-red-500 text-sm mt-1">{errors.tagline.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Detailed description of your product, its features, and benefits..."
          className="mt-1 min-h-[150px]"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Website URL */}
      <div>
        <Label htmlFor="website_url">Website URL *</Label>
        <Input
          id="website_url"
          type="url"
          {...register("website_url")}
          placeholder="https://example.com"
          className="mt-1"
        />
        {errors.website_url && (
          <p className="text-red-500 text-sm mt-1">{errors.website_url.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category_id">Category *</Label>
        <Select onValueChange={(value) => setValue("category_id", value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category_id && (
          <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>
        )}
      </div>

      {/* Pricing Type */}
      <div>
        <Label htmlFor="pricing_type">Pricing Type *</Label>
        <Select
          onValueChange={(value) =>
            setValue("pricing_type", value as "free" | "freemium" | "paid" | "subscription")
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select pricing type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="freemium">Freemium</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
          </SelectContent>
        </Select>
        {errors.pricing_type && (
          <p className="text-red-500 text-sm mt-1">{errors.pricing_type.message}</p>
        )}
      </div>

      {/* Pricing Details (conditional) */}
      {pricingType && pricingType !== "free" && (
        <div>
          <Label htmlFor="pricing_details">Pricing Details</Label>
          <Input
            id="pricing_details"
            {...register("pricing_details")}
            placeholder="e.g., $9.99/month or $99 one-time"
            className="mt-1"
          />
          {errors.pricing_details && (
            <p className="text-red-500 text-sm mt-1">{errors.pricing_details.message}</p>
          )}
        </div>
      )}

      {/* Tags */}
      <div>
        <Label htmlFor="tags">Tags * (1-10 tags)</Label>
        <div className="mt-1 space-y-2">
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add a tag and press Enter"
              disabled={tags.length >= 10}
            />
            <Button
              type="button"
              onClick={handleAddTag}
              disabled={tags.length >= 10 || !tagInput.trim()}
              variant="outline"
            >
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        {errors.tags && (
          <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
        )}
      </div>

      {/* Product Image */}
      <div>
        <Label htmlFor="image">Product Image (Optional)</Label>
        <Input
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageChange}
          className="mt-1"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Maximum size: 5MB. Formats: JPEG, PNG, WebP, GIF
        </p>
        {imagePreview && (
          <div className="mt-2 relative w-full max-w-xs aspect-video">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover rounded border border-gray-300 dark:border-gray-700"
            />
          </div>
        )}
      </div>

      {/* Demo URL */}
      <div>
        <Label htmlFor="demo_url">Demo URL (Optional)</Label>
        <Input
          id="demo_url"
          type="url"
          {...register("demo_url")}
          placeholder="https://demo.example.com"
          className="mt-1"
        />
        {errors.demo_url && (
          <p className="text-red-500 text-sm mt-1">{errors.demo_url.message}</p>
        )}
      </div>

      {/* GitHub URL */}
      <div>
        <Label htmlFor="github_url">GitHub URL (Optional)</Label>
        <Input
          id="github_url"
          type="url"
          {...register("github_url")}
          placeholder="https://github.com/username/repo"
          className="mt-1"
        />
        {errors.github_url && (
          <p className="text-red-500 text-sm mt-1">{errors.github_url.message}</p>
        )}
      </div>

      {/* Twitter Handle */}
      <div>
        <Label htmlFor="twitter_handle">Twitter Handle (Optional)</Label>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">@</span>
          <Input
            id="twitter_handle"
            {...register("twitter_handle")}
            placeholder="username"
            className="flex-1"
          />
        </div>
        {errors.twitter_handle && (
          <p className="text-red-500 text-sm mt-1">{errors.twitter_handle.message}</p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-xl font-bold mb-2">Development Details (Optional)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Help others learn from your development journey by sharing tools, process, and insights
        </p>
      </div>

      {/* Media Section (Collapsible) */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
        <button
          type="button"
          onClick={() => setShowMediaSection(!showMediaSection)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            {showMediaSection ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <h4 className="font-semibold">Media & Videos</h4>
          </div>
          <span className="text-sm text-muted-foreground">Optional</span>
        </button>
        {showMediaSection && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div>
              <Label htmlFor="video_url">Product Video URL</Label>
              <Input
                id="video_url"
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                YouTube, Vimeo, or Loom URL explaining your product
              </p>
            </div>
            <div>
              <Label htmlFor="demo_video_url">Demo Video URL</Label>
              <Input
                id="demo_video_url"
                type="url"
                value={demoVideoUrl}
                onChange={(e) => setDemoVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Demo or tutorial video (YouTube, Vimeo, or Loom)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Development Tools Section (Collapsible) */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
        <button
          type="button"
          onClick={() => setShowToolsSection(!showToolsSection)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            {showToolsSection ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <h4 className="font-semibold">Development Tools</h4>
          </div>
          <span className="text-sm text-muted-foreground">Optional</span>
        </button>
        {showToolsSection && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <DevelopmentToolsSection
              ideUsed={ideUsed}
              aiModels={aiModels}
              aiTools={aiTools}
              voiceTools={voiceTools}
              onIdeChange={setIdeUsed}
              onAiModelsChange={setAiModels}
              onAiToolsChange={setAiTools}
              onVoiceToolsChange={setVoiceTools}
            />
          </div>
        )}
      </div>

      {/* Development Process Section (Collapsible) */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
        <button
          type="button"
          onClick={() => setShowProcessSection(!showProcessSection)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            {showProcessSection ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <h4 className="font-semibold">Development Process</h4>
          </div>
          <span className="text-sm text-muted-foreground">Optional</span>
        </button>
        {showProcessSection && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <DevelopmentProcessSection
              approach={devApproach}
              projectManagement={projectManagement}
              agenticWorkflow={agenticWorkflow}
              onApproachChange={setDevApproach}
              onProjectManagementChange={setProjectManagement}
              onAgenticWorkflowChange={setAgenticWorkflow}
            />
          </div>
        )}
      </div>

      {/* Technical Stack Section (Collapsible) */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
        <button
          type="button"
          onClick={() => setShowStackSection(!showStackSection)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            {showStackSection ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <h4 className="font-semibold">Technical Stack</h4>
          </div>
          <span className="text-sm text-muted-foreground">Optional</span>
        </button>
        {showStackSection && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <TechStackSection
              techStack={techStack}
              uiFramework={uiFramework}
              mcpsUsed={mcpsUsed}
              cursorRules={cursorRules}
              commandsUsed={commandsUsed}
              onTechStackChange={setTechStack}
              onUiFrameworkChange={setUiFramework}
              onMcpsChange={setMcpsUsed}
              onCursorRulesChange={setCursorRules}
              onCommandsChange={setCommandsUsed}
            />
          </div>
        )}
      </div>

      {/* Metrics & Workflow Section (Collapsible) */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
        <button
          type="button"
          onClick={() => setShowMetricsSection(!showMetricsSection)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            {showMetricsSection ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <h4 className="font-semibold">Metrics & Workflow</h4>
          </div>
          <span className="text-sm text-muted-foreground">Optional</span>
        </button>
        {showMetricsSection && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <MetricsWorkflowSection
              totalTokens={totalTokens}
              totalCost={totalCost}
              devTime={devTime}
              workflowDescription={workflowDescription}
              keyPrompts={keyPrompts}
              onTotalTokensChange={setTotalTokens}
              onTotalCostChange={setTotalCost}
              onDevTimeChange={setDevTime}
              onWorkflowDescriptionChange={setWorkflowDescription}
              onKeyPromptsChange={setKeyPrompts}
            />
          </div>
        )}
      </div>

      {/* Status */}
      <div>
        <Label htmlFor="status">Status *</Label>
        <Select
          defaultValue="draft"
          onValueChange={(value) => setValue("status", value as "draft" | "published")}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Save as Draft</SelectItem>
            <SelectItem value="published">Publish Now</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Submitting..." : "Submit Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
