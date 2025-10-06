"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function incrementProductView(productId: string) {
  const supabase = await createClient();

  // Check if user has already viewed this product (using cookie)
  const cookieStore = await cookies();
  const viewedProducts = cookieStore.get(`viewed_${productId}`);

  // Only increment if not viewed in this session
  if (!viewedProducts) {
    const { error } = await supabase.rpc("increment_product_views", {
      product_id: productId,
    });

    if (!error) {
      // Set cookie to prevent duplicate counting (expires in 24 hours)
      cookieStore.set(`viewed_${productId}`, "1", {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
      });
    }
  }
}
