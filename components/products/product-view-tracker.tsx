"use client";

import { useEffect } from "react";
import { incrementProductView } from "@/lib/products/view-actions";

interface ProductViewTrackerProps {
  productId: string;
}

export function ProductViewTracker({ productId }: ProductViewTrackerProps) {
  useEffect(() => {
    // Track view on mount
    incrementProductView(productId).catch((error) => {
      console.error("Failed to track product view:", error);
    });
  }, [productId]);

  // This component doesn't render anything
  return null;
}
