"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";
import Link from "next/link";
import type { SocialPost, PostComment, SportId } from "@/types";
import Avatar from "@/components/ui/Avatar";
import { useSocial } from "@/context/SocialContext";
import { fetchComments } from "@/lib/social";
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

function presenceDot(p: string): string {
  switch (p) {
    case "available-now": return "bg-emerald";
    case "in-30-min": return "bg-amber";
    case "today": return "bg-electric-blue";
    case "tonight": return "bg-purple-500";
    case "weekend": return "bg-sunset-orange";
    default: return "bg-neutral-300";
  }
}

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
  const social = useSocial();
  const [saved, setSaved] = useState(post.savedByMe);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[]>(post.comments);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [draft, setDraft] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [burst, setBurst] = useState(false);

  const long = post.text.length > 180;
  const following = !!post.authorId && social.isFollowing(post.authorUsername);
  const isMe = post.authorUsername === social.myUsername;

  const openComments = async () => {
    const next = !showComments;
    setShowComments(next);
    if (next && !commentsLoaded) {
      const loaded = await fetchComments(post.id);
      setComments(loaded);
      setCommentsLoaded(true);
    }
  };

  const onLike = () => {
    if (!post.likedByMe) {
      setBurst(true);
      setTimeout(() => setBurst(false), 450);
    }
    social.like(post.id);
  };

  const addComment = async () => {
    const t = draft.trim();
    if (!t) return;
    setDraft("");
    const c = await social.comment(post.id, t);
    if (c) setComments((prev) => [...prev, c]);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-neutral-200/80 shadow-card overflow-hidden transition-shadow hover:shadow-card-hover"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Link href={`/${post.authorUsername}`} className="flex-shrink-0">
          <Avatar alt={post.authorName} src={post.authorAvatar} size="md" online={post.presence === "available-now"} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link href={`/${post.authorUsername}`} className="text-body-sm font-semibold text-neutral-900 truncate hover:text-electric-blue transition-colors">
              {post.authorName}
            </Link>
            {post.authorVerified && <CheckCircleIcon size={15} className="text-electric-blue flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-1.5 text-caption text-neutral-400">
            <span className="truncate">@{post.authorUsername}</span>
            <span className="flex items-center gap-1">
              <span className={cn("w-1.5 h-1.5 rounded-full", presenceDot(post.presence))} />
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
          {!isMe && post.authorId && (
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => social.follow(post.authorId as string, post.authorUsername)}
              className={cn(
                "px-3 py-1 rounded-full text-caption font-semibold border transition-all",
                following
                  ? "bg-neutral-100 text-neutral-600 border-neutral-200"
                  : "bg-primary-green text-white border-primary-green hover:bg-primary-green/90"
              )}
            >
              {following ? "Following" : "Follow"}
            </motion.button>
          )}
          <button className="w-8 h-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-400">
            <MoreIcon size={18} />
          </button>
        </div>
      </div>

      {/* Text */}
      {post.text && (
        <div className="px-4 pb-3">
          <p className={cn("text-body-sm text-neutral-700 whitespace-pre-line", !expanded && long && "line-clamp-3")}>
            {post.text}
          </p>
          {long && (
            <button onClick={() => setExpanded((v) => !v)} className="text-body-xs text-electric-blue font-medium mt-1">
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
            <img src={post.media.url} alt={post.media.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
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
        <div className={cn("mx-4 mt-3 rounded-xl p-3 flex items-center gap-3", post.heartbeat.type === "i-want-to-play" ? "bg-electric-blue/5 border border-electric-blue/20" : "bg-sunset-orange/5 border border-sunset-orange/20")}>
          <span className={cn("w-9 h-9 rounded-lg flex items-center justify-center", post.heartbeat.type === "i-want-to-play" ? "bg-electric-blue/10 text-electric-blue" : "bg-sunset-orange/10 text-sunset-orange")}>
            {post.heartbeat.type === "i-want-to-play" ? <RunIcon size={18} /> : <UsersIcon size={18} />}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-body-xs font-semibold text-neutral-900">{post.heartbeat.label}</p>
            {post.heartbeat.playersNeeded && <p className="text-caption text-neutral-500">Needs {post.heartbeat.playersNeeded} more players</p>}
          </div>
          <a href={post.heartbeat.joinUrl} className="px-3 py-1.5 rounded-lg text-caption font-semibold text-white bg-primary-green hover:bg-primary-green/90 transition-colors">Join</a>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 mt-3 text-caption text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-coral/10 flex items-center justify-center">
            <HeartIcon size={10} filled className="text-coral" />
          </span>
          {post.likes.toLocaleString()}
        </span>
        <span className="flex items-center gap-3">
          <button onClick={openComments} className="hover:text-neutral-600">{comments.length || post.comments.length} comments</button>
          <span>{post.shares} shares</span>
        </span>
      </div>

      {/* Action bar */}
      <div className="grid grid-cols-4 border-t border-neutral-100 mt-3">
        <ActionBtn active={post.likedByMe} onClick={onLike} activeClass="text-coral" burst={burst} icon={<HeartIcon size={18} filled={post.likedByMe} />} label="Like" />
        <ActionBtn active={showComments} onClick={openComments} activeClass="text-electric-blue" icon={<CommentIcon size={18} />} label="Comment" />
        <ActionBtn active={false} onClick={() => social.share(post.id)} activeClass="" icon={<ShareIcon size={18} />} label="Share" />
        <ActionBtn active={saved} onClick={() => setSaved((v) => !v)} activeClass="text-amber" icon={<BookmarkIcon size={18} filled={saved} />} label="Save" />
      </div>

      {/* Comments */}
      <AnimatePresence initial={false}>
        {showComments && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
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
                <div className="flex-1 flex items-center gap-2 bg-white rounded-full border border-neutral-200/80 pl-3 pr-1 py-1">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") addComment(); }}
                    placeholder="Write a comment"
                    className="flex-1 bg-transparent text-body-xs outline-none placeholder:text-neutral-400"
                  />
                  <button onClick={addComment} disabled={!draft.trim()} className="w-7 h-7 rounded-full bg-primary-green text-white flex items-center justify-center disabled:opacity-40">
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

function ActionBtn({ active, onClick, activeClass, burst, icon, label }: { active: boolean; onClick: () => void; activeClass: string; burst?: boolean; icon: React.ReactNode; label: string }) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={onClick} className={cn("relative flex items-center justify-center gap-1.5 py-2.5 text-body-xs font-medium transition-colors", active ? activeClass : "text-neutral-500 hover:bg-neutral-50")}>
      <motion.span animate={burst ? { scale: [1, 1.4, 1] } : active ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.35 }}>
        {icon}
      </motion.span>
      {label}
    </motion.button>
  );
}