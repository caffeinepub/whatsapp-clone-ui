import { Separator } from "@/components/ui/separator";
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
import ContactAvatar from "../components/ContactAvatar";

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

export default function SettingsScreen() {
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
            className="flex items-center gap-4 w-full hover:bg-muted/40 rounded-xl p-2 -mx-2 transition-colors text-left"
          >
            <ContactAvatar initials="ME" size="lg" colorIndex={2} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[18px] text-foreground font-display">
                Alex Johnson
              </p>
              <p className="text-[13px] text-muted-foreground truncate">
                Building great things one line at a time ✨
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
    </div>
  );
}
