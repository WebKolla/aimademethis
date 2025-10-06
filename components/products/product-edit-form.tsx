"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
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
import { updateProduct, deleteProduct } from "@/lib/products/edit-actions";
import { uploadProductImage, deleteProductImage } from "@/lib/products/actions";
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

interface Product {
  id: string;
  name: string | null;
  tagline: string | null;
  description: string | null;
  website_url: string | null;
  pricing_type: string | null;
  pricing_details?: string | null;
  category_id: string | null;
  status: string | null;
  demo_url?: string | null;
  github_url?: string | null;
  twitter_handle?: string | null;
  image_url?: string | null;
  tags?: string[];
  video_url?: string | null;
  demo_video_url?: string | null;
  ide_used?: string[] | null;
  ai_models_used?: string[] | null;
  ai_tools_used?: string[] | null;
  voice_tools_used?: string[] | null;
  development_approach?: string | null;
  project_management_method?: string | null;
  agentic_workflow_used?: boolean | null;
  tech_stack?: string[] | null;
  ui_framework?: string | null;
  mcps_used?: string[] | null;
  cursor_rules?: string | null;
  commands_used?: string[] | null;
  total_token_cost?: number | null;
  total_cost_usd?: number | null;
  development_time_hours?: number | null;
  workflow_description?: string | null;
  key_prompts?: KeyPrompt[] | null;
  created_at: string | null;
}

interface ProductEditFormProps {
  product: Product;
  categories: Category[];
}

