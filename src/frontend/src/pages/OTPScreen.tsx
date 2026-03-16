import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface OTPScreenProps {
  method: "phone" | "email";
  value: string;
  onVerified: () => void;
  onBack: () => void;
}

function generateOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function OTPScreen({
  method,
  value,
  onVerified,
  onBack,
}: OTPScreenProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState("");
  const [currentCode, setCurrentCode] = useState<string>(() => {
    const code = generateOTP();
    localStorage.setItem(`wa_otp_${value}`, code);
    return code;
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(() => {
    setCountdown(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startCountdown();
    // Auto-fill after 3 seconds
    const autoFill = setTimeout(() => {
      const stored = localStorage.getItem(`wa_otp_${value}`);
      if (stored) setOtp(stored);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearTimeout(autoFill);
    };
  }, [value, startCountdown]);

  const handleResend = () => {
    if (countdown > 0) return;
    const newCode = generateOTP();
    localStorage.setItem(`wa_otp_${value}`, newCode);
    setCurrentCode(newCode);
    setOtp("");
    setError("");
    startCountdown();
    // Auto-fill after 3 seconds
    setTimeout(() => setOtp(newCode), 3000);
  };

  const handleVerify = async () => {
    if (otp.length < 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    const stored = localStorage.getItem(`wa_otp_${value}`);
    if (otp !== stored) {
      setError("Incorrect code. Please try again.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    localStorage.removeItem(`wa_otp_${value}`);
    onVerified();
  };

  // Auto verify when OTP is fully filled and matches
  useEffect(() => {
    if (otp.length === 6) {
      const stored = localStorage.getItem(`wa_otp_${value}`);
      if (otp === stored) {
        setError("");
      }
    }
  }, [otp, value]);

  return (
    <div className="flex flex-col h-full bg-background" data-ocid="otp.page">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 pb-2"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 52px)" }}
      >
        <button
          type="button"
          onClick={onBack}
          data-ocid="otp.back.button"
          className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col px-6 pt-4 gap-6 overflow-y-auto"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Enter the 6-digit code
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sent to{" "}
            <span className="font-semibold text-foreground">{value}</span>
          </p>
        </div>

        {/* Demo OTP Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border-2 p-4 text-center"
          style={{
            borderColor: "#25D366",
            background: "rgba(37,211,102,0.06)",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4" style={{ color: "#25D366" }} />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {method === "phone" ? "SMS" : "Email"} Verification Code
            </p>
          </div>
          <p
            className="text-3xl font-mono font-bold tracking-[0.25em]"
            style={{ color: "#25D366" }}
          >
            {currentCode}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Code auto-fills in 3 seconds
          </p>
        </motion.div>

        {/* OTP Input */}
        <div className="flex flex-col items-center gap-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(v) => {
              setOtp(v);
              setError("");
            }}
            data-ocid="otp.input"
          >
            <InputOTPGroup className="gap-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-11 h-14 text-xl border-2 rounded-xl"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <AnimatePresence>
            {error && (
              <motion.p
                data-ocid="otp.error_state"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-500 text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Resend */}
          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend code in{" "}
                <span className="font-semibold" style={{ color: "#25D366" }}>
                  {countdown}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                data-ocid="otp.resend.button"
                className="flex items-center gap-1.5 text-sm font-semibold mx-auto"
                style={{ color: "#25D366" }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Resend code
              </button>
            )}
          </div>
        </div>

        <Button
          onClick={handleVerify}
          disabled={otp.length < 6 || loading}
          className="w-full h-12 text-base font-semibold"
          style={{ background: "#25D366", color: "white" }}
          data-ocid="otp.submit_button"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify"}
        </Button>

        <p className="text-xs text-center text-muted-foreground pb-6">
          Didn&apos;t receive the code? Check your{" "}
          {method === "phone" ? "SMS messages" : "email inbox"} or try
          resending.
        </p>
      </motion.div>
    </div>
  );
}
