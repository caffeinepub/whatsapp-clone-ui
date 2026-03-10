import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ChatLockScreenProps {
  onBack: () => void;
}

export default function ChatLockScreen({ onBack }: ChatLockScreenProps) {
  const [enabled, setEnabled] = useState(false);
  const [pinSet, setPinSet] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const [fingerprint, setFingerprint] = useState(false);

  const handleToggle = (val: boolean) => {
    if (val && !pinSet) {
      setShowPinSetup(true);
    } else {
      setEnabled(val);
      if (!val) {
        setPinSet(false);
        setPin("");
        setConfirmPin("");
        toast.success("Chat Lock disabled");
      }
    }
  };

  const handleKeyPress = (digit: string) => {
    if (step === "enter") {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => setStep("confirm"), 100);
      }
    } else {
      const newConfirm = confirmPin + digit;
      setConfirmPin(newConfirm);
      if (newConfirm.length === 4) {
        if (newConfirm === pin) {
          setPinSet(true);
          setEnabled(true);
          setShowPinSetup(false);
          setPin("");
          setConfirmPin("");
          setStep("enter");
          toast.success("Chat Lock enabled with PIN");
        } else {
          toast.error("PINs don't match. Try again.");
          setPin("");
          setConfirmPin("");
          setStep("enter");
        }
      }
    }
  };

  const handleBackspace = () => {
    if (step === "enter") setPin((p) => p.slice(0, -1));
    else setConfirmPin((p) => p.slice(0, -1));
  };

  const currentPin = step === "enter" ? pin : confirmPin;

  if (showPinSetup) {
    return (
      <div className="flex flex-col h-full bg-background">
        <header
          className="sticky top-0 z-50 bg-wa-header flex items-center gap-2 px-2 pb-2 flex-shrink-0"
          style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
        >
          <button
            type="button"
            data-ocid="chatlock.pin_back.button"
            onClick={() => {
              setShowPinSetup(false);
              setPin("");
              setConfirmPin("");
              setStep("enter");
            }}
            className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-wa-header-fg font-semibold text-[17px]">
            Set Chat Lock PIN
          </h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
          <div className="text-center">
            <Lock className="w-14 h-14 text-wa-green mx-auto mb-4" />
            <p className="text-[17px] font-bold text-foreground">
              {step === "enter" ? "Create a 4-digit PIN" : "Confirm your PIN"}
            </p>
            <p className="text-[13px] text-muted-foreground mt-1">
              {step === "enter"
                ? "This PIN will unlock your locked chats"
                : "Re-enter your PIN to confirm"}
            </p>
          </div>

          {/* PIN dots */}
          <div className="flex items-center gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all ${
                  i < currentPin.length
                    ? "bg-wa-green scale-110"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map(
              (k, idx) => (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed numpad grid
                  key={`key-${idx}`}
                  type="button"
                  data-ocid={
                    k === "⌫"
                      ? "chatlock.pin.backspace.button"
                      : k === ""
                        ? undefined
                        : `chatlock.pin.button.${k}`
                  }
                  onClick={() => {
                    if (k === "⌫") handleBackspace();
                    else if (k !== "") handleKeyPress(k);
                  }}
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
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <header
        className="sticky top-0 z-50 bg-wa-header flex items-center gap-2 px-2 pb-2 flex-shrink-0"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
      >
        <button
          type="button"
          data-ocid="chatlock.back.button"
          onClick={onBack}
          className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-wa-header-fg font-semibold text-[17px]">
          Chat Lock
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center py-10 px-8 gap-3">
          <div className="w-20 h-20 rounded-full bg-wa-green/10 flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-wa-green" />
          </div>
          <p className="text-[17px] font-bold text-foreground text-center">
            Chat Lock
          </p>
          <p className="text-[13px] text-muted-foreground text-center max-w-[260px]">
            Lock individual chats so they require a PIN or biometric to open.
          </p>
        </div>

        <div className="bg-card mx-3 rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-[15px] font-semibold text-foreground">
                Enable Chat Lock
              </p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                {enabled && pinSet
                  ? "Locked chats need PIN to open"
                  : "Set a PIN to lock chats"}
              </p>
            </div>
            <Switch
              data-ocid="chatlock.enable.switch"
              checked={enabled}
              onCheckedChange={handleToggle}
            />
          </div>

          {enabled && (
            <>
              <div className="h-px bg-border ml-4" />
              <div className="flex items-center justify-between px-4 py-4">
                <div>
                  <p className="text-[15px] font-semibold text-foreground">
                    Fingerprint unlock
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    Use biometrics instead of PIN
                  </p>
                </div>
                <Switch
                  data-ocid="chatlock.fingerprint.switch"
                  checked={fingerprint}
                  onCheckedChange={setFingerprint}
                />
              </div>

              <div className="h-px bg-border ml-4" />
              <button
                type="button"
                data-ocid="chatlock.change_pin.button"
                onClick={() => {
                  setPin("");
                  setConfirmPin("");
                  setStep("enter");
                  setShowPinSetup(true);
                }}
                className="flex items-center justify-between w-full px-4 py-4 hover:bg-muted/40 transition-colors"
              >
                <p className="text-[15px] font-semibold text-foreground">
                  Change PIN
                </p>
                <span className="text-[13px] text-muted-foreground">
                  Change →
                </span>
              </button>
            </>
          )}
        </div>

        <div className="mx-3 mt-3 px-4 py-3 bg-muted/40 rounded-2xl">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            🔒 Locked chats will appear in a separate section at the top of your
            chat list. Only you can see them with the PIN.
          </p>
        </div>
      </main>
    </div>
  );
}
