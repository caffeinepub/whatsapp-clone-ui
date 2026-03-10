import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface LoginScreenProps {
  onNext: (method: "phone" | "email", value: string) => void;
}

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
];

export default function LoginScreen({ onNext }: LoginScreenProps) {
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState<"phone" | "email">("phone");

  const handleNext = () => {
    if (tab === "phone") {
      if (!phone || phone.length < 7) {
        toast.error("Enter a valid phone number");
        return;
      }
      onNext("phone", `${countryCode} ${phone}`);
    } else {
      if (!email || !email.includes("@")) {
        toast.error("Enter a valid email address");
        return;
      }
      onNext("email", email);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background" data-ocid="login.page">
      {/* Header */}
      <div
        className="flex-shrink-0 px-6 pb-8"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 52px)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center gap-4"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "#25D366" }}
          >
            <svg
              role="img"
              aria-label="WhatsApp"
              width="36"
              height="36"
              viewBox="0 0 56 56"
              fill="none"
            >
              <path
                d="M28 4C14.745 4 4 14.745 4 28c0 4.24 1.115 8.22 3.065 11.665L4 52l12.735-3.335A23.878 23.878 0 0028 52c13.255 0 24-10.745 24-24S41.255 4 28 4z"
                fill="white"
              />
              <path
                d="M20.5 17.5c-.5-1.1-1.05-1.12-1.535-1.14-.4-.015-.86-.015-1.32-.015-.46 0-1.21.172-1.845.86-.635.687-2.42 2.366-2.42 5.773 0 3.407 2.476 6.7 2.82 7.16.345.46 4.8 7.62 11.83 10.38 5.85 2.3 7.034 1.843 8.3 1.727 1.267-.117 4.085-1.67 4.661-3.283.576-1.612.576-2.995.403-3.283-.172-.288-.632-.46-1.323-.805-.69-.344-4.085-2.02-4.72-2.248-.634-.23-1.093-.345-1.553.346-.46.69-1.78 2.248-2.18 2.708-.4.46-.805.518-1.497.173-.69-.346-2.913-1.073-5.55-3.43-2.05-1.833-3.434-4.097-3.835-4.787-.4-.69-.043-1.063.3-1.406.31-.31.69-.805 1.035-1.207.346-.4.46-.69.69-1.15.23-.46.115-.863-.057-1.208-.173-.344-1.52-3.77-2.13-5.16z"
                fill="#075E54"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Enter your phone number
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              WhatsApp will send an OTP to verify your number
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 px-6 flex flex-col gap-6"
      >
        <Tabs value={tab} onValueChange={(v) => setTab(v as "phone" | "email")}>
          <TabsList className="w-full" data-ocid="login.tab">
            <TabsTrigger
              value="phone"
              className="flex-1"
              data-ocid="login.phone.tab"
            >
              Phone Number
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="flex-1"
              data-ocid="login.email.tab"
            >
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phone" className="mt-6">
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger
                  className="w-[110px] flex-shrink-0"
                  data-ocid="login.country.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_CODES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 text-base"
                inputMode="numeric"
                data-ocid="login.phone.input"
                onKeyDown={(e) => e.key === "Enter" && handleNext()}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              We'll send an OTP to verify your number
            </p>
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-base"
              inputMode="email"
              data-ocid="login.email.input"
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
            />
            <p className="text-xs text-muted-foreground mt-2">
              We'll send an OTP to your email
            </p>
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleNext}
          className="w-full h-12 text-base font-semibold"
          style={{ background: "#25D366", color: "white" }}
          data-ocid="login.submit_button"
        >
          Next
        </Button>
      </motion.div>

      {/* Footer */}
      <div className="flex-shrink-0 px-6 pb-8 pt-4 text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <button
            type="button"
            className="underline"
            onClick={() => toast.info("Terms of Service")}
            data-ocid="login.terms.link"
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="underline"
            onClick={() => toast.info("Privacy Policy")}
            data-ocid="login.privacy.link"
          >
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
}
