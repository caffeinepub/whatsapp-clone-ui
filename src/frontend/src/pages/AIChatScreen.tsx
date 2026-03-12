import { ArrowLeft, Bot, Send, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

interface AIChatScreenProps {
  onBack: () => void;
}

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

const SUGGESTIONS = [
  { label: "Summarize", emoji: "📋" },
  { label: "Help me write", emoji: "✍️" },
  { label: "Translate", emoji: "🌐" },
  { label: "Plan my day", emoji: "📅" },
  { label: "Fun fact", emoji: "🤩" },
];

const AI_RESPONSES: Record<string, string> = {
  Summarize:
    "I can summarize any text for you! Just paste the content you want summarized and I'll give you a concise, clear summary.",
  "Help me write":
    "Sure! Tell me what you'd like to write — a message, email, caption, or anything else. I'll help you craft the perfect words.",
  Translate:
    "I can translate text between 50+ languages! Just paste your text and tell me which language you want it translated to.",
  "Plan my day":
    "Here's a productive daily plan:\n\n🌅 7:00 AM — Morning routine & breakfast\n💼 9:00 AM — Deep work block\n☕ 11:00 AM — Break\n🍽 1:00 PM — Lunch\n📋 2:00 PM — Meetings & emails\n🏃 5:00 PM — Exercise\n🌙 9:00 PM — Wind down",
  "Fun fact":
    "Did you know? 🤓 Honey never spoils — archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible!",
};

function getAIResponse(input: string): string {
  const key = SUGGESTIONS.find((s) =>
    input.toLowerCase().includes(s.label.toLowerCase()),
  );
  if (key) return AI_RESPONSES[key.label];
  return `That's a great question! As Meta AI, I'm here to help with anything — writing, research, translation, planning, and more. What would you like to explore further?`;
}

export default function AIChatScreen({ onBack }: AIChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "ai",
      text: "Hi! I'm Meta AI 👋 How can I help you today? Try one of the suggestions below or ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const msgIdRef = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: msgIdRef.current++, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: msgIdRef.current++,
        role: "ai",
        text: getAIResponse(text),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }, 1200);
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center gap-3 px-4 flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #7C3AED, #2563EB)",
          paddingTop: "max(env(safe-area-inset-top, 0px), 44px)",
          paddingBottom: "16px",
        }}
      >
        <button
          type="button"
          data-ocid="ai_chat.back_button"
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-[16px] leading-tight">
              Meta AI
            </p>
            <p className="text-white/70 text-[11px]">AI Assistant</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}
            >
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white rounded-br-sm"
                    : "bg-card border border-border text-foreground rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
            data-ocid="ai_chat.loading_state"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              data-ocid="ai_chat.suggestion.button"
              onClick={() => sendMessage(s.label)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-[13px] font-medium text-purple-400 hover:bg-purple-500/20 transition-colors"
            >
              <span>{s.emoji}</span>
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-card border-t border-border"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 12px)" }}
      >
        <input
          type="text"
          data-ocid="ai_chat.input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask Meta AI anything..."
          className="flex-1 bg-muted rounded-full px-4 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground outline-none border-none"
        />
        <button
          type="button"
          data-ocid="ai_chat.submit_button"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
