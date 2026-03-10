import {
  Copy,
  Forward,
  Languages,
  Pin,
  Reply,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface ChatMessage {
  id: string;
  content: string;
  isSent: boolean;
  time: string;
  type?: "text" | "voice" | "image";
  replyTo?: { id: string; content: string; isSent: boolean } | null;
  reactions?: string[];
  tickState?: "none" | "single" | "double" | "seen";
  voiceDuration?: string;
  imageUrl?: string;
  deletedForEveryone?: boolean;
  starred?: boolean;
}

interface MessageContextMenuProps {
  message: ChatMessage;
  onClose: () => void;
  onReply: (msg: ChatMessage) => void;
  onCopy: (msg: ChatMessage) => void;
  onForward: (msg: ChatMessage) => void;
  onDelete: (msg: ChatMessage) => void;
  onDeleteForEveryone: (msg: ChatMessage) => void;
  onReact: (msg: ChatMessage) => void;
  onPin?: (msg: ChatMessage) => void;
  onTranslate?: (msg: ChatMessage) => void;
  onStar?: (msg: ChatMessage) => void;
}

const REACTION_EMOJIS = ["❤️", "👍", "😂", "😮", "😢", "🙏"];

const BASE_ACTIONS = [
  { id: "reply", label: "Reply", Icon: Reply, color: "text-foreground" },
  { id: "forward", label: "Forward", Icon: Forward, color: "text-foreground" },
  { id: "pin", label: "Pin", Icon: Pin, color: "text-foreground" },
  { id: "star", label: "Star", Icon: Star, color: "text-foreground" },
  {
    id: "translate",
    label: "Translate",
    Icon: Languages,
    color: "text-foreground",
  },
  { id: "copy", label: "Copy", Icon: Copy, color: "text-foreground" },
  { id: "delete", label: "Delete", Icon: Trash2, color: "text-destructive" },
];

export default function MessageContextMenu({
  message,
  onClose,
  onReply,
  onCopy,
  onForward,
  onDelete,
  onDeleteForEveryone,
  onReact,
  onPin,
  onTranslate,
  onStar,
}: MessageContextMenuProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAction = (id: string) => {
    switch (id) {
      case "reply":
        onReply(message);
        onClose();
        break;
      case "copy":
        onCopy(message);
        onClose();
        break;
      case "forward":
        onForward(message);
        onClose();
        break;
      case "delete":
        setShowDeleteConfirm(true);
        break;
      case "pin":
        onPin?.(message);
        onClose();
        break;
      case "translate":
        onTranslate?.(message);
        onClose();
        break;
      case "star":
        if (onStar) {
          onStar(message);
        } else {
          toast.success(
            message.starred ? "Message unstarred" : "Message starred",
          );
        }
        onClose();
        break;
    }
  };

  if (showDeleteConfirm) {
    return (
      <>
        <div
          className="absolute inset-0 z-50 bg-black/50"
          onClick={onClose}
          role="button"
          tabIndex={-1}
          aria-label="Close"
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        />
        <div
          className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-background rounded-2xl shadow-2xl p-5"
          data-ocid="chat.delete.dialog"
        >
          <h3 className="text-[16px] font-bold text-foreground mb-2">
            Delete message?
          </h3>
          <p className="text-[13px] text-muted-foreground mb-5">
            This action cannot be undone.
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              data-ocid="chat.delete_for_everyone.button"
              onClick={() => {
                onDeleteForEveryone(message);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-destructive text-destructive-foreground text-[14px] font-semibold hover:brightness-95 transition-all"
            >
              Delete for Everyone
            </button>
            <button
              type="button"
              data-ocid="chat.delete_for_me.button"
              onClick={() => {
                onDelete(message);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-muted text-foreground text-[14px] font-semibold hover:bg-muted/70 transition-all"
            >
              Delete for Me
            </button>
            <button
              type="button"
              data-ocid="chat.delete.cancel_button"
              onClick={() => setShowDeleteConfirm(false)}
              className="w-full py-3 rounded-xl bg-transparent text-muted-foreground text-[14px] font-semibold hover:bg-muted/40 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="absolute inset-0 z-50 bg-black/50"
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-label="Close context menu"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />
      <div
        className={`absolute ${
          message.isSent ? "right-4" : "left-4"
        } top-1/2 -translate-y-1/2 z-50 bg-background rounded-2xl shadow-2xl py-1 min-w-[180px] max-h-[80vh] overflow-y-auto`}
        data-ocid="chat.context.dropdown_menu"
      >
        {/* Emoji reaction bar at top */}
        <div className="flex items-center justify-around px-3 py-2.5 border-b border-border">
          {REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              data-ocid="chat.context.react.button"
              onClick={() => {
                onReact({ ...message, content: emoji });
                onClose();
              }}
              className="text-[22px] w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted/60 active:scale-125 transition-all"
              aria-label={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Message preview */}
        <div className="px-3 py-2 border-b border-border">
          <p className="text-[11px] text-muted-foreground font-medium truncate max-w-[200px]">
            {message.content.slice(0, 40)}
            {message.content.length > 40 ? "..." : ""}
          </p>
        </div>

        {BASE_ACTIONS.map(({ id, label, Icon, color }) => (
          <button
            type="button"
            key={id}
            data-ocid={`chat.context.${id}.button`}
            onClick={() => handleAction(id)}
            className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/50 transition-colors text-left ${
              id === "delete" ? "border-t border-border" : ""
            }`}
          >
            <Icon
              className={`w-4 h-4 flex-shrink-0 ${
                id === "star" && message.starred
                  ? "text-amber-400 fill-amber-400"
                  : color
              }`}
            />
            <span className={`text-[14px] ${color}`}>
              {id === "star" ? (message.starred ? "Unstar" : "Star") : label}
            </span>
          </button>
        ))}
        <button
          type="button"
          data-ocid="chat.context.close_button"
          onClick={onClose}
          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/50 transition-colors text-left border-t border-border"
        >
          <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-[14px] text-muted-foreground">Close</span>
        </button>
      </div>
    </>
  );
}
