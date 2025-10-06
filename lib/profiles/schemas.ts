import { z } from "zod";

export const profileUpdateSchema = z.object({
  full_name: z.string().max(100, "Full name must be at most 100 characters").optional(),

  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),

  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),

  twitter: z
    .string()
    .regex(/^[a-zA-Z0-9_]{1,15}$/, "Invalid Twitter handle")
    .optional()
    .or(z.literal("")),

  github: z
    .string()
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/, "Invalid GitHub username")
    .optional()
    .or(z.literal("")),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

export const avatarUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, "Avatar must be less than 2MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
      "Only JPEG, PNG, WebP, and GIF images are allowed"
    ),
});
