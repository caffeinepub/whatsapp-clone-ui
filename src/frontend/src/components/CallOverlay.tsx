import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { ActiveCall } from "../hooks/useAppState";
import ContactAvatar from "./ContactAvatar";

interface CallOverlayProps {
  call: ActiveCall;
  onEnd: () => void;
}

type CallState = "ringing" | "connecting" | "connected";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function CallOverlay({ call, onEnd }: CallOverlayProps) {
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [callState, setCallState] = useState<CallState>("ringing");

  // Simulate ringing → connecting → connected
  useEffect(() => {
    const t1 = setTimeout(() => setCallState("connecting"), 2000);
    const t2 = setTimeout(() => setCallState("connected"), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Ringing tone using Web Audio API
  useEffect(() => {
    if (callState !== "ringing" && callState !== "connecting") return;
    let ctx: AudioContext | null = null;
    let stopped = false;
    const playRing = async () => {
      try {
        ctx = new AudioContext();
        const ring = async () => {
          if (stopped || !ctx) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.value = 440;
          gain.gain.value = 0.15;
          osc.start();
          await new Promise((r) => setTimeout(r, 1000));
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          osc.stop(ctx.currentTime + 0.1);
          if (!stopped) await new Promise((r) => setTimeout(r, 2000));
          if (!stopped) ring();
        };
        ring();
      } catch {}
    };
    playRing();
    return () => {
      stopped = true;
      ctx?.close();
    };
  }, [callState]);

  // Start timer when connected
  useEffect(() => {
    if (callState !== "connected") return;
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callState]);

  const handleEnd = useCallback(() => {
    onEnd();
  }, [onEnd]);

  const statusText =
    callState === "ringing"
      ? "Ringing..."
      : callState === "connecting"
        ? "Connecting..."
        : formatDuration(elapsed);

  return (
    <motion.div
      data-ocid="call.modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between py-16 px-6"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.22 0.04 220), oklch(0.12 0.02 240))",
      }}
    >
      {/* Call type label */}
      <div className="flex flex-col items-center gap-4 mt-8 w-full">
        <p className="text-white/60 text-sm font-medium tracking-widest uppercase">
          {call.kind === "video" ? "Video Call" : "Voice Call"}
        </p>

        {/* Ringing pulse ring animation */}
        <div className="relative">
          {callState === "ringing" && (
            <>
              <span className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping scale-125" />
              <span
                className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping scale-150"
                style={{ animationDelay: "0.5s" }}
              />
            </>
          )}
          <ContactAvatar
            initials={call.initials}
            size="lg"
            colorIndex={call.colorIndex}
          />
        </div>

        <div className="flex flex-col items-center gap-1 mt-2">
          <h2 className="text-white text-2xl font-bold font-display">
            {call.name}
          </h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={statusText}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-white/70 text-base font-mono tabular-nums"
            >
              {statusText}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-end justify-center gap-6 w-full">
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

      {/* Video controls (only for video calls) */}
      {call.kind === "video" && (
        <div className="absolute top-32 right-6 flex flex-col gap-3">
          <button
            type="button"
            data-ocid="call.video.toggle"
            onClick={() => setVideoOff((v) => !v)}
            aria-label={videoOff ? "Turn on camera" : "Turn off camera"}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
          >
            {videoOff ? (
              <CameraOff className="w-5 h-5 text-white" />
            ) : (
              <Camera className="w-5 h-5 text-white" />
            )}
          </button>
          <button
            type="button"
            data-ocid="call.camera.flip.button"
            aria-label="Flip camera"
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Accept/Decline for incoming calls */}
      {call.incoming && callState === "ringing" && (
        <div className="absolute bottom-16 left-0 right-0 flex items-center justify-center gap-16">
          <button
            type="button"
            data-ocid="call.decline.button"
            onClick={handleEnd}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center">
              <PhoneOff className="w-7 h-7 text-white" />
            </div>
            <span className="text-white/60 text-xs">Decline</span>
          </button>
          <button
            type="button"
            data-ocid="call.accept.button"
            onClick={() => setCallState("connected")}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <span className="text-white/60 text-xs">Accept</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}
