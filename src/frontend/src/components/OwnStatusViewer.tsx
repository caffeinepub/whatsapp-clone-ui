import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Eye, Forward, Heart, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OwnStatusData {
  imageUrl: string;
  caption: string;
  filter: string;
  timestamp: number;
  likes: string[];
  comments: { name: string; text: string }[];
  views: string[];
}

interface OwnStatusViewerProps {
  open: boolean;
  onClose: () => void;
  statusData: OwnStatusData | null;
}

const FILTER_STYLES: Record<string, string> = {
  normal: "none",
  warm: "sepia(0.4) saturate(1.4) brightness(1.05)",
  cool: "hue-rotate(200deg) saturate(1.2) brightness(1.05)",
  bw: "grayscale(1) contrast(1.1)",
  fade: "opacity(0.85) saturate(0.6) brightness(1.15)",
  vivid: "saturate(2) contrast(1.1)",
};

const MOCK_VIEWERS = [
  { name: "Emma Rodriguez", time: "2m ago" },
  { name: "Marcus Chen", time: "5m ago" },
  { name: "Priya Sharma", time: "12m ago" },
  { name: "Jordan Williams", time: "1h ago" },
];

export default function OwnStatusViewer({
  open,
  onClose,
  statusData,
}: OwnStatusViewerProps) {
  const [showViewers, setShowViewers] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState(statusData?.comments ?? []);
  const [likes, setLikes] = useState<string[]>(statusData?.likes ?? []);
  const [liked, setLiked] = useState(false);

  if (!statusData) return null;

  const filterStyle = FILTER_STYLES[statusData.filter] ?? undefined;
  const viewCount = MOCK_VIEWERS.length + statusData.views.length;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[300] bg-black flex flex-col"
          data-ocid="own.status.panel"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 pt-12 pb-4">
            <button
              type="button"
              data-ocid="own.status.close_button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <p className="text-white font-semibold">My Status</p>
            <div className="w-9" />
          </div>

          {/* Progress bar */}
          <div className="px-4 mb-2">
            <div className="h-0.5 bg-white/30 rounded-full">
              <div className="h-full w-1/2 bg-white rounded-full" />
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center overflow-hidden relative">
            <img
              src={statusData.imageUrl}
              alt="My status"
              className="max-w-full max-h-full object-contain"
              style={{
                filter: filterStyle !== "none" ? filterStyle : undefined,
              }}
            />
            {statusData.caption && (
              <div className="absolute bottom-4 left-0 right-0 text-center px-8">
                <p className="text-white text-[16px] font-medium bg-black/40 px-4 py-2 rounded-2xl inline-block">
                  {statusData.caption}
                </p>
              </div>
            )}
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-around px-6 py-4 bg-black/60">
            {/* Views */}
            <button
              type="button"
              data-ocid="own.status.views.button"
              onClick={() => setShowViewers(true)}
              className="flex flex-col items-center gap-1 text-white"
            >
              <Eye className="w-6 h-6" />
              <span className="text-[11px]">{viewCount}</span>
            </button>
            {/* Likes */}
            <button
              type="button"
              data-ocid="own.status.likes.button"
              onClick={() => {
                setLiked((p) => !p);
                setLikes((prev) =>
                  liked ? prev.filter((n) => n !== "You") : [...prev, "You"],
                );
              }}
              className={`flex flex-col items-center gap-1 ${liked ? "text-red-400" : "text-white"}`}
            >
              <Heart className={`w-6 h-6 ${liked ? "fill-red-400" : ""}`} />
              <span className="text-[11px]">{likes.length}</span>
            </button>
            {/* Comments */}
            <button
              type="button"
              data-ocid="own.status.comments.button"
              onClick={() => setShowComments(true)}
              className="flex flex-col items-center gap-1 text-white"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-[11px]">{comments.length}</span>
            </button>
            {/* Forward */}
            <button
              type="button"
              data-ocid="own.status.forward.button"
              onClick={() => toast.success("Opening contact selector...")}
              className="flex flex-col items-center gap-1 text-white"
            >
              <Forward className="w-6 h-6" />
              <span className="text-[11px]">Share</span>
            </button>
          </div>

          {/* Safe area */}
          <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
        </div>
      )}

      {/* Viewers sheet */}
      <Sheet open={showViewers} onOpenChange={setShowViewers}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[60vh]"
          data-ocid="own.status.viewers.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-[16px] font-bold mb-4">Viewed by {viewCount}</h3>
          <div className="space-y-3">
            {MOCK_VIEWERS.map((v) => (
              <div key={v.name} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[13px] font-bold">
                    {v.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-foreground">
                    {v.name}
                  </p>
                  <p className="text-[12px] text-muted-foreground">{v.time}</p>
                </div>
                <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Comments sheet */}
      <Sheet open={showComments} onOpenChange={setShowComments}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[70vh] flex flex-col"
          data-ocid="own.status.comments.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-[16px] font-bold mb-4">
            Comments {comments.length}
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3">
            {comments.length === 0 && (
              <p
                className="text-[13px] text-muted-foreground text-center py-8"
                data-ocid="own.status.comments.empty_state"
              >
                No comments yet
              </p>
            )}
            {comments.map((c, i) => (
              <div
                key={`comment-${c.name}-${c.text.slice(0, 8)}`}
                data-ocid={`own.status.comment.item.${i + 1}`}
                className="flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[11px] font-bold">
                    {c.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 bg-muted rounded-2xl px-3 py-2">
                  <p className="text-[12px] font-bold text-foreground">
                    {c.name}
                  </p>
                  <p className="text-[13px] text-foreground">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4 pt-3 border-t border-border">
            <input
              type="text"
              data-ocid="own.status.comment.input"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 bg-muted rounded-full px-4 py-2 text-[14px] text-foreground outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && commentInput.trim()) {
                  setComments((prev) => [
                    ...prev,
                    { name: "You", text: commentInput.trim() },
                  ]);
                  setCommentInput("");
                }
              }}
            />
            <button
              type="button"
              data-ocid="own.status.comment.submit_button"
              onClick={() => {
                if (!commentInput.trim()) return;
                setComments((prev) => [
                  ...prev,
                  { name: "You", text: commentInput.trim() },
                ]);
                setCommentInput("");
              }}
              className="w-10 h-10 bg-wa-green rounded-full flex items-center justify-center flex-shrink-0"
            >
              <span className="text-white text-[18px]">↑</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
