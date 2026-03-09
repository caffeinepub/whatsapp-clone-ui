import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone, Video } from "lucide-react";
import type { ActiveCall } from "../hooks/useAppState";
import ContactAvatar from "./ContactAvatar";

interface NewCallDialogProps {
  open: boolean;
  onClose: () => void;
  onCall: (contact: ActiveCall) => void;
}

const CONTACTS = [
  { name: "Emma Rodriguez", initials: "ER", colorIndex: 0 },
  { name: "Marcus Chen", initials: "MC", colorIndex: 1 },
  { name: "Priya Sharma", initials: "PS", colorIndex: 4 },
  { name: "Jordan Williams", initials: "JW", colorIndex: 3 },
  { name: "Sarah & Mike", initials: "SM", colorIndex: 5 },
];

export default function NewCallDialog({
  open,
  onClose,
  onCall,
}: NewCallDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        data-ocid="calls.dialog"
        className="max-w-[360px] mx-4 rounded-2xl"
      >
        <DialogHeader>
          <DialogTitle className="font-display">New Call</DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-1">
          {CONTACTS.map((contact, i) => (
            <div
              key={contact.name}
              data-ocid={`calls.contact.item.${i + 1}`}
              className="flex items-center gap-3 py-2 px-1"
            >
              <ContactAvatar
                initials={contact.initials}
                size="md"
                colorIndex={contact.colorIndex}
              />
              <p className="flex-1 font-semibold text-[15px] text-foreground font-display truncate">
                {contact.name}
              </p>
              <Button
                type="button"
                data-ocid={`calls.voice.button.${i + 1}`}
                size="icon"
                variant="ghost"
                onClick={() => {
                  onCall({ ...contact, kind: "voice" });
                  onClose();
                }}
                aria-label={`Voice call ${contact.name}`}
                className="text-wa-green hover:bg-wa-green/10"
              >
                <Phone className="w-5 h-5" />
              </Button>
              <Button
                type="button"
                data-ocid={`calls.video.button.${i + 1}`}
                size="icon"
                variant="ghost"
                onClick={() => {
                  onCall({ ...contact, kind: "video" });
                  onClose();
                }}
                aria-label={`Video call ${contact.name}`}
                className="text-wa-green hover:bg-wa-green/10"
              >
                <Video className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
