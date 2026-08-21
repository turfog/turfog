"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";
import Link from "next/link";
import type { SocialPost, PostComment, SportId } from "@/types";
import Avatar from "@/components/ui/Avatar";
import PresenceDot from "@/components/ui/PresenceDot";
import { useSocial } from "@/context/SocialContext";
import { fetchComments, commentPost } from "@/lib/social";
import { createClient } from "@/lib/supabase";
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

interface ThreadedComment extends PostComment {
  parentId?: string | null;
}

const sportIcon: Record<SportId, React.ReactNode> = {
  football: <FootballIcon size={14} />,
  "box-cricket": <CricketIcon size={14} />,
  pickleball: <PickleballIcon size={14} />,
  padel: <PadelIcon size={14} />,
  badminton: <BadmintonIcon size={14} />,
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
  const [comments, setComments] = useState<ThreadedComment[]>(post.comments as ThreadedComment[]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [draft, setDraft] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [burst, setBurst] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const long = post.text.length > 180;
  const following = !!post.authorId && social.isFollowing(post.authorUsername);
  const isMe = post.authorUsername === social.myUsername;

  const topLevel = comments.filter(c => !c.parentId);
  const getReplies = (id: string) => comments.filter(c => c.parentId === id);

  const openComments = async () => {
    const next = !showComments;
    setShowComments(next);
    if (next && !commentsLoaded) {
      const loaded = await fetchComments(post.id);
      setComments(loaded as ThreadedComment[]);
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

  const startReply = (c: ThreadedComment) => {
    setReplyingTo(c.id);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const addComment = async () => {
    const t = draft.trim();
    if (!t) return;
    setDraft("");
    const c = await commentPost(post.id, t, replyingTo);
    if (c) {
      setComments((prev) => [...prev, c as ThreadedComment]);
      setReplyingTo(null);
    }
  };

  React.useEffect(() => {
    if (!showComments) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`post-comments-${post.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "post_comments", filter: `post_id=eq.${post.id}` },
        (payload) => {
          const newComment = payload.new as any;
          setComments(prev => {
            if (prev.some(c => c.id === newComment.id)) return prev;
            return [...prev, {
              id: newComment.id,
              authorName: newComment.author_name,
              authorAvatar: newComment.author_avatar,
              text: newComment.text,
              createdAt: newComment.created_at,
              parentId: newComment.parent_id
            }];
          });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [showComments, post.id]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="surface-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 md:p-5">
        <Link href={`/${post.authorUsername}`} className="flex-shrink-0 turfog-press">
          <Avatar alt={post.authorName} src={post.authorAvatar} size="md" presence={post.presence} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link href={`/${post.authorUsername}`} className="text-[14px] font-semibold text-neutral-900 truncate hover:text-emerald-600 transition-colors">
              {post.authorName}
            </Link>
            {post.authorVerified && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-500/[0.12] border border-emerald-500/20">
                <CheckCircleIcon size={12} className="text-emerald-600" />
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span className="truncate">@{post.authorUsername}</span>
            <span className="flex items-center gap-1">
              <PresenceDot presence={post.presence} size="xs" />
              {timeAgo(post.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {post.sport && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-black/[0.04] border border-black/[0.06] rounded-lg text-[11px] font-medium text-neutral-600">
              {sportIcon[post.sport]}
              {sportName[post.sport]}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200/60 rounded-lg text-[11px] font-semibold text-emerald-700">
            <ShieldIcon size={11} />
            {post.trustScore}
          </span>
          {!isMe && post.authorId && (
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => social.follow(post.authorId as string, post.authorUsername)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all",
                following
                  ? "bg-black/[0.03] text-neutral-600 border-black/[0.08] hover:bg-black/[0.06]"
                  : "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white border-emerald-500 hover:shadow-[0_4px_12px_-2px_rgba(16,185,129,0.4)]"
              )}
            >
              {following ? "Following" : "Follow"}
            </motion.button>
          )}
          <button className="w-8 h-8 rounded-lg hover:bg-black/[0.04] active:scale-95 flex items-center justify-center text-neutral-400 transition-all">
            <MoreIcon size={18} />
          </button>
        </div>
      </div>

      {/* Text */}
      {post.text && (
        <div className="px-4 md:px-5 pb-3">
          <p className={cn("text-[14px] text-neutral-700 whitespace-pre-line leading-relaxed font-body", !expanded && long && "line-clamp-3")}>
            {post.text}
          </p>
          {long && (
            <button onClick={() => setExpanded((v) => !v)} className="text-[12px] text-emerald-600 font-semibold mt-2 hover:text-emerald-700 transition-colors">
              {expanded ? "See less" : "See more"}
            </button>
          )}
          {post.location && (
            <p className="flex items-center gap-1 text-[11px] text-neutral-500 mt-2">
              <MapPinIcon size={12} />
              {post.location}
            </p>
          )}
        </div>
      )}

      {/* Media */}
      {post.media && (
        <div className="relative group mx-4 md:mx-5 mb-3 rounded-2xl overflow-hidden">
          <div className="aspect-[4/3] bg-black/[0.04]">
            <img src={post.media.url} alt={post.media.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          </div>
          {post.media.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white shadow-lg"
              >
                <PlayIcon size={28} />
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* Heartbeat CTA */}
      {post.heartbeat && (
        <div className={cn("mx-4 md:mx-5 mb-3 rounded-2xl p-3.5 flex items-center gap-3", post.heartbeat.type === "i-want-to-play" ? "bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200/60" : "bg-gradient-to-br from-orange-50 to-orange-100/60 border border-orange-200/60")}>
          <span className={cn("w-10 h-10 rounded-xl flex items-center justify-center", post.heartbeat.type === "i-want-to-play" ? "bg-blue-500/[0.12] text-blue-600" : "bg-orange-500/[0.12] text-orange-600")}>
            {post.heartbeat.type === "i-want-to-play" ? <RunIcon size={20} /> : <UsersIcon size={20} />}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-neutral-900">{post.heartbeat.label}</p>
            {post.heartbeat.playersNeeded && <p className="text-[11px] text-neutral-600 mt-0.5">Needs {post.heartbeat.playersNeeded} more players</p>}
          </div>
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href={post.heartbeat.joinUrl}
            className="px-3.5 py-2 rounded-xl text-[11px] font-semibold text-white bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[0_4px_12px_-2px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_16px_-3px_rgba(16,185,129,0.4)] transition-shadow"
          >
            Join
          </motion.a>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 md:px-5 mt-3 text-[11px] text-neutral-500">
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-coral to-rose-600 flex items-center justify-center shadow-sm">
            <HeartIcon size={11} filled className="text-white" />
          </span>
          <span className="font-medium">{post.likes.toLocaleString()}</span>
        </span>
        <span className="flex items-center gap-3">
          <button onClick={openComments} className="hover:text-emerald-600 font-medium transition-colors">{comments.length || post.comments.length} comments</button>
          <span className="font-medium">{post.shares} shares</span>
        </span>
      </div>

      {/* Action bar */}
      <div className="grid grid-cols-4 border-t border-black/[0.06] mt-3">
        <ActionBtn active={post.likedByMe} onClick={onLike} activeClass="text-coral" burst={burst} icon={<HeartIcon size={20} filled={post.likedByMe} />} label="Like" hoverBg="hover:bg-coral/[0.06]" />
        <ActionBtn active={showComments} onClick={openComments} activeClass="text-blue-600" icon={<CommentIcon size={20} />} label="Comment" hoverBg="hover:bg-blue-500/[0.06]" />
        <ActionBtn active={false} onClick={() => social.share(post.id)} activeClass="" icon={<ShareIcon size={20} />} label="Share" hoverBg="hover:bg-emerald-500/[0.06]" />
        <ActionBtn active={saved} onClick={() => setSaved((v) => !v)} activeClass="text-amber-600" icon={<BookmarkIcon size={20} filled={saved} />} label="Save" hoverBg="hover:bg-amber-500/[0.06]" />
      </div>

      {/* Comments */}
      <AnimatePresence initial={false}>
        {showComments && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-4 md:px-5 py-4 space-y-4 border-t border-black/[0.06] bg-gradient-to-b from-black/[0.02] to-transparent">
              {topLevel.map((c) => (
                <div key={c.id} className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <Avatar alt={c.authorName} src={c.authorAvatar} size="xs" />
                    <div className="flex-1 min-w-0">
                      <div className="bg-white rounded-2xl px-3.5 py-2.5 border border-black/[0.06] shadow-sm">
                        <p className="text-[11px] font-semibold text-neutral-900">{c.authorName}</p>
                        <p className="text-[13px] text-neutral-700 mt-0.5 leading-relaxed">{c.text}</p>
                      </div>
                      <button
                        onClick={() => startReply(c)}
                        className="text-[11px] text-neutral-500 font-semibold hover:text-emerald-600 mt-1.5 ml-1 transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                  {getReplies(c.id).map((r) => (
                    <div key={r.id} className="flex items-start gap-2.5 ml-7">
                      <Avatar alt={r.authorName} src={r.authorAvatar} size="xs" />
                      <div className="bg-white rounded-2xl px-3.5 py-2.5 border border-black/[0.06] shadow-sm flex-1">
                        <p className="text-[11px] font-semibold text-neutral-900">{r.authorName}</p>
                        <p className="text-[13px] text-neutral-700 mt-0.5 leading-relaxed">{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="flex items-center gap-2.5 mt-4">
                <Avatar alt="You" size="xs" />
                <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl border border-black/[0.08] pl-3.5 pr-1.5 py-1.5 shadow-sm">
                  <input
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") addComment(); }}
                    placeholder={replyingTo ? "Write a reply..." : "Write a comment"}
                    className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-neutral-400"
                  />
                  {replyingTo && (
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-[11px] text-neutral-500 hover:text-neutral-700 px-2 py-1 rounded-lg hover:bg-black/[0.04] transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={addComment}
                    disabled={!draft.trim()}
                    className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_4px_12px_-2px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_16px_-3px_rgba(16,185,129,0.4)] transition-shadow"
                  >
                    <SendIcon size={15} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function ActionBtn({ active, onClick, activeClass, burst, icon, label, hoverBg }: { active: boolean; onClick: () => void; activeClass: string; burst?: boolean; icon: React.ReactNode; label: string; hoverBg: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center gap-1.5 py-3 text-[12px] font-semibold transition-colors",
        active ? activeClass : "text-neutral-500",
        hoverBg
      )}
    >
      <motion.span animate={burst ? { scale: [1, 1.4, 1] } : active ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.35 }}>
        {icon}
      </motion.span>
      {label}
    </motion.button>
  );
}