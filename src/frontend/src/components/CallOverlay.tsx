import { Mic, MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { ActiveCall } from "../hooks/useAppState";
import ContactAvatar from "./ContactAvatar";

interface CallOverlayProps {
  call: ActiveCall;
  onEnd: () => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function CallOverlay({ call, onEnd }: CallOverlayProps) {
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEnd = useCallback(() => {
    setVisible(false);
    setTimeout(onEnd, 300);
  }, [onEnd]);

  return (
    <div
      data-ocid="call.modal"
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-between py-16 px-6
        transition-opacity duration-300
        ${visible ? "opacity-100" : "opacity-0"}
      `}
      style={{
        background:
          "linear-gradient(160deg, oklch(0.22 0.04 220), oklch(0.12 0.02 240))",
      }}
    >
      {/* Top info */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <p className="text-white/60 text-sm font-medium tracking-widest uppercase">
          {call.kind === "video" ? "Video Call" : "Voice Call"}
        </p>
        <ContactAvatar
          initials={call.initials}
          size="lg"
          colorIndex={call.colorIndex}
        />
        <div className="flex flex-col items-center gap-1 mt-2">
          <h2 className="text-white text-2xl font-bold font-display">
            {call.name}
          </h2>
          <p className="text-white/70 text-base font-mono tabular-nums">
            {formatDuration(elapsed)}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-8">
        {/* Mute */}
        <button
          type="button"
          data-ocid="call.toggle"
          onClick={() => setMuted((v) => !v)}
          aria-label={muted ? "Unmute" : "Mute"}
          className="flex flex-col items-center gap-2"
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              muted ? "bg-white/30" : "bg-white/15 hover:bg-white/25"
            }`}
          >
            {muted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </div>
          <span className="text-white/60 text-xs">
            {muted ? "Unmute" : "Mute"}
          </span>
        </button>

        {/* End call */}
        <button
          type="button"
          data-ocid="call.delete_button"
          onClick={handleEnd}
          aria-label="End call"
          className="flex flex-col items-center gap-2"
        >
          <div className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 flex items-center justify-center shadow-lg transition-colors">
            <PhoneOff className="w-7 h-7 text-white" />
          </div>
          <span className="text-white/60 text-xs">End</span>
        </button>

        {/* Speaker */}
        <button
          type="button"
          data-ocid="call.secondary_button"
          onClick={() => setSpeakerOn((v) => !v)}
          aria-label={speakerOn ? "Speaker off" : "Speaker on"}
          className="flex flex-col items-center gap-2"
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              speakerOn ? "bg-white/30" : "bg-white/15 hover:bg-white/25"
            }`}
          >
            {speakerOn ? (
              <Volume2 className="w-6 h-6 text-white" />
            ) : (
              <VolumeX className="w-6 h-6 text-white" />
            )}
          </div>
          <span className="text-white/60 text-xs">
            {speakerOn ? "Speaker" : "Earpiece"}
          </span>
        </button>
      </div>
    </div>
  );
}
