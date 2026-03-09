interface ContactAvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  colorIndex?: number;
}

// Distinct avatar colors — teal/blue/green/orange/purple palette
const AVATAR_COLORS = [
  "bg-teal-600",
  "bg-blue-600",
  "bg-emerald-600",
  "bg-orange-500",
  "bg-purple-600",
  "bg-rose-600",
  "bg-cyan-600",
  "bg-amber-600",
  "bg-indigo-600",
  "bg-lime-600",
];

const SIZE_MAP = {
  sm: "w-8 h-8 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-24 h-24 text-2xl",
};

export default function ContactAvatar({
  initials,
  size = "md",
  colorIndex,
}: ContactAvatarProps) {
  const idx =
    colorIndex !== undefined
      ? colorIndex % AVATAR_COLORS.length
      : (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) %
        AVATAR_COLORS.length;
  const colorClass = AVATAR_COLORS[idx];

  return (
    <div
      className={`${SIZE_MAP[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-semibold font-display flex-shrink-0`}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}
