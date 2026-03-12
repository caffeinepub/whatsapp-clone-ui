import { ArrowLeft, Bell, ChevronDown, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface NotificationsCenterScreenProps {
  onBack: () => void;
}

interface Notification {
  id: number;
  type: "message" | "mention" | "missed_call";
  name: string;
  initials: string;
  preview: string;
  time: string;
  unread: boolean;
  colorIndex: number;
}

const AVATAR_COLORS = [
  "bg-[#F44336]",
  "bg-[#2196F3]",
  "bg-[#4CAF50]",
  "bg-[#FF9800]",
  "bg-[#9C27B0]",
  "bg-[#00BCD4]",
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "message",
    name: "Emma Rodriguez",
    initials: "ER",
    preview: "Hey! Are you free tonight? 😊",
    time: "2m ago",
    unread: true,
    colorIndex: 0,
  },
  {
    id: 2,
    type: "missed_call",
    name: "Marcus Chen",
    initials: "MC",
    preview: "Missed voice call",
    time: "10m ago",
    unread: true,
    colorIndex: 1,
  },
  {
    id: 3,
    type: "mention",
    name: "Work Team",
    initials: "WT",
    preview: "@you Please review the document",
    time: "25m ago",
    unread: true,
    colorIndex: 2,
  },
  {
    id: 4,
    type: "message",
    name: "Priya Sharma",
    initials: "PS",
    preview: "Thanks for the help! 🙏",
    time: "1h ago",
    unread: false,
    colorIndex: 4,
  },
  {
    id: 5,
    type: "missed_call",
    name: "Jordan Williams",
    initials: "JW",
    preview: "Missed video call",
    time: "2h ago",
    unread: true,
    colorIndex: 3,
  },
  {
    id: 6,
    type: "mention",
    name: "Family Group",
    initials: "FG",
    preview: "@you Check this out!",
    time: "3h ago",
    unread: false,
    colorIndex: 5,
  },
  {
    id: 7,
    type: "message",
    name: "Alex Thompson",
    initials: "AT",
    preview: "See you tomorrow!",
    time: "5h ago",
    unread: false,
    colorIndex: 2,
  },
  {
    id: 8,
    type: "message",
    name: "Neha Gupta",
    initials: "NG",
    preview: "Loved the photos!",
    time: "Yesterday",
    unread: false,
    colorIndex: 0,
  },
];

type FilterTab = "all" | "mentions" | "missed_calls";

export default function NotificationsCenterScreen({
  onBack,
}: NotificationsCenterScreenProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [muteSheet, setMuteSheet] = useState<number | null>(null);

  const filtered = notifications.filter((n) => {
    if (activeTab === "mentions") return n.type === "mention";
    if (activeTab === "missed_calls") return n.type === "missed_call";
    return true;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const dismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center gap-3 px-4 flex-shrink-0"
        style={{
          background: "#128C7E",
          paddingTop: "max(env(safe-area-inset-top, 0px), 44px)",
          paddingBottom: "12px",
        }}
      >
        <button
          type="button"
          data-ocid="notifications.back_button"
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Bell className="w-5 h-5 text-white" />
          <h1 className="text-white font-bold text-[18px]">Notifications</h1>
        </div>
        <button
          type="button"
          data-ocid="notifications.mark_read.button"
          onClick={markAllRead}
          className="text-white/80 text-[13px] font-semibold"
        >
          Mark all read
        </button>
      </header>

      {/* Filter tabs */}
      <div className="flex border-b border-border bg-card sticky top-[calc(44px+env(safe-area-inset-top,0px))] z-40">
        {(["all", "mentions", "missed_calls"] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            data-ocid={`notifications.${tab}.tab`}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[13px] font-semibold capitalize transition-colors ${
              activeTab === tab
                ? "text-wa-green border-b-2 border-wa-green"
                : "text-muted-foreground"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-48 gap-3"
            data-ocid="notifications.empty_state"
          >
            <Bell className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-muted-foreground text-[14px]">
              No notifications
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((n, i) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                data-ocid={`notifications.item.${i + 1}`}
                className={`flex items-center gap-3 px-4 py-3.5 border-b border-border/60 ${
                  n.unread ? "bg-wa-green/5" : "bg-card"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-[13px] font-bold ${AVATAR_COLORS[n.colorIndex % AVATAR_COLORS.length]}`}
                  >
                    {n.initials}
                  </div>
                  {n.type === "missed_call" && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <Phone className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-semibold text-foreground truncate">
                      {n.name}
                    </p>
                    <span className="text-[11px] text-muted-foreground flex-shrink-0 ml-2">
                      {n.time}
                    </span>
                  </div>
                  <p
                    className={`text-[13px] truncate ${n.type === "missed_call" ? "text-red-400" : "text-muted-foreground"}`}
                  >
                    {n.preview}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {n.unread && (
                    <span className="w-2 h-2 rounded-full bg-wa-green" />
                  )}
                  <button
                    type="button"
                    data-ocid={`notifications.settings.button.${i + 1}`}
                    onClick={() => setMuteSheet(n.id)}
                    className="p-1.5 rounded-full hover:bg-muted"
                  >
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    data-ocid={`notifications.delete_button.${i + 1}`}
                    onClick={() => dismiss(n.id)}
                    className="p-1.5 rounded-full hover:bg-muted"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Mute options sheet */}
      <AnimatePresence>
        {muteSheet !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/50 flex items-end"
            data-ocid="notifications.mute.sheet"
          >
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              className="w-full bg-card rounded-t-3xl p-6"
            >
              <div className="w-12 h-1 bg-border rounded-full mb-4 mx-auto" />
              <p className="text-[16px] font-bold text-foreground mb-4">
                Notification Settings
              </p>
              {[
                "Mute for 8 hours",
                "Mute for 1 week",
                "Always mute",
                "Turn off notifications",
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  data-ocid="notifications.mute.button"
                  onClick={() => setMuteSheet(null)}
                  className="w-full text-left py-3.5 border-b border-border/60 text-[15px] text-foreground hover:text-wa-green transition-colors"
                >
                  {opt}
                </button>
              ))}
              <button
                type="button"
                data-ocid="notifications.mute.cancel_button"
                onClick={() => setMuteSheet(null)}
                className="w-full py-3 mt-3 rounded-xl bg-muted text-foreground font-semibold"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
