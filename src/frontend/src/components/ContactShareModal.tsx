import { Check, Phone, X } from "lucide-react";
import { useState } from "react";
import ContactAvatar from "./ContactAvatar";

const SHARE_CONTACTS = [
  {
    id: 1,
    name: "Emma Rodriguez",
    phone: "+91 98765 43210",
    initials: "ER",
    colorIndex: 0,
  },
  {
    id: 2,
    name: "Marcus Chen",
    phone: "+1 415 555 0192",
    initials: "MC",
    colorIndex: 1,
  },
  {
    id: 3,
    name: "Priya Sharma",
    phone: "+91 77654 32109",
    initials: "PS",
    colorIndex: 4,
  },
  {
    id: 4,
    name: "Jordan Williams",
    phone: "+44 7911 123456",
    initials: "JW",
    colorIndex: 3,
  },
  {
    id: 5,
    name: "Sarah & Mike",
    phone: "+91 87654 32109",
    initials: "SM",
    colorIndex: 5,
  },
  {
    id: 6,
    name: "Alex Thompson",
    phone: "+1 650 555 0134",
    initials: "AT",
    colorIndex: 2,
  },
  {
    id: 7,
    name: "Riya Patel",
    phone: "+91 90123 45678",
    initials: "RP",
    colorIndex: 1,
  },
  {
    id: 8,
    name: "Dev Singh",
    phone: "+91 88765 43210",
    initials: "DS",
    colorIndex: 0,
  },
];

interface ContactShareModalProps {
  open: boolean;
  onClose: () => void;
  onShare: (contact: { name: string; phone: string; initials: string }) => void;
}

export default function ContactShareModal({
  open,
  onClose,
  onShare,
}: ContactShareModalProps) {
  const [selected, setSelected] = useState<number | null>(null);

  if (!open) return null;

  const selectedContact = SHARE_CONTACTS.find((c) => c.id === selected);

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
        data-ocid="contact_share.sheet"
        className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl animate-slide-up max-h-[80vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0 border-b border-border">
          <p className="text-[17px] font-bold text-foreground">Share Contact</p>
          <button
            type="button"
            data-ocid="contact_share.close_button"
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {SHARE_CONTACTS.map((contact, i) => (
            <button
              key={contact.id}
              type="button"
              data-ocid={`contact_share.item.${i + 1}`}
              onClick={() =>
                setSelected(contact.id === selected ? null : contact.id)
              }
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/60 transition-colors text-left"
            >
              <ContactAvatar
                initials={contact.initials}
                size="md"
                colorIndex={contact.colorIndex}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[15px] text-foreground truncate">
                  {contact.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  <p className="text-[12px] text-muted-foreground">
                    {contact.phone}
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  selected === contact.id
                    ? "bg-wa-green border-wa-green"
                    : "border-muted-foreground/40"
                }`}
              >
                {selected === contact.id && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex-shrink-0 px-4 py-3 border-t border-border">
          <button
            type="button"
            data-ocid="contact_share.send_button"
            disabled={!selectedContact}
            onClick={() => {
              if (selectedContact) {
                onShare(selectedContact);
                setSelected(null);
                onClose();
              }
            }}
            className="w-full py-3 rounded-full bg-wa-green text-white font-semibold text-[15px] disabled:opacity-40 hover:brightness-105 transition-all"
          >
            Share
          </button>
        </div>
        <div style={{ height: "env(safe-area-inset-bottom, 8px)" }} />
      </div>
    </>
  );
}
