import { Copy, Forward, Reply, Smile, Trash2, X } from "lucide-react";

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
}

interface MessageContextMenuProps {
  message: ChatMessage;
  onClose: () => void;
  onReply: (msg: ChatMessage) => void;
  onCopy: (msg: ChatMessage) => void;
  onForward: (msg: ChatMessage) => void;
  onDelete: (msg: ChatMessage) => void;
  onReact: (msg: ChatMessage) => void;
}

const MENU_ACTIONS = [
  { id: "reply", label: "Reply", Icon: Reply, color: "text-foreground" },
  { id: "copy", label: "Copy", Icon: Copy, color: "text-foreground" },
  { id: "react", label: "React", Icon: Smile, color: "text-foreground" },
  { id: "forward", label: "Forward", Icon: Forward, color: "text-foreground" },
  { id: "delete", label: "Delete", Icon: Trash2, color: "text-destructive" },
];

export default function MessageContextMenu({
  message,
  onClose,
  onReply,
  onCopy,
  onForward,
  onDelete,
  onReact,
}: MessageContextMenuProps) {
  const handleAction = (id: string) => {
    switch (id) {
      case "reply":
        onReply(message);
        break;
      case "copy":
        onCopy(message);
        break;
      case "forward":
        onForward(message);
        break;
      case "delete":
        onDelete(message);
        break;
      case "react":
        onReact(message);
        break;
    }
    onClose();
  };

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
        data-ocid="chat.context_menu.sheet"
        className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl animate-slide-up"
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Message preview */}
        <div className="px-4 py-2 border-b border-border">
          <p className="text-[12px] text-muted-foreground truncate">
            {message.type === "voice" ? "🎤 Voice message" : message.content}
          </p>
        </div>

        {/* Actions */}
        <div className="py-1">
          {MENU_ACTIONS.map((action, i) => {
            const Icon = action.Icon;
            const isLast = i === MENU_ACTIONS.length - 1;
            return (
              <div key={action.id}>
                <button
                  type="button"
                  data-ocid={`chat.context.${action.id}.button`}
                  onClick={() => handleAction(action.id)}
                  className={`flex items-center gap-4 w-full px-5 py-3.5 hover:bg-muted/60 transition-colors text-left ${action.color}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-[15px] font-medium">
                    {action.label}
                  </span>
                </button>
                {!isLast && <div className="h-px bg-border/60 ml-[52px]" />}
              </div>
            );
          })}
        </div>

        {/* Cancel */}
        <div className="px-4 py-3 border-t border-border">
          <button
            type="button"
            data-ocid="chat.context_menu.close_button"
            onClick={onClose}
            className="flex items-center gap-4 w-full px-1 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5 flex-shrink-0" />
            <span className="text-[15px] font-medium">Cancel</span>
          </button>
        </div>

        {/* Safe area */}
        <div style={{ height: "env(safe-area-inset-bottom, 8px)" }} />
      </div>
    </>
  );
}
