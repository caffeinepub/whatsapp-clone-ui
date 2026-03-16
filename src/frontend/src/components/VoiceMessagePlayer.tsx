import { ChevronDown, ChevronUp, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VoiceMessagePlayerProps {
  duration?: string;
  isSent?: boolean;
}

const BAR_DATA = [
  [18, "b0"],
  [28, "b1"],
  [14, "b2"],
  [32, "b3"],
  [22, "b4"],
  [38, "b5"],
  [16, "b6"],
  [30, "b7"],
  [24, "b8"],
  [40, "b9"],
  [20, "b10"],
  [36, "b11"],
  [14, "b12"],
  [28, "b13"],
  [32, "b14"],
  [18, "b15"],
  [42, "b16"],
  [24, "b17"],
  [30, "b18"],
  [16, "b19"],
] as [number, string][];

// Simulated transcripts based on duration
const TRANSCRIPTS = [
  "Hey, are you free to meet tomorrow afternoon?",
  "Just wanted to check in about the project status.",
  "Can you send me the report when you get a chance?",
  "I'll be a bit late, traffic is really bad today.",
  "That sounds great, let me know the details.",
  "Did you see the game last night? What a match!",
];

export default function VoiceMessagePlayer({
  duration = "0:12",
  isSent = false,
}: VoiceMessagePlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSecs = (() => {
    const parts = duration.split(":");
    return Number(parts[0]) * 60 + Number(parts[1]) || 12;
  })();

  // Pick a deterministic transcript based on totalSecs
  const transcript = TRANSCRIPTS[totalSecs % TRANSCRIPTS.length];

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setPlaying(false);
            setHasPlayed(true);
            return 0;
          }
          return p + (100 / totalSecs) * 0.1 * speed;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, totalSecs, speed]);

  const currentTime = Math.floor((progress / 100) * totalSecs);
  const mins = Math.floor(currentTime / 60);
  const secs = currentTime % 60;
  const displayTime = playing
    ? `${mins}:${secs.toString().padStart(2, "0")}`
    : duration;

  const cycleSpeed = () => {
    setSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1));
  };

  const activeColor = isSent ? "bg-white/80" : "bg-wa-green";
  const inactiveColor = isSent ? "bg-white/30" : "bg-wa-green/30";

  return (
    <div className="flex flex-col min-w-[200px] max-w-[260px] gap-1">
      <div className="flex items-center gap-2">
        {/* Play/Pause */}
        <button
          type="button"
          data-ocid="voice_player.toggle"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
            isSent
              ? "bg-white/20 hover:bg-white/30"
              : "bg-wa-green/20 hover:bg-wa-green/30"
          }`}
        >
          {playing ? (
            <Pause
              className={`w-4 h-4 ${isSent ? "text-white" : "text-wa-green"}`}
            />
          ) : (
            <Play
              className={`w-4 h-4 ${isSent ? "text-white" : "text-wa-green"} ml-0.5`}
            />
          )}
        </button>

        {/* Waveform + seek */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-end gap-[2px] h-[42px]">
            {BAR_DATA.map(([h, bkey], i) => {
              const filled = (i / BAR_DATA.length) * 100 <= progress;
              return (
                <button
                  type="button"
                  key={bkey}
                  aria-label={`Seek to position ${i}`}
                  onClick={() => setProgress((i / BAR_DATA.length) * 100)}
                  className={`flex-1 rounded-full transition-all duration-100 ${
                    filled ? activeColor : inactiveColor
                  } ${playing && filled ? "animate-pulse" : ""}`}
                  style={{ height: `${h}px` }}
                />
              );
            })}
          </div>
          <input
            type="range"
            data-ocid="voice_player.seekbar"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-1 cursor-pointer accent-wa-green"
            aria-label="Seek voice message"
          />
        </div>

        {/* Duration + Speed */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span
            className={`text-[10px] font-mono ${
              isSent ? "text-white/70" : "text-muted-foreground"
            }`}
          >
            {displayTime}
          </span>
          <button
            type="button"
            data-ocid="voice_player.speed_toggle"
            onClick={cycleSpeed}
            className={`text-[9px] font-bold px-1 py-0.5 rounded border transition-colors ${
              isSent
                ? "border-white/40 text-white/70 hover:bg-white/10"
                : "border-wa-green/40 text-wa-green hover:bg-wa-green/10"
            }`}
            aria-label={`Playback speed ${speed}x`}
          >
            {speed}x
          </button>
        </div>
      </div>

      {/* Transcript section — shown after first play */}
      {hasPlayed && (
        <div className={`mt-1 ${isSent ? "" : ""}`}>
          <button
            type="button"
            data-ocid="voice_player.transcript_toggle"
            onClick={() => setShowTranscript((p) => !p)}
            className={`flex items-center gap-1 text-[10px] font-semibold transition-colors ${
              isSent
                ? "text-white/60 hover:text-white/80"
                : "text-wa-green/80 hover:text-wa-green"
            }`}
            aria-label={showTranscript ? "Hide transcript" : "Show transcript"}
          >
            {showTranscript ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
            Transcript
          </button>
          {showTranscript && (
            <p
              data-ocid="voice_player.transcript.panel"
              className={`mt-1 text-[11px] leading-relaxed italic ${
                isSent ? "text-white/70" : "text-muted-foreground"
              }`}
            >
              &ldquo;{transcript}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
