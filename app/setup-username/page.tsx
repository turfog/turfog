"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { usernameSchema, type UsernameInput } from "@/lib/validators";
import { ROUTES, API_ROUTES } from "@/lib/constants";
import { CheckCircleIcon, XCircleIcon, AlertCircleIcon, ProfileIcon } from "@/components/SvgIcons";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useDebounce } from "@/hooks/useDebounce";

// ----- Animation Variants -----
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

// ----- Component -----

export default function SetupUsernamePage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const debouncedUsername = useDebounce(username, 400);

  // Check username availability when debounced value changes
  const checkAvailability = useCallback(async (value: string) => {
    if (!value || value.length < 3) {
      setIsAvailable(null);
      setValidationError(null);
      return;
    }

    // Validate format first
    try {
      usernameSchema.parse({ username: value });
      setValidationError(null);
    } catch (err) {
      if (err && typeof err === "object" && "errors" in err) {
        const zodError = err as { errors: Array<{ message: string }> };
        setValidationError(zodError.errors[0]?.message || "Invalid username");
        setIsAvailable(false);
        setIsChecking(false);
        return;
      }
    }

    setIsChecking(true);

    try {
      const response = await fetch(
        `${API_ROUTES.CHECK_USERNAME}?username=${encodeURIComponent(value)}`
      );
      const data = await response.json();

      if (data.error) {
        setValidationError(data.error);
        setIsAvailable(false);
      } else {
        setIsAvailable(data.available);
        setValidationError(null);
      }
    } catch {
      setValidationError("Failed to check username. Please try again.");
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedUsername) {
      checkAvailability(debouncedUsername);
    } else {
      setIsAvailable(null);
      setValidationError(null);
    }
  }, [debouncedUsername, checkAvailability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setError(null);

    // Final validation
    try {
      usernameSchema.parse({ username });
    } catch (err) {
      if (err && typeof err === "object" && "errors" in err) {
        const zodError = err as { errors: Array<{ message: string }> };
        setError(zodError.errors[0]?.message || "Invalid username");
        return;
      }
    }

    if (!isAvailable) {
      setError("Please choose an available username");
      return;
    }

    setIsLoading(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(ROUTES.SIGN_IN);
        return;
      }

      // Update player profile with username
      const { error: updateError } = await supabase
        .from("players")
        .update({
          username: username.toLowerCase().trim(),
          username_set: true,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_id", user.id);

      if (updateError) {
        if (updateError.code === "23505") {
          setServerError("This username was just taken. Please try another.");
        } else {
          setServerError(updateError.message);
        }
        return;
      }

      // Success - redirect to dashboard
      router.push(ROUTES.DASHBOARD);
      router.refresh();
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
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
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="w-16 h-16 bg-electric-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ProfileIcon size={32} className="text-electric-blue" />
          </div>
          <h1 className="text-display-xs text-neutral-900 mb-2">
            Choose your username
          </h1>
          <p className="text-body-md text-neutral-500">
            This is how other players will find you on Turfog
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username Input */}
            <div>
              <Input
                label="Username"
                type="text"
                placeholder="yourname"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError(null);
                  if (serverError) setServerError(null);
                }}
                error={error || validationError || undefined}
                success={isAvailable && !validationError ? "Username is available" : undefined}
                leftIcon={
                  <span className="text-neutral-400 font-medium">@</span>
                }
                rightIcon={
                  isChecking ? null : isAvailable && !validationError ? (
                    <CheckCircleIcon size={18} className="text-emerald" />
                  ) : validationError || (debouncedUsername.length >= 3 && isAvailable === false) ? (
                    <XCircleIcon size={18} className="text-coral" />
                  ) : null
                }
                isLoading={isChecking}
                hint={
                  !debouncedUsername
                    ? "3-30 characters, letters, numbers, and underscores only"
                    : undefined
                }
                autoComplete="off"
                autoFocus
                spellCheck={false}
                required
              />
            </div>

            {/* Rules */}
            <div className="flex flex-col gap-2 p-3 bg-neutral-50 rounded-lg">
              <p className="text-body-xs font-medium text-neutral-600 mb-1">
                Your username must:
              </p>
              <RuleItem
                isValid={username.length >= 3}
                text="Be at least 3 characters long"
              />
              <RuleItem
                isValid={username.length <= 30}
                text="Be at most 30 characters"
              />
              <RuleItem
                isValid={/^[a-zA-Z]/.test(username)}
                text="Start with a letter"
              />
              <RuleItem
                isValid={/^[a-zA-Z0-9_]*$/.test(username)}
                text="Contain only letters, numbers, and underscores"
              />
            </div>

            <Button
              type="submit"
              theme="blue"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={!isAvailable || !!validationError}
            >
              Set username & continue
            </Button>
          </form>
        </motion.div>

        {/* Note */}
        <motion.p
          variants={itemVariants}
          className="text-center mt-6 text-body-xs text-neutral-400"
        >
          You can change your username later in your profile settings
        </motion.p>
      </motion.div>
    </div>
  );
}

// ----- Rule Item Sub-component -----

function RuleItem({ isValid, text }: { isValid: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {isValid ? (
        <CheckCircleIcon size={14} className="text-emerald flex-shrink-0" />
      ) : (
        <XCircleIcon size={14} className="text-neutral-300 flex-shrink-0" />
      )}
      <span
        className={`text-body-xs ${
          isValid ? "text-emerald" : "text-neutral-400"
        }`}
      >
        {text}
      </span>
    </div>
  );
}