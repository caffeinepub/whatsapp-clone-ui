import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  CheckCheck,
  File,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Users,
  Video,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Message } from "../backend.d";
import ContactAvatar from "../components/ContactAvatar";
import EmojiPicker from "../components/EmojiPicker";
import MessageContextMenu, {
  type ChatMessage,
} from "../components/MessageContextMenu";
import type { ActiveCall, WallpaperType } from "../hooks/useAppState";
import {
  useContacts,
  useConversations,
  useMarkAsRead,
  useMessages,
  useSendMessage,
} from "../hooks/useQueries";

interface ChatViewScreenProps {
  conversationId: bigint;
  onBack: () => void;
  onOpenCall: (contact: ActiveCall) => void;
  wallpaper?: WallpaperType;
}

function formatMessageTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const CURRENT_USER_ID = 0n;

// Seed messages with date info for separators
const SEED_CHAT_MESSAGES: Record<
  string,
  { content: string; isSent: boolean; time: string; dateLabel: string }[]
> = {
  "1": [
    {
      content: "Hey! How are you doing?",
      isSent: false,
      time: "10:30 AM",
      dateLabel: "YESTERDAY",
    },
    {
      content: "I'm doing great, thanks! How about you?",
      isSent: true,
      time: "10:31 AM",
      dateLabel: "YESTERDAY",
    },
    {
      content: "Pretty good! Working on a new project",
      isSent: false,
      time: "10:32 AM",
      dateLabel: "YESTERDAY",
    },
    {
      content: "That sounds exciting! What kind of project?",
      isSent: true,
      time: "10:33 AM",
      dateLabel: "YESTERDAY",
    },
    {
      content: "It's a mobile app for local farmers markets 🌱",
      isSent: false,
      time: "10:35 AM",
      dateLabel: "TODAY",
    },
    {
      content: "Oh wow, that's really cool! Love that idea",
      isSent: true,
      time: "10:36 AM",
      dateLabel: "TODAY",
    },
    {
      content: "Are we still meeting for coffee tomorrow?",
      isSent: false,
      time: "10:42 AM",
      dateLabel: "TODAY",
    },
  ],
  "2": [
    {
      content: "Morning everyone! Ready for the sprint review?",
      isSent: false,
      time: "9:00 AM",
      dateLabel: "YESTERDAY",
    },
    {
      content: "Yes! I finished the user flows last night 🎉",
      isSent: true,
      time: "9:02 AM",
      dateLabel: "YESTERDAY",
    },
    {
      content: "Great work! The stakeholders are going to love it",
      isSent: false,
      time: "9:05 AM",
      dateLabel: "TODAY",
    },
    {
      content: "I shared the new Figma mockups in the drive",
      isSent: false,
      time: "9:15 AM",
      dateLabel: "TODAY",
    },
  ],
  default: [
    {
      content: "Hello there!",
      isSent: false,
      time: "9:00 AM",
      dateLabel: "YESTERDAY",
    },
    {
      content: "Hey! Good to hear from you",
      isSent: true,
      time: "9:01 AM",
      dateLabel: "YESTERDAY",
    },
    {
      content: "How's everything going?",
      isSent: false,
      time: "9:02 AM",
      dateLabel: "TODAY",
    },
  ],
};

const REACTION_EMOJIS = ["❤️", "👍", "😂", "😮", "😢", "🙏"];

const SEED_COLOR_MAP: Record<string, number> = {
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 4,
  "5": 3,
  "6": 5,
};

type TickState = "none" | "single" | "double" | "seen";

// Wallpaper style helper
function getWallpaperClass(wallpaper?: WallpaperType): string {
  switch (wallpaper) {
    case "light":
      return "bg-[#F0F4F8]";
    case "dark":
      return "bg-[#1A2335]";
    case "green":
      return "bg-[#E8F5E9]";
    default:
      return "wa-chat-bg";
  }
}

