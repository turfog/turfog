"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { fetchListings, createListing } from "@/lib/marketplace";
import type { MarketListing } from "@/lib/marketplace";
import Avatar from "@/components/ui/Avatar";
import { 
  ShoppingBagIcon, PlusIcon, XIcon, CheckCircleIcon, 
  TagIcon, BriefcaseIcon, WhistleIcon, HeartPulseIcon, ArrowLeftIcon 
} from "@/components/SvgIcons";

const categories = [
  { id: "all", label: "All", icon: ShoppingBagIcon },
  { id: "gear", label: "Gear", icon: TagIcon },
  { id: "coaching", label: "Coaching", icon: BriefcaseIcon },
  { id: "umpiring", label: "Umpiring", icon: WhistleIcon },
  { id: "physio", label: "Physio", icon: HeartPulseIcon },
];

const categoryMeta: Record<string, { color: string; bg: string }> = {
  gear: { color: "text-blue-600", bg: "bg-blue-500/[0.08] border-blue-500/20" },
  coaching: { color: "text-amber-600", bg: "bg-amber-500/[0.08] border-amber-500/20" },
  umpiring: { color: "text-purple-600", bg: "bg-purple-500/[0.08] border-purple-500/20" },
  physio: { color: "text-rose-600", bg: "bg-rose-500/[0.08] border-rose-500/20" },
  other: { color: "text-neutral-600", bg: "bg-neutral-500/[0.08] border-neutral-500/20" },
};

export default function MarketplaceClient() {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showCreate, setShowCreate] = useState(false);

  // Create form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<"gear" | "coaching" | "umpiring" | "physio" | "other">("gear");
  const [condition, setCondition] = useState<"new" | "like-new" | "used">("used");
  const [imageUrl, setImageUrl] = useState("");
  const [posting, setPosting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchListings(activeCategory).then((data) => {
      setListings(data);
      setLoading(false);
    });
  }, [activeCategory]);

  const handleCreate = async () => {
    if (!title.trim() || !price) return;
    setPosting(true);
    const ok = await createListing({
      title: title.trim(),
      description: desc.trim(),
      price: Number(price),
      category,
      condition: category === "gear" ? condition : "n/a",
      imageUrl: imageUrl.trim() || undefined,
    });
    setPosting(false);
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        setShowCreate(false);
        setSuccess(false);
        setTitle(""); setPrice(""); setDesc(""); setImageUrl("");
        fetchListings(activeCategory).then(setListings);
      }, 1500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-3">
            <ArrowLeftIcon size={16} />Home
          </Link>
          <h1 className="text-[28px] font-bold font-display text-neutral-900 tracking-tight">Marketplace</h1>
          <p className="text-[14px] text-neutral-500">Buy gear, find coaches, and book officials in your community.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white text-[13px] font-semibold shadow-[0_8px_24px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_32px_-8px_rgba(16,185,129,0.5)] transition-shadow"
        >
          <PlusIcon size={16} />
          Sell or Offer
        </motion.button>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap border transition-all",
              activeCategory === cat.id
                ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                : "bg-white text-neutral-600 border-black/[0.06] hover:border-black/[0.12]"
            )}
          >
            <cat.icon size={15} />
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="surface-card overflow-hidden animate-pulse">
              <div className="aspect-square bg-black/[0.04]" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-black/[0.06] rounded-full" />
                <div className="h-3 w-1/2 bg-black/[0.04] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <ShoppingBagIcon size={40} className="mx-auto text-neutral-300 mb-3" />
          <h3 className="text-[16px] font-semibold text-neutral-900 mb-1">No listings yet</h3>
          <p className="text-[13px] text-neutral-500">Be the first to post gear or offer your services.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((item, idx) => {
            const meta = categoryMeta[item.category] || categoryMeta.other;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 24, delay: idx * 0.03 }}
              >
                <Link href={`/${item.sellerUsername}`} className="block group">
                  <div className="surface-card overflow-hidden h-full flex flex-col group-hover:border-emerald-500/30 transition-all">
                    <div className="aspect-square bg-black/[0.03] relative overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                          <ShoppingBagIcon size={48} />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md bg-white/80", meta.color, meta.bg)}>
                          {item.category}
                        </span>
                      </div>
                      {item.condition && item.condition !== "n/a" && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
                            {item.condition}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-[15px] font-bold text-neutral-900 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-[12px] text-neutral-500 line-clamp-2 mb-3">{item.description}</p>
                      )}
                      <div className="mt-auto pt-3 border-t border-black/[0.05] flex items-center justify-between">
                        <p className="text-[16px] font-bold text-emerald-600">
                          {item.currency === "INR" ? "₹" : item.currency}{item.price.toLocaleString()}
                          {item.category !== "gear" && <span className="text-[11px] font-medium text-neutral-400">/session</span>}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <Avatar alt={item.sellerName} src={item.sellerAvatar} size="xs" />
                          <span className="text-[11px] font-medium text-neutral-500 truncate max-w-[60px]">{item.sellerName.split(" ")[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Listing Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => !posting && setShowCreate(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg surface-card p-6 shadow-xl max-h-[90vh] overflow-y-auto turfog-scroll"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[18px] font-bold font-display text-neutral-900">New Listing</h3>
                <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-lg hover:bg-black/[0.04] flex items-center justify-center text-neutral-400 transition-colors">
                  <XIcon size={18} />
                </button>
              </div>

              {success ? (
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/[0.12] flex items-center justify-center mx-auto mb-3">
                    <CheckCircleIcon size={28} className="text-emerald-600" />
                  </div>
                  <p className="text-[14px] font-semibold text-neutral-900">Listing posted!</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Category</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {categories.filter(c => c.id !== "all").map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setCategory(c.id as any)}
                          className={cn(
                            "flex flex-col items-center gap-1 p-2.5 rounded-xl border text-[11px] font-semibold transition-all",
                            category === c.id ? "border-emerald-500 bg-emerald-500/[0.06] text-emerald-700" : "border-black/[0.06] text-neutral-500 hover:border-black/[0.12]"
                          )}
                        >
                          <c.icon size={18} />
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={category === "gear" ? "e.g. Nike Mercurial Vapor 14" : "e.g. 1-on-1 Batting Coaching"}
                      className="w-full px-3.5 py-3 rounded-xl border border-black/[0.08] bg-white text-[14px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Price (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                        className="w-full px-3.5 py-3 rounded-xl border border-black/[0.08] bg-white text-[14px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] transition-all"
                      />
                    </div>
                    {category === "gear" && (
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Condition</label>
                        <select
                          value={condition}
                          onChange={(e) => setCondition(e.target.value as any)}
                          className="w-full px-3.5 py-3 rounded-xl border border-black/[0.08] bg-white text-[14px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] transition-all capitalize"
                        >
                          <option value="new">New</option>
                          <option value="like-new">Like New</option>
                          <option value="used">Used</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Description</label>
                    <textarea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      rows={3}
                      placeholder="Details, sizing, availability..."
                      className="w-full px-3.5 py-3 rounded-xl border border-black/[0.08] bg-white text-[14px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Image URL (optional)</label>
                    <input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-3 rounded-xl border border-black/[0.08] bg-white text-[14px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/[0.08] transition-all"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreate}
                    disabled={posting || !title.trim() || !price}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white text-[14px] font-semibold shadow-[0_8px_24px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_32px_-8px_rgba(16,185,129,0.5)] disabled:opacity-40 disabled:cursor-not-allowed transition-shadow mt-2"
                  >
                    {posting ? "Posting..." : "Post Listing"}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}