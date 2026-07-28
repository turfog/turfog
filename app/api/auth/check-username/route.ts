import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { usernameSchema } from "@/lib/validators";
import { ZodError } from "zod";

/**
 * Username Availability Check API
 * Used for real-time validation during username setup
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    // Validate username format
    try {
      usernameSchema.parse({ username });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            available: false,
            error: error.errors[0]?.message || "Invalid username format",
          },
          { status: 200 }
        );
      }
    }

    // Check if username is taken
    const supabase = await createServerSupabaseClient();

    const { data: existingUser, error } = await supabase
      .from("players")
      .select("id")
      .eq("username", username.toLowerCase().trim())
      .maybeSingle();

    if (error) {
      console.error("Error checking username:", error.message);
      return NextResponse.json(
        { error: "Failed to check username availability" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      available: existingUser === null,
      username: username.toLowerCase().trim(),
    });
  } catch (error) {
    console.error("Username check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}