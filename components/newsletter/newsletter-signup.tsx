"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { subscribeToNewsletter } from "@/lib/newsletter/actions";
import {
  newsletterSchema,
  type NewsletterFormData,
} from "@/types/newsletter.types";

interface NewsletterSignupProps {
  className?: string;
  variant?: "default" | "minimal" | "card";
  placeholder?: string;
  buttonText?: string;
}

export function NewsletterSignup({
  className,
  variant = "default",
  placeholder = "Enter your email",
  buttonText = "Subscribe",
}: NewsletterSignupProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setStatus("idle");
    setMessage("");

    const formData = new FormData();
    formData.append("email", data.email);

    const result = await subscribeToNewsletter(formData);

    if (result.success) {
      setStatus("success");
      setMessage(result.message);
      reset(); // Clear form on success
    } else {
      setStatus("error");
      setMessage(result.error);
    }

    // Auto-clear message after 7 seconds
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 7000);
  };

  // Variant styles
  const variants = {
    default: "space-y-4",
    minimal: "space-y-2",
    card: "rounded-lg border bg-card p-6 space-y-4 shadow-sm",
  };

  return (
    <div className={cn(variants[variant], className)}>
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              {...register("email")}
              type="email"
              placeholder={placeholder}
              className={cn(
                "pl-9 h-12 rounded-full",
                errors.email && "border-destructive focus-visible:ring-destructive"
              )}
              disabled={isSubmitting}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 px-8 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all disabled:opacity-50"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Subscribing...</span>
              </>
            ) : (
              <>
                <span>{buttonText}</span>
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>

        {/* Error message from validation */}
        {errors.email && (
          <p
            id="email-error"
            className="text-sm text-destructive flex items-center gap-1.5 px-3"
          >
            <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {errors.email.message}
          </p>
        )}

        {/* Success/Error feedback */}
        {message && (
          <div
            className={cn(
              "text-sm flex items-start gap-2 p-4 rounded-xl",
              status === "success" &&
                "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-900",
              status === "error" &&
                "bg-destructive/10 text-destructive border border-destructive/20"
            )}
            role="alert"
            aria-live="polite"
          >
            {status === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <span className="flex-1">{message}</span>
          </div>
        )}
      </form>
    </div>
  );
}
