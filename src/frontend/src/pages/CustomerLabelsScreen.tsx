import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  onBack: () => void;
}

interface LabelItem {
  id: string;
  name: string;
  color: string;
}

const PRESET_COLORS = [
  "#25D366",
  "#FF6B6B",
  "#4ECDC4",
  "#FFE66D",
  "#A8E6CF",
  "#FF8B94",
];

const DEFAULT_LABELS: LabelItem[] = [
  { id: "1", name: "New Customer", color: "#25D366" },
  { id: "2", name: "Pending Payment", color: "#FFE66D" },
  { id: "3", name: "Paid", color: "#4ECDC4" },
  { id: "4", name: "VIP", color: "#FF6B6B" },
  { id: "5", name: "Support", color: "#A8E6CF" },
];

function loadLabels(): LabelItem[] {
  try {
    return JSON.parse(localStorage.getItem("bp_labels") ?? "");
  } catch {
    return DEFAULT_LABELS;
  }
}

export default function CustomerLabelsScreen({ onBack }: Props) {
  const [labels, setLabels] = useState<LabelItem[]>(loadLabels);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);

  const save = (updated: LabelItem[]) => {
    setLabels(updated);
    localStorage.setItem("bp_labels", JSON.stringify(updated));
  };

  const addLabel = () => {
    if (!newName.trim()) return;
    const updated = [
      ...labels,
      { id: Date.now().toString(), name: newName.trim(), color: newColor },
    ];
    save(updated);
    setNewName("");
    toast.success("Label added!", { position: "top-center" });
  };

  const deleteLabel = (id: string) => {
    save(labels.filter((l) => l.id !== id));
    toast.success("Label removed", { position: "top-center" });
  };

  return (
    <div
      data-ocid="customer_labels.page"
      className="absolute inset-0 flex flex-col z-50 overflow-y-auto"
      style={{ background: "#0B141A", WebkitOverflowScrolling: "touch" }}
    >
      <header
        className="sticky top-0 z-10 bg-[#1F2C34] text-white flex items-center gap-3 px-3 py-3 flex-shrink-0"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
      >
        <button
          type="button"
          data-ocid="customer_labels.close_button"
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[18px] font-bold flex-1">Customer Labels</h1>
      </header>

      <div className="flex-1 pb-10">
        {/* Existing Labels */}
        <p className="px-4 pt-5 pb-2 text-[11px] font-semibold text-[#8696A0] uppercase tracking-widest">
          Labels
        </p>
        <div className="bg-[#1F2C34]">
          {labels.length === 0 && (
            <div
              data-ocid="customer_labels.empty_state"
              className="px-4 py-6 text-center text-[#8696A0] text-[13px]"
            >
              No labels yet. Add one below.
            </div>
          )}
          {labels.map((label, idx) => (
            <div
              key={label.id}
              data-ocid={`customer_labels.item.${idx + 1}`}
              className="flex items-center gap-3 px-4 py-3.5 border-b border-[#2A3942] last:border-b-0"
            >
              <div
                className="w-8 h-8 rounded-full flex-shrink-0"
                style={{ backgroundColor: label.color }}
              />
              <span className="flex-1 text-[15px] text-white">
                {label.name}
              </span>
              <button
                type="button"
                data-ocid={`customer_labels.delete_button.${idx + 1}`}
                onClick={() => deleteLabel(label.id)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-[#FF6B6B]" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Label */}
        <p className="px-4 pt-5 pb-2 text-[11px] font-semibold text-[#8696A0] uppercase tracking-widest">
          Add New Label
        </p>
        <div className="bg-[#1F2C34] px-4 py-4 space-y-3">
          <Input
            data-ocid="customer_labels.input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Label name"
            className="bg-[#0B141A] border-[#2A3942] text-white placeholder:text-white/30 focus:border-[#25D366]"
            onKeyDown={(e) => e.key === "Enter" && addLabel()}
          />
          <div>
            <p className="text-[12px] text-[#8696A0] mb-2">Choose color</p>
            <div className="flex gap-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewColor(c)}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    outline: newColor === c ? "3px solid white" : "none",
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
          </div>
          <Button
            data-ocid="customer_labels.primary_button"
            onClick={addLabel}
            disabled={!newName.trim()}
            className="w-full bg-[#25D366] hover:bg-[#1DB954] text-white font-semibold rounded-full"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Label
          </Button>
        </div>
      </div>
    </div>
  );
}
