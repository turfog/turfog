import { createClient } from "@/lib/supabase";

export interface Listing {
  id: string;
  sellerName: string;
  sellerUsername: string;
  title: string;
  category: string;
  description: string;
  price: number | null;
  location: string;
  createdAt: string;
}

export async function fetchListings(category?: string): Promise<Listing[]> {
  const supabase = createClient();
  let query = supabase
    .from("marketplace_listings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (category && category !== "all") {
    query = query.eq("category", category);
  }
  const { data } = await query;
  return ((data ?? []) as Array<Record<string, unknown>>).map((r) => ({
    id: String(r.id),
    sellerName: String(r.seller_name ?? "Seller"),
    sellerUsername: String(r.seller_username ?? "seller"),
    title: String(r.title ?? ""),
    category: String(r.category ?? "equipment"),
    description: String(r.description ?? ""),
    price: r.price != null ? Number(r.price) : null,
    location: String(r.location ?? ""),
    createdAt: String(r.created_at),
  }));
}

export async function createListing(input: {
  title: string;
  category: string;
  description: string;
  price: number | null;
  location: string;
}): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase
    .from("players")
    .select("full_name, username")
    .eq("auth_id", user.id)
    .maybeSingle();
  const p = (profile ?? {}) as Record<string, unknown>;
  const { error } = await supabase.from("marketplace_listings").insert({
    seller_id: user.id,
    seller_name: String(p.full_name ?? "Seller"),
    seller_username: String(p.username ?? "seller"),
    title: input.title,
    category: input.category,
    description: input.description,
    price: input.price,
    location: input.location,
    is_active: true,
  });
  return !error;
}