import { createClient } from "@/lib/supabase";

export interface MarketListing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerUsername: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  category: "gear" | "coaching" | "umpiring" | "physio" | "other";
  condition: "new" | "like-new" | "used" | "n/a" | null;
  imageUrl: string | null;
  location: string | null;
  createdAt: string;
}

export async function fetchListings(category?: string): Promise<MarketListing[]> {
  const supabase = createClient();
  let query = supabase
    .from("marketplace_listings")
    .select(`
      id,
      title,
      description,
      price,
      currency,
      category,
      condition,
      image_url,
      location,
      created_at,
      seller_id,
      seller:players!seller_id(full_name, username, profile_photo)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(50);

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data } = await query;
  if (!data) return [];

  return (data as any[]).map((l) => {
    const seller = l.seller as any;
    return {
      id: l.id,
      sellerId: l.seller_id,
      sellerName: seller?.full_name || "Player",
      sellerAvatar: seller?.profile_photo || "",
      sellerUsername: seller?.username || "player",
      title: l.title,
      description: l.description,
      price: Number(l.price),
      currency: l.currency,
      category: l.category,
      condition: l.condition,
      imageUrl: l.image_url,
      location: l.location,
      createdAt: l.created_at,
    };
  });
}

export async function createListing(input: {
  title: string;
  description?: string;
  price: number;
  category: "gear" | "coaching" | "umpiring" | "physio" | "other";
  condition?: "new" | "like-new" | "used" | "n/a";
  imageUrl?: string;
  location?: string;
}): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from("marketplace_listings").insert({
    seller_id: user.id,
    title: input.title,
    description: input.description,
    price: input.price,
    category: input.category,
    condition: input.condition || "n/a",
    image_url: input.imageUrl,
    location: input.location,
  });

  return !error;
}