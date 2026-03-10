import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface ScheduledMsg {
  id: number;
  text: string;
  dt: Date;
  recurring?: "none" | "daily" | "weekly";
}

interface ScheduleMessageModalProps {
  open: boolean;
  onClose: () => void;
  messageText: string;
  onSchedule: (
    text: string,
    dateTime: Date,
    recurring?: "none" | "daily" | "weekly",
  ) => void;
  editMsg?: ScheduledMsg | null;
  onEditSave?: (
    id: number,
    text: string,
    dt: Date,
    recurring: "none" | "daily" | "weekly",
  ) => void;
}

export default function ScheduleMessageModal({
  open,
  onClose,
  messageText,
  onSchedule,
  editMsg,
  onEditSave,
}: ScheduleMessageModalProps) {
  const isEdit = !!editMsg;

  const [text, setText] = useState(() => editMsg?.text ?? messageText);
  const [date, setDate] = useState(() => {
    if (editMsg) {
      const d = new Date(editMsg.dt);
      return d.toISOString().split("T")[0];
    }
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [time, setTime] = useState(() => {
    if (editMsg) {
      const d = new Date(editMsg.dt);
      const h = d.getHours().toString().padStart(2, "0");
      const m = d.getMinutes().toString().padStart(2, "0");
      return `${h}:${m}`;
    }
    return "09:00";
  });
  const [recurring, setRecurring] = useState<"none" | "daily" | "weekly">(
    editMsg?.recurring ?? "none",
  );

  const handleSchedule = () => {
    if (!text.trim()) {
      toast.error("Please enter a message");
      return;
    }
    const dt = new Date(`${date}T${time}`);
    if (dt <= new Date()) {
      toast.error("Please pick a future date and time");
      return;
    }
    if (isEdit && editMsg && onEditSave) {
      onEditSave(editMsg.id, text.trim(), dt, recurring);
      toast.success("Scheduled message updated");
    } else {
      onSchedule(text.trim(), dt, recurring);
      const recurStr = recurring !== "none" ? ` · Repeats ${recurring}` : "";
      toast.success(
        `Scheduled for ${dt.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}${recurStr}`,
      );
    }
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-50 bg-black/50"
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-2xl"
        data-ocid="schedule.dialog"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-[16px] font-bold text-foreground">
            {isEdit ? "Edit Scheduled Message" : "Schedule Message"}
          </h2>
          <button
            type="button"
            data-ocid="schedule.close_button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="px-4 py-4 flex flex-col gap-4">
          {/* Message */}
          <div>
            <label
              htmlFor="schedule-msg"
              className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block"
            >
              Message
            </label>
            <Textarea
              id="schedule-msg"
              data-ocid="schedule.textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message…"
              rows={3}
              className="resize-none text-[14px]"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="schedule-date"
                className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5" /> Date
              </label>
              <input
                id="schedule-date"
                type="date"
                data-ocid="schedule.input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 text-[14px] rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="schedule-time"
                className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1"
              >
                <Clock className="w-3.5 h-3.5" /> Time
              </label>
              <input
                id="schedule-time"
                type="time"
                data-ocid="schedule.select"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-[14px] rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Recurring */}
          <div>
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> Repeat
            </p>
            <div className="flex gap-2">
              {(["none", "daily", "weekly"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  data-ocid={`schedule.recurring.${opt}.toggle`}
                  onClick={() => setRecurring(opt)}
                  className={`flex-1 py-2 rounded-lg text-[12px] font-semibold border transition-colors ${
                    recurring === opt
                      ? "bg-wa-green text-white border-wa-green"
                      : "border-border text-muted-foreground hover:border-wa-green/50"
                  }`}
                >
                  {opt === "none"
                    ? "Once"
                    : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              data-ocid="schedule.cancel_button"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="schedule.submit_button"
              onClick={handleSchedule}
              className="flex-1 bg-wa-green hover:bg-wa-green/90 text-white"
            >
              <Clock className="w-4 h-4 mr-1.5" />
              {isEdit ? "Save Changes" : "Schedule"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
