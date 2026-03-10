import { useState } from "react";

interface PinUnlockModalProps {
  contactName: string;
  onUnlock: (pin: string) => void;
  onCancel: () => void;
}

const CORRECT_PIN = "1234";

export default function PinUnlockModal({
  contactName,
  onUnlock,
  onCancel,
}: PinUnlockModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleKey = (k: string) => {
    if (k === "⌫") {
      setPin((p) => p.slice(0, -1));
      setError("");
      return;
    }
    const newPin = pin + k;
    setPin(newPin);
    if (newPin.length === 4) {
      if (newPin === CORRECT_PIN) {
        onUnlock(newPin);
      } else {
        setError("Incorrect PIN. Try again.");
        setTimeout(() => setPin(""), 400);
      }
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col items-center justify-center gap-8 px-8">
      <div className="text-center">
        <span className="text-[48px]">🔒</span>
        <p className="text-[18px] font-bold text-foreground mt-2">
          Locked chat
        </p>
        <p className="text-[13px] text-muted-foreground mt-1">
          Enter PIN to open {contactName}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all ${
              i < pin.length
                ? "bg-wa-green scale-110"
                : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {error && (
        <p
          className="text-destructive text-[13px] -mt-4"
          data-ocid="chatlock.pin_error.error_state"
        >
          {error}
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map(
          (k, idx) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed numpad grid
              key={`ukey-${idx}`}
              type="button"
              onClick={() => k !== "" && handleKey(k)}
              disabled={k === ""}
              className={`h-16 rounded-2xl text-[22px] font-semibold transition-all ${
                k === ""
                  ? "invisible"
                  : k === "⌫"
                    ? "bg-muted text-muted-foreground hover:bg-muted/80 active:scale-95"
                    : "bg-card border border-border text-foreground hover:bg-muted/60 active:scale-95"
              }`}
            >
              {k}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        data-ocid="chatlock.unlock_cancel.button"
        onClick={onCancel}
        className="text-[14px] text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel
      </button>

      <p className="text-[11px] text-muted-foreground text-center">
        Demo PIN: <strong>1234</strong>
      </p>
    </div>
  );
}
