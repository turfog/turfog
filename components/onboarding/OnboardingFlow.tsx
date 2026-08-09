"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { saveOnboarding } from "@/lib/onboarding";
import {
  FootballIcon,
  CricketIcon,
  PickleballIcon,
  PadelIcon,
  BadmintonIcon,
  MapPinIcon,
  ZapIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@/components/SvgIcons";

const SPORTS = [
  { id: "football", label: "Football", Icon: FootballIcon, tint: "text-primary-green", tintBg: "bg-primary-green/10" },
  { id: "box-cricket", label: "Box cricket", Icon: CricketIcon, tint: "text-electric-blue", tintBg: "bg-electric-blue/10" },
  { id: "pickleball", label: "Pickleball", Icon: PickleballIcon, tint: "text-emerald", tintBg: "bg-emerald/10" },
  { id: "padel", label: "Padel", Icon: PadelIcon, tint: "text-amber", tintBg: "bg-amber/10" },
  { id: "badminton", label: "Badminton", Icon: BadmintonIcon, tint: "text-sunset-orange", tintBg: "bg-sunset-orange/10" },
];

const PRESENCE_OPTIONS = [
  { id: "available-now", label: "Available now", sub: "Ready to play right away", dot: "bg-emerald" },
  { id: "in-30-min", label: "In 30 minutes", sub: "Heading out soon", dot: "bg-amber" },
  { id: "today", label: "Later today", sub: "Free sometime today", dot: "bg-electric-blue" },
  { id: "tonight", label: "Tonight", sub: "Up for an evening match", dot: "bg-purple-500" },
  { id: "weekend", label: "This weekend", sub: "Weekend games", dot: "bg-sunset-orange" },
];

const TITLES = ["What do you play?", "When are you free?", "Where do you play?"];
const SUBTITLES = [
  "Pick your sports and we'll personalize your experience.",
  "Set your availability so nearby players can find you.",
  "Your city helps us show nearby players and matches.",
];

const TOTAL_STEPS = 3;

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sports, setSports] = useState<string[]>([]);
  const [presence, setPresence] = useState("available-now");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleSport = (id: string) => {
    setSports((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const finish = async () => {
    setSaving(true);
    await saveOnboarding({ sports, city: city.trim(), presence });
    setSaving(false);
    router.push("/");
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else finish();
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-green rounded-2xl mb-4">
            <ZapIcon size={28} className="text-white" />
          </div>
          <h1 className="text-display-sm font-bold text-neutral-900 font-display">{TITLES[step]}</h1>
          <p className="text-body-sm text-neutral-500 mt-1">{SUBTITLES[step]}</p>
        </div>

        <div className="flex items-center gap-1.5 mb-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn("h-1 flex-1 rounded-full transition-colors", i <= step ? "bg-primary-green" : "bg-neutral-200")}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200 shadow-card p-6">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="sports"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
                className="grid grid-cols-2 gap-3"
              >
                {SPORTS.map((s) => {
                  const selected = sports.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSport(s.id)}
                      className={cn(
                        "relative flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all",
                        selected ? "border-primary-green bg-primary-green/5" : "border-neutral-200 hover:border-neutral-300"
                      )}
                    >
                      <span className={cn("flex items-center justify-center w-11 h-11 rounded-xl", s.tintBg, s.tint)}>
                        <s.Icon size={22} />
                      </span>
                      <span className="text-body-xs font-semibold text-neutral-800">{s.label}</span>
                      {selected && (
                        <span className="absolute top-2 right-2 text-primary-green">
                          <CheckCircleIcon size={16} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="presence"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
                className="space-y-2"
              >
                {PRESENCE_OPTIONS.map((o) => {
                  const selected = presence === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => setPresence(o.id)}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all",
                        selected ? "border-primary-green bg-primary-green/5" : "border-neutral-200 hover:border-neutral-300"
                      )}
                    >
                      <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", o.dot)} />
                      <span className="flex-1 min-w-0">
                        <span className="block text-body-sm font-semibold text-neutral-900">{o.label}</span>
                        <span className="block text-caption text-neutral-400">{o.sub}</span>
                      </span>
                      {selected && <CheckCircleIcon size={18} className="text-primary-green flex-shrink-0" />}
                    </button>
                  );
                })}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="city"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
              >
                <Input
                  label="Your city"
                  value={city}
                  onChange={setCity}
                  placeholder="e.g. Mumbai"
                  icon={<MapPinIcon size={18} />}
                />
                <p className="text-caption text-neutral-400 mt-3">You can change this anytime in settings.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-3 mt-6">
            {step > 0 && (
              <Button variant="outline" onClick={back}>
                <ArrowLeftIcon size={16} />
                Back
              </Button>
            )}
            <Button fullWidth loading={saving} onClick={next}>
              {step === TOTAL_STEPS - 1 ? "Finish" : "Continue"}
            </Button>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full text-center text-caption text-neutral-400 hover:text-neutral-600 mt-3"
          >
            Skip for now
          </button>
        </div>
      </motion.div>
    </div>
  );
}