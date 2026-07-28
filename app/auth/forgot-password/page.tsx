"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validators";
import { ROUTES } from "@/lib/constants";
import { MailIcon, AlertCircleIcon, CheckCircleIcon, ChevronLeftIcon } from "@/components/SvgIcons";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// ----- Animation Variants -----
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

// ----- Component -----

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = getSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0]?.message || "Invalid email address");
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-8">
            <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon size={32} className="text-emerald" />
            </div>
            <h2 className="text-display-xs text-neutral-900 mb-2">
              Check your email
            </h2>
            <p className="text-body-md text-neutral-500 mb-6">
              If an account exists for{" "}
              <span className="font-semibold text-neutral-700">{email}</span>,
              we&apos;ve sent a password reset link.
            </p>
            <Button
              theme="green"
              size="lg"
              fullWidth
              onClick={() => {
                setIsSuccess(false);
                setEmail("");
              }}
            >
              Send again
            </Button>
            <Link
              href={ROUTES.SIGN_IN}
              className="inline-block mt-4 text-body-sm text-electric-blue hover:text-electric-blue-hover transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary-green rounded-xl flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="5" r="2" />
                <path d="M10 22l.5-5 1.5 2 1.5-3" />
              </svg>
            </div>
            <span className="font-display text-2xl font-bold text-neutral-900">
              Turfog
            </span>
          </Link>
          <h1 className="text-display-xs text-neutral-900 mb-2">
            Forgot password?
          </h1>
          <p className="text-body-md text-neutral-500">
            No worries, we&apos;ll send you reset instructions
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-6 md:p-8"
        >
          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-2 p-3 mb-6 bg-coral/10 border border-coral/20 rounded-lg"
                role="alert"
              >
                <AlertCircleIcon
                  size={18}
                  className="text-coral flex-shrink-0 mt-0.5"
                />
                <p className="text-body-sm text-coral">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              leftIcon={<MailIcon size={18} />}
              required
              autoComplete="email"
              autoFocus
            />

            <Button
              type="submit"
              theme="green"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Send reset link
            </Button>
          </form>
        </motion.div>

        {/* Back Link */}
        <motion.div variants={itemVariants} className="text-center mt-6">
          <Link
            href={ROUTES.SIGN_IN}
            className="inline-flex items-center gap-1 text-body-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <ChevronLeftIcon size={16} />
            Back to sign in
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}