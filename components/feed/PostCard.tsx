"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";
import type { SocialPost, PostComment, SportId } from "@/types";
import Avatar from "@/components/ui/Avatar";
import {
  CheckCircleIcon,
  MapPinIcon,
  HeartIcon,
  CommentIcon,
  ShareIcon,
  BookmarkIcon,
  MoreIcon,
  PlayIcon,
  ShieldIcon,
  RunIcon,
  UsersIcon,
  SendIcon,
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";

const presenceDot: Record<SocialPost["presence"], string> = {
  "available-now": "bg-emerald",
  "in-30-min": "bg-amber",
  today: "bg-electric-blue",
  offline: "bg-neutral-300",
};

const sportIcon: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={13} />,
  "box-cricket": <CricketIcon size={13} />,
  pickleball: <PickleballIcon size={13} />,
  padel: <PadelIcon size={13} />,
  badminton: <BadmintonIcon size={13} />,
};

const sportName: Record<SportId, string> = {
  football: "Football",
  "box-cricket": "Box cricket",
  pickleball: "Pickleball",
  padel: "Padel",
  badminton: "Badminton",
};

export default function PostCard({ post }: { post: SocialPost }) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(post.savedByMe);
  const [shares, setShares] = useState(post.shares);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[]>(post.comments);
  const [draft, setDraft] = useState("");
  const [expanded, setExpanded] = useState(false);

  const long = post.text.length > 180;

  const toggleLike = () => {
    setLikes((c) => (liked ? c - 1 : c + 1));
    setLiked((v) => !v);
  };
  const addComment = () => {
    const t = draft.trim();
    if (!t) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        authorName: "You",
        authorAvatar: "",
        text: t,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-neutral-200 shadow-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Avatar
          alt={post.authorName}
          src={post.authorAvatar}
          size="md"
          online={post.presence === "available-now"}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-body-sm font-semibold text-neutral-900 truncate">
              {post.authorName}
            </span>
            {post.authorVerified && (
              <CheckCircleIcon size={15} className="text-electric-blue flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1.5 text-caption text-neutral-400">
            <span className="truncate">@{post.authorUsername}</span>
            <span className="flex items-center gap-1">
              <span className={cn("w-1.5 h-1.5 rounded-full", presenceDot[post.presence])} />
              {timeAgo(post.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {post.sport && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-lg text-caption font-medium text-neutral-600">
              {sportIcon[post.sport]}
              {sportName[post.sport]}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald/10 rounded-lg text-caption font-semibold text-emerald">
            <ShieldIcon size={12} />
            {post.trustScore}
          </span>
          <button className="w-8 h-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-400">
            <MoreIcon size={18} />
          </button>
        </div>
      </div>

      {/* Text */}
      {post.text && (
        <div className="px-4 pb-3">
          <p
            className={cn(
              "text-body-sm text-neutral-700 whitespace-pre-line",
              !expanded && long && "line-clamp-3"
            )}
          >
            {post.text}
          </p>
          {long && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-body-xs text-electric-blue font-medium mt-1"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
          {post.location && (
            <p className="flex items-center gap-1 text-caption text-neutral-400 mt-1.5">
              <MapPinIcon size={12} />
              {post.location}
            </p>
          )}
        </div>
      )}

      {/* Media */}
      {post.media && (
        <div className="relative group">
          <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
            <img
              src={post.media.url}
              alt={post.media.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          {post.media.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
                <PlayIcon size={26} />
              </span>
            </div>
          )}
        </div>
      )}

      {/* Heartbeat CTA */}
      {post.heartbeat && (
        <div
          className={cn(
            "mx-4 mt-3 rounded-xl p-3 flex items-center gap-3",
            post.heartbeat.type === "i-want-to-play"
              ? "bg-electric-blue/5 border border-electric-blue/20"
              : "bg-sunset-orange/5 border border-sunset-orange/20"
          )}
        >
          <span
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center",
              post.heartbeat.type === "i-want-to-play"
                ? "bg-electric-blue/10 text-electric-blue"
                : "bg-sunset-orange/10 text-sunset-orange"
            )}
          >
            {post.heartbeat.type === "i-want-to-play" ? (
              <RunIcon size={18} />
            ) : (
              <UsersIcon size={18} />
            )}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-body-xs font-semibold text-neutral-900">
              {post.heartbeat.label}
            </p>
            {post.heartbeat.playersNeeded && (
              <p className="text-caption text-neutral-500">
                Needs {post.heartbeat.playersNeeded} more players
              </p>
            )}
          </div>
          <a
            href={post.heartbeat.joinUrl}
            className="px-3 py-1.5 rounded-lg text-caption font-semibold text-white bg-primary-green hover:bg-primary-green/90 transition-colors"
          >
            Join
          </a>
        </div>
      )}

      {/* Social proof */}
      {post.nearbyWantToJoin > 0 && (
        <div className="flex items-center gap-2 px-4 mt-3">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-5 h-5 rounded-full border-2 border-white bg-gradient-to-br from-electric-blue to-primary-green"
              />
            ))}
          </div>
          <span className="text-caption text-neutral-500">
            <span className="font-semibold text-neutral-700">
              {post.nearbyWantToJoin} players nearby
            </span>{" "}
            want to join
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 mt-3 text-caption text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-coral/10 flex items-center justify-center">
            <HeartIcon size={10} filled className="text-coral" />
          </span>
          {likes.toLocaleString()}
        </span>
        <span className="flex items-center gap-3">
          <button onClick={() => setShowComments((v) => !v)} className="hover:text-neutral-600">
            {comments.length} comments
          </button>
          <span>{shares} shares</span>
        </span>
      </div>

      {/* Action bar */}
      <div className="grid grid-cols-4 border-t border-neutral-100 mt-3">
        <ActionBtn active={liked} onClick={toggleLike} activeClass="text-coral" icon={<HeartIcon size={18} filled={liked} />} label="Like" />
        <ActionBtn active={showComments} onClick={() => setShowComments((v) => !v)} activeClass="text-electric-blue" icon={<CommentIcon size={18} />} label="Comment" />
        <ActionBtn active={false} onClick={() => setShares((c) => c + 1)} activeClass="" icon={<ShareIcon size={18} />} label="Share" />
        <ActionBtn active={saved} onClick={() => setSaved((v) => !v)} activeClass="text-amber" icon={<BookmarkIcon size={18} filled={saved} />} label="Save" />
      </div>

      {/* Comments */}
      <AnimatePresence initial={false}>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 space-y-3 border-t border-neutral-100 bg-neutral-50/50">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2">
                  <Avatar alt={c.authorName} src={c.authorAvatar} size="xs" />
                  <div className="bg-white rounded-xl px-3 py-2 border border-neutral-100 flex-1">
                    <p className="text-caption font-semibold text-neutral-900">{c.authorName}</p>
                    <p className="text-body-xs text-neutral-600">{c.text}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Avatar alt="You" size="xs" />
                <div className="flex-1 flex items-center gap-2 bg-white rounded-full border border-neutral-200 pl-3 pr-1 py-1">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addComment();
                    }}
                    placeholder="Write a comment"
                    className="flex-1 bg-transparent text-body-xs outline-none placeholder:text-neutral-400"
                  />
                  <button
                    onClick={addComment}
                    disabled={!draft.trim()}
                    className="w-7 h-7 rounded-full bg-primary-green text-white flex items-center justify-center disabled:opacity-40"
                  >
                    <SendIcon size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function ActionBtn({
  active,
  onClick,
  activeClass,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  activeClass: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-1.5 py-2.5 text-body-xs font-medium transition-colors",
        active ? activeClass : "text-neutral-500 hover:bg-neutral-50"
      )}
    >
      <motion.span animate={active ? { scale: [1, 1.25, 1] } : {}} transition={{ duration: 0.3 }}>
        {icon}
      </motion.span>
      {label}
    </motion.button>
  );
}