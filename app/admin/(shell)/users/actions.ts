"use server";

import { supabaseAdmin } from "@/lib/admin/supabase";

export async function fetchUsers() {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select(`
      id,
      full_name,
      username,
      email,
      profile_photo,
      verification_status,
      created_at,
      last_active_at
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}

export async function verifyUser(userId: string) {
  const { error } = await supabaseAdmin
    .from("users")
    .update({ verification_status: "verified" })
    .eq("id", userId);

  if (error) throw error;
  
  // Log to audit table
  await supabaseAdmin.from("audit_logs").insert({
    action: "user_verified",
    target_id: userId,
    admin_id: "system", // TODO: Get actual admin ID from session
    details: "User verified via admin panel",
  });
  
  return { success: true };
}

export async function suspendUser(userId: string, reason: string) {
  const { error } = await supabaseAdmin
    .from("users")
    .update({ 
      verification_status: "suspended",
      suspended_at: new Date().toISOString(),
      suspension_reason: reason,
    })
    .eq("id", userId);

  if (error) throw error;
  
  await supabaseAdmin.from("audit_logs").insert({
    action: "user_suspended",
    target_id: userId,
    admin_id: "system",
    details: reason,
  });
  
  return { success: true };
}