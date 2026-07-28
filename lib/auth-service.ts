import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

/**
 * Authentication Service
 * Centralized auth operations for server components and route handlers
 */

export interface AuthUser {
  id: string;
  email: string | undefined;
  fullName: string | undefined;
  avatarUrl: string | undefined;
}

/**
 * Retrieves the currently authenticated user from the server context
 * Returns null if no valid session exists
 */
export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.user_metadata?.full_name || undefined,
    avatarUrl: user.user_metadata?.avatar_url || undefined,
  };
}

/**
 * Requires authentication for a server component or route
 * Redirects to sign-in if no valid session exists
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  return user;
}

/**
 * Redirects authenticated users away from auth pages
 * Used on sign-in/sign-up pages to send logged-in users to dashboard
 */
export async function redirectIfAuthenticated(): Promise<void> {
  const user = await getAuthenticatedUser();

  if (user) {
    // Check if user needs to set up username
    const supabase = await createServerSupabaseClient();
    const { data: player } = await supabase
      .from("players")
      .select("username_set")
      .eq("auth_id", user.id)
      .single();

    if (!player?.username_set) {
      redirect("/setup-username");
    }

    redirect("/dashboard");
  }
}

/**
 * Checks if a username is already taken in the database
 * Used for real-time username availability validation
 */
export async function isUsernameTaken(username: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("players")
    .select("id")
    .eq("username", username.toLowerCase().trim())
    .maybeSingle();

  if (error) {
    console.error("Error checking username:", error.message);
    return true; // Safer to assume taken on error
  }

  return data !== null;
}

/**
 * Signs out the current user and clears all session cookies
 */
export async function signOutUser(): Promise<void> {
  const supabase = await createServerSupabaseClient();

  await supabase.auth.signOut();
  redirect("/auth/sign-in");
}

/**
 * Retrieves the current user's player profile from the database
 */
export async function getCurrentPlayerProfile() {
  const user = await getAuthenticatedUser();

  if (!user) return null;

  const supabase = await createServerSupabaseClient();

  const { data: player, error } = await supabase
    .from("players")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (error || !player) {
    console.error("Error fetching player profile:", error?.message);
    return null;
  }

  return player;
}