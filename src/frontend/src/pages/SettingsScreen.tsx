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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Check,
  ChevronRight,
  Copy,
  Eye,
  Globe,
  Hand,
  HardDrive,
  HelpCircle,
  Lock,
  MessageCircle,
  Moon,
  Palette,
  QrCode,
  Settings2,
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
  onOpenStorage?: () => void;
  onOpenChatLock?: () => void;
  onOpenQuickReplies?: () => void;
  onOpenTwoStep?: () => void;
  onOpenLinkedDevices?: () => void;
  onOpenBusiness?: () => void;
  onOpenAppLock?: () => void;
  onOpenBlockedContacts?: () => void;
  onOpenSecretChats?: () => void;
  onOpenChatBackup?: () => void;
  onOpenEnterprise?: () => void;
  onOpenCloudDrive?: () => void;
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
  {
    items: [
      {
        id: "theme",
        icon: Palette,
        label: "Theme & Colors",
        description: "Accent color, bubble style",
        color: "text-pink-500",
      },
      {
        id: "language",
        icon: Globe,
        label: "Language & Region",
        description: "Language, date & time format",
        color: "text-blue-500",
      },
      {
        id: "accessibility",
        icon: Eye,
        label: "Accessibility",
        description: "Text size, motion, contrast",
        color: "text-teal-500",
      },
      {
        id: "gestures",
        icon: Hand,
        label: "Shortcuts & Gestures",
        description: "Swipe actions, quick reactions",
        color: "text-orange-500",
      },
      {
        id: "advanced",
        icon: Settings2,
        label: "Advanced",
        description: "Beta features, data, app info",
        color: "text-gray-500",
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
  | "theme"
  | "language"
  | "accessibility"
  | "gestures"
  | "advanced"
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

const ACCENT_COLORS = [
  { id: "green", hex: "#25D366", label: "Green" },
  { id: "blue", hex: "#0084FF", label: "Blue" },
  { id: "purple", hex: "#8B5CF6", label: "Purple" },
  { id: "pink", hex: "#EC4899", label: "Pink" },
  { id: "orange", hex: "#F97316", label: "Orange" },
  { id: "teal", hex: "#14B8A6", label: "Teal" },
  { id: "red", hex: "#EF4444", label: "Red" },
  { id: "yellow", hex: "#EAB308", label: "Yellow" },
];

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export default function SettingsScreen({
  darkMode,
  toggleDarkMode,
  userProfile,
  onUpdateProfile,
  wallpaper,
  onWallpaperChange,
  onOpenQRCode,
  onLogout,
  onOpenStorage,
  onOpenChatLock,
  onOpenQuickReplies,
  onOpenTwoStep,
  onOpenLinkedDevices,
  onOpenBusiness,
  onOpenAppLock: _onOpenAppLock,
  onOpenBlockedContacts,
  onOpenSecretChats,
  onOpenChatBackup,
  onOpenEnterprise,
  onOpenCloudDrive,
}: SettingsScreenProps) {
  const [openPanel, setOpenPanel] = useState<PanelId>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [wallpaperOpen, setWallpaperOpen] = useState(false);

  // Account state
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

  // App lock state
  const [appLockEnabled, setAppLockEnabled] = useState(() => {
    return localStorage.getItem("wa_app_lock_enabled") === "1";
  });
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [setupPin, setSetupPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinStep, setPinStep] = useState<"enter" | "confirm">("enter");

  // Profile QR state
  const [showProfileQR, setShowProfileQR] = useState(false);

  // Appearance state
  const [appearFontSize, setAppearFontSize] = useState("medium");

  // Alert dialog state
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [clearCacheOpen, setClearCacheOpen] = useState(false);

  // ── NEW: Theme & Colors state ─────────────────────────────────────
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem("wa_accent_color") || "green";
  });
  const [fontTheme, setFontTheme] = useState(() => {
    return localStorage.getItem("wa_font_theme") || "system-ui, sans-serif";
  });
  const [appTheme, setAppTheme] = useState("system");
  const [bubbleStyle, setBubbleStyle] = useState("classic");

  // ── NEW: Language & Region state ──────────────────────────────────
  const [language, setLanguage] = useState("en");
  const [dateFormat, setDateFormat] = useState("dd/mm/yyyy");
  const [timeFormat, setTimeFormat] = useState("12");
  const [firstDay, setFirstDay] = useState("sunday");

  // ── NEW: Accessibility state ───────────────────────────────────────
  const [textSize, setTextSize] = useState([100]);
  const [reduceMotion, setReduceMotion] = useState(() => {
    return localStorage.getItem("wa_reduce_motion") === "1";
  });
  const [highContrast, setHighContrast] = useState(false);
  const [boldText, setBoldText] = useState(false);
  const [largeTouchTargets, setLargeTouchTargets] = useState(false);

  // ── NEW: Gestures state ────────────────────────────────────────────
  const [swipeLeft, setSwipeLeft] = useState("archive");
  const [swipeRight, setSwipeRight] = useState("reply");
  const [doubleTap, setDoubleTap] = useState("react");
  const [selectedQuickReaction, setSelectedQuickReaction] = useState("👍");
  const [hapticFeedback, setHapticFeedback] = useState(true);

  // ── NEW: Advanced state ────────────────────────────────────────────
  const [betaFeatures, setBetaFeatures] = useState(false);
  const [msgPreview, setMsgPreview] = useState(true);
  const [hwAccel, setHwAccel] = useState(true);
  const [clearAllDataOpen, setClearAllDataOpen] = useState(false);
  const [versionCopied, setVersionCopied] = useState(false);

  function handleAccentColor(colorId: string) {
    const color = ACCENT_COLORS.find((c) => c.id === colorId);
    if (!color) return;
    setAccentColor(colorId);
    localStorage.setItem("wa_accent_color", colorId);
    localStorage.setItem("wa_accent_color_hex", color.hex);
    document.documentElement.style.setProperty("--wa-green", color.hex);
    document.documentElement.style.setProperty("--wa-accent", color.hex);
    document.documentElement.style.setProperty("--wa-accent-color", color.hex);
    document.documentElement.style.setProperty(
      "--wa-accent-glow",
      `${color.hex}66`,
    );
  }

  function handleFontTheme(fontValue: string) {
    setFontTheme(fontValue);
    localStorage.setItem("wa_font_theme", fontValue);
    document.documentElement.style.setProperty("--app-font", fontValue);
  }

  function handleCopyVersion() {
    navigator.clipboard.writeText("v6.0.0 (Build 2026.03)").then(() => {
      setVersionCopied(true);
      setTimeout(() => setVersionCopied(false), 2000);
    });
  }

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

      <main
        className="flex-1 overflow-y-auto bg-secondary/30"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
      >
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
                      onClick={() => {
                        if (item.id === "storage" && onOpenStorage) {
                          onOpenStorage();
                        } else if (item.id === "backup" && onOpenChatBackup) {
                          onOpenChatBackup();
                        } else if (
                          item.id === "linked" &&
                          onOpenLinkedDevices
                        ) {
                          onOpenLinkedDevices();
                        } else if (item.id === "business" && onOpenBusiness) {
                          onOpenBusiness();
                        } else {
                          setOpenPanel(item.id as PanelId);
                        }
                      }}
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

        {/* Enterprise & Pro Section */}
        <div className="bg-card mt-3 border-t border-border">
          <div className="px-4 py-2">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Enterprise &amp; Pro
            </p>
          </div>
          <button
            type="button"
            data-ocid="settings.enterprise.button"
            onClick={() => onOpenEnterprise?.()}
            className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🏢</span>
              <p className="text-foreground text-[15px]">
                Enterprise Dashboard
              </p>
            </div>
            <span className="text-muted-foreground text-xs">›</span>
          </button>
          <button
            type="button"
            data-ocid="settings.cloud_drive.button"
            onClick={() => onOpenCloudDrive?.()}
            className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted/50 transition-colors border-t border-border/50"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">☁️</span>
              <p className="text-foreground text-[15px]">Cloud Drive</p>
            </div>
            <span className="text-muted-foreground text-xs">›</span>
          </button>
          <button
            type="button"
            data-ocid="settings.api_access.button"
            onClick={() => onOpenEnterprise?.()}
            className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted/50 transition-colors border-t border-border/50"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🔑</span>
              <p className="text-foreground text-[15px]">API Access</p>
            </div>
            <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full font-semibold">
              Pro
            </span>
          </button>
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
          <p className="text-[12px] text-muted-foreground">© 2026 Meta</p>
        </div>
      </main>
      <ProfileEditPanel
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={userProfile}
        onSave={onUpdateProfile}
      />
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
          <SettingButton
            label="Two-step verification"
            value="Set up PIN"
            onClick={onOpenTwoStep}
          />
          <SettingButton
            label="Business Account"
            onClick={onOpenBusiness}
            value={
              localStorage.getItem("businessMode") === "true"
                ? "Active"
                : undefined
            }
          />
          <SettingButton label="Quick Replies" onClick={onOpenQuickReplies} />
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
          >
            <Switch
              data-ocid="settings.privacy.receipts.switch"
              checked={readReceipts}
              onCheckedChange={setReadReceipts}
            />
          </SettingRow>
          <button
            type="button"
            data-ocid="settings.privacy.chatlock.button"
            onClick={() => {
              setOpenPanel(null);
              onOpenChatLock?.();
            }}
            className="flex items-center justify-between w-full px-4 py-3.5 hover:bg-muted/40 transition-colors text-left"
          >
            <div>
              <p className="font-medium text-[15px] text-foreground">
                Chat Lock
              </p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Lock individual chats with PIN
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <Separator className="ml-4" />
          <button
            type="button"
            data-ocid="settings.privacy.blocked.button"
            onClick={() => {
              setOpenPanel(null);
              onOpenBlockedContacts?.();
            }}
            className="flex items-center justify-between w-full px-4 py-3.5 hover:bg-muted/40 transition-colors text-left"
          >
            <div>
              <p className="font-medium text-[15px] text-foreground">
                Blocked Contacts
              </p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Manage blocked contacts
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <Separator className="ml-4" />
          <button
            type="button"
            data-ocid="settings.privacy.secret_chats.button"
            onClick={() => {
              setOpenPanel(null);
              onOpenSecretChats?.();
            }}
            className="flex items-center justify-between w-full px-4 py-3.5 hover:bg-muted/40 transition-colors text-left"
          >
            <div>
              <p className="font-medium text-[15px] text-foreground">
                Secret Chats
              </p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Hidden end-to-end encrypted chats
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <Separator className="ml-4" />
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="font-medium text-[15px] text-foreground">
                App Lock
              </p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                {appLockEnabled
                  ? "PIN set — tap to change"
                  : "Lock app with PIN"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                data-ocid="settings.privacy.applock.switch"
                checked={appLockEnabled}
                onCheckedChange={(v) => {
                  if (v) {
                    setShowPinSetup(true);
                    setPinStep("enter");
                    setSetupPin("");
                    setConfirmPin("");
                  } else {
                    setAppLockEnabled(false);
                    localStorage.removeItem("wa_app_lock_enabled");
                    localStorage.removeItem("wa_app_lock_pin");
                  }
                }}
              />
            </div>
          </div>
          {showPinSetup && (
            <div
              data-ocid="settings.applock.setup.panel"
              className="px-4 py-3 bg-muted/30 border-t border-border"
            >
              <p className="text-[13px] font-semibold text-foreground mb-3">
                {pinStep === "enter" ? "Set a 4-digit PIN" : "Confirm your PIN"}
              </p>
              <div className="flex gap-3 mb-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed PIN dot display
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      i < (pinStep === "enter" ? setupPin : confirmPin).length
                        ? "bg-wa-green border-wa-green"
                        : "border-border"
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "",
                  "0",
                  "⌫",
                ].map((k, i) => (
                  <button
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed keypad
                    key={i}
                    type="button"
                    data-ocid="settings.applock.pin.button"
                    disabled={!k}
                    onClick={() => {
                      if (!k) return;
                      if (k === "⌫") {
                        if (pinStep === "enter")
                          setSetupPin((p) => p.slice(0, -1));
                        else setConfirmPin((p) => p.slice(0, -1));
                        return;
                      }
                      if (pinStep === "enter") {
                        const np = setupPin + k;
                        setSetupPin(np);
                        if (np.length === 4) setPinStep("confirm");
                      } else {
                        const np = confirmPin + k;
                        setConfirmPin(np);
                        if (np.length === 4) {
                          if (np === setupPin) {
                            localStorage.setItem("wa_app_lock_pin", np);
                            localStorage.setItem("wa_app_lock_enabled", "1");
                            setAppLockEnabled(true);
                            setShowPinSetup(false);
                            setSetupPin("");
                            setConfirmPin("");
                            setPinStep("enter");
                          } else {
                            setConfirmPin("");
                            setPinStep("enter");
                            setSetupPin("");
                          }
                        }
                      }
                    }}
                    className="h-10 rounded-xl bg-muted hover:bg-muted/70 transition-colors text-[16px] font-semibold disabled:opacity-0"
                  >
                    {k}
                  </button>
                ))}
              </div>
              <button
                type="button"
                data-ocid="settings.applock.cancel_button"
                onClick={() => setShowPinSetup(false)}
                className="text-[13px] text-muted-foreground hover:text-foreground w-full text-center py-1"
              >
                Cancel
              </button>
            </div>
          )}
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
            onClick={() => {
              setOpenPanel(null);
              onOpenChatBackup?.();
            }}
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

      {/* ── NEW: Theme & Colors panel ─────────────────────────────────── */}
      <SettingsPanel
        title="Theme & Colors"
        open={openPanel === "theme"}
        onClose={() => setOpenPanel(null)}
      >
        {/* Accent Color */}
        <div className="bg-card mt-3">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              Accent Color
            </p>
          </div>
          <div className="px-4 py-4">
            <div className="grid grid-cols-4 gap-3">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  data-ocid="settings.theme.color.button"
                  onClick={() => handleAccentColor(color.id)}
                  aria-label={color.label}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-95"
                    style={{ backgroundColor: color.hex }}
                  >
                    {accentColor === color.id && (
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {color.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Font Theme */}
        <div className="bg-card mt-3">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              Font Theme
            </p>
          </div>
          <div className="px-4 py-3 flex gap-2 overflow-x-auto">
            {[
              { id: "system-ui, sans-serif", label: "Default" },
              { id: "'Georgia', serif", label: "Classic" },
              { id: "monospace", label: "Code" },
              { id: "'Courier New', monospace", label: "Typewriter" },
              { id: "cursive", label: "Casual" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                data-ocid="settings.theme.font.toggle"
                onClick={() => handleFontTheme(f.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors border ${
                  fontTheme === f.id
                    ? "bg-wa-green text-white border-wa-green"
                    : "border-border text-muted-foreground hover:bg-muted/40"
                }`}
                style={{ fontFamily: f.id }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* App Theme */}
        <div className="bg-card mt-3">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              App Theme
            </p>
          </div>
          <div className="px-4 py-3 flex gap-2">
            {["system", "light", "dark"].map((t) => (
              <button
                key={t}
                type="button"
                data-ocid="settings.theme.apptheme.toggle"
                onClick={() => setAppTheme(t)}
                className={`flex-1 py-2 rounded-xl text-[13px] font-semibold transition-colors border ${
                  appTheme === t
                    ? "bg-wa-green text-white border-wa-green"
                    : "border-border text-muted-foreground hover:bg-muted/40"
                }`}
              >
                {t === "system" ? "System" : t === "light" ? "Light" : "Dark"}
              </button>
            ))}
          </div>
        </div>

        {/* Bubble Style */}
        <div className="bg-card mt-3">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              Chat Bubble Style
            </p>
          </div>
          <div className="px-4 py-3 space-y-2">
            {[
              {
                id: "classic",
                label: "Classic",
                desc: "Rounded corners",
                preview: "rounded-2xl",
              },
              {
                id: "modern",
                label: "Modern",
                desc: "Sharp corners",
                preview: "rounded-sm",
              },
              {
                id: "minimal",
                label: "Minimal",
                desc: "Outlined style",
                preview: "rounded-xl border-2",
              },
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                data-ocid="settings.theme.bubble.toggle"
                onClick={() => setBubbleStyle(style.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-colors ${
                  bubbleStyle === style.id
                    ? "border-wa-green bg-wa-green/5"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div
                  className={`w-10 h-7 bg-wa-green/20 ${style.preview} flex-shrink-0`}
                />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-[14px] text-foreground">
                    {style.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {style.desc}
                  </p>
                </div>
                {bubbleStyle === style.id && (
                  <Check className="w-4 h-4 text-wa-green flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </SettingsPanel>

      {/* ── NEW: Language & Region panel ──────────────────────────────── */}
      <SettingsPanel
        title="Language & Region"
        open={openPanel === "language"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <SettingRow label="Language">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger
                data-ocid="settings.language.lang.select"
                className="w-36 h-8 text-[13px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow label="Date format">
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger
                data-ocid="settings.language.date.select"
                className="w-36 h-8 text-[13px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow label="Time format" separator={false}>
            <div className="flex gap-1">
              {["12", "24"].map((t) => (
                <button
                  key={t}
                  type="button"
                  data-ocid="settings.language.time.toggle"
                  onClick={() => setTimeFormat(t)}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors border ${
                    timeFormat === t
                      ? "bg-wa-green text-white border-wa-green"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {t}-hour
                </button>
              ))}
            </div>
          </SettingRow>
        </div>
        <div className="bg-card mt-3">
          <SettingRow label="First day of week" separator={false}>
            <div className="flex gap-1">
              {["sunday", "monday"].map((d) => (
                <button
                  key={d}
                  type="button"
                  data-ocid="settings.language.firstday.toggle"
                  onClick={() => setFirstDay(d)}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors border ${
                    firstDay === d
                      ? "bg-wa-green text-white border-wa-green"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {d === "sunday" ? "Sun" : "Mon"}
                </button>
              ))}
            </div>
          </SettingRow>
        </div>
      </SettingsPanel>

      {/* ── NEW: Accessibility panel ───────────────────────────────────── */}
      <SettingsPanel
        title="Accessibility"
        open={openPanel === "accessibility"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              Text Size
            </p>
          </div>
          <div className="px-4 py-4">
            <Slider
              data-ocid="settings.accessibility.textsize.input"
              min={80}
              max={140}
              step={10}
              value={textSize}
              onValueChange={setTextSize}
              className="mb-4"
            />
            <div className="bg-muted/30 rounded-xl p-3 flex items-center justify-center">
              <p
                className="text-foreground font-medium"
                style={{ fontSize: `${textSize[0]}%` }}
              >
                Preview text at {textSize[0]}% size
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card mt-3">
          <SettingRow
            label="Reduce motion"
            description="Minimise animations throughout the app"
          >
            <Switch
              data-ocid="settings.accessibility.motion.switch"
              checked={reduceMotion}
              onCheckedChange={(v) => {
                setReduceMotion(v);
                localStorage.setItem("wa_reduce_motion", v ? "1" : "0");
              }}
            />
          </SettingRow>
          <SettingRow
            label="High contrast mode"
            description="Increase contrast for better readability"
          >
            <Switch
              data-ocid="settings.accessibility.contrast.switch"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </SettingRow>
          <SettingRow
            label="Bold text"
            description="Make all text bold for easier reading"
          >
            <Switch
              data-ocid="settings.accessibility.bold.switch"
              checked={boldText}
              onCheckedChange={setBoldText}
            />
          </SettingRow>
          <SettingRow
            label="Large touch targets"
            description="Larger tap areas for buttons"
            separator={false}
          >
            <Switch
              data-ocid="settings.accessibility.targets.switch"
              checked={largeTouchTargets}
              onCheckedChange={setLargeTouchTargets}
            />
          </SettingRow>
        </div>
      </SettingsPanel>

      {/* ── NEW: Shortcuts & Gestures panel ────────────────────────────── */}
      <SettingsPanel
        title="Shortcuts & Gestures"
        open={openPanel === "gestures"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              Swipe Actions
            </p>
          </div>
          <SettingRow label="Swipe left on chat">
            <Select value={swipeLeft} onValueChange={setSwipeLeft}>
              <SelectTrigger
                data-ocid="settings.gestures.swipeleft.select"
                className="w-28 h-8 text-[13px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="archive">Archive</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="mute">Mute</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow label="Swipe right on chat">
            <Select value={swipeRight} onValueChange={setSwipeRight}>
              <SelectTrigger
                data-ocid="settings.gestures.swiperight.select"
                className="w-28 h-8 text-[13px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reply">Reply</SelectItem>
                <SelectItem value="markread">Mark as read</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow label="Double-tap message" separator={false}>
            <Select value={doubleTap} onValueChange={setDoubleTap}>
              <SelectTrigger
                data-ocid="settings.gestures.doubletap.select"
                className="w-28 h-8 text-[13px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="copy">Copy</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </div>

        <div className="bg-card mt-3">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              Quick Reactions
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-[12px] text-muted-foreground mb-3">
              Choose your default quick reaction
            </p>
            <div className="flex gap-3">
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  data-ocid="settings.gestures.reaction.button"
                  onClick={() => setSelectedQuickReaction(emoji)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-[22px] transition-all border-2 ${
                    selectedQuickReaction === emoji
                      ? "border-wa-green ring-2 ring-wa-green/30 bg-wa-green/5 scale-110"
                      : "border-transparent bg-muted/40"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card mt-3">
          <SettingRow
            label="Haptic feedback"
            description="Vibrate on interactions"
            separator={false}
          >
            <Switch
              data-ocid="settings.gestures.haptic.switch"
              checked={hapticFeedback}
              onCheckedChange={setHapticFeedback}
            />
          </SettingRow>
        </div>
      </SettingsPanel>

      {/* ── NEW: Advanced panel ────────────────────────────────────────── */}
      <SettingsPanel
        title="Advanced"
        open={openPanel === "advanced"}
        onClose={() => setOpenPanel(null)}
      >
        <div className="bg-card mt-3">
          <SettingRow
            label="Beta features"
            description="Get early access to experimental features"
          >
            <Switch
              data-ocid="settings.advanced.beta.switch"
              checked={betaFeatures}
              onCheckedChange={setBetaFeatures}
            />
          </SettingRow>
          <SettingRow
            label="Message preview in notifications"
            description="Show message content in notification banners"
          >
            <Switch
              data-ocid="settings.advanced.msgpreview.switch"
              checked={msgPreview}
              onCheckedChange={setMsgPreview}
            />
          </SettingRow>
          <SettingRow
            label="Hardware acceleration"
            description="May improve performance on some devices"
            separator={false}
          >
            <Switch
              data-ocid="settings.advanced.hwaccel.switch"
              checked={hwAccel}
              onCheckedChange={setHwAccel}
            />
          </SettingRow>
        </div>

        {/* App version row */}
        <div className="bg-card mt-3">
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="font-medium text-[15px] text-foreground">
                App version
              </p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                v6.0.0 (Build 2026.03)
              </p>
            </div>
            <button
              type="button"
              data-ocid="settings.advanced.version.button"
              onClick={handleCopyVersion}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 hover:bg-muted transition-colors"
            >
              {versionCopied ? (
                <span className="text-[12px] text-wa-green font-semibold">
                  Copied!
                </span>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[12px] text-muted-foreground">
                    Copy
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Clear all data */}
        <div className="bg-card mt-3">
          <button
            type="button"
            data-ocid="settings.advanced.cleardata.delete_button"
            onClick={() => setClearAllDataOpen(true)}
            className="flex items-center w-full px-4 py-3.5 text-destructive hover:bg-destructive/5 transition-colors"
          >
            <p className="font-medium text-[15px]">Clear all data</p>
          </button>
        </div>
      </SettingsPanel>

      {/* Profile QR Code screen */}
      {showProfileQR && (
        <div
          data-ocid="settings.qr.modal"
          className="absolute inset-0 z-50 flex flex-col bg-[#0b141a] items-center justify-center"
        >
          <div className="flex flex-col items-center gap-6 px-8 w-full max-w-[320px]">
            {/* Close */}
            <div className="w-full flex justify-between items-center">
              <button
                type="button"
                data-ocid="settings.qr.close_button"
                onClick={() => setShowProfileQR(false)}
                className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10"
                aria-label="Close"
              >
                <span className="text-[20px]">✕</span>
              </button>
              <p className="text-white font-bold text-[16px]">My QR Code</p>
              <div className="w-10" />
            </div>
            {/* QR grid */}
            <div className="relative w-56 h-56 bg-white rounded-2xl p-3 shadow-2xl">
              <div
                className="w-full h-full grid"
                style={{
                  gridTemplateColumns: "repeat(12, 1fr)",
                  gridTemplateRows: "repeat(12, 1fr)",
                  gap: "1px",
                }}
              >
                {Array.from({ length: 144 }).map((_, i) => {
                  const row = Math.floor(i / 12);
                  const col = i % 12;
                  const isCorner =
                    (row < 3 && col < 3) ||
                    (row < 3 && col > 8) ||
                    (row > 8 && col < 3);
                  const isDark = isCorner || (row * 7 + col * 11) % 3 === 0;
                  return (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: deterministic QR grid
                      key={i}
                      className={isDark ? "bg-gray-900" : "bg-white"}
                    />
                  );
                })}
              </div>
              {/* Avatar in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-wa-green flex items-center justify-center border-2 border-white shadow">
                  <span className="text-white font-bold text-[16px]">
                    {userProfile.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-white text-[16px] font-semibold">
              {userProfile.name}
            </p>
            <p className="text-white/50 text-[12px]">
              Scan to message me on WhatsApp
            </p>
            {/* Action buttons */}
            <div className="flex gap-3 w-full">
              <button
                type="button"
                data-ocid="settings.qr.share_button"
                className="flex-1 py-3 rounded-xl bg-wa-green text-white font-semibold text-[14px] hover:brightness-105 transition-all"
              >
                Share
              </button>
              <button
                type="button"
                data-ocid="settings.qr.scan_button"
                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold text-[14px] hover:bg-white/20 transition-all"
              >
                Scan
              </button>
            </div>
          </div>
        </div>
      )}
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

      {/* NEW: Clear all data confirmation dialog */}
      <AlertDialog open={clearAllDataOpen} onOpenChange={setClearAllDataOpen}>
        <AlertDialogContent data-ocid="settings.advanced.cleardata.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently erase all app data including chats, media,
              and settings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="settings.advanced.cleardata.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="settings.advanced.cleardata.confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                localStorage.clear();
                setClearAllDataOpen(false);
              }}
            >
              Clear all data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
