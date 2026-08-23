"use client";

import { Drawer } from "./Drawer";
import { X, CheckCircle2, XCircle, Target, DollarSign, Megaphone, ImageIcon } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  advertiser: string;
  status: "Live" | "Pending Review" | "Rejected" | "Paused";
  budget: number;
  spend: number;
  audience: string;
  location: string;
  adCopy: string;
}

export function AdvertisingReviewDrawer({ campaign, onClose, onReview }: { campaign: Campaign | null; onClose: () => void; onReview?: (campaignId: string, action: "approve" | "reject") => void }) {
  if (!campaign) return null;

  const handleAction = (action: "approve" | "reject") => {
    onReview?.(campaign.id, action);
    onClose();
  };

  return (
    <Drawer open={!!campaign} onClose={onClose}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <Megaphone className="text-indigo-600" size={18} />
            <h2 className="text-[15px] font-semibold text-neutral-900">Ad Creative Review</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-neutral-200 rounded-md text-neutral-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Campaign Info */}
          <div>
            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Campaign</p>
            <h3 className="text-[18px] font-bold text-neutral-900">{campaign.name}</h3>
            <p className="text-[13px] text-neutral-500">by {campaign.advertiser}</p>
          </div>

          {/* Creative Preview */}
          <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <div className="aspect-[16/9] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center relative">
              <ImageIcon className="text-white/50" size={48} />
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold rounded-md uppercase">
                Sponsored Preview
              </div>
            </div>
            <div className="p-4">
              <p className="text-[14px] text-neutral-800 leading-relaxed">{campaign.adCopy}</p>
              <button className="mt-3 w-full py-2 bg-neutral-900 text-white text-[12px] font-semibold rounded-lg hover:bg-neutral-800 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Targeting & Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                <Target size={12} /> Audience
              </div>
              <p className="text-[13px] font-medium text-neutral-900">{campaign.audience}</p>
              <p className="text-[12px] text-neutral-500 mt-1">{campaign.location}</p>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                <DollarSign size={12} /> Budget
              </div>
              <p className="text-[13px] font-medium text-neutral-900">₹{campaign.budget.toLocaleString()}</p>
              <p className="text-[12px] text-neutral-500 mt-1">Daily limit: ₹{Math.round(campaign.budget / 7).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        {campaign.status === "Pending Review" && (
          <div className="border-t border-neutral-200 p-4 bg-neutral-50 flex items-center gap-3">
            <button
              onClick={() => handleAction("reject")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-rose-200 text-rose-600 text-[13px] font-semibold rounded-lg hover:bg-rose-50 transition-colors"
            >
              <XCircle size={16} /> Reject (Policy)
            </button>
            <button
              onClick={() => handleAction("approve")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-[13px] font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <CheckCircle2 size={16} /> Approve & Go Live
            </button>
          </div>
        )}
      </div>
    </Drawer>
  );
}