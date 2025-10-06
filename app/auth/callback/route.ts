import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has a profile, create one if not
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!existingProfile) {
          // Create profile for OAuth users
          const username =
            user.user_metadata.user_name ||
            user.user_metadata.preferred_username ||
            user.email?.split("@")[0] ||
            `user_${user.id.substring(0, 8)}`;

          await supabase.from("profiles").insert({
            id: user.id,
            username: username,
            full_name: (user.user_metadata.full_name || user.user_metadata.name || "") as string,
            avatar_url: (user.user_metadata.avatar_url || user.user_metadata.picture || "") as string,
          } as never);
        }
      }

      return NextResponse.redirect(`${origin}/`);
    }
  }

  // Return to login if something went wrong
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
