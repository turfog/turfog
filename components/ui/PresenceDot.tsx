import { cn } from "@/lib/utils";
import { getPresence } from "@/lib/presence";

type PresenceDotSize = "xs" | "sm" | "md" | "lg";

interface PresenceDotProps {
  presence: string | null | undefined;
  size?: PresenceDotSize;
  ping?: boolean;
  className?: string;
}

const SIZE: Record<PresenceDotSize, string> = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

export default function PresenceDot({ presence, size = "sm", ping, className }: PresenceDotProps) {
  const cfg = getPresence(presence);
  const showPing = ping ?? cfg.live;

  return (
    <span
      className={cn("relative inline-flex flex-shrink-0", SIZE[size], className)}
      title={cfg.label}
      aria-label={cfg.label}
    >
      {showPing && (
        <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping", cfg.dot)} />
      )}
      <span className={cn("relative inline-flex h-full w-full rounded-full", cfg.dot)} />
    </span>
  );
}