import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ProfileCreationScreenProps {
  onDone: (name: string, about: string, avatar?: string) => void;
}

export default function ProfileCreationScreen({
  onDone,
}: ProfileCreationScreenProps) {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  const handleDone = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    onDone(name.trim(), about.trim() || "Available", avatar);
  };

  return (
    <div
      className="flex flex-col h-full bg-background"
      data-ocid="profile.page"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-6 pb-4"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 52px)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-foreground">Profile info</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add your name and optional profile photo
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex-1 flex flex-col items-center px-6 gap-8 pt-4"
      >
        {/* Avatar picker */}
        <button
          type="button"
          onClick={handleAvatarClick}
          data-ocid="profile.upload_button"
          className="relative w-28 h-28 rounded-full overflow-hidden focus:outline-none group"
        >
          {avatar ? (
            <img
              src={avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "#128C7E" }}
            >
              <svg
                role="img"
                aria-label="Profile silhouette"
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
              >
                <circle cx="28" cy="22" r="10" fill="white" opacity="0.85" />
                <ellipse
                  cx="28"
                  cy="44"
                  rx="18"
                  ry="10"
                  fill="white"
                  opacity="0.85"
                />
              </svg>
            </div>
          )}
          {/* Camera overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "rgba(0,0,0,0.45)" }}
          >
            <Camera className="w-8 h-8 text-white" />
          </div>
          {/* Small camera badge */}
          <div
            className="absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-background"
            style={{ background: "#25D366" }}
          >
            <Camera className="w-4 h-4 text-white" />
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Form fields */}
        <div className="w-full flex flex-col gap-4">
          <div>
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-base h-12"
              maxLength={25}
              data-ocid="profile.name.input"
              onKeyDown={(e) => e.key === "Enter" && handleDone()}
            />
            <p className="text-xs text-right text-muted-foreground mt-1">
              {name.length}/25
            </p>
          </div>
          <div>
            <Input
              type="text"
              placeholder="About (optional)"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="text-base h-12"
              maxLength={139}
              data-ocid="profile.about.input"
            />
            <p className="text-xs text-right text-muted-foreground mt-1">
              {about.length}/139
            </p>
          </div>
        </div>

        <Button
          onClick={handleDone}
          disabled={!name.trim()}
          className="w-full h-12 text-base font-semibold mt-auto mb-8"
          style={{ background: "#25D366", color: "white" }}
          data-ocid="profile.submit_button"
        >
          Done
        </Button>
      </motion.div>
    </div>
  );
}
