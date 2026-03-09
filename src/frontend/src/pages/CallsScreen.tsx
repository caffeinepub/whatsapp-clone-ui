import { Phone, Search, Video } from "lucide-react";
import { useState } from "react";
import ContactAvatar from "../components/ContactAvatar";
import NewCallDialog from "../components/NewCallDialog";
import type { ActiveCall } from "../hooks/useAppState";

interface CallsScreenProps {
  onOpenCall: (contact: ActiveCall) => void;
}

const RECENT_CALLS = [
  {
    name: "Emma Rodriguez",
    initials: "ER",
    type: "incoming",
    kind: "voice" as const,
    time: "Today, 10:30 AM",
    missed: false,
    colorIndex: 0,
  },
  {
    name: "Marcus Chen",
    initials: "MC",
    type: "outgoing",
    kind: "video" as const,
    time: "Today, 9:15 AM",
    missed: false,
    colorIndex: 1,
  },
  {
    name: "Priya Sharma",
    initials: "PS",
    type: "missed",
    kind: "voice" as const,
    time: "Yesterday, 8:45 PM",
    missed: true,
    colorIndex: 4,
  },
  {
    name: "Jordan Williams",
    initials: "JW",
    type: "incoming",
    kind: "voice" as const,
    time: "Yesterday, 3:20 PM",
    missed: false,
    colorIndex: 3,
  },
  {
    name: "Sarah & Mike",
    initials: "SM",
    type: "outgoing",
    kind: "video" as const,
    time: "Mon, 6:00 PM",
    missed: false,
    colorIndex: 5,
  },
];

export default function CallsScreen({ onOpenCall }: CallsScreenProps) {
  const [newCallOpen, setNewCallOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-wa-header px-4 pt-12 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-wa-header-fg text-[22px] font-bold font-display">
            Calls
          </h1>
          <div className="flex items-center gap-1">
            <button
              type="button"
              data-ocid="calls.search.button"
              className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg transition-colors rounded-full hover:bg-white/10"
              aria-label="Search calls"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-card">
        {/* New call button */}
        <div className="px-4 py-3 border-b border-border">
          <button
            type="button"
            data-ocid="calls.new_call.button"
            onClick={() => setNewCallOpen(true)}
            className="flex items-center gap-3 w-full hover:bg-muted/50 rounded-xl p-2 -mx-2 transition-colors text-left"
          >
            <div className="w-11 h-11 bg-wa-green/15 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-wa-green" />
            </div>
            <p className="font-semibold text-[15px] text-wa-green font-display">
              New Call
            </p>
          </button>
        </div>

        {/* Recent calls */}
        <div className="px-4 py-3">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Recent
          </p>
          <div className="space-y-1">
            {RECENT_CALLS.map((call, i) => (
              <button
                type="button"
                key={`${call.name}-${i}`}
                data-ocid={`calls.item.${i + 1}`}
                onClick={() =>
                  onOpenCall({
                    name: call.name,
                    initials: call.initials,
                    kind: call.kind,
                    colorIndex: call.colorIndex,
                  })
                }
                className="flex items-center gap-3 py-2 w-full hover:bg-muted/40 rounded-xl px-2 -mx-2 transition-colors text-left"
              >
                <ContactAvatar
                  initials={call.initials}
                  size="md"
                  colorIndex={call.colorIndex}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-[15px] truncate font-display ${call.missed ? "text-destructive" : "text-foreground"}`}
                  >
                    {call.name}
                  </p>
                  <div className="flex items-center gap-1">
                    {call.kind === "video" ? (
                      <Video className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <Phone className="w-3 h-3 text-muted-foreground" />
                    )}
                    <p className="text-[12px] text-muted-foreground truncate">
                      {call.type === "missed"
                        ? "Missed"
                        : call.type === "incoming"
                          ? "Incoming"
                          : "Outgoing"}{" "}
                      · {call.time}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  data-ocid={`calls.call.button.${i + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCall({
                      name: call.name,
                      initials: call.initials,
                      kind: call.kind,
                      colorIndex: call.colorIndex,
                    });
                  }}
                  className="p-2 text-wa-green hover:bg-wa-green/10 rounded-full transition-colors"
                  aria-label={`Call ${call.name}`}
                >
                  {call.kind === "video" ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <Phone className="w-5 h-5" />
                  )}
                </button>
              </button>
            ))}
          </div>
        </div>
      </main>

      <NewCallDialog
        open={newCallOpen}
        onClose={() => setNewCallOpen(false)}
        onCall={onOpenCall}
      />
    </div>
  );
}