// Animated waveform for voice messages — use stable position-keyed entries
const WAVEFORM_BARS: { pos: number; height: number }[] = [
  { pos: 0, height: 4 },
  { pos: 1, height: 8 },
  { pos: 2, height: 12 },
  { pos: 3, height: 6 },
  { pos: 4, height: 16 },
  { pos: 5, height: 10 },
  { pos: 6, height: 14 },
  { pos: 7, height: 8 },
  { pos: 8, height: 6 },
  { pos: 9, height: 12 },
  { pos: 10, height: 16 },
  { pos: 11, height: 8 },
  { pos: 12, height: 10 },
  { pos: 13, height: 14 },
  { pos: 14, height: 6 },
  { pos: 15, height: 12 },
  { pos: 16, height: 8 },
  { pos: 17, height: 16 },
  { pos: 18, height: 10 },
  { pos: 19, height: 6 },
];

function VoiceWaveform({ isRecording = false }: { isRecording?: boolean }) {
  return (
    <div className="flex items-center gap-[2px] h-8">
      {WAVEFORM_BARS.map(({ pos, height }) => (
        <div
          key={`wb-${pos}`}
          className={`w-[3px] rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-wa-green/70"}`}
          style={{
            height: `${height}px`,
            animationDelay: isRecording ? `${pos * 50}ms` : undefined,
          }}
        />
      ))}
    </div>
  );
}

// Tick icon component
function MessageTicks({ state }: { state: TickState }) {
  if (state === "none") return null;
  if (state === "single") {
    return <Check className="w-3 h-3 text-wa-timestamp inline-block" />;
  }
  if (state === "double") {
    return <CheckCheck className="w-3 h-3 text-wa-timestamp inline-block" />;
  }
  // seen - green double check
  return <CheckCheck className="w-3 h-3 text-wa-green inline-block" />;
}

// Date separator pill
function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center my-3">
      <span className="bg-white/80 dark:bg-card/80 text-muted-foreground text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
        {label}
      </span>
    </div>
  );
}

