"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { MailIcon, ArrowLeftIcon, ZapIcon, CheckCircleIcon } from "@/components/SvgIcons";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-white rounded-3xl p-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald/10 rounded-2xl mb-4">
            <CheckCircleIcon size={28} className="text-emerald" />
          </div>
          <h1 className="text-display-xs font-bold text-neutral-900 font-display mb-2">
            Check your email
          </h1>
          <p className="text-body-sm text-neutral-500 mb-6">
            We sent a password reset link to{" "}
            <span className="font-semibold text-neutral-700">{email}</span>.
            Click the link to set a new password.
          </p>
          <Link href="/auth/sign-in">
            <Button variant="outline" fullWidth>
              Back to sign in
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <span className="inline-flex items-center justify-center w-12 h-12 bg-primary-green rounded-2xl mb-4">
              <ZapIcon size={24} className="text-white" />
            </span>
          </Link>
          <h1 className="text-display-sm font-bold text-white font-display">
            Reset password
          </h1>
          <p className="text-body-xs text-white/40 mt-1">
            Enter your email and we will send you a reset link
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            icon={<MailIcon size={18} />}
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

          <Button fullWidth loading={loading} onClick={handleReset}>
            Send reset link
          </Button>

          <Link
            href="/auth/sign-in"
            className="flex items-center justify-center gap-1.5 text-body-xs text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <ArrowLeftIcon size={14} />
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
