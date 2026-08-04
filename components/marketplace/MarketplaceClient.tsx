"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { fetchListings, createListing } from "@/lib/marketplace";
import type { Listing } from "@/lib/marketplace";
import { ArrowLeftIcon, MapPinIcon, PlusIcon, XIcon } from "@/components/SvgIcons";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "coaching", label: "Coaching" },
  { id: "equipment", label: "Equipment" },
  { id: "physio", label: "Physio" },
  { id: "venue", label: "Venues" },
  { id: "photography", label: "Photography" },
];

const categoryStyles: Record<string, string> = {
  coaching: "bg-electric-blue/10 text-electric-blue",
  equipment: "bg-emerald/10 text-emerald",
  physio: "bg-coral/10 text-coral",
  venue: "bg-gold/10 text-gold",
  photography: "bg-sunset-orange/10 text-sunset-orange",
};

export default function MarketplaceClient() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [busy, setBusy] = useState(false);

  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("coaching");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  const refresh = useCallback(async (catFilter: string) => {
    setLoading(true);
    setListings(await fetchListings(catFilter));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh("all");
  }, [refresh]);

  const onFilter = (c: string) => {
    setCategory(c);
    refresh(c);
  };

  const onCreate = async () => {
    if (busy || !title.trim()) return;
    setBusy(true);
    await createListing({
      title: title.trim(),
      category: cat,
      description: description.trim(),
      price: price === "" ? null : Number(price),
      location: location.trim(),
    });
    setBusy(false);
    setShowCreate(false);
    setTitle(""); setDescription(""); setPrice(""); setLocation("");
    await refresh(category);
  };

  return (
    <div className="min-h-screen bg-neutral-100 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-body-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeftIcon size={16} />
            Home
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display-sm font-display font-bold text-neutral-900">Marketplace</h1>
            <p className="text-body-sm text-neutral-500">Coaches, equipment, venues, and more.</p>
          </div>
          <Button variant="primary" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? <XIcon size={16} /> : <PlusIcon size={16} />}
            {showCreate ? "Close" : "Create listing"}
          </Button>
        </div>

        {showCreate && (
          <Card padding="lg">
            <h2 className="text-body-md font-semibold text-neutral-900 font-display mb-3">Create a listing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Listing title" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green sm:col-span-2" />
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm bg-white outline-none focus:border-primary-green">
                <option value="coaching">Coaching</option>
                <option value="equipment">Equipment</option>
                <option value="physio">Physio</option>
                <option value="venue">Venue</option>
                <option value="photography">Photography</option>
              </select>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (optional)" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green" />
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green sm:col-span-2" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2} className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green resize-none sm:col-span-2" />
            </div>
            <Button variant="primary" loading={busy} onClick={onCreate} className="mt-3">Publish listing</Button>
          </Card>
        )}

        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => onFilter(c.id)}
              className={`px-4 py-2 rounded-full text-body-xs font-medium whitespace-nowrap border transition-colors ${category === c.id ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200"}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-body-sm text-neutral-400 text-center py-8">Loading listings...</p>
        ) : listings.length === 0 ? (
          <p className="text-body-sm text-neutral-400 text-center py-8">No listings in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {listings.map((l) => (
              <Card key={l.id} padding="lg">
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-caption font-semibold capitalize ${categoryStyles[l.category] ?? "bg-neutral-100 text-neutral-600"}`}>
                    {l.category}
                  </span>
                  {l.price != null && (
                    <p className="text-body-md font-display font-bold text-neutral-900">₹{l.price}</p>
                  )}
                </div>
                <h3 className="text-body-md font-semibold text-neutral-900 mt-2">{l.title}</h3>
                <p className="text-body-sm text-neutral-600 mt-1">{l.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <Link href={`/${l.sellerUsername}`} className="text-body-xs font-medium text-electric-blue hover:underline">
                    {l.sellerName}
                  </Link>
                  {l.location && (
                    <span className="inline-flex items-center gap-1 text-caption text-neutral-400">
                      <MapPinIcon size={12} />
                      {l.location}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}