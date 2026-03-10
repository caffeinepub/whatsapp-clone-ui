import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface OTPScreenProps {
  method: "phone" | "email";
  value: string;
  onVerified: () => void;
  onBack: () => void;
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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(30);
    setOtp("");
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    toast.success(`Code resent to ${value}`);
  };

  const handleVerify = async () => {
    if (otp.length < 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setLoading(true);
    // Simulate verification delay
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onVerified();
  };

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
        className="flex-1 flex flex-col px-6 pt-6 gap-8"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Enter the 6-digit code
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            We sent a code to{" "}
            <span className="font-semibold text-foreground">{value}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex flex-col items-center gap-6">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
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
                className="text-sm font-semibold"
                style={{ color: "#25D366" }}
              >
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

        <p className="text-xs text-center text-muted-foreground">
          Didn't receive the code? Check your{" "}
          {method === "phone" ? "SMS messages" : "email inbox"} or try
          resending.
        </p>
      </motion.div>
    </div>
  );
}
