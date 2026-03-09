import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ContactAvatar from "./ContactAvatar";

interface StatusItem {
  name: string;
  initials: string;
  time: string;
  colorIndex: number;
}

interface StatusViewerProps {
  statusList: StatusItem[];
  currentIndex: number;
  onClose: () => void;
}

const GRADIENT_PAIRS: [string, string][] = [
  ["oklch(0.55 0.18 160)", "oklch(0.38 0.14 200)"],
  ["oklch(0.55 0.18 260)", "oklch(0.38 0.14 290)"],
  ["oklch(0.55 0.22 30)", "oklch(0.42 0.16 60)"],
  ["oklch(0.45 0.18 320)", "oklch(0.32 0.14 340)"],
  ["oklch(0.5 0.2 180)", "oklch(0.36 0.16 210)"],
  ["oklch(0.5 0.18 80)", "oklch(0.38 0.14 100)"],
];

export default function StatusViewer({
  statusList,
  currentIndex,
  onClose,
}: StatusViewerProps) {
  const [idx, setIdx] = useState(currentIndex);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = statusList.length;
  const current = statusList[idx];

  const closeWithFade = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 250);
  }, [onClose]);

  const goNext = useCallback(() => {
    if (idx < total - 1) {
      setIdx((p) => p + 1);
      setProgress(0);
    } else {
      closeWithFade();
    }
  }, [idx, total, closeWithFade]);

  const goPrev = useCallback(() => {
    if (idx > 0) {
      setIdx((p) => p - 1);
      setProgress(0);
    }
  }, [idx]);

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Auto-advance timer — re-runs whenever idx changes (to reset the progress)
  // biome-ignore lint/correctness/useExhaustiveDependencies: idx drives the reset intentionally
  useEffect(() => {
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const DURATION = 5000;
    const TICK = 100;
    let elapsed = 0;

    intervalRef.current = setInterval(() => {
      elapsed += TICK;
      setProgress(Math.min((elapsed / DURATION) * 100, 100));
      if (elapsed >= DURATION) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        goNext();
      }
    }, TICK);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [idx, goNext]);

  const [from, to] =
    GRADIENT_PAIRS[(current.colorIndex ?? 0) % GRADIENT_PAIRS.length];

  if (!current) return null;

  return (
    <div
      data-ocid="status.modal"
      className={`fixed inset-0 z-50 flex flex-col transition-opacity duration-250 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background: `linear-gradient(160deg, ${from}, ${to})`,
      }}
    >
      {/* Progress bars */}
      <div className="flex items-center gap-1 px-3 pt-4 pb-2 flex-shrink-0">
        {statusList.map((item, i) => (
          <div
            key={`prog-${item.name}`}
            className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden"
          >
            <div
              className="h-full bg-white rounded-full transition-none"
              style={{
                width: i < idx ? "100%" : i === idx ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Contact info row */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0">
        <ContactAvatar
          initials={current.initials}
          size="sm"
          colorIndex={current.colorIndex}
        />
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-[14px] truncate font-display">
            {current.name}
          </p>
          <p className="text-white/60 text-[11px]">{current.time}</p>
        </div>
        <button
          type="button"
          data-ocid="status.close_button"
          onClick={closeWithFade}
          aria-label="Close status viewer"
          className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tap zones (left / right) */}
      <div className="flex-1 flex">
        <button
          type="button"
          data-ocid="status.secondary_button"
          onClick={goPrev}
          aria-label="Previous status"
          className="w-1/3 h-full focus:outline-none"
        />
        <button
          type="button"
          data-ocid="status.primary_button"
          onClick={goNext}
          aria-label="Next status"
          className="flex-1 h-full focus:outline-none"
        />
      </div>

      {/* Status text content */}
      <div className="px-6 pb-12 flex-shrink-0">
        <p className="text-white/90 text-base text-center">
          {current.name}'s status update
        </p>
      </div>
    </div>
  );
}
