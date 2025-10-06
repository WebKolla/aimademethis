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
