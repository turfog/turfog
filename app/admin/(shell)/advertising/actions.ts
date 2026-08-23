"use server";

import { supabaseAdmin } from "@/lib/admin/supabase";
import { logAdminAction } from "@/lib/admin/audit";

const CURRENT_ADMIN_EMAIL = "admin@turfog.com";

function mapStatus(s: string | null | undefined): "Live" | "Pending Review" | "Rejected" | "Paused" {
  const v = (s || "").toLowerCase();
  if (v.includes("live") || v.includes("active") || v.includes("approved")) return "Live";
  if (v.includes("pend") || v.includes("review") || v.includes("submitted")) return "Pending Review";
  if (v.includes("reject") || v.includes("denied")) return "Rejected";
  if (v.includes("paus")) return "Paused";
  return "Pending Review";
}

function mapCampaign(c: any) {
  return {
    id: String(c.id),
    name: c.name || c.title || "Untitled Campaign",
    advertiser: c.advertiser || c.business_name || c.advertiser_name || "Advertiser",
    status: mapStatus(c.status),
    budget: Number(c.budget || 0),
    spend: Number(c.spend || c.spent || 0),
    audience: c.audience || c.target_audience || "All users",
    location: c.location || c.geo || "All regions",
    adCopy: c.ad_copy || c.copy || c.description || "",
  };
}

export async function fetchCampaigns() {
  let { data, error } = await supabaseAdmin
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    const fb = await supabaseAdmin
      .from("ad_campaigns")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    data = fb.data;
    error = fb.error;
  }

  if (error) {
    console.error("fetchCampaigns error:", error);
    return [];
  }
  return (data || []).map(mapCampaign);
}

export async function reviewCampaign(campaignId: string, action: "approve" | "reject") {
  const newStatus = action === "approve" ? "live" : "rejected";

  let { error } = await supabaseAdmin
    .from("campaigns")
    .update({ status: newStatus })
    .eq("id", campaignId);

  if (error) {
    const fb = await supabaseAdmin
      .from("ad_campaigns")
      .update({ status: newStatus })
      .eq("id", campaignId);
    error = fb.error;
  }

  if (error) throw new Error(error.message);

  await logAdminAction({
    adminEmail: CURRENT_ADMIN_EMAIL,
    action: action === "approve" ? "ad_approved" : "ad_rejected",
    targetType: "campaign",
    targetId: campaignId,
    details: action === "approve" ? "Campaign approved and pushed live" : "Campaign rejected for policy",
  });

  return { success: true };
}