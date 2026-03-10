import { Delete } from "lucide-react";
import { useEffect, useState } from "react";

interface AppLockScreenProps {
  onUnlock: () => void;
  savedPin: string;
}

export default function AppLockScreen({
  onUnlock,
  savedPin,
}: AppLockScreenProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === savedPin) {
        onUnlock();
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => {
          setPin("");
          setError(false);
          setShake(false);
        }, 700);
      }
    }
  }, [pin, savedPin, onUnlock]);

  const handleDigit = (d: string) => {
    if (pin.length < 4) setPin((p) => p + d);
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
  };

  const KEYS = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "del"],
  ];

  return (
    <div
      data-ocid="applock.modal"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0b141a] text-white"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-[320px] px-6">
        {/* Logo area */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-wa-green flex items-center justify-center">
            <span className="text-3xl">💬</span>
          </div>
          <p className="text-[22px] font-bold">WhatsApp</p>
          <p className="text-[14px] text-white/60">Enter your PIN to unlock</p>
        </div>

        {/* PIN dots */}
        <div
          data-ocid="applock.pin.panel"
          className={`flex gap-4 ${shake ? "animate-bounce" : ""}`}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed 4-dot PIN display
              key={i}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-150 ${
                error
                  ? "bg-destructive border-destructive"
                  : i < pin.length
                    ? "bg-wa-green border-wa-green"
                    : "bg-transparent border-white/40"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-[13px] text-destructive -mt-4">
            Incorrect PIN. Try again.
          </p>
        )}

        {/* Number pad */}
        <div className="w-full grid grid-cols-3 gap-3">
          {KEYS.flat().map((key, i) => {
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed keypad empty cell
            if (!key) return <div key={`empty-pos-${i}`} />;
            if (key === "del") {
              return (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed keypad layout
                  key={i}
                  type="button"
                  data-ocid="applock.delete_button"
                  onClick={handleDelete}
                  className="h-16 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors flex items-center justify-center"
                  aria-label="Delete"
                >
                  <Delete className="w-5 h-5 text-white" />
                </button>
              );
            }
            return (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed keypad layout
                key={i}
                type="button"
                data-ocid="applock.key.button"
                onClick={() => handleDigit(key)}
                className="h-16 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors flex items-center justify-center text-[24px] font-semibold"
                aria-label={`Digit ${key}`}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
