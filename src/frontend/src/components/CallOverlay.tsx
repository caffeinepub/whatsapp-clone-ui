import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Camera,
  CameraOff,
  Hand,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Radio,
  RotateCcw,
  UserPlus,
  Volume2,
  VolumeX,
  ZapOff,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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

const MOCK_CONTACTS = [
  { name: "Alice Johnson", initials: "AJ", colorIndex: 0 },
  { name: "Bob Smith", initials: "BS", colorIndex: 1 },
  { name: "Carol Davis", initials: "CD", colorIndex: 2 },
  { name: "Dave Wilson", initials: "DW", colorIndex: 3 },
  { name: "Emma Brown", initials: "EB", colorIndex: 4 },
];

function SignalBars({ quality }: { quality: number }) {
  return (
    <div className="flex items-end gap-[2px]">
      {[1, 2, 3].map((bar) => (
        <div
          key={bar}
          className="rounded-[1px] transition-colors"
          style={{
            width: 4,
            height: bar * 6,
            background: bar <= quality ? "#4ade80" : "rgba(255,255,255,0.25)",
          }}
        />
      ))}
    </div>
  );
}

export default function CallOverlay({ call, onEnd }: CallOverlayProps) {
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [callState, setCallState] = useState<CallState>("ringing");
  const [handRaised, setHandRaised] = useState(false);
  const [blurBg, setBlurBg] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [recording, setRecording] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [callWaiting, setCallWaiting] = useState(false);
  const [callWaitingName] = useState("Priya Sharma");
  const [showPostCallModal, setShowPostCallModal] = useState(false);
  const [callNote, setCallNote] = useState("");
  const [signalQuality, setSignalQuality] = useState(3);
  const emojiCounterRef = useRef(0);

  useEffect(() => {
    const t1 = setTimeout(() => setCallState("connecting"), 2000);
    const t2 = setTimeout(() => setCallState("connected"), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Simulate call waiting after 10s
  useEffect(() => {
    if (callState !== "connected") return;
    const t = setTimeout(() => setCallWaiting(true), 10000);
    return () => clearTimeout(t);
  }, [callState]);

  // Simulate signal quality fluctuation
  useEffect(() => {
    if (callState !== "connected") return;
    const interval = setInterval(() => {
      setSignalQuality(Math.floor(Math.random() * 3) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [callState]);

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
    if (callState === "connected") {
      setShowPostCallModal(true);
    } else {
      onEnd();
    }
  }, [callState, onEnd]);

  const handleSaveNote = () => {
    if (callNote.trim()) {
      toast.success("Call note saved!");
    }
    setShowPostCallModal(false);
    setCallNote("");
    onEnd();
  };

  const handleAddParticipant = (name: string) => {
    if (!participants.includes(name)) {
      setParticipants((prev) => [...prev, name]);
      toast.success(`${name} added to call`);
    }
    setShowAddParticipant(false);
  };

  const statusText =
    callState === "ringing"
      ? "Ringing..."
      : callState === "connecting"
        ? "Connecting..."
        : formatDuration(elapsed);

  return (
    <>
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

        {/* Call waiting banner */}
        <AnimatePresence>
          {callWaiting && (
            <motion.div
              data-ocid="call.waiting.panel"
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="absolute top-0 left-0 right-0 z-10 bg-[#1a2b38] border-b border-white/10 flex items-center justify-between px-4 py-3"
              style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 14px)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-white text-[13px] font-semibold">
                    {callWaitingName}
                  </p>
                  <p className="text-white/50 text-[11px]">Incoming call...</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-ocid="call.waiting.decline_button"
                  onClick={() => setCallWaiting(false)}
                  className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"
                >
                  <PhoneOff className="w-3.5 h-3.5 text-white" />
                </button>
                <button
                  type="button"
                  data-ocid="call.waiting.accept_button"
                  onClick={() => {
                    setCallWaiting(false);
                    toast.success(`Switched to ${callWaitingName}`);
                  }}
                  className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center"
                >
                  <Phone className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            {participants.length > 0 && (
              <p className="text-white/50 text-[11px]">
                +{participants.length} participant
                {participants.length > 1 ? "s" : ""}
              </p>
            )}
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
            {/* Signal quality */}
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <SignalBars quality={signalQuality} />
            </div>
            {/* REC badge */}
            <button
              type="button"
              data-ocid="call.record.toggle"
              onClick={() => {
                setRecording((v) => !v);
                toast.success(
                  recording ? "Recording stopped" : "Recording started",
                );
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative ${recording ? "bg-red-500" : "bg-white/15"}`}
              aria-label="Record"
            >
              <Radio className="w-4 h-4 text-white" />
              {recording && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-bold px-1 rounded-full border border-background">
                  REC
                </span>
              )}
            </button>
            {/* Add participant */}
            <button
              type="button"
              data-ocid="call.add_participant.button"
              onClick={() => setShowAddParticipant(true)}
              className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"
              aria-label="Add participant"
            >
              <UserPlus className="w-4 h-4 text-white" />
            </button>
            {/* Background blur */}
            <button
              type="button"
              data-ocid="call.blur.toggle"
              onClick={() => setBlurBg((v) => !v)}
              aria-label="Toggle background blur"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${blurBg ? "bg-white/30" : "bg-white/15"}`}
            >
              <ZapOff className="w-4 h-4 text-white" />
            </button>
            {/* Raise hand */}
            <button
              type="button"
              data-ocid="call.raise_hand.toggle"
              onClick={() => setHandRaised((v) => !v)}
              aria-label="Raise hand"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${handRaised ? "bg-yellow-400/60" : "bg-white/15"}`}
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
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${muted ? "bg-white/30" : "bg-white/15"}`}
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
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${speakerOn ? "bg-white/30" : "bg-white/15"}`}
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

      {/* Add Participant Sheet */}
      <Sheet open={showAddParticipant} onOpenChange={setShowAddParticipant}>
        <SheetContent
          side="bottom"
          data-ocid="call.add_participant.sheet"
          className="rounded-t-3xl px-0 pb-8 pt-4"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="px-5 mb-4">
            <SheetTitle className="text-[17px] font-bold">
              Add to call
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-0">
            {MOCK_CONTACTS.map((c) => (
              <button
                key={c.name}
                type="button"
                data-ocid="call.participant.button"
                onClick={() => handleAddParticipant(c.name)}
                disabled={participants.includes(c.name)}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted/30 active:bg-muted/50 disabled:opacity-40 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0"
                  style={{ background: `hsl(${c.colorIndex * 60}, 60%, 40%)` }}
                >
                  {c.initials}
                </div>
                <div className="text-left">
                  <p className="text-[15px] font-medium text-foreground">
                    {c.name}
                  </p>
                  {participants.includes(c.name) && (
                    <p className="text-[12px] text-[#25D366]">
                      Already in call
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Post-call notes modal */}
      <AnimatePresence>
        {showPostCallModal && (
          <motion.div
            data-ocid="call.postcall.modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center"
            style={{ background: "rgba(0,0,0,0.7)" }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="w-full bg-card rounded-t-3xl px-5 pb-10 pt-5 border-t border-border"
            >
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                  <PhoneOff className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-[16px] font-bold text-foreground">
                    Call ended
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    Duration: {formatDuration(elapsed)}
                  </p>
                </div>
              </div>
              <p className="text-[14px] text-muted-foreground mb-3">
                Add a note about this call?
              </p>
              <textarea
                data-ocid="call.postcall.textarea"
                value={callNote}
                onChange={(e) => setCallNote(e.target.value)}
                placeholder="e.g. Follow up on project proposal..."
                rows={3}
                className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
              />
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  data-ocid="call.postcall.skip_button"
                  onClick={() => {
                    setShowPostCallModal(false);
                    onEnd();
                  }}
                  className="flex-1 py-3 rounded-xl border border-border text-[15px] font-medium text-muted-foreground hover:bg-muted/30 transition-colors"
                >
                  Skip
                </button>
                <button
                  type="button"
                  data-ocid="call.postcall.save_button"
                  onClick={handleSaveNote}
                  className="flex-1 py-3 rounded-xl bg-[#25D366] text-white text-[15px] font-semibold hover:bg-[#25D366]/90 transition-colors"
                >
                  Save note
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
