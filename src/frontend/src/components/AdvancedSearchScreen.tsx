import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ContactAvatar from "./ContactAvatar";

interface AdvancedSearchScreenProps {
  open: boolean;
  onClose: () => void;
}

const MOCK_CHATS = [
  {
    name: "Emma Rodriguez",
    initials: "ER",
    last: "Hey! How are you doing?",
    colorIndex: 0,
  },
  {
    name: "Marcus Chen",
    initials: "MC",
    last: "Morning everyone!",
    colorIndex: 1,
  },
  {
    name: "Priya Sharma",
    initials: "PS",
    last: "See you tomorrow 🎉",
    colorIndex: 4,
  },
  {
    name: "Jordan Williams",
    initials: "JW",
    last: "Did you check the doc?",
    colorIndex: 3,
  },
  {
    name: "Sofia Martinez",
    initials: "SM",
    last: "Running 5 mins late",
    colorIndex: 2,
  },
  {
    name: "Dev Team",
    initials: "DT",
    last: "PR is ready for review",
    colorIndex: 5,
  },
  {
    name: "Family Group",
    initials: "FG",
    last: "Dinner at 7pm?",
    colorIndex: 6,
  },
];

const MOCK_MESSAGES = [
  {
    contact: "Emma Rodriguez",
    initials: "ER",
    text: "Can we reschedule the meeting?",
    time: "10:30 AM",
    colorIndex: 0,
  },
  {
    contact: "Marcus Chen",
    initials: "MC",
    text: "I finished the user flows last night",
    time: "9:02 AM",
    colorIndex: 1,
  },
  {
    contact: "Priya Sharma",
    initials: "PS",
    text: "The designs look amazing!",
    time: "Yesterday",
    colorIndex: 4,
  },
  {
    contact: "Family Group",
    initials: "FG",
    text: "Happy birthday! 🎂",
    time: "Mon",
    colorIndex: 6,
  },
  {
    contact: "Jordan Williams",
    initials: "JW",
    text: "Thanks for the update",
    time: "Sun",
    colorIndex: 3,
  },
];

const MEDIA_COLORS = [
  "#E91E63",
  "#2196F3",
  "#4CAF50",
  "#FF9800",
  "#9C27B0",
  "#00BCD4",
  "#F44336",
  "#8BC34A",
  "#FF5722",
];

const MOCK_CONTACTS = [
  { name: "Aarav Patel", initials: "AP", colorIndex: 0 },
  { name: "Bella Thompson", initials: "BT", colorIndex: 1 },
  { name: "Carlos Rivera", initials: "CR", colorIndex: 2 },
  { name: "Diana Lee", initials: "DL", colorIndex: 3 },
  { name: "Emma Rodriguez", initials: "ER", colorIndex: 4 },
  { name: "Felix Wang", initials: "FW", colorIndex: 5 },
  { name: "Grace Kim", initials: "GK", colorIndex: 6 },
  { name: "Hassan Ali", initials: "HA", colorIndex: 7 },
];

export default function AdvancedSearchScreen({
  open,
  onClose,
}: AdvancedSearchScreenProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  const q = query.toLowerCase();

  const filteredChats = q
    ? MOCK_CHATS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.last.toLowerCase().includes(q),
      )
    : MOCK_CHATS;

  const filteredMessages = q
    ? MOCK_MESSAGES.filter(
        (m) =>
          m.text.toLowerCase().includes(q) ||
          m.contact.toLowerCase().includes(q),
      )
    : MOCK_MESSAGES;

  const filteredContacts = q
    ? MOCK_CONTACTS.filter((c) => c.name.toLowerCase().includes(q))
    : MOCK_CONTACTS;

  return (
    <div
      data-ocid="search.modal"
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <button
          type="button"
          data-ocid="search.back_button"
          onClick={onClose}
          aria-label="Close search"
          className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center bg-muted rounded-xl px-3 gap-2">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            data-ocid="search.search_input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats, messages, contacts..."
            className="flex-1 bg-transparent py-2.5 text-[15px] focus:outline-none text-foreground placeholder:text-muted-foreground"
          />
          {query && (
            <button
              type="button"
              data-ocid="search.clear.button"
              onClick={() => setQuery("")}
              className="text-muted-foreground text-xl leading-none hover:text-foreground"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="chats"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="w-full rounded-none border-b border-border bg-background h-11 px-0 grid grid-cols-4">
          {(["chats", "messages", "media", "contacts"] as const).map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              data-ocid={`search.${t}.tab`}
              className="capitalize text-[13px] font-medium rounded-none data-[state=active]:border-b-2 data-[state=active]:border-wa-green data-[state=active]:text-wa-green"
            >
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="chats" className="mt-0">
            {filteredChats.length === 0 ? (
              <div
                data-ocid="search.chats.empty_state"
                className="py-12 text-center text-muted-foreground"
              >
                No chats found
              </div>
            ) : (
              filteredChats.map((c, i) => (
                <div
                  key={c.name}
                  data-ocid={`search.chats.item.${i + 1}`}
                  className="flex items-center gap-3 px-4 py-3 border-b border-border/50 hover:bg-muted/30 cursor-pointer"
                >
                  <ContactAvatar
                    initials={c.initials}
                    size="md"
                    colorIndex={c.colorIndex}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-foreground truncate">
                      {c.name}
                    </p>
                    <p className="text-[13px] text-muted-foreground truncate">
                      {c.last}
                    </p>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="messages" className="mt-0">
            {filteredMessages.length === 0 ? (
              <div
                data-ocid="search.messages.empty_state"
                className="py-12 text-center text-muted-foreground"
              >
                No messages found
              </div>
            ) : (
              filteredMessages.map((m, i) => (
                <div
                  key={`${m.contact}-${i}`}
                  data-ocid={`search.messages.item.${i + 1}`}
                  className="flex items-center gap-3 px-4 py-3 border-b border-border/50 hover:bg-muted/30 cursor-pointer"
                >
                  <ContactAvatar
                    initials={m.initials}
                    size="md"
                    colorIndex={m.colorIndex}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-[14px] text-foreground">
                        {m.contact}
                      </p>
                      <span className="text-[11px] text-muted-foreground">
                        {m.time}
                      </span>
                    </div>
                    <p className="text-[13px] text-muted-foreground truncate">
                      {m.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="media" className="mt-0">
            <div className="grid grid-cols-3 gap-0.5 p-0.5">
              {MEDIA_COLORS.map((color, i) => (
                <div
                  key={color}
                  data-ocid={`search.media.item.${i + 1}`}
                  className="aspect-square rounded-sm cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: color }}
                />
              ))}
            </div>
            {q && MEDIA_COLORS.length === 0 && (
              <div
                data-ocid="search.media.empty_state"
                className="py-12 text-center text-muted-foreground"
              >
                No media found
              </div>
            )}
          </TabsContent>

          <TabsContent value="contacts" className="mt-0">
            {filteredContacts.length === 0 ? (
              <div
                data-ocid="search.contacts.empty_state"
                className="py-12 text-center text-muted-foreground"
              >
                No contacts found
              </div>
            ) : (
              filteredContacts.map((c, i) => (
                <div
                  key={c.name}
                  data-ocid={`search.contacts.item.${i + 1}`}
                  className="flex items-center gap-3 px-4 py-3 border-b border-border/50 hover:bg-muted/30 cursor-pointer"
                >
                  <ContactAvatar
                    initials={c.initials}
                    size="md"
                    colorIndex={c.colorIndex}
                  />
                  <p className="font-medium text-[15px] text-foreground">
                    {c.name}
                  </p>
                </div>
              ))
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
