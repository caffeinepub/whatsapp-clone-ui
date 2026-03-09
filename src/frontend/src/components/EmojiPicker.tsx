import { X } from "lucide-react";

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

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({
  onEmojiSelect,
  onClose,
}: EmojiPickerProps) {
  return (
    <div
      data-ocid="chat.emoji.panel"
      className="bg-card border-t border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
          Emoji
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close emoji picker"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Emoji grid — scrollable area */}
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
    </div>
  );
}
