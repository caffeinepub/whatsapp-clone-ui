import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  onBack: () => void;
}

export default function AutoReplyScreen({ onBack }: Props) {
  const [greetingEnabled, setGreetingEnabled] = useState(
    () => localStorage.getItem("bp_greeting_enabled") === "true",
  );
  const [greetingMsg, setGreetingMsg] = useState(
    () =>
      localStorage.getItem("bp_greeting_msg") ??
      "Hi! Thanks for contacting us. How can we help you today?",
  );
  const [awayEnabled, setAwayEnabled] = useState(
    () => localStorage.getItem("bp_away_enabled") === "true",
  );
  const [awayMsg, setAwayMsg] = useState(
    () =>
      localStorage.getItem("bp_away_msg") ??
      "We're currently unavailable. We'll get back to you as soon as possible.",
  );
  const [awaySchedule, setAwaySchedule] = useState(
    () => localStorage.getItem("bp_away_schedule") ?? "always",
  );

  const handleSave = () => {
    localStorage.setItem(
      "bp_greeting_enabled",
      greetingEnabled ? "true" : "false",
    );
    localStorage.setItem("bp_greeting_msg", greetingMsg);
    localStorage.setItem("bp_away_enabled", awayEnabled ? "true" : "false");
    localStorage.setItem("bp_away_msg", awayMsg);
    localStorage.setItem("bp_away_schedule", awaySchedule);
    toast.success("Auto-reply settings saved!", { position: "top-center" });
  };

  return (
    <div
      data-ocid="auto_reply.page"
      className="absolute inset-0 flex flex-col z-50 overflow-y-auto"
      style={{ background: "#0B141A", WebkitOverflowScrolling: "touch" }}
    >
      <header
        className="sticky top-0 z-10 bg-[#1F2C34] text-white flex items-center gap-3 px-3 py-3 flex-shrink-0"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
      >
        <button
          type="button"
          data-ocid="auto_reply.close_button"
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[18px] font-bold flex-1">Auto Reply Messages</h1>
      </header>

      <div className="flex-1 pb-10 space-y-3 pt-3">
        {/* Greeting Message */}
        <div className="bg-[#1F2C34] px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-semibold text-white">
                Greeting Message
              </p>
              <p className="text-[12px] text-[#8696A0]">
                Sent to new customers
              </p>
            </div>
            <Switch
              data-ocid="auto_reply.greeting.switch"
              checked={greetingEnabled}
              onCheckedChange={setGreetingEnabled}
              className="data-[state=checked]:bg-[#25D366]"
            />
          </div>
          {greetingEnabled && (
            <div className="space-y-1.5">
              <Label className="text-[12px] text-[#8696A0]">Message</Label>
              <Textarea
                data-ocid="auto_reply.greeting.textarea"
                value={greetingMsg}
                onChange={(e) => setGreetingMsg(e.target.value)}
                rows={3}
                className="bg-[#0B141A] border-[#2A3942] text-white placeholder:text-white/30 focus:border-[#25D366] resize-none text-[13px]"
              />
            </div>
          )}
        </div>

        {/* Away Message */}
        <div className="bg-[#1F2C34] px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-semibold text-white">
                Away Message
              </p>
              <p className="text-[12px] text-[#8696A0]">
                Sent when outside business hours
              </p>
            </div>
            <Switch
              data-ocid="auto_reply.away.switch"
              checked={awayEnabled}
              onCheckedChange={setAwayEnabled}
              className="data-[state=checked]:bg-[#25D366]"
            />
          </div>
          {awayEnabled && (
            <>
              <div className="space-y-1.5">
                <Label className="text-[12px] text-[#8696A0]">Message</Label>
                <Textarea
                  data-ocid="auto_reply.away.textarea"
                  value={awayMsg}
                  onChange={(e) => setAwayMsg(e.target.value)}
                  rows={3}
                  className="bg-[#0B141A] border-[#2A3942] text-white placeholder:text-white/30 focus:border-[#25D366] resize-none text-[13px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] text-[#8696A0]">Schedule</Label>
                <Select value={awaySchedule} onValueChange={setAwaySchedule}>
                  <SelectTrigger
                    data-ocid="auto_reply.away_schedule.select"
                    className="bg-[#0B141A] border-[#2A3942] text-white"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1F2C34] border-[#2A3942]">
                    <SelectItem value="always" className="text-white">
                      Always send
                    </SelectItem>
                    <SelectItem value="outside_hours" className="text-white">
                      Outside business hours
                    </SelectItem>
                    <SelectItem value="custom" className="text-white">
                      Custom schedule
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <div className="px-4">
          <Button
            data-ocid="auto_reply.submit_button"
            onClick={handleSave}
            className="w-full bg-[#25D366] hover:bg-[#1DB954] text-white font-semibold rounded-full py-3 text-[15px]"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
