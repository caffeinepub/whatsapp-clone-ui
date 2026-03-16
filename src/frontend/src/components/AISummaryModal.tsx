import { X } from "lucide-react";
import { useEffect, useState } from "react";

const CHAT_SUMMARIES: Record<string, { summary: string; topics: string[] }> = {
  default: {
    summary:
      "The conversation covers a mix of casual check-ins, project updates, and scheduling plans. Both participants are engaged and responsive, with a friendly and collaborative tone throughout.",
    topics: ["Project updates", "Meeting plans", "General chat"],
  },
  "1": {
    summary:
      "Alice and you have been discussing a new mobile app project for local farmers markets. The tone is warm and enthusiastic. You've also made plans to meet for coffee tomorrow.",
    topics: ["Mobile app", "Farmers markets", "Coffee meeting"],
  },
  "2": {
    summary:
      "The team sprint review chat shows strong collaboration. Figma mockups have been completed and shared. Stakeholders are expected to respond positively to the new user flows.",
    topics: ["Sprint review", "Figma mockups", "User flows"],
  },
  "3": {
    summary:
      "This is a business conversation covering product catalog updates, order inquiries, and customer follow-ups. Professional tone maintained throughout.",
    topics: ["Product catalog", "Customer orders", "Follow-ups"],
  },
};

interface AISummaryModalProps {
  open: boolean;
  onClose: () => void;
  chatId: string;
  chatName: string;
}

export default function AISummaryModal({
  open,
  onClose,
  chatId,
  chatName,
}: AISummaryModalProps) {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (open) {
      setReady(false);
      setLoading(true);
      const t = setTimeout(() => {
        setLoading(false);
        setReady(true);
      }, 1500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  if (!open) return null;

  const data = CHAT_SUMMARIES[chatId] ?? CHAT_SUMMARIES.default;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center"
      data-ocid="ai_summary.modal"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-[420px] bg-background rounded-t-2xl shadow-2xl overflow-hidden">
        {/* Gradient header */}
        <div className="bg-gradient-to-r from-[#128C7E] to-[#25D366] px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-[16px]">✨ AI Summary</p>
            <p className="text-white/70 text-[12px] truncate">{chatName}</p>
          </div>
          <button
            type="button"
            data-ocid="ai_summary.close_button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-5 pb-safe">
          {loading ? (
            <div
              className="flex flex-col items-center gap-3 py-6"
              data-ocid="ai_summary.loading_state"
            >
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-wa-green"
                    style={{
                      animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
              <p className="text-[13px] text-muted-foreground">
                Analyzing conversation...
              </p>
            </div>
          ) : ready ? (
            <div className="space-y-4" data-ocid="ai_summary.success_state">
              <p className="text-[14px] text-foreground leading-relaxed">
                {data.summary}
              </p>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-semibold mb-2">
                  Key Topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 rounded-full bg-wa-green/15 text-wa-green text-[12px] font-medium border border-wa-green/20"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                data-ocid="ai_summary.confirm_button"
                onClick={onClose}
                className="w-full mt-2 py-2.5 rounded-xl bg-wa-green text-white font-semibold text-[14px] hover:bg-wa-green/90 transition-colors"
              >
                Got it
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
