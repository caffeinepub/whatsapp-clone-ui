import { ArrowLeft, Megaphone, Users } from "lucide-react";
import { useState } from "react";

interface BroadcastListsScreenProps {
  onBack: () => void;
}

const SAMPLE_BROADCASTS = [
  {
    name: "VIP Customers",
    recipients: 47,
    lastMessage: "Special offer just for you! 🎁",
    time: "Yesterday",
    colorIndex: 0,
    initials: "VC",
  },
  {
    name: "Weekly Newsletter",
    recipients: 312,
    lastMessage: "This week's highlights and updates",
    time: "Mon",
    colorIndex: 1,
    initials: "WN",
  },
];

export default function BroadcastListsScreen({
  onBack,
}: BroadcastListsScreenProps) {
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [newBroadcastName, setNewBroadcastName] = useState("");
  const [broadcasts, setBroadcasts] = useState(SAMPLE_BROADCASTS);

  const handleCreate = () => {
    if (!newBroadcastName.trim()) return;
    setBroadcasts((prev) => [
      {
        name: newBroadcastName.trim(),
        recipients: 0,
        lastMessage: "No messages yet",
        time: "Now",
        colorIndex: 2,
        initials: newBroadcastName.trim().slice(0, 2).toUpperCase(),
      },
      ...prev,
    ]);
    setNewBroadcastName("");
    setShowCreateSheet(false);
  };

  return (
    <div
      data-ocid="broadcast.panel"
      className="absolute inset-0 z-50 flex flex-col bg-background animate-slide-up"
    >
      {/* Sticky header */}
      <header
        className="sticky top-0 z-50 bg-wa-header flex items-center gap-2 px-2 pb-3 flex-shrink-0"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
      >
        <button
          type="button"
          data-ocid="broadcast.back.button"
          onClick={onBack}
          className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-wa-header-fg text-[18px] font-bold font-display flex-1">
          Business broadcasts
        </h2>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto bg-secondary/20">
        {/* New broadcast button */}
        <div className="p-3">
          <button
            type="button"
            data-ocid="broadcast.new.button"
            onClick={() => setShowCreateSheet(true)}
            className="w-full bg-wa-green text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:brightness-105 active:brightness-95 transition-all shadow-sm"
          >
            <Megaphone className="w-5 h-5" />
            New broadcast
          </button>
        </div>

        {/* Broadcast list info */}
        <div className="px-4 py-2">
          <p className="text-[12px] text-muted-foreground">
            Broadcast messages are sent to all recipients as individual
            messages. Only contacts who have your number saved will receive
            them.
          </p>
        </div>

        {/* Lists */}
        <div className="bg-card mt-2 divide-y divide-border/60">
          {broadcasts.map((item, i) => (
            <button
              key={`bc-${item.name}-${i}`}
              type="button"
              data-ocid={`broadcast.item.${i + 1}`}
              className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-muted/40 transition-colors text-left"
            >
              {/* Broadcast icon */}
              <div className="w-11 h-11 bg-wa-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Megaphone className="w-5 h-5 text-wa-green" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[15px] text-foreground truncate font-display">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-wa-timestamp flex-shrink-0">
                    {item.time}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-[13px] text-muted-foreground truncate flex-1">
                    {item.lastMessage}
                  </p>
                  <div className="flex items-center gap-1 flex-shrink-0 text-[12px] text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span>{item.recipients}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Create broadcast sheet */}
      {showCreateSheet && (
        <>
          <div
            className="absolute inset-0 z-50 bg-black/50"
            onClick={() => setShowCreateSheet(false)}
            onKeyDown={(e) => e.key === "Escape" && setShowCreateSheet(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close"
          />
          <div
            data-ocid="broadcast.create.sheet"
            className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl animate-slide-up p-4"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
          >
            <div className="flex justify-center pt-1 pb-3">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            <h3 className="text-[17px] font-bold text-foreground mb-4 font-display">
              New broadcast list
            </h3>
            <input
              data-ocid="broadcast.create.input"
              type="text"
              value={newBroadcastName}
              onChange={(e) => setNewBroadcastName(e.target.value)}
              placeholder="Broadcast list name"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground outline-none focus:border-wa-green transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                data-ocid="broadcast.create.cancel_button"
                onClick={() => setShowCreateSheet(false)}
                className="flex-1 py-3 rounded-xl border border-border text-[15px] font-semibold text-foreground hover:bg-muted/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="broadcast.create.confirm_button"
                onClick={handleCreate}
                disabled={!newBroadcastName.trim()}
                className="flex-1 py-3 rounded-xl bg-wa-green text-white text-[15px] font-semibold hover:brightness-105 disabled:opacity-50 transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
