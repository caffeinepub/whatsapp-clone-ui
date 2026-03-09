import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import type { UserProfile } from "../hooks/useAppState";
import SettingsPanel from "./SettingsPanel";

interface ProfileEditPanelProps {
  open: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (name: string, bio: string) => void;
}

export default function ProfileEditPanel({
  open,
  onClose,
  profile,
  onSave,
}: ProfileEditPanelProps) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverUrl(url);
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onSave(trimmedName, bio.trim());
    onClose();
  };

  const initials = name.trim().slice(0, 2).toUpperCase() || "ME";

  return (
    <SettingsPanel title="Profile" open={open} onClose={onClose}>
      {/* Cover photo */}
      <div className="relative w-full h-36 bg-gradient-to-br from-wa-teal to-wa-green overflow-hidden flex-shrink-0">
        {coverUrl && (
          <img
            src={coverUrl}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
        <button
          type="button"
          data-ocid="profile.cover.upload_button"
          onClick={() => coverInputRef.current?.click()}
          className="absolute bottom-3 right-3 w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Change cover photo"
        >
          <Camera className="w-4 h-4" />
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
          aria-label="Cover photo upload"
        />
      </div>

      <div className="px-6 py-6 flex flex-col items-center gap-6">
        {/* Avatar with upload */}
        <div className="relative -mt-12">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-card shadow-lg bg-emerald-600 flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-[28px] font-bold font-display">
                {initials}
              </span>
            )}
          </div>
          <button
            type="button"
            data-ocid="profile.avatar.upload_button"
            onClick={() => avatarInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-wa-green rounded-full flex items-center justify-center shadow-md hover:brightness-105 transition-all border-2 border-card"
            aria-label="Change profile photo"
          >
            <Camera className="w-4 h-4 text-white" />
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
            aria-label="Profile photo upload"
          />
        </div>

        <p className="text-[13px] text-muted-foreground -mt-3">
          Tap the camera to change your profile photo
        </p>

        {/* Fields */}
        <div className="w-full space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="profile-name"
              className="text-[13px] font-semibold text-wa-green"
            >
              Your name
            </Label>
            <Input
              id="profile-name"
              data-ocid="profile.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              placeholder="Your name"
              className="text-[15px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="profile-bio"
              className="text-[13px] font-semibold text-wa-green"
            >
              About
            </Label>
            <Textarea
              id="profile-bio"
              data-ocid="profile.textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={139}
              placeholder="Write something about yourself..."
              className="resize-none text-[14px] min-h-[80px]"
            />
            <p className="text-right text-[11px] text-muted-foreground">
              {139 - bio.length} characters remaining
            </p>
          </div>
        </div>

        <Button
          type="button"
          data-ocid="profile.save_button"
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full bg-wa-green hover:bg-wa-green/90 text-white font-semibold"
        >
          Save
        </Button>
      </div>
    </SettingsPanel>
  );
}
