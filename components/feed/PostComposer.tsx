"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Player } from "@/types";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { createPost } from "@/lib/social";
import { ImageIcon, VideoIcon, ZapIcon, UsersIcon, XIcon } from "@/components/SvgIcons";

export default function PostComposer({ player, onPosted }: { player: Player; onPosted: () => void }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [posting, setPosting] = useState(false);
  const first = (player.full_name ?? player.username ?? "there").split(" ")[0];

  const submit = async () => {
    const t = text.trim();
    if (!t && !imageUrl.trim()) return;
    setPosting(true);
    const ok = await createPost({
      text: t,
      imageUrl: imageUrl.trim() || undefined,
      imageAlt: imageUrl.trim() ? "Shared photo" : undefined,
      mediaType: imageUrl.trim() ? "image" : undefined,
      location: player.city || undefined,
    });
    setPosting(false);
    if (!ok) return;
    setText("");
    setImageUrl("");
    setImageOpen(false);
    setOpen(false);
    onPosted();
  };

  return (
    <div
      id="composer"
      className={cn(
        "bg-white rounded-2xl border shadow-card p-4 transition-all duration-200",
        open ? "border-neutral-300/70 shadow-card-hover" : "border-neutral-200/80"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar alt={player.full_name ?? player.username ?? "You"} src={player.profile_photo} size="md" />
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-full bg-neutral-100 text-body-sm text-neutral-500 hover:bg-neutral-200/80 transition-colors"
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
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-body-sm text-neutral-900 outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 resize-none transition-shadow"
          />
        )}
      </div>

      {open && imageOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="mt-3 flex items-center gap-2">
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste an image URL"
              className="flex-1 px-3.5 py-2 rounded-xl border border-neutral-200 text-body-xs text-neutral-900 outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20"
            />
            <button
              onClick={() => { setImageOpen(false); setImageUrl(""); }}
              className="w-8 h-8 rounded-lg hover:bg-neutral-100 text-neutral-400 flex items-center justify-center transition-colors"
            >
              <XIcon size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-1">
              <Chip active={imageOpen} onClick={() => setImageOpen((v) => !v)} icon={<ImageIcon size={16} />} label="Photo" color="text-emerald" />
              <Chip active={false} onClick={() => {}} icon={<VideoIcon size={16} />} label="Video" color="text-electric-blue" />
              <Chip active={false} onClick={() => {}} icon={<ZapIcon size={16} />} label="Go live" color="text-sunset-orange" />
              <Chip active={false} onClick={() => {}} icon={<UsersIcon size={16} />} label="Tag" color="text-amber" />
            </div>
            <Button size="sm" loading={posting} disabled={!text.trim() && !imageUrl.trim()} onClick={submit}>
              Post
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Chip({ active, onClick, icon, label, color }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; color: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-body-xs font-medium transition-colors",
        active ? "bg-neutral-100" : "hover:bg-neutral-100",
        color
      )}
    >
      {icon}
      {label}
    </button>
  );
}