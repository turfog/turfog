"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Player } from "@/types";
import Avatar from "@/components/ui/Avatar";
import { createPost } from "@/lib/social";
import { ImageIcon, VideoIcon, ZapIcon, UsersIcon, XIcon, SendIcon } from "@/components/SvgIcons";

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
    <motion.div
      id="composer"
      layout
      className="surface-card p-4 md:p-5"
    >
      <div className="flex items-start gap-3">
        <Avatar alt={player.full_name ?? player.username ?? "You"} src={player.profile_photo} size="md" />
        <div className="flex-1 min-w-0">
          {!open ? (
            <button
              onClick={() => setOpen(true)}
              className="w-full text-left px-4 py-3 rounded-2xl bg-black/[0.03] hover:bg-black/[0.05] border border-black/[0.04] hover:border-black/[0.08] text-[14px] text-neutral-500 transition-all"
            >
              Share a match moment, {first}...
            </button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder={"What is happening on the turf, " + first + "?"}
                className="w-full px-4 py-3 rounded-2xl border border-black/[0.08] bg-white text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] resize-none transition-all font-body"
              />
            </motion.div>
          )}

          <AnimatePresence>
            {open && imageOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex items-center gap-2">
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste an image URL"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-black/[0.08] bg-white text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] transition-all"
                  />
                  <button
                    onClick={() => { setImageOpen(false); setImageUrl(""); }}
                    className="w-9 h-9 rounded-xl hover:bg-black/[0.04] active:scale-95 text-neutral-400 flex items-center justify-center transition-all"
                  >
                    <XIcon size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/[0.06]">
                  <div className="flex items-center gap-1">
                    <Chip active={imageOpen} onClick={() => setImageOpen((v) => !v)} icon={<ImageIcon size={18} />} label="Photo" color="text-emerald-600" bg="bg-emerald-500/[0.08]" />
                    <Chip active={false} onClick={() => {}} icon={<VideoIcon size={18} />} label="Video" color="text-blue-600" bg="bg-blue-500/[0.08]" />
                    <Chip active={false} onClick={() => {}} icon={<ZapIcon size={18} />} label="Go live" color="text-orange-600" bg="bg-orange-500/[0.08]" />
                    <Chip active={false} onClick={() => {}} icon={<UsersIcon size={18} />} label="Tag" color="text-amber-600" bg="bg-amber-500/[0.08]" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={submit}
                    disabled={posting || (!text.trim() && !imageUrl.trim())}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white text-[14px] font-semibold shadow-[0_8px_24px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_32px_-8px_rgba(16,185,129,0.5)] disabled:opacity-40 disabled:cursor-not-allowed transition-shadow"
                  >
                    {posting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <SendIcon size={16} />
                    )}
                    Post
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function Chip({ active, onClick, icon, label, color, bg }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; color: string; bg: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        "hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all",
        active ? bg : "hover:bg-black/[0.03]",
        color
      )}
    >
      {icon}
      {label}
    </motion.button>
  );
}