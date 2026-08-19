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

  // Real-time comment listener
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
          // Prevent duplicate insertion if optimistic update already added it
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
      className="bg-white rounded-2xl border border-neutral-200/80 shadow-card overflow-hidden transition-shadow hover:shadow-card-hover"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Link href={`/${post.authorUsername}`} className="flex-shrink-0">
          <Avatar alt={post.authorName} src={post.authorAvatar} size="md" presence={post.presence} />
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
              <PresenceDot presence={post.presence} size="xs" />
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
            <div className="px-4 py-3 space-y-4 border-t border-neutral-100 bg-neutral-50/50">
              {topLevel.map((c) => (
                <div key={c.id} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Avatar alt={c.authorName} src={c.authorAvatar} size="xs" />
                    <div className="flex-1 min-w-0">
                      <div className="bg-white rounded-xl px-3 py-2 border border-neutral-100">
                        <p className="text-caption font-semibold text-neutral-900">{c.authorName}</p>
                        <p className="text-body-xs text-neutral-600">{c.text}</p>
                      </div>
                      <button
                        onClick={() => startReply(c)}
                        className="text-caption text-neutral-400 font-semibold hover:text-electric-blue mt-1 ml-1"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                  {getReplies(c.id).map((r) => (
                    <div key={r.id} className="flex items-start gap-2 ml-6">
                      <Avatar alt={r.authorName} src={r.authorAvatar} size="xs" />
                      <div className="bg-white rounded-xl px-3 py-2 border border-neutral-100 flex-1">
                        <p className="text-caption font-semibold text-neutral-900">{r.authorName}</p>
                        <p className="text-body-xs text-neutral-600">{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-3">
                <Avatar alt="You" size="xs" />
                <div className="flex-1 flex items-center gap-2 bg-white rounded-full border border-neutral-200/80 pl-3 pr-1 py-1">
                  <input
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") addComment(); }}
                    placeholder={replyingTo ? "Write a reply..." : "Write a comment"}
                    className="flex-1 bg-transparent text-body-xs outline-none placeholder:text-neutral-400"
                  />
                  {replyingTo && (
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-caption text-neutral-400 hover:text-neutral-600 px-1"
                    >
                      Cancel
                    </button>
                  )}
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