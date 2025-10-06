"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
        // Submit product
        const result = await submitProduct(data);

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
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-purple-600 dark:hover:text-purple-400"
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
