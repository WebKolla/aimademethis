import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getCategories } from "@/lib/products/actions";
import { ProductSubmissionForm } from "@/components/products/product-submission-form";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Add New Product | AIMadeThis",
  description: "Submit your AI-powered product to AIMadeThis",
};

export default async function NewProductPage() {
  // Fetch categories
  const { categories } = await getCategories();

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4 text-gray-400 hover:text-white"
          >
            <Link href="/dashboard/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Products
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">Add New Product</h1>
          <p className="text-gray-400">
            Share your AI-powered product with the community. Fields marked with * are
            required.
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-8">
            <ProductSubmissionForm categories={categories} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
