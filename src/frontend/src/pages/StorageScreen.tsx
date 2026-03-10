import { Progress } from "@/components/ui/progress";
import { ArrowLeft, FileText, HardDrive, Image, Video } from "lucide-react";

const CHAT_STORAGE = [
  {
    id: 1,
    name: "Emma Rodriguez",
    initials: "ER",
    totalMB: 48.2,
    photos: 30.1,
    videos: 12.4,
    files: 5.7,
    colorIndex: 0,
  },
  {
    id: 2,
    name: "Team Design Sprint",
    initials: "TD",
    totalMB: 124.5,
    photos: 45.2,
    videos: 62.3,
    files: 17.0,
    colorIndex: 1,
  },
  {
    id: 3,
    name: "Marcus Chen",
    initials: "MC",
    totalMB: 22.8,
    photos: 18.5,
    videos: 2.3,
    files: 2.0,
    colorIndex: 2,
  },
  {
    id: 4,
    name: "Priya Sharma",
    initials: "PS",
    totalMB: 15.3,
    photos: 10.2,
    videos: 4.1,
    files: 1.0,
    colorIndex: 3,
  },
  {
    id: 5,
    name: "Jordan Williams",
    initials: "JW",
    totalMB: 8.6,
    photos: 6.0,
    videos: 0,
    files: 2.6,
    colorIndex: 4,
  },
  {
    id: 6,
    name: "Sarah & Mike",
    initials: "SM",
    totalMB: 25.6,
    photos: 20.0,
    videos: 5.6,
    files: 0,
    colorIndex: 5,
  },
];

const TOTAL_MB = CHAT_STORAGE.reduce((a, c) => a + c.totalMB, 0);

const AVATAR_COLORS = [
  "bg-[#F44336]",
  "bg-[#2196F3]",
  "bg-[#4CAF50]",
  "bg-[#FF9800]",
  "bg-[#9C27B0]",
  "bg-[#00BCD4]",
];

function formatMB(mb: number): string {
  if (mb === 0) return "—";
  if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`;
  return `${mb.toFixed(1)} MB`;
}

interface StorageScreenProps {
  onBack: () => void;
}

export default function StorageScreen({ onBack }: StorageScreenProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header
        className="sticky top-0 z-50 bg-wa-header flex items-center gap-2 px-2 pb-2 flex-shrink-0"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
      >
        <button
          type="button"
          data-ocid="storage.back.button"
          onClick={onBack}
          className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-wa-header-fg font-semibold text-[17px]">
          Storage and Data
        </h1>
      </header>

      <main
        className="flex-1 overflow-y-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Total storage card */}
        <div className="bg-card mx-3 mt-4 rounded-2xl p-5 shadow-sm border border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/15 flex items-center justify-center">
              <HardDrive className="w-7 h-7 text-purple-500" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-muted-foreground">
                Total storage used
              </p>
              <p className="text-[28px] font-bold text-foreground leading-tight">
                {formatMB(TOTAL_MB)}
              </p>
              <p className="text-[12px] text-muted-foreground">
                WhatsApp media &amp; files
              </p>
            </div>
          </div>
          <Progress value={(TOTAL_MB / 500) * 100} className="mt-4 h-2" />
          <div className="flex items-center justify-between mt-1.5">
            <p className="text-[11px] text-muted-foreground">
              {formatMB(TOTAL_MB)} used
            </p>
            <p className="text-[11px] text-muted-foreground">500 MB limit</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-500" />
            <span className="text-[12px] text-muted-foreground">Photos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <span className="text-[12px] text-muted-foreground">Videos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-orange-400" />
            <span className="text-[12px] text-muted-foreground">Files</span>
          </div>
        </div>

        {/* Per-chat breakdown */}
        <div className="px-3 space-y-2 pb-8">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide px-1 mb-3">
            Chats
          </p>
          {CHAT_STORAGE.sort((a, b) => b.totalMB - a.totalMB).map((chat, i) => (
            <div
              key={chat.id}
              data-ocid={`storage.chat.item.${i + 1}`}
              className="bg-card rounded-2xl p-4 border border-border"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0 ${AVATAR_COLORS[chat.colorIndex % AVATAR_COLORS.length]}`}
                >
                  {chat.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] text-foreground truncate">
                    {chat.name}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {formatMB(chat.totalMB)}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid={`storage.chat.delete_button.${i + 1}`}
                  className="text-[12px] text-destructive font-medium px-3 py-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Stacked bar */}
              <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-2">
                {chat.photos > 0 && (
                  <div
                    className="bg-blue-500 rounded-full"
                    style={{ flex: chat.photos }}
                  />
                )}
                {chat.videos > 0 && (
                  <div
                    className="bg-green-500 rounded-full"
                    style={{ flex: chat.videos }}
                  />
                )}
                {chat.files > 0 && (
                  <div
                    className="bg-orange-400 rounded-full"
                    style={{ flex: chat.files }}
                  />
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[11px] text-muted-foreground">
                    {formatMB(chat.photos)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-[11px] text-muted-foreground">
                    {formatMB(chat.videos)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-[11px] text-muted-foreground">
                    {formatMB(chat.files)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
