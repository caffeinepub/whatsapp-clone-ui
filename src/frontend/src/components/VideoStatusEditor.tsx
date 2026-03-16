import { useRef, useState } from "react";
import { toast } from "sonner";

interface VideoStatusEditorProps {
  videoSrc: string;
  onPost: (result: {
    caption: string;
    filter: string;
    startPct: number;
    endPct: number;
  }) => void;
  onClose: () => void;
}

const FILTERS = [
  { id: "none", label: "None", style: {} },
  {
    id: "warm",
    label: "Warm",
    style: { filter: "sepia(0.4) saturate(1.6) brightness(1.05)" },
  },
  {
    id: "cool",
    label: "Cool",
    style: { filter: "hue-rotate(30deg) saturate(1.2) brightness(1.05)" },
  },
  { id: "bw", label: "B&W", style: { filter: "grayscale(1) contrast(1.1)" } },
  {
    id: "vivid",
    label: "Vivid",
    style: { filter: "saturate(2) contrast(1.1) brightness(1.05)" },
  },
];

const STICKERS = ["😂", "❤️", "🔥", "✨", "👀", "💯", "🎉", "🥳", "😍", "💪"];

export default function VideoStatusEditor({
  videoSrc,
  onPost,
  onClose,
}: VideoStatusEditorProps) {
  const [caption, setCaption] = useState("");
  const [filter, setFilter] = useState("none");
  const [startPct, setStartPct] = useState(0);
  const [endPct, setEndPct] = useState(100);
  const [showCaptionInput, setShowCaptionInput] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [overlayStickers, setOverlayStickers] = useState<
    { id: number; emoji: string; x: number; y: number }[]
  >([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeFilter = FILTERS.find((f) => f.id === filter)?.style ?? {};

  const handlePost = () => {
    onPost({ caption, filter, startPct, endPct });
    toast.success("Status posted!");
    onClose();
  };

  const addSticker = (emoji: string) => {
    setOverlayStickers((prev) => [
      ...prev,
      {
        id: Date.now(),
        emoji,
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
      },
    ]);
    setShowStickers(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 absolute top-0 left-0 right-0 z-10">
        <button
          type="button"
          data-ocid="video_editor.close_button"
          onClick={onClose}
          className="text-white text-xl"
        >
          ✕
        </button>
        <span className="text-white font-semibold flex-1">
          Edit Video Status
        </span>
        <button
          type="button"
          data-ocid="video_editor.primary_button"
          onClick={handlePost}
          className="px-4 py-1.5 rounded-full bg-green-500 text-white text-sm font-semibold"
        >
          Post
        </button>
      </div>

      {/* Video preview */}
      <div className="flex-1 relative flex items-center justify-center">
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="max-h-full max-w-full object-contain"
          style={activeFilter}
        />
        {/* Sticker overlays */}
        {overlayStickers.map((s) => (
          <div
            key={s.id}
            className="absolute text-3xl pointer-events-none select-none"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: "translate(-50%,-50%)",
            }}
          >
            {s.emoji}
          </div>
        ))}
        {/* Caption overlay */}
        {caption && (
          <div className="absolute bottom-16 left-0 right-0 flex justify-center">
            <div className="bg-black/60 text-white text-sm px-4 py-2 rounded-xl max-w-[80%] text-center">
              {caption}
            </div>
          </div>
        )}
        {/* Caption input overlay */}
        {showCaptionInput && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-6">
            <div className="w-full space-y-3">
              <input
                data-ocid="video_editor.input"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add caption..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none text-center"
              />
              <button
                type="button"
                data-ocid="video_editor.save_button"
                onClick={() => setShowCaptionInput(false)}
                className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold text-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}
        {/* Sticker picker overlay */}
        {showStickers && (
          <div className="absolute bottom-24 left-0 right-0 flex justify-center">
            <div className="bg-card/90 backdrop-blur rounded-2xl p-3 flex flex-wrap gap-2 max-w-[280px] justify-center">
              {STICKERS.map((s) => (
                <button
                  type="button"
                  key={s}
                  data-ocid="video_editor.button"
                  onClick={() => addSticker(s)}
                  className="text-2xl p-1 rounded-lg hover:bg-white/10"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trim slider */}
      <div className="px-4 py-2 bg-black/80">
        <div className="text-white/60 text-xs mb-1">
          Trim: {startPct}% – {endPct}%
        </div>
        <div className="relative h-6 flex items-center">
          <div className="absolute left-0 right-0 h-1 bg-white/20 rounded-full" />
          <div
            className="absolute h-1 bg-green-500 rounded-full"
            style={{ left: `${startPct}%`, right: `${100 - endPct}%` }}
          />
          <input
            data-ocid="video_editor.input"
            type="range"
            min={0}
            max={endPct - 5}
            value={startPct}
            onChange={(e) => setStartPct(Number(e.target.value))}
            className="absolute w-full opacity-0 cursor-pointer h-6"
          />
          <input
            data-ocid="video_editor.input"
            type="range"
            min={startPct + 5}
            max={100}
            value={endPct}
            onChange={(e) => setEndPct(Number(e.target.value))}
            className="absolute w-full opacity-0 cursor-pointer h-6"
          />
          <div
            className="absolute w-4 h-4 rounded-full bg-white shadow"
            style={{ left: `${startPct}%`, transform: "translateX(-50%)" }}
          />
          <div
            className="absolute w-4 h-4 rounded-full bg-white shadow"
            style={{ left: `${endPct}%`, transform: "translateX(-50%)" }}
          />
        </div>
      </div>

      {/* Filter strip */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto bg-black/80">
        {FILTERS.map((f) => (
          <button
            type="button"
            key={f.id}
            data-ocid="video_editor.toggle"
            onClick={() => setFilter(f.id)}
            className={"flex-shrink-0 flex flex-col items-center gap-1 px-2"}
          >
            <div
              className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-colors ${
                filter === f.id ? "border-green-400" : "border-transparent"
              }`}
              style={f.style}
            >
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-500" />
            </div>
            <span
              className={`text-[10px] ${filter === f.id ? "text-green-400" : "text-white/60"}`}
            >
              {f.label}
            </span>
          </button>
        ))}
      </div>

      {/* Bottom toolbar */}
      <div className="flex items-center justify-around px-4 py-3 bg-black/90 border-t border-white/10">
        <button
          type="button"
          data-ocid="video_editor.button"
          onClick={() => {
            setShowCaptionInput(true);
            setShowStickers(false);
          }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-white text-xl">T</span>
          <span className="text-white/60 text-[10px]">Caption</span>
        </button>
        <button
          type="button"
          data-ocid="video_editor.button"
          onClick={() => {
            setShowStickers(true);
            setShowCaptionInput(false);
          }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-xl">😊</span>
          <span className="text-white/60 text-[10px]">Sticker</span>
        </button>
        <button
          type="button"
          data-ocid="video_editor.delete_button"
          onClick={() => setOverlayStickers([])}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-white text-xl">🗑</span>
          <span className="text-white/60 text-[10px]">Clear</span>
        </button>
        <button
          type="button"
          data-ocid="video_editor.button"
          onClick={() => {
            if (videoRef.current)
              videoRef.current.playbackRate =
                videoRef.current.playbackRate === 1 ? 2 : 1;
          }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-white text-xl">⚡</span>
          <span className="text-white/60 text-[10px]">Speed</span>
        </button>
      </div>
    </div>
  );
}
