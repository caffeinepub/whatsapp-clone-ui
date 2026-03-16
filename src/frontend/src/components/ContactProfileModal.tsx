import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Ban,
  BellOff,
  Flag,
  Info,
  MessageCircle,
  Phone,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import ContactAvatar from "./ContactAvatar";

interface ContactProfileModalProps {
  open: boolean;
  onClose: () => void;
  contactName: string;
  contactInitials: string;
  avatarUrl?: string | null;
  about?: string;
  colorIndex?: number;
  onMessage?: () => void;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
}

export default function ContactProfileModal({
  open,
  onClose,
  contactName,
  contactInitials,
  avatarUrl,
  about = "Hey there! I am using WhatsApp.",
  colorIndex = 0,
  onMessage,
  onVoiceCall,
  onVideoCall,
}: ContactProfileModalProps) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl p-0 max-h-[90vh] overflow-y-auto bg-card border-0"
        data-ocid="contact.profile.sheet"
      >
        {/* Photo Hero */}
        <div className="relative w-full h-56 bg-gradient-to-br from-emerald-600 via-teal-500 to-green-700 flex items-end">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={contactName}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ContactAvatar
                initials={contactInitials}
                size="lg"
                colorIndex={colorIndex}
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {/* Close button */}
          <button
            type="button"
            data-ocid="contact.profile.close_button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white z-10"
          >
            <X className="w-4 h-4" />
          </button>
          {/* Name over photo */}
          <div className="relative z-10 px-5 pb-4">
            <h2 className="text-white text-[22px] font-bold leading-tight">
              {contactName}
            </h2>
          </div>
        </div>

        {/* About */}
        <div className="px-5 py-4 border-b border-border">
          <p className="text-[11px] text-wa-green font-semibold uppercase tracking-wider mb-1">
            About
          </p>
          <p className="text-[14px] text-foreground">{about}</p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-around px-4 py-5 border-b border-border"
        >
          {[
            {
              icon: MessageCircle,
              label: "Message",
              color: "bg-wa-green",
              ocid: "contact.profile.message.button",
              action: () => {
                onMessage?.();
                onClose();
              },
            },
            {
              icon: Phone,
              label: "Audio",
              color: "bg-blue-500",
              ocid: "contact.profile.call.button",
              action: () => {
                onVoiceCall?.();
                onClose();
              },
            },
            {
              icon: Video,
              label: "Video",
              color: "bg-blue-600",
              ocid: "contact.profile.video.button",
              action: () => {
                onVideoCall?.();
                onClose();
              },
            },
            {
              icon: Info,
              label: "Info",
              color: "bg-muted",
              ocid: "contact.profile.info.button",
              action: () => toast.success("Contact info opened"),
            },
          ].map(({ icon: Icon, label, color, ocid, action }) => (
            <button
              key={label}
              type="button"
              data-ocid={ocid}
              onClick={action}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={`w-12 h-12 rounded-full ${color} flex items-center justify-center shadow-md`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </button>
          ))}
        </motion.div>

        {/* More Options */}
        <div className="px-2 py-2">
          {[
            {
              icon: BellOff,
              label: "Mute Notifications",
              ocid: "contact.profile.mute.button",
              destructive: false,
            },
            {
              icon: Ban,
              label: "Block",
              ocid: "contact.profile.block.button",
              destructive: true,
            },
            {
              icon: Flag,
              label: "Report",
              ocid: "contact.profile.report.button",
              destructive: true,
            },
            {
              icon: Trash2,
              label: "Clear Chat",
              ocid: "contact.profile.delete_button",
              destructive: true,
            },
          ].map(({ icon: Icon, label, ocid, destructive }) => (
            <button
              key={label}
              type="button"
              data-ocid={ocid}
              onClick={() => {
                toast.success(`${label} action triggered`);
                onClose();
              }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 hover:bg-muted/50 rounded-xl transition-colors text-left ${
                destructive ? "text-destructive" : "text-foreground"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-[14px] font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Bottom safe area */}
        <div className="h-6" />
      </SheetContent>
    </Sheet>
  );
}
