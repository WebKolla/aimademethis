import { z } from "zod";

// Zod validation schema for newsletter subscription
export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email is too long")
    .toLowerCase()
    .trim(),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Server action response types
export type NewsletterSubscribeResponse =
  | { success: true; message: string }
  | {
      success: false;
      error: string;
      code?: "DUPLICATE" | "RATE_LIMIT" | "VALIDATION" | "SERVER_ERROR";
    };

// Newsletter subscription status
export type NewsletterStatus = "active" | "unsubscribed";

// Type for newsletter subscription (extends database type)
export interface NewsletterSubscription {
  id: string;
  email: string;
  status: NewsletterStatus;
  source: string | null;
  subscribed_at: string | null;
  unsubscribed_at: string | null;
  consent_ip: string | null;
  user_agent: string | null;
  unsubscribe_token: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
}
