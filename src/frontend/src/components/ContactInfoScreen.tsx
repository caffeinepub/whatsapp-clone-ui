import {
  ArrowLeft,
  Bell,
  BellOff,
  Flag,
  MessageCircle,
  Phone,
  PhoneOff,
  Search,
  Shield,
  Star,
  Video,
} from "lucide-react";
import { useState } from "react";
import ContactAvatar from "./ContactAvatar";

interface ContactInfoScreenProps {
  open: boolean;
  onClose: () => void;
  contactName: string;
  contactInitials: string;
  colorIndex: number;
  onStartCall?: (type: "voice" | "video") => void;
  onOpenSearch?: () => void;
}

const MEDIA_PLACEHOLDERS = [
  { emoji: "🏖️", bg: "bg-amber-200" },
  { emoji: "🌸", bg: "bg-pink-200" },
  { emoji: "🎨", bg: "bg-purple-200" },
  { emoji: "🍕", bg: "bg-orange-200" },
];

export default function ContactInfoScreen({
  open,
  onClose,
  contactName,
  contactInitials,
  colorIndex,
  onStartCall,
  onOpenSearch,
}: ContactInfoScreenProps) {
  const [muted, setMuted] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);

  if (!open) return null;

  return (
    <div
      data-ocid="contact_info.panel"
      className="absolute inset-0 z-40 flex flex-col bg-secondary/20 animate-slide-up"
    >
      {/* Profile photo area */}
      <div className="relative bg-wa-header flex-shrink-0">
        <div
          className="relative w-full bg-gradient-to-b from-transparent to-black/70 flex flex-col justify-end pb-4 px-4"
          style={{
            paddingTop: "max(env(safe-area-inset-top, 0px), 16px)",
            minHeight: "220px",
          }}
        >
          {/* Back button */}
          <button
            type="button"
            data-ocid="contact_info.back.button"
            onClick={onClose}
            className="absolute top-4 left-4 p-2 text-white rounded-full hover:bg-black/20 transition-colors"
            style={{ top: "max(env(safe-area-inset-top, 0px), 16px)" }}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div className="flex flex-col items-center justify-center flex-1 pt-6 pb-2">
            <ContactAvatar
              initials={contactInitials}
              size="xl"
              colorIndex={colorIndex}
            />
          </div>

          {/* Name + phone */}
          <div className="text-center pb-2">
            <h1 className="text-white text-[22px] font-bold">{contactName}</h1>
            <p className="text-white/70 text-[14px]">+1 (555) 234-5678</p>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* 4 action buttons */}
        <div className="bg-card mx-3 mt-3 rounded-2xl p-4 flex items-center justify-around">
          <button
            type="button"
            data-ocid="contact_info.message.button"
            className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity"
            onClick={onClose}
          >
            <div className="w-11 h-11 bg-wa-teal/10 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-wa-teal" />
            </div>
            <span className="text-[11px] text-muted-foreground">Message</span>
          </button>

          <button
            type="button"
            data-ocid="contact_info.call.button"
            className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity"
            onClick={() => onStartCall?.("voice")}
          >
            <div className="w-11 h-11 bg-wa-teal/10 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-wa-teal" />
            </div>
            <span className="text-[11px] text-muted-foreground">Voice</span>
          </button>

          <button
            type="button"
            data-ocid="contact_info.video.button"
            className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity"
            onClick={() => onStartCall?.("video")}
          >
            <div className="w-11 h-11 bg-wa-teal/10 rounded-full flex items-center justify-center">
              <Video className="w-5 h-5 text-wa-teal" />
            </div>
            <span className="text-[11px] text-muted-foreground">Video</span>
          </button>

          <button
            type="button"
            data-ocid="contact_info.search.button"
            className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity"
            onClick={() => {
              onOpenSearch?.();
              onClose();
            }}
          >
            <div className="w-11 h-11 bg-wa-teal/10 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-wa-teal" />
            </div>
            <span className="text-[11px] text-muted-foreground">Search</span>
          </button>
        </div>

        {/* About */}
        <div className="bg-card mx-3 mt-3 rounded-2xl px-4 py-3">
          <p className="text-[12px] font-semibold text-wa-teal mb-1">About</p>
          <p className="text-[14px] text-foreground">
            Hey there! I am using WhatsApp
          </p>
        </div>

        {/* Media, links and docs */}
        <div className="bg-card mx-3 mt-3 rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[14px] font-semibold text-foreground">
              Media, links and docs
            </p>
            <button
              type="button"
              className="text-[13px] text-wa-teal font-medium"
            >
              View all
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {MEDIA_PLACEHOLDERS.map((item, i) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: stable list
                key={i}
                type="button"
                data-ocid={`contact_info.media.item.${i + 1}`}
                className={`aspect-square rounded-lg ${item.bg} flex items-center justify-center text-2xl hover:opacity-90 transition-opacity`}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Starred messages */}
        <div className="bg-card mx-3 mt-3 rounded-2xl">
          <button
            type="button"
            data-ocid="contact_info.starred.button"
            className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-muted/40 rounded-2xl transition-colors"
          >
            <Star className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left text-[15px] text-foreground">
              Starred messages
            </span>
            <span className="text-[13px] text-muted-foreground">›</span>
          </button>
        </div>

        {/* Mute notifications */}
        <div className="bg-card mx-3 mt-3 rounded-2xl">
          <div className="flex items-center gap-3 px-4 py-3.5">
            {muted ? (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Bell className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="flex-1 text-[15px] text-foreground">
              Mute notifications
            </span>
            <button
              type="button"
              data-ocid="contact_info.mute.toggle"
              onClick={() => setMuted((m) => !m)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                muted ? "bg-wa-green" : "bg-muted"
              }`}
              aria-label="Toggle mute"
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  muted ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Block / Report */}
        <div className="bg-card mx-3 mt-3 rounded-2xl overflow-hidden">
          {/* Block */}
          <button
            type="button"
            data-ocid="contact_info.block.button"
            onClick={() => setShowBlockConfirm(true)}
            className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <PhoneOff className="w-5 h-5 text-destructive" />
            <span className="flex-1 text-left text-[15px] text-destructive">
              Block {contactName}
            </span>
          </button>
          <div className="h-px bg-border mx-4" />
          {/* Report */}
          <button
            type="button"
            data-ocid="contact_info.report.button"
            onClick={() => setShowReportConfirm(true)}
            className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <Flag className="w-5 h-5 text-destructive" />
            <span className="flex-1 text-left text-[15px] text-destructive">
              Report {contactName}
            </span>
          </button>
        </div>

        {/* Spacer */}
        <div className="h-6" />
      </div>

      {/* Block confirm dialog */}
      {showBlockConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-8">
          <div
            data-ocid="contact_info.block.dialog"
            className="bg-card rounded-2xl p-6 w-full max-w-xs"
          >
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-destructive" />
              <h3 className="font-bold text-[16px] text-foreground">
                Block {contactName}?
              </h3>
            </div>
            <p className="text-[13px] text-muted-foreground mb-4">
              Blocked contacts can no longer send you messages, see your last
              seen, or call you.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                data-ocid="contact_info.block.cancel_button"
                onClick={() => setShowBlockConfirm(false)}
                className="flex-1 py-2.5 rounded-full border border-border text-[14px] font-semibold text-foreground hover:bg-muted/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="contact_info.block.confirm_button"
                onClick={() => setShowBlockConfirm(false)}
                className="flex-1 py-2.5 rounded-full bg-destructive text-white text-[14px] font-semibold hover:opacity-90 transition-opacity"
              >
                Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report confirm dialog */}
      {showReportConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-8">
          <div
            data-ocid="contact_info.report.dialog"
            className="bg-card rounded-2xl p-6 w-full max-w-xs"
          >
            <div className="flex items-center gap-3 mb-3">
              <Flag className="w-6 h-6 text-destructive" />
              <h3 className="font-bold text-[16px] text-foreground">
                Report {contactName}?
              </h3>
            </div>
            <p className="text-[13px] text-muted-foreground mb-4">
              The last 5 messages will be forwarded to WhatsApp. This contact
              will not be notified.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                data-ocid="contact_info.report.cancel_button"
                onClick={() => setShowReportConfirm(false)}
                className="flex-1 py-2.5 rounded-full border border-border text-[14px] font-semibold text-foreground hover:bg-muted/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="contact_info.report.confirm_button"
                onClick={() => setShowReportConfirm(false)}
                className="flex-1 py-2.5 rounded-full bg-destructive text-white text-[14px] font-semibold hover:opacity-90 transition-opacity"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
