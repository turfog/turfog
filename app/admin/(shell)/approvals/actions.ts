"use server";

import { supabaseAdmin } from "@/lib/admin/supabase";
import { verifyUser, suspendUser } from "../users/actions";
import { reviewCampaign } from "../advertising/actions";
import { dismissReport, resolveReport } from "../moderation/actions";

export interface UnifiedApproval {
  id: string;
  type: "user" | "ad" | "report";
  title: string;
  submittedBy: string;
  submittedAt: string;
  priority: "high" | "medium" | "low";
  rawId: string; // The actual DB id to pass to the action
}

export async function fetchUnifiedApprovals(): Promise<UnifiedApproval[]> {
  const approvals: UnifiedApproval[] = [];

  // 1. Fetch Pending Users
  const { data: users } = await supabaseAdmin
    .from("players")
    .select("id, full_name, username, created_at")
    .eq("verification_status", "pending")
    .order("created_at", { ascending: false })
    .limit(10);

  (users || []).forEach((u: any) => {
    approvals.push({
      id: `user-${u.id}`,
      type: "user",
      title: `Verify Player: ${u.full_name || "Unknown"}`,
      submittedBy: `@${u.username || "unknown"}`,
      submittedAt: u.created_at,
      priority: "medium",
      rawId: u.id,
    });
  });

  // 2. Fetch Pending Ads
  const { data: ads } = await supabaseAdmin
    .from("campaigns") // Fallback handled in the specific action, but we query the main one here
    .select("id, name, advertiser, created_at")
    .in("status", ["pending", "submitted", "pending_review"])
    .order("created_at", { ascending: false })
    .limit(10);

  (ads || []).forEach((a: any) => {
    approvals.push({
      id: `ad-${a.id}`,
      type: "ad",
      title: `Review Ad: ${a.name}`,
      submittedBy: a.advertiser || "Advertiser",
      submittedAt: a.created_at,
      priority: "high", // Ads = Revenue = High Priority
      rawId: a.id,
    });
  });

  // 3. Fetch Pending Reports
  const { data: reports } = await supabaseAdmin
    .from("reports")
    .select("id, reason, severity, created_at, reporter_id")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(10);

  (reports || []).forEach((r: any) => {
    approvals.push({
      id: `report-${r.id}`,
      type: "report",
      title: `Moderate: ${r.reason}`,
      submittedBy: r.reporter_id || "Anonymous",
      submittedAt: r.created_at,
      priority: r.severity === "critical" ? "high" : "medium",
      rawId: r.id,
    });
  });

  // Sort by date (newest first)
  approvals.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  return approvals;
}

// The central router for taking action
export async function executeApproval(approvalId: string, action: "approve" | "reject", reason?: string) {
  const [type, rawId] = approvalId.split("-"); // e.g., "user-uuid" -> ["user", "uuid"]
  
  if (type === "user") {
    if (action === "approve") return verifyUser(rawId);
    if (action === "reject") return suspendUser(rawId, reason || "Failed verification");
  }
  
  if (type === "ad") {
    return reviewCampaign(rawId, action === "approve" ? "approve" : "reject");
  }
  
  if (type === "report") {
    if (action === "approve") return resolveReport(rawId, reason || "Action taken"); // "Approve" a report means "Take Action"
    if (action === "reject") return dismissReport(rawId); // "Reject" a report means "Dismiss"
  }

  throw new Error("Unknown approval type");
}