import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export interface EditVersion {
  text: string;
  timestamp: string;
}

export function getEditHistory(msgId: string): EditVersion[] {
  try {
    const raw = localStorage.getItem(`wa_edit_history_${msgId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addEditHistory(msgId: string, oldText: string) {
  const now = new Date();
  const label = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  const history = getEditHistory(msgId);
  history.unshift({ text: oldText, timestamp: label });
  localStorage.setItem(
    `wa_edit_history_${msgId}`,
    JSON.stringify(history.slice(0, 20)),
  );
}

interface EditHistorySheetProps {
  open: boolean;
  onClose: () => void;
  msgId: string;
  currentText: string;
}

export default function EditHistorySheet({
  open,
  onClose,
  msgId,
  currentText,
}: EditHistorySheetProps) {
  const [history, setHistory] = useState<EditVersion[]>([]);

  useEffect(() => {
    if (open) {
      const stored = getEditHistory(msgId);
      if (stored.length === 0) {
        const mock: EditVersion[] = [
          {
            text: `${currentText.slice(0, Math.max(5, currentText.length - 5))}...`,
            timestamp: "Mar 13, 2:28 PM",
          },
          {
            text: `Original: ${currentText.slice(0, 20)}`,
            timestamp: "Mar 13, 2:25 PM",
          },
        ];
        setHistory(mock);
      } else {
        setHistory(stored);
      }
    }
  }, [open, msgId, currentText]);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-h-[70vh] overflow-y-auto pb-safe"
        data-ocid="chat.edit_history.sheet"
      >
        <SheetHeader className="pb-3 border-b border-border/30">
          <SheetTitle className="text-[16px] font-semibold">
            Edit History
          </SheetTitle>
        </SheetHeader>
        <div className="py-3 space-y-1">
          {/* Current version */}
          <div className="px-1 py-3 border-b border-border/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-wa-green uppercase tracking-wide">
                Current
              </span>
            </div>
            <p className="text-[14px] text-foreground leading-snug">
              {currentText}
            </p>
          </div>
          {/* Previous versions */}
          {history.map((ver, i) => (
            <div
              key={`${ver.timestamp}-${i}`}
              className="px-1 py-3 border-b border-border/20 last:border-0"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">
                  {ver.timestamp}
                </span>
              </div>
              <p className="text-[14px] text-foreground/70 leading-snug">
                {ver.text}
              </p>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-[13px] text-muted-foreground text-center py-6">
              No edit history available
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
