import { Skeleton } from "@/components/ui/skeleton";
import { Camera, MoreVertical, Pencil, Search } from "lucide-react";
import type { Contact, Conversation } from "../backend.d";
import ContactAvatar from "../components/ContactAvatar";
import { useContacts, useConversations } from "../hooks/useQueries";

interface ChatListScreenProps {
  onOpenChat: (conversationId: bigint) => void;
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

export default function ChatListScreen({ onOpenChat }: ChatListScreenProps) {
  const { data: conversations, isLoading: convsLoading } = useConversations();
  const { data: contacts, isLoading: contactsLoading } = useContacts();

  const isLoading = convsLoading || contactsLoading;

  const contactMap: Map<string, Contact> = new Map(
    (contacts ?? []).map((c) => [c.id.toString(), c]),
  );

  const hasRealData = !isLoading && (conversations?.length ?? 0) > 0;

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
            className="bg-transparent flex-1 text-[13px] text-wa-header-fg placeholder:text-wa-header-fg/50 outline-none"
            readOnly
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
          (conversations ?? []).map((conv, i) => (
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
          SEED_CONVERSATIONS.map((item, i) => (
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
      </main>

      {/* FAB */}
      <button
        type="button"
        data-ocid="chatlist.new_chat.button"
        className="absolute bottom-20 right-4 w-14 h-14 bg-wa-green rounded-full flex items-center justify-center shadow-lg hover:brightness-105 active:brightness-95 transition-all"
        aria-label="New chat"
      >
        <Pencil className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
