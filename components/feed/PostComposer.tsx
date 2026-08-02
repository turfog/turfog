"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Player, SocialPost } from "@/types";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { ImageIcon, VideoIcon, ZapIcon, UsersIcon } from "@/components/SvgIcons";

export default function PostComposer({
  player,
  onPost,
}: {
  player: Player;
  onPost: (p: SocialPost) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const first = (player.full_name ?? player.username ?? "there").split(" ")[0];

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onPost({
      id: Date.now().toString(),
      authorName: player.full_name ?? player.username ?? "You",
      authorUsername: player.username ?? "you",
      authorAvatar: player.profile_photo,
      authorVerified: player.verification_status === "verified",
      presence: "available-now",
      trustScore: Number(player.reliability_score) || 5,
      createdAt: new Date().toISOString(),
      text: t,
      media: null,
      heartbeat: null,
      likes: 0,
      comments: [],
      shares: 0,
      likedByMe: false,
      savedByMe: false,
      nearbyWantToJoin: 0,
      sport: undefined,
      location: player.city || undefined,
    });
    setText("");
    setOpen(false);
  };

  return (
    <div id="composer" className="bg-white rounded-2xl border border-neutral-200 shadow-card p-4">
      <div className="flex items-center gap-3">
        <Avatar alt={player.full_name ?? player.username ?? "You"} src={player.profile_photo} size="md" />
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-full bg-neutral-100 text-body-sm text-neutral-500 hover:bg-neutral-200 transition-colors"
          >
            Share a match moment, {first}
          </button>
        ) : (
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder={"What is happening on the turf, " + first + "?"}
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-body-sm text-neutral-900 outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 resize-none"
          />
        )}
      </div>
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-1">
              <Chip icon={<ImageIcon size={16} />} label="Photo" color="text-emerald" />
              <Chip icon={<VideoIcon size={16} />} label="Video" color="text-electric-blue" />
              <Chip icon={<ZapIcon size={16} />} label="Go live" color="text-sunset-orange" />
              <Chip icon={<UsersIcon size={16} />} label="Need players" color="text-amber" />
            </div>
            <Button size="sm" disabled={!text.trim()} onClick={submit}>
              Post
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Chip({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <button className={cn("hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-xs font-medium hover:bg-neutral-100 transition-colors", color)}>
      {icon}
      {label}
    </button>
  );
}