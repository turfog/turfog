"use client";

import { useAuthContext } from "@/context/AuthContext";

/**
 * Authentication Hook
 * Provides access to auth state and actions
 * Wraps AuthContext for cleaner imports
 */
export function useAuth() {
  const auth = useAuthContext();

  return {
    user: auth.user,
    session: auth.session,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    signOut: auth.signOut,
    refreshSession: auth.refreshSession,
    userId: auth.user?.id ?? null,
    userEmail: auth.user?.email ?? null,
    userMetadata: auth.user?.user_metadata ?? null,
  };
}