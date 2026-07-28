"use client";

import React, { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon, AlertCircleIcon, CheckCircleIcon, XCircleIcon } from "@/components/SvgIcons";

// ----- Types -----

type InputVariant = "default" | "filled";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  success?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: InputVariant;
  showPasswordToggle?: boolean;
  isLoading?: boolean;
  containerClassName?: string;
}

// ----- Component -----

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      success,
      leftIcon,
      rightIcon,
      variant = "default",
      showPasswordToggle = false,
      isLoading = false,
      className,
      containerClassName,
      type = "text",
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const hasError = !!error;
    const hasSuccess = !!success;

    // Variant styles
    const variantStyles: Record<InputVariant, string> = {
      default: cn(
        "bg-white border border-neutral-300 rounded-lg",
        "focus-within:border-electric-blue focus-within:ring-2 focus-within:ring-electric-blue/20",
        hasError && "border-coral focus-within:border-coral focus-within:ring-coral/20",
        hasSuccess && "border-emerald focus-within:border-emerald focus-within:ring-emerald/20",
        disabled && "bg-neutral-50 opacity-60 cursor-not-allowed"
      ),
      filled: cn(
        "bg-neutral-100 border border-transparent rounded-lg",
        "focus-within:bg-white focus-within:border-electric-blue focus-within:ring-2 focus-within:ring-electric-blue/20",
        hasError && "bg-coral/5 border-coral focus-within:border-coral",
        hasSuccess && "bg-emerald/5 border-emerald focus-within:border-emerald",
        disabled && "opacity-60 cursor-not-allowed"
      ),
    };

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-body-sm font-medium text-neutral-700 select-none"
          >
            {label}
            {required && <span className="text-coral ml-0.5">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className={cn("relative flex items-center transition-all duration-200", variantStyles[variant])}>
          {/* Left Icon */}
          {leftIcon && (
            <span className="flex-shrink-0 ml-3 text-neutral-400">
              {leftIcon}
            </span>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            required={required}
            className={cn(
              "w-full bg-transparent px-3 py-2.5 text-body-md text-neutral-900 placeholder:text-neutral-400",
              "focus:outline-none",
              "disabled:cursor-not-allowed",
              leftIcon && "pl-2",
              (rightIcon || showPasswordToggle || hasError || hasSuccess || isLoading) && "pr-10",
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${inputId}-error`
                : success
                ? `${inputId}-success`
                : hint
                ? `${inputId}-hint`
                : undefined
            }
            {...props}
          />

          {/* Right Section */}
          <div className="absolute right-3 flex items-center gap-1">
            {/* Password Toggle */}
            {isPassword && showPasswordToggle && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors p-0.5"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </motion.button>
            )}

            {/* Loading Spinner */}
            {isLoading && (
              <svg
                className="animate-spin text-neutral-400"
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}

            {/* Error Icon */}
            {hasError && !isLoading && (
              <AlertCircleIcon size={18} className="text-coral" />
            )}

            {/* Success Icon */}
            {hasSuccess && !isLoading && (
              <CheckCircleIcon size={18} className="text-emerald" />
            )}

            {/* Custom Right Icon */}
            {rightIcon && !hasError && !hasSuccess && !isLoading && (
              <span className="text-neutral-400">{rightIcon}</span>
            )}
          </div>
        </div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              id={`${inputId}-error`}
              className="text-body-xs text-coral flex items-center gap-1"
              role="alert"
            >
              <XCircleIcon size={14} />
              {error}
            </motion.p>
          )}

          {success && !error && (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              id={`${inputId}-success`}
              className="text-body-xs text-emerald flex items-center gap-1"
            >
              <CheckCircleIcon size={14} />
              {success}
            </motion.p>
          )}

          {hint && !error && !success && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              id={`${inputId}-hint`}
              className="text-body-xs text-neutral-500"
            >
              {hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;