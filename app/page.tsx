"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { signInSchema, signUpSchema, type SignInInput, type SignUpInput } from "@/lib/validators";
import { ROUTES } from "@/lib/constants";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  GoogleIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ProfileIcon,
} from "@/components/SvgIcons";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const gradientStyle = {
  background: "linear-gradient(135deg, #3F9142 0%, #FF9900 35%, #0078D4 70%, #3F9142 100%)",
  backgroundSize: "400% 400%",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AuthLandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || ROUTES.DASHBOARD;

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  const [signInData, setSignInData] = useState<SignInInput>({ email: "", password: "" });
  const [signInErrors, setSignInErrors] = useState<Partial<SignInInput>>({});
  const [signInServerError, setSignInServerError] = useState<string | null>(null);
  const [signInLoading, setSignInLoading] = useState(false);

  const [signUpData, setSignUpData] = useState<SignUpInput>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signUpErrors, setSignUpErrors] = useState<Partial<Record<keyof SignUpInput, string>>>({});
  const [signUpServerError, setSignUpServerError] = useState<string | null>(null);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const supabase = getSupabaseBrowserClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInServerError(null);
    const result = signInSchema.safeParse(signInData);
    if (!result.success) {
      const errors: Partial<SignInInput> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignInInput;
        errors[field] = err.message;
      });
      setSignInErrors(errors);
      return;
    }
    setSignInLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setSignInServerError("Invalid email or password.");
        } else if (error.message.includes("Email not confirmed")) {
          setSignInServerError("Please verify your email first.");
        } else {
          setSignInServerError(error.message);
        }
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setSignInServerError("Something went wrong. Please try again.");
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpServerError(null);
    const result = signUpSchema.safeParse(signUpData);
    if (!result.success) {
      const errors: Partial<Record<keyof SignUpInput, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignUpInput;
        errors[field] = err.message;
      });
      setSignUpErrors(errors);
      return;
    }
    setSignUpLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: { full_name: signUpData.fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
        },
      });
      if (error) {
        if (error.message.includes("already registered")) {
          setSignUpServerError("An account with this email already exists.");
        } else {
          setSignUpServerError(error.message);
        }
        return;
      }
      setSignUpSuccess(true);
    } catch {
      setSignUpServerError("Something went wrong. Please try again.");
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
      },
    });
    if (error) {
      if (activeTab === "signin") setSignInServerError(error.message);
      else setSignUpServerError(error.message);
    }
  };

  if (signUpSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={gradientStyle}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mx-4 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center"
        >
          <CheckCircleIcon size={48} className="text-emerald mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-600 mb-6">
            We sent a verification link to <strong>{signUpData.email}</strong>.
          </p>
          <Button onClick={() => { setSignUpSuccess(false); setActiveTab("signin"); }} theme="green" size="lg" fullWidth>
            Back to sign in
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={gradientStyle}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        className="relative w-full max-w-md mx-4 bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8"
      >
        {/* Logo */}
        <motion.div variants={fadeUp} className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg mb-4 p-2">
            <Image
              src="/images/logo.png"
              alt="Turfog"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-display text-3xl font-bold text-white drop-shadow-lg">Turfog</h1>
          <p className="text-white/70 text-sm mt-1">Never cancel a match again</p>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={fadeUp} className="flex bg-white/10 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("signin")}
            className={cn(
              "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300",
              activeTab === "signin" ? "bg-white/20 text-white shadow" : "text-white/60 hover:text-white/80"
            )}
          >
            Sign in
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={cn(
              "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300",
              activeTab === "signup" ? "bg-white/20 text-white shadow" : "text-white/60 hover:text-white/80"
            )}
          >
            Sign up
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "signin" ? (
            <motion.form
              key="signin"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSignIn}
              className="space-y-4"
            >
              {signInServerError && (
                <div className="flex items-center gap-2 bg-red-500/20 text-white p-3 rounded-xl text-sm">
                  <AlertCircleIcon size={18} />
                  {signInServerError}
                </div>
              )}
              <Input
                type="email"
                placeholder="Email address"
                value={signInData.email}
                onChange={(e) => { setSignInData(p => ({...p, email: e.target.value})); setSignInErrors(p => ({...p, email: undefined})); }}
                error={signInErrors.email}
                leftIcon={<MailIcon size={18} />}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={signInData.password}
                onChange={(e) => { setSignInData(p => ({...p, password: e.target.value})); setSignInErrors(p => ({...p, password: undefined})); }}
                error={signInErrors.password}
                leftIcon={<LockIcon size={18} />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-white/60 hover:text-white">
                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                }
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <div className="flex justify-end">
                <Link href={ROUTES.FORGOT_PASSWORD} className="text-white/70 text-sm hover:text-white">Forgot password?</Link>
              </div>
              <Button type="submit" theme="green" size="lg" fullWidth isLoading={signInLoading}>
                Sign in
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20" /></div>
                <div className="relative flex justify-center text-xs"><span className="px-2 text-white/50 bg-transparent">or</span></div>
              </div>
              <Button
                type="button"
                variant="outline"
                theme="neutral"
                size="lg"
                fullWidth
                leftIcon={<GoogleIcon size={20} />}
                onClick={handleGoogleAuth}
              >
                Continue with Google
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSignUp}
              className="space-y-4"
            >
              {signUpServerError && (
                <div className="flex items-center gap-2 bg-red-500/20 text-white p-3 rounded-xl text-sm">
                  <AlertCircleIcon size={18} />
                  {signUpServerError}
                </div>
              )}
              <Input
                type="text"
                placeholder="Full name"
                value={signUpData.fullName}
                onChange={(e) => { setSignUpData(p => ({...p, fullName: e.target.value})); setSignUpErrors(p => ({...p, fullName: undefined})); }}
                error={signUpErrors.fullName}
                leftIcon={<ProfileIcon size={18} />}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Input
                type="email"
                placeholder="Email address"
                value={signUpData.email}
                onChange={(e) => { setSignUpData(p => ({...p, email: e.target.value})); setSignUpErrors(p => ({...p, email: undefined})); }}
                error={signUpErrors.email}
                leftIcon={<MailIcon size={18} />}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={signUpData.password}
                onChange={(e) => { setSignUpData(p => ({...p, password: e.target.value})); setSignUpErrors(p => ({...p, password: undefined})); }}
                error={signUpErrors.password}
                leftIcon={<LockIcon size={18} />}
                hint="Min. 8 chars, upper, lower, number"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={signUpData.confirmPassword}
                onChange={(e) => { setSignUpData(p => ({...p, confirmPassword: e.target.value})); setSignUpErrors(p => ({...p, confirmPassword: undefined})); }}
                error={signUpErrors.confirmPassword}
                leftIcon={<LockIcon size={18} />}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <p className="text-white/50 text-xs">
                By signing up, you agree to our <Link href="#" className="underline">Terms</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
              </p>
              <Button type="submit" theme="orange" size="lg" fullWidth isLoading={signUpLoading}>
                Create account
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20" /></div>
                <div className="relative flex justify-center text-xs"><span className="px-2 text-white/50 bg-transparent">or</span></div>
              </div>
              <Button
                type="button"
                variant="outline"
                theme="neutral"
                size="lg"
                fullWidth
                leftIcon={<GoogleIcon size={20} />}
                onClick={handleGoogleAuth}
              >
                Continue with Google
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}