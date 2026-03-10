import {
  Camera,
  Check,
  Crop,
  FlipHorizontal,
  Image,
  QrCode,
  Scissors,
  Sticker,
  Type,
  X,
  ZapOff,
} from "lucide-react";
import { useState } from "react";

interface CameraModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CameraModal({ open, onClose }: CameraModalProps) {
  const [mode, setMode] = useState<"camera" | "qr">("camera");
  const [captureMode, setCaptureMode] = useState<"camera" | "preview">(
    "camera",
  );
  const [activeEditTool, setActiveEditTool] = useState<string | null>(null);

  if (!open) return null;

  if (captureMode === "preview") {
    return (
      <div
        data-ocid="camera.preview.modal"
        className="absolute inset-0 z-50 flex flex-col bg-black"
      >
        {/* Simulated captured photo */}
        <div
          className="flex-1 relative flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          }}
        >
          <div className="text-center opacity-30">
            <Camera className="w-20 h-20 text-white mx-auto" />
            <p className="text-white text-sm mt-2">Photo captured</p>
          </div>
          {/* X discard */}
          <button
            type="button"
            data-ocid="camera.preview.close_button"
            onClick={() => setCaptureMode("camera")}
            className="absolute top-4 left-4 p-2 bg-black/50 rounded-full text-white"
            style={{ top: "max(env(safe-area-inset-top, 0px), 16px)" }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Edit tools */}
        <div className="bg-black/80 px-6 py-4 flex items-center justify-between gap-4">
          {[
            { id: "sticker", label: "Sticker", icon: "🎭" },
            { id: "text", label: "Text", icon: "✏️" },
            { id: "crop", label: "Crop", icon: "✂️" },
          ].map((tool) => (
            <button
              key={tool.id}
              type="button"
              data-ocid={`camera.edit.${tool.id}.button`}
              onClick={() =>
                setActiveEditTool(activeEditTool === tool.id ? null : tool.id)
              }
              className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-colors ${activeEditTool === tool.id ? "bg-white/20" : "bg-white/10"}`}
            >
              <span className="text-xl">{tool.icon}</span>
              <span className="text-white text-[11px] font-medium">
                {tool.label}
              </span>
            </button>
          ))}
        </div>
        {/* Post button */}
        <div
          className="px-6 py-4 bg-black flex gap-3"
          style={{
            paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)",
          }}
        >
          <button
            type="button"
            data-ocid="camera.preview.post_button"
            onClick={() => {
              setCaptureMode("camera");
              onClose();
            }}
            className="flex-1 bg-wa-green text-white font-bold py-3.5 rounded-full text-[15px] hover:brightness-105 active:brightness-95 transition-all"
          >
            Post
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-ocid="camera.modal"
      className="absolute inset-0 z-50 flex flex-col bg-black animate-fade-in"
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 pb-3"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 16px)" }}
      >
        <button
          type="button"
          data-ocid="camera.close_button"
          onClick={onClose}
          className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close camera"
        >
          <X className="w-6 h-6" />
        </button>
        <span className="text-white font-semibold text-[16px]">Camera</span>
        <button
          type="button"
          data-ocid="camera.flip.button"
          className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          aria-label="Flip camera"
        >
          <FlipHorizontal className="w-6 h-6" />
        </button>
      </header>

      {/* Viewfinder */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
        {mode === "camera" ? (
          <div className="relative w-full aspect-[3/4] max-h-[60vh] rounded-2xl overflow-hidden bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center">
            {/* Simulated viewfinder corners */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg" />
            {/* Focus dot */}
            <div className="flex flex-col items-center gap-3 opacity-50">
              <Camera className="w-16 h-16 text-white" />
              <p className="text-white/60 text-sm">Camera preview</p>
            </div>
            {/* Flash indicator */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <ZapOff className="w-5 h-5 text-white/60" />
            </div>
          </div>
        ) : (
          /* QR Mode */
          <div className="relative w-64 h-64 rounded-2xl overflow-hidden bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center">
            <div className="absolute top-3 left-3 w-10 h-10 border-t-4 border-l-4 border-[#25D366] rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-10 h-10 border-t-4 border-r-4 border-[#25D366] rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-10 h-10 border-b-4 border-l-4 border-[#25D366] rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-10 h-10 border-b-4 border-r-4 border-[#25D366] rounded-br-lg" />
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-[#25D366]/60 animate-pulse" />
            <QrCode className="w-16 h-16 text-white/40" />
          </div>
        )}
      </div>

      {/* Mode tabs */}
      <div className="flex items-center justify-center gap-6 py-3">
        <button
          type="button"
          data-ocid="camera.mode.tab"
          onClick={() => setMode("camera")}
          className={`text-[13px] font-semibold transition-colors ${
            mode === "camera" ? "text-white" : "text-white/50"
          }`}
        >
          PHOTO
        </button>
        <button
          type="button"
          data-ocid="camera.qr.tab"
          onClick={() => setMode("qr")}
          className={`text-[13px] font-semibold transition-colors flex items-center gap-1 ${
            mode === "qr" ? "text-white" : "text-white/50"
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          QR CODE
        </button>
      </div>

      {/* Bottom controls */}
      <div
        className="flex items-center justify-around px-8 pb-6 pt-2"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 24px)" }}
      >
        {/* Gallery */}
        <button
          type="button"
          data-ocid="camera.gallery.button"
          className="w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-600 flex items-center justify-center hover:bg-zinc-700 transition-colors"
          aria-label="Open gallery"
        >
          <Image className="w-6 h-6 text-white" />
        </button>

        {/* Shutter */}
        <button
          type="button"
          data-ocid="camera.shutter.button"
          className="w-16 h-16 rounded-full bg-white border-4 border-zinc-400 hover:scale-95 active:scale-90 transition-transform flex items-center justify-center"
          aria-label="Take photo"
          onClick={() => setCaptureMode("preview")}
        >
          <div className="w-12 h-12 rounded-full bg-white" />
        </button>

        {/* QR toggle */}
        <button
          type="button"
          data-ocid="camera.qr.toggle"
          onClick={() => setMode((m) => (m === "camera" ? "qr" : "camera"))}
          className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center hover:bg-zinc-700 transition-colors"
          aria-label="Toggle QR scanner"
        >
          <QrCode className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
