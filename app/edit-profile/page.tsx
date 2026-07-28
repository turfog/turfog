"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { profileSchema, type ProfileInput } from "@/lib/validators";
import { ROUTES, STORAGE_BUCKETS } from "@/lib/constants";
import { ChevronLeftIcon, AlertCircleIcon, CheckCircleIcon, CameraIcon } from "@/components/SvgIcons";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Avatar from "@/components/ui/Avatar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

export default function EditProfilePage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProfileInput>({
    fullName: "",
    bio: "",
    phone: "",
    city: "",
  });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileInput, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push(ROUTES.SIGN_IN);
          return;
        }

        const { data, error } = await supabase
          .from("players")
          .select("*")
          .eq("auth_id", user.id)
          .single();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const player = data as any;

        if (error || !player) {
          console.error("Error fetching profile:", error?.message);
          return;
        }

        setFormData({
          fullName: player.full_name || "",
          bio: player.bio || "",
          phone: player.phone || "",
          city: player.city || "",
        });
        setProfilePhoto(player.profile_photo || null);
        setCoverPhoto(player.cover_photo || null);
      } catch {
        console.error("Failed to fetch profile");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [supabase, router]);

  const handleChange = (field: keyof ProfileInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (serverError) setServerError(null);
  };

  const handleProfilePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setServerError("Profile photo must be less than 5MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setServerError("Only JPEG, PNG, and WebP images are allowed");
      return;
    }

    setProfilePhotoFile(file);
    setProfilePhoto(URL.createObjectURL(file));
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setServerError("Cover photo must be less than 10MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setServerError("Only JPEG, PNG, and WebP images are allowed");
      return;
    }

    setCoverPhotoFile(file);
    setCoverPhoto(URL.createObjectURL(file));
  };

  const uploadImage = async (
    file: File,
    bucket: string,
    userId: string
  ): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProfileInput, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ProfileInput;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(ROUTES.SIGN_IN);
        return;
      }

      let profilePhotoUrl = profilePhoto;
      if (profilePhotoFile) {
        profilePhotoUrl = await uploadImage(
          profilePhotoFile,
          STORAGE_BUCKETS.PROFILE_PHOTOS,
          user.id
        );
      }

      let coverPhotoUrl = coverPhoto;
      if (coverPhotoFile) {
        coverPhotoUrl = await uploadImage(
          coverPhotoFile,
          STORAGE_BUCKETS.COVER_PHOTOS,
          user.id
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase
        .from("players") as any)
        .update({
          full_name: formData.fullName,
          bio: formData.bio,
          phone: formData.phone,
          city: formData.city,
          profile_photo: profilePhotoUrl || "",
          cover_photo: coverPhotoUrl || "",
          updated_at: new Date().toISOString(),
        })
        .eq("auth_id", user.id);

      if (updateError) {
        setServerError(updateError.message);
        return;
      }

      setIsSuccess(true);

      setTimeout(() => {
        router.push(ROUTES.DASHBOARD);
        router.refresh();
      }, 1500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-body-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ChevronLeftIcon size={18} />
            Back
          </button>
          <h1 className="text-body-lg font-semibold text-neutral-900">
            Edit profile
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 p-3 mb-6 bg-emerald/10 border border-emerald/20 rounded-lg"
              >
                <CheckCircleIcon size={18} className="text-emerald" />
                <p className="text-body-sm text-emerald">
                  Profile updated successfully
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-2 p-3 mb-6 bg-coral/10 border border-coral/20 rounded-lg"
                role="alert"
              >
                <AlertCircleIcon
                  size={18}
                  className="text-coral flex-shrink-0 mt-0.5"
                />
                <p className="text-body-sm text-coral">{serverError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <motion.div
                variants={itemVariants}
                className="relative h-40 bg-gradient-to-r from-primary-green/20 to-electric-blue/20"
              >
                {coverPhoto && (
                  <img
                    src={coverPhoto}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                )}
                <label className="absolute bottom-3 right-3 cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleCoverPhotoChange}
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/50 text-white text-body-xs rounded-lg backdrop-blur-sm hover:bg-black/60 transition-colors">
                    <CameraIcon size={14} />
                    Change cover
                  </span>
                </label>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="px-6 -mt-10 relative z-10"
              >
                <div className="relative inline-block">
                  <Avatar
                    src={profilePhoto}
                    alt={formData.fullName || "Profile"}
                    size="2xl"
                    isOnline
                  />
                  <button
                    type="button"
                    onClick={handleProfilePhotoClick}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-electric-blue text-white rounded-full flex items-center justify-center shadow-md hover:bg-electric-blue-hover transition-colors"
                  >
                    <CameraIcon size={14} />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                />
              </motion.div>

              <div className="p-6 flex flex-col gap-4">
                <Input
                  label="Full name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  error={errors.fullName}
                  required
                />

                <div>
                  <label className="block text-body-sm font-medium text-neutral-700 mb-1.5">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Tell other players about yourself..."
                    rows={4}
                    maxLength={500}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2.5 text-body-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 transition-all duration-200 resize-none"
                  />
                  <p className="text-body-xs text-neutral-400 mt-1 text-right">
                    {formData.bio.length}/500
                  </p>
                </div>

                <Input
                  label="Phone number"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  error={errors.phone}
                />

                <Input
                  label="City"
                  type="text"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  error={errors.city}
                />
              </div>

              <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  theme="neutral"
                  size="lg"
                  fullWidth
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  theme="green"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                >
                  Save changes
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}