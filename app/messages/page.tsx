import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { MessagingProvider } from "@/context/MessagingContext";
import MessagesClient from "@/components/messaging/MessagesClient";

export const metadata: Metadata = {
  title: "Messages - Turfog",
  description: "Your conversations on Turfog.",
};

export default async function MessagesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  return (
    <MessagingProvider>
      <MessagesClient />
    </MessagingProvider>
  );
}