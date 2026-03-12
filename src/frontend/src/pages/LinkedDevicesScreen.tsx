import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Laptop,
  LogOut,
  Monitor,
  Smartphone,
  TabletSmartphone,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface LinkedDevicesScreenProps {
  onBack: () => void;
}

const DEVICE_ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  iPhone: Smartphone,
  Android: Smartphone,
  Windows: Monitor,
  Mac: Laptop,
  "Web Browser": TabletSmartphone,
};

const LINKED_DEVICES_DATA = [
  {
    id: 1,
    type: "Windows",
    name: "Chrome on Windows",
    status: "Active now",
    active: true,
  },
  {
    id: 2,
    type: "iPhone",
    name: "Safari on iPhone 15",
    status: "2 days ago",
    active: false,
  },
  {
    id: 3,
    type: "Mac",
    name: "WhatsApp Desktop Mac",
    status: "5 days ago",
    active: false,
  },
  {
    id: 4,
    type: "Android",
    name: "Chrome on Android",
    status: "1 week ago",
    active: false,
  },
  {
    id: 5,
    type: "Web Browser",
    name: "Firefox on iPad",
    status: "2 weeks ago",
    active: false,
  },
];

function QRCodeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanLine, setScanLine] = useState(0);

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
    const rand = (n: number) => {
      let x = Math.sin(n + 42) * 10000;
      return x - Math.floor(x);
    };
    const drawFinder = (row: number, col: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 ||
            r === 6 ||
            c === 0 ||
            c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
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
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((v) => (v + 2) % 200);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="rounded-xl shadow-md"
        style={{ width: 200, height: 200 }}
      />
      {/* Animated scan line */}
      <div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-80 pointer-events-none"
        style={{ top: `${scanLine}px`, transition: "top 0.016s linear" }}
      />
    </div>
  );
}

export default function LinkedDevicesScreen({
  onBack,
}: LinkedDevicesScreenProps) {
  const [devices, setDevices] = useState(LINKED_DEVICES_DATA);
  const [showQR, setShowQR] = useState(false);
  const [deviceSheet, setDeviceSheet] = useState<number | null>(null);
  const [showLogoutAll, setShowLogoutAll] = useState(false);

  const logoutDevice = (id: number) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    setDeviceSheet(null);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 flex-shrink-0"
        style={{
          background: "#128C7E",
          paddingTop: "max(env(safe-area-inset-top, 0px), 44px)",
          paddingBottom: "16px",
        }}
      >
        <button
          type="button"
          data-ocid="linked_devices.back_button"
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white font-bold text-[18px]">Linked Devices</h1>
      </div>

      <div
        className="flex-1 overflow-y-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Linked devices list */}
        <div className="px-4 py-4">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            {devices.length} Linked Device{devices.length !== 1 ? "s" : ""}
          </p>
          <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border">
            {devices.length === 0 ? (
              <div
                className="py-8 flex flex-col items-center gap-2"
                data-ocid="linked_devices.empty_state"
              >
                <Monitor className="w-8 h-8 text-muted-foreground/40" />
                <p className="text-muted-foreground text-[14px]">
                  No linked devices
                </p>
              </div>
            ) : (
              devices.map((device, i) => {
                const Icon = DEVICE_ICONS[device.type] || Monitor;
                return (
                  <button
                    key={device.id}
                    type="button"
                    data-ocid={`linked_devices.item.${i + 1}`}
                    onClick={() => setDeviceSheet(device.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left ${
                      i < devices.length - 1 ? "border-b border-border" : ""
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
                        className={`text-[12px] ${device.active ? "text-wa-green font-semibold" : "text-muted-foreground"}`}
                      >
                        {device.status}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Link a Device button */}
        <div className="px-4 pb-2">
          <Button
            data-ocid="linked_devices.link_button"
            onClick={() => setShowQR(true)}
            className="w-full bg-wa-green hover:bg-wa-green/90 text-white"
          >
            Link a Device
          </Button>
        </div>

        {/* Log out from all */}
        <div className="px-4 pb-8">
          <button
            type="button"
            data-ocid="linked_devices.logout_all.button"
            onClick={() => setShowLogoutAll(true)}
            className="w-full py-3 rounded-xl border border-red-500/40 text-red-500 font-semibold text-[14px] hover:bg-red-500/5 transition-colors"
          >
            Log out from all devices
          </button>
        </div>
      </div>

      {/* QR scan sheet */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/60 flex items-end"
            data-ocid="linked_devices.qr.sheet"
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              className="w-full bg-card rounded-t-3xl p-6 flex flex-col items-center gap-4"
            >
              <div className="w-12 h-1 bg-border rounded-full mb-2" />
              <p className="text-[17px] font-bold text-foreground">
                Link a Device
              </p>
              <p className="text-[13px] text-muted-foreground text-center">
                Scan this QR code from another device's WhatsApp
              </p>
              <QRCodeCanvas />
              <p className="text-[12px] text-muted-foreground text-center">
                Keep your phone connected for linked devices to work
              </p>
              <button
                type="button"
                data-ocid="linked_devices.qr.close_button"
                onClick={() => setShowQR(false)}
                className="w-full py-3 rounded-xl bg-wa-green text-white font-semibold"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Device action sheet */}
      <AnimatePresence>
        {deviceSheet !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/50 flex items-end"
            data-ocid="linked_devices.device.sheet"
          >
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              className="w-full bg-card rounded-t-3xl p-6"
            >
              <div className="w-12 h-1 bg-border rounded-full mb-4 mx-auto" />
              {(() => {
                const d = devices.find((d) => d.id === deviceSheet);
                return d ? (
                  <>
                    <p className="text-[16px] font-bold text-foreground mb-1">
                      {d.name}
                    </p>
                    <p className="text-[13px] text-muted-foreground mb-5">
                      {d.status}
                    </p>
                  </>
                ) : null;
              })()}
              <button
                type="button"
                data-ocid="linked_devices.device.confirm_button"
                onClick={() => setDeviceSheet(null)}
                className="w-full text-left py-3.5 border-b border-border/60 text-[15px] text-foreground"
              >
                ✅ This is me
              </button>
              <button
                type="button"
                data-ocid="linked_devices.device.delete_button"
                onClick={() =>
                  deviceSheet !== null && logoutDevice(deviceSheet)
                }
                className="w-full text-left py-3.5 text-[15px] text-red-500 font-semibold"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Log out this device
              </button>
              <button
                type="button"
                data-ocid="linked_devices.device.cancel_button"
                onClick={() => setDeviceSheet(null)}
                className="w-full py-3 mt-3 rounded-xl bg-muted text-foreground font-semibold"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log out all confirm */}
      <AnimatePresence>
        {showLogoutAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center px-8"
            data-ocid="linked_devices.logout_all.dialog"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full bg-card rounded-2xl p-6"
            >
              <p className="text-[17px] font-bold text-foreground mb-2">
                Log out from all devices?
              </p>
              <p className="text-[14px] text-muted-foreground mb-5">
                You will be logged out from all linked devices.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  data-ocid="linked_devices.logout_all.cancel_button"
                  onClick={() => setShowLogoutAll(false)}
                  className="flex-1 py-3 rounded-xl bg-muted text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  data-ocid="linked_devices.logout_all.confirm_button"
                  onClick={() => {
                    setDevices([]);
                    setShowLogoutAll(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold"
                >
                  Log out all
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
