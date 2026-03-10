import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  QrCode,
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
  onOpenQRCode?: () => void;
  onLogout?: () => void;
}

function SettingRow({
  label,
  description,
  children,
  separator = true,
}: {
  label: string;
  description?: string;
  children?: React.ReactNode;
  separator?: boolean;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex-1 min-w-0 mr-3">
          <p className="font-medium text-[15px] text-foreground">{label}</p>
          {description && (
            <p className="text-[12px] text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
      {separator && <Separator className="ml-4" />}
    </>
  );
}

function SettingButton({
  label,
  value,
  onClick,
  separator = true,
  destructive = false,
}: {
  label: string;
  value?: string;
  onClick?: () => void;
  separator?: boolean;
  destructive?: boolean;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center justify-between w-full px-4 py-3.5 hover:bg-muted/40 transition-colors text-left ${destructive ? "text-destructive" : ""}`}
      >
        <p
          className={`font-medium text-[15px] ${destructive ? "text-destructive" : "text-foreground"}`}
        >
          {label}
        </p>
        <div className="flex items-center gap-2">
          {value && (
            <span className="text-[13px] text-muted-foreground">{value}</span>
          )}
          {!destructive && (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>
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
  onOpenQRCode,
  onLogout,
}: SettingsScreenProps) {
  const [openPanel, setOpenPanel] = useState<PanelId>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [wallpaperOpen, setWallpaperOpen] = useState(false);

  // Account state
  const [twoStep, setTwoStep] = useState(false);
  const [passkeys, setPasskeys] = useState(false);
  const [securityNotifs, setSecurityNotifs] = useState(true);

  // Privacy state
  const [lastSeen, setLastSeen] = useState("nobody");
  const [profilePhoto, setProfilePhoto] = useState("everyone");
  const [about, setAbout] = useState("everyone");
  const [statusPrivacy, setStatusPrivacy] = useState("contacts");
  const [readReceipts, setReadReceipts] = useState(true);
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(true);

  // Notifications state
  const [convTones, setConvTones] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [_notifTone, _setNotifTone] = useState("default");
  const [_vibrate, _setVibrate] = useState("default");
  const [highPriority, setHighPriority] = useState(false);
  const [reactionNotifs, setReactionNotifs] = useState(true);

  // Chats state
  const [fontSize, setFontSize] = useState("small");
  const [enterIsSend, setEnterIsSend] = useState(false);
  const [mediaVisibility, setMediaVisibility] = useState(true);
  const [keepArchived, setKeepArchived] = useState(true);

  // Appearance state
  const [appearFontSize, setAppearFontSize] = useState("medium");

  // Alert dialog state
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [clearCacheOpen, setClearCacheOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <header
        className="sticky top-0 z-50 bg-wa-header px-4 pb-3 flex-shrink-0"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
      >
        <h1 className="text-wa-header-fg text-[22px] font-bold font-display">
          Settings
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto bg-secondary/30">
        {/* Profile row */}
        <div className="bg-card px-4 py-4 border-b border-border">
          <div className="flex items-center gap-4">
            <button
              type="button"
              data-ocid="settings.profile.button"
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-4 flex-1 hover:bg-muted/40 rounded-xl p-2 -mx-2 transition-colors text-left"
            >
              <ContactAvatar
                initials={userProfile.name.slice(0, 2).toUpperCase()}
                size="lg"
                colorIndex={2}
              />
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

            {/* QR Code icon */}
            <button
              type="button"
              data-ocid="settings.qrcode.button"
              onClick={onOpenQRCode}
              className="w-10 h-10 bg-muted/60 rounded-xl flex items-center justify-center hover:bg-muted transition-colors flex-shrink-0"
              aria-label="QR code"
            >
              <QrCode className="w-5 h-5 text-foreground" />
            </button>
          </div>
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

        {/* Logout button */}
        <div className="bg-card mt-3">
          <button
            type="button"
            data-ocid="settings.logout.button"
            onClick={() => setLogoutOpen(true)}
            className="flex items-center justify-center w-full px-4 py-3.5 text-destructive hover:bg-destructive/5 transition-colors"
          >
            <p className="font-semibold text-[15px]">Log out</p>
          </button>
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

      {/* =================== ACCOUNT PANEL =================== */}
      <SettingsPanel
        title="Account"
        open={openPanel === "account"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <SettingRow
            label="Security notifications"
            description="Get notified about security changes to your account"
          >
            <Switch
              checked={securityNotifs}
              onCheckedChange={setSecurityNotifs}
              data-ocid="settings.account.security.switch"
            />
          </SettingRow>
          <SettingRow
            label="Passkeys"
            description="Use your fingerprint or face to log in faster"
          >
            <Switch
              checked={passkeys}
              onCheckedChange={setPasskeys}
              data-ocid="settings.account.passkeys.switch"
            />
          </SettingRow>
          <SettingButton label="Email address" value="Not set" />
          <SettingRow
            label="Two-step verification"
            description="Add a PIN for extra security"
          >
            <Switch
              checked={twoStep}
              onCheckedChange={setTwoStep}
              data-ocid="settings.account.twostep.switch"
            />
          </SettingRow>
          <SettingButton label="Business Platform" />
          <SettingButton label="Change phone number" />
          <SettingButton label="Request account info" />
          <SettingButton label="Add account" separator={false} />
        </div>
        <div className="bg-card mt-3">
          <button
            type="button"
            data-ocid="settings.account.delete.button"
            onClick={() => setDeleteAccountOpen(true)}
            className="flex items-center w-full px-4 py-3.5 text-destructive hover:bg-destructive/5 transition-colors"
          >
            <p className="font-medium text-[15px]">Delete my account</p>
          </button>
        </div>
      </SettingsPanel>

      {/* =================== PRIVACY PANEL =================== */}
      <SettingsPanel
        title="Privacy"
        open={openPanel === "privacy"}
        onClose={() => setOpenPanel(null)}
      >
        {/* Privacy checkup banner */}
        {showPrivacyBanner && (
          <div className="mx-3 mt-3 bg-wa-green/10 border border-wa-green/30 rounded-2xl px-4 py-3 flex items-start gap-2">
            <div className="flex-1">
              <p className="font-semibold text-[14px] text-wa-green">
                Privacy checkup
              </p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Review and update your privacy settings
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPrivacyBanner(false)}
              className="text-muted-foreground hover:text-foreground p-1"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        <div className="bg-card mt-3">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              Who can see my personal info
            </p>
          </div>
          <SettingRow label="Last seen and online">
            <Select value={lastSeen} onValueChange={setLastSeen}>
              <SelectTrigger
                data-ocid="settings.privacy.lastseen.select"
                className="w-32 h-8 text-[13px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="contacts">My contacts</SelectItem>
                <SelectItem value="nobody">Nobody</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow label="Profile picture">
            <Select value={profilePhoto} onValueChange={setProfilePhoto}>
              <SelectTrigger
                data-ocid="settings.privacy.photo.select"
                className="w-32 h-8 text-[13px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="contacts">My contacts</SelectItem>
                <SelectItem value="nobody">Nobody</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow label="About">
            <Select value={about} onValueChange={setAbout}>
              <SelectTrigger
                data-ocid="settings.privacy.about.select"
                className="w-32 h-8 text-[13px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="contacts">My contacts</SelectItem>
                <SelectItem value="nobody">Nobody</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow label="Status">
            <Select value={statusPrivacy} onValueChange={setStatusPrivacy}>
              <SelectTrigger
                data-ocid="settings.privacy.status.select"
                className="w-32 h-8 text-[13px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="contacts">My contacts</SelectItem>
                <SelectItem value="nobody">Nobody</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow
            label="Read receipts"
            description="If turned off, you won't send or receive read receipts"
            separator={false}
          >
            <Switch
              data-ocid="settings.privacy.receipts.switch"
              checked={readReceipts}
              onCheckedChange={setReadReceipts}
            />
          </SettingRow>
        </div>
        <div className="bg-card mt-3">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              Disappearing messages
            </p>
          </div>
          <SettingButton
            label="Default message timer"
            value="24 hours"
            separator={false}
          />
        </div>
      </SettingsPanel>

      {/* =================== NOTIFICATIONS PANEL =================== */}
      <SettingsPanel
        title="Notifications"
        open={openPanel === "notifications"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <SettingRow
            label="Conversation tones"
            description="Play sounds for outgoing and incoming messages"
          >
            <Switch
              data-ocid="settings.notif.tones.switch"
              checked={convTones}
              onCheckedChange={setConvTones}
            />
          </SettingRow>
          <SettingRow
            label="Reminders"
            description="Periodically notify about unread messages"
            separator={false}
          >
            <Switch
              data-ocid="settings.notif.reminders.switch"
              checked={reminders}
              onCheckedChange={setReminders}
            />
          </SettingRow>
        </div>
        <div className="bg-card mt-3">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              Messages
            </p>
          </div>
          <SettingButton
            label="Notification tone"
            value="Default (WaterDrop_preview.ogg)"
          />
          <SettingButton label="Vibrate" value="Default" />
          <SettingRow label="Popup notification">
            <span className="text-[13px] text-muted-foreground/60">
              Not available
            </span>
          </SettingRow>
          <SettingButton label="Light" value="White" />
          <SettingRow
            label="Use high priority notifications"
            description="Show previews of notifications at the top of the screen"
          >
            <Switch
              data-ocid="settings.notif.highpriority.switch"
              checked={highPriority}
              onCheckedChange={setHighPriority}
            />
          </SettingRow>
          <SettingRow
            label="Reaction notifications"
            description="Receive notifications for message reactions"
            separator={false}
          >
            <Switch
              data-ocid="settings.notif.reactions.switch"
              checked={reactionNotifs}
              onCheckedChange={setReactionNotifs}
            />
          </SettingRow>
        </div>
      </SettingsPanel>

      {/* =================== STORAGE PANEL =================== */}
      <SettingsPanel
        title="Storage and Data"
        open={openPanel === "storage"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              Auto-download — Wi-Fi
            </p>
          </div>
          <SettingRow label="Photos">
            <Switch
              defaultChecked
              data-ocid="settings.storage.photos_wifi.switch"
            />
          </SettingRow>
          <SettingRow label="Videos">
            <Switch data-ocid="settings.storage.videos_wifi.switch" />
          </SettingRow>
          <SettingRow label="Documents" separator={false}>
            <Switch
              defaultChecked
              data-ocid="settings.storage.docs_wifi.switch"
            />
          </SettingRow>
        </div>
        <div className="bg-card mt-3">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              Auto-download — Mobile Data
            </p>
          </div>
          <SettingRow label="Photos">
            <Switch data-ocid="settings.storage.photos_cell.switch" />
          </SettingRow>
          <SettingRow label="Videos">
            <Switch data-ocid="settings.storage.videos_cell.switch" />
          </SettingRow>
          <SettingRow label="Documents" separator={false}>
            <Switch data-ocid="settings.storage.docs_cell.switch" />
          </SettingRow>
        </div>
        <div className="bg-card mt-3">
          <button
            type="button"
            data-ocid="settings.storage.clear.button"
            onClick={() => setClearCacheOpen(true)}
            className="flex items-center justify-between w-full px-4 py-3.5 hover:bg-muted/40 transition-colors text-left"
          >
            <p className="font-medium text-[15px] text-foreground">
              Clear chat cache
            </p>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </SettingsPanel>

      {/* =================== CHATS PANEL =================== */}
      <SettingsPanel
        title="Chats"
        open={openPanel === "chats"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              Display
            </p>
          </div>
          <SettingButton label="Theme" value="Dark" />
          <SettingButton label="Default chat theme" separator={false} />
        </div>

        <div className="bg-card mt-3">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              Chat settings
            </p>
          </div>
          <SettingRow
            label="Enter is send"
            description="Return key will send your message"
          >
            <Switch
              data-ocid="settings.chats.enter_send.switch"
              checked={enterIsSend}
              onCheckedChange={setEnterIsSend}
            />
          </SettingRow>
          <SettingRow
            label="Media visibility"
            description="Show newly downloaded media in your phone's gallery"
          >
            <Switch
              data-ocid="settings.chats.media_vis.switch"
              checked={mediaVisibility}
              onCheckedChange={setMediaVisibility}
            />
          </SettingRow>
          <SettingRow label="Font size">
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

          {/* Chat background inline */}
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
                      className={`w-full aspect-square rounded-xl ${opt.bg} border-2 transition-all ${wallpaper === opt.id ? `${opt.border} ring-2 ring-offset-1 ring-wa-green` : "border-border"}`}
                    />
                    <span className="text-[10px] text-center text-muted-foreground font-medium leading-tight">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-card mt-3">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              Archived chats
            </p>
          </div>
          <SettingRow
            label="Keep chats archived"
            description="Archived chats will remain archived when you receive a new message"
            separator={false}
          >
            <Switch
              data-ocid="settings.chats.keep_archived.switch"
              checked={keepArchived}
              onCheckedChange={setKeepArchived}
            />
          </SettingRow>
        </div>

        <div className="bg-card mt-3">
          <button
            type="button"
            data-ocid="settings.chats.backup.button"
            className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-muted/40 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center">
              <span className="text-lg">☁️</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[15px] text-foreground">
                Chat backup
              </p>
              <p className="text-[12px] text-muted-foreground">
                Back up chats to Google Drive
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </SettingsPanel>

      {/* =================== APPEARANCE PANEL =================== */}
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

      {/* =================== LINKED DEVICES PANEL =================== */}
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
        <div className="px-4 pb-4">
          <button
            type="button"
            data-ocid="settings.linked.link.button"
            className="w-full border-2 border-wa-green text-wa-green rounded-xl py-3 font-semibold text-[15px] hover:bg-wa-green/5 transition-colors"
          >
            Link a Device
          </button>
        </div>
      </SettingsPanel>

      {/* =================== HELP PANEL =================== */}
      <SettingsPanel
        title="Help"
        open={openPanel === "help"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <SettingButton label="FAQ" />
          <SettingButton label="Contact us" />
          <SettingButton label="Privacy policy" />
          <SettingButton label="Terms of service" />
          <SettingRow label="App info" separator={false}>
            <span className="text-[13px] text-muted-foreground">v6.0.0</span>
          </SettingRow>
        </div>
      </SettingsPanel>

      {/* Delete Account Confirmation */}
      <AlertDialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <AlertDialogContent data-ocid="settings.delete_account.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all your messages.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="settings.delete_account.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="settings.delete_account.confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => setDeleteAccountOpen(false)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Confirmation */}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent data-ocid="settings.logout.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to verify your phone number again to log back in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="settings.logout.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="settings.logout.confirm_button"
              onClick={() => {
                setLogoutOpen(false);
                onLogout?.();
              }}
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Cache Confirmation */}
      <AlertDialog open={clearCacheOpen} onOpenChange={setClearCacheOpen}>
        <AlertDialogContent data-ocid="settings.clear_cache.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Clear chat cache?</AlertDialogTitle>
            <AlertDialogDescription>
              This will free up storage space. Your messages will not be
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="settings.clear_cache.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="settings.clear_cache.confirm_button"
              onClick={() => setClearCacheOpen(false)}
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
