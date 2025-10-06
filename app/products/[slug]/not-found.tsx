import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="mx-auto max-w-md">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/products">
            <Button>Browse All Products</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
