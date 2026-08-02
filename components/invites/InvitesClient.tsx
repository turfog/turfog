"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { fetchMyTeamInvites, respondToInviteStatus } from "@/lib/teams";
import type { TeamInviteItem } from "@/lib/teams";
import type { SportId } from "@/types";
import {
  TrophyIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  XIcon,
  StarIcon,
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
} from "@/components/SvgIcons";

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

type Response = "accepted" | "declined" | "interested" | "available_later";

export default function InvitesClient() {
  const [invites, setInvites] = useState<TeamInviteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setInvites(await fetchMyTeamInvites());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const respond = async (teamId: string, status: Response) => {
    if (busy) return;
    setBusy(teamId + status);
    setInvites((prev) => prev.filter((i) => i.teamId !== teamId));
    await respondToInviteStatus(teamId, status);
    setBusy(null);
    void refresh();
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
            <TrophyIcon size={22} className="text-primary-green" />
            <h1 className="text-display-sm font-bold text-neutral-900 font-display">Team invites</h1>
          </div>
          <p className="text-body-sm text-neutral-500">Teams that want you on their roster.</p>
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
        ) : invites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
              <TrophyIcon size={26} className="text-neutral-300" />
            </div>
            <p className="text-body-sm text-neutral-500">No pending team invites</p>
            <p className="text-caption text-neutral-400 mt-1">When a team invites you, it will appear here.</p>
          </div>
        ) : (
          invites.map((inv) => (
            <Card key={inv.teamId} padding="lg" className="hover:border-primary-green/30">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-primary-green overflow-hidden flex-shrink-0">
                  {inv.teamLogo ? <img src={inv.teamLogo} alt={inv.teamName} className="w-full h-full object-cover" /> : <TrophyIcon size={22} />}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/teams/${inv.teamSlug}`} className="text-body-sm font-semibold text-neutral-900 hover:text-electric-blue transition-colors">{inv.teamName}</Link>
                  <div className="flex items-center gap-2 text-caption text-neutral-400 mt-0.5">
                    <span className="inline-flex items-center gap-1">{sportIcon[inv.teamSport]}{sportName[inv.teamSport]}</span>
                    <span>· invited {timeAgo(inv.invitedAt)}</span>
                  </div>
                  <p className="text-body-xs text-neutral-500 mt-1.5">wants you to join the team.</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="primary" loading={busy === inv.teamId + "accepted"} onClick={() => respond(inv.teamId, "accepted")}>
                  <CheckCircleIcon size={15} />
                  Accept
                </Button>
                <Button size="sm" variant="outline" loading={busy === inv.teamId + "interested"} onClick={() => respond(inv.teamId, "interested")}>
                  <StarIcon size={15} />
                  Interested
                </Button>
                <Button size="sm" variant="outline" loading={busy === inv.teamId + "available_later"} onClick={() => respond(inv.teamId, "available_later")}>
                  <ClockIcon size={15} />
                  Available later
                </Button>
                <button
                  onClick={() => respond(inv.teamId, "declined")}
                  disabled={busy === inv.teamId + "declined"}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-body-xs font-medium text-coral hover:bg-coral/5 disabled:opacity-40 transition-colors"
                >
                  <XIcon size={15} />
                  Decline
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}