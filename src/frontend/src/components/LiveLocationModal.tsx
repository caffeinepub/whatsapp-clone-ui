import { MapPin, Navigation, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface LiveLocationModalProps {
  onClose: () => void;
}

const MAP_COLORS = [
  "#4CAF50",
  "#66BB6A",
  "#81C784",
  "#A5D6A7",
  "#2E7D32",
  "#388E3C",
  "#43A047",
  "#4CAF50",
  "#1B5E20",
  "#256029",
  "#2E7D32",
  "#33691E",
  "#558B2F",
  "#689F38",
  "#7CB342",
  "#8BC34A",
  "#AED581",
  "#C5E1A5",
  "#DCEDC8",
  "#F1F8E9",
  "#3E2723",
  "#4E342E",
  "#5D4037",
  "#6D4C41",
  "#795548",
  "#8D6E63",
  "#A1887F",
  "#BCAAA4",
  "#D7CCC8",
  "#EFEBE9",
  "#78909C",
  "#90A4AE",
];

// Generate deterministic map grid
function getMapCell(row: number, col: number): string {
  const hash = (row * 7 + col * 13) % MAP_COLORS.length;
  return MAP_COLORS[hash];
}

export default function LiveLocationModal({ onClose }: LiveLocationModalProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <motion.div
      data-ocid="location.modal"
      className="absolute inset-0 z-50 flex flex-col bg-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-[#1F2C34] text-white flex-shrink-0"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
      >
        <button
          type="button"
          data-ocid="location.close_button"
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <p className="font-bold text-[16px]">Live Location</p>
          <p className="text-[11px] text-white/60">
            {minutes > 0 ? `${minutes}m ` : ""}
            {seconds}s sharing
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-green-500/20 rounded-full px-3 py-1">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[11px] text-green-400 font-semibold">LIVE</span>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative overflow-hidden">
        {/* CSS grid map */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: "repeat(8, 1fr)",
            gridTemplateRows: "repeat(10, 1fr)",
          }}
        >
          {Array.from({ length: 80 }).map((_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            return (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: deterministic map grid
                key={i}
                style={{ backgroundColor: getMapCell(row, col) }}
                className="opacity-80"
              />
            );
          })}
        </div>

        {/* Grid lines overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Roads simulation */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-0 right-0 h-[6px] bg-white/50" />
          <div className="absolute top-2/3 left-0 right-0 h-[4px] bg-white/40" />
          <div className="absolute left-1/3 top-0 bottom-0 w-[6px] bg-white/50" />
          <div className="absolute left-2/3 top-0 bottom-0 w-[4px] bg-white/40" />
        </div>

        {/* Center pin */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center">
            {/* Pulse ring */}
            <div className="absolute w-16 h-16 rounded-full bg-green-500/20 animate-ping" />
            <div className="absolute w-10 h-10 rounded-full bg-green-500/30" />
            {/* Pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-green-500 border-4 border-white shadow-xl flex items-center justify-center">
                <Navigation className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="w-0.5 h-4 bg-green-500" />
            </div>
          </div>
        </div>

        {/* Location card */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-card rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[14px] text-foreground">
                You are here
              </p>
              <p className="text-[11px] text-muted-foreground">
                Sharing live location
              </p>
            </div>
            <button
              type="button"
              data-ocid="location.stop_button"
              onClick={onClose}
              className="text-[12px] text-destructive font-semibold px-3 py-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
            >
              Stop
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
