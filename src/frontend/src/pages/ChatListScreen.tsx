import { Skeleton } from "@/components/ui/skeleton";
import { Camera, MoreVertical, Pencil, Search, Users, X } from "lucide-react";
import { useState } from "react";
import type { Contact, Conversation } from "../backend.d";
import ContactAvatar from "../components/ContactAvatar";
import { useContacts, useConversations } from "../hooks/useQueries";

interface ExtraConversation {
  id: bigint;
  contactName: string;
  initials: string;
  lastMsg: string;
  time: string;
  unread: number;
  isGroup: boolean;
}

interface ChatListScreenProps {
  onOpenChat: (conversationId: bigint) => void;
  onNewGroup?: () => void;
  extraConversations?: ExtraConversation[];
}

function formatTimestamp(ts?: bigint): string {
  if (!ts) return "";
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  return date.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
}

function ChatRow({
  conversation,
  contact,
  index,
  onClick,
}: {
  conversation: Conversation;
  contact: Contact | undefined;
  index: number;
  onClick: () => void;
}) {
  const name = contact?.name ?? "Unknown";
  const initials = contact?.avatarInitials ?? "??";
  const lastMsg = conversation.lastMessage?.content ?? "";
  const unread = Number(conversation.unreadCount);
  const ts = formatTimestamp(conversation.lastMessageTime);

  return (
    <button
      type="button"
      data-ocid={`chat.item.${index}`}
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/60 active:bg-muted transition-colors text-left"
    >
      <ContactAvatar initials={initials} size="md" colorIndex={index - 1} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-[15px] text-foreground truncate font-display">
            {name}
          </span>
          <span
            className={`text-[11px] flex-shrink-0 ${unread > 0 ? "text-wa-green font-semibold" : "text-wa-timestamp"}`}
          >
            {ts}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-[13px] text-muted-foreground truncate flex-1">
            {lastMsg || "No messages yet"}
          </p>
          {unread > 0 && (
            <span className="bg-wa-unread text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function SkeletonRow({ rowKey }: { rowKey: number }) {
  return (
    <div key={rowKey} className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="w-11 h-11 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-3 w-10 rounded" />
        </div>
        <Skeleton className="h-3 w-48 rounded" />
      </div>
    </div>
  );
}

const SEED_CONVERSATIONS = [
  {
    id: 1n,
    contactName: "Emma Rodriguez",
    initials: "ER",
    lastMsg: "Are we still meeting for coffee tomorrow?",
    time: "10:42 AM",
    unread: 2,
  },
  {
    id: 2n,
    contactName: "Team Design Sprint",
    initials: "TD",
    lastMsg: "I shared the new Figma mockups in the drive",
    time: "9:15 AM",
    unread: 5,
  },
  {
    id: 3n,
    contactName: "Marcus Chen",
    initials: "MC",
    lastMsg: "Thanks for sending those files over!",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 4n,
    contactName: "Priya Sharma",
    initials: "PS",
    lastMsg: "The presentation went really well 🎉",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 5n,
    contactName: "Jordan Williams",
    initials: "JW",
    lastMsg: "Let me know when you're free to catch up",
    time: "Mon",
    unread: 1,
  },
  {
    id: 6n,
    contactName: "Sarah & Mike",
    initials: "SM",
    lastMsg: "We're thinking Bali for the honeymoon! 🌴",
    time: "Mon",
    unread: 0,
  },
];

export default function ChatListScreen({
  onOpenChat,
  onNewGroup,
  extraConversations = [],
}: ChatListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [fabSheetOpen, setFabSheetOpen] = useState(false);
  const { data: conversations, isLoading: convsLoading } = useConversations();
  const { data: contacts, isLoading: contactsLoading } = useContacts();

  const isLoading = convsLoading || contactsLoading;

  const contactMap: Map<string, Contact> = new Map(
    (contacts ?? []).map((c) => [c.id.toString(), c]),
  );

  const hasRealData = !isLoading && (conversations?.length ?? 0) > 0;

  const allSeedConversations = [
    ...extraConversations.map((e) => ({
      id: e.id,
      contactName: e.contactName,
      initials: e.initials,
      lastMsg: e.lastMsg,
      time: e.time,
      unread: e.unread,
    })),
    ...SEED_CONVERSATIONS,
  ];

  const filteredSeedConversations = allSeedConversations.filter((item) =>
    item.contactName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-wa-header px-4 pt-12 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-wa-header-fg text-[22px] font-bold font-display">
            WhatsApp
          </h1>
          <div className="flex items-center gap-1">
            <button
              type="button"
              data-ocid="chatlist.search.button"
              className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg transition-colors rounded-full hover:bg-white/10"
              aria-label="Search conversations"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              data-ocid="chatlist.camera.button"
              className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg transition-colors rounded-full hover:bg-white/10"
              aria-label="Camera"
            >
              <Camera className="w-5 h-5" />
            </button>
            <button
              type="button"
              data-ocid="chatlist.menu.button"
              className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg transition-colors rounded-full hover:bg-white/10"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Search bar */}
      <div className="bg-wa-header px-3 pb-2 flex-shrink-0">
        <div className="bg-white/15 rounded-full flex items-center gap-2 px-3 py-1.5">
          <Search className="w-4 h-4 text-wa-header-fg/60" />
          <input
            data-ocid="chatlist.search_input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent flex-1 text-[13px] text-wa-header-fg placeholder:text-wa-header-fg/50 outline-none"
          />
        </div>
      </div>

      {/* Conversations list */}
      <main
        className="flex-1 overflow-y-auto bg-card divide-y divide-border/60"
        aria-label="Conversations"
      >
        {isLoading && (
          <div data-ocid="chatlist.loading_state">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SkeletonRow key={n} rowKey={n} />
            ))}
          </div>
        )}

        {!isLoading &&
          hasRealData &&
          (conversations ?? [])
            .filter((conv) => {
              if (!searchQuery) return true;
              const contact = contactMap.get(conv.contactId.toString());
              return contact?.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            })
            .map((conv, i) => (
              <ChatRow
                key={conv.id.toString()}
                conversation={conv}
                contact={contactMap.get(conv.contactId.toString())}
                index={i + 1}
                onClick={() => onOpenChat(conv.id)}
              />
            ))}

        {!isLoading &&
          !hasRealData &&
          filteredSeedConversations.length > 0 &&
          filteredSeedConversations.map((item, i) => (
            <button
              key={item.id.toString()}
              type="button"
              data-ocid={`chat.item.${i + 1}`}
              onClick={() => onOpenChat(item.id)}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/60 active:bg-muted transition-colors text-left"
            >
              <ContactAvatar
                initials={item.initials}
                size="md"
                colorIndex={i}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[15px] text-foreground truncate font-display">
                    {item.contactName}
                  </span>
                  <span
                    className={`text-[11px] flex-shrink-0 ${item.unread > 0 ? "text-wa-green font-semibold" : "text-wa-timestamp"}`}
                  >
                    {item.time}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-[13px] text-muted-foreground truncate flex-1">
                    {item.lastMsg}
                  </p>
                  {item.unread > 0 && (
                    <span className="bg-wa-unread text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0">
                      {item.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}

        {/* No results empty state */}
        {!isLoading &&
          searchQuery &&
          filteredSeedConversations.length === 0 &&
          !hasRealData && (
            <div
              data-ocid="chatlist.empty_state"
              className="flex flex-col items-center justify-center py-16 px-8 gap-3"
            >
              <Search className="w-12 h-12 text-muted-foreground/40" />
              <p className="text-[15px] font-semibold text-foreground text-center">
                No results for "{searchQuery}"
              </p>
              <p className="text-[13px] text-muted-foreground text-center">
                Try searching for a different name
              </p>
            </div>
          )}
      </main>

      {/* FAB */}
      <button
        type="button"
        data-ocid="chatlist.new_chat.button"
        onClick={() => setFabSheetOpen(true)}
        className="absolute bottom-20 right-4 w-14 h-14 bg-wa-green rounded-full flex items-center justify-center shadow-lg hover:brightness-105 active:brightness-95 transition-all z-10"
        aria-label="New chat"
      >
        <Pencil className="w-6 h-6 text-white" />
      </button>

      {/* FAB bottom sheet */}
      {fabSheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 z-20 bg-black/40"
            onClick={() => setFabSheetOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setFabSheetOpen(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close menu"
          />
          <div
            data-ocid="chatlist.fab.sheet"
            className="absolute bottom-0 left-0 right-0 z-30 bg-card rounded-t-2xl shadow-2xl animate-slide-up"
          >
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="px-2 py-2">
              <button
                type="button"
                data-ocid="chatlist.new_chat.button"
                onClick={() => setFabSheetOpen(false)}
                className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-muted/60 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-wa-green flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[15px] text-foreground font-display">
                    New Chat
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    Start a conversation
                  </p>
                </div>
              </button>

              <button
                type="button"
                data-ocid="group.new.sheet"
                onClick={() => {
                  setFabSheetOpen(false);
                  onNewGroup?.();
                }}
                className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-muted/60 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[15px] text-foreground font-display">
                    New Group
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    Create a group chat
                  </p>
                </div>
              </button>
            </div>

            <div className="px-4 py-2 border-t border-border">
              <button
                type="button"
                onClick={() => setFabSheetOpen(false)}
                className="flex items-center gap-3 w-full px-1 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
                <span className="text-[15px] font-medium">Cancel</span>
              </button>
            </div>
            <div style={{ height: "env(safe-area-inset-bottom, 8px)" }} />
          </div>
        </>
      )}
    </div>
  );
}
