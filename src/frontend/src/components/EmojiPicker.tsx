import { Pencil, Smile, Sticker, X } from "lucide-react";
import { useRef, useState } from "react";

const EMOJI_CATEGORIES = [
  {
    label: "Smileys",
    emojis: [
      "😀",
      "😁",
      "😂",
      "🤣",
      "😃",
      "😄",
      "😅",
      "😆",
      "😉",
      "😊",
      "😋",
      "😎",
      "😍",
      "🥰",
      "😘",
      "🤩",
      "🙂",
      "😏",
      "😒",
      "🙄",
      "😔",
      "😢",
      "😭",
      "😤",
      "😠",
      "😡",
      "🤬",
      "😱",
      "😨",
      "😰",
    ],
  },
  {
    label: "Gestures",
    emojis: [
      "👍",
      "👎",
      "👏",
      "🙌",
      "🤝",
      "🤜",
      "✌️",
      "🤞",
      "👌",
      "🤌",
      "🖐️",
      "✋",
      "👋",
      "🤚",
      "💪",
      "🦾",
      "🙏",
      "👐",
      "🫶",
      "❤️‍🔥",
    ],
  },
  {
    label: "Hearts",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "❣️",
      "💔",
      "♥️",
    ],
  },
  {
    label: "Activities",
    emojis: [
      "⚽",
      "🏀",
      "🎮",
      "🎵",
      "🎉",
      "🎊",
      "🎁",
      "🏆",
      "🥇",
      "🎯",
      "🎸",
      "🎭",
      "🎬",
      "🌟",
      "✨",
      "🔥",
      "💥",
      "🌈",
      "☀️",
      "⚡",
    ],
  },
  {
    label: "Food",
    emojis: [
      "🍕",
      "🍔",
      "🍜",
      "🍣",
      "🍦",
      "🍩",
      "🍪",
      "🎂",
      "🧁",
      "🍷",
      "☕",
      "🧃",
      "🍺",
      "🥂",
      "🍹",
      "🥗",
      "🌮",
      "🥪",
      "🍱",
      "🍿",
    ],
  },
  {
    label: "Misc",
    emojis: [
      "🤔",
      "🫠",
      "🥹",
      "😮‍💨",
      "🤷",
      "🙋",
      "💁",
      "🤦",
      "😴",
      "🤗",
      "🚀",
      "🌍",
      "💡",
      "🔑",
      "💰",
      "📱",
      "💻",
      "🎓",
      "🏡",
      "🌸",
    ],
  },
];

