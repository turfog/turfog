"use client";

import { Drawer } from "./Drawer";
import { X, MessageSquare, MapPin, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

interface Order {
  id: string;
  product: string;
  buyer: string;
  seller: string;
  amount: number;
  status: string;
  disputeReason?: string;
}

export function MarketplaceDisputeDrawer({ order, onClose }: { order: Order | null; onClose: () => void }) {
  if (!order) return null;

  const handleAction = (action: "release" | "refund") => {
    console.log(`[ESCROW ACTION] Order ${order.id}: ${action}`);
    alert(`Funds ${action === "release" ? "released to seller" : "refunded to buyer"}! (Mock action logged to Audit)`);
    onClose();
  };

  return (
    <Drawer open={!!order} onClose={onClose}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-amber-600" size={18} />
            <h2 className="text-[15px] font-semibold text-neutral-900">Escrow Dispute Resolution</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-neutral-200 rounded-md text-neutral-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Order Context */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Order Context</p>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div>
                <p className="text-neutral-500">Order ID</p>
                <p className="font-mono font-medium text-neutral-900">{order.id}</p>
              </div>
              <div>
                <p className="text-neutral-500">Amount in Escrow</p>
                <p className="font-bold text-emerald-600 text-[16px]">₹{order.amount}</p>
              </div>
              <div>
                <p className="text-neutral-500">Buyer</p>
                <p className="font-medium text-neutral-900">{order.buyer}</p>
              </div>
              <div>
                <p className="text-neutral-500">Seller</p>
                <p className="font-medium text-neutral-900">{order.seller}</p>
              </div>
            </div>
          </div>

          {/* The Dispute */}
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
            <p className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider mb-2">Dispute Reason</p>
            <p className="text-[13px] text-neutral-900 font-medium">"{order.disputeReason || "Buyer claims item was not as described."}"</p>
          </div>

          {/* Time-Machine: Evidence */}
          <div>
            <h3 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock size={12} /> Platform Evidence (Time-Machine)
            </h3>
            <div className="space-y-3">
              {/* Chat Logs */}
              <div className="border border-neutral-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2 text-[12px] font-semibold text-neutral-700">
                  <MessageSquare size={14} /> Pre-Meetup Chat Logs
                </div>
                <div className="space-y-2 text-[12px] text-neutral-600 bg-neutral-50 p-2 rounded max-h-32 overflow-y-auto">
                  <p><span className="font-bold text-blue-600">Buyer:</span> Are the shoes size 10?</p>
                  <p><span className="font-bold text-emerald-600">Seller:</span> Yes, exactly UK 10. Barely used.</p>
                  <p><span className="font-bold text-blue-600">Buyer:</span> Okay, I'll meet you at the turf gate at 6 PM.</p>
                </div>
              </div>

              {/* Location Pings */}
              <div className="border border-neutral-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2 text-[12px] font-semibold text-neutral-700">
                  <MapPin size={14} /> Location Proximity at Meetup Time
                </div>
                <div className="flex items-center gap-3 text-[12px]">
                  <div className="flex-1 bg-emerald-50 text-emerald-700 p-2 rounded text-center border border-emerald-200">
                    <p className="font-bold">Buyer GPS</p>
                    <p className="text-[10px]">Within 10m of Turf Gate</p>
                  </div>
                  <div className="flex-1 bg-emerald-50 text-emerald-700 p-2 rounded text-center border border-emerald-200">
                    <p className="font-bold">Seller GPS</p>
                    <p className="text-[10px]">Within 15m of Turf Gate</p>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 mt-2 italic">System verifies both parties were physically present at the agreed location for 14 minutes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="border-t border-neutral-200 p-4 bg-neutral-50 flex items-center gap-3">
          <button
            onClick={() => handleAction("release")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-[13px] font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <CheckCircle2 size={16} /> Release Funds to Seller
          </button>
          <button
            onClick={() => handleAction("refund")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 text-white text-[13px] font-semibold rounded-lg hover:bg-rose-700 transition-colors shadow-sm"
          >
            <XCircle size={16} /> Refund Buyer
          </button>
        </div>
      </div>
    </Drawer>
  );
}