import {
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface PhotoViewerImage {
  id: string;
  url: string;
  caption?: string;
}

interface PhotoViewerProps {
  images: PhotoViewerImage[];
  initialIndex?: number;
  onClose: () => void;
}

export default function PhotoViewer({
  images,
  initialIndex = 0,
  onClose,
}: PhotoViewerProps) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const current = images[index];

  const prev = useCallback(() => {
    if (index > 0) {
      setDirection(-1);
      setZoom(1);
      setIndex((i) => i - 1);
    }
  }, [index]);

  const next = useCallback(() => {
    if (index < images.length - 1) {
      setDirection(1);
      setZoom(1);
      setIndex((i) => i + 1);
    }
  }, [index, images.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, prev, next]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(4, Math.max(1, z - e.deltaY * 0.002)));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    } else if (dy > 80) {
      onClose();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = current.url;
    a.download = `photo-${index + 1}.jpg`;
    a.click();
    toast.success("Downloaded");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ url: current.url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(current.url);
      toast.success("Link copied");
    }
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <motion.div
      data-ocid="photo.viewer.modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header toolbar */}
      <div
        className="flex items-center justify-between px-4 py-3 z-10"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="photo.viewer.close_button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          {images.length > 1 && (
            <span className="text-white/70 text-[13px]">
              {index + 1} / {images.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="photo.viewer.download_button"
            onClick={handleDownload}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            type="button"
            data-ocid="photo.viewer.share_button"
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        className="flex-1 relative overflow-hidden flex items-center justify-center"
        onWheel={handleWheel}
      >
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.img
            key={current.id}
            src={current.url}
            alt={current.caption ?? "Photo"}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.2 }}
            style={{
              transform: `scale(${zoom})`,
              transition: "transform 0.15s ease",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
            draggable={false}
          />
        </AnimatePresence>

        {/* Nav arrows */}
        {index > 0 && (
          <button
            type="button"
            data-ocid="photo.viewer.pagination_prev"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {index < images.length - 1 && (
          <button
            type="button"
            data-ocid="photo.viewer.pagination_next"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Zoom controls + caption */}
      <div
        className="flex flex-col items-center gap-2 px-4 pb-4"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        {current.caption && (
          <p className="text-white/80 text-[13px] text-center max-w-xs">
            {current.caption}
          </p>
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="photo.viewer.zoom_out"
            onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
            disabled={zoom <= 1}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-white/60 text-[12px] w-12 text-center">
            {zoom.toFixed(1)}x
          </span>
          <button
            type="button"
            data-ocid="photo.viewer.zoom_in"
            onClick={() => setZoom((z) => Math.min(4, z + 0.5))}
            disabled={zoom >= 4}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="flex gap-1.5">
            {images.map((_, i) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: stable image index
                key={i}
                type="button"
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setZoom(1);
                  setIndex(i);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === index ? "bg-white w-3" : "bg-white/40"
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
