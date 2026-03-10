import {
  ArrowLeft,
  Check,
  MoreVertical,
  QrCode,
  Radio,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ContactAvatar from "./ContactAvatar";

interface NewChatScreenProps {
  open: boolean;
  onClose: () => void;
  onSelectContact?: (name: string) => void;
  onNewGroup?: () => void;
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
  onNewGroup,
}: NewChatScreenProps) {
  const [search, setSearch] = useState("");
  const [newContactOpen, setNewContactOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);

  // New contact form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Broadcast form
  const [broadcastName, setBroadcastName] = useState("");
  const [selectedForBroadcast, setSelectedForBroadcast] = useState<number[]>(
    [],
  );

  if (!open) return null;

  const filtered = <T extends { name: string }>(list: T[]): T[] =>
    search
      ? list.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      : list;

  const handleSaveContact = () => {
    if (!firstName.trim() || !phone.trim()) return;
    toast.success(`Contact "${firstName} ${lastName}" saved`);
    setFirstName("");
    setLastName("");
    setPhone("");
    setNewContactOpen(false);
  };

  const handleCreateBroadcast = () => {
    if (!broadcastName.trim() || selectedForBroadcast.length === 0) return;
    toast.success(
      `Broadcast list "${broadcastName}" created with ${selectedForBroadcast.length} contacts`,
    );
    setBroadcastName("");
    setSelectedForBroadcast([]);
    setBroadcastOpen(false);
  };

  const allBroadcastContacts = [
    ...FREQUENT_CONTACTS,
    ...WA_CONTACTS.filter((c) => !c.isYou),
  ];

  const toggleBroadcastContact = (id: number) => {
    setSelectedForBroadcast((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div
      data-ocid="newchat.panel"
      className="absolute inset-0 z-40 flex flex-col bg-background animate-slide-up"
    >
      {/* Header */}
      <header
        className="bg-wa-header flex items-center gap-2 px-2 pb-3 flex-shrink-0"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
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
              onClick={() => {
                onNewGroup?.();
                onClose();
              }}
              className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-muted/60 transition-all duration-150"
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
              onClick={() => setNewContactOpen(true)}
              className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-muted/60 transition-all duration-150"
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
              onClick={() => setBroadcastOpen(true)}
              className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-muted/60 transition-all duration-150"
            >
              <div className="w-11 h-11 rounded-full bg-wa-teal flex items-center justify-center flex-shrink-0">
                <Radio className="w-5 h-5 text-white" />
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
                className="flex items-center gap-4 w-full px-4 py-3 hover:bg-muted/60 transition-all duration-150 text-left"
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
                className="flex items-center gap-4 w-full px-4 py-3 hover:bg-muted/60 transition-all duration-150 text-left"
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

      {/* New Contact Bottom Sheet */}
      {newContactOpen && (
        <div
          data-ocid="newchat.new_contact.sheet"
          className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40"
          onKeyDown={(e) => e.key === "Escape" && setNewContactOpen(false)}
          onClick={(e) =>
            e.target === e.currentTarget && setNewContactOpen(false)
          }
        >
          <div className="bg-card rounded-t-3xl flex flex-col">
            <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-border">
              <h2 className="text-[17px] font-semibold text-foreground">
                New contact
              </h2>
              <button
                type="button"
                data-ocid="newchat.new_contact.close_button"
                onClick={() => setNewContactOpen(false)}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label
                    htmlFor="nc-firstname"
                    className="text-[12px] text-muted-foreground font-medium block mb-1"
                  >
                    First name *
                  </label>
                  <input
                    id="nc-firstname"
                    data-ocid="newchat.firstname.input"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-muted rounded-lg px-3 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-wa-green"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="nc-lastname"
                    className="text-[12px] text-muted-foreground font-medium block mb-1"
                  >
                    Last name
                  </label>
                  <input
                    id="nc-lastname"
                    data-ocid="newchat.lastname.input"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-muted rounded-lg px-3 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-wa-green"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="nc-phone"
                  className="text-[12px] text-muted-foreground font-medium block mb-1"
                >
                  Phone number *
                </label>
                <input
                  id="nc-phone"
                  data-ocid="newchat.phone.input"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-muted rounded-lg px-3 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-wa-green"
                />
              </div>
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  data-ocid="newchat.new_contact.cancel_button"
                  onClick={() => setNewContactOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-border text-[14px] font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  data-ocid="newchat.new_contact.save_button"
                  onClick={handleSaveContact}
                  disabled={!firstName.trim() || !phone.trim()}
                  className="flex-1 py-2.5 rounded-full bg-wa-green text-white text-[14px] font-medium disabled:opacity-50 hover:bg-wa-green/90 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
            <div
              style={{
                paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)",
              }}
            />
          </div>
        </div>
      )}

      {/* Broadcast List Bottom Sheet */}
      {broadcastOpen && (
        <div
          data-ocid="newchat.broadcast.sheet"
          className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40"
          onKeyDown={(e) => e.key === "Escape" && setBroadcastOpen(false)}
          onClick={(e) =>
            e.target === e.currentTarget && setBroadcastOpen(false)
          }
        >
          <div className="bg-card rounded-t-3xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-border flex-shrink-0">
              <h2 className="text-[17px] font-semibold text-foreground">
                New broadcast list
              </h2>
              <button
                type="button"
                data-ocid="newchat.broadcast.close_button"
                onClick={() => setBroadcastOpen(false)}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 flex-shrink-0">
              <input
                data-ocid="newchat.broadcast_name.input"
                type="text"
                placeholder="Broadcast list name"
                value={broadcastName}
                onChange={(e) => setBroadcastName(e.target.value)}
                className="w-full bg-muted rounded-lg px-3 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-wa-green"
              />
            </div>
            <p className="px-4 pb-2 text-[12px] text-muted-foreground font-medium uppercase tracking-wide flex-shrink-0">
              Select recipients ({selectedForBroadcast.length} selected)
            </p>
            <div className="overflow-y-auto flex-1">
              {allBroadcastContacts.map((contact, i) => (
                <button
                  key={contact.id}
                  type="button"
                  data-ocid={`newchat.broadcast.contact.item.${i + 1}`}
                  onClick={() => toggleBroadcastContact(contact.id)}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/60 transition-colors text-left"
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      selectedForBroadcast.includes(contact.id)
                        ? "bg-wa-green border-wa-green"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {selectedForBroadcast.includes(contact.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <ContactAvatar
                    initials={contact.initials}
                    size="sm"
                    colorIndex={contact.colorIndex}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[14px] text-foreground truncate">
                      {contact.name}
                    </p>
                    <p className="text-[12px] text-muted-foreground truncate">
                      {contact.status}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-border flex-shrink-0">
              <button
                type="button"
                data-ocid="newchat.broadcast.create_button"
                onClick={handleCreateBroadcast}
                disabled={
                  !broadcastName.trim() || selectedForBroadcast.length === 0
                }
                className="w-full py-3 rounded-full bg-wa-green text-white text-[15px] font-semibold disabled:opacity-50 hover:bg-wa-green/90 transition-colors"
              >
                Create broadcast list
              </button>
            </div>
            <div
              style={{
                paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
