import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Phone, Video } from "lucide-react";
import type { ActiveCall } from "../hooks/useAppState";
import ContactAvatar from "./ContactAvatar";

export interface CallHistoryEntry {
  name: string;
  initials: string;
  type: "incoming" | "outgoing" | "missed";
  kind: "voice" | "video";
  time: string;
  missed: boolean;
  colorIndex: number;
  duration?: string;
}

interface CallDetailSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  call: CallHistoryEntry | null;
  onCallBack: (contact: ActiveCall) => void;
}

const TYPE_LABEL: Record<string, string> = {
  incoming: "Incoming",
  outgoing: "Outgoing",
  missed: "Missed",
};

export default function CallDetailSheet({
  open,
  onOpenChange,
  call,
  onCallBack,
}: CallDetailSheetProps) {
  if (!call) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-5 pb-8 pt-4"
        data-ocid="call_detail.sheet"
      >
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
        <SheetHeader className="mb-5">
          <SheetTitle className="text-[17px] font-bold">
            Call details
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col items-center gap-3 mb-6">
          <ContactAvatar
            initials={call.initials}
            size="lg"
            colorIndex={call.colorIndex}
          />
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{call.name}</p>
            <p
              className={`text-[13px] mt-0.5 ${
                call.missed ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {TYPE_LABEL[call.type]}{" "}
              {call.kind === "video" ? "video call" : "voice call"}
            </p>
          </div>
        </div>

        <div className="bg-muted rounded-2xl px-4 py-3 mb-6 space-y-2">
          <div className="flex justify-between text-[14px]">
            <span className="text-muted-foreground">Date &amp; Time</span>
            <span className="font-medium text-foreground">{call.time}</span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium text-foreground">
              {call.duration ?? (call.missed ? "—" : "2:34")}
            </span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-muted-foreground">Type</span>
            <span className="font-medium text-foreground capitalize">
              {call.kind}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            data-ocid="call_detail.callback_button"
            className="flex-1 bg-wa-green hover:bg-wa-green/90 text-white gap-2"
            onClick={() => {
              onOpenChange(false);
              onCallBack({
                name: call.name,
                initials: call.initials,
                kind: "voice",
                colorIndex: call.colorIndex,
              });
            }}
          >
            <Phone className="w-4 h-4" />
            Call back
          </Button>
          <Button
            data-ocid="call_detail.video_button"
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => {
              onOpenChange(false);
              onCallBack({
                name: call.name,
                initials: call.initials,
                kind: "video",
                colorIndex: call.colorIndex,
              });
            }}
          >
            <Video className="w-4 h-4" />
            Video
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
