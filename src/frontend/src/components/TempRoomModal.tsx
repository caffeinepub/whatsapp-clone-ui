import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface TempRoom {
  id: string;
  name: string;
  expiresAt: number;
  createdAt: number;
}

export function getTempRooms(): TempRoom[] {
  try {
    const raw = localStorage.getItem("temp_rooms");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTempRooms(rooms: TempRoom[]) {
  localStorage.setItem("temp_rooms", JSON.stringify(rooms));
}

export function formatRoomCountdown(expiresAt: number): string {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return "Expired";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 24) {
    const d = Math.floor(h / 24);
    return `Expires in ${d}d ${h % 24}h`;
  }
  return `Expires in ${h}h ${m}m`;
}

const EXPIRY_OPTIONS = [
  { label: "1 hour", ms: 3600000 },
  { label: "6 hours", ms: 21600000 },
  { label: "24 hours", ms: 86400000 },
  { label: "7 days", ms: 604800000 },
];

interface TempRoomModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (room: TempRoom) => void;
}

export default function TempRoomModal({
  open,
  onClose,
  onCreated,
}: TempRoomModalProps) {
  const [roomName, setRoomName] = useState("");
  const [expiryMs, setExpiryMs] = useState(3600000);

  if (!open) return null;

  const handleCreate = () => {
    if (!roomName.trim()) {
      toast.error("Please enter a room name", { position: "top-center" });
      return;
    }
    const now = Date.now();
    const room: TempRoom = {
      id: `temp_${now}`,
      name: roomName.trim(),
      expiresAt: now + expiryMs,
      createdAt: now,
    };
    const rooms = getTempRooms();
    rooms.push(room);
    saveTempRooms(rooms);
    onCreated(room);
    setRoomName("");
    setExpiryMs(3600000);
    toast.success(`Temp room "${room.name}" created!`, {
      position: "top-center",
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end justify-center"
      data-ocid="temp_room.modal"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-[420px] bg-background rounded-t-2xl shadow-2xl overflow-hidden pb-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border/30">
          <p className="text-[16px] font-semibold text-foreground">
            ⏱ New Temp Room
          </p>
          <button
            type="button"
            data-ocid="temp_room.close_button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-5 space-y-4">
          {/* Room name */}
          <div>
            <p className="text-[12px] text-muted-foreground uppercase tracking-wide font-semibold mb-1.5">
              Room Name
            </p>
            <input
              id="temp-room-name"
              type="text"
              data-ocid="temp_room.input"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Study group, Quick standup..."
              className="w-full bg-muted/40 rounded-xl px-4 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground outline-none border border-border/30 focus:border-wa-green/50 transition-colors"
              maxLength={40}
            />
          </div>

          {/* Expiry selector */}
          <div>
            <p className="text-[12px] text-muted-foreground uppercase tracking-wide font-semibold mb-2">
              Auto-Delete After
            </p>
            <div className="grid grid-cols-2 gap-2">
              {EXPIRY_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.ms}
                  data-ocid="temp_room.select"
                  onClick={() => setExpiryMs(opt.ms)}
                  className={`py-2.5 rounded-xl text-[13px] font-medium border transition-all ${
                    expiryMs === opt.ms
                      ? "bg-wa-green text-white border-wa-green"
                      : "bg-muted/30 text-foreground border-border/30 hover:border-wa-green/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            data-ocid="temp_room.primary_button"
            onClick={handleCreate}
            className="w-full py-3 rounded-xl bg-wa-green text-white font-semibold text-[14px] hover:bg-wa-green/90 transition-colors"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}
