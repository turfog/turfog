"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { signUpSchema, type SignUpInput } from "@/lib/validators";
import { ROUTES } from "@/lib/constants";
import {
  MailIcon,
  LockIcon,
  GoogleIcon,
  FacebookIcon,
  AlertCircleIcon,
  ProfileIcon,
} from "@/components/SvgIcons";
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

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || ROUTES.DASHBOARD;

  const [formData, setFormData] = useState<SignUpInput>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpInput, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = getSupabaseBrowserClient();

  const handleChange = (field: keyof SignUpInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate with Zod
    const result = signUpSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignUpInput, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignUpInput;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setServerError(
            "An account with this email already exists. Please sign in instead."
          );
        } else {
          setServerError(error.message);
        }
        return;
      }

      // Show success message
      setIsSuccess(true);
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setServerError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
        },
      });

      if (error) {
        setServerError(error.message);
      }
    } catch {
      setServerError("Failed to sign up with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    setIsLoading(true);
    setServerError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
        },
      });

      if (error) {
        setServerError(error.message);
      }
    } catch {
      setServerError("Failed to sign up with Facebook. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success State - Email Verification Sent
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
              <MailIcon size={32} className="text-emerald" />
            </div>
            <h2 className="text-display-xs text-neutral-900 mb-2">
              Check your email
            </h2>
            <p className="text-body-md text-neutral-500 mb-6">
              We&apos;ve sent a verification link to{" "}
              <span className="font-semibold text-neutral-700">
                {formData.email}
              </span>
              . Please verify your email to continue.
            </p>
            <Button
              theme="green"
              size="lg"
              fullWidth
              onClick={() => router.push(ROUTES.SIGN_IN)}
            >
              Return to sign in
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
            Create your account
          </h1>
          <p className="text-body-md text-neutral-500">
            Start playing, never cancel a match
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-6 md:p-8"
        >
          {/* Server Error */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full name"
              type="text"
              placeholder="Virat Kohli"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              error={errors.fullName}
              leftIcon={<ProfileIcon size={18} />}
              required
              autoComplete="name"
              autoFocus
            />

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
              leftIcon={<MailIcon size={18} />}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={errors.password}
              leftIcon={<LockIcon size={18} />}
              showPasswordToggle
              hint="At least 8 characters with uppercase, lowercase, and number"
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirm password"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
              leftIcon={<LockIcon size={18} />}
              showPasswordToggle
              required
              autoComplete="new-password"
            />

            {/* Terms */}
            <p className="text-body-xs text-neutral-500">
              By creating an account, you agree to Turfog&apos;s{" "}
              <Link
                href="#"
                className="text-electric-blue hover:underline"
              >
                Terms of service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="text-electric-blue hover:underline"
              >
                Privacy policy
              </Link>
              .
            </p>

            {/* Submit Button */}
            <Button
              type="submit"
              theme="green"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Create account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-body-xs">
              <span className="bg-white px-3 text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Auth Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              theme="neutral"
              size="lg"
              fullWidth
              leftIcon={<GoogleIcon size={20} />}
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              theme="neutral"
              size="lg"
              fullWidth
              leftIcon={<FacebookIcon size={20} />}
              onClick={handleFacebookSignUp}
              disabled={isLoading}
            >
              Facebook
            </Button>
          </div>
        </motion.div>

        {/* Sign In Link */}
        <motion.p
          variants={itemVariants}
          className="text-center mt-6 text-body-sm text-neutral-500"
        >
          Already have an account?{" "}
          <Link
            href={ROUTES.SIGN_IN}
            className="text-electric-blue hover:text-electric-blue-hover font-semibold transition-colors"
          >
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}