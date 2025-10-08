import { notFound } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getProductForEdit } from "@/lib/products/edit-actions";
import { getCategories } from "@/lib/products/actions";
import { ProductEditForm } from "@/components/products/product-edit-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditProductPageProps) {
  const { id } = await params;
  const result = await getProductForEdit(id);

  if (!result.success || !result.product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `Edit ${result.product.name} | AIMadeThis`,
    description: `Edit your product ${result.product.name}`,
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  // Get product for editing
  const result = await getProductForEdit(id);

  if (!result.success || !result.product) {
    notFound();
  }

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
          <h1 className="text-3xl font-bold text-white mb-2">
            Edit Product
          </h1>
          <p className="text-gray-400">
            Make changes to your product information
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-8">
            <ProductEditForm
              product={result.product as never}
              categories={categories}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
