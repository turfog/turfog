"use server";

import { supabaseAdmin } from "@/lib/admin/supabase";
import { logAdminAction } from "@/lib/admin/audit";

const CURRENT_ADMIN_EMAIL = "admin@turfog.com";

function mapStatus(s: string | null | undefined): "Completed" | "In Escrow" | "Disputed" {
  const v = (s || "").toLowerCase();
  if (v.includes("disput")) return "Disputed";
  if (v.includes("escrow") || v.includes("pending") || v.includes("processing")) return "In Escrow";
  return "Completed";
}

function mapOrder(o: any) {
  return {
    id: String(o.id),
    product: o.product_name || o.title || o.product || o.item || "Marketplace Item",
    buyer: o.buyer_name || o.buyer || "Buyer",
    seller: o.seller_name || o.seller || "Seller",
    amount: Number(o.total_amount || o.amount || o.price || o.total || 0),
    status: mapStatus(o.status),
    disputeReason: o.dispute_reason || undefined,
  };
}

export async function fetchOrders() {
  let { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    const fb = await supabaseAdmin
      .from("marketplace_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    data = fb.data;
    error = fb.error;
  }

  if (error) {
    console.error("fetchOrders error:", error);
    return [];
  }
  return (data || []).map(mapOrder);
}

export async function resolveOrderDispute(orderId: string, action: "release" | "refund") {
  const newStatus = action === "release" ? "completed" : "refunded";

  let { error } = await supabaseAdmin
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (error) {
    const fb = await supabaseAdmin
      .from("marketplace_orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    error = fb.error;
  }

  if (error) throw new Error(error.message);

  await logAdminAction({
    adminEmail: CURRENT_ADMIN_EMAIL,
    action: action === "release" ? "escrow_released" : "escrow_refunded",
    targetType: "order",
    targetId: orderId,
    details: action === "release" ? "Escrow released to seller" : "Buyer refunded from escrow",
  });

  return { success: true };
}