import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Message } from "../backend.d";
import ContactAvatar from "../components/ContactAvatar";
import type { ActiveCall } from "../hooks/useAppState";
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
}

function formatMessageTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const CURRENT_USER_ID = 0n;

// Seed messages for when backend returns empty
const SEED_CHAT_MESSAGES: Record<
  string,
  { content: string; isSent: boolean; time: string }[]
> = {
  "1": [
    { content: "Hey! How are you doing?", isSent: false, time: "10:30 AM" },
    {
      content: "I'm doing great, thanks! How about you?",
      isSent: true,
      time: "10:31 AM",
    },
    {
      content: "Pretty good! Working on a new project",
      isSent: false,
      time: "10:32 AM",
    },
    {
      content: "That sounds exciting! What kind of project?",
      isSent: true,
      time: "10:33 AM",
    },
    {
      content: "It's a mobile app for local farmers markets 🌱",
      isSent: false,
      time: "10:35 AM",
    },
    {
      content: "Oh wow, that's really cool! Love that idea",
      isSent: true,
      time: "10:36 AM",
    },
    {
      content: "Are we still meeting for coffee tomorrow?",
      isSent: false,
      time: "10:42 AM",
    },
  ],
  "2": [
    {
      content: "Morning everyone! Ready for the sprint review?",
      isSent: false,
      time: "9:00 AM",
    },
    {
      content: "Yes! I finished the user flows last night 🎉",
      isSent: true,
      time: "9:02 AM",
    },
    {
      content: "Great work! The stakeholders are going to love it",
      isSent: false,
      time: "9:05 AM",
    },
    {
      content: "I shared the new Figma mockups in the drive",
      isSent: false,
      time: "9:15 AM",
    },
  ],
  default: [
    { content: "Hello there!", isSent: false, time: "9:00 AM" },
    { content: "Hey! Good to hear from you", isSent: true, time: "9:01 AM" },
    { content: "How's everything going?", isSent: false, time: "9:02 AM" },
  ],
};

function MessageBubble({
  message,
  isSent,
}: {
  message?: Message;
  isSent: boolean;
  seedMsg?: { content: string; isSent: boolean; time: string };
}) {
  const content = message?.content ?? "";
  const time = message ? formatMessageTime(message.timestamp) : "";

  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`
          relative max-w-[75%] rounded-2xl px-3 py-2 shadow-bubble text-[14px]
          ${
            isSent
              ? "bg-wa-sent text-wa-sent-fg rounded-br-sm bubble-sent"
              : "bg-wa-received text-wa-received-fg rounded-bl-sm bubble-received"
          }
        `}
      >
        <p className="leading-snug break-words pr-8">{content}</p>
        <span className="absolute bottom-1.5 right-2 text-[10px] opacity-60 whitespace-nowrap">
          {time}
        </span>
      </div>
    </div>
  );
}

function SeedBubble({
  content,
  time,
  isSent,
}: {
  content: string;
  time: string;
  isSent: boolean;
}) {
  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`
          relative max-w-[75%] rounded-2xl px-3 py-2 shadow-bubble text-[14px]
          ${
            isSent
              ? "bg-wa-sent text-wa-sent-fg rounded-br-sm bubble-sent"
              : "bg-wa-received text-wa-received-fg rounded-bl-sm bubble-received"
          }
        `}
      >
        <p className="leading-snug break-words pr-8">{content}</p>
        <span className="absolute bottom-1.5 right-2 text-[10px] opacity-60 whitespace-nowrap">
          {time}
        </span>
      </div>
    </div>
  );
}

const SEED_COLOR_MAP: Record<string, number> = {
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 4,
  "5": 3,
  "6": 5,
};

export default function ChatViewScreen({
  conversationId,
  onBack,
  onOpenCall,
}: ChatViewScreenProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: messages, isLoading: messagesLoading } =
    useMessages(conversationId);
  const { data: conversations } = useConversations();
  const { data: contacts } = useContacts();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: markAsRead } = useMarkAsRead();

  // Find current conversation and contact
  const conversation = conversations?.find((c) => c.id === conversationId);
  const contact = contacts?.find((c) => c.id === conversation?.contactId);

  // Mark as read when opening
  useEffect(() => {
    markAsRead(conversationId);
  }, [conversationId, markAsRead]);

  // Scroll to bottom when messages load/change
  // biome-ignore lint/correctness/useExhaustiveDependencies: messagesEndRef is stable
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isSending) return;
    setInputText("");
    sendMessage(
      { conversationId, content: text },
      {
        onError: () => {
          toast.error("Failed to send message");
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const seedKey = conversationId.toString();
  const contactName = contact?.name ?? "Chat";
  const contactInitials = contact?.avatarInitials ?? "??";
  const colorIndex = SEED_COLOR_MAP[seedKey] ?? 0;

  const hasRealMessages = !messagesLoading && (messages?.length ?? 0) > 0;
  const seedMessages =
    SEED_CHAT_MESSAGES[seedKey] ?? SEED_CHAT_MESSAGES.default;

  return (
    <div className="flex flex-col h-full animate-slide-up">
      {/* Chat header */}
      <header className="bg-wa-header flex items-center gap-2 px-2 pt-12 pb-2 flex-shrink-0">
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
          <ContactAvatar
            initials={contactInitials}
            size="sm"
            colorIndex={colorIndex}
          />
          <div className="min-w-0">
            <p className="text-wa-header-fg font-semibold text-[15px] truncate font-display">
              {contactName}
            </p>
            <p className="text-wa-header-fg/60 text-[11px]">Online</p>
          </div>
        </button>

        <div className="flex items-center">
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
      </header>

      {/* Message area */}
      <main className="flex-1 overflow-y-auto wa-chat-bg px-3 py-3">
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
            <MessageBubble
              key={msg.id.toString()}
              message={msg}
              isSent={msg.senderId === CURRENT_USER_ID}
            />
          ))}

        {/* Seed messages when backend is empty */}
        {!messagesLoading &&
          !hasRealMessages &&
          seedMessages.map((msg) => (
            <SeedBubble
              key={`${msg.time}-${msg.content.slice(0, 10)}`}
              content={msg.content}
              time={msg.time}
              isSent={msg.isSent}
            />
          ))}

        <div ref={messagesEndRef} />
      </main>

      {/* Input bar */}
      <footer
        className="flex items-center gap-2 px-2 py-2 bg-card border-t border-border flex-shrink-0"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
      >
        <button
          type="button"
          data-ocid="chat.emoji.button"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
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
            data-ocid="chat.mic.button"
            className="w-10 h-10 bg-wa-green rounded-full flex items-center justify-center flex-shrink-0 hover:brightness-105 active:brightness-95 transition-all shadow-bubble"
            aria-label="Voice message"
          >
            <Mic className="w-5 h-5 text-white" />
          </button>
        )}
      </footer>
    </div>
  );
}
