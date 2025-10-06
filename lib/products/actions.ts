"use server";

import { createClient } from "@/lib/supabase/server";
import { ProductSubmissionData, productSubmissionSchema } from "./schemas";
import { revalidatePath } from "next/cache";

// Helper function to generate URL-friendly slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Helper function to ensure slug uniqueness
async function ensureUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  baseSlug: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { error } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .single();

    if (error && error.code === "PGRST116") {
      // No product found with this slug, it's unique
      return slug;
    }

    if (error) {
      throw new Error("Failed to check slug uniqueness");
    }

    // Slug exists, try with counter
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Helper function to get or create tags
async function getOrCreateTags(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tagNames: string[]
): Promise<string[]> {
  const tagIds: string[] = [];

  for (const tagName of tagNames) {
    const tagSlug = generateSlug(tagName);

    // Try to find existing tag
    const { data: existingTag } = await supabase
      .from("tags")
      .select("id")
      .eq("slug", tagSlug)
      .single();

    if (existingTag) {
      tagIds.push(existingTag.id);
    } else {
      // Create new tag
      const { data: newTag, error } = await supabase
        .from("tags")
        .insert({ name: tagName, slug: tagSlug })
        .select("id")
        .single();

      if (error) {
        throw new Error(`Failed to create tag: ${tagName}`);
      }

      tagIds.push(newTag.id);
    }
  }

  return tagIds;
}

export async function submitProduct(data: ProductSubmissionData) {
  try {
    // Validate the data
    const validatedData = productSubmissionSchema.parse(data);

    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to submit a product",
      };
    }

    // Generate unique slug
    const baseSlug = generateSlug(validatedData.name);
    const uniqueSlug = await ensureUniqueSlug(supabase, baseSlug);

    // Get or create tags
    const tagIds = await getOrCreateTags(supabase, validatedData.tags);

    // Insert product with all fields
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        // Basic fields
        name: validatedData.name,
        slug: uniqueSlug,
        tagline: validatedData.tagline,
        description: validatedData.description,
        website_url: validatedData.website_url || null,
        pricing_type: validatedData.pricing_type,
        pricing_details: validatedData.pricing_details || null,
        category_id: validatedData.category_id,
        status: validatedData.status,
        demo_url: validatedData.demo_url || null,
        github_url: validatedData.github_url || null,
        twitter_handle: validatedData.twitter_handle || null,
        user_id: user.id,
        // Media URLs
        video_url: validatedData.video_url || null,
        demo_video_url: validatedData.demo_video_url || null,
        // Development Tools (arrays)
        ide_used: validatedData.ide_used || null,
        ai_models_used: validatedData.ai_models_used || null,
        ai_tools_used: validatedData.ai_tools_used || null,
        voice_tools_used: validatedData.voice_tools_used || null,
        // Development Process
        development_approach: validatedData.development_approach || null,
        project_management_method: validatedData.project_management_method || null,
        agentic_workflow_used: validatedData.agentic_workflow_used ?? null,
        // Technical Stack
        tech_stack: validatedData.tech_stack || null,
        ui_framework: validatedData.ui_framework || null,
        mcps_used: validatedData.mcps_used || null,
        cursor_rules: validatedData.cursor_rules || null,
        commands_used: validatedData.commands_used || null,
        // Cost & Metrics
        total_token_cost: validatedData.total_token_cost ?? null,
        total_cost_usd: validatedData.total_cost_usd ?? null,
        development_time_hours: validatedData.development_time_hours ?? null,
        // Workflow & Prompts
        workflow_description: validatedData.workflow_description || null,
        key_prompts: validatedData.key_prompts || null,
      })
      .select()
      .single();

    if (productError) {
      console.error("Product creation error:", productError);
      return {
        success: false,
        error: "Failed to create product. Please try again.",
      };
    }

    // Link tags to product
    if (tagIds.length > 0) {
      const productTags = tagIds.map((tagId) => ({
        product_id: product.id,
        tag_id: tagId,
      }));

      const { error: tagsError } = await supabase
        .from("product_tags")
        .insert(productTags);

      if (tagsError) {
        console.error("Tags linking error:", tagsError);
        // Don't fail the entire operation if tags fail
      }
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/product/${uniqueSlug}`);

    return {
      success: true,
      product: product,
      slug: uniqueSlug,
    };
  } catch (error) {
    console.error("Submit product error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function uploadProductImage(productId: string, file: File) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to upload images",
      };
    }

    // Verify user owns this product
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("user_id")
      .eq("id", productId)
      .single();

    if (productError || !product || product.user_id !== user.id) {
      return {
        success: false,
        error: "Product not found or you don't have permission to edit it",
      };
    }

    // Generate unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Image upload error:", uploadError);
      return {
        success: false,
        error: "Failed to upload image. Please try again.",
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(filePath);

    // Update product with image URL
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_url: publicUrl })
      .eq("id", productId);

    if (updateError) {
      console.error("Product update error:", updateError);
      return {
        success: false,
        error: "Failed to update product with image URL",
      };
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/product/${productId}`);

    return {
      success: true,
      imageUrl: publicUrl,
    };
  } catch (error) {
    console.error("Upload image error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function deleteProductImage(productId: string, imageUrl: string) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    // Verify user owns this product
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("user_id")
      .eq("id", productId)
      .single();

    if (productError || !product || product.user_id !== user.id) {
      return {
        success: false,
        error: "Product not found or you don't have permission to edit it",
      };
    }

    // Extract file path from URL
    const urlParts = imageUrl.split("/products/");
    if (urlParts.length < 2) {
      return {
        success: false,
        error: "Invalid image URL",
      };
    }
    const filePath = urlParts[1];

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from("products")
      .remove([filePath]);

    if (deleteError) {
      console.error("Image deletion error:", deleteError);
      // Don't fail if image doesn't exist
    }

    // Update product to remove image URL
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_url: null })
      .eq("id", productId);

    if (updateError) {
      console.error("Product update error:", updateError);
      return {
        success: false,
        error: "Failed to update product",
      };
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/product/${productId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete image error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Helper function to get all categories for form dropdown
export async function getCategories() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name");

    if (error) {
      console.error("Get categories error:", error);
      return {
        success: false,
        error: "Failed to load categories",
        categories: [],
      };
    }

    return {
      success: true,
      categories: data,
    };
  } catch (error) {
    console.error("Get categories error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      categories: [],
    };
  }
}
