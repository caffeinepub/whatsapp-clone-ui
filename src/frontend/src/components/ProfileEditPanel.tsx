import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { UserProfile } from "../hooks/useAppState";
import ContactAvatar from "./ContactAvatar";
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

  // Sync when profile changes externally
  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onSave(trimmedName, bio.trim());
    onClose();
  };

  return (
    <SettingsPanel title="Profile" open={open} onClose={onClose}>
      <div className="px-6 py-8 flex flex-col items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <ContactAvatar initials="ME" size="lg" colorIndex={2} />
        </div>

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
