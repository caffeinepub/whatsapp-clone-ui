import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  HardDrive,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const BACKUP_HISTORY = [
  { id: 1, date: "Today, 2:30 PM", size: "45 MB", status: "complete" },
  { id: 2, date: "Yesterday, 11:00 AM", size: "44 MB", status: "complete" },
  { id: 3, date: "Mar 10, 9:15 AM", size: "42 MB", status: "complete" },
];

interface Props {
  onBack: () => void;
}

export default function ChatBackupScreen({ onBack }: Props) {
  const [backing, setBacking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastBackup, setLastBackup] = useState("Today at 2:30 PM • 45 MB");
  const [frequency, setFrequency] = useState("Daily");
  const [network, setNetwork] = useState("Wi-Fi only");
  const [includeVideos, setIncludeVideos] = useState(false);
  const [restoring, setRestoring] = useState<number | null>(null);
  const [restoreProgress, setRestoreProgress] = useState(0);

  const startBackup = () => {
    if (backing) return;
    setBacking(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setBacking(false);
          const now = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          setLastBackup(`Today at ${now} • 45 MB`);
          toast.success("Backup complete!");
          return 100;
        }
        return prev + 3;
      });
    }, 90);
  };

  const startRestore = (id: number) => {
    setRestoring(id);
    setRestoreProgress(0);
    const interval = setInterval(() => {
      setRestoreProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setRestoring(null);
          toast.success("Restore complete! Chats restored.");
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-background">
      <header className="flex items-center gap-3 px-4 py-3 bg-[#1f2c34] flex-shrink-0">
        <button
          type="button"
          data-ocid="backup.back.button"
          onClick={onBack}
          className="p-1 text-white/80 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-white font-semibold text-[17px]">Chat Backup</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Google Drive section */}
        <div className="bg-card mx-4 mt-4 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-blue-600/20 flex items-center justify-center">
            <span className="text-2xl">☁️</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[14px] text-foreground">
              Google Drive
            </p>
            <p className="text-[12px] text-green-500">
              user@gmail.com • Connected
            </p>
          </div>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>

        {/* Backup status */}
        <div className="bg-card mx-4 mt-3 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <p className="text-[13px] text-muted-foreground">
              Last backup: {lastBackup}
            </p>
          </div>

          {backing ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-foreground">Backing up...</p>
                <p className="text-[13px] text-[#25D366] font-medium">
                  {progress}%
                </p>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  data-ocid="backup.progress.loading_state"
                  className="h-full bg-[#25D366] rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Please keep the app open
              </p>
            </div>
          ) : progress === 100 ? (
            <div
              data-ocid="backup.success_state"
              className="flex items-center gap-2 text-green-500"
            >
              <CheckCircle className="w-5 h-5" />
              <p className="text-[13px] font-medium">Backup complete!</p>
            </div>
          ) : null}

          <button
            type="button"
            data-ocid="backup.start.primary_button"
            onClick={startBackup}
            disabled={backing}
            className="w-full mt-3 py-3 bg-[#25D366] hover:bg-[#25D366]/90 disabled:opacity-60 text-white rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${backing ? "animate-spin" : ""}`} />
            {backing ? "Backing up..." : "Back Up Now"}
          </button>
        </div>

        {/* Settings */}
        <div className="bg-card mx-4 mt-3 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border/40">
            <p className="text-[12px] text-muted-foreground uppercase font-semibold tracking-wide mb-2">
              AUTO BACKUP
            </p>
            <div className="flex items-center justify-between">
              <p className="text-[14px] text-foreground">Backup frequency</p>
              <select
                data-ocid="backup.frequency.select"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="bg-muted/60 text-foreground text-[13px] rounded-lg px-2 py-1 outline-none border-0"
              >
                {["Daily", "Weekly", "Monthly", "Off"].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="px-4 py-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <p className="text-[14px] text-foreground">Backup over</p>
              <select
                data-ocid="backup.network.select"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="bg-muted/60 text-foreground text-[13px] rounded-lg px-2 py-1 outline-none border-0"
              >
                {["Wi-Fi only", "Wi-Fi or cellular"].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-[14px] text-foreground">Include videos</p>
              <p className="text-[11px] text-muted-foreground">
                This may use more storage
              </p>
            </div>
            <Switch
              data-ocid="backup.videos.switch"
              checked={includeVideos}
              onCheckedChange={setIncludeVideos}
            />
          </div>
        </div>

        {/* Backup history */}
        <div className="mx-4 mt-3 mb-6">
          <p className="text-[12px] text-muted-foreground uppercase font-semibold tracking-wide px-1 mb-2">
            BACKUP HISTORY
          </p>
          <div className="bg-card rounded-2xl overflow-hidden">
            {BACKUP_HISTORY.map((bk, i) => (
              <div
                key={bk.id}
                data-ocid={`backup.history.item.${i + 1}`}
                className="px-4 py-3 border-b border-border/40 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <HardDrive className="w-5 h-5 text-[#25D366] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[13px] text-foreground font-medium">
                      {bk.date}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {bk.size}
                    </p>
                  </div>
                  {restoring === bk.id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          data-ocid="backup.restore.loading_state"
                          className="h-full bg-[#25D366] rounded-full transition-all"
                          style={{ width: `${restoreProgress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[#25D366]">
                        {restoreProgress}%
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      data-ocid={`backup.restore.button.${i + 1}`}
                      onClick={() => startRestore(bk.id)}
                      className="px-3 py-1.5 bg-[#25D366]/15 text-[#25D366] rounded-lg text-[12px] font-medium"
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
