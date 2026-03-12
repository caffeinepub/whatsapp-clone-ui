import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreVertical,
  Pause,
  Play,
  Send,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const REELS = [
  {
    id: 1,
    username: "@priya.creates",
    caption: "Golden hour vibes in Mumbai 🌅✨ Nothing beats this view!",
    likes: 24800,
    comments: 342,
    duration: "0:28",
    gradient: "linear-gradient(160deg, #f97316 0%, #ef4444 40%, #7c3aed 100%)",
    avatar: "PC",
  },
  {
    id: 2,
    username: "@marcus.beats",
    caption: "New track dropping this Friday 🎵🔥 Tag someone who needs this",
    likes: 51200,
    comments: 891,
    duration: "0:45",
    gradient: "linear-gradient(160deg, #0ea5e9 0%, #6366f1 50%, #0f172a 100%)",
    avatar: "MB",
  },
  {
    id: 3,
    username: "@chefrita",
    caption: "5-minute pasta recipe that will BLOW your mind 🍝👨‍🍳",
    likes: 89400,
    comments: 2100,
    duration: "1:02",
    gradient: "linear-gradient(160deg, #22c55e 0%, #16a34a 40%, #052e16 100%)",
    avatar: "CR",
  },
  {
    id: 4,
    username: "@sara.fitness",
    caption: "Morning routine for a productive day 💪 Save this for later!",
    likes: 33100,
    comments: 564,
    duration: "0:55",
    gradient: "linear-gradient(160deg, #f43f5e 0%, #fb923c 50%, #fbbf24 100%)",
    avatar: "SF",
  },
  {
    id: 5,
    username: "@travel.vikas",
    caption: "Hidden gems of Ladakh 🏔️❄️ Have you been here?",
    likes: 142000,
    comments: 3200,
    duration: "0:38",
    gradient: "linear-gradient(160deg, #38bdf8 0%, #818cf8 40%, #1e1b4b 100%)",
    avatar: "TV",
  },
  {
    id: 6,
    username: "@codewitharyan",
    caption: "Build a full-stack app in 60 seconds ⚡💻 #coding #webdev",
    likes: 28600,
    comments: 730,
    duration: "1:00",
    gradient: "linear-gradient(160deg, #a3e635 0%, #4ade80 40%, #064e3b 100%)",
    avatar: "CA",
  },
  {
    id: 7,
    username: "@mia.dance",
    caption: "This dance trend is taking over 💃🔥 Try it yourself!",
    likes: 97300,
    comments: 1847,
    duration: "0:22",
    gradient: "linear-gradient(160deg, #e879f9 0%, #c084fc 40%, #4c1d95 100%)",
    avatar: "MD",
  },
  {
    id: 8,
    username: "@naturelens",
    caption: "Monsoon magic in Kerala 🌿🌧️ Pure bliss!",
    likes: 61500,
    comments: 980,
    duration: "0:50",
    gradient: "linear-gradient(160deg, #2dd4bf 0%, #059669 40%, #042f2e 100%)",
    avatar: "NL",
  },
];

type CommentItem = {
  id: number;
  user: string;
  initials: string;
  text: string;
  time: string;
  likes: number;
  replies?: {
    id: number;
    user: string;
    initials: string;
    text: string;
    time: string;
  }[];
};

const DEFAULT_COMMENTS: CommentItem[] = [
  {
    id: 1,
    user: "Alex Johnson",
    initials: "AJ",
    text: "This is amazing! 🔥",
    time: "3m",
    likes: 22,
    replies: [],
  },
  {
    id: 2,
    user: "Zara Malik",
    initials: "ZM",
    text: "Loved this so much!",
    time: "7m",
    likes: 8,
    replies: [
      { id: 21, user: "User", initials: "U", text: "Same here!", time: "2m" },
    ],
  },
  {
    id: 3,
    user: "Dev Patel",
    initials: "DP",
    text: "Keep it up! ✨",
    time: "15m",
    likes: 5,
    replies: [],
  },
];

