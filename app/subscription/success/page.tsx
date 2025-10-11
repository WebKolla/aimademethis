import { Suspense } from "react";
import { SubscriptionSuccessClient } from "./success-client";

export const metadata = {
  title: "Subscription Successful | AIMadeThis",
  description: "Your subscription has been successfully activated!",
};

export default function SubscriptionSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
        </div>
      }
    >
      <SubscriptionSuccessClient />
    </Suspense>
  );
}
