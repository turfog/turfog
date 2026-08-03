"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { fetchMyBookings, fetchReviewedBookingIds, markBookingCompleted, submitReview } from "@/lib/officials";
import type { MyBooking } from "@/lib/officials";
import { ArrowLeftIcon, CalendarIcon, StarIcon, CheckCircleIcon, ClockIcon, ShieldIcon } from "@/components/SvgIcons";

function formatMatchDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function statusMeta(status: string): { label: string; cls: string } {
  switch (status) {
    case "requested": return { label: "Pending", cls: "bg-neutral-100 text-neutral-500" };
    case "accepted": return { label: "Accepted", cls: "bg-electric-blue/10 text-electric-blue" };
    case "completed": return { label: "Completed", cls: "bg-emerald/10 text-emerald" };
    case "rejected": return { label: "Rejected", cls: "bg-coral/10 text-coral" };
    default: return { label: status, cls: "bg-neutral-100 text-neutral-500" };
  }
}

function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n)} className={cn("transition-colors", n <= value ? "text-amber" : "text-neutral-300 hover:text-neutral-400")}>
          <StarIcon size={22} />
        </button>
      ))}
    </div>
  );
}

export default function MyBookingsClient() {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [b, r] = await Promise.all([fetchMyBookings(), fetchReviewedBookingIds()]);
    setBookings(b);
    setReviewedIds(r);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onComplete = async (bookingId: string) => {
    if (busy) return;
    setBusy(bookingId);
    await markBookingCompleted(bookingId);
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "completed" } : b)));
    setBusy(null);
  };

  const onReview = async (bookingId: string, officialId: string, rating: number, comment: string) => {
    if (busy || rating === 0) return;
    setBusy(bookingId);
    const ok = await submitReview(bookingId, officialId, rating, comment);
    if (ok) setReviewedIds((prev) => new Set(prev).add(bookingId));
    setBusy(null);
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <Link href="/" className="flex items-center gap-2 text-body-xs text-neutral-400 hover:text-neutral-600 transition-colors mb-2">
            <ArrowLeftIcon size={14} />
            Home
          </Link>
          <div className="flex items-center gap-2">
            <CalendarIcon size={22} className="text-primary-green" />
            <h1 className="text-display-sm font-bold text-neutral-900 font-display">My official bookings</h1>
          </div>
          <p className="text-body-sm text-neutral-500">Track hire requests, mark matches completed, and rate officials.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-3">
        {loading ? (
          [0, 1].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/2 rounded bg-neutral-100 animate-pulse" />
                <div className="h-2.5 w-1/3 rounded bg-neutral-100 animate-pulse" />
              </div>
            </div>
          ))
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3"><ShieldIcon size={26} className="text-neutral-300" /></div>
            <p className="text-body-sm text-neutral-500">No official bookings yet</p>
            <p className="text-caption text-neutral-400 mt-1">Find an official and request to hire them.</p>
            <Link href="/officials" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-primary-green text-white text-body-sm font-semibold rounded-xl">Browse officials</Link>
          </div>
        ) : (
          bookings.map((b) => (
            <BookingCard key={b.id} booking={b} reviewed={reviewedIds.has(b.id)} busy={busy} onComplete={onComplete} onReview={onReview} />
          ))
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, reviewed, busy, onComplete, onReview }: {
  booking: MyBooking;
  reviewed: boolean;
  busy: string | null;
  onComplete: (id: string) => void;
  onReview: (bookingId: string, officialId: string, rating: number, comment: string) => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const sm = statusMeta(booking.status);

  return (
    <Card padding="lg">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <Link href={`/officials/${booking.officialUsername}`} className="text-body-sm font-semibold text-neutral-900 hover:text-electric-blue transition-colors">
            {booking.officialName}
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-caption text-neutral-400 mt-0.5">
            <span className="capitalize">{booking.sport}</span>
            <span className="flex items-center gap-0.5"><ClockIcon size={11} />{formatMatchDate(booking.matchDate)}</span>
            {booking.teamName && <span>· {booking.teamName}</span>}
          </div>
          {booking.note && <p className="text-body-xs text-neutral-500 mt-1.5">{booking.note}</p>}
        </div>
        <span className={cn("px-3 py-1.5 rounded-xl text-caption font-semibold", sm.cls)}>{sm.label}</span>
      </div>

      {booking.status === "accepted" && (
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <Button size="sm" variant="primary" loading={busy === booking.id} onClick={() => onComplete(booking.id)}>
            <CheckCircleIcon size={15} />
            Mark completed
          </Button>
        </div>
      )}

      {booking.status === "completed" && !reviewed && (
        <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3">
          <p className="text-body-xs font-semibold text-neutral-700">Rate this official</p>
          <StarRating value={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience (optional)"
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-body-sm outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 resize-none placeholder:text-neutral-400"
          />
          <Button size="sm" variant="primary" disabled={rating === 0} loading={busy === booking.id} onClick={() => onReview(booking.id, booking.officialId, rating, comment.trim())}>
            Submit review
          </Button>
        </div>
      )}

      {booking.status === "completed" && reviewed && (
        <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2 text-body-xs text-emerald">
          <CheckCircleIcon size={15} />
          You already reviewed this official.
        </div>
      )}
    </Card>
  );
}