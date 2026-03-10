import { Smile, Sticker } from "lucide-react";
import { X } from "lucide-react";
import { useState } from "react";

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
  const [activeTab, setActiveTab] = useState<"emoji" | "sticker">("emoji");
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
      ) : (
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
      )}
    </div>
  );
}
