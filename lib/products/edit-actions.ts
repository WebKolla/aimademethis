"use server";

import { createClient } from "@/lib/supabase/server";
import { ProductSubmissionData, productSubmissionSchema } from "./schemas";
import { revalidatePath } from "next/cache";

// Get product for editing (must be owner)
export async function getProductForEdit(productId: string) {
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

    // Fetch product
    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        categories (id, name, slug)
      `)
      .eq("id", productId)
      .eq("user_id", user.id)
      .single();

    if (error || !product) {
      return {
        success: false,
        error: "Product not found or you don't have permission to edit it",
      };
    }

    // Get product tags
    const { data: productTags } = await supabase
      .from("product_tags")
      .select("tags (name)")
      .eq("product_id", productId);

    const tags = productTags?.map((pt) => (pt.tags as { name: string })?.name).filter(Boolean) || [];

    return {
      success: true,
      product: {
        ...product,
        tags,
      },
    };
  } catch (error) {
    console.error("Get product error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Update existing product
export async function updateProduct(productId: string, data: ProductSubmissionData) {
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
        error: "You must be logged in to update a product",
      };
    }

    // Verify ownership
    const { data: existingProduct } = await supabase
      .from("products")
      .select("id, user_id, slug")
      .eq("id", productId)
      .single();

    if (!existingProduct || existingProduct.user_id !== user.id) {
      return {
        success: false,
        error: "Product not found or you don't have permission to edit it",
      };
    }

    // Get or create tags
    const tagIds = await getOrCreateTags(supabase, validatedData.tags);

    // Update product
    const { error: productError } = await supabase
      .from("products")
      .update({
        name: validatedData.name,
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
        // Media URLs
        video_url: validatedData.video_url || null,
        demo_video_url: validatedData.demo_video_url || null,
        // Development Tools
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (productError) {
      console.error("Product update error:", productError);
      return {
        success: false,
        error: "Failed to update product. Please try again.",
      };
    }

    // Update tags - delete existing and insert new
    await supabase.from("product_tags").delete().eq("product_id", productId);

    if (tagIds.length > 0) {
      const productTags = tagIds.map((tagId) => ({
        product_id: productId,
        tag_id: tagId,
      }));

      const { error: tagsError } = await supabase
        .from("product_tags")
        .insert(productTags);

      if (tagsError) {
        console.error("Tags linking error:", tagsError);
      }
    }

    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${productId}/edit`);
    revalidatePath(`/products/${existingProduct.slug}`);

    return {
      success: true,
      slug: existingProduct.slug,
    };
  } catch (error) {
    console.error("Update product error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Helper function to generate URL-friendly slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

// Delete product
export async function deleteProduct(productId: string) {
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

    // Verify ownership
    const { data: product } = await supabase
      .from("products")
      .select("user_id, image_url")
      .eq("id", productId)
      .single();

    if (!product || product.user_id !== user.id) {
      return {
        success: false,
        error: "Product not found or you don't have permission to delete it",
      };
    }

    // Delete product image from storage if exists
    if (product.image_url) {
      const urlParts = product.image_url.split("/products/");
      if (urlParts.length === 2) {
        await supabase.storage.from("products").remove([urlParts[1]]);
      }
    }

    // Delete product (cascades to product_tags, votes, etc. if set up in DB)
    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      console.error("Product deletion error:", error);
      return {
        success: false,
        error: "Failed to delete product",
      };
    }

    revalidatePath("/dashboard/products");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete product error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
