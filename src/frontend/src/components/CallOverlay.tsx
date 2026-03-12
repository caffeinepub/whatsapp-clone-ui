import {
  Camera,
  CameraOff,
  Hand,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  RotateCcw,
  Volume2,
  VolumeX,
  ZapOff,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ActiveCall } from "../hooks/useAppState";
import ContactAvatar from "./ContactAvatar";

interface CallOverlayProps {
  call: ActiveCall;
  onEnd: () => void;
}

type CallState = "ringing" | "connecting" | "connected";

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const CALL_EMOJIS = ["❤️", "👍", "😂", "😮", "🔥", "👏"];

export default function CallOverlay({ call, onEnd }: CallOverlayProps) {
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [callState, setCallState] = useState<CallState>("ringing");
  const [handRaised, setHandRaised] = useState(false);
  const [blurBg, setBlurBg] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const emojiCounterRef = useRef(0);

  useEffect(() => {
    const t1 = setTimeout(() => setCallState("connecting"), 2000);
    const t2 = setTimeout(() => setCallState("connected"), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

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

  useEffect(() => {
    if (callState !== "connected") return;
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callState]);

  const sendEmoji = useCallback((emoji: string) => {
    const id = ++emojiCounterRef.current;
    const x = 20 + Math.random() * 60;
    setFloatingEmojis((prev) => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
    }, 2500);
  }, []);

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
      {/* Floating emoji reactions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {floatingEmojis.map((fe) => (
            <motion.span
              key={fe.id}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -200, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              className="absolute bottom-32 text-3xl"
              style={{ left: `${fe.x}%` }}
            >
              {fe.emoji}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Top section */}
      <div className="flex flex-col items-center gap-4 mt-8 w-full">
        <p className="text-white/60 text-sm font-medium tracking-widest uppercase">
          {call.kind === "video" ? "Video Call" : "Voice Call"}
        </p>

        {/* Avatar with pulse rings */}
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
          {/* Pulse ring when connected */}
          {callState === "connected" && (
            <motion.span
              className="absolute inset-[-8px] rounded-full border-2 border-green-400/30"
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.15, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          )}
          <div
            style={{
              filter: blurBg ? "blur(0px)" : "none",
              transition: "filter 0.4s",
            }}
          >
            <ContactAvatar
              initials={call.initials}
              size="lg"
              colorIndex={call.colorIndex}
            />
          </div>
          {blurBg && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backdropFilter: "blur(12px)",
                background: "rgba(0,0,0,0.4)",
              }}
            />
          )}
        </div>

        <div className="flex flex-col items-center gap-1 mt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-white text-2xl font-bold">{call.name}</h2>
            {handRaised && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xl"
              >
                ✋
              </motion.span>
            )}
          </div>
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

        {/* Emoji reaction bar */}
        {callState === "connected" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mt-1"
          >
            {CALL_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                data-ocid="call.emoji.button"
                onClick={() => sendEmoji(emoji)}
                className="text-xl active:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Side controls */}
      {callState === "connected" && (
        <div className="absolute top-32 right-4 flex flex-col gap-3">
          {/* Background blur */}
          <button
            type="button"
            data-ocid="call.blur.toggle"
            onClick={() => setBlurBg((v) => !v)}
            aria-label="Toggle background blur"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              blurBg ? "bg-white/30" : "bg-white/15"
            }`}
          >
            <ZapOff className="w-4 h-4 text-white" />
          </button>
          {/* Raise hand */}
          <button
            type="button"
            data-ocid="call.raise_hand.toggle"
            onClick={() => setHandRaised((v) => !v)}
            aria-label="Raise hand"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              handRaised ? "bg-yellow-400/60" : "bg-white/15"
            }`}
          >
            <Hand className="w-4 h-4 text-white" />
          </button>
          {/* Video toggle */}
          {call.kind === "video" && (
            <button
              type="button"
              data-ocid="call.video.toggle"
              onClick={() => setVideoOff((v) => !v)}
              className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"
            >
              {videoOff ? (
                <CameraOff className="w-4 h-4 text-white" />
              ) : (
                <Camera className="w-4 h-4 text-white" />
              )}
            </button>
          )}
          {call.kind === "video" && (
            <button
              type="button"
              data-ocid="call.camera.flip.button"
              className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      )}

      {/* Bottom action buttons */}
      <div className="flex items-end justify-center gap-6 w-full">
        <button
          type="button"
          data-ocid="call.toggle"
          onClick={() => setMuted((v) => !v)}
          className="flex flex-col items-center gap-2"
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              muted ? "bg-white/30" : "bg-white/15"
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

        <button
          type="button"
          data-ocid="call.delete_button"
          onClick={handleEnd}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg">
            <PhoneOff className="w-7 h-7 text-white" />
          </div>
          <span className="text-white/60 text-xs">End</span>
        </button>

        <button
          type="button"
          data-ocid="call.secondary_button"
          onClick={() => setSpeakerOn((v) => !v)}
          className="flex flex-col items-center gap-2"
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              speakerOn ? "bg-white/30" : "bg-white/15"
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

      {/* Incoming call accept/decline */}
      {call.incoming && callState === "ringing" && (
        <div className="absolute bottom-16 left-0 right-0 flex items-center justify-center gap-16">
          <button
            type="button"
            data-ocid="call.decline.button"
            onClick={handleEnd}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
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
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <span className="text-white/60 text-xs">Accept</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}
