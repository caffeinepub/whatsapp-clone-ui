import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Camera,
  MoreVertical,
  Pencil,
  Pin,
  Search,
  VolumeX,
} from "lucide-react";
import { useRef, useState } from "react";
import type { Contact, Conversation } from "../backend.d";
import CameraModal from "../components/CameraModal";
import ChatLongPressSheet from "../components/ChatLongPressSheet";
import ContactAvatar from "../components/ContactAvatar";
import NewChatScreen from "../components/NewChatScreen";
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
  onOpenBroadcast?: () => void;
  onOpenStarred?: () => void;
  onOpenSettings?: () => void;
}

function formatTimestamp(ts?: bigint): string {
  if (!ts) return "";
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
  return date.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
}

type FilterTab = "all" | "unread" | "favourites" | "groups";

interface SeedConversationItem {
  id: bigint;
  contactName: string;
  initials: string;
  lastMsg: string;
  time: string;
  unread: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isUnread?: boolean;
}

function ChatRow({
  conversation,
  contact,
  index,
  onClick,
  isPinned,
  isMuted,
  onLongPress,
}: {
  conversation: Conversation;
  contact: Contact | undefined;
  index: number;
  onClick: () => void;
  isPinned?: boolean;
  isMuted?: boolean;
  onLongPress?: () => void;
}) {
  const name = contact?.name ?? "Unknown";
  const initials = contact?.avatarInitials ?? "??";
  const lastMsg = conversation.lastMessage?.content ?? "";
  const unread = Number(conversation.unreadCount);
  const ts = formatTimestamp(conversation.lastMessageTime);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      onLongPress?.();
    }, 500);
  };
  const cancelLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  return (
    <button
      type="button"
      data-ocid={`chat.item.${index}`}
      onClick={onClick}
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      onTouchMove={cancelLongPress}
      onMouseDown={startLongPress}
      onMouseUp={cancelLongPress}
      onMouseLeave={cancelLongPress}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress?.();
      }}
      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/60 active:bg-muted transition-colors text-left"
    >
      <ContactAvatar initials={initials} size="md" colorIndex={index - 1} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-[15px] text-foreground truncate font-display">
            {name}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            {isPinned && <Pin className="w-3 h-3 text-muted-foreground/60" />}
            {isMuted && (
              <VolumeX className="w-3 h-3 text-muted-foreground/60" />
            )}
            <span
              className={`text-[11px] ${unread > 0 ? "text-wa-green font-semibold" : "text-wa-timestamp"}`}
            >
              {ts}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-[13px] text-muted-foreground truncate flex-1">
            {lastMsg || "No messages yet"}
          </p>
          {unread > 0 && (
            <span
              className={`text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0 ${isMuted ? "bg-muted-foreground/50" : "bg-wa-unread"}`}
            >
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

const SEED_CONVERSATIONS: SeedConversationItem[] = [
  {
    id: 1n,
    contactName: "Emma Rodriguez",
    initials: "ER",
    lastMsg: "Are we still meeting for coffee tomorrow?",
    time: "10:42 AM",
    unread: 2,
    isPinned: true,
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
    isMuted: true,
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
    isUnread: true,
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
  onOpenBroadcast,
  onOpenStarred,
  onOpenSettings,
}: ChatListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [longPressItem, setLongPressItem] =
    useState<SeedConversationItem | null>(null);
  const [chatStates, setChatStates] = useState<
    Record<string, { isPinned: boolean; isMuted: boolean; isUnread: boolean }>
  >({});

  const { data: conversations, isLoading: convsLoading } = useConversations();
  const { data: contacts, isLoading: contactsLoading } = useContacts();

  const isLoading = convsLoading || contactsLoading;
  const contactMap: Map<string, Contact> = new Map(
    (contacts ?? []).map((c) => [c.id.toString(), c]),
  );
  const hasRealData = !isLoading && (conversations?.length ?? 0) > 0;

  const getChatState = (id: string) =>
    chatStates[id] ?? { isPinned: false, isMuted: false, isUnread: false };

  const allSeedConversations: SeedConversationItem[] = [
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

  const filteredSeedConversations = allSeedConversations.filter((item) => {
    const state = getChatState(item.id.toString());
    const nameMatch = item.contactName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (!nameMatch) return false;
    if (activeFilter === "unread") return item.unread > 0 || state.isUnread;
    if (activeFilter === "favourites") return state.isPinned;
    if (activeFilter === "groups")
      return (
        item.contactName.includes("Team") || item.contactName.includes("&")
      );
    return true;
  });

  const FILTER_TABS: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "favourites", label: "Favourites" },
    { id: "groups", label: "Groups" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <header
        className="sticky top-0 z-50 bg-wa-header px-4 flex-shrink-0"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 4px)",
          paddingBottom: "8px",
        }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-wa-header-fg text-[22px] font-bold font-display">
            WhatsApp
          </h1>
          <div className="flex items-center gap-0">
            <button
              type="button"
              data-ocid="chatlist.camera.button"
              onClick={() => setCameraOpen(true)}
              className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg transition-colors rounded-full hover:bg-white/10"
              aria-label="Camera"
            >
              <Camera className="w-5 h-5" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  data-ocid="chatlist.menu.button"
                  className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg transition-colors rounded-full hover:bg-white/10"
                  aria-label="More options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 bg-popover border-border shadow-lg z-50"
                data-ocid="chatlist.dropdown_menu"
              >
                <DropdownMenuItem
                  data-ocid="chatlist.menu.advertise"
                  className="text-[14px] py-2.5 cursor-pointer"
                >
                  Advertise
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chatlist.menu.new_group"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => onNewGroup?.()}
                >
                  New group
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chatlist.menu.broadcasts"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={onOpenBroadcast}
                >
                  Business broadcasts
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chatlist.menu.communities"
                  className="text-[14px] py-2.5 cursor-pointer"
                >
                  Communities
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chatlist.menu.labels"
                  className="text-[14px] py-2.5 cursor-pointer"
                >
                  Labels
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chatlist.menu.linked_devices"
                  className="text-[14px] py-2.5 cursor-pointer"
                >
                  Linked devices
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chatlist.menu.starred"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={onOpenStarred}
                >
                  Starred
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chatlist.menu.settings"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={onOpenSettings}
                >
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search bar */}
        <div className="bg-white/15 rounded-full flex items-center gap-2 px-3 py-1.5 mt-1">
          <Search className="w-4 h-4 text-wa-header-fg/60" />
          <input
            data-ocid="chatlist.search_input"
            placeholder="Ask Meta AI or Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent flex-1 text-[13px] text-wa-header-fg placeholder:text-wa-header-fg/50 outline-none"
          />
        </div>
      </header>

      {/* Filter chips — sticky below header */}
      <div className="sticky top-[88px] z-40 bg-wa-header px-3 pb-2 flex-shrink-0 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid="chatlist.filter.tab"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-1 rounded-full text-[13px] font-medium transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? "bg-wa-green text-white shadow-sm"
                  : "bg-white/10 text-wa-header-fg/80 border border-wa-header-fg/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
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
                isPinned={getChatState(conv.id.toString()).isPinned}
                isMuted={getChatState(conv.id.toString()).isMuted}
                onLongPress={() => {
                  const seed = allSeedConversations.find(
                    (s) => s.id === conv.id,
                  );
                  if (seed) setLongPressItem(seed);
                }}
              />
            ))}

        {!isLoading &&
          !hasRealData &&
          filteredSeedConversations.length > 0 &&
          filteredSeedConversations.map((item, i) => {
            const state = getChatState(item.id.toString());
            const isPinned = item.isPinned || state.isPinned;
            const isMuted = item.isMuted || state.isMuted;
            const hasUnread = item.unread > 0 || state.isUnread;
            const longPressTimer = {
              current: null as ReturnType<typeof setTimeout> | null,
            };

            return (
              <button
                key={item.id.toString()}
                type="button"
                data-ocid={`chat.item.${i + 1}`}
                onClick={() => onOpenChat(item.id)}
                onTouchStart={() => {
                  longPressTimer.current = setTimeout(
                    () => setLongPressItem(item),
                    500,
                  );
                }}
                onTouchEnd={() => {
                  if (longPressTimer.current)
                    clearTimeout(longPressTimer.current);
                }}
                onTouchMove={() => {
                  if (longPressTimer.current)
                    clearTimeout(longPressTimer.current);
                }}
                onMouseDown={() => {
                  longPressTimer.current = setTimeout(
                    () => setLongPressItem(item),
                    500,
                  );
                }}
                onMouseUp={() => {
                  if (longPressTimer.current)
                    clearTimeout(longPressTimer.current);
                }}
                onMouseLeave={() => {
                  if (longPressTimer.current)
                    clearTimeout(longPressTimer.current);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setLongPressItem(item);
                }}
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
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {isPinned && (
                        <Pin className="w-3 h-3 text-muted-foreground/60" />
                      )}
                      {isMuted && (
                        <VolumeX className="w-3 h-3 text-muted-foreground/60" />
                      )}
                      <span
                        className={`text-[11px] ${hasUnread ? "text-wa-green font-semibold" : "text-wa-timestamp"}`}
                      >
                        {item.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-[13px] text-muted-foreground truncate flex-1">
                      {item.lastMsg}
                    </p>
                    {hasUnread && (
                      <span
                        className={`text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0 ${isMuted ? "bg-muted-foreground/50" : "bg-wa-unread"}`}
                      >
                        {item.unread > 99 ? "99+" : item.unread || ""}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

        {!isLoading &&
          filteredSeedConversations.length === 0 &&
          !hasRealData && (
            <div
              data-ocid="chatlist.empty_state"
              className="flex flex-col items-center justify-center py-16 px-8 gap-3"
            >
              <Search className="w-12 h-12 text-muted-foreground/40" />
              <p className="text-[15px] font-semibold text-foreground text-center">
                {searchQuery ? `No results for "${searchQuery}"` : "No chats"}
              </p>
              <p className="text-[13px] text-muted-foreground text-center">
                {searchQuery
                  ? "Try searching for a different name"
                  : "Start a new conversation"}
              </p>
            </div>
          )}
      </main>

      {/* FAB - Pencil opens NewChatScreen */}
      <button
        type="button"
        data-ocid="chatlist.new_chat.button"
        onClick={() => setNewChatOpen(true)}
        className="absolute bottom-20 right-4 w-14 h-14 bg-wa-green rounded-full flex items-center justify-center shadow-lg hover:brightness-105 active:brightness-95 transition-all z-10"
        aria-label="New chat"
      >
        <Pencil className="w-6 h-6 text-white" />
      </button>

      {/* Camera Modal */}
      <CameraModal open={cameraOpen} onClose={() => setCameraOpen(false)} />

      {/* New Chat Screen */}
      <NewChatScreen open={newChatOpen} onClose={() => setNewChatOpen(false)} />

      {/* Long Press Bottom Sheet */}
      {longPressItem && (
        <ChatLongPressSheet
          open={!!longPressItem}
          contactName={longPressItem.contactName}
          isPinned={
            (longPressItem.isPinned ?? false) ||
            getChatState(longPressItem.id.toString()).isPinned
          }
          isMuted={
            (longPressItem.isMuted ?? false) ||
            getChatState(longPressItem.id.toString()).isMuted
          }
          isUnread={
            (longPressItem.isUnread ?? false) ||
            getChatState(longPressItem.id.toString()).isUnread
          }
          onClose={() => setLongPressItem(null)}
          onArchive={() => setLongPressItem(null)}
          onMute={() => {
            const id = longPressItem.id.toString();
            setChatStates((prev) => ({
              ...prev,
              [id]: { ...getChatState(id), isMuted: !getChatState(id).isMuted },
            }));
            setLongPressItem(null);
          }}
          onDelete={() => setLongPressItem(null)}
          onPin={() => {
            const id = longPressItem.id.toString();
            setChatStates((prev) => ({
              ...prev,
              [id]: {
                ...getChatState(id),
                isPinned: !getChatState(id).isPinned,
              },
            }));
            setLongPressItem(null);
          }}
          onMarkUnread={() => {
            const id = longPressItem.id.toString();
            setChatStates((prev) => ({
              ...prev,
              [id]: {
                ...getChatState(id),
                isUnread: !getChatState(id).isUnread,
              },
            }));
            setLongPressItem(null);
          }}
        />
      )}
    </div>
  );
}
