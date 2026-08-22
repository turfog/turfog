"use server";

import { cookies } from "next/headers";

// Phase 1 Hardcoded Master Admin (Will be moved to DB later)
const MASTER_ADMIN = {
  email: "admin@turfog.com",
  password: "godmode2026" 
};

export async function loginAdmin(email: string, password: string) {
  // Simulate network delay for realistic feel
  await new Promise(resolve => setTimeout(resolve, 800));

  if (email === MASTER_ADMIN.email && password === MASTER_ADMIN.password) {
    // Generate a secure session token (in production, use JWT or DB session)
    const sessionToken = "turfog_admin_secure_session_" + Math.random().toString(36).substring(2);
    
    const cookieStore = await cookies();
    cookieStore.set("turfog-admin-session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { success: true };
  }

  return { success: false, error: "Invalid credentials. Access denied." };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("turfog-admin-session");
}