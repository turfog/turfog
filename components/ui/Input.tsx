"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "@/components/SvgIcons";

interface InputProps {
  label?: string;
  srOnlyLabel?: boolean;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function Input({
  label,
  srOnlyLabel = false,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error,
  icon,
  disabled = false,
  className = "",
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label
          className={cn(
            "block text-body-sm font-medium text-neutral-700",
            srOnlyLabel && "sr-only"
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </span>
        )}
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-white text-body-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 outline-none",
            "focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20",
            icon && "pl-11",
            isPassword && "pr-11",
            error
              ? "border-coral focus:border-coral focus:ring-coral/20"
              : "border-neutral-300 hover:border-neutral-400",
            disabled && "opacity-50 cursor-not-allowed bg-neutral-50"
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-body-xs text-coral">{error}</p>}
    </div>
  );
}
