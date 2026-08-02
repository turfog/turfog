"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Avatar from "@/components/ui/Avatar";
import {
  ArrowLeftIcon,
  UserIcon,
  ShieldIcon,
  BellIcon,
  LockIcon,
  LogOutIcon,
  MapPinIcon,
} from "@/components/SvgIcons";

const sections = [
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "privacy", label: "Privacy", icon: ShieldIcon },
  { id: "notifications", label: "Notifications", icon: BellIcon },
  { id: "security", label: "Security", icon: LockIcon },
] as const;

type SectionId = (typeof sections)[number]["id"];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("profile");
  const [fullName, setFullName] = useState("Rahul Sharma");
  const [bio, setBio] = useState("Weekend football warrior. 5-a-side specialist.");
  const [city, setCity] = useState("Mumbai");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <Link href="/dashboard" className="flex items-center gap-2 text-body-xs text-neutral-400 hover:text-neutral-600 transition-colors mb-2">
            <ArrowLeftIcon size={14} />
            Dashboard
          </Link>
          <h1 className="text-display-sm font-bold text-neutral-900 font-display">
            Settings
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          {/* Sidebar */}
          <div className="flex md:flex-col gap-1 overflow-x-auto scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-body-sm font-medium whitespace-nowrap transition-all",
                  activeSection === section.id
                    ? "bg-primary-green/10 text-primary-green"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                <section.icon size={18} />
                {section.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div>
            {/* Profile Section */}
            {activeSection === "profile" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card padding="lg">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar alt={fullName} size="lg" />
                    <div>
                      <Button size="sm" variant="outline">Change photo</Button>
                      <p className="text-caption text-neutral-400 mt-1">JPG, PNG. Max 5MB.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Input label="Full name" value={fullName} onChange={setFullName} icon={<UserIcon size={18} />} />
                    <div>
                      <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">Bio</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-body-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 resize-none transition-all"
                      />
                    </div>
                    <Input label="City" value={city} onChange={setCity} icon={<MapPinIcon size={18} />} />
                    <Button onClick={handleSave}>
                      {saved ? "Saved" : "Save changes"}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Privacy Section */}
            {activeSection === "privacy" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card padding="lg">
                  <h3 className="text-body-sm font-semibold text-neutral-900 mb-4">Profile visibility</h3>
                  <div className="space-y-3">
                    {["Public profile", "Show online status", "Show availability", "Show match stats", "Allow messages from strangers"].map((item) => (
                      <div key={item} className="flex items-center justify-between py-2">
                        <span className="text-body-sm text-neutral-700">{item}</span>
                        <div className="w-11 h-6 bg-primary-green rounded-full relative cursor-pointer">
                          <span className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card padding="lg">
                  <h3 className="text-body-sm font-semibold text-neutral-900 mb-4">Notification preferences</h3>
                  <div className="space-y-3">
                    {["Match invites", "Nearby games", "Friend requests", "Comments and likes", "Tournament updates", "Community activity"].map((item) => (
                      <div key={item} className="flex items-center justify-between py-2">
                        <span className="text-body-sm text-neutral-700">{item}</span>
                        <div className="w-11 h-6 bg-primary-green rounded-full relative cursor-pointer">
                          <span className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card padding="lg">
                  <h3 className="text-body-sm font-semibold text-neutral-900 mb-4">Password</h3>
                  <div className="space-y-4">
                    <Input label="Current password" type="password" value="" onChange={() => {}} icon={<LockIcon size={18} />} />
                    <Input label="New password" type="password" value="" onChange={() => {}} icon={<LockIcon size={18} />} />
                    <Button>Update password</Button>
                  </div>
                </Card>
                <Card padding="lg">
                  <h3 className="text-body-sm font-semibold text-neutral-900 mb-2">Two-factor authentication</h3>
                  <p className="text-body-xs text-neutral-500 mb-4">Add an extra layer of security to your account.</p>
                  <Button variant="outline">Enable 2FA</Button>
                </Card>
                <Card padding="lg" className="border-coral/20">
                  <h3 className="text-body-sm font-semibold text-coral mb-2">Danger zone</h3>
                  <p className="text-body-xs text-neutral-500 mb-4">Permanently delete your account and all associated data.</p>
                  <Button variant="danger">
                    <LogOutIcon size={16} />
                    Delete account
                  </Button>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
