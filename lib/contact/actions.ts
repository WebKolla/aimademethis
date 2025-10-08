"use server";

import { z } from "zod";
import { contactFormSchema, type ContactFormData } from "./schema";

export async function submitContactForm(data: ContactFormData) {
  try {
    // Validate the data
    const validatedData = contactFormSchema.parse(data);

    // TODO: In production, you would:
    // 1. Send an email notification to your support team
    // 2. Store the message in a database for tracking
    // 3. Send a confirmation email to the user
    //
    // For now, we'll just log it and return success
    console.log("Contact form submission:", validatedData);

    // Simulate a small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "Thank you for contacting us! We'll get back to you within 24-48 hours.",
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);

    if (error instanceof z.ZodError) {
      return {
        error: error.issues[0].message,
      };
    }

    return {
      error: "Something went wrong. Please try again later.",
    };
  }
}
