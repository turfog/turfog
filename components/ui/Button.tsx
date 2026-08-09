"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-green text-white hover:bg-primary-green/90 shadow-sm hover:shadow-md",
  secondary:
    "bg-electric-blue text-white hover:bg-electric-blue-hover shadow-sm hover:shadow-md",
  outline:
    "border border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 bg-white",
  ghost: "text-neutral-600 hover:bg-neutral-100",
  danger: "bg-coral text-white hover:bg-coral/90 shadow-sm hover:shadow-md",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-body-xs rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-body-sm rounded-xl gap-2",
  lg: "px-7 py-3.5 text-body-md rounded-xl gap-2.5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all duration-200 select-none",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </motion.button>
  );
}