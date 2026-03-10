import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

interface NotificationSettingsSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  contactId: string;
  contactName: string;
}

interface NotifSettings {
  tone: string;
  vibration: boolean;
  popup: boolean;
}

function loadNotifSettings(contactId: string): NotifSettings {
  try {
    const raw = localStorage.getItem(`notifSettings_${contactId}`);
    if (raw) return JSON.parse(raw) as NotifSettings;
  } catch {}
  return { tone: "default", vibration: true, popup: true };
}

export default function NotificationSettingsSheet({
  open,
  onOpenChange,
  contactId,
  contactName,
}: NotificationSettingsSheetProps) {
  const [settings, setSettings] = useState<NotifSettings>(() =>
    loadNotifSettings(contactId),
  );

  const update = (updates: Partial<NotifSettings>) => {
    const next = { ...settings, ...updates };
    setSettings(next);
    localStorage.setItem(`notifSettings_${contactId}`, JSON.stringify(next));
    toast.success("Notification settings saved");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-5 pb-8 pt-4"
        data-ocid="notif.sheet"
      >
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
        <SheetHeader className="mb-5">
          <SheetTitle className="text-[17px] font-bold">
            Notifications for {contactName}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5">
          <div>
            <Label className="text-[13px] text-muted-foreground mb-2 block">
              Notification tone
            </Label>
            <Select
              value={settings.tone}
              onValueChange={(v) => update({ tone: v })}
            >
              <SelectTrigger data-ocid="notif.select" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="chime">Chime</SelectItem>
                <SelectItem value="bell">Bell</SelectItem>
                <SelectItem value="pop">Pop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-medium text-foreground">
                Vibration
              </p>
              <p className="text-[12px] text-muted-foreground">
                Vibrate when notified
              </p>
            </div>
            <Switch
              data-ocid="notif.vibration.switch"
              checked={settings.vibration}
              onCheckedChange={(v) => update({ vibration: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-medium text-foreground">
                Popup notifications
              </p>
              <p className="text-[12px] text-muted-foreground">
                Show notification popups
              </p>
            </div>
            <Switch
              data-ocid="notif.popup.switch"
              checked={settings.popup}
              onCheckedChange={(v) => update({ popup: v })}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
