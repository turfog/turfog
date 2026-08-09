import React from "react";
import { cn } from "@/lib/utils";

type CardPadding = "sm" | "md" | "lg" | "none";

interface CardProps {
  children: React.ReactNode;
  padding?: CardPadding;
  className?: string;
  onClick?: () => void;
}

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export default function Card({
  children,
  padding = "md",
  className = "",
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border border-neutral-200/80 shadow-card transition-all duration-200 ease-out",
        onClick &&
          "cursor-pointer hover:shadow-card-hover hover:border-neutral-300/70 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]",
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}