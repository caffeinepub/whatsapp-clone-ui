import { Mic, MicOff, MousePointer, Pen, Square, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ScreenShareModalProps {
  contactName: string;
  onClose: () => void;
}

export default function ScreenShareModal({
  contactName,
  onClose,
}: ScreenShareModalProps) {
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [isPointerOn, setIsPointerOn] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [showRequest, setShowRequest] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col"
      data-ocid="screen_share.modal"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3 bg-black/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white text-sm font-semibold">
            Screen Sharing
          </span>
          <span className="text-white/50 text-sm">{fmt(seconds)}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-white/60 text-xs">
            <Users className="w-3.5 h-3.5" />
            <span>2 watching</span>
          </div>
          <button
            type="button"
            data-ocid="screen_share.close_button"
            onClick={onClose}
            className="text-white/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Screen preview */}
      <div className="flex-1 relative bg-[#1a1a2e] mx-3 rounded-2xl overflow-hidden">
        {/* Simulated screen content */}
        <div className="absolute inset-0 p-4">
          {/* Mock browser/app UI */}
          <div className="bg-[#0d0d1a] rounded-xl h-full p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 h-5 bg-white/5 rounded-full mx-2" />
            </div>
            <div className="flex gap-2 mt-2">
              <div className="w-1/4 h-full bg-white/5 rounded-lg p-2 space-y-2">
                {([80, 60, 70, 90, 50] as number[]).map((w) => (
                  <div
                    key={`s${w}`}
                    className="h-3 rounded-full bg-white/10"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-24 bg-purple-500/10 rounded-xl border border-purple-500/20" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-16 bg-blue-500/10 rounded-xl border border-blue-500/20" />
                  <div className="h-16 bg-teal-500/10 rounded-xl border border-teal-500/20" />
                </div>
                {([70, 85, 60] as number[]).map((w) => (
                  <div
                    key={`c${w}`}
                    className="h-3 rounded-full bg-white/10"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Annotation cursor */}
        {(isAnnotating || isPointerOn) && (
          <div
            className="absolute w-6 h-6 rounded-full border-2 border-purple-400 pointer-events-none"
            style={{
              top: "35%",
              left: "55%",
              boxShadow: "0 0 8px rgba(168,85,247,0.7)",
            }}
          >
            {isAnnotating && (
              <div className="w-full h-full rounded-full bg-purple-400/30" />
            )}
          </div>
        )}

        {/* Annotation mode banner */}
        {isAnnotating && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-purple-600/80 rounded-full px-3 py-1 text-white text-xs font-semibold">
            ✏️ Draw mode enabled
          </div>
        )}

        {/* Share request notification */}
        {showRequest && (
          <div className="absolute top-4 left-4 right-4 bg-[#1a1a2e] rounded-2xl p-4 border border-white/10 shadow-xl">
            <p className="text-white/60 text-xs mb-1">Incoming request</p>
            <p className="text-white font-semibold text-sm">
              {contactName} is sharing their screen
            </p>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                data-ocid="screen_share.accept.confirm_button"
                onClick={() => {
                  toast.success("Viewing screen");
                  setShowRequest(false);
                }}
                className="flex-1 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Accept
              </button>
              <button
                type="button"
                data-ocid="screen_share.decline.cancel_button"
                onClick={() => setShowRequest(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 text-white/70 text-xs font-semibold"
              >
                Decline
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="px-4 py-4 flex flex-col gap-3">
        {/* Top control row */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            data-ocid="screen_share.annotate.toggle"
            onClick={() => setIsAnnotating((v) => !v)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${isAnnotating ? "bg-purple-500/20 border border-purple-400" : "bg-white/5 border border-white/10"}`}
          >
            <Pen
              className={`w-5 h-5 ${isAnnotating ? "text-purple-400" : "text-white/60"}`}
            />
            <span
              className={`text-[10px] ${isAnnotating ? "text-purple-400" : "text-white/40"}`}
            >
              Annotate
            </span>
          </button>
          <button
            type="button"
            data-ocid="screen_share.pointer.toggle"
            onClick={() => setIsPointerOn((v) => !v)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${isPointerOn ? "bg-blue-500/20 border border-blue-400" : "bg-white/5 border border-white/10"}`}
          >
            <MousePointer
              className={`w-5 h-5 ${isPointerOn ? "text-blue-400" : "text-white/60"}`}
            />
            <span
              className={`text-[10px] ${isPointerOn ? "text-blue-400" : "text-white/40"}`}
            >
              Pointer
            </span>
          </button>
          <button
            type="button"
            data-ocid="screen_share.audio.toggle"
            onClick={() => setAudioOn((v) => !v)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${audioOn ? "bg-white/5 border border-white/10" : "bg-red-500/20 border border-red-400"}`}
          >
            {audioOn ? (
              <Mic className="w-5 h-5 text-white/60" />
            ) : (
              <MicOff className="w-5 h-5 text-red-400" />
            )}
            <span
              className={`text-[10px] ${audioOn ? "text-white/40" : "text-red-400"}`}
            >
              Audio
            </span>
          </button>
          <button
            type="button"
            data-ocid="screen_share.request.button"
            onClick={() => setShowRequest(true)}
            className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-white/5 border border-white/10"
          >
            <Users className="w-5 h-5 text-white/60" />
            <span className="text-[10px] text-white/40">Request</span>
          </button>
        </div>

        {/* Stop sharing */}
        <button
          type="button"
          data-ocid="screen_share.stop.delete_button"
          onClick={() => {
            toast.success("Screen sharing stopped");
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2"
        >
          <Square className="w-4 h-4 fill-white" /> Stop Sharing
        </button>
      </div>
    </div>
  );
}