const STICKER_PACKS = [
  {
    label: "Recent",
    icon: "⏱️",
    stickers: ["😂🔥", "❤️✨", "👍💯", "🎉🥳", "😎🌟", "🙈🙉"],
    emojis: ["🤣", "😍", "🥰", "🤩", "😎", "🥳", "🤪", "😜"],
  },
  {
    label: "Smileys",
    icon: "😊",
    emojis: [
      "😀",
      "😂",
      "🤣",
      "😊",
      "😍",
      "🥰",
      "🤩",
      "😎",
      "🥳",
      "😜",
      "🤪",
      "😝",
      "🤑",
      "🤠",
      "🥸",
      "🤓",
    ],
  },
  {
    label: "Animals",
    icon: "🐶",
    emojis: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🦄",
    ],
  },
  {
    label: "Food",
    icon: "🍕",
    emojis: [
      "🍕",
      "🍔",
      "🌮",
      "🌯",
      "🥗",
      "🍜",
      "🍣",
      "🍩",
      "🎂",
      "🍪",
      "🍦",
      "🍧",
      "🧁",
      "🍫",
      "🍬",
      "🍭",
    ],
  },
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onStickerSelect?: (sticker: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({
  onEmojiSelect,
  onStickerSelect,
  onClose,
}: EmojiPickerProps) {
  const [activeTab, setActiveTab] = useState<
    "emoji" | "sticker" | "animated" | "create"
  >("emoji");
  const [customStickers, setCustomStickers] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("wa_custom_stickers") ?? "[]",
      ) as string[];
    } catch {
      return [];
    }
  });
  const [createImg, setCreateImg] = useState<string | null>(null);
  const [createText, setCreateText] = useState("");
  const [createColor, setCreateColor] = useState("#FFFFFF");
  const createFileRef = useRef<HTMLInputElement>(null);
  const [activePack, setActivePack] = useState(0);

  return (
    <div
      data-ocid="chat.emoji.panel"
      className="bg-card border-t border-border"
    >
      {/* Tab header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
        <div className="flex items-center gap-1">
          <button
            type="button"
            data-ocid="chat.emoji.tab"
            onClick={() => setActiveTab("emoji")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
              activeTab === "emoji"
                ? "bg-wa-green/10 text-wa-green"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            Emoji
          </button>
          <button
            type="button"
            data-ocid="chat.sticker.tab"
            onClick={() => setActiveTab("sticker")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
              activeTab === "sticker"
                ? "bg-wa-green/10 text-wa-green"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sticker className="w-3.5 h-3.5" />
            Stickers
          </button>
          <button
            type="button"
            data-ocid="chat.sticker.create.tab"
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
              activeTab === "create"
                ? "bg-wa-green/10 text-wa-green"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            Create
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close picker"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {activeTab === "emoji" ? (
        <div className="h-[200px] overflow-y-auto px-2 pb-2">
          {EMOJI_CATEGORIES.map((cat) => (
            <div key={cat.label} className="mb-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1 py-1">
                {cat.label}
              </p>
              <div className="grid grid-cols-10 gap-0.5">
                {cat.emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => onEmojiSelect(emoji)}
                    className="w-8 h-8 flex items-center justify-center text-[20px] rounded hover:bg-muted transition-colors active:scale-90"
                    aria-label={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === "sticker" ? (
        <div className="flex h-[200px]">
          {/* Pack selector sidebar */}
          <div className="flex flex-col border-r border-border overflow-y-auto">
            {STICKER_PACKS.map((pack, i) => (
              <button
                key={pack.label}
                type="button"
                data-ocid={`chat.sticker.pack.${i + 1}`}
                onClick={() => setActivePack(i)}
                className={`w-12 h-12 flex items-center justify-center text-[22px] flex-shrink-0 transition-colors ${
                  activePack === i
                    ? "bg-wa-green/15 border-r-2 border-wa-green"
                    : "hover:bg-muted/60"
                }`}
                aria-label={pack.label}
                title={pack.label}
              >
                {pack.icon}
              </button>
            ))}
          </div>

          {/* Sticker grid */}
          <div className="flex-1 overflow-y-auto p-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {STICKER_PACKS[activePack].label}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {STICKER_PACKS[activePack].emojis.map((emoji, i) => (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable sticker grid
                  key={`sticker-${emoji}-${i}`}
                  type="button"
                  data-ocid={`chat.sticker.item.${i + 1}`}
                  onClick={() => {
                    const fn = onStickerSelect ?? onEmojiSelect;
                    fn(emoji);
                    onClose();
                  }}
                  className="w-full aspect-square flex items-center justify-center text-[36px] rounded-xl hover:bg-muted transition-colors active:scale-90"
                  aria-label={`Sticker ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === "animated" ? (
        <div className="h-[200px] overflow-y-auto px-3 py-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Animated Stickers
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { emoji: "😂", anim: "animate-bounce", label: "LOL" },
              { emoji: "❤️", anim: "animate-pulse", label: "Love" },
              { emoji: "🔥", anim: "animate-spin", label: "Fire" },
              { emoji: "🎉", anim: "animate-bounce", label: "Party" },
              { emoji: "😎", anim: "animate-pulse", label: "Cool" },
              { emoji: "💯", anim: "animate-bounce", label: "100" },
              { emoji: "🥳", anim: "animate-spin", label: "Yay" },
              { emoji: "⭐", anim: "animate-pulse", label: "Star" },
              { emoji: "🙏", anim: "animate-bounce", label: "Thanks" },
              { emoji: "👏", anim: "animate-pulse", label: "Clap" },
              { emoji: "😍", anim: "animate-pulse", label: "Wow" },
              { emoji: "🚀", anim: "animate-bounce", label: "Go!" },
            ].map(({ emoji, anim, label }, i) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: stable animated sticker grid
                key={i}
                type="button"
                data-ocid={`chat.animated_sticker.item.${i + 1}`}
                onClick={() => {
                  const fn = onStickerSelect ?? onEmojiSelect;
                  fn(emoji);
                  onClose();
                }}
                className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-muted transition-colors active:scale-90"
                aria-label={`Animated sticker ${label}`}
              >
                <span
                  className={`text-[32px] ${anim} inline-block`}
                  style={{ animationDuration: "1.2s" }}
                >
                  {emoji}
                </span>
                <span className="text-[9px] text-muted-foreground font-medium">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-[200px] overflow-y-auto px-3 py-2 flex flex-col gap-2">
          <input
            ref={createFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => setCreateImg(ev.target?.result as string);
              reader.readAsDataURL(file);
            }}
          />
          <button
            type="button"
            data-ocid="chat.sticker.create.upload_button"
            onClick={() => createFileRef.current?.click()}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-border hover:border-wa-green/60 text-[12px] text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
          >
            {createImg ? (
              <img
                src={createImg}
                alt="Preview"
                className="h-12 w-12 object-cover rounded-lg"
              />
            ) : (
              <>
                <Pencil className="w-4 h-4" />
                Pick image from device
              </>
            )}
          </button>
          <input
            data-ocid="chat.sticker.create.input"
            type="text"
            placeholder="Add overlay text..."
            value={createText}
            onChange={(e) => setCreateText(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-muted text-[12px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-wa-green/40"
          />
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">
              Text color:
            </span>
            <input
              data-ocid="chat.sticker.create.color.input"
              type="color"
              value={createColor}
              onChange={(e) => setCreateColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-border"
            />
          </div>
          <button
            type="button"
            data-ocid="chat.sticker.create.save_button"
            disabled={!createImg}
            onClick={() => {
              if (!createImg) return;
              const label = createText
                ? `${createImg}::${createText}::${createColor}`
                : createImg;
              const updated = [...customStickers, label];
              setCustomStickers(updated);
              localStorage.setItem(
                "wa_custom_stickers",
                JSON.stringify(updated),
              );
              setCreateImg(null);
              setCreateText("");
              setActiveTab("sticker");
            }}
            className="w-full py-2.5 rounded-xl bg-wa-green text-white text-[12px] font-semibold disabled:opacity-40 hover:brightness-105 transition-all"
          >
            Save Sticker
          </button>
          {customStickers.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                My Stickers
              </p>
              <div className="grid grid-cols-4 gap-2">
                {customStickers.map((s, i) => {
                  const parts = s.split("::");
                  const imgSrc = parts[0];
                  const txt = parts[1] ?? "";
                  const col = parts[2] ?? "#FFFFFF";
                  return (
                    <button
                      // biome-ignore lint/suspicious/noArrayIndexKey: custom sticker list
                      key={`custom-${i}`}
                      type="button"
                      data-ocid={`chat.sticker.custom.item.${i + 1}`}
                      onClick={() => {
                        const fn = onStickerSelect ?? onEmojiSelect;
                        fn(txt ? `[Sticker: ${txt}]` : "[Custom Sticker]");
                        onClose();
                      }}
                      className="relative w-full aspect-square rounded-xl overflow-hidden border border-border hover:border-wa-green transition-colors"
                      aria-label={`Custom sticker ${i + 1}`}
                    >
                      <img
                        src={imgSrc}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {txt && (
                        <span
                          className="absolute bottom-0 left-0 right-0 text-center text-[10px] font-bold px-1 pb-0.5 truncate"
                          style={{
                            color: col,
                            textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                          }}
                        >
                          {txt}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
