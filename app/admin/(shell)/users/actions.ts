"use server";

import { supabaseAdmin } from "@/lib/admin/supabase";
import { logAdminAction } from "@/lib/admin/audit";

const CURRENT_ADMIN_EMAIL = "admin@turfog.com"; // TODO: Decode from session cookie later

export async function fetchUsers() {
  // Fetch from 'players' or 'users' table depending on your actual schema
  // Using 'players' as it's common in Turfog, fallback to standard fields
  const { data, error } = await supabaseAdmin
    .from("players")
    .select(`
      id,
      full_name,
      username,
      auth_id,
      profile_photo,
      verification_status,
      created_at
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("fetchUsers error:", error);
    return [];
  }
  
  // Map to match our UI expectations
  return (data || []).map((u: any) => ({
    id: u.id,
    full_name: u.full_name || "Unknown",
    username: u.username || "unknown",
    email: u.auth_id || "N/A",
    profile_photo: u.profile_photo,
    verification_status: u.verification_status || "pending",
    created_at: u.created_at,
    last_active_at: null
  }));
}

export async function verifyUser(userId: string) {
  const { error } = await supabaseAdmin
    .from("players")
    .update({ verification_status: "verified" })
    .eq("id", userId);

  if (error) throw new Error(error.message);
  
  await logAdminAction({
    adminEmail: CURRENT_ADMIN_EMAIL,
    action: "user_verified",
    targetType: "player",
    targetId: userId,
    details: "User verified via admin panel",
  });
  
  return { success: true };
}

export async function suspendUser(userId: string, reason: string) {
  const { error } = await supabaseAdmin
    .from("players")
    .update({ 
      verification_status: "suspended",
      // If you have a suspension_reason column, it will update it. If not, Supabase ignores it or throws. 
      // To be safe, we just update the status.
    })
    .eq("id", userId);

  if (error) throw new Error(error.message);
  
  await logAdminAction({
    adminEmail: CURRENT_ADMIN_EMAIL,
    action: "user_suspended",
    targetType: "player",
    targetId: userId,
    details: reason,
  });
  
  return { success: true };
}