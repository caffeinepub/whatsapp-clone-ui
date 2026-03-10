import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface PollCreationModalProps {
  open: boolean;
  onClose: () => void;
  onCreatePoll: (
    question: string,
    options: string[],
    multipleAnswers: boolean,
  ) => void;
}

export default function PollCreationModal({
  open,
  onClose,
  onCreatePoll,
}: PollCreationModalProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [multipleAnswers, setMultipleAnswers] = useState(false);

  if (!open) return null;

  const handleCreate = () => {
    const validOpts = options.filter((o) => o.trim());
    if (!question.trim() || validOpts.length < 2) return;
    onCreatePoll(question.trim(), validOpts, multipleAnswers);
    setQuestion("");
    setOptions(["", ""]);
    setMultipleAnswers(false);
    onClose();
  };

  const updateOption = (i: number, val: string) => {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? val : o)));
  };

  const addOption = () => {
    if (options.length < 4) setOptions((prev) => [...prev, ""]);
  };

  const removeOption = (i: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
  };

  const canCreate =
    question.trim() && options.filter((o) => o.trim()).length >= 2;

  return (
    <>
      <div
        className="absolute inset-0 z-40 bg-black/40"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close poll modal"
      />
      <div
        data-ocid="poll.modal"
        className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl animate-slide-up max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0 border-b border-border">
          <p className="text-[17px] font-bold text-foreground">Create Poll</p>
          <button
            type="button"
            data-ocid="poll.close_button"
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Question */}
          <div>
            <Label className="text-[13px] text-muted-foreground mb-1.5 block">
              Question *
            </Label>
            <input
              data-ocid="poll.question.input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-muted/50 border-0 rounded-xl px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-wa-green/30"
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <Label className="text-[13px] text-muted-foreground mb-1 block">
              Options * (min 2, max 4)
            </Label>
            {options.map((opt, i) => (
              <div // biome-ignore lint/suspicious/noArrayIndexKey: ordered option list
                key={`opt-${i}`}
                className="flex items-center gap-2"
              >
                <input
                  data-ocid={`poll.option.input.${i + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 bg-muted/50 border-0 rounded-xl px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-wa-green/30"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    data-ocid={`poll.option.delete_button.${i + 1}`}
                    onClick={() => removeOption(i)}
                    className="p-2 text-muted-foreground hover:text-destructive rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {options.length < 4 && (
              <button
                type="button"
                data-ocid="poll.add_option.button"
                onClick={addOption}
                className="flex items-center gap-2 text-wa-green text-[14px] font-medium py-2 px-1 hover:opacity-80 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Add option
              </button>
            )}
          </div>

          {/* Multiple answers toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-[14px] font-medium text-foreground">
                Allow multiple answers
              </p>
              <p className="text-[12px] text-muted-foreground">
                Voters can pick more than one option
              </p>
            </div>
            <Switch
              data-ocid="poll.multiple_answers.switch"
              checked={multipleAnswers}
              onCheckedChange={setMultipleAnswers}
            />
          </div>
        </div>

        {/* Create button */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-border">
          <button
            type="button"
            data-ocid="poll.create_button"
            disabled={!canCreate}
            onClick={handleCreate}
            className="w-full py-3 rounded-full bg-wa-green text-white font-semibold text-[15px] disabled:opacity-40 hover:brightness-105 transition-all"
          >
            Create Poll
          </button>
        </div>
        <div style={{ height: "env(safe-area-inset-bottom, 8px)" }} />
      </div>
    </>
  );
}