export function ProductEditForm({ product, categories }: ProductEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [tags, setTags] = useState<string[]>(product.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url || null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Collapsible section states
  const [showMediaSection, setShowMediaSection] = useState(!!product.video_url || !!product.demo_video_url);
  const [showToolsSection, setShowToolsSection] = useState(false);
  const [showProcessSection, setShowProcessSection] = useState(false);
  const [showStackSection, setShowStackSection] = useState(false);
  const [showMetricsSection, setShowMetricsSection] = useState(false);

  // New field states
  const [videoUrl, setVideoUrl] = useState(product.video_url || "");
  const [demoVideoUrl, setDemoVideoUrl] = useState(product.demo_video_url || "");
  const [ideUsed, setIdeUsed] = useState<string[]>(product.ide_used || []);
  const [aiModels, setAiModels] = useState<string[]>(product.ai_models_used || []);
  const [aiTools, setAiTools] = useState<string[]>(product.ai_tools_used || []);
  const [voiceTools, setVoiceTools] = useState<string[]>(product.voice_tools_used || []);
  const [devApproach, setDevApproach] = useState(product.development_approach || "");
  const [projectManagement, setProjectManagement] = useState(product.project_management_method || "");
  const [agenticWorkflow, setAgenticWorkflow] = useState(product.agentic_workflow_used || false);
  const [techStack, setTechStack] = useState<string[]>(product.tech_stack || []);
  const [uiFramework, setUiFramework] = useState(product.ui_framework || "");
  const [mcpsUsed, setMcpsUsed] = useState<string[]>(product.mcps_used || []);
  const [cursorRules, setCursorRules] = useState(product.cursor_rules || "");
  const [commandsUsed, setCommandsUsed] = useState<string[]>(product.commands_used || []);
  const [totalTokens, setTotalTokens] = useState<number | null>(product.total_token_cost ?? null);
  const [totalCost, setTotalCost] = useState<number | null>(product.total_cost_usd ?? null);
  const [devTime, setDevTime] = useState<number | null>(product.development_time_hours ?? null);
  const [workflowDescription, setWorkflowDescription] = useState(product.workflow_description || "");
  const [keyPrompts, setKeyPrompts] = useState<KeyPrompt[]>(product.key_prompts || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(productSubmissionSchema),
    defaultValues: {
      name: product.name || "",
      tagline: product.tagline || "",
      description: product.description || "",
      website_url: product.website_url || "",
      pricing_type: (product.pricing_type || "free") as "free" | "freemium" | "paid" | "subscription",
      pricing_details: product.pricing_details || "",
      category_id: product.category_id || "",
      status: (product.status || "draft") as "draft" | "published",
      demo_url: product.demo_url || "",
      github_url: product.github_url || "",
      twitter_handle: product.twitter_handle || "",
      tags: product.tags || [],
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
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Only JPEG, PNG, WebP, and GIF images are allowed");
        return;
      }

      setImageFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    if (product.image_url) {
      const result = await deleteProductImage(product.id, product.image_url);
      if (result.success) {
        setImagePreview(null);
        router.refresh();
      }
    }
  };

  const onSubmit = async (data: ProductSubmissionData) => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        const enrichedData: ProductSubmissionData = {
          ...data,
          video_url: videoUrl || "",
          demo_video_url: demoVideoUrl || "",
          ide_used: ideUsed.length > 0 ? ideUsed : undefined,
          ai_models_used: aiModels.length > 0 ? aiModels : undefined,
          ai_tools_used: aiTools.length > 0 ? aiTools : undefined,
          voice_tools_used: voiceTools.length > 0 ? voiceTools : undefined,
          development_approach: (devApproach as "pure_prompting" | "ai_assisted" | "manual" | "hybrid" | undefined) || undefined,
          project_management_method: (projectManagement as "agile" | "waterfall" | "kanban" | "agentic" | "none" | "other" | undefined) || undefined,
          agentic_workflow_used: agenticWorkflow || undefined,
          tech_stack: techStack.length > 0 ? techStack : undefined,
          ui_framework: uiFramework || "",
          mcps_used: mcpsUsed.length > 0 ? mcpsUsed : undefined,
          cursor_rules: cursorRules || "",
          commands_used: commandsUsed.length > 0 ? commandsUsed : undefined,
          total_token_cost: totalTokens,
          total_cost_usd: totalCost,
          development_time_hours: devTime,
          workflow_description: workflowDescription || "",
          key_prompts: keyPrompts.length > 0 ? keyPrompts : undefined,
        };

        const result = await updateProduct(product.id, enrichedData);

        if (!result.success) {
          setError(result.error || "Failed to update product");
          return;
        }

        // Upload new image if provided
        if (imageFile) {
          const imageResult = await uploadProductImage(product.id, imageFile);
          if (!imageResult.success) {
            console.error("Image upload failed:", imageResult.error);
          }
        }

        setSuccess(true);

        setTimeout(() => {
          router.push("/dashboard/products");
          router.refresh();
        }, 1500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteProduct(product.id);
      if (result.success) {
        router.push("/dashboard/products");
        router.refresh();
      } else {
        setError(result.error || "Failed to delete product");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/20 border border-green-800 text-green-200 px-4 py-3 rounded">
          Product updated successfully! Redirecting...
        </div>
      )}

      {/* Basic Fields - Similar to original form but with dark theme styling */}
      <div>
        <Label htmlFor="name" className="text-gray-300">Product Name *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="My AI Product"
          className="mt-1 bg-gray-800 border-gray-700 text-white"
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="tagline" className="text-gray-300">Tagline *</Label>
        <Input
          id="tagline"
          {...register("tagline")}
          placeholder="A brief, catchy description"
          className="mt-1 bg-gray-800 border-gray-700 text-white"
        />
        {errors.tagline && (
          <p className="text-red-400 text-sm mt-1">{errors.tagline.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description" className="text-gray-300">Description *</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Detailed description..."
          className="mt-1 min-h-[150px] bg-gray-800 border-gray-700 text-white"
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="website_url" className="text-gray-300">Website URL *</Label>
        <Input
          id="website_url"
          type="url"
          {...register("website_url")}
          placeholder="https://example.com"
          className="mt-1 bg-gray-800 border-gray-700 text-white"
        />
        {errors.website_url && (
          <p className="text-red-400 text-sm mt-1">{errors.website_url.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="category_id" className="text-gray-300">Category *</Label>
        <Select onValueChange={(value) => setValue("category_id", value)} defaultValue={product.category_id || undefined}>
          <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
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
          <p className="text-red-400 text-sm mt-1">{errors.category_id.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="pricing_type" className="text-gray-300">Pricing Type *</Label>
        <Select
          onValueChange={(value) =>
            setValue("pricing_type", value as "free" | "freemium" | "paid" | "subscription")
          }
          defaultValue={product.pricing_type || undefined}
        >
          <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
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
          <p className="text-red-400 text-sm mt-1">{errors.pricing_type.message}</p>
        )}
      </div>

      {pricingType && pricingType !== "free" && (
        <div>
          <Label htmlFor="pricing_details" className="text-gray-300">Pricing Details</Label>
          <Input
            id="pricing_details"
            {...register("pricing_details")}
            placeholder="e.g., $9.99/month"
            className="mt-1 bg-gray-800 border-gray-700 text-white"
          />
          {errors.pricing_details && (
            <p className="text-red-400 text-sm mt-1">{errors.pricing_details.message}</p>
          )}
        </div>
      )}

      {/* Tags */}
      <div>
        <Label htmlFor="tags" className="text-gray-300">Tags * (1-10 tags)</Label>
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
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Button
              type="button"
              onClick={handleAddTag}
              disabled={tags.length >= 10 || !tagInput.trim()}
              variant="outline"
              className="border-gray-700"
            >
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-900/30 text-purple-200 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-purple-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        {errors.tags && (
          <p className="text-red-400 text-sm mt-1">{errors.tags.message}</p>
        )}
      </div>

      {/* Product Image */}
      <div>
        <Label htmlFor="image" className="text-gray-300">Product Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageChange}
          className="mt-1 bg-gray-800 border-gray-700 text-white"
        />
        <p className="text-sm text-gray-400 mt-1">
          Maximum size: 5MB. Formats: JPEG, PNG, WebP, GIF
        </p>
        {imagePreview && (
          <div className="mt-2 relative w-full max-w-xs aspect-video">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover rounded border border-gray-700"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleDeleteImage}
            >
              Remove
            </Button>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="demo_url" className="text-gray-300">Demo URL</Label>
        <Input
          id="demo_url"
          type="url"
          {...register("demo_url")}
          placeholder="https://demo.example.com"
          className="mt-1 bg-gray-800 border-gray-700 text-white"
        />
        {errors.demo_url && (
          <p className="text-red-400 text-sm mt-1">{errors.demo_url.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="github_url" className="text-gray-300">GitHub URL</Label>
        <Input
          id="github_url"
          type="url"
          {...register("github_url")}
          placeholder="https://github.com/username/repo"
          className="mt-1 bg-gray-800 border-gray-700 text-white"
        />
        {errors.github_url && (
          <p className="text-red-400 text-sm mt-1">{errors.github_url.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="twitter_handle" className="text-gray-300">Twitter Handle</Label>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-gray-400">@</span>
          <Input
            id="twitter_handle"
            {...register("twitter_handle")}
            placeholder="username"
            className="flex-1 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        {errors.twitter_handle && (
          <p className="text-red-400 text-sm mt-1">{errors.twitter_handle.message}</p>
        )}
      </div>

      {/* Development Details Sections - Same as in product-submission-form */}
      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-xl font-bold text-white mb-2">Development Details (Optional)</h3>
        <p className="text-sm text-gray-400 mb-4">
          Help others learn from your development journey
        </p>
      </div>

      {/* Media Section */}
      <div className="border border-gray-700 rounded-lg">
        <button
          type="button"
          onClick={() => setShowMediaSection(!showMediaSection)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            {showMediaSection ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <h4 className="font-semibold text-white">Media & Videos</h4>
          </div>
          <span className="text-sm text-gray-400">Optional</span>
        </button>
        {showMediaSection && (
          <div className="p-4 border-t border-gray-700 space-y-4">
            <div>
              <Label htmlFor="video_url" className="text-gray-300">Product Video URL</Label>
              <Input
                id="video_url"
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="mt-1 bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                YouTube, Vimeo, or Loom URL
              </p>
            </div>
            <div>
              <Label htmlFor="demo_video_url" className="text-gray-300">Demo Video URL</Label>
              <Input
                id="demo_video_url"
                type="url"
                value={demoVideoUrl}
                onChange={(e) => setDemoVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="mt-1 bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                Demo or tutorial video
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Other collapsible sections similar to product-submission-form */}
      {/* Development Tools Section */}
      <div className="border border-gray-700 rounded-lg">
        <button
          type="button"
          onClick={() => setShowToolsSection(!showToolsSection)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            {showToolsSection ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <h4 className="font-semibold text-white">Development Tools</h4>
          </div>
          <span className="text-sm text-gray-400">Optional</span>
        </button>
        {showToolsSection && (
          <div className="p-4 border-t border-gray-700">
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

      {/* Development Process Section */}
      <div className="border border-gray-700 rounded-lg">
        <button
          type="button"
          onClick={() => setShowProcessSection(!showProcessSection)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            {showProcessSection ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <h4 className="font-semibold text-white">Development Process</h4>
          </div>
          <span className="text-sm text-gray-400">Optional</span>
        </button>
        {showProcessSection && (
          <div className="p-4 border-t border-gray-700">
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

      {/* Technical Stack Section */}
      <div className="border border-gray-700 rounded-lg">
        <button
          type="button"
          onClick={() => setShowStackSection(!showStackSection)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            {showStackSection ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <h4 className="font-semibold text-white">Technical Stack</h4>
          </div>
          <span className="text-sm text-gray-400">Optional</span>
        </button>
        {showStackSection && (
          <div className="p-4 border-t border-gray-700">
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

      {/* Metrics & Workflow Section */}
      <div className="border border-gray-700 rounded-lg">
        <button
          type="button"
          onClick={() => setShowMetricsSection(!showMetricsSection)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            {showMetricsSection ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <h4 className="font-semibold text-white">Metrics & Workflow</h4>
          </div>
          <span className="text-sm text-gray-400">Optional</span>
        </button>
        {showMetricsSection && (
          <div className="p-4 border-t border-gray-700">
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
        <Label htmlFor="status" className="text-gray-300">Status *</Label>
        <Select
          defaultValue={product.status || undefined}
          onValueChange={(value) => setValue("status", value as "draft" | "published")}
        >
          <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Save as Draft</SelectItem>
            <SelectItem value="published">Publish</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-red-400 text-sm mt-1">{errors.status.message}</p>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-6">
        <Button type="submit" disabled={isPending} className="flex-1 bg-purple-600 hover:bg-purple-700">
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
          className="border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting || isPending}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </form>
  );
}
