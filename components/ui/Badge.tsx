"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "premium";

type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  animated?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-neutral-100 text-neutral-600",
  success: "bg-emerald/10 text-emerald",
  warning: "bg-amber/10 text-amber",
  danger: "bg-coral/10 text-coral",
  info: "bg-electric-blue/10 text-electric-blue",
  premium: "bg-gradient-to-r from-amber/15 to-sunset-orange/15 text-sunset-orange",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-caption rounded-md",
  md: "px-3 py-1 text-body-xs rounded-lg",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  animated = false,
  className = "",
}: BadgeProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center font-semibold whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );

  if (animated) {
    return (
      <motion.span
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {content}
      </motion.span>
    );
  }

  return content;
}
