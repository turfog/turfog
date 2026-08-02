"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { MailIcon, LockIcon } from "@/components/SvgIcons";

export default function SignInForm() {
  const router = useRouter();
  const supabase = createClient();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEmail = identifier.includes("@");

  const handleSignIn = async () => {
    setError("");
    if (!identifier.trim() || !password) {
      setError("Enter your email or username and password");
      return;
    }
    setLoading(true);
    const email = isEmail
      ? identifier.trim()
      : `${identifier.trim().toLowerCase()}@turfog.username`;
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(isEmail ? signInError.message : "Invalid username or password");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="w-full max-w-[360px]">
      <h2 className="text-display-xs font-bold text-neutral-900 font-display mb-6">
        Log in to Turfog
      </h2>

      <div className="space-y-3">
        <Input
          srOnlyLabel
          label="Email or username"
          type="text"
          value={identifier}
          onChange={setIdentifier}
          placeholder="Email or username"
          icon={<MailIcon size={18} />}
        />
        <Input
          srOnlyLabel
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Password"
          icon={<LockIcon size={18} />}
        />

        {/* Remember me + Forgot */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <button
              type="button"
              aria-pressed={rememberMe}
              onClick={() => setRememberMe((v) => !v)}
              className={cn(
                "w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all",
                rememberMe
                  ? "bg-primary-green border-primary-green"
                  : "border-neutral-300 bg-white"
              )}
            >
              {rememberMe && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <span className="text-body-xs text-neutral-600">Remember me</span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-body-xs text-electric-blue font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-body-xs text-coral bg-coral/5 rounded-lg px-3 py-2"
          >
            {error}
          </motion.p>
        )}

        <Button fullWidth loading={loading} onClick={handleSignIn}>
          Log in
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="text-caption text-neutral-400">or</span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        <Button variant="outline" fullWidth onClick={handleGoogle}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </Button>

        <Button
          variant="outline"
          fullWidth
          onClick={() => router.push("/auth/sign-up")}
        >
          Create new account
        </Button>
      </div>
    </div>
  );
}
