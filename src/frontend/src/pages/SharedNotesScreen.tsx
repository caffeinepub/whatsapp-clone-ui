import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Send, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Note {
  id: string;
  text: string;
  timestamp: string;
}

function getNotes(chatId: string): Note[] {
  try {
    const raw = localStorage.getItem(`shared_notes_${chatId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(chatId: string, notes: Note[]) {
  localStorage.setItem(`shared_notes_${chatId}`, JSON.stringify(notes));
}

interface SharedNotesScreenProps {
  chatId: string;
  chatName: string;
  onBack: () => void;
}

export default function SharedNotesScreen({
  chatId,
  chatName,
  onBack,
}: SharedNotesScreenProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotes(getNotes(chatId));
  }, [chatId]);

  const addNote = () => {
    if (!input.trim()) return;
    const now = new Date();
    const ts = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    const newNote: Note = {
      id: Date.now().toString(),
      text: input.trim(),
      timestamp: ts,
    };
    const updated = [...notes, newNote];
    setNotes(updated);
    saveNotes(chatId, updated);
    setInput("");
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveNotes(chatId, updated);
    toast.success("Note deleted", { position: "top-center" });
  };

  return (
    <div
      className="fixed inset-0 bg-background flex flex-col z-[90]"
      data-ocid="shared_notes.page"
    >
      {/* Header */}
      <div className="bg-wa-header flex items-center gap-3 px-3 py-3 pt-safe">
        <button
          type="button"
          data-ocid="shared_notes.close_button"
          onClick={onBack}
          className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-semibold text-wa-header-fg truncate">
            Shared Notes
          </p>
          <p className="text-[12px] text-wa-header-fg/70 truncate">
            {chatName}
          </p>
        </div>
        <FileText className="w-5 h-5 text-wa-header-fg/60" />
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {notes.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full gap-3"
            data-ocid="shared_notes.empty_state"
          >
            <FileText className="w-12 h-12 text-muted-foreground/30" />
            <p className="text-[14px] text-muted-foreground text-center">
              No shared notes yet.
              <br />
              Add the first one!
            </p>
          </div>
        ) : (
          notes.map((note, i) => (
            <div
              key={note.id}
              data-ocid={`shared_notes.item.${i + 1}`}
              className="bg-card rounded-xl p-3 border border-border/40 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[14px] text-foreground leading-snug flex-1">
                  {note.text}
                </p>
                <button
                  type="button"
                  data-ocid={`shared_notes.delete_button.${i + 1}`}
                  onClick={() => deleteNote(note.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {note.timestamp}
              </p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/30 bg-background px-3 py-3 pb-safe flex items-center gap-2">
        <input
          type="text"
          data-ocid="shared_notes.input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
          placeholder="Add a note..."
          className="flex-1 bg-muted/40 rounded-full px-4 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground outline-none border border-border/30 focus:border-wa-green/50 transition-colors"
        />
        <Button
          type="button"
          data-ocid="shared_notes.submit_button"
          onClick={addNote}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full bg-wa-green hover:bg-wa-green/90 p-0 flex items-center justify-center flex-shrink-0"
        >
          <Send className="w-4 h-4 text-white" />
        </Button>
      </div>
    </div>
  );
}
