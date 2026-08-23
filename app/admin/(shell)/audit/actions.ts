"use server";

import { supabaseAdmin } from "@/lib/admin/supabase";

export async function fetchAuditLogs() {
  const { data, error } = await supabaseAdmin
    .from("admin_audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("fetchAuditLogs error:", error);
    return [];
  }
  return data || [];
}