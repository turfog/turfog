"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validators";
import { ROUTES } from "@/lib/constants";
import { LockIcon, AlertCircleIcon, CheckCircleIcon } from "@/components/SvgIcons";
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [formData, setFormData] = useState<ResetPasswordInput>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordInput, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null);

  // Check if user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setHasValidSession(!!data.session);
    };
    checkSession();
  }, [supabase]);

  const handleChange = (field: keyof ResetPasswordInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate
    const result = resetPasswordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ResetPasswordInput, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ResetPasswordInput;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        setServerError(error.message);
        return;
      }

      setIsSuccess(true);
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // No valid session (user didn't click email link)
  if (hasValidSession === false) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-8">
            <div className="w-16 h-16 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircleIcon size={32} className="text-amber" />
            </div>
            <h2 className="text-display-xs text-neutral-900 mb-2">
              Invalid or expired link
            </h2>
            <p className="text-body-md text-neutral-500 mb-6">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <Link href={ROUTES.FORGOT_PASSWORD}>
              <Button theme="green" size="lg" fullWidth>
                Request new link
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Loading check
  if (hasValidSession === null) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
              Password updated
            </h2>
            <p className="text-body-md text-neutral-500 mb-6">
              Your password has been successfully reset. You can now sign in
              with your new password.
            </p>
            <Button
              theme="green"
              size="lg"
              fullWidth
              onClick={() => router.push(ROUTES.SIGN_IN)}
            >
              Sign in
            </Button>
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
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-display-xs text-neutral-900 mb-2">
            Set new password
          </h1>
          <p className="text-body-md text-neutral-500">
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-6 md:p-8"
        >
          <AnimatePresence>
            {serverError && (
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
                <p className="text-body-sm text-coral">{serverError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="New password"
              type="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={errors.password}
              leftIcon={<LockIcon size={18} />}
              showPasswordToggle
              required
              autoComplete="new-password"
              autoFocus
            />

            <Input
              label="Confirm new password"
              type="password"
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
              leftIcon={<LockIcon size={18} />}
              showPasswordToggle
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              theme="green"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Reset password
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}