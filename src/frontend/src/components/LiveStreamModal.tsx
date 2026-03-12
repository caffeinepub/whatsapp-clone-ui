import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const MOCK_VIEWERS = [
  "@alex",
  "@priya",
  "@marcus",
  "@jordan",
  "@emma",
  "@ryan",
  "@sofia",
  "@liam",
];
const MOCK_COMMENTS = [
  "🔥 This is amazing!",
  "❤️ Love this stream!",
  "👏 Keep going!",
  "😂 hahaha",
  "🎉 Congrats!",
  "💯 Facts!",
  "😮 Wow!",
  "🙌 Let's gooo!",
];

interface LiveComment {
  id: number;
  viewer: string;
  text: string;
}

interface Props {
  onClose: () => void;
  isHost?: boolean;
  hostName?: string;
}

export default function LiveStreamModal({
  onClose,
  isHost = true,
  hostName = "You",
}: Props) {
  const [viewers, setViewers] = useState(12);
  const [comments, setComments] = useState<LiveComment[]>([
    { id: 1, viewer: "@alex", text: "Just joined! 🎉" },
    { id: 2, viewer: "@priya", text: "🔥 Go live!" },
    { id: 3, viewer: "@marcus", text: "Let's goooo! 💯" },
  ]);
  const [reactions, setReactions] = useState<
    { id: number; emoji: string; x: number }[]
  >([]);
  const [muted, setMuted] = useState(false);
  const commentEndRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(10);

  useEffect(() => {
    const commentInterval = setInterval(() => {
      const viewer =
        MOCK_VIEWERS[Math.floor(Math.random() * MOCK_VIEWERS.length)];
      const text =
        MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)];
      setComments((prev) => [
        ...prev.slice(-20),
        { id: nextId.current++, viewer, text },
      ]);
      setViewers((v) => v + (Math.random() > 0.6 ? 1 : 0));
    }, 2000);
    return () => clearInterval(commentInterval);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll trigger on new comment
  useEffect(() => {
    commentEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  const sendReaction = (emoji: string) => {
    const x = 20 + Math.random() * 60;
    const id = nextId.current++;
    setReactions((prev) => [...prev, { id, emoji, x }]);
    setTimeout(
      () => setReactions((prev) => prev.filter((r) => r.id !== id)),
      2000,
    );
  };

  return (
    <div
      className="absolute inset-0 z-50 bg-black flex flex-col"
      data-ocid="livestream.modal"
    >
      {/* Video area */}
      <div className="relative flex-1 bg-gradient-to-b from-[#0d0d0d] to-[#1a0a2e] flex items-center justify-center overflow-hidden">
        {/* Host avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center border-4 border-white/20 shadow-2xl">
            <span className="text-4xl">🎙️</span>
          </div>
          <p className="text-white font-bold text-[17px]">{hostName}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white/80 text-[13px]">LIVE STREAM</span>
          </div>
        </div>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-safe pt-4">
          <button
            type="button"
            data-ocid="livestream.close.button"
            onClick={onClose}
            className="w-9 h-9 bg-black/50 rounded-full flex items-center justify-center text-white text-lg"
          >
            ✕
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-red-600 px-3 py-1 rounded-full flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white font-bold text-[13px]">LIVE</span>
            </div>
            <div className="bg-black/60 px-3 py-1 rounded-full flex items-center gap-1">
              <span className="text-white text-[13px]">👁 {viewers}</span>
            </div>
          </div>
        </div>

        {/* Floating reactions */}
        {reactions.map((r) => (
          <div
            key={r.id}
            className="absolute bottom-24 text-3xl animate-bounce pointer-events-none"
            style={{
              left: `${r.x}%`,
              animation: "floatUp 2s ease-out forwards",
            }}
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Comments */}
      <div className="h-36 overflow-y-auto px-4 py-2 bg-black/80">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-2 mb-1">
            <span className="text-purple-400 text-[12px] font-semibold shrink-0">
              {c.viewer}
            </span>
            <span className="text-white/90 text-[12px]">{c.text}</span>
          </div>
        ))}
        <div ref={commentEndRef} />
      </div>

      {/* Bottom controls */}
      <div className="bg-black px-4 py-3 pb-safe">
        {/* Emoji reactions */}
        <div className="flex items-center justify-center gap-4 mb-3">
          {["❤️", "🔥", "😂", "👏", "🎉"].map((emoji) => (
            <button
              key={emoji}
              type="button"
              data-ocid="livestream.reaction.button"
              onClick={() => sendReaction(emoji)}
              className="text-2xl hover:scale-125 active:scale-95 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>

        {isHost && (
          <div className="flex gap-3">
            <button
              type="button"
              data-ocid="livestream.mute.button"
              onClick={() => {
                setMuted((m) => !m);
                toast.success(muted ? "Unmuted" : "Muted all viewers");
              }}
              className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold transition-colors ${
                muted ? "bg-yellow-600 text-white" : "bg-white/10 text-white"
              }`}
            >
              {muted ? "🔇 Unmute All" : "🔇 Mute All"}
            </button>
            <button
              type="button"
              data-ocid="livestream.end.button"
              onClick={() => {
                toast.success(`Stream ended — ${viewers} viewers watched`);
                onClose();
              }}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[14px] font-semibold transition-colors"
            >
              🔴 End Stream
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-120px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
