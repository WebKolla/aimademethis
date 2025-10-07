"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile, uploadAvatar } from "@/lib/profiles/actions";
import { profileUpdateSchema, type ProfileUpdateData } from "@/lib/profiles/schemas";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileEditFormProps {
  profile: Profile;
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<ProfileUpdateData>({
    full_name: profile.full_name || "",
    bio: profile.bio || "",
    website: profile.website || "",
    twitter: profile.twitter || "",
    github: profile.github || "",
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({});

    try {
      // Upload avatar if changed
      if (avatarFile) {
        const result = await uploadAvatar(avatarFile);
        if (result.error) {
          setError(result.error);
          setIsSubmitting(false);
          return;
        }
      }

      // Validate on client side first
      const validation = profileUpdateSchema.safeParse(formData);
      if (!validation.success) {
        setFieldErrors(validation.error.flatten().fieldErrors);
        setError("Please fix the errors below");
        setIsSubmitting(false);
        return;
      }

      // Update profile
      const result = await updateProfile(formData);

      if (result?.error) {
        setError(result.error);
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-900/20 border border-red-800 p-4 text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-900/20 border border-green-800 p-4 text-green-400">
          Profile updated successfully!
        </div>
      )}

      {/* Avatar Upload */}
      <div>
        <Label className="text-gray-300">Profile Picture</Label>
        <div className="mt-2 flex items-center gap-4">
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Avatar preview"
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-teal-900/30 flex items-center justify-center text-2xl">
              👤
            </div>
          )}
          <div>
            <Input
              id="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarChange}
              className="text-sm bg-gray-800 border-gray-700 text-white"
            />
            <p className="mt-1 text-xs text-gray-500">
              JPEG, PNG, WebP, or GIF. Max 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <Label htmlFor="full_name" className="text-gray-300">Full Name</Label>
        <Input
          id="full_name"
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
          placeholder="Your full name"
          className="mt-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
        />
        {fieldErrors.full_name && (
          <p className="mt-1 text-sm text-red-400">{fieldErrors.full_name[0]}</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <Label htmlFor="bio" className="text-gray-300">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell us about yourself..."
          rows={4}
          className="mt-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.bio?.length || 0}/500 characters
        </p>
        {fieldErrors.bio && (
          <p className="mt-1 text-sm text-red-400">{fieldErrors.bio[0]}</p>
        )}
      </div>

      {/* Website */}
      <div>
        <Label htmlFor="website" className="text-gray-300">Website</Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
          placeholder="https://example.com"
          className="mt-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
        />
        {fieldErrors.website && (
          <p className="mt-1 text-sm text-red-400">{fieldErrors.website[0]}</p>
        )}
      </div>

      {/* Twitter */}
      <div>
        <Label htmlFor="twitter" className="text-gray-300">Twitter Handle</Label>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-gray-400">@</span>
          <Input
            id="twitter"
            type="text"
            value={formData.twitter}
            onChange={(e) => setFormData((prev) => ({ ...prev, twitter: e.target.value }))}
            placeholder="username"
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>
        {fieldErrors.twitter && (
          <p className="mt-1 text-sm text-red-400">{fieldErrors.twitter[0]}</p>
        )}
      </div>

      {/* GitHub */}
      <div>
        <Label htmlFor="github" className="text-gray-300">GitHub Username</Label>
        <Input
          id="github"
          type="text"
          value={formData.github}
          onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
          placeholder="username"
          className="mt-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
        />
        {fieldErrors.github && (
          <p className="mt-1 text-sm text-red-400">{fieldErrors.github[0]}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 border-t border-gray-800 pt-6">
        <Button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
