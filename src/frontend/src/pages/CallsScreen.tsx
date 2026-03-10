import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  CalendarClock,
  Megaphone,
  MoreVertical,
  Phone,
  Search,
  Settings2,
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ContactAvatar from "../components/ContactAvatar";
import NewCallDialog from "../components/NewCallDialog";
import type { ActiveCall } from "../hooks/useAppState";

interface CallsScreenProps {
  onOpenCall: (contact: ActiveCall) => void;
}

const RECENT_CALLS = [
  {
    name: "Emma Rodriguez",
    initials: "ER",
    type: "incoming",
    kind: "voice" as const,
    time: "Today, 10:30 AM",
    missed: false,
    colorIndex: 0,
  },
  {
    name: "Marcus Chen",
    initials: "MC",
    type: "outgoing",
    kind: "video" as const,
    time: "Today, 9:15 AM",
    missed: false,
    colorIndex: 1,
  },
  {
    name: "Priya Sharma",
    initials: "PS",
    type: "missed",
    kind: "voice" as const,
    time: "Yesterday, 8:45 PM",
    missed: true,
    colorIndex: 4,
  },
  {
    name: "Jordan Williams",
    initials: "JW",
    type: "incoming",
    kind: "voice" as const,
    time: "Yesterday, 3:20 PM",
    missed: false,
    colorIndex: 3,
  },
  {
    name: "Sarah & Mike",
    initials: "SM",
    type: "outgoing",
    kind: "video" as const,
    time: "Mon, 6:00 PM",
    missed: false,
    colorIndex: 5,
  },
];

