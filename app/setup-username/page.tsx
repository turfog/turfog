"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { UserIcon, CheckCircleIcon, XIcon, ZapIcon } from "@/components/SvgIcons";

const RESERVED = [
  "admin", "api", "auth", "dashboard", "settings", "profile",
  "communities", "games", "sports", "turfog", "support", "help",
  "about", "privacy", "terms", "login", "signup", "register",
];

export default function SetupUsernamePage() {
  const router = useRouter();
  const supabase = createClient();
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = useCallback((value: string) => {
    const clean = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(clean);

    if (clean.length === 0) {
      setStatus("idle");
      return;
    }
    if (clean.length < 3) {
      setStatus("invalid");
      setError("Minimum 3 characters");
      return;
    }
    if (clean.length > 20) {
      setStatus("invalid");
      setError("Maximum 20 characters");
      return;
    }
    if (RESERVED.includes(clean)) {
      setStatus("invalid");
      setError("This username is reserved");
      return;
    }

    setStatus("checking");
    setError("");

    const timer = setTimeout(async () => {
      const { data, error: queryError } = await supabase
        .from("players")
        .select("username")
        .eq("username", clean)
        .maybeSingle();

      if (queryError) {
        setStatus("available");
        return;
      }
      setStatus(data ? "taken" : "available");
      if (data) setError("Username is already taken");
    }, 500);

    return () => clearTimeout(timer);
  }, [supabase]);

  const handleSubmit = async () => {
    if (status !== "available") return;
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    const { error: updateError } = await supabase
      .from("players")
      .update({ username, username_set: true })
      .eq("auth_id", user.id);

    setLoading(false);

    if (updateError) {
      setError("Failed to set username. Please try again.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-green rounded-2xl mb-4">
            <ZapIcon size={24} className="text-white" />
          </div>
          <h1 className="text-display-sm font-bold text-white font-display">
            Choose your username
          </h1>
          <p className="text-body-xs text-white/40 mt-1">
            This becomes your permanent public identity
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 space-y-4">
          {/* URL Preview */}
          <div className="px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <p className="text-body-xs text-neutral-400">
              turfog.com/<span className="text-neutral-900 font-semibold">{username || "username"}</span>
            </p>
          </div>

          <div className="relative">
            <Input
              label="Username"
              value={username}
              onChange={validate}
              placeholder="e.g. rahul_sharma"
              icon={<UserIcon size={18} />}
            />
            {/* Status Icon */}
            <div className="absolute right-3.5 top-[38px]">
              {status === "checking" && (
                <svg className="animate-spin h-4 w-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {status === "available" && <CheckCircleIcon size={18} className="text-emerald" />}
              {(status === "taken" || status === "invalid") && <XIcon size={18} className="text-coral" />}
            </div>
          </div>

          {/* Rules */}
          <div className="space-y-1">
            {[
              { label: "3-20 characters", pass: username.length >= 3 && username.length <= 20 },
              { label: "Lowercase letters, numbers, underscores", pass: /^[a-z0-9_]*$/.test(username) },
              { label: "Not reserved", pass: username.length > 0 && !RESERVED.includes(username) },
              { label: "Available", pass: status === "available" },
            ].map((rule) => (
              <div key={rule.label} className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${rule.pass ? "bg-emerald" : "bg-neutral-200"}`} />
                <span className={`text-caption ${rule.pass ? "text-emerald" : "text-neutral-400"}`}>
                  {rule.label}
                </span>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-body-xs text-coral bg-coral/5 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            fullWidth
            loading={loading}
            disabled={status !== "available"}
            onClick={handleSubmit}
          >
            Claim username
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
