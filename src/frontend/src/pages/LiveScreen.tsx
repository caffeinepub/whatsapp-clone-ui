import { Heart, MoreVertical, Send, Users, Video, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const LIVE_STREAMS = [
  {
    id: 1,
    host: "Emma Rodriguez",
    initials: "ER",
    title: "Sunday Morning Yoga 🧘‍♀️",
    viewers: 1420,
    category: "Fitness",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #fb923c 60%, #fbbf24 100%)",
  },
  {
    id: 2,
    host: "DJ Marcus",
    initials: "DM",
    title: "Live Beat Session 🎛️🔥",
    viewers: 3890,
    category: "Music",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #0f172a 100%)",
  },
  {
    id: 3,
    host: "ChefRita Kitchen",
    initials: "CR",
    title: "Cooking Biryani LIVE 🍛✨",
    viewers: 2100,
    category: "Food",
    gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 60%, #052e16 100%)",
  },
  {
    id: 4,
    host: "TechVikas",
    initials: "TV",
    title: "Building an App Live 💻⚡",
    viewers: 894,
    category: "Tech",
    gradient: "linear-gradient(135deg, #a855f7 0%, #3b82f6 60%, #1e1b4b 100%)",
  },
  {
    id: 5,
    host: "Mia Dance",
    initials: "MD",
    title: "Dance Workshop: Bollywood 💃",
    viewers: 5320,
    category: "Dance",
    gradient: "linear-gradient(135deg, #e879f9 0%, #c084fc 60%, #4c1d95 100%)",
  },
];

const SEED_CHAT_MESSAGES = [
  {
    id: 1,
    user: "Ananya",
    initials: "AN",
    text: "This is so good!! 🔥",
    time: "now",
  },
  {
    id: 2,
    user: "Rohit",
    initials: "RK",
    text: "Loving this vibe 😍",
    time: "now",
  },
  { id: 3, user: "Priya", initials: "PS", text: "Keep it going!", time: "now" },
  {
    id: 4,
    user: "Dev",
    initials: "DP",
    text: "First time watching 👋",
    time: "now",
  },
  { id: 5, user: "Sara", initials: "SA", text: "❤️❤️❤️", time: "now" },
];

const AUTO_MESSAGES = [
  "This is amazing! 😍",
  "Can you do it slower please?",
  "I've been waiting for this 🙌",
  "First time here, loving it!",
  "You're so talented! ✨",
  "Watching from Delhi! 🇮🇳",
  "This is exactly what I needed today",
  "❤️🔥💯",
  "Can you explain that again?",
  "Tutorial incoming? 👀",
];

const AUTO_USERS = [
  { user: "Karan", initials: "KA" },
  { user: "Nisha", initials: "NI" },
  { user: "Arjun", initials: "AR" },
  { user: "Meera", initials: "ME" },
  { user: "Vijay", initials: "VI" },
  { user: "Pooja", initials: "PO" },
];

function formatViewers(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function FloatingHeart({ id }: { id: number }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
      animate={{
        opacity: 0,
        y: -140,
        x: (Math.random() - 0.5) * 50,
        scale: 1.5,
      }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="absolute bottom-24 right-4 pointer-events-none text-2xl z-50"
    >
      ❤️
    </motion.div>
  );
}

function LiveViewer({
  stream,
  onClose,
}: {
  stream: (typeof LIVE_STREAMS)[0];
  onClose: () => void;
}) {
  const [messages, setMessages] = useState(SEED_CHAT_MESSAGES);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: number; user: string } | null>(
    null,
  );
  const [hearts, setHearts] = useState<number[]>([]);
  const [viewers, setViewers] = useState(stream.viewers);
  const [menuOpen, setMenuOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const heartIdRef = useRef(0);

  // Auto-scroll chat - biome-ignore: messages dep needed for scroll trigger
  // biome-ignore lint/correctness/useExhaustiveDependencies: messages dep is intentional for scroll trigger
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      const u = AUTO_USERS[Math.floor(Math.random() * AUTO_USERS.length)];
      const text =
        AUTO_MESSAGES[Math.floor(Math.random() * AUTO_MESSAGES.length)];
      setMessages((prev) => [
        ...prev.slice(-40),
        {
          id: Date.now(),
          user: u.user,
          initials: u.initials,
          text,
          time: "now",
        },
      ]);
      setViewers((v) => v + Math.floor(Math.random() * 3 - 1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const text = replyTo ? `@${replyTo.user} ${input.trim()}` : input.trim();
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "You", initials: "Y", text, time: "now" },
    ]);
    setInput("");
    setReplyTo(null);
  };

  const addHeart = () => {
    heartIdRef.current += 1;
    setHearts((prev) => [...prev, heartIdRef.current]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h !== heartIdRef.current));
    }, 1300);
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col"
      style={{ background: stream.gradient }}
      data-ocid="live.modal"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 z-10">
        <button
          type="button"
          data-ocid="live.close_button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-center gap-2">
          {/* Pulsing LIVE badge */}
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            className="flex items-center gap-1 bg-red-600 rounded-full px-3 py-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="text-white text-xs font-bold tracking-wide">
              LIVE
            </span>
          </motion.div>
          <div className="flex items-center gap-1 bg-black/30 rounded-full px-2 py-1">
            <Users className="w-3 h-3 text-white" />
            <span className="text-white text-xs font-medium">
              {formatViewers(viewers)}
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            data-ocid="live.dropdown_menu"
            onClick={() => setMenuOpen((m) => !m)}
            className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            <MoreVertical className="w-4 h-4 text-white" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -8 }}
                className="absolute right-0 top-full mt-1 bg-black/80 backdrop-blur-md rounded-xl overflow-hidden w-36 z-50"
              >
                {["Report stream", "Share stream"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    data-ocid="live.button"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-left px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Host info */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white text-sm font-bold border-2 border-white/50">
            {stream.initials}
          </div>
          <div>
            <div className="text-white font-bold text-sm">{stream.host}</div>
            <div className="text-white/70 text-xs">{stream.category}</div>
          </div>
        </div>
      </div>

      {/* Spacer — main "video" area */}
      <div className="flex-1 relative">
        {/* Title overlay */}
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl px-3 py-2 inline-block max-w-full">
            <span className="text-white font-semibold text-sm">
              {stream.title}
            </span>
          </div>
        </div>

        {/* Floating hearts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {hearts.map((h) => (
            <FloatingHeart key={h} id={h} />
          ))}
        </div>
      </div>

      {/* Chat panel */}
      <div
        className="flex flex-col"
        style={{
          height: "42%",
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto px-3 py-2 space-y-2"
          data-ocid="live.list"
        >
          {messages.map((msg, i) => (
            <button
              key={msg.id}
              type="button"
              data-ocid={`live.comment.item.${(i % 10) + 1}`}
              onClick={() => setReplyTo({ id: msg.id, user: msg.user })}
              className="flex items-start gap-2 w-full text-left hover:bg-white/5 rounded-lg px-1 py-0.5 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-white/25 flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold mt-0.5">
                {msg.initials}
              </div>
              <div className="min-w-0">
                <span className="text-white/70 text-xs font-semibold">
                  {msg.user}{" "}
                </span>
                <span className="text-white text-xs">{msg.text}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Reply indicator */}
        {replyTo && (
          <div className="mx-3 px-3 py-1.5 bg-white/10 rounded-lg flex items-center justify-between mb-1">
            <span className="text-white/60 text-xs">
              Replying to @{replyTo.user}
            </span>
            <button
              type="button"
              data-ocid="live.cancel_button"
              onClick={() => setReplyTo(null)}
            >
              <X className="w-3.5 h-3.5 text-white/50" />
            </button>
          </div>
        )}

        {/* Input row */}
        <div className="flex items-center gap-2 px-3 py-2 border-t border-white/10">
          <input
            type="text"
            data-ocid="live.input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Say something…"
            className="flex-1 bg-white/15 rounded-full px-4 py-2 text-white text-sm placeholder:text-white/40 outline-none"
          />
          {/* Heart */}
          <button
            type="button"
            data-ocid="live.toggle"
            onClick={addHeart}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"
          >
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
          </button>
          {/* Share */}
          <button
            type="button"
            data-ocid="live.primary_button"
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
          {/* Send chat */}
          <button
            type="button"
            data-ocid="live.submit_button"
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function LiveRequestModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Entertainment");

  const handleSend = () => {
    if (!title.trim()) {
      toast.error("Please add a title for your stream");
      return;
    }
    onClose();
    toast.success("Live request sent! You'll be notified when approved. 🎉");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm"
      data-ocid="live.dialog"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="w-full rounded-t-2xl p-6 space-y-4"
        style={{ background: "#1a1a1a" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Request to Go Live</h2>
          <button
            type="button"
            data-ocid="live.close_button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label
              htmlFor="live-stream-title"
              className="text-white/60 text-xs mb-1 block"
            >
              Stream Title *
            </label>
            <input
              id="live-stream-title"
              type="text"
              data-ocid="live.input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your stream about?"
              className="w-full bg-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none border border-white/10 focus:border-white/30 transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="live-desc"
              className="text-white/60 text-xs mb-1 block"
            >
              Description
            </label>
            <textarea
              id="live-desc"
              data-ocid="live.textarea"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Tell viewers what to expect…"
              rows={3}
              className="w-full bg-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none resize-none border border-white/10 focus:border-white/30 transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="live-category"
              className="text-white/60 text-xs mb-1 block"
            >
              Category
            </label>
            <select
              id="live-category"
              data-ocid="live.select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none border border-white/10 focus:border-white/30 transition-colors appearance-none"
            >
              {[
                "Entertainment",
                "Education",
                "Music",
                "Gaming",
                "Fitness",
                "Food",
                "Tech",
              ].map((c) => (
                <option key={c} value={c} style={{ background: "#1a1a1a" }}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            data-ocid="live.cancel_button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            data-ocid="live.submit_button"
            onClick={handleSend}
            className="flex-1 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: "linear-gradient(135deg, #ef4444, #f97316)" }}
          >
            Send Request
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LiveScreen() {
  const [activeStream, setActiveStream] = useState<
    (typeof LIVE_STREAMS)[0] | null
  >(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  return (
    <div
      className="flex flex-col h-full bg-[#0d0d0d] relative"
      data-ocid="live.page"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-white/10">
        <span
          className="text-white font-bold text-xl"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Live
        </span>
        <button
          type="button"
          data-ocid="live.open_modal_button"
          onClick={() => setRequestModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #ef4444, #f97316)" }}
        >
          <Video className="w-4 h-4" />
          Go Live
        </button>
      </div>

      {/* Live streams grid */}
      <div className="flex-1 overflow-y-auto" data-ocid="live.list">
        {/* Section label */}
        <div className="px-4 pt-4 pb-2">
          <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">
            Live Now
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 px-4 pb-24">
          {LIVE_STREAMS.map((stream, i) => (
            <button
              key={stream.id}
              type="button"
              data-ocid={`live.item.${i + 1}`}
              onClick={() => setActiveStream(stream)}
              className="relative rounded-2xl overflow-hidden text-left"
              style={{ aspectRatio: "9/16", background: stream.gradient }}
            >
              {/* LIVE badge */}
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-red-600 rounded-full px-2 py-0.5">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-white"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.2,
                  }}
                />
                <span className="text-white text-[10px] font-bold">LIVE</span>
              </div>

              {/* Viewer count */}
              <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/40 rounded-full px-2 py-0.5">
                <Users className="w-2.5 h-2.5 text-white" />
                <span className="text-white text-[10px] font-medium">
                  {formatViewers(stream.viewers)}
                </span>
              </div>

              {/* Host avatar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white text-lg font-bold border-2 border-white/50">
                  {stream.initials}
                </div>
              </div>

              {/* Bottom info */}
              <div
                className="absolute bottom-0 left-0 right-0 p-3"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
                }}
              >
                <div className="text-white font-bold text-xs truncate">
                  {stream.host}
                </div>
                <div className="text-white/70 text-[10px] truncate mt-0.5">
                  {stream.title}
                </div>
                <div className="mt-1 inline-block bg-white/20 rounded-full px-2 py-0.5">
                  <span className="text-white text-[9px] font-medium">
                    {stream.category}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live viewer overlay */}
      <AnimatePresence>
        {activeStream && (
          <LiveViewer
            stream={activeStream}
            onClose={() => setActiveStream(null)}
          />
        )}
      </AnimatePresence>

      {/* Live request modal */}
      <AnimatePresence>
        {requestModalOpen && (
          <LiveRequestModal onClose={() => setRequestModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
