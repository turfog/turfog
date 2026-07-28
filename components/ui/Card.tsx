"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// ----- Types -----

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  className?: string;
}

// ----- Padding Styles -----

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

// ----- Component -----

export default function Card({
  children,
  padding = "md",
  hover = true,
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={hover ? { y: -2 } : undefined}
      className={cn(
        "card-base",
        paddingStyles[padding],
        hover && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}