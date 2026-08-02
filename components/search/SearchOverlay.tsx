"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn, timeAgo } from "@/lib/utils";
import { useSearch } from "@/context/SearchContext";
import { useLocation } from "@/context/LocationContext";
import { haversineKm } from "@/lib/discovery";
import { searchAll } from "@/lib/search";
import type { SearchResults } from "@/lib/search";
import Avatar from "@/components/ui/Avatar";
import {
  SearchIcon,
  XIcon,
  MapPinIcon,
  ClockIcon,
  HeartIcon,
  CheckCircleIcon,
  UsersIcon,
  ShieldIcon,
} from "@/components/SvgIcons";

const RECENT_KEY = "turfog:recent-searches";
const SUGGESTIONS = ["Football", "Box cricket", "Badminton", "Pickleball", "Padel"];

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(q: string) {
  try {
    const list = [q, ...loadRecent().filter((x) => x !== q)].slice(0, 5);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* ignore storage errors */
  }
}

export default function SearchOverlay() {
  const { open, setOpen } = useSearch();
  const { lat, lng } = useLocation();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ players: [], posts: [], matches: [] });
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const reqId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      setRecent(loadRecent());
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setResults({ players: [], posts: [], matches: [] });
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = ++reqId.current;
    const t = setTimeout(async () => {
      const res = await searchAll(q);
      if (id !== reqId.current) return;
      setResults(res);
      setLoading(false);
      setActive(0);
      saveRecent(q);
      setRecent(loadRecent());
    }, 300);
    return () => clearTimeout(t);
  }, [query, open]);

  const flat = useMemo(() => {
    const items: Array<{ key: string; href: string }> = [];
    results.players.forEach((p) => items.push({ key: `player-${p.id}`, href: `/${p.username}` }));
    results.matches.forEach((m) => items.push({ key: `match-${m.id}`, href: "/games" }));
    results.posts.forEach((p) => items.push({ key: `post-${p.id}`, href: "/" }));
    return items;
  }, [results]);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (flat.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[active];
      if (item) go(item.href);
    }
  };

  const hasResults = results.players.length + results.posts.length + results.matches.length > 0;
  const showEmpty = !loading && query.trim().length >= 2 && !hasResults;
  const matchStart = results.players.length;
  const postStart = matchStart + results.matches.length;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-card-hover border border-neutral-200 overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
          <SearchIcon size={20} className="text-neutral-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search players, matches, posts..."
            className="flex-1 bg-transparent text-body-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
          {query ? (
            <button onClick={() => setQuery("")} className="w-7 h-7 rounded-lg hover:bg-neutral-100 text-neutral-400 flex items-center justify-center">
              <XIcon size={16} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md border border-neutral-200 bg-neutral-50 text-caption text-neutral-400">Esc</kbd>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
          {query.trim().length < 2 ? (
            <div className="p-4 space-y-4">
              {recent.length > 0 && (
                <div>
                  <p className="text-caption font-semibold text-neutral-400 uppercase tracking-wide mb-2">Recent</p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button key={r} onClick={() => setQuery(r)} className="px-3 py-1.5 rounded-full bg-neutral-100 text-body-xs text-neutral-600 hover:bg-neutral-200 transition-colors">
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-caption font-semibold text-neutral-400 uppercase tracking-wide mb-2">Try searching</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => setQuery(s)} className="px-3 py-1.5 rounded-full border border-neutral-200 text-body-xs text-neutral-600 hover:border-neutral-300 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className="p-4 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 rounded bg-neutral-100 animate-pulse" />
                    <div className="h-2.5 w-1/2 rounded bg-neutral-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : showEmpty ? (
            <div className="p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                <SearchIcon size={22} className="text-neutral-300" />
              </div>
              <p className="text-body-sm text-neutral-500">No results for "{query}"</p>
              <p className="text-caption text-neutral-400 mt-1">Try a different player, sport, or venue.</p>
            </div>
          ) : (
            <div className="py-2">
              {results.players.length > 0 && (
                <Section label="Players">
                  {results.players.map((p, i) => (
                    <Row key={p.id} idx={i} activeIdx={active} onHover={setActive} onClick={() => go(`/${p.username}`)}>
                      <Avatar alt={p.fullName} src={p.avatar} size="sm" online={p.presence === "available-now"} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-body-sm font-semibold text-neutral-900 truncate">{p.fullName}</span>
                          {p.verified && <CheckCircleIcon size={14} className="text-electric-blue flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 text-caption text-neutral-400">
                          <span className="truncate">@{p.username}</span>
                          <span className="flex items-center gap-0.5"><ShieldIcon size={11} />{p.reliability}</span>
                          <span className="flex items-center gap-0.5"><UsersIcon size={11} />{p.followers}</span>
                        </div>
                      </div>
                    </Row>
                  ))}
                </Section>
              )}

              {results.matches.length > 0 && (
                <Section label="Matches">
                  {results.matches.map((m, i) => {
                    const dist =
                      lat != null && lng != null && m.latitude != null && m.longitude != null
                        ? haversineKm(lat, lng, m.latitude, m.longitude).toFixed(1)
                        : null;
                    return (
                      <Row key={m.id} idx={matchStart + i} activeIdx={active} onHover={setActive} onClick={() => go("/games")}>
                        <span className="w-9 h-9 rounded-lg bg-sunset-orange/10 text-sunset-orange flex items-center justify-center flex-shrink-0">
                          <ClockIcon size={18} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm font-semibold text-neutral-900 truncate">{m.venue || "Match"}</p>
                          <div className="flex items-center gap-2 text-caption text-neutral-400">
                            <span className="capitalize">{m.sport}</span>
                            <span className="flex items-center gap-0.5">
                              <MapPinIcon size={11} />
                              {m.area}
                              {dist ? ` | ${dist} km` : ""}
                            </span>
                            <span>{m.needed > 0 ? `${m.needed} slots` : "Full"}</span>
                          </div>
                        </div>
                      </Row>
                    );
                  })}
                </Section>
              )}

              {results.posts.length > 0 && (
                <Section label="Posts">
                  {results.posts.map((p, i) => (
                    <Row key={p.id} idx={postStart + i} activeIdx={active} onHover={setActive} onClick={() => go("/")}>
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <span className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                          <HeartIcon size={16} className="text-neutral-400" />
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-body-sm font-semibold text-neutral-900 truncate">{p.authorName}</span>
                          {p.authorVerified && <CheckCircleIcon size={13} className="text-electric-blue flex-shrink-0" />}
                          <span className="text-caption text-neutral-400">{timeAgo(p.createdAt)}</span>
                        </div>
                        <p className="text-caption text-neutral-500 line-clamp-1">{p.text}</p>
                      </div>
                      <span className="flex items-center gap-0.5 text-caption text-neutral-400 flex-shrink-0">
                        <HeartIcon size={12} />
                        {p.likes}
                      </span>
                    </Row>
                  ))}
                </Section>
              )}
            </div>
          )}
        </div>

        {hasResults && (
          <div className="hidden sm:flex items-center gap-4 px-4 py-2 border-t border-neutral-100 text-caption text-neutral-400">
            <span>Up/Down to navigate</span>
            <span>Enter to open</span>
            <span>Esc to close</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <p className="px-4 py-1.5 text-caption font-semibold text-neutral-400 uppercase tracking-wide">{label}</p>
      {children}
    </div>
  );
}

function Row({ idx, activeIdx, onHover, onClick, children }: { idx: number; activeIdx: number; onHover: (i: number) => void; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onMouseEnter={() => onHover(idx)}
      onClick={onClick}
      className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors", idx === activeIdx ? "bg-primary-green/5" : "hover:bg-neutral-50")}
    >
      {children}
    </button>
  );
}