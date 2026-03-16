import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    sender: "Alice",
    initials: "AL",
    message: "Hey, are you free tonight? 😊",
    time: "now",
    color: "bg-emerald-600",
    type: "message",
  },
  {
    id: 2,
    sender: "Bob",
    initials: "BO",
    message: "Missed call from Bob",
    time: "2m",
    color: "bg-blue-600",
    type: "call",
  },
  {
    id: 3,
    sender: "Developers 💻",
    initials: "DV",
    message: "@you was mentioned in Developers",
    time: "5m",
    color: "bg-violet-600",
    type: "mention",
  },
  {
    id: 4,
    sender: "WhatsApp Pay",
    initials: "₹",
    message: "Payment received ₹500 from Raj",
    time: "10m",
    color: "bg-orange-500",
    type: "payment",
  },
  {
    id: 5,
    sender: "Priya",
    initials: "PR",
    message: "🔵 New status update from Priya",
    time: "15m",
    color: "bg-rose-600",
    type: "status",
  },
];

interface Notification {
  id: number;
  sender: string;
  initials: string;
  message: string;
  time: string;
  color: string;
  type: string;
}

interface PushNotificationTrayProps {
  open: boolean;
  onClose: () => void;
}

export default function PushNotificationTray({
  open,
  onClose,
}: PushNotificationTrayProps) {
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactedRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    interactedRef.current = false;
    autoCloseRef.current = setTimeout(() => {
      if (!interactedRef.current) onClose();
    }, 8000);
    return () => {
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    };
  }, [open, onClose]);

  const markInteracted = () => {
    interactedRef.current = true;
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
  };

  const dismiss = (id: number) => {
    markInteracted();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    onClose();
  };

  const handleReply = (id: number) => {
    markInteracted();
    if (!replyText.trim()) return;
    toast.success("Reply sent!");
    setReplyText("");
    setReplyingId(null);
    dismiss(id);
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "call":
        return "📞";
      case "mention":
        return "@";
      case "payment":
        return "💸";
      case "status":
        return "⭕";
      default:
        return "💬";
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop - tap to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[70] bg-black/20"
            onClick={onClose}
          />
          <motion.div
            data-ocid="notifications.tray"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 left-0 right-0 z-[80] bg-card/95 backdrop-blur-md border-b border-border shadow-2xl"
            style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
            onPointerDown={markInteracted}
          >
            {/* Tray Header */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <p className="text-[14px] font-bold text-foreground">
                Notifications
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  data-ocid="notifications.clear_all.button"
                  onClick={clearAll}
                  className="text-[12px] text-wa-green font-semibold hover:opacity-80 transition-opacity"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  data-ocid="notifications.tray.close_button"
                  onClick={onClose}
                  className="text-muted-foreground text-[20px] leading-none hover:opacity-80"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            {notifications.length === 0 ? (
              <div
                data-ocid="notifications.empty_state"
                className="py-6 text-center"
              >
                <p className="text-[13px] text-muted-foreground">
                  No new notifications
                </p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                <AnimatePresence initial={false}>
                  {notifications.map((n) => (
                    <motion.div
                      key={n.id}
                      data-ocid={`notifications.item.${n.id}`}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{
                        opacity: 0,
                        x: 20,
                        height: 0,
                        marginBottom: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                      }}
                      className="px-4 py-2.5 border-b border-border/50 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${n.color} flex items-center justify-center flex-shrink-0 shadow`}
                        >
                          <span className="text-white text-[11px] font-bold">
                            {n.type !== "message"
                              ? typeIcon(n.type)
                              : n.initials}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-[13px] font-semibold text-foreground truncate">
                              {n.sender}
                            </p>
                            <span className="text-[11px] text-muted-foreground ml-2 flex-shrink-0">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                          {replyingId === n.id ? (
                            <div className="flex gap-2 mt-2">
                              <input
                                data-ocid="notifications.reply.input"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleReply(n.id)
                                }
                                placeholder="Write a reply..."
                                className="flex-1 bg-muted/70 rounded-full px-3 py-1.5 text-[12px] text-foreground outline-none border border-border focus:border-wa-green transition-colors"
                              />
                              <button
                                type="button"
                                data-ocid="notifications.reply.submit_button"
                                onClick={() => handleReply(n.id)}
                                className="bg-wa-green text-white text-[12px] font-semibold px-3 py-1.5 rounded-full"
                              >
                                Send
                              </button>
                              <button
                                type="button"
                                data-ocid="notifications.reply.cancel_button"
                                onClick={() => {
                                  setReplyingId(null);
                                  setReplyText("");
                                }}
                                className="text-muted-foreground text-[12px] px-2 py-1.5"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2 mt-2">
                              {n.type === "message" || n.type === "mention" ? (
                                <button
                                  type="button"
                                  data-ocid={`notifications.reply.${n.id}.button`}
                                  onClick={() => setReplyingId(n.id)}
                                  className="text-[11px] font-semibold text-wa-green bg-wa-green/10 rounded-full px-3 py-1 hover:bg-wa-green/20 transition-colors"
                                >
                                  Reply
                                </button>
                              ) : null}
                              <button
                                type="button"
                                data-ocid={`notifications.dismiss.${n.id}.button`}
                                onClick={() => dismiss(n.id)}
                                className="text-[11px] font-semibold text-muted-foreground bg-muted/60 rounded-full px-3 py-1 hover:bg-muted transition-colors"
                              >
                                Dismiss
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            <div className="h-2" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