const MOCK_COMMENTS: Record<number, CommentItem[]> = {
  1: [
    {
      id: 1,
      user: "Ananya Singh",
      initials: "AS",
      text: "This is absolutely stunning! 😍",
      time: "2m",
      likes: 45,
      replies: [
        {
          id: 11,
          user: "priya.creates",
          initials: "PC",
          text: "Thank you so much! 🙏",
          time: "1m",
        },
      ],
    },
    {
      id: 2,
      user: "Rohit Kumar",
      initials: "RK",
      text: "Which location is this? Want to visit!",
      time: "5m",
      likes: 12,
      replies: [],
    },
    {
      id: 3,
      user: "Meera Nair",
      initials: "MN",
      text: "Golden hour always hits different 🌅",
      time: "8m",
      likes: 28,
      replies: [],
    },
  ],
};

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function ReelCard({
  reel,
  isActive,
  onComment,
}: {
  reel: (typeof REELS)[0];
  isActive: boolean;
  onComment: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isActive) {
      setPlaying(false);
      setProgress(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    setPlaying(true);
  }, [isActive]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setPlaying(false);
            return 100;
          }
          return p + 0.5;
        });
      }, 80);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  const menuItems = [
    "Report",
    "Not interested",
    "Save to collection",
    "Share to chat",
  ];

  return (
    <div
      className="relative w-full h-full flex-shrink-0 overflow-hidden"
      style={{ background: reel.gradient }}
    >
      {/* Tap to play/pause */}
      <button
        type="button"
        data-ocid="reel.canvas_target"
        className="absolute inset-0 w-full h-full z-10"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Pause" : "Play"}
      />

      {/* Play/pause icon */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            key="play-icon"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-30 px-3 pt-2">
        <div className="text-white text-[11px] font-medium mb-1 text-right opacity-80">
          {reel.duration}
        </div>
        <div className="h-0.5 w-full bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom overlay */}
      <div
        className="absolute bottom-0 left-0 right-14 z-30 p-4 pb-6"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold border border-white/40">
            {reel.avatar}
          </div>
          <span className="text-white font-semibold text-sm">
            {reel.username}
          </span>
          <button
            type="button"
            data-ocid="reel.secondary_button"
            className="ml-1 border border-white/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full hover:bg-white/20 transition-colors"
          >
            Follow
          </button>
        </div>
        <p className="text-white text-sm leading-snug line-clamp-2">
          {reel.caption}
        </p>
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-white/60 text-xs">🎵 Original Audio</span>
        </div>
      </div>

      {/* Right actions */}
      <div className="absolute right-3 bottom-20 z-30 flex flex-col items-center gap-5">
        {/* Like */}
        <button
          type="button"
          data-ocid="reel.toggle"
          onClick={(e) => {
            e.stopPropagation();
            setLiked((l) => !l);
          }}
          className="flex flex-col items-center gap-1"
        >
          <motion.div
            whileTap={{ scale: 1.4 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Heart
              className={`w-7 h-7 ${liked ? "fill-red-500 stroke-red-500" : "fill-white/20 stroke-white"}`}
            />
          </motion.div>
          <span className="text-white text-[11px] font-medium">
            {formatCount(reel.likes + (liked ? 1 : 0))}
          </span>
        </button>

        {/* Comment */}
        <button
          type="button"
          data-ocid="reel.open_modal_button"
          onClick={(e) => {
            e.stopPropagation();
            onComment();
          }}
          className="flex flex-col items-center gap-1"
        >
          <MessageCircle className="w-7 h-7 fill-white/20 stroke-white" />
          <span className="text-white text-[11px] font-medium">
            {formatCount(reel.comments)}
          </span>
        </button>

        {/* Share */}
        <button
          type="button"
          data-ocid="reel.primary_button"
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-1"
        >
          <Send className="w-6 h-6 stroke-white" />
          <span className="text-white text-[11px] font-medium">Share</span>
        </button>

        {/* Save */}
        <button
          type="button"
          data-ocid="reel.save_button"
          onClick={(e) => {
            e.stopPropagation();
            setSaved((s) => !s);
          }}
          className="flex flex-col items-center gap-1"
        >
          <Bookmark
            className={`w-6 h-6 ${saved ? "fill-yellow-400 stroke-yellow-400" : "stroke-white"}`}
          />
          <span className="text-white text-[11px] font-medium">
            {saved ? "Saved" : "Save"}
          </span>
        </button>

        {/* 3-dot */}
        <div className="relative">
          <button
            type="button"
            data-ocid="reel.dropdown_menu"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((m) => !m);
            }}
          >
            <MoreVertical className="w-6 h-6 stroke-white" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-full mr-2 bottom-0 bg-black/80 backdrop-blur-md rounded-xl overflow-hidden w-44 z-50"
              >
                {menuItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    data-ocid="reel.button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                    }}
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
    </div>
  );
}

function CommentsSheet({
  reelId,
  onClose,
}: {
  reelId: number;
  onClose: () => void;
}) {
  const comments: CommentItem[] = MOCK_COMMENTS[reelId] ?? DEFAULT_COMMENTS;
  const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({});
  const [replyingTo, setReplyingTo] = useState<{
    id: number;
    user: string;
  } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(
    new Set(),
  );
  const [input, setInput] = useState("");
  const [localComments, setLocalComments] = useState(comments);

  const handleSend = () => {
    if (!input.trim()) return;
    const newComment = {
      id: Date.now(),
      user: "You",
      initials: "Y",
      text: replyingTo ? `@${replyingTo.user} ${input.trim()}` : input.trim(),
      time: "Just now",
      likes: 0,
      replies: [],
    };
    setLocalComments((prev) => [newComment, ...prev]);
    setInput("");
    setReplyingTo(null);
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="absolute inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl overflow-hidden"
      style={{ height: "72%", background: "#1a1a1a" }}
      data-ocid="reel.sheet"
    >
      {/* Handle */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="w-8 h-1 bg-white/20 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
        <span className="text-white font-semibold text-base mt-1">
          Comments
        </span>
        <button
          type="button"
          data-ocid="reel.close_button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Comment list */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {localComments.map((c, idx) => (
          <div key={c.id} data-ocid={`reel.comment.item.${idx + 1}`}>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                {c.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-semibold text-sm">
                    {c.user}
                  </span>
                  <span className="text-white/40 text-xs">{c.time}</span>
                </div>
                <p className="text-white/90 text-sm mt-0.5">{c.text}</p>
                <div className="flex items-center gap-4 mt-1.5">
                  <button
                    type="button"
                    data-ocid="reel.toggle"
                    onClick={() =>
                      setCommentLikes((prev) => ({
                        ...prev,
                        [c.id]: !prev[c.id],
                      }))
                    }
                    className="flex items-center gap-1"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${commentLikes[c.id] ? "fill-red-500 stroke-red-500" : "stroke-white/50"}`}
                    />
                    <span className="text-white/50 text-xs">
                      {c.likes + (commentLikes[c.id] ? 1 : 0)}
                    </span>
                  </button>
                  <button
                    type="button"
                    data-ocid="reel.secondary_button"
                    onClick={() => setReplyingTo({ id: c.id, user: c.user })}
                    className="text-white/50 text-xs"
                  >
                    Reply
                  </button>
                  {(c.replies?.length ?? 0) > 0 && (
                    <button
                      type="button"
                      data-ocid="reel.toggle"
                      onClick={() =>
                        setExpandedReplies((prev) => {
                          const next = new Set(prev);
                          if (next.has(c.id)) next.delete(c.id);
                          else next.add(c.id);
                          return next;
                        })
                      }
                      className="text-blue-400 text-xs"
                    >
                      {expandedReplies.has(c.id)
                        ? "Hide"
                        : `View ${c.replies?.length} replies`}
                    </button>
                  )}
                </div>

                {/* Nested replies */}
                {expandedReplies.has(c.id) &&
                  c.replies &&
                  c.replies.length > 0 && (
                    <div className="mt-2 space-y-2 pl-2 border-l border-white/10">
                      {c.replies.map((r) => (
                        <div key={r.id} className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-white/15 flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold">
                            {r.initials}
                          </div>
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-white/80 font-semibold text-xs">
                                {r.user}
                              </span>
                              <span className="text-white/30 text-[10px]">
                                {r.time}
                              </span>
                            </div>
                            <p className="text-white/70 text-xs">{r.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      {replyingTo && (
        <div className="px-4 py-1 bg-white/5 flex items-center justify-between">
          <span className="text-white/60 text-xs">
            Replying to @{replyingTo.user}
          </span>
          <button
            type="button"
            data-ocid="reel.cancel_button"
            onClick={() => setReplyingTo(null)}
            className="text-white/50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <div className="px-4 py-3 flex items-center gap-3 border-t border-white/10">
        <input
          type="text"
          data-ocid="reel.input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            replyingTo ? `Reply to ${replyingTo.user}…` : "Add a comment…"
          }
          className="flex-1 bg-white/10 rounded-full px-4 py-2 text-white text-sm placeholder:text-white/40 outline-none"
        />
        <button
          type="button"
          data-ocid="reel.submit_button"
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center disabled:opacity-40 transition-opacity"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </motion.div>
  );
}

export default function ReelsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [commentReelId, setCommentReelId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    setCurrentIndex(idx);
  };

  return (
    <div className="flex flex-col h-full bg-black" data-ocid="reels.page">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 pt-3 pb-1 pointer-events-none">
        <span
          className="text-white font-bold text-xl"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}
        >
          Reels
        </span>
        <div className="flex gap-2 pointer-events-auto">
          <button
            type="button"
            data-ocid="reels.search_input"
            className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>

      {/* Vertical scroll reel feed */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory"
        style={{
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
        }}
        onScroll={handleScroll}
        data-ocid="reels.list"
      >
        {REELS.map((reel, i) => (
          <div
            key={reel.id}
            className="snap-start snap-always w-full flex-shrink-0 relative"
            style={{ height: "100dvh" }}
          >
            <ReelCard
              reel={reel}
              isActive={i === currentIndex}
              onComment={() => setCommentReelId(reel.id)}
            />
          </div>
        ))}
      </div>

      {/* Comment sheet */}
      <AnimatePresence>
        {commentReelId !== null && (
          <CommentsSheet
            reelId={commentReelId}
            onClose={() => setCommentReelId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