export default function CallsScreen({ onOpenCall }: CallsScreenProps) {
  const [newCallOpen, setNewCallOpen] = useState(false);
  const [clearLogOpen, setClearLogOpen] = useState(false);
  const [calls, setCalls] = useState(RECENT_CALLS);
  const [showAdvertiseSheet, setShowAdvertiseSheet] = useState(false);
  const [showScheduledSheet, setShowScheduledSheet] = useState(false);
  const [showCallSettingsSheet, setShowCallSettingsSheet] = useState(false);
  const [ringtoneOn, setRingtoneOn] = useState(true);
  const [vibrateOn, setVibrateOn] = useState(true);
  const [callWaitingOn, setCallWaitingOn] = useState(false);
  const [wifiCallingOn, setWifiCallingOn] = useState(false);

  const handleClearLog = () => {
    setCalls([]);
    setClearLogOpen(false);
    toast.success("Call log cleared");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header */}
      <header
        className="sticky top-0 z-50 bg-wa-header px-4 pb-3 flex-shrink-0"
        style={{
          paddingTop: "max(env(safe-area-inset-top, 0px), 44px)",
          overscrollBehavior: "contain",
        }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-wa-header-fg text-[22px] font-bold font-display">
            Calls
          </h1>
          <div className="flex items-center gap-0">
            <button
              type="button"
              data-ocid="calls.search.button"
              className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg transition-colors rounded-full hover:bg-white/10"
              aria-label="Search calls"
            >
              <Search className="w-5 h-5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  data-ocid="calls.menu.button"
                  className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg transition-colors rounded-full hover:bg-white/10"
                  aria-label="More options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 bg-popover border-border shadow-lg z-50"
                data-ocid="calls.dropdown_menu"
              >
                <DropdownMenuItem
                  data-ocid="calls.menu.advertise"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => setShowAdvertiseSheet(true)}
                >
                  Advertise
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="calls.menu.clear_log"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => setClearLogOpen(true)}
                >
                  Clear call log
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="calls.menu.scheduled"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => setShowScheduledSheet(true)}
                >
                  Scheduled calls
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="calls.menu.settings"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => setShowCallSettingsSheet(true)}
                >
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main
        className="flex-1 overflow-y-auto bg-card"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
      >
        <div className="px-4 py-3 border-b border-border">
          <button
            type="button"
            data-ocid="calls.new_call.button"
            onClick={() => setNewCallOpen(true)}
            className="flex items-center gap-3 w-full hover:bg-muted/50 rounded-xl p-2 -mx-2 transition-colors text-left"
          >
            <div className="w-11 h-11 bg-wa-green/15 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-wa-green" />
            </div>
            <p className="font-semibold text-[15px] text-wa-green font-display">
              New Call
            </p>
          </button>
        </div>

        <div className="px-4 py-3">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Recent
          </p>

          {calls.length === 0 && (
            <div
              data-ocid="calls.empty_state"
              className="flex flex-col items-center justify-center py-12 gap-3"
            >
              <Phone className="w-12 h-12 text-muted-foreground/40" />
              <p className="text-[15px] font-semibold text-foreground">
                No recent calls
              </p>
              <p className="text-[13px] text-muted-foreground text-center">
                Your call history will appear here
              </p>
            </div>
          )}

          <div className="space-y-1">
            {calls.map((call, i) => (
              <button
                type="button"
                key={`${call.name}-${i}`}
                data-ocid={`calls.item.${i + 1}`}
                onClick={() =>
                  onOpenCall({
                    name: call.name,
                    initials: call.initials,
                    kind: call.kind,
                    colorIndex: call.colorIndex,
                  })
                }
                className="flex items-center gap-3 py-2 w-full hover:bg-muted/40 rounded-xl px-2 -mx-2 transition-colors text-left"
              >
                <ContactAvatar
                  initials={call.initials}
                  size="md"
                  colorIndex={call.colorIndex}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-[15px] truncate font-display ${call.missed ? "text-destructive" : "text-foreground"}`}
                  >
                    {call.name}
                  </p>
                  <div className="flex items-center gap-1">
                    {call.kind === "video" ? (
                      <Video className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <Phone className="w-3 h-3 text-muted-foreground" />
                    )}
                    <p className="text-[12px] text-muted-foreground truncate">
                      {call.type === "missed"
                        ? "Missed"
                        : call.type === "incoming"
                          ? "Incoming"
                          : "Outgoing"}{" "}
                      · {call.time}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  data-ocid={`calls.call.button.${i + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCall({
                      name: call.name,
                      initials: call.initials,
                      kind: call.kind,
                      colorIndex: call.colorIndex,
                    });
                  }}
                  className="p-2 text-wa-green hover:bg-wa-green/10 rounded-full transition-colors"
                  aria-label={`Call ${call.name}`}
                >
                  {call.kind === "video" ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <Phone className="w-5 h-5" />
                  )}
                </button>
              </button>
            ))}
          </div>
        </div>
      </main>

      <NewCallDialog
        open={newCallOpen}
        onClose={() => setNewCallOpen(false)}
        onCall={onOpenCall}
      />

      {/* Clear call log confirmation */}
      <AlertDialog open={clearLogOpen} onOpenChange={setClearLogOpen}>
        <AlertDialogContent
          data-ocid="calls.clear_log.dialog"
          className="max-w-[320px] rounded-2xl"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Clear call log?</AlertDialogTitle>
            <AlertDialogDescription>
              All recent calls will be removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="calls.clear_log.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="calls.clear_log.confirm_button"
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleClearLog}
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Advertise Sheet */}
      <Sheet open={showAdvertiseSheet} onOpenChange={setShowAdvertiseSheet}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4"
          data-ocid="calls.advertise.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-5">
            <SheetTitle className="text-[17px] font-bold">
              Advertise on WhatsApp
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 bg-[#25D366]/15 rounded-2xl flex items-center justify-center">
              <Megaphone className="w-8 h-8 text-[#25D366]" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-[16px] font-bold text-foreground">
                Reach more customers
              </p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Create ads that send people directly to your WhatsApp chat.
                Connect with more customers and grow your business.
              </p>
            </div>
            <div className="w-full space-y-2 mt-2">
              {[
                "Target the right audience",
                "Get more leads instantly",
                "Track ad performance",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#25D366]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] text-[#25D366] font-bold">
                      ✓
                    </span>
                  </div>
                  <p className="text-[14px] text-foreground">{f}</p>
                </div>
              ))}
            </div>
          </div>
          <Button
            data-ocid="calls.advertise.learn_more.button"
            className="w-full mt-4 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            onClick={() => {
              toast.success("Opening WhatsApp Ads...");
              setShowAdvertiseSheet(false);
            }}
          >
            Learn More
          </Button>
        </SheetContent>
      </Sheet>

      {/* Scheduled Calls Sheet */}
      <Sheet open={showScheduledSheet} onOpenChange={setShowScheduledSheet}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4"
          data-ocid="calls.scheduled.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[17px] font-bold">
              Scheduled Calls
            </SheetTitle>
          </SheetHeader>
          <div
            data-ocid="calls.scheduled.empty_state"
            className="flex flex-col items-center py-10 gap-3"
          >
            <CalendarClock className="w-14 h-14 text-muted-foreground/40" />
            <p className="text-[15px] font-semibold text-foreground">
              No scheduled calls
            </p>
            <p className="text-[13px] text-muted-foreground text-center">
              Schedule a call with your contacts to get a reminder.
            </p>
            <Button
              data-ocid="calls.scheduled.schedule.button"
              className="mt-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
              onClick={() => {
                toast.success("Call scheduling coming soon!");
                setShowScheduledSheet(false);
              }}
            >
              Schedule a Call
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Call Settings Sheet */}
      <Sheet
        open={showCallSettingsSheet}
        onOpenChange={setShowCallSettingsSheet}
      >
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4"
          data-ocid="calls.settings.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[17px] font-bold flex items-center gap-2">
              <Settings2 className="w-5 h-5" /> Call Settings
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            {[
              {
                label: "Ringtone",
                desc: "Play ringtone on incoming calls",
                val: ringtoneOn,
                set: setRingtoneOn,
                id: "ringtone",
              },
              {
                label: "Vibrate",
                desc: "Vibrate on incoming calls",
                val: vibrateOn,
                set: setVibrateOn,
                id: "vibrate",
              },
              {
                label: "Call waiting",
                desc: "Notify about calls during active call",
                val: callWaitingOn,
                set: setCallWaitingOn,
                id: "call_waiting",
              },
              {
                label: "Wi-Fi calling",
                desc: "Make calls over Wi-Fi",
                val: wifiCallingOn,
                set: setWifiCallingOn,
                id: "wifi_calling",
              },
            ].map(({ label, desc, val, set, id }) => (
              <div key={id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[15px] font-semibold text-foreground">
                    {label}
                  </p>
                  <p className="text-[12px] text-muted-foreground">{desc}</p>
                </div>
                <Switch
                  data-ocid={`calls.settings.${id}.switch`}
                  checked={val}
                  onCheckedChange={set}
                />
              </div>
            ))}
          </div>
          <Button
            data-ocid="calls.settings.save_button"
            className="w-full mt-6 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            onClick={() => {
              toast.success("Call settings saved");
              setShowCallSettingsSheet(false);
            }}
          >
            Save Settings
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
