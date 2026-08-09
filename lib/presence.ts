export type PresenceStatus =
  | "available-now"
  | "in-30-min"
  | "today"
  | "tonight"
  | "weekend"
  | "offline";

export interface PresenceConfig {
  label: string;
  dot: string;    // tailwind bg class for the dot
  text: string;   // tailwind text color class
  badge: string;  // tailwind classes for a pill/badge
  live: boolean;  // animate a ping (only true for available-now)
}

const PRESENCE_MAP: Record<string, PresenceConfig> = {
  "available-now": {
    label: "Available now",
    dot: "bg-emerald",
    text: "text-emerald",
    badge: "bg-emerald/10 text-emerald",
    live: true,
  },
  "in-30-min": {
    label: "In 30 min",
    dot: "bg-amber",
    text: "text-amber",
    badge: "bg-amber/10 text-amber",
    live: false,
  },
  today: {
    label: "Today",
    dot: "bg-electric-blue",
    text: "text-electric-blue",
    badge: "bg-electric-blue/10 text-electric-blue",
    live: false,
  },
  tonight: {
    label: "Tonight",
    dot: "bg-purple-500",
    text: "text-purple-500",
    badge: "bg-purple-500/10 text-purple-500",
    live: false,
  },
  weekend: {
    label: "Weekend",
    dot: "bg-sunset-orange",
    text: "text-sunset-orange",
    badge: "bg-sunset-orange/10 text-sunset-orange",
    live: false,
  },
};

const OFFLINE: PresenceConfig = {
  label: "Offline",
  dot: "bg-neutral-300",
  text: "text-neutral-400",
  badge: "bg-neutral-100 text-neutral-500",
  live: false,
};

export function getPresence(presence: string | null | undefined): PresenceConfig {
  if (!presence) return OFFLINE;
  return PRESENCE_MAP[presence] ?? OFFLINE;
}

export function isLive(presence: string | null | undefined): boolean {
  return getPresence(presence).live;
}