// Reply context bar shown above the input
function ReplyPreview({
  message,
  onClose,
}: {
  message: ChatMessage;
  onClose: () => void;
}) {
  return (
    <div
      data-ocid="chat.reply.preview"
      className="flex items-center gap-2 px-3 py-2 bg-muted/60 border-t border-border"
    >
      <div className="w-1 h-8 bg-wa-green rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-wa-green">
          {message.isSent ? "You" : "Contact"}
        </p>
        <p className="text-[12px] text-muted-foreground truncate">
          {message.type === "voice" ? "🎤 Voice message" : message.content}
        </p>
      </div>
      <button
        type="button"
        data-ocid="chat.reply.close.button"
        onClick={onClose}
        className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Cancel reply"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Typing indicator bubble
function TypingIndicator() {
  return (
    <div className="flex justify-start mb-2">
      <div className="bg-wa-received rounded-2xl rounded-bl-sm px-3 py-2 shadow-bubble flex items-center gap-1">
        <span
          className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

// Main bubble component
function MessageBubble({
  msg,
  onLongPress,
  searchTerm,
  isHighlighted,
}: {
  msg: ChatMessage;
  onLongPress: (msg: ChatMessage) => void;
  onReactionSelect?: (msgId: string, emoji: string) => void;
  searchTerm: string;
  isHighlighted: boolean;
}) {
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      onLongPress(msg);
    }, 600);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  // Highlight matching text
  const renderContent = (text: string) => {
    if (!searchTerm || !text.toLowerCase().includes(searchTerm.toLowerCase())) {
      return <span>{text}</span>;
    }
    const idx = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-300 text-black rounded px-0.5">
          {text.slice(idx, idx + searchTerm.length)}
        </mark>
        {text.slice(idx + searchTerm.length)}
      </>
    );
  };

  const isSent = msg.isSent;

  return (
    <div
      className={`flex ${isSent ? "justify-end" : "justify-start"} mb-1 relative`}
      id={`msg-${msg.id}`}
    >
      <div
        className={`
          relative max-w-[75%] rounded-2xl px-3 py-2 shadow-bubble text-[14px]
          ${
            isSent
              ? "bg-wa-sent text-wa-sent-fg rounded-br-sm bubble-sent"
              : "bg-wa-received text-wa-received-fg rounded-bl-sm bubble-received"
          }
          ${isHighlighted ? "ring-2 ring-yellow-400" : ""}
          cursor-pointer select-none
        `}
        onContextMenu={(e) => {
          e.preventDefault();
          onLongPress(msg);
        }}
        onTouchStart={startLongPress}
        onTouchEnd={cancelLongPress}
        onTouchMove={cancelLongPress}
        onMouseDown={startLongPress}
        onMouseUp={cancelLongPress}
        onMouseLeave={cancelLongPress}
      >
        {/* Reply context */}
        {msg.replyTo && (
          <div
            className={`rounded-lg px-2 py-1.5 mb-1.5 border-l-[3px] border-wa-green ${isSent ? "bg-wa-sent-fg/10" : "bg-muted/50"}`}
          >
            <p className="text-[10px] font-semibold text-wa-green">
              {msg.replyTo.isSent ? "You" : "Contact"}
            </p>
            <p className="text-[11px] opacity-80 truncate">
              {msg.replyTo.content}
            </p>
          </div>
        )}

        {/* Voice message */}
        {msg.type === "voice" ? (
          <div className="flex items-center gap-2 pr-8 min-w-[140px]">
            <div className="w-8 h-8 bg-wa-green rounded-full flex items-center justify-center flex-shrink-0">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <VoiceWaveform />
            <span className="text-[11px] opacity-70 flex-shrink-0">
              {msg.voiceDuration ?? "0:03"}
            </span>
          </div>
        ) : msg.type === "image" ? (
          <div className="pr-8">
            <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-1">
              <span className="text-2xl">📷</span>
            </div>
            <p className="text-[12px] opacity-70">Photo</p>
          </div>
        ) : (
          <p className="leading-snug break-words pr-8">
            {renderContent(msg.content)}
          </p>
        )}

        {/* Time + ticks */}
        <span className="absolute bottom-1.5 right-2 flex items-center gap-0.5 text-[10px] opacity-60 whitespace-nowrap">
          {msg.time}
          {isSent && msg.tickState && msg.tickState !== "none" && (
            <MessageTicks state={msg.tickState} />
          )}
        </span>
      </div>

      {/* Reactions */}
      {msg.reactions && msg.reactions.length > 0 && (
        <div
          className={`absolute -bottom-3 ${isSent ? "right-2" : "left-2"} flex gap-0.5 z-10`}
        >
          <div className="bg-card border border-border rounded-full px-1.5 py-0.5 shadow-bubble flex items-center gap-0.5">
            {msg.reactions.map((r, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: emoji reactions can duplicate
              <span key={`reaction-${r}-${i}`} className="text-[13px]">
                {r}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Reaction panel
function ReactionPanel({
  onSelect,
  onClose,
}: {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className="absolute inset-0 z-40"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close reactions"
      />
      <div
        data-ocid="chat.reaction.panel"
        className="absolute bottom-[72px] left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-full shadow-2xl px-3 py-2 flex items-center gap-2 animate-slide-up"
      >
        {REACTION_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="text-[24px] hover:scale-125 active:scale-110 transition-transform"
            aria-label={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
}

export default function ChatViewScreen({
  conversationId,
  onBack,
  onOpenCall,
  wallpaper,
}: ChatViewScreenProps) {
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachSheet, setShowAttachSheet] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [contextMsg, setContextMsg] = useState<ChatMessage | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [reactTarget, setReactTarget] = useState<ChatMessage | null>(null);

  // In-chat search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMatchIndex, setSearchMatchIndex] = useState(0);

  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Typing indicator
  const [showTyping, setShowTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: messages, isLoading: messagesLoading } =
    useMessages(conversationId);
  const { data: conversations } = useConversations();
  const { data: contacts } = useContacts();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: markAsRead } = useMarkAsRead();

  const conversation = conversations?.find((c) => c.id === conversationId);
  const contact = contacts?.find((c) => c.id === conversation?.contactId);

  const seedKey = conversationId.toString();
  const isGroupChat = seedKey === "2";
  const contactName = isGroupChat
    ? "Team Design Sprint"
    : (contact?.name ?? "Chat");
  const contactInitials = isGroupChat
    ? "TD"
    : (contact?.avatarInitials ?? "??");
  const colorIndex = SEED_COLOR_MAP[seedKey] ?? 0;

  const hasRealMessages = !messagesLoading && (messages?.length ?? 0) > 0;
  const rawSeedMessages =
    SEED_CHAT_MESSAGES[seedKey] ?? SEED_CHAT_MESSAGES.default;

  // Local state for seed messages with enhanced fields
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(() =>
    rawSeedMessages.map((m, i) => ({
      id: `seed-${i}`,
      content: m.content,
      isSent: m.isSent,
      time: m.time,
      type: "text" as const,
      replyTo: null,
      reactions: [],
      tickState: m.isSent ? ("seen" as TickState) : undefined,
      voiceDuration: undefined,
    })),
  );

  useEffect(() => {
    markAsRead(conversationId);
  }, [conversationId, markAsRead]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: messagesEndRef is stable
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, showTyping]);

  const triggerTypingIndicator = useCallback(() => {
    setShowTyping(true);
    setTimeout(() => setShowTyping(false), 2000);
  }, []);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isSending) return;

    const newMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      content: text,
      isSent: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
      replyTo: replyTo
        ? { id: replyTo.id, content: replyTo.content, isSent: replyTo.isSent }
        : null,
      reactions: [],
      tickState: "none",
    };

    setLocalMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setReplyTo(null);
    setShowEmojiPicker(false);

    // Animate ticks: none → single → double → seen
    setTimeout(() => {
      setLocalMessages((prev) =>
        prev.map((m) =>
          m.id === newMsg.id ? { ...m, tickState: "single" } : m,
        ),
      );
    }, 500);
    setTimeout(() => {
      setLocalMessages((prev) =>
        prev.map((m) =>
          m.id === newMsg.id ? { ...m, tickState: "double" } : m,
        ),
      );
      triggerTypingIndicator();
    }, 1000);
    setTimeout(() => {
      setLocalMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, tickState: "seen" } : m)),
      );
    }, 2500);

    // Also send to backend
    sendMessage(
      { conversationId, content: text },
      { onError: () => toast.error("Failed to send message") },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice recording
  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (!isRecording) return;
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    const duration = recordingSeconds;
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    const durationStr = `${mins}:${secs.toString().padStart(2, "0")}`;

    const voiceMsg: ChatMessage = {
      id: `voice-${Date.now()}`,
      content: "Voice message",
      isSent: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "voice",
      replyTo: null,
      reactions: [],
      tickState: "none",
      voiceDuration: durationStr,
    };

    setLocalMessages((prev) => [...prev, voiceMsg]);

    // Tick animation
    setTimeout(() => {
      setLocalMessages((prev) =>
        prev.map((m) =>
          m.id === voiceMsg.id ? { ...m, tickState: "double" } : m,
        ),
      );
      triggerTypingIndicator();
    }, 1000);
    setTimeout(() => {
      setLocalMessages((prev) =>
        prev.map((m) =>
          m.id === voiceMsg.id ? { ...m, tickState: "seen" } : m,
        ),
      );
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  const formatRecordingTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Context menu handlers
  const handleContextMenuOpen = (msg: ChatMessage) => {
    setContextMsg(msg);
  };

  const handleReply = (msg: ChatMessage) => {
    setReplyTo(msg);
    inputRef.current?.focus();
  };

  const handleCopy = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.content).catch(() => {});
    toast.success("Message copied");
  };

  const handleForward = () => {
    toast.success("Message forwarded");
  };

  const handleDelete = (msg: ChatMessage) => {
    setLocalMessages((prev) => prev.filter((m) => m.id !== msg.id));
    toast.success("Message deleted");
  };

  const handleReact = (msg: ChatMessage) => {
    setReactTarget(msg);
    setShowReactions(true);
  };

  const handleReactionSelect = (msgId: string, emoji: string) => {
    setLocalMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        const existing = m.reactions ?? [];
        if (existing.includes(emoji)) return m;
        return { ...m, reactions: [...existing, emoji] };
      }),
    );
  };

  // In-chat search matching
  const searchMatches = searchTerm
    ? localMessages
        .map((m, i) => ({ idx: i, msg: m }))
        .filter(({ msg }) =>
          msg.content.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    : [];

  const navigateSearch = (dir: "up" | "down") => {
    if (searchMatches.length === 0) return;
    setSearchMatchIndex((prev) => {
      if (dir === "down") return (prev + 1) % searchMatches.length;
      return (prev - 1 + searchMatches.length) % searchMatches.length;
    });
  };

  const currentSearchMatch = searchMatches[searchMatchIndex];

  // Scroll to current match
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs on index change
  useEffect(() => {
    if (currentSearchMatch) {
      const el = document.getElementById(`msg-${currentSearchMatch.msg.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [searchMatchIndex, searchTerm]);

  // Attach sheet - send a photo placeholder
  const handleAttachImage = () => {
    setShowAttachSheet(false);
    const imgMsg: ChatMessage = {
      id: `img-${Date.now()}`,
      content: "Photo",
      isSent: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "image",
      replyTo: null,
      reactions: [],
      tickState: "none",
    };
    setLocalMessages((prev) => [...prev, imgMsg]);
    setTimeout(() => {
      setLocalMessages((prev) =>
        prev.map((m) =>
          m.id === imgMsg.id ? { ...m, tickState: "double" } : m,
        ),
      );
      triggerTypingIndicator();
    }, 1000);
  };

  // Group messages by date label
  const groupedMessages: { dateLabel: string; messages: ChatMessage[] }[] = [];
  if (!hasRealMessages) {
    const rawSeeds = rawSeedMessages;
    rawSeeds.forEach((raw, i) => {
      const msg = localMessages[i];
      if (!msg) return;
      const lastGroup = groupedMessages[groupedMessages.length - 1];
      if (!lastGroup || lastGroup.dateLabel !== raw.dateLabel) {
        groupedMessages.push({ dateLabel: raw.dateLabel, messages: [msg] });
      } else {
        lastGroup.messages.push(msg);
      }
    });
    // Add new messages (without date labels) to the last group or TODAY
    const newMessages = localMessages.slice(rawSeeds.length);
    if (newMessages.length > 0) {
      const lastGroup = groupedMessages[groupedMessages.length - 1];
      if (lastGroup) {
        for (const m of newMessages) lastGroup.messages.push(m);
      } else {
        groupedMessages.push({ dateLabel: "TODAY", messages: newMessages });
      }
    }
  }

  const wallpaperClass = getWallpaperClass(wallpaper);

  return (
    <div className="flex flex-col h-full animate-slide-up">
      {/* Chat header */}
      <header className="bg-wa-header flex flex-col flex-shrink-0">
        <div className="flex items-center gap-2 px-2 pt-12 pb-2">
          <button
            type="button"
            data-ocid="chat.back.button"
            onClick={onBack}
            className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
            aria-label="Back to chat list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            data-ocid="chat.contact.button"
            className="flex items-center gap-2 flex-1 min-w-0 text-left"
            aria-label={`View contact ${contactName}`}
          >
            {isGroupChat ? (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-white" />
              </div>
            ) : (
              <ContactAvatar
                initials={contactInitials}
                size="sm"
                colorIndex={colorIndex}
              />
            )}
            <div className="min-w-0">
              <p className="text-wa-header-fg font-semibold text-[15px] truncate font-display">
                {contactName}
              </p>
              <p className="text-wa-header-fg/60 text-[11px]">
                {isGroupChat ? "4 members" : "Online"}
              </p>
            </div>
          </button>

          <div className="flex items-center">
            <button
              type="button"
              data-ocid="chat.search.toggle.button"
              onClick={() => {
                setSearchOpen((p) => !p);
                setSearchTerm("");
                setSearchMatchIndex(0);
                if (!searchOpen)
                  setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
              aria-label="Search in chat"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              data-ocid="chat.video.button"
              onClick={() =>
                onOpenCall({
                  name: contactName,
                  initials: contactInitials,
                  kind: "video",
                  colorIndex,
                })
              }
              className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
              aria-label="Video call"
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              type="button"
              data-ocid="chat.call.button"
              onClick={() =>
                onOpenCall({
                  name: contactName,
                  initials: contactInitials,
                  kind: "voice",
                  colorIndex,
                })
              }
              className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
              aria-label="Voice call"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              type="button"
              data-ocid="chat.menu.button"
              className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* In-chat search bar */}
        {searchOpen && (
          <div className="flex items-center gap-2 px-3 pb-2 animate-fade-in">
            <div className="flex-1 bg-white/15 rounded-full flex items-center gap-2 px-3 py-1.5">
              <Search className="w-3.5 h-3.5 text-wa-header-fg/60 flex-shrink-0" />
              <input
                ref={searchInputRef}
                data-ocid="chat.search.input"
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSearchMatchIndex(0);
                }}
                className="flex-1 bg-transparent text-[13px] text-wa-header-fg placeholder:text-wa-header-fg/50 outline-none min-w-0"
              />
              {searchTerm && (
                <span className="text-wa-header-fg/60 text-[11px] flex-shrink-0">
                  {searchMatches.length > 0
                    ? `${searchMatchIndex + 1}/${searchMatches.length}`
                    : "0/0"}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => navigateSearch("up")}
              disabled={searchMatches.length === 0}
              className="p-1.5 text-wa-header-fg/80 hover:text-wa-header-fg disabled:opacity-40 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Previous match"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigateSearch("down")}
              disabled={searchMatches.length === 0}
              className="p-1.5 text-wa-header-fg/80 hover:text-wa-header-fg disabled:opacity-40 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Next match"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchTerm("");
              }}
              className="p-1.5 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* Message area */}
      <main
        className={`flex-1 overflow-y-auto px-3 py-3 relative ${wallpaperClass}`}
      >
        {messagesLoading && (
          <div data-ocid="chat.loading_state" className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`flex ${n % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <Skeleton
                  className={`h-10 rounded-2xl ${n % 2 === 0 ? "w-48" : "w-36"}`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Real messages from backend */}
        {!messagesLoading &&
          hasRealMessages &&
          (messages ?? []).map((msg) => (
            <div
              key={msg.id.toString()}
              className={`flex ${msg.senderId === CURRENT_USER_ID ? "justify-end" : "justify-start"} mb-1`}
            >
              <div
                className={`relative max-w-[75%] rounded-2xl px-3 py-2 shadow-bubble text-[14px]
                ${
                  msg.senderId === CURRENT_USER_ID
                    ? "bg-wa-sent text-wa-sent-fg rounded-br-sm bubble-sent"
                    : "bg-wa-received text-wa-received-fg rounded-bl-sm bubble-received"
                }`}
              >
                <p className="leading-snug break-words pr-8">{msg.content}</p>
                <span className="absolute bottom-1.5 right-2 text-[10px] opacity-60 whitespace-nowrap">
                  {formatMessageTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))}

        {/* Seed messages with date separators */}
        {!messagesLoading &&
          !hasRealMessages &&
          groupedMessages.map((group) => (
            <div key={group.dateLabel}>
              <DateSeparator label={group.dateLabel} />
              {group.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  onLongPress={handleContextMenuOpen}
                  onReactionSelect={handleReactionSelect}
                  searchTerm={searchTerm}
                  isHighlighted={
                    !!currentSearchMatch && currentSearchMatch.msg.id === msg.id
                  }
                />
              ))}
            </div>
          ))}

        {/* Typing indicator */}
        {showTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />

        {/* Reaction panel */}
        {showReactions && reactTarget && (
          <ReactionPanel
            onSelect={(emoji) => {
              if (reactTarget) handleReactionSelect(reactTarget.id, emoji);
              setReactTarget(null);
            }}
            onClose={() => {
              setShowReactions(false);
              setReactTarget(null);
            }}
          />
        )}
      </main>

      {/* Emoji picker panel */}
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiSelect={(emoji) => setInputText((prev) => prev + emoji)}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      {/* Reply preview */}
      {replyTo && (
        <ReplyPreview message={replyTo} onClose={() => setReplyTo(null)} />
      )}

      {/* Recording state */}
      {isRecording && (
        <div className="flex items-center gap-3 px-4 py-3 bg-card border-t border-border">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          <span className="text-[13px] text-red-500 font-medium">
            Recording...
          </span>
          <span className="text-[13px] text-muted-foreground font-mono">
            {formatRecordingTime(recordingSeconds)}
          </span>
          <div className="flex-1">
            <VoiceWaveform isRecording />
          </div>
          <button
            type="button"
            onClick={stopRecording}
            className="text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Cancel recording"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Input bar */}
      {!isRecording && (
        <footer
          className="flex items-center gap-2 px-2 py-2 bg-card border-t border-border flex-shrink-0"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
        >
          <button
            type="button"
            data-ocid="chat.emoji.toggle.button"
            onClick={() => setShowEmojiPicker((p) => !p)}
            className={`p-2 transition-colors ${showEmojiPicker ? "text-wa-green" : "text-muted-foreground hover:text-foreground"}`}
            aria-label="Emoji"
          >
            <Smile className="w-5 h-5" />
          </button>

          <div className="flex-1 bg-background border border-border rounded-full flex items-center px-3 py-1.5 gap-2">
            <input
              ref={inputRef}
              data-ocid="chat.input"
              type="text"
              placeholder="Message"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none min-w-0"
            />
            <button
              type="button"
              data-ocid="chat.attach.button"
              onClick={() => setShowAttachSheet(true)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          {inputText.trim() ? (
            <button
              type="button"
              data-ocid="chat.send.button"
              onClick={handleSend}
              disabled={isSending}
              className="w-10 h-10 bg-wa-green rounded-full flex items-center justify-center flex-shrink-0 hover:brightness-105 active:brightness-95 transition-all disabled:opacity-60 shadow-bubble"
              aria-label="Send message"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          ) : (
            <button
              type="button"
              data-ocid="chat.voice.record.button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className="w-10 h-10 bg-wa-green rounded-full flex items-center justify-center flex-shrink-0 hover:brightness-105 active:brightness-95 transition-all shadow-bubble"
              aria-label="Voice message — hold to record"
            >
              <Mic className="w-5 h-5 text-white" />
            </button>
          )}
        </footer>
      )}

      {/* Attachment bottom sheet */}
      {showAttachSheet && (
        <>
          <div
            className="absolute inset-0 z-40 bg-black/40"
            onClick={() => setShowAttachSheet(false)}
            onKeyDown={(e) => e.key === "Escape" && setShowAttachSheet(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close attachment menu"
          />
          <div
            data-ocid="chat.attach.sheet"
            className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl animate-slide-up"
          >
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="px-4 py-3 grid grid-cols-3 gap-3">
              <button
                type="button"
                data-ocid="chat.attach.image.button"
                onClick={handleAttachImage}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-[22px]">📷</span>
                </div>
                <span className="text-[12px] font-medium text-foreground">
                  Image
                </span>
              </button>

              <button
                type="button"
                data-ocid="chat.attach.video.button"
                onClick={() => setShowAttachSheet(false)}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-[22px]">🎥</span>
                </div>
                <span className="text-[12px] font-medium text-foreground">
                  Video
                </span>
              </button>

              <button
                type="button"
                data-ocid="chat.attach.document.button"
                onClick={() => setShowAttachSheet(false)}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <File className="w-6 h-6 text-white" />
                </div>
                <span className="text-[12px] font-medium text-foreground">
                  Document
                </span>
              </button>
            </div>

            <div className="px-4 pb-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowAttachSheet(false)}
                className="flex items-center gap-3 w-full px-1 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
                <span className="text-[15px] font-medium">Cancel</span>
              </button>
            </div>
            <div style={{ height: "env(safe-area-inset-bottom, 8px)" }} />
          </div>
        </>
      )}

      {/* Message context menu */}
      {contextMsg && (
        <MessageContextMenu
          message={contextMsg}
          onClose={() => setContextMsg(null)}
          onReply={handleReply}
          onCopy={handleCopy}
          onForward={handleForward}
          onDelete={handleDelete}
          onReact={handleReact}
        />
      )}
    </div>
  );
}
