import {
  Archive,
  ArrowLeft,
  Download,
  FileText,
  Film,
  Folder,
  HardDrive,
  Image,
  MoreVertical,
  Search,
  Share2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CloudDriveScreenProps {
  onBack: () => void;
}

const FOLDERS = [
  {
    id: "docs",
    name: "Documents",
    count: 24,
    icon: FileText,
    color: "#3B82F6",
  },
  { id: "images", name: "Images", count: 147, icon: Image, color: "#8B5CF6" },
  { id: "videos", name: "Videos", count: 12, icon: Film, color: "#EC4899" },
  { id: "backups", name: "Backups", count: 6, icon: Archive, color: "#F59E0B" },
];

const FILES = [
  {
    id: 1,
    name: "Q1 Report 2026.pdf",
    type: "PDF",
    size: "2.4 MB",
    date: "Mar 12",
    color: "#EF4444",
  },
  {
    id: 2,
    name: "Project Assets.zip",
    type: "ZIP",
    size: "18.7 MB",
    date: "Mar 11",
    color: "#F97316",
  },
  {
    id: 3,
    name: "Profile Banner.png",
    type: "IMG",
    size: "840 KB",
    date: "Mar 10",
    color: "#3B82F6",
  },
  {
    id: 4,
    name: "Intro Video.mp4",
    type: "MP4",
    size: "64.2 MB",
    date: "Mar 9",
    color: "#8B5CF6",
  },
  {
    id: 5,
    name: "Contract Draft.pdf",
    type: "PDF",
    size: "1.1 MB",
    date: "Mar 8",
    color: "#EF4444",
  },
  {
    id: 6,
    name: "Meeting Notes.pdf",
    type: "PDF",
    size: "320 KB",
    date: "Mar 7",
    color: "#EF4444",
  },
  {
    id: 7,
    name: "Logo Final.png",
    type: "IMG",
    size: "210 KB",
    date: "Mar 6",
    color: "#3B82F6",
  },
  {
    id: 8,
    name: "Data Backup.zip",
    type: "ZIP",
    size: "95.4 MB",
    date: "Mar 5",
    color: "#F97316",
  },
];

function FileDetailSheet({
  file,
  onClose,
}: { file: (typeof FILES)[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        role="button"
        tabIndex={-1}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />
      <div
        data-ocid="cloud.file.sheet"
        className="relative w-full max-w-[390px] bg-[#1a1a2e] rounded-t-3xl p-6 pb-10"
      >
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xs"
            style={{ background: file.color }}
          >
            {file.type}
          </div>
          <div>
            <p className="text-white font-semibold">{file.name}</p>
            <p className="text-white/50 text-xs">
              {file.size} · Uploaded {file.date}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <button
            type="button"
            data-ocid="cloud.share_to_chat.button"
            onClick={() => {
              toast.success("Shared to chat!");
              onClose();
            }}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-white/5 text-white text-sm"
          >
            <Share2 className="w-4 h-4 text-purple-400" /> Share to Chat
          </button>
          <button
            type="button"
            data-ocid="cloud.download.button"
            onClick={() => {
              toast.success("Downloading...");
              onClose();
            }}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-white/5 text-white text-sm"
          >
            <Download className="w-4 h-4 text-blue-400" /> Download
          </button>
          <button
            type="button"
            data-ocid="cloud.delete.delete_button"
            onClick={() => {
              toast.success("File deleted");
              onClose();
            }}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-red-500/10 text-red-400 text-sm"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CloudDriveScreen({ onBack }: CloudDriveScreenProps) {
  const [tab, setTab] = useState<"all" | "photos" | "shared">("all");
  const [selectedFile, setSelectedFile] = useState<(typeof FILES)[0] | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);

  const filteredFiles = FILES.filter(
    (f) => !search || f.name.toLowerCase().includes(search.toLowerCase()),
  );
  const photoFiles = FILES.filter((f) => f.type === "IMG");

  return (
    <div className="flex flex-col h-full bg-[#0d0d1a] text-white overflow-hidden">
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 pt-12 pb-3 flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #1a0a2e 0%, #0d1a2e 100%)",
        }}
      >
        <button
          type="button"
          data-ocid="cloud.back.button"
          onClick={onBack}
          className="p-2 -ml-2"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="flex-1 text-lg font-bold text-white">Cloud Drive</h1>
        <button
          type="button"
          data-ocid="cloud.search.button"
          onClick={() => setSearchVisible((v) => !v)}
          className="p-2 text-white/70"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          type="button"
          data-ocid="cloud.upload.upload_button"
          onClick={() => toast.success("Upload dialog opened")}
          className="p-2 text-white/70"
        >
          <Upload className="w-5 h-5" />
        </button>
      </header>

      {searchVisible && (
        <div className="px-4 pb-3 flex-shrink-0">
          <input
            data-ocid="cloud.search_input"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Storage bar */}
      <div className="mx-4 mb-3 flex-shrink-0">
        <div className="bg-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-400" />
              <span className="text-white text-sm font-semibold">Storage</span>
            </div>
            <span className="text-white/50 text-xs">2.4 GB of 15 GB used</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: "16%",
                background: "linear-gradient(90deg, #7C3AED, #0ea5e9)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 flex-shrink-0 px-4">
        {(["all", "photos", "shared"] as const).map((t) => (
          <button
            key={t}
            type="button"
            data-ocid={`cloud.${t}.tab`}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${tab === t ? "text-purple-400 border-b-2 border-purple-400" : "text-white/40"}`}
          >
            {t === "all"
              ? "All Files"
              : t === "photos"
                ? "Photos"
                : "Shared With Me"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {/* Shared tab empty state */}
        {tab === "shared" && (
          <div
            data-ocid="cloud.shared.empty_state"
            className="flex flex-col items-center justify-center h-64 gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
              <Share2 className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/40 text-sm">
              No files shared with you yet
            </p>
          </div>
        )}

        {tab !== "shared" && (
          <div className="p-4 space-y-5">
            {/* Folders grid (only on All tab) */}
            {tab === "all" && (
              <div>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">
                  Quick Access
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {FOLDERS.map((folder, i) => (
                    <button
                      key={folder.id}
                      type="button"
                      data-ocid={`cloud.folder.item.${i + 1}`}
                      onClick={() => toast(`Opening ${folder.name}`)}
                      className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 text-left"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${folder.color}20` }}
                      >
                        <folder.icon
                          className="w-5 h-5"
                          style={{ color: folder.color }}
                        />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">
                          {folder.name}
                        </p>
                        <p className="text-white/40 text-xs">
                          {folder.count} files
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Files list */}
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">
                {tab === "all" ? "Recent Files" : "Photos"}
              </p>
              <div className="space-y-2">
                {(tab === "photos" ? photoFiles : filteredFiles).map(
                  (file, i) => (
                    <button
                      key={file.id}
                      type="button"
                      data-ocid={`cloud.file.item.${i + 1}`}
                      onClick={() => setSelectedFile(file)}
                      className="w-full flex items-center gap-3 bg-white/5 rounded-xl p-3 text-left"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                        style={{ background: file.color }}
                      >
                        {file.type}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-white/40 text-xs">
                          {file.size} · {file.date}
                        </p>
                      </div>
                      <MoreVertical className="w-4 h-4 text-white/30 flex-shrink-0" />
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        type="button"
        data-ocid="cloud.fab.upload_button"
        onClick={() => toast.success("Select files to upload")}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: "linear-gradient(135deg, #7C3AED, #0ea5e9)",
          boxShadow: "0 4px 20px rgba(124,58,237,0.5)",
        }}
      >
        <Upload className="w-6 h-6 text-white" />
      </button>

      {selectedFile && (
        <FileDetailSheet
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}
