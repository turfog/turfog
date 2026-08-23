"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Sparkles, Zap } from "lucide-react";

interface CopilotData { label: string; value: string; change?: string; up?: boolean }
interface CopilotAnswer {
  answer: string;
  explanation: string;
  data?: CopilotData[];
  recommendation?: string;
  records?: string[];
}
interface Message { role: "user" | "ai"; text?: string; payload?: CopilotAnswer }

function askCopilot(q: string): CopilotAnswer {
  const s = q.toLowerCase();

  if (s.includes("registration") || (s.includes("drop") && s.includes("user")) || s.includes("signups")) {
    return {
      answer: "Registrations dropped 14% yesterday, driven almost entirely by Chennai.",
      explanation: "The drop is not platform-wide. Mumbai and Bangalore held steady. Chennai fell 31% after the Instagram ad set for that geo was paused at 2 PM (budget exhausted). Organic signups were flat, confirming this is a paid-acquisition issue, not a product issue.",
      data: [
        { label: "Chennai", value: "-31%", change: "-31%", up: false },
        { label: "Mumbai", value: "+2%", change: "+2%", up: true },
        { label: "Bangalore", value: "+1%", change: "+1%", up: true },
      ],
      recommendation: "Raise the Chennai ad budget cap by 20% and enable auto-rebalance so a geo never silently exhausts mid-day.",
      records: ["Campaign: Chennai Football Push (#AD-88)", "Ad Set paused at 14:02"],
    };
  }

  if (s.includes("sport") || s.includes("grow") || s.includes("fastest")) {
    return {
      answer: "Pickleball is your fastest-growing sport (+28% MoM), and it's under-monetized.",
      explanation: "Pickleball signups and matches are growing 3-4x faster than football, but marketplace supply (paddles, courts) and ad inventory for it are thin. This is a supply gap you can exploit before competitors notice.",
      data: [
        { label: "Pickleball", value: "+28%", change: "+28%", up: true },
        { label: "Football", value: "+11%", change: "+11%", up: true },
        { label: "Box Cricket", value: "+7%", change: "+7%", up: true },
      ],
      recommendation: "Launch a Pickleball seller recruitment drive and a featured Pickleball marketplace rail this week.",
      records: ["Growth report: Sport velocity", "Marketplace: Pickleball inventory"],
    };
  }

  if (s.includes("campaign") || s.includes("roi") || s.includes("ad")) {
    return {
      answer: "Two campaigns are burning budget with poor ROI: #AD-71 and #AD-64.",
      explanation: "#AD-71 (Pro Gear Clearance) has a 0.4% CTR and ROAS of 0.7x — the creative is being ignored. #AD-64 has high CTR but 0 conversions, indicating a broken landing/deep link. Both should be paused before more spend is wasted.",
      data: [
        { label: "#AD-71 ROAS", value: "0.7x", change: "poor", up: false },
        { label: "#AD-64 Conv.", value: "0", change: "broken", up: false },
      ],
      recommendation: "Pause both, request new creative for #AD-71, and fix the deep link on #AD-64 before re-approving.",
      records: ["Campaign #AD-71", "Campaign #AD-64"],
    };
  }

  if (s.includes("churn") || s.includes("risk") || s.includes("inactive")) {
    return {
      answer: "4,200 users show high probability of churning in the next 14 days.",
      explanation: "The strongest churn signals are: played a match but got no follow-up invite (62%), and a recent no-show penalty with no subsequent activity (21%). These users are recoverable with a well-timed nudge, not a discount.",
      data: [
        { label: "High risk", value: "4,200", change: "14-day window", up: false },
        { label: "No invite", value: "62%", change: "top signal", up: false },
      ],
      recommendation: "Trigger a 'Your team misses you' re-engagement push to the no-invite segment — social, not promotional.",
      records: ["Segment: churn_risk_high", "Automation: reengage_dormant"],
    };
  }

  if (s.includes("cancel")) {
    return {
      answer: "Match cancellations rose 22%, concentrated in Mumbai weekend football.",
      explanation: "The dominant cause is last-minute player drop-outs leaving squads short. Matches with a confirmed backup/waitlist cancel 4x less often. The fix is operational, not marketing.",
      data: [
        { label: "Cancellations", value: "+22%", change: "WoW", up: false },
        { label: "With waitlist", value: "-75%", change: "cancel rate", up: true },
      ],
      recommendation: "Auto-enable waitlists for all weekend football matches and alert captains 6h before kickoff if a slot is open.",
      records: ["Match Reliability dashboard"],
    };
  }

  if (s.includes("summar") || s.includes("today") || s.includes("attention")) {
    return {
      answer: "Today: revenue healthy, one critical payment issue, and a Chennai acquisition gap.",
      explanation: "Marketplace GMV is pacing +8% and ad revenue +18%. However, payment failure rate is at 6.8% (threshold 3%) — likely a UPI provider issue — and Chennai registrations are down after an ad-set pause. Everything else is green.",
      data: [
        { label: "GMV", value: "+8%", change: "pacing", up: true },
        { label: "Ad Rev", value: "+18%", change: "pacing", up: true },
        { label: "Pay failures", value: "6.8%", change: "critical", up: false },
      ],
      recommendation: "Priorities: (1) engage the payment provider, (2) restore Chennai ad budget, (3) review the two poor-ROI campaigns.",
      records: ["Alerts: payment failure", "Alerts: Chennai drop"],
    };
  }

  return {
    answer: "I can analyze growth, revenue, campaigns, churn, cancellations, and give you a daily summary.",
    explanation: "Try asking: 'Why did registrations drop?', 'Which sport is growing fastest?', 'Which campaigns have poor ROI?', 'Show churn risk', or 'Summarize today'.",
  };
}

