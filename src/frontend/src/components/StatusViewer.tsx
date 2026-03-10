import { Heart, MessageCircle, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ContactAvatar from "./ContactAvatar";

interface StatusItem {
  name: string;
  initials: string;
  time: string;
  colorIndex: number;
}

interface StatusViewerProps {
  statusList: StatusItem[];
  currentIndex: number;
  onClose: () => void;
}

const GRADIENT_PAIRS: [string, string][] = [
  ["oklch(0.55 0.18 160)", "oklch(0.38 0.14 200)"],
  ["oklch(0.55 0.18 260)", "oklch(0.38 0.14 290)"],
  ["oklch(0.55 0.22 30)", "oklch(0.42 0.16 60)"],
  ["oklch(0.45 0.18 320)", "oklch(0.32 0.14 340)"],
  ["oklch(0.5 0.2 180)", "oklch(0.36 0.16 210)"],
  ["oklch(0.5 0.18 80)", "oklch(0.38 0.14 100)"],
];

const MOCK_VIEWERS = [
  { name: "Alex Turner", time: "2 minutes ago", initials: "AT", colorIndex: 0 },
  { name: "Priya Sharma", time: "1 hour ago", initials: "PS", colorIndex: 4 },
  { name: "Marcus Chen", time: "3 hours ago", initials: "MC", colorIndex: 1 },
  {
    name: "Jordan Williams",
    time: "5 hours ago",
    initials: "JW",
    colorIndex: 3,
  },
  { name: "Emma Rodriguez", time: "Yesterday", initials: "ER", colorIndex: 2 },
];

export default function StatusViewer({
  statusList,
  currentIndex,
  onClose,
}: StatusViewerProps) {
  const [idx, setIdx] = useState(currentIndex);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Bottom toolbar state
  const [replyText, setReplyText] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(24);
  const [viewersOpen, setViewersOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({
    "❤️": 12,
    "👍": 8,
    "😂": 5,
    "😮": 3,
    "😢": 1,
    "🔥": 7,
  });

  const total = statusList.length;
  const current = statusList[idx];

  const closeWithFade = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 250);
  }, [onClose]);

  const goNext = useCallback(() => {
    if (idx < total - 1) {
      setIdx((p) => p + 1);
      setProgress(0);
    } else {
      closeWithFade();
    }
  }, [idx, total, closeWithFade]);

  const goPrev = useCallback(() => {
    if (idx > 0) {
      setIdx((p) => p - 1);
      setProgress(0);
    }
  }, [idx]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: idx drives the reset intentionally
  useEffect(() => {
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (paused) return;

    const DURATION = 5000;
    const TICK = 100;
    let elapsed = 0;

    intervalRef.current = setInterval(() => {
      elapsed += TICK;
      setProgress(Math.min((elapsed / DURATION) * 100, 100));
      if (elapsed >= DURATION) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        goNext();
      }
    }, TICK);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [idx, goNext, paused]);

  const handleLike = () => {
    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    setReplyText("");
  };

  const [from, to] =
    GRADIENT_PAIRS[(current.colorIndex ?? 0) % GRADIENT_PAIRS.length];

  if (!current) return null;

  return (
    <div
      data-ocid="status.modal"
      className={`fixed inset-0 z-50 flex flex-col transition-opacity duration-250 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
    >
      {/* Progress bars */}
      <div className="flex items-center gap-1 px-3 pt-4 pb-2 flex-shrink-0">
        {statusList.map((item, i) => (
          <div
            key={`prog-${item.name}`}
            className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden"
          >
            <div
              className="h-full bg-white rounded-full transition-none"
              style={{
                width: i < idx ? "100%" : i === idx ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Contact info row */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0">
        <ContactAvatar
          initials={current.initials}
          size="sm"
          colorIndex={current.colorIndex}
        />
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-[14px] truncate font-display">
            {current.name}
          </p>
          <p className="text-white/60 text-[11px]">{current.time}</p>
        </div>
        <button
          type="button"
          data-ocid="status.close_button"
          onClick={closeWithFade}
          aria-label="Close status viewer"
          className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tap zones (left / right) — only active when not interacting with bottom */}
      <div className="flex-1 flex">
        <button
          type="button"
          data-ocid="status.secondary_button"
          onClick={goPrev}
          aria-label="Previous status"
          className="w-1/3 h-full focus:outline-none"
        />
        <button
          type="button"
          data-ocid="status.primary_button"
          onClick={goNext}
          aria-label="Next status"
          className="flex-1 h-full focus:outline-none"
        />
      </div>

      {/* Status text content */}
      <div className="px-6 pb-2 flex-shrink-0">
        <p className="text-white/90 text-base text-center">
          {current.name}'s status update
        </p>
      </div>

      {/* Who Viewed indicator */}
      <button
        type="button"
        data-ocid="status.viewers.button"
        onClick={() => {
          setViewersOpen(true);
          setPaused(true);
        }}
        className="flex items-center justify-center gap-2 py-2 text-white/70 hover:text-white transition-colors"
      >
        <div className="flex -space-x-1">
          {MOCK_VIEWERS.slice(0, 3).map((v) => (
            <div
              key={v.name}
              className="w-5 h-5 rounded-full bg-white/30 border border-white/50 flex items-center justify-center text-[9px] text-white font-bold flex-shrink-0"
            >
              {v.initials[0]}
            </div>
          ))}
        </div>
        <span className="text-[12px]">
          Viewed by {MOCK_VIEWERS.length} people · Swipe up
        </span>
      </button>

      {/* Emoji reaction bar */}
      <div className="flex-shrink-0 px-4 pb-2 flex items-center justify-around">
        {["❤️", "👍", "😂", "😮", "😢", "🔥"].map((emoji) => (
          <button
            key={emoji}
            type="button"
            data-ocid="status.reaction.button"
            onClick={() => {
              setSelectedReaction((prev) => {
                const isDeselect = prev === emoji;
                setReactionCounts((c) => ({
                  ...c,
                  [emoji]: isDeselect
                    ? (c[emoji] || 1) - 1
                    : (c[emoji] || 0) + 1,
                  ...(prev && !isDeselect
                    ? { [prev]: (c[prev] || 1) - 1 }
                    : {}),
                }));
                return isDeselect ? null : emoji;
              });
            }}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
              selectedReaction === emoji
                ? "bg-white/20 scale-110"
                : "hover:bg-white/10"
            }`}
          >
            <span
              className={`text-[22px] transition-transform ${selectedReaction === emoji ? "scale-125" : ""}`}
            >
              {emoji}
            </span>
            <span className="text-[9px] text-white/70">
              {reactionCounts[emoji] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Bottom toolbar: reply + actions */}
      <div
        className="flex-shrink-0 px-3 pb-6 pt-2 flex items-center gap-2"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 24px)" }}
      >
        {/* Reply input */}
        <div className="flex-1 flex items-center bg-white/15 rounded-full px-3 py-2 gap-2">
          <input
            data-ocid="status.reply.input"
            type="text"
            placeholder={`Reply to ${current.name}…`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="flex-1 bg-transparent text-white text-[14px] placeholder:text-white/60 outline-none"
          />
          {replyText.trim() && (
            <button
              type="button"
              data-ocid="status.reply.submit_button"
              onClick={handleReply}
              className="text-white/80 hover:text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Like button */}
        <button
          type="button"
          data-ocid="status.like.button"
          onClick={handleLike}
          className="flex flex-col items-center gap-0.5"
        >
          <Heart
            className={`w-6 h-6 transition-all ${
              liked ? "fill-red-400 text-red-400 scale-110" : "text-white"
            }`}
          />
          <span className="text-[10px] text-white/70">{likeCount}</span>
        </button>

        {/* Comment button */}
        <button
          type="button"
          data-ocid="status.comment.button"
          onClick={() => setPaused((p) => !p)}
          className="flex flex-col items-center gap-0.5"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="text-[10px] text-white/70">12</span>
        </button>

        {/* Share button */}
        <button
          type="button"
          data-ocid="status.share.button"
          className="flex flex-col items-center gap-0.5"
        >
          <Send className="w-6 h-6 text-white" />
          <span className="text-[10px] text-white/70">Share</span>
        </button>
      </div>

      {/* Viewers bottom sheet */}
      {viewersOpen && (
        <div
          data-ocid="status.viewers.sheet"
          className="fixed inset-0 z-60 flex flex-col justify-end"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setViewersOpen(false);
              setPaused(false);
            }
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setViewersOpen(false);
              setPaused(false);
            }
          }}
        >
          <div className="bg-card rounded-t-3xl max-h-[70vh] flex flex-col shadow-2xl">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>
            <div className="px-4 pb-3 border-b border-border flex-shrink-0">
              <p className="text-[16px] font-semibold text-foreground">
                Viewed by {MOCK_VIEWERS.length}
              </p>
            </div>
            <div className="overflow-y-auto">
              {MOCK_VIEWERS.map((viewer) => (
                <div
                  key={viewer.name}
                  data-ocid="status.viewer.item.1"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
                >
                  <ContactAvatar
                    initials={viewer.initials}
                    size="md"
                    colorIndex={viewer.colorIndex}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px] text-foreground">
                      {viewer.name}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {viewer.time}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid="status.viewer.reply_button.1"
                    className="text-[12px] text-wa-green font-medium px-2 py-1 rounded-full hover:bg-wa-green/10 transition-colors"
                  >
                    Reply
                  </button>
                </div>
              ))}
            </div>
            <div
              className="py-4"
              style={{
                paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
