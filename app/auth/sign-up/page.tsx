"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { MailIcon, LockIcon, UserIcon, ZapIcon } from "@/components/SvgIcons";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async () => {
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setSuccess(true);
  };

  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl border border-neutral-200 shadow-card p-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald/10 rounded-2xl mb-4">
            <MailIcon size={28} className="text-emerald" />
          </div>
          <h1 className="text-display-sm font-bold text-neutral-900 font-display mb-2">
            Check your email
          </h1>
          <p className="text-body-sm text-neutral-500 mb-6">
            We sent a verification link to{" "}
            <span className="font-semibold text-neutral-700">{email}</span>.
            Click the link to activate your account.
          </p>
          <Button variant="outline" fullWidth onClick={() => router.push("/auth/sign-in")}>
            Back to sign in
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-green rounded-2xl mb-4">
            <ZapIcon size={28} className="text-white" />
          </div>
          <h1 className="text-display-md font-bold text-neutral-900 font-display">
            Join Turfog
          </h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Never cancel a match again
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-card p-6 space-y-4">
          <Input
            label="Full name"
            value={fullName}
            onChange={setFullName}
            placeholder="Your full name"
            icon={<UserIcon size={18} />}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            icon={<MailIcon size={18} />}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Minimum 6 characters"
            icon={<LockIcon size={18} />}
          />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-body-xs text-coral bg-coral/5 rounded-lg px-3 py-2"
            >
              {error}
            </motion.p>
          )}

          <Button fullWidth loading={loading} onClick={handleSignUp}>
            Create account
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-caption text-neutral-400">or</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          <Button variant="outline" fullWidth onClick={handleGoogleSignUp}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-body-sm text-neutral-500">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-electric-blue font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
