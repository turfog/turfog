"use server";

import { supabaseAdmin } from "@/lib/admin/supabase";
import { logAdminAction } from "@/lib/admin/audit";

const CURRENT_ADMIN_EMAIL = "admin@turfog.com";

export async function fetchPendingReports() {
  const { data, error } = await supabaseAdmin
    .from("reports")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("fetchPendingReports error:", error);
    return [];
  }
  return data || [];
}

export async function dismissReport(reportId: string) {
  const { error } = await supabaseAdmin
    .from("reports")
    .update({ status: "dismissed" })
    .eq("id", reportId);

  if (error) throw new Error(error.message);

  await logAdminAction({
    adminEmail: CURRENT_ADMIN_EMAIL,
    action: "content_removed",
    targetType: "report",
    targetId: reportId,
    details: "Report dismissed as false positive",
  });

  return { success: true };
}

export async function resolveReport(reportId: string, actionTaken: string) {
  const { error } = await supabaseAdmin
    .from("reports")
    .update({ status: "resolved" })
    .eq("id", reportId);

  if (error) throw new Error(error.message);

  await logAdminAction({
    adminEmail: CURRENT_ADMIN_EMAIL,
    action: "content_removed",
    targetType: "report",
    targetId: reportId,
    details: `Report resolved: ${actionTaken}`,
  });

  return { success: true };
}