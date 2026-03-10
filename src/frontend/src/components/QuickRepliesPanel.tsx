import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const DEFAULT_QUICK_REPLIES = [
  "Thank you for your message!",
  "We'll get back to you shortly.",
  "Please hold on.",
  "Your order is confirmed.",
  "How can I help you today?",
];

export function getQuickReplies(): string[] {
  try {
    const stored = localStorage.getItem("wa_quick_replies");
    if (stored) return JSON.parse(stored) as string[];
  } catch {}
  return DEFAULT_QUICK_REPLIES;
}

export function saveQuickReplies(replies: string[]) {
  localStorage.setItem("wa_quick_replies", JSON.stringify(replies));
}

interface QuickRepliesPanelProps {
  open: boolean;
  onClose: () => void;
  onSelect: (text: string) => void;
}

export default function QuickRepliesPanel({
  open,
  onClose,
  onSelect,
}: QuickRepliesPanelProps) {
  const replies = getQuickReplies();

  return (
    <AnimatePresence>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
            role="button"
            tabIndex={-1}
            aria-label="Close quick replies"
          />
          <motion.div
            data-ocid="chat.quickreplies.panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl max-h-[60vh] flex flex-col"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-[18px]">⚡</span>
                <span className="text-[15px] font-bold text-foreground">
                  Quick Replies
                </span>
              </div>
              <button
                type="button"
                data-ocid="chat.quickreplies.close_button"
                onClick={onClose}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Replies list */}
            <div className="overflow-y-auto flex-1 py-1">
              {replies.length === 0 ? (
                <div
                  data-ocid="chat.quickreplies.empty_state"
                  className="flex flex-col items-center py-8 text-muted-foreground"
                >
                  <span className="text-3xl mb-2">⚡</span>
                  <p className="text-[14px]">No quick replies yet</p>
                </div>
              ) : (
                replies.map((reply, i) => (
                  <button
                    key={reply}
                    type="button"
                    data-ocid={`chat.quickreplies.item.${i + 1}`}
                    onClick={() => {
                      onSelect(reply);
                      onClose();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-muted/60 transition-colors border-b border-border/50 last:border-0"
                  >
                    <p className="text-[14px] text-foreground leading-snug">
                      {reply}
                    </p>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
