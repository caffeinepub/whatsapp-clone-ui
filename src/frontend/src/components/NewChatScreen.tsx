import {
  ArrowLeft,
  MoreVertical,
  QrCode,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import ContactAvatar from "./ContactAvatar";

interface NewChatScreenProps {
  open: boolean;
  onClose: () => void;
  onSelectContact?: (name: string) => void;
}

const FREQUENT_CONTACTS = [
  {
    id: 1,
    name: "Emma Rodriguez",
    status: "Hey there! I am using WhatsApp",
    initials: "ER",
    colorIndex: 0,
  },
  {
    id: 2,
    name: "Marcus Chen",
    status: "Available",
    initials: "MC",
    colorIndex: 1,
  },
  {
    id: 3,
    name: "Priya Sharma",
    status: "Busy 📵",
    initials: "PS",
    colorIndex: 4,
  },
  {
    id: 4,
    name: "Jordan Williams",
    status: "At work",
    initials: "JW",
    colorIndex: 3,
  },
  {
    id: 5,
    name: "Sarah Johnson",
    status: "Living life 🌟",
    initials: "SJ",
    colorIndex: 2,
  },
];

const WA_CONTACTS: {
  id: number;
  name: string;
  status: string;
  initials: string;
  colorIndex: number;
  isYou?: boolean;
}[] = [
  {
    id: 10,
    name: "You",
    status: "Message yourself",
    initials: "ME",
    colorIndex: 5,
    isYou: true,
  },
  {
    id: 11,
    name: "Alex Turner",
    status: "🎵 Music is life",
    initials: "AT",
    colorIndex: 0,
  },
  {
    id: 12,
    name: "Divya Patel",
    status: "Be happy 😊",
    initials: "DP",
    colorIndex: 2,
  },
];

export default function NewChatScreen({
  open,
  onClose,
  onSelectContact,
}: NewChatScreenProps) {
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filtered = <T extends { name: string }>(list: T[]): T[] =>
    search
      ? list.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      : list;

  return (
    <div
      data-ocid="newchat.panel"
      className="absolute inset-0 z-40 flex flex-col bg-background animate-slide-up"
    >
      {/* Header */}
      <header
        className="bg-wa-header flex items-center gap-2 px-2 pb-3 flex-shrink-0"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 16px)" }}
      >
        <button
          type="button"
          data-ocid="newchat.back.button"
          onClick={onClose}
          className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-wa-header-fg font-bold text-[18px]">New chat</h1>
          <p className="text-wa-header-fg/60 text-[12px]">
            {FREQUENT_CONTACTS.length + WA_CONTACTS.length} contacts
          </p>
        </div>
        <button
          type="button"
          data-ocid="newchat.menu.button"
          className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* Search */}
      <div className="px-3 py-2 bg-background border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            data-ocid="newchat.search_input"
            type="text"
            placeholder="Search name or number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Quick actions */}
        {!search && (
          <>
            <button
              type="button"
              data-ocid="newchat.new_group.button"
              className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-muted/60 transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-wa-teal flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-[15px] text-foreground">
                New group
              </span>
            </button>

            <button
              type="button"
              data-ocid="newchat.new_contact.button"
              className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-muted/60 transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-wa-teal flex items-center justify-center flex-shrink-0">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-[15px] text-foreground flex-1 text-left">
                New contact
              </span>
              <QrCode className="w-5 h-5 text-muted-foreground" />
            </button>

            <button
              type="button"
              data-ocid="newchat.broadcast.button"
              className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-muted/60 transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-wa-teal flex items-center justify-center flex-shrink-0">
                <svg
                  role="img"
                  aria-label="Broadcast"
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <title>Broadcast</title>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91A16 16 0 0016 17.82l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <span className="font-medium text-[15px] text-foreground">
                New business broadcast
              </span>
            </button>
          </>
        )}

        {/* Frequently contacted */}
        {filtered(FREQUENT_CONTACTS).length > 0 && (
          <>
            <div className="px-4 py-2 bg-secondary/30">
              <p className="text-[12px] font-semibold text-wa-teal uppercase tracking-wide">
                Frequently contacted
              </p>
            </div>
            {filtered(FREQUENT_CONTACTS).map((contact, i) => (
              <button
                key={contact.id}
                type="button"
                data-ocid={`newchat.contact.item.${i + 1}`}
                onClick={() => {
                  onSelectContact?.(contact.name);
                  onClose();
                }}
                className="flex items-center gap-4 w-full px-4 py-3 hover:bg-muted/60 transition-colors text-left"
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
                  <p className="text-[13px] text-muted-foreground truncate">
                    {contact.status}
                  </p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/40 flex-shrink-0" />
              </button>
            ))}
          </>
        )}

        {/* Contacts on WhatsApp */}
        {filtered(WA_CONTACTS).length > 0 && (
          <>
            <div className="px-4 py-2 bg-secondary/30">
              <p className="text-[12px] font-semibold text-wa-teal uppercase tracking-wide">
                Contacts on WhatsApp
              </p>
            </div>
            {filtered(WA_CONTACTS).map((contact, i) => (
              <button
                key={contact.id}
                type="button"
                data-ocid={`newchat.wa_contact.item.${i + 1}`}
                onClick={() => {
                  onSelectContact?.(contact.name);
                  onClose();
                }}
                className="flex items-center gap-4 w-full px-4 py-3 hover:bg-muted/60 transition-colors text-left"
              >
                <ContactAvatar
                  initials={contact.initials}
                  size="md"
                  colorIndex={contact.colorIndex}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[15px] text-foreground truncate">
                    {contact.name}
                    {contact.isYou && (
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        (You)
                      </span>
                    )}
                  </p>
                  <p className="text-[13px] text-muted-foreground truncate">
                    {contact.status}
                  </p>
                </div>
              </button>
            ))}
          </>
        )}

        {search &&
          filtered(FREQUENT_CONTACTS).length === 0 &&
          filtered(WA_CONTACTS).length === 0 && (
            <div
              data-ocid="newchat.empty_state"
              className="flex flex-col items-center justify-center py-16 gap-3"
            >
              <Search className="w-12 h-12 text-muted-foreground/40" />
              <p className="text-[15px] text-muted-foreground">
                No contacts found
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
