import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ContactAvatar from "./ContactAvatar";

const FORWARD_CONTACTS = [
  { id: 1, name: "Emma Rodriguez", initials: "ER", lastSeen: "online" },
  { id: 2, name: "Marcus Chen", initials: "MC", lastSeen: "2 min ago" },
  { id: 3, name: "Priya Sharma", initials: "PS", lastSeen: "1 hour ago" },
  { id: 4, name: "Jordan Williams", initials: "JW", lastSeen: "yesterday" },
  { id: 5, name: "Sarah & Mike", initials: "SM", lastSeen: "3 hours ago" },
  { id: 6, name: "Team Design Sprint", initials: "TD", lastSeen: "4 members" },
  { id: 7, name: "Alex Thompson", initials: "AT", lastSeen: "online" },
  { id: 8, name: "Riya Patel", initials: "RP", lastSeen: "5 min ago" },
  { id: 9, name: "Dev Singh", initials: "DS", lastSeen: "yesterday" },
  { id: 10, name: "Kenji Nakamura", initials: "KN", lastSeen: "2 days ago" },
];

interface ForwardMessageSheetProps {
  open: boolean;
  messageContent: string;
  onClose: () => void;
  onForward: (contactNames: string[]) => void;
}

export default function ForwardMessageSheet({
  open,
  messageContent,
  onClose,
  onForward,
}: ForwardMessageSheetProps) {
  const [selected, setSelected] = useState<number[]>([]);

  if (!open) return null;

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleForward = () => {
    const names = FORWARD_CONTACTS.filter((c) => selected.includes(c.id)).map(
      (c) => c.name,
    );
    onForward(names);
    toast.success(
      `Message forwarded to ${names.length} contact${names.length > 1 ? "s" : ""}`,
    );
    setSelected([]);
    onClose();
  };

  return (
    <>
      <div
        className="absolute inset-0 z-40 bg-black/40"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close"
      />
      <div
        data-ocid="forward.sheet"
        className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl animate-slide-up max-h-[85vh] flex flex-col"
      >
        <div className="flex flex-col items-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mb-3" />
          <p className="text-[16px] font-bold text-foreground">
            Forward message
          </p>
          <p className="text-[12px] text-muted-foreground mt-1 px-8 text-center truncate">
            "{messageContent.slice(0, 60)}
            {messageContent.length > 60 ? "..." : ""}"
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {FORWARD_CONTACTS.map((contact, i) => {
            const isSelected = selected.includes(contact.id);
            return (
              <button
                key={contact.id}
                type="button"
                data-ocid={`forward.contact.item.${i + 1}`}
                onClick={() => toggle(contact.id)}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/60 transition-colors text-left"
              >
                <ContactAvatar
                  initials={contact.initials}
                  size="md"
                  colorIndex={i}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[15px] text-foreground truncate">
                    {contact.name}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {contact.lastSeen}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected
                      ? "bg-wa-green border-wa-green"
                      : "border-muted-foreground/40"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex-shrink-0 px-4 py-3 border-t border-border">
          <button
            type="button"
            data-ocid="forward.send_button"
            disabled={selected.length === 0}
            onClick={handleForward}
            className="w-full py-3 rounded-full bg-wa-green text-white font-semibold text-[15px] disabled:opacity-40 transition-all hover:brightness-105"
          >
            Forward to{" "}
            {selected.length > 0
              ? `${selected.length} contact${selected.length > 1 ? "s" : ""}`
              : "..."}
          </button>
        </div>
        <div style={{ height: "env(safe-area-inset-bottom, 8px)" }} />
      </div>
    </>
  );
}
