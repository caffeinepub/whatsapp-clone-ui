import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  ChevronRight,
  HardDrive,
  HelpCircle,
  Lock,
  MessageCircle,
  Moon,
  Smartphone,
  User,
} from "lucide-react";
import { useState } from "react";
import ContactAvatar from "../components/ContactAvatar";
import ProfileEditPanel from "../components/ProfileEditPanel";
import SettingsPanel from "../components/SettingsPanel";
import type { UserProfile, WallpaperType } from "../hooks/useAppState";

interface SettingsScreenProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (name: string, bio: string) => void;
  wallpaper: WallpaperType;
  onWallpaperChange: (w: WallpaperType) => void;
}

function SettingRow({
  label,
  children,
  separator = true,
}: {
  label: string;
  children?: React.ReactNode;
  separator?: boolean;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-3.5">
        <p className="font-medium text-[15px] text-foreground">{label}</p>
        {children}
      </div>
      {separator && <Separator className="ml-4" />}
    </>
  );
}

const SETTINGS_GROUPS = [
  {
    items: [
      {
        id: "account",
        icon: User,
        label: "Account",
        description: "Privacy, security, change number",
        color: "text-blue-500",
      },
      {
        id: "privacy",
        icon: Lock,
        label: "Privacy",
        description: "Block contacts, disappearing messages",
        color: "text-wa-green",
      },
      {
        id: "notifications",
        icon: Bell,
        label: "Notifications",
        description: "Message, group & call tones",
        color: "text-orange-500",
      },
      {
        id: "storage",
        icon: HardDrive,
        label: "Storage and Data",
        description: "Network usage, auto-download",
        color: "text-purple-500",
      },
    ],
  },
  {
    items: [
      {
        id: "chats",
        icon: MessageCircle,
        label: "Chats",
        description: "Theme, wallpapers, chat history",
        color: "text-wa-green",
      },
      {
        id: "appearance",
        icon: Moon,
        label: "Appearance",
        description: "Dark mode, font size",
        color: "text-indigo-500",
      },
      {
        id: "linked",
        icon: Smartphone,
        label: "Linked Devices",
        description: "iPad, Desktop, Web",
        color: "text-teal-600",
      },
    ],
  },
  {
    items: [
      {
        id: "help",
        icon: HelpCircle,
        label: "Help",
        description: "Help centre, contact us, privacy policy",
        color: "text-muted-foreground",
      },
    ],
  },
];

type PanelId =
  | "account"
  | "privacy"
  | "notifications"
  | "storage"
  | "chats"
  | "appearance"
  | "linked"
  | "help"
  | null;

const WALLPAPER_OPTIONS: {
  id: WallpaperType;
  label: string;
  bg: string;
  border: string;
}[] = [
  {
    id: "default",
    label: "Default",
    bg: "bg-[#ECE5DD]",
    border: "border-wa-green",
  },
  {
    id: "light",
    label: "Solid Light",
    bg: "bg-[#F0F4F8]",
    border: "border-blue-400",
  },
  {
    id: "dark",
    label: "Dark Pattern",
    bg: "bg-[#1A2335]",
    border: "border-slate-500",
  },
  {
    id: "green",
    label: "Green Tint",
    bg: "bg-[#E8F5E9]",
    border: "border-emerald-500",
  },
];

