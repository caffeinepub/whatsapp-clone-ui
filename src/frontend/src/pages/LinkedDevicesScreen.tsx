import { Button } from "@/components/ui/button";
import { ArrowLeft, Monitor, Smartphone, Tablet } from "lucide-react";
import { useEffect, useRef } from "react";

interface LinkedDevicesScreenProps {
  onBack: () => void;
}

const LINKED_DEVICES = [
  {
    icon: Monitor,
    name: "Chrome on Windows",
    status: "Active now",
    active: true,
  },
  {
    icon: Smartphone,
    name: "Safari on iPhone",
    status: "2 days ago",
    active: false,
  },
  {
    icon: Tablet,
    name: "Firefox on iPad",
    status: "5 days ago",
    active: false,
  },
];

function QRCodeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    const modules = 25;
    const cellSize = size / modules;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#111";

    // Seed a pseudo-random pattern
    const seed = 42;
    const rand = (n: number) => {
      let x = Math.sin(n + seed) * 10000;
      return x - Math.floor(x);
    };

    // Draw finder patterns (top-left, top-right, bottom-left)
    const drawFinder = (row: number, col: number) => {
      // Outer square
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const border = r === 0 || r === 6 || c === 0 || c === 6;
          const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          if (border || inner) {
            ctx.fillRect(
              (col + c) * cellSize,
              (row + r) * cellSize,
              cellSize - 0.5,
              cellSize - 0.5,
            );
          }
        }
      }
    };
    drawFinder(0, 0);
    drawFinder(0, modules - 7);
    drawFinder(modules - 7, 0);

    // Fill random data modules
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // Skip finder pattern areas
        const inFinder =
          (r < 8 && c < 8) ||
          (r < 8 && c >= modules - 8) ||
          (r >= modules - 8 && c < 8);
        if (!inFinder && rand(r * modules + c) > 0.45) {
          ctx.fillRect(
            c * cellSize,
            r * cellSize,
            cellSize - 0.5,
            cellSize - 0.5,
          );
        }
      }
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-xl shadow-md"
      style={{ width: 200, height: 200 }}
    />
  );
}

export default function LinkedDevicesScreen({
  onBack,
}: LinkedDevicesScreenProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe-top pb-3 border-b border-border sticky top-0 bg-background z-10">
        <button
          type="button"
          data-ocid="linked_devices.back_button"
          onClick={onBack}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-[17px]">Linked Devices</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* QR Section */}
        <div className="flex flex-col items-center py-8 px-6 bg-card mx-4 mt-4 rounded-2xl shadow-sm">
          <p className="text-[14px] text-muted-foreground mb-4 text-center">
            Scan this QR code from another device to link it
          </p>
          <QRCodeCanvas />
          <p className="text-[12px] text-muted-foreground mt-3 text-center">
            Keep your phone connected for linked devices to work
          </p>
        </div>

        <div className="px-4 py-4">
          <Button
            data-ocid="linked_devices.link_button"
            className="w-full bg-wa-green hover:bg-wa-green/90 text-white"
          >
            Link a Device
          </Button>
        </div>

        {/* Linked devices list */}
        <div className="px-4 pb-4">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Linked devices
          </p>
          <div className="bg-card rounded-2xl overflow-hidden shadow-sm">
            {LINKED_DEVICES.map((device, i) => {
              const Icon = device.icon;
              return (
                <div
                  key={device.name}
                  data-ocid={`linked_devices.item.${i + 1}`}
                  className={`flex items-center gap-4 px-4 py-3.5 ${
                    i < LINKED_DEVICES.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-foreground">
                      {device.name}
                    </p>
                    <p
                      className={`text-[12px] ${
                        device.active
                          ? "text-wa-green font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {device.status}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid={`linked_devices.delete_button.${i + 1}`}
                    className="text-destructive text-[13px] hover:underline"
                  >
                    Log out
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
