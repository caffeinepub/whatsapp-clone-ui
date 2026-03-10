import { ArrowLeft, Check, Edit2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  getQuickReplies,
  saveQuickReplies,
} from "../components/QuickRepliesPanel";

interface QuickRepliesSettingsScreenProps {
  onBack: () => void;
}

export default function QuickRepliesSettingsScreen({
  onBack,
}: QuickRepliesSettingsScreenProps) {
  const [replies, setReplies] = useState<string[]>(getQuickReplies);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState("");

  const handleSaveEdit = (i: number) => {
    if (!editingText.trim()) return;
    const updated = replies.map((r, idx) =>
      idx === i ? editingText.trim() : r,
    );
    setReplies(updated);
    saveQuickReplies(updated);
    setEditingIndex(null);
    toast.success("Quick reply updated");
  };

  const handleDelete = (i: number) => {
    const updated = replies.filter((_, idx) => idx !== i);
    setReplies(updated);
    saveQuickReplies(updated);
    toast.success("Quick reply deleted");
  };

  const handleAdd = () => {
    if (!newText.trim()) return;
    const updated = [...replies, newText.trim()];
    setReplies(updated);
    saveQuickReplies(updated);
    setNewText("");
    setShowAdd(false);
    toast.success("Quick reply added");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-background flex flex-col"
      data-ocid="quickreplies.settings.page"
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
      >
        <button
          type="button"
          data-ocid="quickreplies.settings.back.button"
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-[17px] font-bold text-foreground flex-1">
          Quick Replies
        </h1>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {replies.length === 0 ? (
          <div
            data-ocid="quickreplies.settings.empty_state"
            className="flex flex-col items-center py-16 text-muted-foreground gap-2"
          >
            <span className="text-4xl">⚡</span>
            <p className="text-[15px] font-semibold">No quick replies</p>
            <p className="text-[13px]">Tap + to add one</p>
          </div>
        ) : (
          <div className="py-2">
            {replies.map((reply, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: stable editable list
                key={`qr-${i}`}
                data-ocid={`quickreplies.settings.item.${i + 1}`}
                className="flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 bg-card"
              >
                {editingIndex === i ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      data-ocid="quickreplies.settings.edit.input"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(i)}
                      className="flex-1 bg-muted rounded-lg px-3 py-2 text-[14px] text-foreground outline-none focus:ring-2 focus:ring-wa-green/40"
                      // biome-ignore lint/a11y/noAutofocus: edit UX needs focus
                      autoFocus
                    />
                    <button
                      type="button"
                      data-ocid="quickreplies.settings.save_button"
                      onClick={() => handleSaveEdit(i)}
                      className="p-2 rounded-full bg-wa-green/10 text-wa-green hover:bg-wa-green/20 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      data-ocid="quickreplies.settings.cancel_button"
                      onClick={() => setEditingIndex(null)}
                      className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-[14px] text-foreground leading-snug pt-0.5">
                      {reply}
                    </span>
                    <button
                      type="button"
                      data-ocid={`quickreplies.settings.edit_button.${i + 1}`}
                      onClick={() => {
                        setEditingIndex(i);
                        setEditingText(reply);
                      }}
                      className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      data-ocid={`quickreplies.settings.delete_button.${i + 1}`}
                      onClick={() => handleDelete(i)}
                      className="p-2 rounded-full hover:bg-destructive/10 transition-colors text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add new */}
        {showAdd && (
          <div className="px-4 py-3 border-t border-border bg-card mt-2">
            <p className="text-[13px] font-semibold text-muted-foreground mb-2">
              New Quick Reply
            </p>
            <textarea
              data-ocid="quickreplies.settings.new.textarea"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Type your quick reply..."
              rows={3}
              className="w-full bg-muted rounded-xl px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-wa-green/40 resize-none"
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                data-ocid="quickreplies.settings.add.cancel_button"
                onClick={() => {
                  setShowAdd(false);
                  setNewText("");
                }}
                className="flex-1 py-2.5 rounded-xl border border-border text-[14px] text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="quickreplies.settings.add.submit_button"
                onClick={handleAdd}
                disabled={!newText.trim()}
                className="flex-1 py-2.5 rounded-xl bg-wa-green text-white text-[14px] font-semibold disabled:opacity-40 hover:brightness-105 transition-all"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      {!showAdd && (
        <button
          type="button"
          data-ocid="quickreplies.settings.open_modal_button"
          onClick={() => setShowAdd(true)}
          className="absolute bottom-6 right-5 w-14 h-14 rounded-full bg-wa-green shadow-xl flex items-center justify-center text-white hover:brightness-105 active:brightness-90 transition-all"
          style={{ bottom: "max(24px, env(safe-area-inset-bottom, 24px))" }}
          aria-label="Add quick reply"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
