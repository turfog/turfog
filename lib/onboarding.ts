import { createClient } from "@/lib/supabase";

export interface OnboardingInput {
  sports: string[];
  city: string;
  presence: string;
}

export async function saveOnboarding(input: OnboardingInput): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // Core fields — these columns always exist.
  const { error } = await supabase
    .from("players")
    .update({ city: input.city, presence_status: input.presence })
    .eq("auth_id", user.id);
  if (error) return false;

  // Sports + onboarding flag — best effort (needs the migration above).
  await supabase
    .from("players")
    .update({ sports: input.sports, onboarded_at: new Date().toISOString() })
    .eq("auth_id", user.id);

  return true;
}