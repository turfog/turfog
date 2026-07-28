"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ----- Types -----

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "premium";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  leftIcon?: React.ReactNode;
  className?: string;
  animated?: boolean;
}

// ----- Variant Styles -----

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-neutral-100 text-neutral-700 border-neutral-200",
  success: "bg-emerald/10 text-emerald border-emerald/20",
  warning: "bg-amber/10 text-amber border-amber/20",
  danger: "bg-coral/10 text-coral border-coral/20",
  info: "bg-electric-blue/10 text-electric-blue border-electric-blue/20",
  premium: "bg-gradient-to-r from-amber/10 to-sunset-orange/10 text-sunset-orange border-sunset-orange/20",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-caption rounded-md gap-1",
  md: "px-2.5 py-1 text-body-xs rounded-lg gap-1.5",
  lg: "px-3 py-1.5 text-body-sm rounded-lg gap-1.5",
};

// ----- Component -----

export default function Badge({
  children,
  variant = "default",
  size = "md",
  leftIcon,
  className,
  animated = true,
}: BadgeProps) {
  const Component = animated ? motion.span : "span";

  const motionProps = animated
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { type: "spring", stiffness: 500, damping: 30 },
      }
    : {};

  return (
    <Component
      className={cn(
        "inline-flex items-center font-medium border transition-colors duration-200",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...motionProps}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
    </Component>
  );
}