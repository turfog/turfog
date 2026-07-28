"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

// ----- Types -----

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: AvatarSize;
  isOnline?: boolean;
  className?: string;
  onClick?: () => void;
}

// ----- Size Styles -----

const sizeStyles: Record<AvatarSize, { container: string; font: string; dot: string }> = {
  xs: { container: "w-6 h-6", font: "text-caption", dot: "w-1.5 h-1.5" },
  sm: { container: "w-8 h-8", font: "text-body-xs", dot: "w-2 h-2" },
  md: { container: "w-10 h-10", font: "text-body-sm", dot: "w-2.5 h-2.5" },
  lg: { container: "w-12 h-12", font: "text-body-md", dot: "w-3 h-3" },
  xl: { container: "w-16 h-16", font: "text-body-xl", dot: "w-3 h-3" },
  "2xl": { container: "w-20 h-20", font: "text-display-xs", dot: "w-3.5 h-3.5" },
};

// ----- Component -----

export default function Avatar({
  src,
  alt,
  size = "md",
  isOnline = false,
  className,
  onClick,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const styles = sizeStyles[size];

  const showImage = src && !hasError;
  const initials = getInitials(alt);

  const containerClasses = cn(
    "relative rounded-full overflow-hidden",
    "bg-neutral-200 flex items-center justify-center",
    "border-2 border-white shadow-sm",
    onClick && "cursor-pointer hover:shadow-md transition-shadow",
    styles.container,
    className
  );

  const imageContent = showImage ? (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes={`${parseInt(styles.container.split("-")[1]) * 4}px`}
      onError={() => setHasError(true)}
      priority={size === "xl" || size === "2xl"}
    />
  ) : (
    <span
      className={cn(
        "font-semibold text-neutral-500 select-none",
        styles.font
      )}
    >
      {initials}
    </span>
  );

  return (
    <div className="relative inline-flex flex-shrink-0">
      {onClick ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          type="button"
          className={containerClasses}
          aria-label={alt}
        >
          {imageContent}
        </motion.button>
      ) : (
        <div className={containerClasses} aria-label={alt}>
          {imageContent}
        </div>
      )}

      {/* Online Indicator */}
      {isOnline && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full bg-emerald border-2 border-white",
            styles.dot
          )}
          aria-label="Online"
        />
      )}
    </div>
  );
}