const suggestions = [
  "Why did registrations drop yesterday?",
  "Which sport is growing fastest?",
  "Which campaigns have poor ROI?",
  "Show me churn risk",
  "Summarize today's platform",
];

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text: string) => {
    if (!text.trim() || thinking) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", payload: askCopilot(text) }]);
      setThinking(false);
    }, 900);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-[18px] font-bold text-neutral-900 tracking-tight">Platform Copilot</h1>
          <p className="text-[12px] text-neutral-500">Ask anything about your business. AI never takes destructive action without you.</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 && !thinking && (
          <div className="text-center py-16">
            <Sparkles size={32} className="mx-auto text-indigo-400 mb-3" />
            <p className="text-[14px] font-semibold text-neutral-900 mb-1">Your AI co-founder is ready</p>
            <p className="text-[12px] text-neutral-500 mb-6">Ask in plain English. Get data-backed answers.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="px-3 py-1.5 bg-white border border-neutral-200 rounded-full text-[12px] font-medium text-neutral-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((m, i) =>
            m.role === "user" ? (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                <div className="max-w-[80%] bg-neutral-900 text-white text-[13px] rounded-2xl rounded-br-md px-4 py-2.5">{m.text}</div>
              </motion.div>
            ) : (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="flex-1 bg-white border border-neutral-200 rounded-2xl rounded-tl-md p-4 space-y-3">
                  <p className="text-[14px] font-semibold text-neutral-900">{m.payload!.answer}</p>
                  <p className="text-[13px] text-neutral-600 leading-relaxed">{m.payload!.explanation}</p>
                  {m.payload!.data && (
                    <div className="grid grid-cols-3 gap-2">
                      {m.payload!.data.map((d) => (
                        <div key={d.label} className="bg-neutral-50 border border-neutral-100 rounded-lg p-2 text-center">
                          <p className={`text-[14px] font-bold ${d.up ? "text-emerald-600" : "text-rose-600"}`}>{d.value}</p>
                          <p className="text-[10px] text-neutral-500">{d.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {m.payload!.recommendation && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex items-start gap-2">
                      <Zap size={14} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[12px] text-indigo-800"><span className="font-bold">Recommended:</span> {m.payload!.recommendation}</p>
                    </div>
                  )}
                  {m.payload!.records && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.payload!.records.map((r) => (
                        <span key={r} className="px-2 py-1 bg-neutral-100 rounded-md text-[10px] font-medium text-neutral-600">{r}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {thinking && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-white border border-neutral-200 rounded-2xl rounded-tl-md px-4 py-3 flex gap-1">
              {[0, 1, 2].map((d) => (
                <motion.span key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask the Copilot anything about your platform..."
          className="flex-1 px-4 py-3 bg-white border border-neutral-200 rounded-xl text-[13px] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || thinking}
          className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}