import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  CheckCheck,
  Clock,
  Copy,
  File,
  MapPin,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Reply,
  Search,
  Send,
  Smile,
  Star,
  Trash2,
  Users,
  Video,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Message } from "../backend.d";
import CameraModal from "../components/CameraModal";
import ChatThemeSheet, {
  THEME_HEX,
  loadChatTheme,
} from "../components/ChatThemeSheet";
import type { ChatTheme } from "../components/ChatThemeSheet";
import ContactAvatar from "../components/ContactAvatar";
import ContactInfoScreen from "../components/ContactInfoScreen";
import ContactShareModal from "../components/ContactShareModal";
import EmojiPicker from "../components/EmojiPicker";
import ForwardMessageSheet from "../components/ForwardMessageSheet";
import InAppBrowser from "../components/InAppBrowser";
import LiveLocationModal from "../components/LiveLocationModal";
import LiveStreamModal from "../components/LiveStreamModal";
import MessageContextMenu, {
  type ChatMessage,
} from "../components/MessageContextMenu";
import PhotoViewer, { type PhotoViewerImage } from "../components/PhotoViewer";
import PollCreationModal from "../components/PollCreationModal";
import QuickRepliesPanel from "../components/QuickRepliesPanel";
import ScheduleMessageModal, {
  type ScheduledMsg,
} from "../components/ScheduleMessageModal";
import VoiceMessagePlayer from "../components/VoiceMessagePlayer";
import type { ActiveCall, WallpaperType } from "../hooks/useAppState";
import {
  useContacts,
  useConversations,
  useMarkAsRead,
  useMessages,
  useSendMessage,
} from "../hooks/useQueries";
import MarketplaceScreen from "./MarketplaceScreen";

interface ChatViewScreenProps {
  conversationId: bigint;
  onBack: () => void;
  onOpenCall: (contact: ActiveCall) => void;
  wallpaper?: WallpaperType;
  onOpenMediaGallery?: (contactName: string) => void;
  onOpenGroupAdmin?: () => void;
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

// Animated waveform
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
  if (state === "single")
    return <Check className="w-3 h-3 text-wa-timestamp inline-block" />;
  if (state === "double")
    return <CheckCheck className="w-3 h-3 text-wa-timestamp inline-block" />;
  return <CheckCheck className="w-3 h-3 text-wa-green inline-block" />;
}

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center my-3">
      <span className="bg-white/80 dark:bg-card/80 text-muted-foreground text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
        {label}
      </span>
    </div>
  );
}

