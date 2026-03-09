import { Camera, Pencil } from "lucide-react";
import { useState } from "react";
import ContactAvatar from "../components/ContactAvatar";
import StatusPostDialog from "../components/StatusPostDialog";
import type { UserStatus } from "../hooks/useAppState";

interface StatusScreenProps {
  onOpenStatusViewer: (index: number) => void;
  userStatuses: UserStatus[];
  onAddStatus: (text: string) => void;
}

const RECENT_UPDATES = [
  {
    name: "Emma Rodriguez",
    initials: "ER",
    time: "2 minutes ago",
    viewed: false,
    colorIndex: 0,
  },
  {
    name: "Marcus Chen",
    initials: "MC",
    time: "15 minutes ago",
    viewed: false,
    colorIndex: 1,
  },
  {
    name: "Priya Sharma",
    initials: "PS",
    time: "1 hour ago",
    viewed: true,
    colorIndex: 4,
  },
  {
    name: "Jordan Williams",
    initials: "JW",
    time: "3 hours ago",
    viewed: true,
    colorIndex: 3,
  },
];

export default function StatusScreen({
  onOpenStatusViewer,
  userStatuses,
  onAddStatus,
}: StatusScreenProps) {
  const [postDialogOpen, setPostDialogOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header
        className="bg-wa-header px-4 pb-3 flex-shrink-0"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-wa-header-fg text-[22px] font-bold font-display">
            Status
          </h1>
          <div className="flex items-center gap-1">
            <button
              type="button"
              data-ocid="status.pencil.button"
              onClick={() => setPostDialogOpen(true)}
              className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg transition-colors rounded-full hover:bg-white/10"
              aria-label="Text status"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              type="button"
              data-ocid="status.camera.button"
              className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg transition-colors rounded-full hover:bg-white/10"
              aria-label="Camera status"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-card">
        {/* My Status */}
        <div className="px-4 py-3 border-b border-border">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            My Status
          </p>
          <button
            type="button"
            data-ocid="status.my_status.button"
            onClick={() => setPostDialogOpen(true)}
            className="flex items-center gap-3 w-full hover:bg-muted/50 rounded-xl p-2 -mx-2 transition-colors text-left"
          >
            <div className="relative">
              <ContactAvatar initials="ME" size="md" colorIndex={2} />
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-wa-green rounded-full flex items-center justify-center border-2 border-card">
                <span className="text-white text-[10px] font-bold leading-none">
                  +
                </span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-[15px] text-foreground font-display">
                My Status
              </p>
              {userStatuses.length > 0 ? (
                <p className="text-[13px] text-muted-foreground">
                  {userStatuses[0].text.slice(0, 40)}
                  {userStatuses[0].text.length > 40 ? "…" : ""}
                </p>
              ) : (
                <p className="text-[13px] text-muted-foreground">
                  Tap to add status update
                </p>
              )}
            </div>
          </button>

          {/* User's own posted statuses */}
          {userStatuses.length > 0 && (
            <div className="mt-2 space-y-1 pl-2">
              {userStatuses.slice(0, 3).map((s) => (
                <div
                  key={`my-status-${s.time}`}
                  className="text-[12px] text-muted-foreground flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-wa-green flex-shrink-0" />
                  <span className="truncate">{s.text}</span>
                  <span className="flex-shrink-0 text-[11px]">· {s.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Updates */}
        <div className="px-4 py-3">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Recent Updates
          </p>
          <div className="space-y-1">
            {RECENT_UPDATES.map((item, i) => (
              <button
                type="button"
                key={item.name}
                data-ocid={`status.item.${i + 1}`}
                onClick={() => onOpenStatusViewer(i)}
                className="flex items-center gap-3 w-full hover:bg-muted/50 rounded-xl p-2 -mx-2 transition-colors text-left"
              >
                <div
                  className={`p-0.5 rounded-full ${item.viewed ? "border-2 border-muted-foreground/40" : "border-2 border-wa-green"}`}
                >
                  <ContactAvatar
                    initials={item.initials}
                    size="md"
                    colorIndex={item.colorIndex}
                  />
                </div>
                <div>
                  <p className="font-semibold text-[15px] text-foreground font-display">
                    {item.name}
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {item.time}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      <StatusPostDialog
        open={postDialogOpen}
        onClose={() => setPostDialogOpen(false)}
        onPost={onAddStatus}
      />
    </div>
  );
}
