import React from "react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { getPresence } from "@/lib/presence";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: AvatarSize;
  online?: boolean;
  presence?: string;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "w-7 h-7 text-caption",
  sm: "w-9 h-9 text-body-xs",
  md: "w-11 h-11 text-body-sm",
  lg: "w-14 h-14 text-body-md",
  xl: "w-20 h-20 text-display-xs",
};

const dotStyles: Record<AvatarSize, string> = {
  xs: "w-2 h-2",
  sm: "w-2.5 h-2.5",
  md: "w-3 h-3",
  lg: "w-3.5 h-3.5",
  xl: "w-4 h-4",
};

export default function Avatar({
  src,
  alt,
  size = "md",
  online,
  presence,
  className = "",
}: AvatarProps) {
  const presenceCfg = presence !== undefined ? getPresence(presence) : null;
  const showOnlineDot = !presenceCfg && online !== undefined;

  return (
    <div className={cn("relative inline-flex flex-shrink-0", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            "rounded-full object-cover border border-neutral-200",
            sizeStyles[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-full bg-gradient-to-br from-electric-blue to-primary-green flex items-center justify-center text-white font-semibold",
            sizeStyles[size]
          )}
        >
          {getInitials(alt)}
        </div>
      )}

      {presenceCfg && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white",
            dotStyles[size]
          )}
          title={presenceCfg.label}
        >
          {presenceCfg.live && (
            <span
              className={cn(
                "absolute inset-0 rounded-full opacity-60 animate-ping",
                presenceCfg.dot
              )}
            />
          )}
          <span className={cn("absolute inset-0 rounded-full", presenceCfg.dot)} />
        </span>
      )}

      {showOnlineDot && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white",
            dotStyles[size],
            online ? "bg-emerald" : "bg-neutral-300"
          )}
        />
      )}
    </div>
  );
}