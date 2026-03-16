import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Smile } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StatusEditScreenProps {
  imageUrl: string;
  onBack: () => void;
  onSent: () => void;
}

const FILTERS = [
  { id: "normal", label: "Normal", style: "none" },
  {
    id: "warm",
    label: "Warm",
    style: "sepia(0.4) saturate(1.4) brightness(1.05)",
  },
  {
    id: "cool",
    label: "Cool",
    style: "hue-rotate(200deg) saturate(1.2) brightness(1.05)",
  },
  { id: "bw", label: "B&W", style: "grayscale(1) contrast(1.1)" },
  {
    id: "fade",
    label: "Fade",
    style: "opacity(0.85) saturate(0.6) brightness(1.15)",
  },
  { id: "vivid", label: "Vivid", style: "saturate(2) contrast(1.1)" },
];

export default function StatusEditScreen({
  imageUrl,
  onBack,
  onSent,
}: StatusEditScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState("normal");
  const [caption, setCaption] = useState("");

  const currentFilter = FILTERS.find((f) => f.id === selectedFilter);

  const handleSend = () => {
    const statusData = {
      imageUrl,
      caption: caption.trim(),
      filter: selectedFilter,
      timestamp: Date.now(),
      likes: [] as string[],
      comments: [] as { name: string; text: string }[],
      views: [] as string[],
    };
    localStorage.setItem("wa_own_status", JSON.stringify(statusData));
    toast.success("Status posted!", { position: "top-center" });
    onSent();
  };

  return (
    <div
      className="fixed inset-0 z-[200] bg-black flex flex-col"
      data-ocid="status.edit.panel"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 z-10">
        <button
          type="button"
          data-ocid="status.edit.close_button"
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <p className="text-white font-semibold text-[15px]">My Status</p>
        <button
          type="button"
          data-ocid="status.edit.send.button"
          onClick={handleSend}
          className="w-11 h-11 rounded-full bg-wa-green flex items-center justify-center shadow-lg"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Image Preview */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt="Status preview"
          className="max-w-full max-h-full object-contain"
          style={{
            filter:
              currentFilter?.style !== "none"
                ? currentFilter?.style
                : undefined,
          }}
        />
      </div>

      {/* Filter row */}
      <div className="flex gap-3 overflow-x-auto px-4 py-3 bg-black/60">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            data-ocid={`status.edit.filter.${f.id}.button`}
            onClick={() => setSelectedFilter(f.id)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div
              className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                selectedFilter === f.id
                  ? "border-wa-green scale-110"
                  : "border-white/30"
              }`}
            >
              <img
                src={imageUrl}
                alt={f.label}
                className="w-full h-full object-cover"
                style={{ filter: f.style !== "none" ? f.style : undefined }}
              />
            </div>
            <span
              className={`text-[10px] font-medium ${
                selectedFilter === f.id ? "text-wa-green" : "text-white/70"
              }`}
            >
              {f.label}
            </span>
          </button>
        ))}
      </div>

      {/* Caption input */}
      <div
        className="flex items-center gap-2 px-4 py-3 bg-black/80"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 12px)" }}
      >
        <button type="button" className="text-white/70" aria-label="Emoji">
          <Smile className="w-5 h-5" />
        </button>
        <input
          type="text"
          data-ocid="status.edit.caption.input"
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="flex-1 bg-white/10 text-white placeholder:text-white/50 rounded-full px-4 py-2 text-[14px] outline-none border-none"
        />
      </div>
    </div>
  );
}
