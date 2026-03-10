import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Shield } from "lucide-react";
import { useRef, useState } from "react";

interface TwoStepVerificationScreenProps {
  onBack: () => void;
}

type Step = "enter" | "confirm" | "email" | "done";

export default function TwoStepVerificationScreen({
  onBack,
}: TwoStepVerificationScreenProps) {
  const [step, setStep] = useState<Step>("enter");
  const [pin, setPin] = useState<string[]>(Array(6).fill(""));
  const [confirmPin, setConfirmPin] = useState<string[]>(Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePinInput = (
    index: number,
    value: string,
    arr: string[],
    setArr: (v: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
  ) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...arr];
    next[index] = value;
    setArr(next);
    if (value && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    arr: string[],
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
  ) => {
    if (e.key === "Backspace" && !arr[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleStep1 = () => {
    if (pin.join("").length < 6) {
      setError("Please enter all 6 digits");
      return;
    }
    setError("");
    setStep("confirm");
    setTimeout(() => confirmRefs.current[0]?.focus(), 100);
  };

  const handleStep2 = () => {
    if (confirmPin.join("") !== pin.join("")) {
      setError("PINs don't match. Try again.");
      setConfirmPin(Array(6).fill(""));
      setTimeout(() => confirmRefs.current[0]?.focus(), 100);
      return;
    }
    setError("");
    setStep("email");
  };

  const handleStep3 = () => {
    localStorage.setItem("wa-two-step-pin", pin.join(""));
    setStep("done");
  };

  const PIN_INDICES = [0, 1, 2, 3, 4, 5] as const;

  const PinBoxes = ({
    arr,
    setArr,
    refs,
  }: {
    arr: string[];
    setArr: (v: string[]) => void;
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  }) => (
    <div className="flex gap-3 justify-center my-6">
      {PIN_INDICES.map((i) => (
        <input
          key={`pin-${i}`}
          ref={(el) => {
            refs.current[i] = el;
          }}
          data-ocid="two_step.pin.input"
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={arr[i]}
          onChange={(e) => handlePinInput(i, e.target.value, arr, setArr, refs)}
          onKeyDown={(e) => handleKeyDown(e, i, arr, refs)}
          className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl bg-muted focus:border-wa-green focus:outline-none transition-colors"
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe-top pb-3 border-b border-border sticky top-0 bg-background z-10">
        <button
          type="button"
          data-ocid="two_step.back_button"
          onClick={onBack}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-[17px]">Two-step verification</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-6 py-8 overflow-y-auto">
        {step === "enter" && (
          <>
            <Shield className="w-16 h-16 text-wa-green mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              Create PIN
            </h2>
            <p className="text-[14px] text-muted-foreground text-center mb-2">
              Enter a 6-digit PIN to protect your account.
            </p>
            <PinBoxes arr={pin} setArr={setPin} refs={inputRefs} />
            {error && (
              <p
                data-ocid="two_step.error_state"
                className="text-destructive text-[13px] mb-3"
              >
                {error}
              </p>
            )}
            <Button
              data-ocid="two_step.submit_button"
              className="w-full bg-wa-green hover:bg-wa-green/90 text-white mt-2"
              onClick={handleStep1}
            >
              Next
            </Button>
          </>
        )}

        {step === "confirm" && (
          <>
            <Shield className="w-16 h-16 text-wa-green mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              Confirm PIN
            </h2>
            <p className="text-[14px] text-muted-foreground text-center mb-2">
              Enter your 6-digit PIN again to confirm.
            </p>
            <PinBoxes
              arr={confirmPin}
              setArr={setConfirmPin}
              refs={confirmRefs}
            />
            {error && (
              <p
                data-ocid="two_step.error_state"
                className="text-destructive text-[13px] mb-3"
              >
                {error}
              </p>
            )}
            <Button
              data-ocid="two_step.submit_button"
              className="w-full bg-wa-green hover:bg-wa-green/90 text-white mt-2"
              onClick={handleStep2}
            >
              Next
            </Button>
          </>
        )}

        {step === "email" && (
          <>
            <Shield className="w-16 h-16 text-wa-green mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              Recovery email
            </h2>
            <p className="text-[14px] text-muted-foreground text-center mb-4">
              Add a recovery email in case you forget your PIN. This is
              optional.
            </p>
            <input
              data-ocid="two_step.email.input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address (optional)"
              className="w-full border border-border rounded-xl px-4 py-3 text-[15px] bg-muted focus:outline-none focus:border-wa-green mb-6"
            />
            <Button
              data-ocid="two_step.submit_button"
              className="w-full bg-wa-green hover:bg-wa-green/90 text-white"
              onClick={handleStep3}
            >
              {email ? "Save" : "Skip"}
            </Button>
          </>
        )}

        {step === "done" && (
          <div
            data-ocid="two_step.success_state"
            className="flex flex-col items-center text-center mt-8"
          >
            <CheckCircle2 className="w-20 h-20 text-wa-green mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              PIN enabled!
            </h2>
            <p className="text-[14px] text-muted-foreground mb-8">
              Two-step verification is now active. You&apos;ll need this PIN
              when registering your number again.
            </p>
            <Button
              data-ocid="two_step.submit_button"
              className="w-full bg-wa-green hover:bg-wa-green/90 text-white"
              onClick={onBack}
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
