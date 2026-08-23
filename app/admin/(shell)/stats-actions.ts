"use server";

import { supabaseAdmin } from "@/lib/admin/supabase";

async function countTable(tables: string[]): Promise<number> {
  for (const t of tables) {
    const { count, error } = await supabaseAdmin
      .from(t)
      .select("*", { count: "exact", head: true });
    if (!error) return count || 0;
  }
  return 0;
}

async function countSince(tables: string[], iso: string): Promise<number> {
  for (const t of tables) {
    const { count, error } = await supabaseAdmin
      .from(t)
      .select("*", { count: "exact", head: true })
      .gte("created_at", iso);
    if (!error) return count || 0;
  }
  return 0;
}

async function sumGmv(tables: string[]): Promise<number> {
  for (const t of tables) {
    const { data, error } = await supabaseAdmin.from(t).select("*").limit(1000);
    if (!error) {
      return (data || []).reduce(
        (s, r) => s + Number(r.total_amount || r.amount || r.price || r.total || 0),
        0
      );
    }
  }
  return 0;
}

async function sumSpend(tables: string[]): Promise<number> {
  for (const t of tables) {
    const { data, error } = await supabaseAdmin.from(t).select("*").limit(1000);
    if (!error) {
      return (data || []).reduce(
        (s, r) => s + Number(r.spend || r.spent || 0),
        0
      );
    }
  }
  return 0;
}

export async function fetchDashboardStats() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [totalUsers, matches, gmv, adRevenue, pendingReports, newUsers7d] =
    await Promise.all([
      countTable(["players", "users"]),
      countTable(["matches", "match_requests"]),
      sumGmv(["orders", "marketplace_orders"]),
      sumSpend(["campaigns", "ad_campaigns"]),
      countTable(["reports"]),
      countSince(["players", "users"], sevenDaysAgo),
    ]);

  return { totalUsers, newUsers7d, matches, gmv, adRevenue, pendingReports };
}