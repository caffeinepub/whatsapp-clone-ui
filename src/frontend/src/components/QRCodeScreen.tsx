import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, MoreVertical, QrCode, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface QRCodeScreenProps {
  onBack: () => void;
  userName: string;
}

type QRTab = "mycode" | "scancode";

// Simple QR code visual using CSS grid pattern
function QRCodeDisplay({ text }: { text: string }) {
  // Generate a deterministic 21x21 grid pattern based on text
  const hash = text.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const grid: boolean[][] = [];
  for (let r = 0; r < 21; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < 21; c++) {
      // Finder patterns (corners)
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= 13;
      const inBotLeft = r >= 13 && c < 8;
      if (inTopLeft || inTopRight || inBotLeft) {
        // Finder pattern logic
        const rr = inTopRight ? r : r;
        const cc = inTopRight ? c - 13 : inBotLeft ? c : c;
        const rRel = inBotLeft ? r - 13 : rr;
        const isOuter = rRel === 0 || rRel === 6 || cc === 0 || cc === 6;
        const isInner = rRel >= 2 && rRel <= 4 && cc >= 2 && cc <= 4;
        row.push(isOuter || isInner);
      } else {
        // Data area — use hash-based deterministic pattern
        row.push(((hash + r * 21 + c) * 2654435761) % 2 === 0);
      }
    }
    grid.push(row);
  }

  return (
    <div className="p-3 bg-white rounded-2xl inline-block shadow-md">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(21, 1fr)",
          gap: "1px",
          width: "168px",
          height: "168px",
        }}
      >
        {grid.flat().map((cell, idx) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: QR grid cells
            key={idx}
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: cell ? "#111b21" : "#ffffff",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function QRCodeScreen({ onBack, userName }: QRCodeScreenProps) {
  const [activeTab, setActiveTab] = useState<QRTab>("mycode");

  return (
    <div
      data-ocid="qrcode.panel"
      className="absolute inset-0 z-50 flex flex-col bg-background animate-slide-up"
    >
      {/* Sticky header */}
      <header
        className="sticky top-0 z-50 bg-wa-header flex items-center gap-2 px-2 pb-2 flex-shrink-0"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
      >
        <button
          type="button"
          data-ocid="qrcode.back.button"
          onClick={onBack}
          className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-wa-header-fg text-[18px] font-bold font-display flex-1">
          Short link QR
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              data-ocid="qrcode.menu.button"
              className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-popover border-border shadow-lg"
            data-ocid="qrcode.dropdown_menu"
          >
            <DropdownMenuItem
              data-ocid="qrcode.menu.reset"
              className="text-[14px] py-2.5 cursor-pointer"
              onClick={() => toast.success("QR code reset")}
            >
              Reset QR code
            </DropdownMenuItem>
            <DropdownMenuItem
              data-ocid="qrcode.menu.share"
              className="text-[14px] py-2.5 cursor-pointer"
              onClick={() => toast.success("Sharing QR code...")}
            >
              Share QR code
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Tabs */}
      <div className="flex bg-wa-header border-b border-white/10">
        {(["mycode", "scancode"] as QRTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            data-ocid={`qrcode.${tab}.tab`}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-[13px] font-semibold uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? "text-wa-header-fg border-b-2 border-wa-green"
                : "text-wa-header-fg/50 hover:text-wa-header-fg/70"
            }`}
          >
            {tab === "mycode" ? "My Code" : "Scan Code"}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto bg-secondary/20">
        {activeTab === "mycode" && (
          <div className="flex flex-col items-center px-6 py-8 gap-5">
            {/* Card */}
            <div className="w-full bg-card rounded-3xl p-6 flex flex-col items-center gap-4 shadow-sm">
              {/* Avatar circle */}
              <div className="w-16 h-16 bg-wa-green rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-[22px] font-bold font-display">
                  {userName.slice(0, 1).toUpperCase()}
                </span>
              </div>

              {/* Name */}
              <div className="text-center">
                <p className="font-bold text-[17px] text-foreground font-display">
                  {userName}
                </p>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  WhatsApp business account
                </p>
              </div>

              {/* QR code */}
              <QRCodeDisplay text={userName} />

              {/* Description */}
              <p className="text-[12px] text-muted-foreground text-center leading-relaxed max-w-[260px]">
                Your customers can scan this code to start a WhatsApp chat with
                you.{" "}
                <button
                  type="button"
                  className="text-wa-green underline"
                  onClick={() => toast.info("Opening help article...")}
                >
                  Learn more
                </button>
              </p>
            </div>

            {/* Share button */}
            <button
              type="button"
              data-ocid="qrcode.share.button"
              onClick={() => toast.success("Sharing your QR code...")}
              className="w-full bg-white/10 border border-border text-foreground font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/15 active:bg-white/5 transition-all"
            >
              <Share2 className="w-5 h-5" />
              Share code
            </button>
          </div>
        )}

        {activeTab === "scancode" && (
          <div className="flex flex-col items-center px-6 py-8 gap-6">
            {/* Scanner viewfinder */}
            <div className="w-full aspect-square bg-card rounded-3xl flex flex-col items-center justify-center gap-4 relative overflow-hidden">
              {/* Corner markers */}
              <div className="absolute top-6 left-6 w-10 h-10 border-t-4 border-l-4 border-wa-green rounded-tl-lg" />
              <div className="absolute top-6 right-6 w-10 h-10 border-t-4 border-r-4 border-wa-green rounded-tr-lg" />
              <div className="absolute bottom-6 left-6 w-10 h-10 border-b-4 border-l-4 border-wa-green rounded-bl-lg" />
              <div className="absolute bottom-6 right-6 w-10 h-10 border-b-4 border-r-4 border-wa-green rounded-br-lg" />

              <QrCode className="w-16 h-16 text-muted-foreground/40" />
              <p className="text-[14px] text-muted-foreground text-center px-8">
                Point your camera at a WhatsApp QR code to scan it
              </p>
            </div>

            <button
              type="button"
              data-ocid="qrcode.scan.button"
              onClick={() => toast.info("Opening camera to scan QR code...")}
              className="w-full bg-wa-green text-white font-semibold py-3.5 rounded-2xl hover:brightness-105 active:brightness-95 transition-all"
            >
              Scan QR Code
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
