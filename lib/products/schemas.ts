import { z } from "zod";

export const productSubmissionSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must be at most 100 characters"),

  tagline: z
    .string()
    .min(10, "Tagline must be at least 10 characters")
    .max(200, "Tagline must be at most 200 characters"),

  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must be at most 5000 characters"),

  website_url: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Website URL is required"),

  pricing_type: z.enum(["free", "freemium", "paid", "subscription"], {
    message: "Please select a pricing type",
  }),

  pricing_details: z.string().max(200, "Pricing details must be at most 200 characters").optional(),

  category_id: z
    .string()
    .uuid("Please select a valid category"),

  tags: z
    .array(z.string())
    .min(1, "Please add at least one tag")
    .max(10, "Maximum 10 tags allowed"),

  status: z.enum(["draft", "published"]).default("draft"),

  demo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),

  github_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),

  twitter_handle: z
    .string()
    .regex(/^[a-zA-Z0-9_]{1,15}$/, "Invalid Twitter handle")
    .optional()
    .or(z.literal("")),

  // Media URLs
  video_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val) return true;
        return (
          val.includes("youtube.com") ||
          val.includes("youtu.be") ||
          val.includes("vimeo.com") ||
          val.includes("loom.com")
        );
      },
      "Must be a YouTube, Vimeo, or Loom URL"
    ),

  demo_video_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val) return true;
        return (
          val.includes("youtube.com") ||
          val.includes("youtu.be") ||
          val.includes("vimeo.com") ||
          val.includes("loom.com")
        );
      },
      "Must be a YouTube, Vimeo, or Loom URL"
    ),

  // Development Tools (all optional)
  ide_used: z.array(z.string()).max(10, "Maximum 10 IDEs").optional(),
  ai_models_used: z.array(z.string()).max(10, "Maximum 10 AI models").optional(),
  ai_tools_used: z.array(z.string()).max(10, "Maximum 10 AI tools").optional(),
  voice_tools_used: z.array(z.string()).max(5, "Maximum 5 voice tools").optional(),

  // Development Process (all optional)
  development_approach: z
    .enum(["pure_prompting", "ai_assisted", "manual", "hybrid"])
    .optional(),

  project_management_method: z
    .enum(["agile", "waterfall", "kanban", "agentic", "none", "other"])
    .optional(),

  agentic_workflow_used: z.boolean().optional(),

  // Technical Stack (all optional)
  tech_stack: z.array(z.string()).max(20, "Maximum 20 technologies").optional(),

  ui_framework: z
    .string()
    .max(100, "Maximum 100 characters")
    .optional()
    .or(z.literal("")),

  mcps_used: z.array(z.string()).max(10, "Maximum 10 MCPs").optional(),

  cursor_rules: z
    .string()
    .max(10000, "Maximum 10,000 characters")
    .optional()
    .or(z.literal("")),

  commands_used: z.array(z.string()).max(10, "Maximum 10 commands").optional(),

  // Cost & Metrics (all optional, nullable)
  total_token_cost: z
    .number()
    .positive("Must be a positive number")
    .optional()
    .nullable(),

  total_cost_usd: z
    .number()
    .positive("Must be a positive number")
    .max(1000000, "Must be less than $1,000,000")
    .optional()
    .nullable(),

  development_time_hours: z
    .number()
    .positive("Must be a positive number")
    .max(100000, "Must be less than 100,000 hours")
    .optional()
    .nullable(),

  // Workflow & Prompts (all optional)
  workflow_description: z
    .string()
    .max(5000, "Maximum 5,000 characters")
    .optional()
    .or(z.literal("")),

  key_prompts: z
    .array(
      z.object({
        title: z
          .string()
          .min(1, "Title is required")
          .max(100, "Maximum 100 characters"),
        prompt: z
          .string()
          .min(1, "Prompt content is required")
          .max(2000, "Maximum 2,000 characters"),
        description: z
          .string()
          .min(1, "Description is required")
          .max(200, "Maximum 200 characters"),
      })
    )
    .max(10, "Maximum 10 key prompts")
    .optional(),
});

export type ProductSubmissionData = z.infer<typeof productSubmissionSchema>;

// Schema for image upload
export const productImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Image must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
      "Only JPEG, PNG, WebP, and GIF images are allowed"
    ),
});
