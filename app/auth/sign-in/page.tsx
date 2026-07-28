"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { signInSchema, type SignInInput } from "@/lib/validators";
import { ROUTES } from "@/lib/constants";
import { MailIcon, LockIcon, GoogleIcon, FacebookIcon, AlertCircleIcon } from "@/components/SvgIcons";
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

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || ROUTES.DASHBOARD;

  const [formData, setFormData] = useState<SignInInput>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<SignInInput>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = getSupabaseBrowserClient();

  const handleChange = (field: keyof SignInInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate with Zod
    const result = signInSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<SignInInput> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignInInput;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setServerError("Invalid email or password. Please try again.");
        } else if (error.message.includes("Email not confirmed")) {
          setServerError("Please verify your email address before signing in.");
        } else {
          setServerError(error.message);
        }
        return;
      }

      // Successful sign in - redirect
      router.push(redirectTo);
      router.refresh();
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setServerError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setServerError(error.message);
      }
    } catch {
      setServerError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
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
      setServerError("Failed to sign in with Facebook. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            Welcome back
          </h1>
          <p className="text-body-md text-neutral-500">
            Sign in to never cancel a match again
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
                <AlertCircleIcon size={18} className="text-coral flex-shrink-0 mt-0.5" />
                <p className="text-body-sm text-coral">{serverError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={errors.password}
              leftIcon={<LockIcon size={18} />}
              showPasswordToggle
              required
              autoComplete="current-password"
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href={ROUTES.FORGOT_PASSWORD}
                className="text-body-sm text-electric-blue hover:text-electric-blue-hover transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              theme="green"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Sign in
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
              onClick={handleGoogleSignIn}
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
              onClick={handleFacebookSignIn}
              disabled={isLoading}
            >
              Facebook
            </Button>
          </div>
        </motion.div>

        {/* Sign Up Link */}
        <motion.p
          variants={itemVariants}
          className="text-center mt-6 text-body-sm text-neutral-500"
        >
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.SIGN_UP}
            className="text-electric-blue hover:text-electric-blue-hover font-semibold transition-colors"
          >
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}