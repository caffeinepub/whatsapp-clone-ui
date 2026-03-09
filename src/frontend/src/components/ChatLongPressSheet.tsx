import {
  Archive,
  Bell,
  BellOff,
  BookmarkX,
  MessageCircle,
  Pin,
  PinOff,
  Trash2,
  X,
} from "lucide-react";

interface ChatLongPressSheetProps {
  open: boolean;
  contactName: string;
  isPinned: boolean;
  isMuted: boolean;
  isUnread: boolean;
  onClose: () => void;
  onArchive: () => void;
  onMute: () => void;
  onDelete: () => void;
  onPin: () => void;
  onMarkUnread: () => void;
}

export default function ChatLongPressSheet({
  open,
  contactName,
  isPinned,
  isMuted,
  isUnread,
  onClose,
  onArchive,
  onMute,
  onDelete,
  onPin,
  onMarkUnread,
}: ChatLongPressSheetProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-40 bg-black/40"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close menu"
      />

      {/* Bottom sheet */}
      <div
        data-ocid="chat_longpress.sheet"
        className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl animate-slide-up overflow-hidden"
      >
        {/* Handle + title */}
        <div className="flex flex-col items-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mb-3" />
          <p className="text-[13px] text-muted-foreground px-4 truncate max-w-full">
            {contactName}
          </p>
        </div>

        <div className="px-2 py-1">
          <button
            type="button"
            data-ocid="chat_longpress.archive.button"
            onClick={onArchive}
            className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-muted/60 rounded-xl transition-colors text-left"
          >
            <Archive className="w-5 h-5 text-muted-foreground" />
            <span className="text-[15px] text-foreground">Archive chat</span>
          </button>

          <button
            type="button"
            data-ocid="chat_longpress.mute.button"
            onClick={onMute}
            className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-muted/60 rounded-xl transition-colors text-left"
          >
            {isMuted ? (
              <Bell className="w-5 h-5 text-muted-foreground" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="text-[15px] text-foreground">
              {isMuted ? "Unmute notifications" : "Mute notifications"}
            </span>
          </button>

          <button
            type="button"
            data-ocid="chat_longpress.delete.button"
            onClick={onDelete}
            className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors text-left"
          >
            <Trash2 className="w-5 h-5 text-destructive" />
            <span className="text-[15px] text-destructive">Delete chat</span>
          </button>

          <button
            type="button"
            data-ocid="chat_longpress.pin.button"
            onClick={onPin}
            className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-muted/60 rounded-xl transition-colors text-left"
          >
            {isPinned ? (
              <PinOff className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Pin className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="text-[15px] text-foreground">
              {isPinned ? "Unpin from top" : "Pin to top"}
            </span>
          </button>

          <button
            type="button"
            data-ocid="chat_longpress.unread.button"
            onClick={onMarkUnread}
            className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-muted/60 rounded-xl transition-colors text-left"
          >
            {isUnread ? (
              <MessageCircle className="w-5 h-5 text-muted-foreground" />
            ) : (
              <BookmarkX className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="text-[15px] text-foreground">
              {isUnread ? "Mark as read" : "Mark as unread"}
            </span>
          </button>
        </div>

        {/* Cancel */}
        <div className="px-4 pt-1 pb-3 border-t border-border mt-1">
          <button
            type="button"
            data-ocid="chat_longpress.cancel.button"
            onClick={onClose}
            className="flex items-center gap-3 w-full px-2 py-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted/60"
          >
            <X className="w-5 h-5" />
            <span className="text-[15px] font-medium">Cancel</span>
          </button>
        </div>
        <div style={{ height: "env(safe-area-inset-bottom, 8px)" }} />
      </div>
    </>
  );
}
