import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const BUBBLE_COLORS = [
  { label: "Default", value: "default", hex: "" },
  { label: "Green", value: "green", hex: "#25D366" },
  { label: "Blue", value: "blue", hex: "#2196F3" },
  { label: "Purple", value: "purple", hex: "#9C27B0" },
  { label: "Pink", value: "pink", hex: "#E91E63" },
  { label: "Orange", value: "orange", hex: "#FF9800" },
  { label: "Teal", value: "teal", hex: "#009688" },
  { label: "Red", value: "red", hex: "#F44336" },
];

export interface ChatTheme {
  bubbleColor: string;
  headerColor: string;
}

interface ChatThemeSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  contactId: string;
  theme: ChatTheme;
  onThemeChange: (t: ChatTheme) => void;
}

function ColorSwatch({
  hex,
  label,
  selected,
  onClick,
}: {
  hex: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`w-9 h-9 rounded-full border-2 transition-all ${
        selected ? "border-foreground scale-110" : "border-transparent"
      } relative`}
      style={{ background: hex || "#25D366" }}
    >
      {!hex && (
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E]" />
      )}
      {selected && (
        <span className="absolute inset-0 rounded-full flex items-center justify-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <title>Selected</title>
            <path
              d="M2 7l4 4 6-7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </button>
  );
}

export default function ChatThemeSheet({
  open,
  onOpenChange,
  contactId,
  theme,
  onThemeChange,
}: ChatThemeSheetProps) {
  const save = (updates: Partial<ChatTheme>) => {
    const next = { ...theme, ...updates };
    onThemeChange(next);
    localStorage.setItem(`chatTheme_${contactId}`, JSON.stringify(next));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-5 pb-8 pt-4"
        data-ocid="chat.theme.sheet"
      >
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
        <SheetHeader className="mb-5">
          <SheetTitle className="text-[17px] font-bold">Chat theme</SheetTitle>
        </SheetHeader>

        <div className="space-y-5">
          <div>
            <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Bubble color
            </p>
            <div className="flex flex-wrap gap-3">
              {BUBBLE_COLORS.map((c) => (
                <ColorSwatch
                  key={c.value}
                  hex={c.hex}
                  label={c.label}
                  selected={theme.bubbleColor === c.value}
                  onClick={() => save({ bubbleColor: c.value })}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Header color
            </p>
            <div className="flex flex-wrap gap-3">
              {BUBBLE_COLORS.map((c) => (
                <ColorSwatch
                  key={c.value}
                  hex={c.hex}
                  label={c.label}
                  selected={theme.headerColor === c.value}
                  onClick={() => save({ headerColor: c.value })}
                />
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function loadChatTheme(contactId: string): ChatTheme {
  try {
    const raw = localStorage.getItem(`chatTheme_${contactId}`);
    if (raw) return JSON.parse(raw) as ChatTheme;
  } catch {}
  return { bubbleColor: "default", headerColor: "default" };
}

export const THEME_HEX: Record<string, string> = {
  default: "",
  green: "#25D366",
  blue: "#2196F3",
  purple: "#9C27B0",
  pink: "#E91E63",
  orange: "#FF9800",
  teal: "#009688",
  red: "#F44336",
};
