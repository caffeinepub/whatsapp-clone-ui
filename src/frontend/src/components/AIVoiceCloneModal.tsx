import { Mic, Pause, Play, Square, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const WAVE_BARS = [
  { id: "a", h: 12 },
  { id: "b", h: 24 },
  { id: "c", h: 36 },
  { id: "d", h: 18 },
  { id: "e", h: 30 },
  { id: "f", h: 24 },
  { id: "g", h: 12 },
  { id: "hh", h: 36 },
  { id: "ii", h: 18 },
  { id: "j", h: 24 },
  { id: "k", h: 30 },
  { id: "l", h: 12 },
  { id: "m", h: 24 },
  { id: "n", h: 18 },
  { id: "o", h: 36 },
  { id: "p", h: 24 },
  { id: "q", h: 12 },
  { id: "r", h: 30 },
  { id: "s", h: 18 },
  { id: "t", h: 24 },
];

const VOICES = [
  { id: "echo", name: "Echo", desc: "Deep & calm", emoji: "🎙️" },
  { id: "nova", name: "Nova", desc: "Bright & energetic", emoji: "✨" },
  { id: "aria", name: "Aria", desc: "Warm & natural", emoji: "🌸" },
  { id: "orion", name: "Orion", desc: "Bold & confident", emoji: "⚡" },
  { id: "sage", name: "Sage", desc: "Soft & soothing", emoji: "🍃" },
];

interface AIVoiceCloneModalProps {
  onClose: () => void;
  onSend: (voiceName: string) => void;
}

export default function AIVoiceCloneModal({
  onClose,
  onSend,
}: AIVoiceCloneModalProps) {
  const [selectedVoice, setSelectedVoice] = useState("echo");
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<"1x" | "1.5x" | "2x">("1x");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s >= 30) {
            stopRecording();
            return s;
          }
          return s + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  const startRecording = () => {
    setRecording(true);
    setRecorded(false);
    setSeconds(0);
  };
  const stopRecording = () => {
    setRecording(false);
    setRecorded(true);
  };

  const fmt = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const voice = VOICES.find((v) => v.id === selectedVoice)!;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        role="button"
        tabIndex={-1}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />
      <div
        data-ocid="ai_voice.sheet"
        className="relative w-full max-w-[390px] rounded-t-3xl pb-8 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1a0a2e 0%, #0d0d1a 100%)",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <h2 className="text-white font-bold text-lg">AI Voice Clone</h2>
            <p className="text-white/50 text-xs">
              Select a voice persona & record
            </p>
          </div>
          <button
            type="button"
            data-ocid="ai_voice.close_button"
            onClick={onClose}
            className="text-white/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice personas */}
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {VOICES.map((v) => (
            <button
              key={v.id}
              type="button"
              data-ocid={`ai_voice.${v.id}.toggle`}
              onClick={() => setSelectedVoice(v.id)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${
                selectedVoice === v.id
                  ? "border-purple-400 bg-purple-400/10"
                  : "border-white/10 bg-white/5"
              }`}
              style={{ minWidth: 72 }}
            >
              <span className="text-2xl">{v.emoji}</span>
              <span className="text-white text-xs font-semibold">{v.name}</span>
              <span className="text-white/40 text-[10px] text-center leading-tight">
                {v.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Record area */}
        <div className="px-5">
          <div className="bg-white/5 rounded-2xl p-5 flex flex-col items-center gap-4">
            {/* Waveform bars */}
            <div className="flex items-center gap-1 h-12">
              {WAVE_BARS.map((bar) => (
                <div
                  key={bar.id}
                  className="w-1.5 rounded-full transition-all"
                  style={{
                    height: recording
                      ? `${(bar.h % 36) + 8}px`
                      : recorded
                        ? `${bar.h}px`
                        : "8px",
                    background: recording
                      ? "linear-gradient(180deg, #a855f7, #7c3aed)"
                      : recorded
                        ? "linear-gradient(180deg, #06b6d4, #7c3aed)"
                        : "#ffffff20",
                    animation: recording
                      ? "pulse 0.4s ease-in-out infinite alternate"
                      : "none",
                  }}
                />
              ))}
            </div>

            {recording && (
              <p className="text-red-400 text-sm font-mono font-bold">
                {fmt(seconds)} Recording...
              </p>
            )}
            {recorded && !recording && (
              <p className="text-purple-400 text-sm font-semibold">
                ✓ Recorded as <span className="text-white">{voice.name}</span>
              </p>
            )}
            {!recording && !recorded && (
              <p className="text-white/40 text-xs">
                Tap mic to start recording
              </p>
            )}

            {/* Record button */}
            {!recorded ? (
              <button
                type="button"
                data-ocid={
                  recording ? "ai_voice.stop.button" : "ai_voice.record.button"
                }
                onClick={recording ? stopRecording : startRecording}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  recording
                    ? "bg-red-500 scale-110"
                    : "bg-purple-600 hover:bg-purple-500"
                }`}
                style={{
                  boxShadow: recording
                    ? "0 0 20px rgba(239,68,68,0.5)"
                    : "0 0 20px rgba(124,58,237,0.5)",
                }}
              >
                {recording ? (
                  <Square className="w-6 h-6 text-white fill-white" />
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  data-ocid="ai_voice.play.button"
                  onClick={() => setPlaying((p) => !p)}
                  className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center"
                >
                  {playing ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </button>
                <button
                  type="button"
                  data-ocid="ai_voice.rerecord.button"
                  onClick={startRecording}
                  className="text-white/50 text-xs underline"
                >
                  Re-record
                </button>
              </div>
            )}

            {/* Speed toggle */}
            {recorded && (
              <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
                {(["1x", "1.5x", "2x"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    data-ocid={`ai_voice.speed_${s}.toggle`}
                    onClick={() => setSpeed(s)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${speed === s ? "bg-purple-500 text-white" : "text-white/40"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 mt-4">
          <button
            type="button"
            data-ocid="ai_voice.cancel.button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-white/20 text-white/70 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            data-ocid="ai_voice.send.primary_button"
            onClick={() => {
              if (!recorded) {
                toast.error("Record a message first");
                return;
              }
              onSend(voice.name);
              onClose();
              toast.success(`Sent as ${voice.name} voice clone!`);
            }}
            className="flex-1 py-3 rounded-2xl text-white text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #7C3AED, #0ea5e9)" }}
          >
            Send as Voice Clone
          </button>
        </div>
      </div>
    </div>
  );
}
