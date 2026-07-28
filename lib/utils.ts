import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 * Ensures Tailwind classes are properly merged without conflicts
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date relative to now (e.g., "2 hours ago", "just now")
 */
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = typeof date === "string" ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Generates initials from a full name (max 2 characters)
 */
export function getInitials(fullName: string): string {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return (parts[0]?.[0] || "").toUpperCase();
  return ((parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "")).toUpperCase();
}

/**
 * Returns a human-readable location string from coordinates
 * Falls back to city name if available
 */
export function formatLocation(city?: string | null, latitude?: number | null, longitude?: number | null): string {
  if (city) return city;
  if (latitude && longitude) {
    return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  }
  return "Location unknown";
}

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Formats XP points with k/m suffix for display
 */
export function formatXP(xp: number): string {
  if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)}m`;
  if (xp >= 1_000) return `${(xp / 1_000).toFixed(1)}k`;
  return xp.toString();
}

/**
 * Returns the level title based on level number
 */
export function getLevelTitle(level: number): string {
  if (level >= 50) return "Legend";
  if (level >= 40) return "Elite";
  if (level >= 30) return "Veteran";
  if (level >= 20) return "Pro";
  if (level >= 10) return "Amateur";
  return "Rookie";
}

/**
 * Generates a random ID (client-side only, not for database use)
 */
export function generateTempId(): string {
  return `temp_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}