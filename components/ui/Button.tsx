"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// ----- Types -----

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";
type ButtonTheme = "green" | "blue" | "orange" | "neutral";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  theme?: ButtonTheme;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  href?: string;
}

// ----- Variant Styles -----

const variantStyles: Record<ButtonVariant, Record<ButtonTheme, string>> = {
  primary: {
    green:
      "bg-primary-green text-white hover:bg-primary-green-hover shadow-sm hover:shadow-md",
    blue: "bg-electric-blue text-white hover:bg-electric-blue-hover shadow-sm hover:shadow-md",
    orange:
      "bg-sunset-orange text-white hover:bg-sunset-orange-hover shadow-sm hover:shadow-md",
    neutral:
      "bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm hover:shadow-md",
  },
  secondary: {
    green:
      "bg-primary-green/10 text-primary-green hover:bg-primary-green/20",
    blue: "bg-electric-blue/10 text-electric-blue hover:bg-electric-blue/20",
    orange:
      "bg-sunset-orange/10 text-sunset-orange hover:bg-sunset-orange/20",
    neutral:
      "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
  },
  outline: {
    green:
      "border-2 border-primary-green text-primary-green hover:bg-primary-green/5",
    blue: "border-2 border-electric-blue text-electric-blue hover:bg-electric-blue/5",
    orange:
      "border-2 border-sunset-orange text-sunset-orange hover:bg-sunset-orange/5",
    neutral:
      "border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400",
  },
  ghost: {
    green: "text-primary-green hover:bg-primary-green/5",
    blue: "text-electric-blue hover:bg-electric-blue/5",
    orange: "text-sunset-orange hover:bg-sunset-orange/5",
    neutral: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
  },
  danger: {
    green: "bg-coral text-white hover:bg-coral/90 shadow-sm",
    blue: "bg-coral text-white hover:bg-coral/90 shadow-sm",
    orange: "bg-coral text-white hover:bg-coral/90 shadow-sm",
    neutral: "bg-coral text-white hover:bg-coral/90 shadow-sm",
  },
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-button-sm rounded-md gap-1.5",
  md: "px-5 py-2.5 text-button-md rounded-lg gap-2",
  lg: "px-7 py-3.5 text-button-lg rounded-xl gap-2.5",
};

// ----- Component -----

export default function Button({
  children,
  variant = "primary",
  size = "md",
  theme = "green",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-blue disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variantStyle = variantStyles[variant][theme];
  const sizeStyle = sizeStyles[size];
  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(baseStyles, variantStyle, sizeStyle, widthStyle, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner size={size} />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </motion.button>
  );
}

// ----- Loading Spinner -----

function LoadingSpinner({ size }: { size: ButtonSize }) {
  const spinnerSize = size === "sm" ? 16 : size === "md" ? 20 : 24;

  return (
    <svg
      className="animate-spin flex-shrink-0"
      width={spinnerSize}
      height={spinnerSize}
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
  );
}