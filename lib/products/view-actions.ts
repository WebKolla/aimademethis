"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function incrementProductView(productId: string) {
  const supabase = await createClient();
  const cookieStore = await cookies();

  // Check if user has already viewed this product (using cookie)
  const viewedCookie = cookieStore.get(`viewed_${productId}`);

  // Only increment if not viewed in this session
  if (!viewedCookie) {
    const { error } = await supabase.rpc("increment_product_views", {
      product_id: productId,
    });

    if (!error) {
      // Set cookie to prevent duplicate counting (expires in 24 hours)
      // Note: In Next.js 15, cookies().set() must be called in a Server Action
      // This is now properly wrapped as a Server Action
      (await cookies()).set(`viewed_${productId}`, "1", {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: "lax",
      });
    }

    return { success: !error };
  }

  return { success: true, alreadyViewed: true };
}
