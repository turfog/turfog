"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import type { Heartbeat, HeartbeatFormInput, HeartbeatType } from "@/types/heartbeat";
import { HEARTBEAT_DURATION_MINUTES } from "@/lib/constants";
import { generateTempId } from "@/lib/utils";

// ----- Types -----

interface HeartbeatContextValue {
  activeHeartbeat: Heartbeat | null;
  isSubmitting: boolean;
  submitHeartbeat: (input: HeartbeatFormInput) => Promise<void>;
  cancelHeartbeat: () => void;
  error: string | null;
}

// ----- Context -----
const HeartbeatContext = createContext<HeartbeatContextValue | undefined>(
  undefined
);

// ----- Provider -----
export function HeartbeatProvider({ children }: { children: React.ReactNode }) {
  const [activeHeartbeat, setActiveHeartbeat] = useState<Heartbeat | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitHeartbeat = useCallback(
    async (input: HeartbeatFormInput) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const now = new Date();
        const expiresAt = new Date(
          now.getTime() + HEARTBEAT_DURATION_MINUTES * 60 * 1000
        );

        // Create heartbeat based on type
        // In production, this would call an API and save to Supabase
        const tempId = generateTempId();

        if (input.type === "i-want-to-play") {
          const heartbeat: Heartbeat = {
            id: tempId,
            type: "i-want-to-play",
            playerId: "",
            playerName: "",
            playerUsername: "",
            playerPhoto: "",
            sports: input.sports,
            skillLevel: input.skillLevel,
            location: {
              latitude: 0,
              longitude: 0,
              city: "",
            },
            note: input.note,
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            isActive: true,
          };

          setActiveHeartbeat(heartbeat);
        } else {
          const heartbeat: Heartbeat = {
            id: tempId,
            type: "looking-for-player",
            teamId: "",
            teamName: "",
            teamLogo: "",
            sport: input.sports[0] || "football",
            skillLevel: input.skillLevel,
            playersNeeded: input.playersNeeded || 1,
            currentPlayers: 0,
            location: {
              latitude: 0,
              longitude: 0,
              city: "",
              venue: input.venue || "",
            },
            matchTime: input.matchTime || now.toISOString(),
            note: input.note,
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            isActive: true,
          };

          setActiveHeartbeat(heartbeat);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to submit heartbeat";
        setError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const cancelHeartbeat = useCallback(() => {
    setActiveHeartbeat(null);
    setError(null);
  }, []);

  const value: HeartbeatContextValue = {
    activeHeartbeat,
    isSubmitting,
    submitHeartbeat,
    cancelHeartbeat,
    error,
  };

  return (
    <HeartbeatContext.Provider value={value}>
      {children}
    </HeartbeatContext.Provider>
  );
}

// ----- Hook -----
export function useHeartbeatContext(): HeartbeatContextValue {
  const context = useContext(HeartbeatContext);
  if (context === undefined) {
    throw new Error(
      "useHeartbeatContext must be used within a HeartbeatProvider"
    );
  }
  return context;
}