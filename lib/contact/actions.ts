"use server";

import { z } from "zod";
import { Resend } from "resend";
import { contactFormSchema, type ContactFormData } from "./schema";
import { createClient } from "@/lib/supabase/server";

// Initialize Resend with API key
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function submitContactForm(data: ContactFormData) {
  try {
    // Validate the data
    const validatedData = contactFormSchema.parse(data);

    // Store contact form submission in database for tracking
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("contact_submissions").insert({
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
      status: "pending",
    });

    if (dbError) {
      console.error("Error storing contact submission:", dbError);
      // Don't fail the request if DB insert fails - email is more critical
    }

    // Send email notification if Resend is configured
    if (resend) {
      try {
        // Send notification to support team
        await resend.emails.send({
          from: "AIMMT Contact Form <noreply@aimademethis.com>",
          to: ["hello@aimademethis.com"], // Your support email
          replyTo: validatedData.email,
          subject: `Contact Form: ${validatedData.subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${validatedData.name} (${validatedData.email})</p>
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>${validatedData.message.replace(/\n/g, "<br />")}</p>
            <hr />
            <p style="color: #666; font-size: 12px;">This email was sent from the AIMMT contact form.</p>
          `,
        });

        // Send confirmation to user
        await resend.emails.send({
          from: "AIMMT Team <noreply@aimademethis.com>",
          to: [validatedData.email],
          subject: "We received your message - AIMMT",
          html: `
            <h2>Thank you for contacting us!</h2>
            <p>Hi ${validatedData.name},</p>
            <p>We've received your message and will get back to you within 24-48 hours during business days.</p>
            <hr />
            <p><strong>Your Message:</strong></p>
            <p><em>${validatedData.subject}</em></p>
            <p>${validatedData.message.replace(/\n/g, "<br />")}</p>
            <hr />
            <p>Best regards,<br />The AIMMT Team</p>
            <p style="color: #666; font-size: 12px;">If you didn't send this message, please ignore this email.</p>
          `,
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Continue even if email fails - message is stored in DB
      }
    } else {
      console.warn("Resend API key not configured. Email notifications disabled.");
    }

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