function ReplyPreview({
  message,
  onClose,
}: { message: ChatMessage; onClose: () => void }) {
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

// Link preview helper
function extractUrl(text: string): string | null {
  const urlRegex = /https?:\/\/[^\s]+/;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

const LINK_PREVIEWS: Record<
  string,
  { title: string; description: string; color: string }
> = {
  "youtube.com": {
    title: "YouTube Video",
    description: "Watch this amazing video on YouTube",
    color: "bg-red-500",
  },
  "github.com": {
    title: "GitHub Repository",
    description: "Explore code, issues and more on GitHub",
    color: "bg-gray-800",
  },
  "twitter.com": {
    title: "Tweet",
    description: "See what's happening on Twitter",
    color: "bg-sky-500",
  },
  "x.com": {
    title: "Post on X",
    description: "See the latest on X (formerly Twitter)",
    color: "bg-gray-900",
  },
  "medium.com": {
    title: "Article on Medium",
    description: "Read this interesting article on Medium",
    color: "bg-green-700",
  },
};

function LinkPreview({ url }: { url: string }) {
  const domain = getDomain(url);
  const preview = LINK_PREVIEWS[domain] ?? {
    title: `${domain.charAt(0).toUpperCase()}${domain.slice(1)}`,
    description: url.length > 60 ? `${url.slice(0, 60)}...` : url,
    color: "bg-wa-green",
  };
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block mt-2 rounded-xl overflow-hidden border border-border/40 bg-background/60 hover:opacity-90 transition-opacity no-underline"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`${preview.color} px-3 py-1.5`}>
        <p className="text-white text-[10px] font-bold uppercase tracking-wider truncate">
          {domain}
        </p>
      </div>
      <div className="px-3 py-2">
        <p className="text-[12px] font-semibold text-foreground">
          {preview.title}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
          {preview.description}
        </p>
      </div>
    </a>
  );
}

function MessageBubble({
  msg,
  onLongPress,
  onSwipeReply,
  searchTerm,
  isHighlighted,
  onPhotoOpen,
  translatedText,
  onTickTap,
  onReactionTap,
}: {
  msg: ChatMessage;
  onLongPress: (msg: ChatMessage) => void;
  onSwipeReply?: (msg: ChatMessage) => void;
  onReactionSelect?: (msgId: string, emoji: string) => void;
  onReactionTap?: (msg: ChatMessage) => void;
  searchTerm: string;
  isHighlighted: boolean;
  onPhotoOpen?: (msgId: string) => void;
  translatedText?: string;
  onTickTap?: (msg: ChatMessage) => void;
}) {
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeTouchStart = useRef<{ x: number; y: number } | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [swipeTriggered, setSwipeTriggered] = useState(false);

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      onLongPress(msg);
    }, 600);
  };
  const cancelLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const handleSwipeTouchStart = (e: React.TouchEvent) => {
    swipeTouchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    setSwipeTriggered(false);
  };
  const handleSwipeTouchMove = (e: React.TouchEvent) => {
    if (!swipeTouchStart.current) return;
    const dx = e.touches[0].clientX - swipeTouchStart.current.x;
    const dy = e.touches[0].clientY - swipeTouchStart.current.y;
    if (Math.abs(dy) > Math.abs(dx)) return; // vertical scroll
    if (dx > 0 && dx < 80) {
      setSwipeOffset(dx);
    } else if (dx >= 60 && !swipeTriggered) {
      setSwipeTriggered(true);
      setSwipeOffset(0);
      swipeTouchStart.current = null;
      onSwipeReply?.(msg);
    }
  };
  const handleSwipeTouchEnd = () => {
    swipeTouchStart.current = null;
    setSwipeOffset(0);
  };

  const renderContent = (text: string) => {
    // Highlight @mentions
    const mentionRegex = /@([A-Za-z]+)/g;
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;
    let match = mentionRegex.exec(text);
    while (match !== null) {
      const before = text.slice(lastIndex, match.index);
      if (before) {
        if (
          searchTerm &&
          before.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          const si = before.toLowerCase().indexOf(searchTerm.toLowerCase());
          segments.push(
            <span key={`b-${match.index}`}>
              {before.slice(0, si)}
              <mark className="bg-yellow-300 text-black rounded px-0.5">
                {before.slice(si, si + searchTerm.length)}
              </mark>
              {before.slice(si + searchTerm.length)}
            </span>,
          );
        } else {
          segments.push(<span key={`b-${match.index}`}>{before}</span>);
        }
      }
      segments.push(
        <span key={`a-${match.index}`} className="font-semibold text-wa-green">
          @{match[1]}
        </span>,
      );
      lastIndex = match.index + match[0].length;
      match = mentionRegex.exec(text);
    }
    const trailing = text.slice(lastIndex);
    if (trailing) {
      if (
        searchTerm &&
        trailing.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        const si = trailing.toLowerCase().indexOf(searchTerm.toLowerCase());
        segments.push(
          <span key="trail">
            {trailing.slice(0, si)}
            <mark className="bg-yellow-300 text-black rounded px-0.5">
              {trailing.slice(si, si + searchTerm.length)}
            </mark>
            {trailing.slice(si + searchTerm.length)}
          </span>,
        );
      } else {
        segments.push(<span key="trail">{trailing}</span>);
      }
    }
    if (segments.length === 0) return <span>{text}</span>;
    return <>{segments}</>;
  };

  const isSent = msg.isSent;

  return (
    <div
      className={`flex ${isSent ? "justify-end" : "justify-start"} mb-1 relative`}
      id={`msg-${msg.id}`}
      onTouchStart={handleSwipeTouchStart}
      onTouchMove={handleSwipeTouchMove}
      onTouchEnd={handleSwipeTouchEnd}
      style={{
        transform:
          swipeOffset > 0 ? `translateX(${swipeOffset * 0.4}px)` : undefined,
        transition: swipeOffset === 0 ? "transform 0.2s ease" : undefined,
      }}
    >
      {/* Swipe reply indicator */}
      {swipeOffset > 20 && (
        <div
          className={`absolute ${isSent ? "left-0" : "right-0"} top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-wa-green flex items-center justify-center shadow-md`}
          style={{ opacity: Math.min(1, swipeOffset / 60) }}
        >
          <span className="text-white text-[12px]">↩</span>
        </div>
      )}
      <div
        className={`
          relative max-w-[75%] rounded-2xl px-3 py-2 shadow-bubble text-[14px]
          ${isSent ? "bg-wa-sent text-wa-sent-fg rounded-br-sm bubble-sent" : "bg-wa-received text-wa-received-fg rounded-bl-sm bubble-received"}
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

        {msg.type === "voice" ? (
          <div className="pr-1">
            <VoiceMessagePlayer
              duration={msg.voiceDuration ?? "0:12"}
              isSent={msg.isSent}
            />
          </div>
        ) : msg.deletedForEveryone ? (
          <div className="pr-8">
            <p className="text-[13px] italic text-muted-foreground">
              🚫 This message was deleted
            </p>
          </div>
        ) : msg.type === "image" ? (
          <div className="pr-8">
            {msg.imageUrl ? (
              <button
                type="button"
                data-ocid="chat.photo.canvas_target"
                onClick={() => onPhotoOpen?.(msg.id)}
                className="w-full block"
                aria-label="View full photo"
              >
                <img
                  src={msg.imageUrl}
                  alt="Sent"
                  className="w-full max-h-48 rounded-lg object-cover mb-1"
                />
              </button>
            ) : (
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-1">
                <span className="text-2xl">📷</span>
              </div>
            )}
            <p className="text-[12px] opacity-70">Photo</p>
          </div>
        ) : (
          <div>
            <p className="leading-snug break-words pr-8">
              {renderContent(msg.content)}
            </p>
            {extractUrl(msg.content) && (
              <LinkPreview url={extractUrl(msg.content)!} />
            )}
          </div>
        )}

        <span className="absolute bottom-1.5 right-2 flex items-center gap-0.5 text-[10px] opacity-60 whitespace-nowrap">
          {(msg as ChatMessage & { isEdited?: boolean }).isEdited && (
            <span className="text-[9px] italic opacity-70">edited</span>
          )}
          {msg.time}
          {isSent && msg.tickState && msg.tickState !== "none" && (
            <button
              type="button"
              data-ocid="chat.ticks.button"
              onClick={(e) => {
                e.stopPropagation();
                onTickTap?.(msg);
              }}
              className="inline-flex items-center hover:opacity-80 transition-opacity"
              aria-label="Read receipt details"
            >
              <MessageTicks state={msg.tickState} />
            </button>
          )}
        </span>
      </div>

      {msg.reactions && msg.reactions.length > 0 && (
        <div
          className={`absolute -bottom-3 ${isSent ? "right-2" : "left-2"} flex gap-0.5 z-10`}
        >
          <button
            type="button"
            data-ocid="chat.reaction.button"
            onClick={() => onReactionTap?.(msg)}
            className="bg-card border border-border rounded-full px-1.5 py-0.5 shadow-bubble flex items-center gap-0.5 active:scale-110 transition-transform"
            aria-label="View reactions"
          >
            {(() => {
              // Aggregate same emoji
              const counts: Record<string, number> = {};
              for (const r of msg.reactions) counts[r] = (counts[r] || 0) + 1;
              return Object.entries(counts).map(([emoji, count]) => (
                <span
                  key={emoji}
                  className="text-[13px] flex items-center gap-0.5"
                >
                  {emoji}
                  {count > 1 && (
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {count}
                    </span>
                  )}
                </span>
              ));
            })()}
          </button>
        </div>
      )}
      {/* Stage 17: Translation display */}
      {translatedText && (
        <div
          data-ocid="chat.translate.panel"
          className={`mt-1.5 text-[11px] italic border-t pt-1 ${
            isSent
              ? "border-wa-sent-fg/20 text-wa-sent-fg/70"
              : "border-border text-muted-foreground"
          }`}
        >
          🌐 {translatedText}
        </div>
      )}
    </div>
  );
}

function ReactionPanel({
  onSelect,
  onClose,
}: { onSelect: (emoji: string) => void; onClose: () => void }) {
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

// Extended ChatMessage type with imageUrl
interface ExtChatMessage extends ChatMessage {
  imageUrl?: string;
  starred?: boolean;
}

export default function ChatViewScreen({
  conversationId,
  onBack,
  onOpenCall,
  wallpaper,
  onOpenMediaGallery,
  onOpenGroupAdmin,
}: ChatViewScreenProps) {
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachSheet, setShowAttachSheet] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [contextMsg, setContextMsg] = useState<ChatMessage | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [reactTarget, setReactTarget] = useState<ChatMessage | null>(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showClearChatConfirm, setShowClearChatConfirm] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMatchIndex, setSearchMatchIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledMsgs, setScheduledMsgs] = useState<
    {
      id: number;
      text: string;
      dt: Date;
      recurring?: "none" | "daily" | "weekly";
    }[]
  >([]);
  const [showScheduledPanel, setShowScheduledPanel] = useState(false);
  const [showMuteSheet, setShowMuteSheet] = useState(false);
  const [showChatThemeSheet, setShowChatThemeSheet] = useState(false);
  const [chatTheme, setChatTheme] = useState<ChatTheme>({
    bubbleColor: "default",
    headerColor: "default",
  });
  const [showDisappearingSheet, setShowDisappearingSheet] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showCatalogueSheet, setShowCatalogueSheet] = useState(false);
  const [showQuickRepliesSheet, setShowQuickRepliesSheet] = useState(false);
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [showShareContactSheet, setShowShareContactSheet] = useState(false);
  const [showPollSheet, setShowPollSheet] = useState(false);
  const [showEventSheet, setShowEventSheet] = useState(false);
  const [showUPISheet, setShowUPISheet] = useState(false);
  const [showForwardSheet, setShowForwardSheet] = useState(false);
  const [forwardMsg, setForwardMsg] = useState<ChatMessage | null>(null);
  const [showQuickRepliesPanel, setShowQuickRepliesPanel] = useState(false);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);
  const [showPollCreation, setShowPollCreation] = useState(false);
  const [showContactShareModal, setShowContactShareModal] = useState(false);
  // Multi-select mode
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedMsgIds, setSelectedMsgIds] = useState<Set<string>>(new Set());
  // In-app browser
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);
  // Live location
  const [showLiveLocation, setShowLiveLocation] = useState(false);
  const [showLiveStream, setShowLiveStream] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [editingMsg, setEditingMsg] = useState<ChatMessage | null>(null);
  const [showReactorsSheet, setShowReactorsSheet] = useState(false);
  const [reactorsTarget, setReactorsTarget] = useState<ChatMessage | null>(
    null,
  );
  const [pinnedMessage, setPinnedMessage] = useState<ChatMessage | null>(null);
  const [pinnedDismissed, setPinnedDismissed] = useState(false);
  // Stage 17: multi-pin support
  const [pinnedMsgs, setPinnedMsgs] = useState<ChatMessage[]>([]);
  const [pinnedIdx, setPinnedIdx] = useState(0);
  // Stage 17: translation
  const [translatedMsgs, setTranslatedMsgs] = useState<Record<string, string>>(
    {},
  );
  // Stage 17: read receipt details
  const [readReceiptMsg, setReadReceiptMsg] = useState<ExtChatMessage | null>(
    null,
  );
  // Stage 17: mention popup
  const [showMentionPopup, setShowMentionPopup] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const GROUP_MEMBERS = ["Alice", "Bob", "Carol", "Dave", "Eve"];
  // Stage 17: edit scheduled
  const [editingScheduledId, setEditingScheduledId] = useState<number | null>(
    null,
  );
  const [selectedMuteOption, setSelectedMuteOption] = useState("8h");
  const [selectedDisappearing, setSelectedDisappearing] = useState(() => {
    return localStorage.getItem(`wa_disappear_${conversationId}`) ?? "off";
  });
  const [selectedShareContact, setSelectedShareContact] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollMultipleAnswers, setPollMultipleAnswers] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const docInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-send scheduled messages when their time arrives
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setScheduledMsgs((prev) => {
        const toSend = prev.filter((m) => m.dt <= now);
        if (toSend.length > 0) {
          for (const m of toSend) {
            toast.success(
              `Scheduled message sent: "${m.text.slice(0, 30)}${m.text.length > 30 ? "..." : ""}"`,
            );
          }
          return prev.filter((m) => m.dt > now);
        }
        return prev;
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  const [showTyping, setShowTyping] = useState(false);

  // Hidden file input for gallery attachment
  const galleryInputRef = useRef<HTMLInputElement>(null);

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

  const [localMessages, setLocalMessages] = useState<ExtChatMessage[]>(() =>
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

  // Load chat theme
  useEffect(() => {
    const theme = loadChatTheme(conversationId.toString());
    setChatTheme(theme);
  }, [conversationId]);

  useEffect(() => {
    const timer = setTimeout(() => setSkeletonLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: messagesEndRef is stable
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, showTyping]);

  const triggerTypingIndicator = useCallback(() => {
    setShowTyping(true);
    setTimeout(() => setShowTyping(false), 2000);
  }, []);

  const handleEdit = (msg: ChatMessage) => {
    setEditingMsg(msg);
    setInputText(msg.content);
    setReplyTo(null);
    setShowEmojiPicker(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isSending) return;

    // Handle edit mode
    if (editingMsg) {
      setLocalMessages((prev) =>
        prev.map((m) =>
          m.id === editingMsg.id ? { ...m, content: text, isEdited: true } : m,
        ),
      );
      setEditingMsg(null);
      setInputText("");
      setShowEmojiPicker(false);
      toast.success("Message edited");
      return;
    }

    const newMsg: ExtChatMessage = {
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

    sendMessage(
      { conversationId, content: text },
      { onError: () => toast.error("Failed to send message") },
    );
  };

  const sendMsg = (text: string) => {
    const newMsg: ExtChatMessage = {
      id: `local-${Date.now()}`,
      content: text,
      isSent: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
      replyTo: null,
      reactions: [],
      tickState: "none",
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    setTimeout(
      () =>
        setLocalMessages((prev) =>
          prev.map((m) =>
            m.id === newMsg.id ? { ...m, tickState: "single" } : m,
          ),
        ),
      500,
    );
    setTimeout(
      () =>
        setLocalMessages((prev) =>
          prev.map((m) =>
            m.id === newMsg.id ? { ...m, tickState: "double" } : m,
          ),
        ),
      1200,
    );
    setTimeout(
      () =>
        setLocalMessages((prev) =>
          prev.map((m) =>
            m.id === newMsg.id ? { ...m, tickState: "seen" } : m,
          ),
        ),
      2500,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    const duration = recordingSeconds;
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    const durationStr = `${mins}:${secs.toString().padStart(2, "0")}`;

    const voiceMsg: ExtChatMessage = {
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

  const handleContextMenuOpen = (msg: ChatMessage) => {
    if (multiSelectMode) {
      setSelectedMsgIds((prev) => {
        const s = new Set(prev);
        if (s.has(msg.id)) s.delete(msg.id);
        else s.add(msg.id);
        return s;
      });
      return;
    }
    setContextMsg(msg);
  };

  const toggleMsgSelection = (msgId: string) => {
    setSelectedMsgIds((prev) => {
      const s = new Set(prev);
      if (s.has(msgId)) s.delete(msgId);
      else s.add(msgId);
      return s;
    });
  };

  const exitMultiSelect = () => {
    setMultiSelectMode(false);
    setSelectedMsgIds(new Set());
  };
  const handleReply = (msg: ChatMessage) => {
    setReplyTo(msg);
    inputRef.current?.focus();
  };
  const handleCopy = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.content).catch(() => {});
    toast.success("Message copied");
  };
  const handleForward = (msg: ChatMessage) => {
    setForwardMsg(msg);
    setShowForwardSheet(true);
  };
  const handleDelete = (msg: ChatMessage) => {
    setLocalMessages((prev) => prev.filter((m) => m.id !== msg.id));
    toast.success("Message deleted");
  };
  const handlePhotoOpen = (msgId: string) => {
    const imgs = localMessages.filter(
      (lm) =>
        lm.type === "image" &&
        lm.imageUrl &&
        !(lm as ExtChatMessage & { deletedForEveryone?: boolean })
          .deletedForEveryone,
    );
    const idx = imgs.findIndex((lm) => lm.id === msgId);
    setPhotoViewerIndex(Math.max(0, idx));
    setPhotoViewerOpen(true);
  };
  const handleDeleteForEveryone = (msg: ChatMessage) => {
    setLocalMessages((prev) =>
      prev.map((m) =>
        m.id === msg.id
          ? {
              ...m,
              content: "",
              deletedForEveryone: true,
              type: "text" as const,
              imageUrl: undefined,
            }
          : m,
      ),
    );
    toast.success("Message deleted for everyone");
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

  // Handle gallery image selection
  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShowAttachSheet(false);
    const imageUrl = URL.createObjectURL(file);
    const imgMsg: ExtChatMessage = {
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
      imageUrl,
    };
    setLocalMessages((prev) => [...prev, imgMsg]);
    toast.success(`Sent: ${file.name}`);
    setTimeout(() => {
      setLocalMessages((prev) =>
        prev.map((m) =>
          m.id === imgMsg.id ? { ...m, tickState: "double" } : m,
        ),
      );
      triggerTypingIndicator();
    }, 1000);
    // reset input
    e.target.value = "";
  };

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs on index change
  useEffect(() => {
    if (currentSearchMatch) {
      const el = document.getElementById(`msg-${currentSearchMatch.msg.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [searchMatchIndex, searchTerm]);

  const groupedMessages: { dateLabel: string; messages: ExtChatMessage[] }[] =
    [];
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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) > Math.abs(dy) && dx > 80) {
      onBack();
      return;
    }
    if (dy > 80 && Math.abs(dy) > Math.abs(dx)) {
      onBack();
      return;
    }
  };

  return (
    <div
      className="flex flex-col h-full animate-slide-up"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Multi-select action bar */}
      {/* Multi-select count header (top bar, minimal) */}
      <AnimatePresence>
        {multiSelectMode && (
          <motion.div
            key="multiselect-header"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            data-ocid="chat.multiselect.panel"
            className="sticky top-0 z-[60] bg-[#1F2C34] text-white flex items-center gap-3 px-3 py-3 flex-shrink-0"
            style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
          >
            <button
              type="button"
              data-ocid="chat.multiselect.cancel_button"
              onClick={exitMultiSelect}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Cancel multi-select"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="flex-1 text-[16px] font-semibold">
              {selectedMsgIds.size} selected
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Sticky Chat header */}
      <header
        className="sticky top-0 z-50 bg-wa-header flex flex-col flex-shrink-0"
        style={
          THEME_HEX[chatTheme.headerColor]
            ? { background: THEME_HEX[chatTheme.headerColor] }
            : undefined
        }
      >
        <div
          className="flex items-center gap-2 px-2 pb-2"
          style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
        >
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
            onClick={() => setShowContactInfo(true)}
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
              <p
                className="text-wa-header-fg font-semibold text-[15px] truncate font-display"
                style={{ marginTop: "0.5px" }}
              >
                {contactName}
              </p>
              <p className="text-wa-header-fg/60 text-[11px]">
                {isGroupChat
                  ? showTyping
                    ? "typing..."
                    : "4 members online"
                  : showTyping
                    ? "typing..."
                    : "online"}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  data-ocid="chat.menu.button"
                  className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-popover border-border shadow-lg z-50"
                data-ocid="chat.dropdown_menu"
              >
                <DropdownMenuItem
                  data-ocid="chat.menu.view_contact"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => setShowContactInfo(true)}
                >
                  View contact
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chat.menu.media"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => {
                    setShowContactInfo(false);
                    onOpenMediaGallery?.(contactName);
                  }}
                >
                  Media, links and docs
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chat.menu.search"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => {
                    setSearchOpen((p) => !p);
                    setSearchTerm("");
                    setSearchMatchIndex(0);
                    if (!searchOpen)
                      setTimeout(() => searchInputRef.current?.focus(), 100);
                  }}
                >
                  Search
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chat.menu.mute"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => setShowMuteSheet(true)}
                >
                  Mute notifications
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chat.menu.disappearing"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => setShowDisappearingSheet(true)}
                >
                  Disappearing messages
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chat.menu.clear_chat"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => setShowClearChatConfirm(true)}
                >
                  Clear chat
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chat.menu.export"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => setShowExportDialog(true)}
                >
                  Export chat
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chat.menu.theme"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => setShowChatThemeSheet(true)}
                >
                  Chat theme
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chat.menu.report"
                  className="text-[14px] py-2.5 cursor-pointer text-destructive"
                  onClick={() => setShowReportDialog(true)}
                >
                  Report
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="chat.menu.block"
                  className="text-[14px] py-2.5 cursor-pointer text-destructive"
                  onClick={() => setShowBlockDialog(true)}
                >
                  Block
                </DropdownMenuItem>
                {isGroupChat && (
                  <DropdownMenuItem
                    data-ocid="chat.menu.go_live"
                    className="text-[14px] py-2.5 cursor-pointer text-red-500"
                    onClick={() => setShowLiveStream(true)}
                  >
                    🔴 Go Live
                  </DropdownMenuItem>
                )}
                {isGroupChat && (
                  <DropdownMenuItem
                    data-ocid="chat.menu.admin_tools"
                    className="text-[14px] py-2.5 cursor-pointer"
                    onClick={() => onOpenGroupAdmin?.()}
                  >
                    🛡️ Admin Tools
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* In-chat search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              key="search-bar"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 px-3 pb-2 pt-1">
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
                  data-ocid="chat.search.prev_button"
                  onClick={() => navigateSearch("up")}
                  disabled={searchMatches.length === 0}
                  className="p-1.5 text-wa-header-fg/80 hover:text-wa-header-fg disabled:opacity-40 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Previous match"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  data-ocid="chat.search.next_button"
                  onClick={() => navigateSearch("down")}
                  disabled={searchMatches.length === 0}
                  className="p-1.5 text-wa-header-fg/80 hover:text-wa-header-fg disabled:opacity-40 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Next match"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  data-ocid="chat.search.close_button"
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
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Pinned message banner - Stage 17: multi-pin cycling */}
      {(pinnedMsgs.length > 0 || (pinnedMessage && !pinnedDismissed)) && (
        <div
          className="flex items-center gap-2 px-3 py-2 bg-wa-green/10 border-b border-wa-green/20 w-full"
          data-ocid="chat.pinned.panel"
        >
          <div className="w-0.5 h-8 bg-wa-green rounded-full flex-shrink-0" />
          <button
            type="button"
            className="flex-1 min-w-0 text-left"
            onClick={() => {
              const msgs =
                pinnedMsgs.length > 0
                  ? pinnedMsgs
                  : pinnedMessage
                    ? [pinnedMessage]
                    : [];
              const current = msgs[pinnedIdx % msgs.length];
              if (current) {
                const el = document.getElementById(`msg-${current.id}`);
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
          >
            <p className="text-[10px] font-semibold text-wa-green">
              📌 Pinned Message{" "}
              {pinnedMsgs.length > 1
                ? `${(pinnedIdx % pinnedMsgs.length) + 1}/${pinnedMsgs.length}`
                : ""}
            </p>
            <p className="text-[12px] text-foreground truncate">
              {pinnedMsgs.length > 0
                ? pinnedMsgs[pinnedIdx % pinnedMsgs.length]?.content
                : pinnedMessage?.content}
            </p>
          </button>
          {pinnedMsgs.length > 1 && (
            <button
              type="button"
              data-ocid="chat.pinned.prev.button"
              onClick={() =>
                setPinnedIdx(
                  (i) => (i - 1 + pinnedMsgs.length) % pinnedMsgs.length,
                )
              }
              className="p-1 text-wa-green hover:text-wa-green/80 text-[14px] font-bold"
              aria-label="Previous pinned"
            >
              ‹
            </button>
          )}
          {pinnedMsgs.length > 1 && (
            <button
              type="button"
              data-ocid="chat.pinned.next.button"
              onClick={() => setPinnedIdx((i) => (i + 1) % pinnedMsgs.length)}
              className="p-1 text-wa-green hover:text-wa-green/80 text-[14px] font-bold"
              aria-label="Next pinned"
            >
              ›
            </button>
          )}
          <button
            type="button"
            data-ocid="chat.pinned.close_button"
            onClick={(e) => {
              e.stopPropagation();
              setPinnedMsgs([]);
              setPinnedDismissed(true);
            }}
            className="p-1 text-muted-foreground hover:text-foreground"
            aria-label="Dismiss pinned"
          >
            ✕
          </button>
        </div>
      )}

      {/* Disappearing messages banner */}
      {selectedDisappearing !== "off" && (
        <button
          type="button"
          data-ocid="chat.disappearing.banner"
          className="flex items-center justify-between px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20 flex-shrink-0 cursor-pointer w-full text-left"
          onClick={() => setShowDisappearingSheet(true)}
        >
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-[14px]">⏱</span>
            <p className="text-[12px] text-yellow-300 font-medium">
              Disappearing messages:{" "}
              {selectedDisappearing === "24h"
                ? "24 hours"
                : selectedDisappearing === "7d"
                  ? "7 days"
                  : "90 days"}
            </p>
          </div>
          <p className="text-[11px] text-yellow-400/70">Tap to change</p>
        </button>
      )}

      {/* Message area — smooth scrolling */}
      <main
        className={`flex-1 overflow-y-auto scroll-smooth px-3 py-3 relative ${wallpaperClass}`}
        style={
          {
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
          } as React.CSSProperties
        }
      >
        {(messagesLoading || skeletonLoading) && (
          <div data-ocid="chat.loading_state" className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`flex ${n % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <Skeleton
                  className={`rounded-2xl ${n % 2 === 0 ? "h-12 w-52" : "h-10 w-40"}`}
                />
              </div>
            ))}
          </div>
        )}

        {!messagesLoading &&
          !skeletonLoading &&
          hasRealMessages &&
          (messages ?? []).map((msg) => (
            <div
              key={msg.id.toString()}
              className={`flex ${msg.senderId === CURRENT_USER_ID ? "justify-end" : "justify-start"} mb-1`}
            >
              <div
                className={`relative max-w-[75%] rounded-2xl px-3 py-2 shadow-bubble text-[14px] ${msg.senderId === CURRENT_USER_ID ? "bg-wa-sent text-wa-sent-fg rounded-br-sm bubble-sent" : "bg-wa-received text-wa-received-fg rounded-bl-sm bubble-received"}`}
                style={
                  msg.senderId === CURRENT_USER_ID &&
                  THEME_HEX[chatTheme.bubbleColor]
                    ? { background: THEME_HEX[chatTheme.bubbleColor] }
                    : undefined
                }
              >
                <p className="leading-snug break-words pr-8">{msg.content}</p>
                <span className="absolute bottom-1.5 right-2 text-[10px] opacity-60 whitespace-nowrap">
                  {formatMessageTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))}

        {!messagesLoading &&
          !skeletonLoading &&
          !hasRealMessages &&
          groupedMessages.map((group) => (
            <div key={group.dateLabel}>
              <DateSeparator label={group.dateLabel} />
              {group.messages.map((msg) => (
                <div
                  key={msg.id}
                  role={multiSelectMode ? "button" : undefined}
                  tabIndex={multiSelectMode ? 0 : undefined}
                  className={`relative flex items-center gap-2 ${multiSelectMode ? ((msg as any).senderId === CURRENT_USER_ID ? "flex-row-reverse" : "flex-row") : ""}`}
                  onClick={() => multiSelectMode && toggleMsgSelection(msg.id)}
                  onKeyDown={(e) => {
                    if (multiSelectMode && (e.key === "Enter" || e.key === " "))
                      toggleMsgSelection(msg.id);
                  }}
                >
                  {multiSelectMode && (
                    <div
                      data-ocid="chat.multiselect.checkbox"
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all ${
                        selectedMsgIds.has(msg.id)
                          ? "bg-wa-green border-wa-green flex items-center justify-center"
                          : "border-border bg-transparent"
                      }`}
                    >
                      {selectedMsgIds.has(msg.id) && (
                        <span className="text-white text-[12px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <MessageBubble
                      msg={msg}
                      onLongPress={(m) => {
                        if (!multiSelectMode) {
                          setMultiSelectMode(true);
                          setSelectedMsgIds(new Set([m.id]));
                        } else {
                          handleContextMenuOpen(m);
                        }
                      }}
                      onSwipeReply={(m) => {
                        handleReply(m);
                      }}
                      onReactionSelect={handleReactionSelect}
                      onReactionTap={(m) => {
                        setReactorsTarget(m);
                        setShowReactorsSheet(true);
                      }}
                      onPhotoOpen={handlePhotoOpen}
                      searchTerm={searchTerm}
                      isHighlighted={
                        !!currentSearchMatch &&
                        currentSearchMatch.msg.id === msg.id
                      }
                      translatedText={translatedMsgs[msg.id]}
                      onTickTap={(m) => setReadReceiptMsg(m as ExtChatMessage)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}

        {showTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />

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

      {/* Contact Info Screen overlay */}
      <ContactInfoScreen
        open={showContactInfo}
        onClose={() => setShowContactInfo(false)}
        contactName={contactName}
        contactInitials={contactInitials}
        colorIndex={colorIndex}
        onStartCall={(type) => {
          onOpenCall({
            name: contactName,
            initials: contactInitials,
            kind: type,
            colorIndex,
          });
          setShowContactInfo(false);
        }}
        onOpenSearch={() => {
          setSearchOpen(true);
          setShowContactInfo(false);
          setTimeout(() => searchInputRef.current?.focus(), 100);
        }}
        onOpenMediaGallery={(name) => {
          setShowContactInfo(false);
          onOpenMediaGallery?.(name);
        }}
      />

      {/* Clear chat confirm dialog */}
      <AlertDialog
        open={showClearChatConfirm}
        onOpenChange={setShowClearChatConfirm}
      >
        <AlertDialogContent
          data-ocid="chat.clear_chat.dialog"
          className="max-w-[320px] rounded-2xl"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Clear chat?</AlertDialogTitle>
            <AlertDialogDescription>
              All messages in this chat will be deleted from this device. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="chat.clear_chat.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="chat.clear_chat.confirm_button"
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                setLocalMessages([]);
                setShowClearChatConfirm(false);
                toast.success("Chat cleared");
              }}
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Emoji picker panel */}
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiSelect={(emoji) => setInputText((prev) => prev + emoji)}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      {/* Stage 17: Mention popup */}
      {showMentionPopup && isGroupChat && (
        <div
          className="absolute bottom-[72px] left-3 right-3 z-30 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
          data-ocid="chat.mention.popover"
        >
          {GROUP_MEMBERS.filter((m) =>
            m.toLowerCase().startsWith(mentionQuery.toLowerCase()),
          ).map((member) => (
            <button
              key={member}
              type="button"
              data-ocid="chat.mention.button"
              onClick={() => {
                const atIdx = inputText.lastIndexOf("@");
                setInputText(`${inputText.slice(0, atIdx)}@${member} `);
                setShowMentionPopup(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-muted/60 transition-colors text-left border-b border-border last:border-0"
            >
              <div className="w-7 h-7 rounded-full bg-wa-green/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] font-bold text-wa-green">
                  {member[0]}
                </span>
              </div>
              <span className="text-[14px] font-medium text-foreground">
                @{member}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Edit mode strip */}
      {editingMsg && (
        <div
          data-ocid="chat.edit.preview"
          className="flex items-center gap-2 px-3 py-2 bg-muted/60 border-t border-border"
        >
          <div className="w-1 h-8 bg-amber-400 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-amber-500 flex items-center gap-1">
              <span>✏️</span> Editing message
            </p>
            <p className="text-[12px] text-muted-foreground truncate">
              {editingMsg.content}
            </p>
          </div>
          <button
            type="button"
            data-ocid="chat.edit.cancel_button"
            onClick={() => {
              setEditingMsg(null);
              setInputText("");
            }}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Cancel edit"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reply preview */}
      {replyTo && (
        <ReplyPreview message={replyTo} onClose={() => setReplyTo(null)} />
      )}

      {/* Recording state */}
      {isRecording && (
        <div className="flex items-center gap-2 px-3 py-3 bg-card border-t border-border sticky bottom-0 z-10">
          <button
            type="button"
            onClick={() => {
              setIsRecording(false);
              if (recordingTimerRef.current)
                clearInterval(recordingTimerRef.current);
              setRecordingSeconds(0);
            }}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-muted"
            aria-label="Cancel recording"
            data-ocid="chat.record.cancel_button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            <span className="text-[13px] text-red-500 font-mono font-medium">
              {formatRecordingTime(recordingSeconds)}
            </span>
            <div className="flex-1">
              <VoiceWaveform isRecording />
            </div>
          </div>
          <button
            type="button"
            onClick={stopRecording}
            className="w-10 h-10 rounded-full bg-wa-green flex items-center justify-center hover:brightness-105 active:brightness-95 transition-all"
            aria-label="Send voice message"
            data-ocid="chat.record.send_button"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Scheduled messages panel */}
      {scheduledMsgs.length > 0 && (
        <div
          className="sticky bottom-0 z-10 bg-card border-t border-border"
          data-ocid="schedule.panel"
        >
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-muted/50 transition-colors"
            onClick={() => setShowScheduledPanel((p) => !p)}
            data-ocid="schedule.toggle"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-wa-green" />
              <span className="text-[12px] font-semibold text-wa-green">
                {scheduledMsgs.length} scheduled
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              {showScheduledPanel ? "Hide ▲" : "Show ▼"}
            </span>
          </button>
          {showScheduledPanel && (
            <ul className="max-h-40 overflow-y-auto border-t border-border">
              {scheduledMsgs.map((msg, idx) => (
                <li
                  key={msg.id}
                  className="flex items-center gap-3 px-4 py-2 border-b border-border last:border-0"
                  data-ocid={`schedule.item.${idx + 1}`}
                >
                  <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-foreground truncate">
                      {msg.text}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {msg.dt.toLocaleString([], {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid={`schedule.edit_button.${idx + 1}`}
                    onClick={() => {
                      setEditingScheduledId(msg.id);
                    }}
                    className="p-1 text-muted-foreground hover:text-wa-green transition-colors text-[10px] font-semibold"
                    aria-label="Edit scheduled message"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    data-ocid={`schedule.snooze_button.${idx + 1}`}
                    onClick={() =>
                      setScheduledMsgs((prev) =>
                        prev.map((m) =>
                          m.id === msg.id
                            ? {
                                ...m,
                                dt: new Date(m.dt.getTime() + 60 * 60 * 1000),
                              }
                            : m,
                        ),
                      )
                    }
                    className="p-1 text-muted-foreground hover:text-amber-500 transition-colors text-[10px] font-semibold"
                    aria-label="Snooze 1 hour"
                  >
                    +1h
                  </button>
                  <button
                    type="button"
                    data-ocid={`schedule.delete_button.${idx + 1}`}
                    onClick={() =>
                      setScheduledMsgs((prev) =>
                        prev.filter((m) => m.id !== msg.id),
                      )
                    }
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove scheduled message"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Input bar — sticky bottom */}
      {!isRecording && (
        <footer
          className="sticky bottom-0 z-10 flex items-center gap-2 px-2 py-2 bg-background/95 backdrop-blur-sm border-t border-border flex-shrink-0"
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

          {/* Quick Replies lightning button */}
          <button
            type="button"
            data-ocid="chat.quickreplies.open_modal_button"
            onClick={() => setShowQuickRepliesPanel(true)}
            className="text-muted-foreground hover:text-yellow-500 transition-colors flex-shrink-0"
            aria-label="Quick replies"
          >
            <span className="text-[18px] leading-none">⚡</span>
          </button>

          <div className="flex-1 bg-background border border-border rounded-full flex items-center px-3 py-1.5 gap-2">
            <input
              ref={inputRef}
              data-ocid="chat.input"
              type="text"
              placeholder="Message"
              value={inputText}
              onChange={(e) => {
                const val = e.target.value;
                setInputText(val);
                if (isGroupChat) {
                  const atIdx = val.lastIndexOf("@");
                  if (
                    atIdx !== -1 &&
                    atIdx ===
                      val.length -
                        1 -
                        (val.slice(atIdx + 1).length -
                          val.slice(atIdx + 1).replace(/[^a-zA-Z]/g, "").length)
                  ) {
                    const query = val.slice(atIdx + 1);
                    setMentionQuery(query);
                    setShowMentionPopup(true);
                  } else if (!val.includes("@")) {
                    setShowMentionPopup(false);
                  }
                }
              }}
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

      {/* Hidden gallery file input */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleGalleryFileChange}
        aria-label="Select image or video"
      />

      {/* Attachment bottom sheet — 11 options */}
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
            className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-2xl animate-slide-up"
          >
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="px-4 py-3 grid grid-cols-4 gap-3">
              {/* Document */}
              <button
                type="button"
                data-ocid="chat.attach.document.button"
                onClick={() => {
                  setShowAttachSheet(false);
                  docInputRef.current?.click();
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-13 h-13 w-[52px] h-[52px] bg-purple-600 rounded-2xl flex items-center justify-center">
                  <File className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] text-foreground">Document</span>
              </button>

              {/* Camera */}
              <button
                type="button"
                data-ocid="chat.attach.camera.button"
                onClick={() => {
                  setShowAttachSheet(false);
                  setShowCameraModal(true);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-[52px] h-[52px] bg-red-500 rounded-2xl flex items-center justify-center">
                  <span className="text-[22px]">📷</span>
                </div>
                <span className="text-[11px] text-foreground">Camera</span>
              </button>

              {/* Gallery — opens file picker */}
              <button
                type="button"
                data-ocid="chat.attach.gallery.button"
                onClick={() => {
                  galleryInputRef.current?.click();
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-[52px] h-[52px] bg-blue-500 rounded-2xl flex items-center justify-center">
                  <span className="text-[22px]">🖼️</span>
                </div>
                <span className="text-[11px] text-foreground">Gallery</span>
              </button>

              {/* Audio */}
              <button
                type="button"
                data-ocid="chat.attach.audio.button"
                onClick={() => {
                  setShowAttachSheet(false);
                  audioInputRef.current?.click();
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-[52px] h-[52px] bg-orange-500 rounded-2xl flex items-center justify-center">
                  <span className="text-[22px]">🎵</span>
                </div>
                <span className="text-[11px] text-foreground">Audio</span>
              </button>

              {/* Catalogue */}
              <button
                type="button"
                data-ocid="chat.attach.catalogue.button"
                onClick={() => {
                  setShowAttachSheet(false);
                  setShowCatalogueSheet(true);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-[52px] h-[52px] bg-gray-600 rounded-2xl flex items-center justify-center">
                  <span className="text-[22px]">📦</span>
                </div>
                <span className="text-[11px] text-foreground">Catalogue</span>
              </button>

              {/* Quick Reply */}
              <button
                type="button"
                data-ocid="chat.attach.quickreply.button"
                onClick={() => {
                  setShowAttachSheet(false);
                  setShowQuickRepliesSheet(true);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-[52px] h-[52px] bg-yellow-500 rounded-2xl flex items-center justify-center">
                  <span className="text-[22px]">⚡</span>
                </div>
                <span className="text-[11px] text-foreground">Quick Reply</span>
              </button>

              {/* Location */}
              <button
                type="button"
                data-ocid="chat.attach.location.button"
                onClick={() => {
                  setShowAttachSheet(false);
                  setShowLocationSheet(true);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-[52px] h-[52px] bg-green-600 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] text-foreground">Location</span>
              </button>

              {/* Contact */}
              <button
                type="button"
                data-ocid="chat.attach.contact.button"
                onClick={() => {
                  setShowAttachSheet(false);
                  setShowContactShareModal(true);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-[52px] h-[52px] bg-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="text-[22px]">👤</span>
                </div>
                <span className="text-[11px] text-foreground">Contact</span>
              </button>

              {/* Poll */}
              <button
                type="button"
                data-ocid="chat.attach.poll.button"
                onClick={() => {
                  setShowAttachSheet(false);
                  setShowPollCreation(true);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-[52px] h-[52px] bg-orange-600 rounded-2xl flex items-center justify-center">
                  <span className="text-[22px]">📊</span>
                </div>
                <span className="text-[11px] text-foreground">Poll</span>
              </button>

              {/* Marketplace */}
              <button
                type="button"
                data-ocid="chat.attach.marketplace.button"
                onClick={() => {
                  setShowAttachSheet(false);
                  setShowMarketplace(true);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-[52px] h-[52px] bg-green-700 rounded-2xl flex items-center justify-center">
                  <span className="text-[22px]">🛍️</span>
                </div>
                <span className="text-[11px] text-foreground">Marketplace</span>
              </button>

              {/* Event */}
              <button
                type="button"
                data-ocid="chat.attach.event.button"
                onClick={() => {
                  setShowAttachSheet(false);
                  setShowEventSheet(true);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-[52px] h-[52px] bg-red-600 rounded-2xl flex items-center justify-center">
                  <span className="text-[22px]">📅</span>
                </div>
                <span className="text-[11px] text-foreground">Event</span>
              </button>

              {/* Share UPI QR */}
              <button
                type="button"
                data-ocid="chat.attach.upi.button"
                onClick={() => {
                  setShowAttachSheet(false);
                  setShowUPISheet(true);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-[52px] h-[52px] bg-indigo-600 rounded-2xl flex items-center justify-center">
                  <span className="text-[22px]">💳</span>
                </div>
                <span className="text-[11px] text-foreground">
                  Share UPI QR
                </span>
              </button>

              {/* Live Location */}
              <button
                type="button"
                data-ocid="chat.attach.location.button"
                onClick={() => {
                  setShowAttachSheet(false);
                  // Send location bubble
                  const locMsg: ExtChatMessage = {
                    id: `loc_${Date.now()}`,
                    content: "📍 Live Location · Sharing for 15 minutes",
                    isSent: true,
                    time: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    reactions: [],
                    imageUrl: undefined,
                  };
                  setLocalMessages((p) => [...p, locMsg]);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-[52px] h-[52px] bg-green-600 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] text-foreground">Location</span>
              </button>

              {/* Schedule Message */}
              <button
                type="button"
                data-ocid="chat.attach.schedule.button"
                onClick={() => {
                  setShowAttachSheet(false);
                  setShowScheduleModal(true);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-[52px] h-[52px] bg-teal-600 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] text-foreground">Schedule</span>
              </button>

              {/* Cancel */}
              <button
                type="button"
                data-ocid="chat.attach.cancel.button"
                onClick={() => setShowAttachSheet(false)}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-[52px] h-[52px] bg-muted rounded-2xl flex items-center justify-center">
                  <X className="w-6 h-6 text-muted-foreground" />
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Cancel
                </span>
              </button>
            </div>

            <div style={{ height: "env(safe-area-inset-bottom, 12px)" }} />
          </div>
        </>
      )}

      {/* Quick replies panel */}
      <QuickRepliesPanel
        open={showQuickRepliesPanel}
        onClose={() => setShowQuickRepliesPanel(false)}
        onSelect={(text) => setInputText(text)}
      />

      {/* Photo Viewer */}
      {photoViewerOpen &&
        (() => {
          const images: PhotoViewerImage[] = localMessages
            .filter(
              (m) => m.type === "image" && m.imageUrl && !m.deletedForEveryone,
            )
            .map((m) => ({
              id: m.id,
              url: m.imageUrl as string,
              caption: m.content !== "Photo" ? m.content : undefined,
            }));
          return (
            <PhotoViewer
              images={images}
              initialIndex={Math.max(0, photoViewerIndex)}
              onClose={() => setPhotoViewerOpen(false)}
            />
          );
        })()}
      {showLiveLocation && (
        <LiveLocationModal onClose={() => setShowLiveLocation(false)} />
      )}
      {showLiveStream && (
        <LiveStreamModal
          onClose={() => setShowLiveStream(false)}
          isHost={true}
          hostName={isGroupChat ? "You" : contactName}
        />
      )}
      {showMarketplace && (
        <MarketplaceScreen
          onBack={() => setShowMarketplace(false)}
          onSendProductCard={(name, price) => {
            sendMsg(`🛍️ ${name} — ₹${price.toLocaleString()}
[Order via Marketplace]`);
          }}
        />
      )}
      {browserUrl && (
        <InAppBrowser url={browserUrl} onClose={() => setBrowserUrl(null)} />
      )}

      {/* Message context menu */}
      {contextMsg && (
        <MessageContextMenu
          message={contextMsg}
          onClose={() => setContextMsg(null)}
          onReply={handleReply}
          onCopy={handleCopy}
          onForward={(msg) => handleForward(msg)}
          onDelete={handleDelete}
          onDeleteForEveryone={handleDeleteForEveryone}
          onReact={handleReact}
          onPin={(msg) => {
            setPinnedMessage(msg);
            setPinnedDismissed(false);
            setPinnedMsgs((prev) => {
              const exists = prev.find((m) => m.id === msg.id);
              if (exists) return prev;
              const updated = [...prev, msg].slice(-3);
              setPinnedIdx(updated.length - 1);
              return updated;
            });
            setContextMsg(null);
            toast.success("Message pinned");
          }}
          onTranslate={(msg) => {
            const FAKE_TRANSLATIONS: Record<string, string> = {
              "Hey, are you coming to the meeting tomorrow?":
                "Hola, ¿vendrás a la reunión mañana?",
              "Good morning everyone!": "¡Buenos días a todos!",
            };
            const keys = Object.keys(FAKE_TRANSLATIONS);
            const translated =
              FAKE_TRANSLATIONS[msg.content] ??
              `[ES] ${msg.content.slice(0, 60)}${msg.content.length > 60 ? "..." : ""}`;
            void keys;
            setTranslatedMsgs((prev) => ({ ...prev, [msg.id]: translated }));
            setContextMsg(null);
            toast.success("Message translated");
          }}
          onStar={(msg) => {
            setLocalMessages((prev) =>
              prev.map((m) =>
                m.id === msg.id ? { ...m, starred: !m.starred } : m,
              ),
            );
            setContextMsg(null);
            toast.success(
              msg.starred ? "Message unstarred" : "Message starred",
            );
          }}
          onEdit={(msg) => {
            handleEdit(msg);
          }}
        />
      )}

      {/* Forward message sheet */}
      <ForwardMessageSheet
        open={showForwardSheet}
        messageContent={forwardMsg?.content ?? ""}
        onClose={() => {
          setShowForwardSheet(false);
          setForwardMsg(null);
        }}
        onForward={() => {
          setShowForwardSheet(false);
          setForwardMsg(null);
        }}
      />

      {/* Poll creation modal */}
      <PollCreationModal
        open={showPollCreation}
        onClose={() => setShowPollCreation(false)}
        onCreatePoll={(question, options) => {
          const pollText = `📊 Poll: ${question}\n${options.map((o, i) => `${i + 1}. ${o}`).join("\n")}`;
          sendMsg(pollText);
          setShowPollCreation(false);
        }}
      />

      {/* Contact share modal */}
      <ContactShareModal
        open={showContactShareModal}
        onClose={() => setShowContactShareModal(false)}
        onShare={(contact) => {
          sendMsg(`👤 Contact: ${contact.name}\n📞 ${contact.phone}`);
          setShowContactShareModal(false);
        }}
      />

      {/* Schedule Message Modal */}
      <ScheduleMessageModal
        open={showScheduleModal || editingScheduledId !== null}
        onClose={() => {
          setShowScheduleModal(false);
          setEditingScheduledId(null);
        }}
        messageText={inputText}
        editMsg={
          editingScheduledId !== null
            ? ((scheduledMsgs.find((m) => m.id === editingScheduledId) as
                | ScheduledMsg
                | undefined) ?? null)
            : null
        }
        onEditSave={(id, text, dt, recurring) => {
          setScheduledMsgs((prev) =>
            prev.map((m) => (m.id === id ? { ...m, text, dt, recurring } : m)),
          );
          setEditingScheduledId(null);
        }}
        onSchedule={(text, dt, recurring) => {
          setScheduledMsgs((prev) => [
            ...prev,
            { id: Date.now(), text, dt, recurring: recurring ?? "none" },
          ]);
          setInputText("");
        }}
      />

      {/* Reactors sheet */}
      {showReactorsSheet && reactorsTarget && (
        <Sheet open={showReactorsSheet} onOpenChange={setShowReactorsSheet}>
          <SheetContent
            side="bottom"
            className="rounded-t-3xl px-0 pb-8 pt-4 max-h-[70vh] flex flex-col"
            data-ocid="chat.reactors.sheet"
          >
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-2" />
            <SheetHeader className="px-5 mb-2">
              <SheetTitle className="text-[17px] font-bold">
                Reactions
              </SheetTitle>
            </SheetHeader>
            {reactorsTarget.reactions && reactorsTarget.reactions.length > 0 ? (
              (() => {
                const counts: Record<string, number> = {};
                for (const r of reactorsTarget.reactions)
                  counts[r] = (counts[r] || 0) + 1;
                const emojis = Object.keys(counts);
                const MOCK_NAMES = [
                  "Alice",
                  "Bob",
                  "Carol",
                  "Dave",
                  "Eve",
                  "Frank",
                  "Grace",
                ];
                return (
                  <Tabs
                    defaultValue="all"
                    className="flex-1 flex flex-col min-h-0"
                  >
                    <TabsList
                      className="mx-5 h-9 bg-muted/50 mb-2 flex-shrink-0"
                      data-ocid="chat.reactors.tab"
                    >
                      <TabsTrigger
                        value="all"
                        className="text-[12px] h-7 flex-1 data-[state=active]:bg-[#00a884] data-[state=active]:text-white"
                      >
                        All {reactorsTarget.reactions.length}
                      </TabsTrigger>
                      {emojis.map((emoji) => (
                        <TabsTrigger
                          key={emoji}
                          value={emoji}
                          className="text-[12px] h-7 flex-1 data-[state=active]:bg-[#00a884] data-[state=active]:text-white"
                        >
                          {emoji} {counts[emoji]}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsContent
                      value="all"
                      className="flex-1 overflow-y-auto px-5"
                    >
                      <div className="space-y-1">
                        {reactorsTarget.reactions.map((emoji, i) => (
                          <div
                            // biome-ignore lint/suspicious/noArrayIndexKey: reaction ordering
                            key={`reactor-all-${i}`}
                            className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
                            data-ocid={`chat.reactors.item.${i + 1}`}
                          >
                            <div className="w-9 h-9 rounded-full bg-[#00a884]/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-[13px] font-bold text-[#00a884]">
                                {MOCK_NAMES[i % MOCK_NAMES.length][0]}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-[14px] font-semibold text-foreground">
                                {MOCK_NAMES[i % MOCK_NAMES.length]}
                              </p>
                            </div>
                            <span className="text-[22px] reaction-pop">
                              {emoji}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    {emojis.map((emoji) => (
                      <TabsContent
                        key={emoji}
                        value={emoji}
                        className="flex-1 overflow-y-auto px-5"
                      >
                        <div className="space-y-1">
                          {reactorsTarget
                            .reactions!.filter((r) => r === emoji)
                            .map((_, i) => (
                              <div
                                // biome-ignore lint/suspicious/noArrayIndexKey: reaction ordering
                                key={`reactor-${emoji}-${i}`}
                                className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
                              >
                                <div className="w-9 h-9 rounded-full bg-[#00a884]/20 flex items-center justify-center flex-shrink-0">
                                  <span className="text-[13px] font-bold text-[#00a884]">
                                    {MOCK_NAMES[i % MOCK_NAMES.length][0]}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-[14px] font-semibold text-foreground">
                                    {MOCK_NAMES[i % MOCK_NAMES.length]}
                                  </p>
                                </div>
                                <span className="text-[22px]">{emoji}</span>
                              </div>
                            ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                );
              })()
            ) : (
              <p className="text-[14px] text-muted-foreground text-center py-8 px-5">
                No reactions yet
              </p>
            )}
          </SheetContent>
        </Sheet>
      )}

      {/* Stage 25: Enhanced Message Info sheet */}
      <AnimatePresence>
        {readReceiptMsg && (
          <motion.div
            key="msg-info-overlay"
            className="absolute inset-0 z-50 flex flex-col justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setReadReceiptMsg(null)}
              role="button"
              tabIndex={-1}
              aria-label="Close"
              onKeyDown={(e) => e.key === "Escape" && setReadReceiptMsg(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="relative bg-background rounded-t-2xl shadow-2xl z-10 max-h-[75vh] flex flex-col"
              data-ocid="chat.read_receipt.sheet"
            >
              {/* Handle + header */}
              <div className="flex items-center px-4 pt-3 pb-3 border-b border-border/40">
                <button
                  type="button"
                  data-ocid="chat.read_receipt.close_button"
                  onClick={() => setReadReceiptMsg(null)}
                  className="p-1.5 -ml-1 rounded-full hover:bg-muted transition-colors mr-3"
                  aria-label="Close message info"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
                <h3 className="text-[16px] font-bold text-foreground flex-1">
                  Message Info
                </h3>
              </div>
              {/* Message preview */}
              <div className="mx-4 mt-3 mb-4 bg-muted/50 rounded-xl px-4 py-3 border border-border/30">
                <p className="text-[13px] text-foreground leading-snug line-clamp-3">
                  {readReceiptMsg.content}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[10px] text-muted-foreground">
                    {readReceiptMsg.time}
                  </span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                </div>
              </div>
              {/* Scrollable info sections */}
              <div className="overflow-y-auto flex-1 px-4 pb-6">
                {/* Read by */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCheck className="w-4 h-4 text-[#53bdeb]" />
                    <span className="text-[13px] font-semibold text-[#53bdeb] uppercase tracking-wide">
                      Read
                    </span>
                  </div>
                  {[
                    {
                      name: contactName,
                      initials: contactInitials,
                      colorIndex,
                      time: readReceiptMsg.time,
                    },
                  ].map((p, i) => (
                    <div
                      key={p.name}
                      className="flex items-center gap-3 py-2.5 border-b border-border/20 last:border-0"
                      data-ocid={`chat.read_receipt.item.${i + 1}`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0"
                        style={{
                          background: `hsl(${(p.colorIndex * 47) % 360}, 65%, 45%)`,
                        }}
                      >
                        {p.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-foreground truncate">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Today, {p.time}
                        </p>
                      </div>
                      <CheckCheck className="w-4 h-4 text-[#53bdeb] flex-shrink-0" />
                    </div>
                  ))}
                </div>
                {/* Delivered to */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCheck className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Delivered
                    </span>
                  </div>
                  {[
                    {
                      name: contactName,
                      initials: contactInitials,
                      colorIndex,
                      time: readReceiptMsg.time,
                    },
                  ].map((p, i) => (
                    <div
                      key={p.name}
                      className="flex items-center gap-3 py-2.5 border-b border-border/20 last:border-0"
                      data-ocid={`chat.delivered_receipt.item.${i + 1}`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0"
                        style={{
                          background: `hsl(${(p.colorIndex * 47) % 360}, 65%, 45%)`,
                        }}
                      >
                        {p.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-foreground truncate">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Today, {p.time}
                        </p>
                      </div>
                      <CheckCheck className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 25: Floating Multi-select Toolbar */}
      <AnimatePresence>
        {multiSelectMode && (
          <motion.div
            key="multiselect-toolbar"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 38 }}
            className="absolute bottom-0 left-0 right-0 z-[70] pointer-events-none"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <div
              className="mx-3 mb-3 bg-[#1F2C34] rounded-2xl shadow-2xl border border-white/10 pointer-events-auto overflow-hidden"
              data-ocid="chat.multiselect.toolbar"
            >
              {/* Count badge row */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <span className="text-white text-[13px] font-semibold">
                  {selectedMsgIds.size} selected
                </span>
                <button
                  type="button"
                  data-ocid="chat.multiselect.deselect_button"
                  onClick={() => setSelectedMsgIds(new Set())}
                  className="text-[#25D366] text-[12px] font-medium"
                >
                  Deselect all
                </button>
              </div>
              {/* Action icons row */}
              <div className="flex items-center justify-around px-2 py-3">
                <button
                  type="button"
                  data-ocid="chat.multiselect.reply_button"
                  onClick={() => {
                    toast.success("Reply to selected message");
                    exitMultiSelect();
                  }}
                  className="flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-40"
                  disabled={selectedMsgIds.size !== 1}
                >
                  <Reply className="w-5 h-5 text-white" />
                  <span className="text-[10px] text-white/70">Reply</span>
                </button>
                <button
                  type="button"
                  data-ocid="chat.multiselect.forward_button"
                  onClick={() => {
                    toast.success(
                      `${selectedMsgIds.size} message(s) forwarded`,
                    );
                    exitMultiSelect();
                  }}
                  className="flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-40"
                  disabled={selectedMsgIds.size === 0}
                >
                  <svg
                    className="w-5 h-5 text-white fill-white"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 8V4l8 8-8 8v-4H4V8h8z" />
                  </svg>
                  <span className="text-[10px] text-white/70">Forward</span>
                </button>
                <button
                  type="button"
                  data-ocid="chat.multiselect.star_button"
                  onClick={() => {
                    toast.success(`${selectedMsgIds.size} message(s) starred`);
                    exitMultiSelect();
                  }}
                  className="flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-40"
                  disabled={selectedMsgIds.size === 0}
                >
                  <Star className="w-5 h-5 text-white" />
                  <span className="text-[10px] text-white/70">Star</span>
                </button>
                <button
                  type="button"
                  data-ocid="chat.multiselect.copy_button"
                  onClick={() => {
                    const texts = [...selectedMsgIds]
                      .map((id) => {
                        const m = localMessages.find((x) => x.id === id);
                        return m?.content ?? "";
                      })
                      .filter(Boolean)
                      .join("\n");
                    navigator.clipboard?.writeText(texts).catch(() => {});
                    toast.success("Copied to clipboard");
                    exitMultiSelect();
                  }}
                  className="flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-40"
                  disabled={selectedMsgIds.size === 0}
                >
                  <Copy className="w-5 h-5 text-white" />
                  <span className="text-[10px] text-white/70">Copy</span>
                </button>
                <button
                  type="button"
                  data-ocid="chat.multiselect.delete_button"
                  onClick={() => {
                    setLocalMessages((prev) =>
                      prev.filter((m) => !selectedMsgIds.has(m.id)),
                    );
                    toast.success(`${selectedMsgIds.size} message(s) deleted`);
                    exitMultiSelect();
                  }}
                  className="flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-40"
                  disabled={selectedMsgIds.size === 0}
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <span className="text-[10px] text-red-400/80">Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 25: Floating Multi-select Toolbar */}
      <AnimatePresence>
        {multiSelectMode && (
          <motion.div
            key="multiselect-toolbar"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 38 }}
            className="absolute bottom-0 left-0 right-0 z-[70] pointer-events-none"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <div
              className="mx-3 mb-3 bg-[#1F2C34] rounded-2xl shadow-2xl border border-white/10 pointer-events-auto overflow-hidden"
              data-ocid="chat.multiselect.toolbar"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <span className="text-white text-[13px] font-semibold">
                  {selectedMsgIds.size} selected
                </span>
                <button
                  type="button"
                  data-ocid="chat.multiselect.deselect_button"
                  onClick={() => setSelectedMsgIds(new Set())}
                  className="text-[#25D366] text-[12px] font-medium"
                >
                  Deselect all
                </button>
              </div>
              <div className="flex items-center justify-around px-2 py-3">
                <button
                  type="button"
                  data-ocid="chat.multiselect.reply_button"
                  onClick={() => {
                    toast.success("Reply to selected message");
                    exitMultiSelect();
                  }}
                  disabled={selectedMsgIds.size !== 1}
                  className="flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-40"
                >
                  <Reply className="w-5 h-5 text-white" />
                  <span className="text-[10px] text-white/70">Reply</span>
                </button>
                <button
                  type="button"
                  data-ocid="chat.multiselect.forward_button"
                  onClick={() => {
                    toast.success(
                      `${selectedMsgIds.size} message(s) forwarded`,
                    );
                    exitMultiSelect();
                  }}
                  disabled={selectedMsgIds.size === 0}
                  className="flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-40"
                >
                  <svg
                    className="w-5 h-5 fill-white"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 8V4l8 8-8 8v-4H4V8h8z" />
                  </svg>
                  <span className="text-[10px] text-white/70">Forward</span>
                </button>
                <button
                  type="button"
                  data-ocid="chat.multiselect.star_button"
                  onClick={() => {
                    toast.success(`${selectedMsgIds.size} message(s) starred`);
                    exitMultiSelect();
                  }}
                  disabled={selectedMsgIds.size === 0}
                  className="flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-40"
                >
                  <Star className="w-5 h-5 text-white" />
                  <span className="text-[10px] text-white/70">Star</span>
                </button>
                <button
                  type="button"
                  data-ocid="chat.multiselect.copy_button"
                  onClick={() => {
                    const texts = [...selectedMsgIds]
                      .map((id) => {
                        const m = localMessages.find((x) => x.id === id);
                        return m?.content ?? "";
                      })
                      .filter(Boolean)
                      .join("\n");
                    navigator.clipboard?.writeText(texts).catch(() => {});
                    toast.success("Copied to clipboard");
                    exitMultiSelect();
                  }}
                  disabled={selectedMsgIds.size === 0}
                  className="flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-40"
                >
                  <Copy className="w-5 h-5 text-white" />
                  <span className="text-[10px] text-white/70">Copy</span>
                </button>
                <button
                  type="button"
                  data-ocid="chat.multiselect.delete_button"
                  onClick={() => {
                    setLocalMessages((prev) =>
                      prev.filter((m) => !selectedMsgIds.has(m.id)),
                    );
                    toast.success(`${selectedMsgIds.size} message(s) deleted`);
                    exitMultiSelect();
                  }}
                  disabled={selectedMsgIds.size === 0}
                  className="flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-40"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <span className="text-[10px] text-red-400/80">Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file inputs */}
      <input
        ref={docInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.xlsx,.ppt,.pptx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const kb = Math.round(file.size / 1024);
          const sizeStr =
            kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
          sendMsg(`📄 ${file.name} · ${sizeStr}`);
          e.target.value = "";
        }}
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          sendMsg(`🎵 ${file.name}`);
          e.target.value = "";
        }}
      />

      {/* Camera Modal */}
      <CameraModal
        open={showCameraModal}
        onClose={() => setShowCameraModal(false)}
      />

      {/* Mute Notifications Sheet */}
      <Sheet open={showMuteSheet} onOpenChange={setShowMuteSheet}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4"
          data-ocid="chat.mute.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[17px] font-bold">
              Mute notifications
            </SheetTitle>
          </SheetHeader>
          <RadioGroup
            value={selectedMuteOption}
            onValueChange={setSelectedMuteOption}
            className="space-y-3"
          >
            {(
              [
                ["8h", "8 hours"],
                ["1w", "1 week"],
                ["always", "Always"],
              ] as const
            ).map(([val, label]) => (
              <button
                type="button"
                key={val}
                className="flex items-center justify-between py-2 cursor-pointer w-full"
                onClick={() => setSelectedMuteOption(val)}
              >
                <span className="text-[15px] text-foreground">{label}</span>
                <RadioGroupItem value={val} />
              </button>
            ))}
          </RadioGroup>
          <Button
            data-ocid="chat.mute.confirm_button"
            className="w-full mt-5 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            onClick={() => {
              const labels: Record<string, string> = {
                "8h": "8 hours",
                "1w": "1 week",
                always: "always",
              };
              toast.success(
                `Notifications muted for ${labels[selectedMuteOption]}`,
              );
              setShowMuteSheet(false);
            }}
          >
            Mute
          </Button>
        </SheetContent>
      </Sheet>
      <Sheet
        open={showDisappearingSheet}
        onOpenChange={setShowDisappearingSheet}
      >
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4"
          data-ocid="chat.disappearing.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[17px] font-bold">
              Disappearing messages
            </SheetTitle>
          </SheetHeader>
          <p className="text-[13px] text-muted-foreground mb-4">
            Messages will disappear after the selected duration.
          </p>
          <RadioGroup
            value={selectedDisappearing}
            onValueChange={setSelectedDisappearing}
            className="space-y-3"
          >
            {(
              [
                ["off", "Off"],
                ["24h", "24 hours"],
                ["7d", "7 days"],
                ["90d", "90 days"],
              ] as const
            ).map(([val, label]) => (
              <button
                type="button"
                key={val}
                className="flex items-center justify-between py-2 cursor-pointer w-full"
                onClick={() => setSelectedDisappearing(val)}
              >
                <span className="text-[15px] text-foreground">{label}</span>
                <RadioGroupItem value={val} />
              </button>
            ))}
          </RadioGroup>
          <Button
            data-ocid="chat.disappearing.save_button"
            className="w-full mt-5 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            onClick={() => {
              const labels: Record<string, string> = {
                off: "off",
                "24h": "24 hours",
                "7d": "7 days",
                "90d": "90 days",
              };
              localStorage.setItem(
                `wa_disappear_${conversationId}`,
                selectedDisappearing,
              );
              toast.success(
                `Disappearing messages: ${labels[selectedDisappearing]}`,
              );
              setShowDisappearingSheet(false);
            }}
          >
            Save
          </Button>
        </SheetContent>
      </Sheet>
      <ChatThemeSheet
        open={showChatThemeSheet}
        onOpenChange={setShowChatThemeSheet}
        contactId={conversationId.toString()}
        theme={chatTheme}
        onThemeChange={setChatTheme}
      />

      <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <AlertDialogContent
          data-ocid="chat.export.dialog"
          className="max-w-[320px] rounded-2xl"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Export chat</AlertDialogTitle>
            <AlertDialogDescription>
              Choose how you want to export this chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction
              data-ocid="chat.export.without_media.button"
              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white w-full"
              onClick={() => {
                const lines = [
                  `WhatsApp Chat Export - ${contactName}`,
                  `Date: ${new Date().toLocaleDateString()}`,
                  "",
                  ...localMessages.map((m) => {
                    const sender = (m as ExtChatMessage).isSent
                      ? "You"
                      : contactName;
                    return `[${(m as ExtChatMessage).time}] ${sender}: ${m.content ?? ""}`;
                  }),
                ];
                const blob = new Blob([lines.join("\n")], {
                  type: "text/plain",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `chat_${contactName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.txt`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Chat exported");
                setShowExportDialog(false);
              }}
            >
              Export without media
            </AlertDialogAction>
            <AlertDialogAction
              data-ocid="chat.export.with_media.button"
              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white w-full"
              onClick={() => {
                toast.success("Chat exported with media");
                setShowExportDialog(false);
              }}
            >
              Include media
            </AlertDialogAction>
            <AlertDialogCancel
              data-ocid="chat.export.cancel_button"
              className="w-full"
            >
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <AlertDialogContent
          data-ocid="chat.report.dialog"
          className="max-w-[320px] rounded-2xl"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Report {contactName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will also block them and report the last 5 messages to
              WhatsApp.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="chat.report.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="chat.report.confirm_button"
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => {
                toast.success("Reported");
                setShowReportDialog(false);
              }}
            >
              Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent
          data-ocid="chat.block.dialog"
          className="max-w-[320px] rounded-2xl"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Block {contactName}?</AlertDialogTitle>
            <AlertDialogDescription>
              Blocked contacts will no longer be able to call you or send you
              messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="chat.block.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="chat.block.confirm_button"
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => {
                toast.success("Blocked");
                setShowBlockDialog(false);
              }}
            >
              Block
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Sheet open={showCatalogueSheet} onOpenChange={setShowCatalogueSheet}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4"
          data-ocid="chat.catalogue.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[17px] font-bold">
              Business Catalogue
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center py-8 gap-3">
            <span className="text-5xl">📦</span>
            <p className="text-[15px] font-semibold text-foreground">
              No products listed yet
            </p>
            <p className="text-[13px] text-muted-foreground text-center">
              Add products to share them with customers.
            </p>
            <Button
              data-ocid="chat.catalogue.add_button"
              className="mt-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            >
              Add Product
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet
        open={showQuickRepliesSheet}
        onOpenChange={setShowQuickRepliesSheet}
      >
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4"
          data-ocid="chat.quickreplies.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[17px] font-bold">
              Quick Replies
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-2">
            {[
              "Thanks for reaching out! How can we help you today?",
              "We'll get back to you shortly. Please hold on.",
              "Yes, we're open! Our hours are 9am–6pm Mon–Sat.",
            ].map((reply, i) => (
              <button
                key={reply}
                type="button"
                data-ocid={`chat.quickreplies.item.${i + 1}`}
                className="w-full text-left px-4 py-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                onClick={() => {
                  setInputText(reply);
                  setShowQuickRepliesSheet(false);
                }}
              >
                <p className="text-[14px] text-foreground">{reply}</p>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={showLocationSheet} onOpenChange={setShowLocationSheet}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4"
          data-ocid="chat.location.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[17px] font-bold">
              Share Location
            </SheetTitle>
          </SheetHeader>
          <div className="w-full h-40 bg-muted rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 20px,hsl(var(--foreground)) 20px,hsl(var(--foreground)) 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,hsl(var(--foreground)) 20px,hsl(var(--foreground)) 21px)",
              }}
            />
            <div className="flex flex-col items-center gap-1 z-10">
              <MapPin className="w-8 h-8 text-destructive" />
              <span className="text-[12px] text-muted-foreground font-semibold">
                Current Location
              </span>
            </div>
          </div>
          <p className="text-[14px] text-foreground font-semibold mb-1">
            📍 Mumbai, India
          </p>
          <p className="text-[12px] text-muted-foreground mb-4">
            Bandra West, Mumbai 400050
          </p>
          <Button
            data-ocid="chat.location.send_button"
            className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            onClick={() => {
              sendMsg("📍 Location: Bandra West, Mumbai 400050");
              setShowLocationSheet(false);
            }}
          >
            Send Location
          </Button>
        </SheetContent>
      </Sheet>
      <Sheet
        open={showShareContactSheet}
        onOpenChange={setShowShareContactSheet}
      >
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4"
          data-ocid="chat.sharecontact.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[17px] font-bold">
              Share Contact
            </SheetTitle>
          </SheetHeader>
          <RadioGroup
            value={selectedShareContact}
            onValueChange={setSelectedShareContact}
            className="space-y-1"
          >
            {[
              "Emma Rodriguez · +91 98765 43210",
              "Marcus Chen · +1 415 555 0182",
              "Priya Sharma · +91 99887 76655",
              "Jordan Williams · +44 7700 900123",
              "Sarah Johnson · +61 412 345 678",
            ].map((contact, i) => (
              <button
                type="button"
                key={contact}
                data-ocid={`chat.sharecontact.item.${i + 1}`}
                className="flex items-center justify-between py-2.5 px-2 cursor-pointer hover:bg-muted/40 rounded-xl w-full"
                onClick={() => setSelectedShareContact(contact)}
              >
                <span className="text-[14px] text-foreground">{contact}</span>
                <RadioGroupItem value={contact} />
              </button>
            ))}
          </RadioGroup>
          <Button
            data-ocid="chat.sharecontact.send_button"
            disabled={!selectedShareContact}
            className="w-full mt-4 bg-[#25D366] hover:bg-[#25D366]/90 text-white disabled:opacity-50"
            onClick={() => {
              if (!selectedShareContact) return;
              sendMsg(`👤 Contact: ${selectedShareContact}`);
              setShowShareContactSheet(false);
              setSelectedShareContact("");
            }}
          >
            Send Contact
          </Button>
        </SheetContent>
      </Sheet>
      <Sheet open={showPollSheet} onOpenChange={setShowPollSheet}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[85vh] overflow-y-auto"
          data-ocid="chat.poll.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[17px] font-bold">
              Create Poll
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-[13px] text-muted-foreground mb-1 block">
                Question
              </Label>
              <Input
                data-ocid="chat.poll.input"
                placeholder="Ask a question..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="bg-muted/50 border-0 rounded-xl"
              />
            </div>
            {pollOptions.map((opt, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: poll options ordered by index
              <div key={i}>
                <Label className="text-[13px] text-muted-foreground mb-1 block">
                  Option {i + 1}
                </Label>
                <Input
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) =>
                    setPollOptions((prev) =>
                      prev.map((o, idx) => (idx === i ? e.target.value : o)),
                    )
                  }
                  className="bg-muted/50 border-0 rounded-xl"
                />
              </div>
            ))}
            <button
              type="button"
              data-ocid="chat.poll.add_option.button"
              className="text-[#25D366] text-[14px] font-semibold py-1"
              onClick={() => setPollOptions((prev) => [...prev, ""])}
            >
              + Add option
            </button>
            <div className="flex items-center justify-between py-2">
              <Label className="text-[14px] text-foreground">
                Allow multiple answers
              </Label>
              <Switch
                data-ocid="chat.poll.multiple.switch"
                checked={pollMultipleAnswers}
                onCheckedChange={setPollMultipleAnswers}
              />
            </div>
          </div>
          <Button
            data-ocid="chat.poll.create_button"
            disabled={!pollQuestion.trim()}
            className="w-full mt-5 bg-[#25D366] hover:bg-[#25D366]/90 text-white disabled:opacity-50"
            onClick={() => {
              const opts = pollOptions.filter((o) => o.trim());
              sendMsg(
                `📊 Poll: ${pollQuestion}\n${opts.map((o, i) => `${i + 1}. ${o}`).join("\n")}`,
              );
              setShowPollSheet(false);
              setPollQuestion("");
              setPollOptions(["", ""]);
            }}
          >
            Create Poll
          </Button>
        </SheetContent>
      </Sheet>
      <Sheet open={showEventSheet} onOpenChange={setShowEventSheet}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[85vh] overflow-y-auto"
          data-ocid="chat.event.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[17px] font-bold">
              Create Event
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-[13px] text-muted-foreground mb-1 block">
                Event name
              </Label>
              <Input
                data-ocid="chat.event.name.input"
                placeholder="Event name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="bg-muted/50 border-0 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[13px] text-muted-foreground mb-1 block">
                  Date
                </Label>
                <Input
                  data-ocid="chat.event.date.input"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="bg-muted/50 border-0 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-[13px] text-muted-foreground mb-1 block">
                  Time
                </Label>
                <Input
                  data-ocid="chat.event.time.input"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="bg-muted/50 border-0 rounded-xl"
                />
              </div>
            </div>
            <div>
              <Label className="text-[13px] text-muted-foreground mb-1 block">
                Description (optional)
              </Label>
              <Textarea
                data-ocid="chat.event.desc.textarea"
                placeholder="Add a description..."
                value={eventDesc}
                onChange={(e) => setEventDesc(e.target.value)}
                className="bg-muted/50 border-0 rounded-xl resize-none"
                rows={3}
              />
            </div>
          </div>
          <Button
            data-ocid="chat.event.create_button"
            disabled={!eventName.trim()}
            className="w-full mt-5 bg-[#25D366] hover:bg-[#25D366]/90 text-white disabled:opacity-50"
            onClick={() => {
              sendMsg(
                `📅 Event: ${eventName} | ${eventDate} ${eventTime}${eventDesc ? ` | ${eventDesc}` : ""}`,
              );
              setShowEventSheet(false);
              setEventName("");
              setEventDate("");
              setEventTime("");
              setEventDesc("");
            }}
          >
            Create Event
          </Button>
        </SheetContent>
      </Sheet>
      <Sheet open={showUPISheet} onOpenChange={setShowUPISheet}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4"
          data-ocid="chat.upi.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[17px] font-bold">
              Share UPI QR Code
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="w-44 h-44 bg-white border-2 border-border rounded-2xl p-3 flex items-center justify-center">
              <div
                className="w-full h-full grid"
                style={{ gridTemplateColumns: "repeat(7,1fr)", gap: "2px" }}
              >
                {Array.from({ length: 49 }).map((_, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed QR grid
                    key={i}
                    className={`rounded-[1px] ${[0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41, 42, 43, 44, 45, 46, 47, 48, 10, 17, 24, 31].includes(i) ? "bg-gray-900" : "bg-transparent"}`}
                  />
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="text-[16px] font-bold text-foreground">
                user@paytm
              </p>
              <p className="text-[12px] text-muted-foreground">UPI ID</p>
            </div>
          </div>
          <Button
            data-ocid="chat.upi.share_button"
            className="w-full mt-5 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            onClick={() => {
              sendMsg("💳 UPI QR Code: user@paytm");
              setShowUPISheet(false);
            }}
          >
            Share QR Code
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
