"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Mail,
  Send,
  CheckCircle,
  Clock,
  HelpCircle,
  Sparkles,
  Twitter,
  Github,
} from "lucide-react";
import { submitContactForm } from "@/lib/contact/actions";
import { contactFormSchema, type ContactFormData } from "@/lib/contact/schema";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const faqs = [
  {
    question: "How long does it take to get a response?",
    answer: "We typically respond to all inquiries within 24-48 hours during business days.",
  },
  {
    question: "Can I suggest a new feature?",
    answer: "Absolutely! We love hearing ideas from our community. Use the contact form to share your suggestions.",
  },
  {
    question: "How do I report a bug?",
    answer: "Please use the contact form and select 'Bug Report' as the subject. Include as much detail as possible.",
  },
  {
    question: "Can I advertise on AIMMT?",
    answer: "AIMMT offers a generous free tier with premium plans for advanced features. We remain ad-free and focus on organic, community-driven discovery.",
  },
];

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "General inquiries and support",
    value: "hello@aimademethis.com",
    link: "mailto:hello@aimademethis.com",
  },
  {
    icon: Twitter,
    title: "Follow Us",
    description: "Updates and announcements",
    value: "@aimademethis",
    link: "https://twitter.com/aimademethis",
  }
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const result = await submitContactForm(data);

    setIsSubmitting(false);

    if (result.error) {
      setSubmitError(result.error);
    } else {
      setSubmitSuccess(true);
      form.reset();
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-teal-950/20 dark:to-slate-950">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/4 -left-48 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block"
            >
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-teal-500/30">
                <Sparkles className="w-5 h-5" />
                Get in Touch
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              <span className="block text-gray-900 dark:text-white">We&apos;d Love to</span>
              <span className="block mt-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Hear From You
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Have questions, feedback, or ideas? We&apos;re here to help and would love to connect with you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 md:p-12 shadow-xl">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                      Send us a message
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                      Fill out the form below and we&apos;ll get back to you as soon as possible.
                    </p>
                  </div>

                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                          Message sent successfully!
                        </p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                          Thank you for contacting us. We&apos;ll get back to you within 24-48 hours.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                      <p className="text-sm text-red-900 dark:text-red-100">{submitError}</p>
                    </motion.div>
                  )}

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your name"
                                  {...field}
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your@email.com"
                                  {...field}
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="What&apos;s this about?"
                                {...field}
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us more..."
                                className="min-h-[200px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <Clock className="mr-2 h-5 w-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </motion.div>

            {/* Contact Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Contact Methods */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Other Ways to Reach Us
                </h3>
                <div className="space-y-4">
                  {contactMethods.map((method) => (
                    <a
                      key={method.title}
                      href={method.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          <method.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {method.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            {method.description}
                          </p>
                          <p className="text-sm text-teal-600 dark:text-teal-400 font-medium truncate">
                            {method.value}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Response Time */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-teal-200 dark:border-teal-800">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Expected Response Time
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      We typically respond to all inquiries within <strong>24-48 hours</strong> during business days.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={container}
            className="max-w-4xl mx-auto space-y-12"
          >
            <motion.div variants={item} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-xl mx-auto">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                Quick answers to common questions
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={item} className="text-center">
              <p className="text-slate-600 dark:text-slate-300">
                Don&apos;t see your question?{" "}
                <a href="#contact-form" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                  Send us a message
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
