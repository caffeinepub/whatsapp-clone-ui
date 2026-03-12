import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  onBack: () => void;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const TIMES = [
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
];

function loadHours() {
  try {
    return JSON.parse(localStorage.getItem("bp_hours") ?? "");
  } catch {
    return null;
  }
}

const DEFAULT_HOURS = DAYS.reduce(
  (acc, day) => {
    acc[day] = { open: day !== "Sunday", from: "9:00 AM", to: "6:00 PM" };
    return acc;
  },
  {} as Record<string, { open: boolean; from: string; to: string }>,
);

export default function BusinessHoursScreen({ onBack }: Props) {
  const [hours, setHours] = useState<
    Record<string, { open: boolean; from: string; to: string }>
  >(() => loadHours() ?? DEFAULT_HOURS);

  const toggle = (day: string, val: boolean) => {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], open: val } }));
  };

  const setFrom = (day: string, val: string) => {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], from: val } }));
  };

  const setTo = (day: string, val: string) => {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], to: val } }));
  };

  const handleSave = () => {
    localStorage.setItem("bp_hours", JSON.stringify(hours));
    toast.success("Business hours saved!", { position: "top-center" });
  };

  return (
    <div
      data-ocid="business_hours.page"
      className="absolute inset-0 flex flex-col z-50 overflow-y-auto"
      style={{ background: "#0B141A", WebkitOverflowScrolling: "touch" }}
    >
      <header
        className="sticky top-0 z-10 bg-[#1F2C34] text-white flex items-center gap-3 px-3 py-3 flex-shrink-0"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
      >
        <button
          type="button"
          data-ocid="business_hours.close_button"
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[18px] font-bold flex-1">Business Hours</h1>
        <button
          type="button"
          data-ocid="business_hours.save_button"
          onClick={handleSave}
          className="text-[14px] font-semibold text-[#25D366]"
        >
          Save
        </button>
      </header>

      <div className="flex-1 pb-10">
        <p className="px-4 pt-5 pb-3 text-[12px] text-[#8696A0]">
          Set the hours when your business is open. Customers will see these on
          your profile.
        </p>

        <div className="bg-[#1F2C34]">
          {DAYS.map((day, idx) => (
            <div
              key={day}
              className={`px-4 py-3.5 ${idx < DAYS.length - 1 ? "border-b border-[#2A3942]" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[15px] font-medium text-white">
                  {day}
                </span>
                <Switch
                  data-ocid={`business_hours.day.switch.${idx + 1}`}
                  checked={hours[day].open}
                  onCheckedChange={(v) => toggle(day, v)}
                  className="data-[state=checked]:bg-[#25D366]"
                />
              </div>
              {hours[day].open && (
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex-1">
                    <p className="text-[11px] text-[#8696A0] mb-1">Opens</p>
                    <Select
                      value={hours[day].from}
                      onValueChange={(v) => setFrom(day, v)}
                    >
                      <SelectTrigger
                        data-ocid={`business_hours.from.select.${idx + 1}`}
                        className="bg-[#0B141A] border-[#2A3942] text-white text-[13px] h-9"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1F2C34] border-[#2A3942]">
                        {TIMES.map((t) => (
                          <SelectItem
                            key={t}
                            value={t}
                            className="text-white text-[13px]"
                          >
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <span className="text-[#8696A0] text-[13px] mt-4">to</span>
                  <div className="flex-1">
                    <p className="text-[11px] text-[#8696A0] mb-1">Closes</p>
                    <Select
                      value={hours[day].to}
                      onValueChange={(v) => setTo(day, v)}
                    >
                      <SelectTrigger
                        data-ocid={`business_hours.to.select.${idx + 1}`}
                        className="bg-[#0B141A] border-[#2A3942] text-white text-[13px] h-9"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1F2C34] border-[#2A3942]">
                        {TIMES.map((t) => (
                          <SelectItem
                            key={t}
                            value={t}
                            className="text-white text-[13px]"
                          >
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              {!hours[day].open && (
                <p className="text-[12px] text-[#8696A0] mt-1">Closed</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
