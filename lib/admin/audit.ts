import { supabaseAdmin } from "./supabase";

export type AuditAction = 
  | "user_verified" 
  | "user_suspended" 
  | "ad_approved" 
  | "ad_rejected" 
  | "escrow_released" 
  | "content_removed";

export async function logAdminAction(params: {
  adminEmail: string;
  action: AuditAction;
  targetType: string;
  targetId: string;
  details: string;
}) {
  try {
    await supabaseAdmin.from("admin_audit_logs").insert({
      admin_email: params.adminEmail,
      action: params.action,
      target_type: params.targetType,
      target_id: params.targetId,
      details: params.details,
    });
  } catch (error) {
    console.error("[AUDIT LOGGER] Failed to write audit log:", error);
    // We don't throw here because a logging failure shouldn't block the actual admin action
  }
}