export default function SettingsScreen({
  darkMode,
  toggleDarkMode,
  userProfile,
  onUpdateProfile,
  wallpaper,
  onWallpaperChange,
}: SettingsScreenProps) {
  const [openPanel, setOpenPanel] = useState<PanelId>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [wallpaperOpen, setWallpaperOpen] = useState(false);

  // Account panel state
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [twoStep, setTwoStep] = useState(false);

  // Privacy panel state
  const [lastSeen, setLastSeen] = useState("everyone");
  const [profilePhoto, setProfilePhoto] = useState("everyone");
  const [readReceipts, setReadReceipts] = useState(true);

  // Notifications state
  const [msgNotif, setMsgNotif] = useState(true);
  const [groupNotif, setGroupNotif] = useState(true);
  const [callNotif, setCallNotif] = useState(true);
  const [notifSound, setNotifSound] = useState("default");

  // Chats state
  const [fontSize, setFontSize] = useState("medium");

  // Appearance state
  const [appearFontSize, setAppearFontSize] = useState("medium");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-wa-header px-4 pt-12 pb-3 flex-shrink-0">
        <h1 className="text-wa-header-fg text-[22px] font-bold font-display">
          Settings
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto bg-secondary/30">
        {/* Profile row */}
        <div className="bg-card px-4 py-4 border-b border-border">
          <button
            type="button"
            data-ocid="settings.profile.button"
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-4 w-full hover:bg-muted/40 rounded-xl p-2 -mx-2 transition-colors text-left"
          >
            <ContactAvatar initials="ME" size="lg" colorIndex={2} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[18px] text-foreground font-display">
                {userProfile.name}
              </p>
              <p className="text-[13px] text-muted-foreground truncate">
                {userProfile.bio}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          </button>
        </div>

        <div className="py-3 space-y-3">
          {SETTINGS_GROUPS.map((group, gi) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static settings groups
            <div key={gi} className="bg-card">
              {group.items.map((item, ii) => {
                const Icon = item.icon;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      data-ocid={`settings.${item.id}.button`}
                      onClick={() => setOpenPanel(item.id as PanelId)}
                      className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-muted/40 transition-colors text-left"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center bg-muted/60 ${item.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[15px] text-foreground font-display">
                          {item.label}
                        </p>
                        <p className="text-[12px] text-muted-foreground truncate">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </button>
                    {ii < group.items.length - 1 && (
                      <Separator className="ml-[72px]" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="py-6 flex flex-col items-center gap-1">
          <p className="text-[12px] text-muted-foreground">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-wa-green hover:underline"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </main>

      {/* Profile edit panel */}
      <ProfileEditPanel
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={userProfile}
        onSave={onUpdateProfile}
      />

      {/* Account panel */}
      <SettingsPanel
        title="Account"
        open={openPanel === "account"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3 mx-0">
          <SettingRow label="Online status">
            <Switch
              data-ocid="settings.account.switch"
              checked={onlineStatus}
              onCheckedChange={setOnlineStatus}
              aria-label="Toggle online status"
            />
          </SettingRow>
          <SettingRow label="Two-step verification">
            <Switch
              data-ocid="settings.security.switch"
              checked={twoStep}
              onCheckedChange={setTwoStep}
              aria-label="Toggle two-step verification"
            />
          </SettingRow>
          <SettingRow label="Change Number" separator={false}>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </SettingRow>
        </div>
      </SettingsPanel>

      {/* Privacy panel */}
      <SettingsPanel
        title="Privacy"
        open={openPanel === "privacy"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <SettingRow label="Last seen">
            <Select value={lastSeen} onValueChange={setLastSeen}>
              <SelectTrigger
                data-ocid="settings.privacy.select"
                className="w-32 h-8 text-[13px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="contacts">Contacts</SelectItem>
                <SelectItem value="nobody">Nobody</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow label="Profile photo">
            <Select value={profilePhoto} onValueChange={setProfilePhoto}>
              <SelectTrigger
                data-ocid="settings.photo.select"
                className="w-32 h-8 text-[13px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="contacts">Contacts</SelectItem>
                <SelectItem value="nobody">Nobody</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow label="Read receipts" separator={false}>
            <Switch
              data-ocid="settings.receipts.switch"
              checked={readReceipts}
              onCheckedChange={setReadReceipts}
              aria-label="Toggle read receipts"
            />
          </SettingRow>
        </div>
      </SettingsPanel>

      {/* Notifications panel */}
      <SettingsPanel
        title="Notifications"
        open={openPanel === "notifications"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <SettingRow label="Message notifications">
            <Switch
              data-ocid="settings.msg_notif.switch"
              checked={msgNotif}
              onCheckedChange={setMsgNotif}
            />
          </SettingRow>
          <SettingRow label="Group notifications">
            <Switch
              data-ocid="settings.group_notif.switch"
              checked={groupNotif}
              onCheckedChange={setGroupNotif}
            />
          </SettingRow>
          <SettingRow label="Call notifications">
            <Switch
              data-ocid="settings.call_notif.switch"
              checked={callNotif}
              onCheckedChange={setCallNotif}
            />
          </SettingRow>
          <SettingRow label="Sound" separator={false}>
            <Select value={notifSound} onValueChange={setNotifSound}>
              <SelectTrigger
                data-ocid="settings.sound.select"
                className="w-28 h-8 text-[13px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="chime">Chime</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </div>
      </SettingsPanel>

      {/* Storage and Data panel */}
      <SettingsPanel
        title="Storage and Data"
        open={openPanel === "storage"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <div className="px-4 py-6 flex flex-col items-center gap-3 text-center">
            <HardDrive className="w-12 h-12 text-muted-foreground/40" />
            <p className="font-semibold text-foreground">Storage Manager</p>
            <p className="text-[13px] text-muted-foreground">
              Storage and data management tools are not available in this
              version.
            </p>
          </div>
        </div>
      </SettingsPanel>

      {/* Chats panel */}
      <SettingsPanel
        title="Chats"
        open={openPanel === "chats"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <SettingRow label="Dark theme">
            <Switch
              data-ocid="settings.chats_dark.switch"
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
              aria-label="Toggle dark mode"
            />
          </SettingRow>
          <button
            type="button"
            onClick={() => setWallpaperOpen((p) => !p)}
            className="flex items-center justify-between w-full px-4 py-3.5 hover:bg-muted/40 transition-colors text-left"
          >
            <p className="font-medium text-[15px] text-foreground">
              Chat background
            </p>
            <ChevronRight
              className={`w-4 h-4 text-muted-foreground transition-transform ${wallpaperOpen ? "rotate-90" : ""}`}
            />
          </button>

          {/* Wallpaper picker inline */}
          {wallpaperOpen && (
            <div
              data-ocid="settings.wallpaper.panel"
              className="px-4 py-3 border-t border-border bg-secondary/20 animate-fade-in"
            >
              <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Choose Background
              </p>
              <div className="grid grid-cols-4 gap-2">
                {WALLPAPER_OPTIONS.map((opt, idx) => (
                  <button
                    key={opt.id}
                    type="button"
                    data-ocid={`settings.wallpaper.item.${idx + 1}`}
                    onClick={() => onWallpaperChange(opt.id)}
                    className="flex flex-col items-center gap-1.5 group"
                    aria-pressed={wallpaper === opt.id}
                  >
                    <div
                      className={`w-full aspect-square rounded-xl ${opt.bg} border-2 transition-all ${
                        wallpaper === opt.id
                          ? `${opt.border} ring-2 ring-offset-1 ring-wa-green`
                          : "border-border"
                      }`}
                    />
                    <span className="text-[10px] text-center text-muted-foreground font-medium leading-tight">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <Separator className="ml-4" />
          <SettingRow label="Font size" separator={false}>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger
                data-ocid="settings.chat_font.select"
                className="w-28 h-8 text-[13px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </div>
      </SettingsPanel>

      {/* Appearance panel */}
      <SettingsPanel
        title="Appearance"
        open={openPanel === "appearance"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <div className="px-4 py-3.5 flex items-center justify-between">
            <div>
              <Label className="font-semibold text-[15px] text-foreground">
                Dark mode
              </Label>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Switch between light and dark
              </p>
            </div>
            <Switch
              data-ocid="settings.darkmode.switch"
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
              aria-label="Toggle dark mode"
            />
          </div>
          <Separator className="ml-4" />
          <SettingRow label="Font size" separator={false}>
            <Select value={appearFontSize} onValueChange={setAppearFontSize}>
              <SelectTrigger
                data-ocid="settings.appear_font.select"
                className="w-28 h-8 text-[13px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </div>
      </SettingsPanel>

      {/* Linked Devices panel */}
      <SettingsPanel
        title="Linked Devices"
        open={openPanel === "linked"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <div
            data-ocid="settings.linked.empty_state"
            className="px-4 py-10 flex flex-col items-center gap-3 text-center"
          >
            <Smartphone className="w-12 h-12 text-muted-foreground/40" />
            <p className="font-semibold text-[15px] text-foreground">
              No linked devices
            </p>
            <p className="text-[13px] text-muted-foreground max-w-[240px]">
              You can use WhatsApp on up to 4 linked devices simultaneously.
            </p>
          </div>
        </div>
      </SettingsPanel>

      {/* Help panel */}
      <SettingsPanel
        title="Help"
        open={openPanel === "help"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <SettingRow label="Help Centre">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </SettingRow>
          <SettingRow label="Contact us">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </SettingRow>
          <SettingRow label="Privacy policy" separator={false}>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </SettingRow>
        </div>
      </SettingsPanel>
    </div>
  );
}
