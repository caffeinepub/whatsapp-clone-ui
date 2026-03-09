import { ArrowLeft, Star } from "lucide-react";
import ContactAvatar from "./ContactAvatar";

interface StarredMessagesScreenProps {
  onBack: () => void;
}

const STARRED_MESSAGES = [
  {
    contact: "Emma Rodriguez",
    initials: "ER",
    colorIndex: 0,
    time: "10:42 AM",
    message: "Are we still meeting for coffee tomorrow? ☕",
    date: "Today",
  },
  {
    contact: "Marcus Chen",
    initials: "MC",
    colorIndex: 1,
    time: "9:15 AM",
    message:
      "I shared the new Figma mockups in the drive — check the link I sent earlier",
    date: "Today",
  },
  {
    contact: "Team Design Sprint",
    initials: "TD",
    colorIndex: 2,
    time: "Yesterday",
    message: "Great work! The stakeholders are going to love it 🎉",
    date: "Yesterday",
  },
  {
    contact: "Priya Sharma",
    initials: "PS",
    colorIndex: 4,
    time: "Mon",
    message: "The presentation went really well! Let's catch up this week",
    date: "Mon, Mar 7",
  },
  {
    contact: "Jordan Williams",
    initials: "JW",
    colorIndex: 3,
    time: "Sun",
    message: "Let me know when you're free to catch up 🙌",
    date: "Sun, Mar 6",
  },
];

export default function StarredMessagesScreen({
  onBack,
}: StarredMessagesScreenProps) {
  return (
    <div
      data-ocid="starred.panel"
      className="absolute inset-0 z-50 flex flex-col bg-background animate-slide-up"
    >
      {/* Sticky header */}
      <header
        className="sticky top-0 z-50 bg-wa-header flex items-center gap-2 px-2 pb-3 flex-shrink-0"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
      >
        <button
          type="button"
          data-ocid="starred.back.button"
          onClick={onBack}
          className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-wa-header-fg text-[18px] font-bold font-display">
          Starred messages
        </h2>
      </header>

      {/* Scrollable list */}
      <main className="flex-1 overflow-y-auto bg-card divide-y divide-border/60">
        {STARRED_MESSAGES.map((item, i) => (
          <div
            key={`starred-${item.contact}-${i}`}
            data-ocid={`starred.item.${i + 1}`}
            className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors"
          >
            <ContactAvatar
              initials={item.initials}
              size="md"
              colorIndex={item.colorIndex}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="font-semibold text-[14px] text-foreground truncate font-display">
                  {item.contact}
                </span>
                <span className="text-[11px] text-wa-timestamp flex-shrink-0">
                  {item.time}
                </span>
              </div>
              <p className="text-[13px] text-muted-foreground line-clamp-2 leading-snug">
                {item.message}
              </p>
            </div>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0 mt-0.5" />
          </div>
        ))}
      </main>
    </div>
  );
}
