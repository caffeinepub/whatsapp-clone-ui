import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ChevronLeft,
  Image,
  Mic,
  MicOff,
  Play,
  Square,
  Type,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StatusPostDialogProps {
  open: boolean;
  onClose: () => void;
  onPost: (text: string) => void;
}

const BG_OPTIONS = [
  {
    id: "green",
    label: "Forest",
    class: "bg-gradient-to-br from-[#0d7a44] to-[#064d2a]",
  },
  {
    id: "purple",
    label: "Violet",
    class: "bg-gradient-to-br from-[#7c3aed] to-[#4c1d95]",
  },
  {
    id: "blue",
    label: "Ocean",
    class: "bg-gradient-to-br from-[#1e40af] to-[#1e3a8a]",
  },
  {
    id: "red",
    label: "Flame",
    class: "bg-gradient-to-br from-[#dc2626] to-[#7f1d1d]",
  },
  {
    id: "orange",
    label: "Sunset",
    class: "bg-gradient-to-br from-[#ea580c] to-[#9a3412]",
  },
  {
    id: "dark",
    label: "Night",
    class: "bg-gradient-to-br from-[#1f2937] to-[#111827]",
  },
  {
    id: "teal",
    label: "Teal",
    class: "bg-gradient-to-br from-[#0d9488] to-[#115e59]",
  },
  {
    id: "pink",
    label: "Rose",
    class: "bg-gradient-to-br from-[#db2777] to-[#831843]",
  },
];

const FONTS = [
  { id: "sans", label: "Aa", class: "font-sans", name: "Sans", style: {} },
  { id: "serif", label: "Aa", class: "font-serif", name: "Serif", style: {} },
  { id: "mono", label: "Aa", class: "font-mono", name: "Mono", style: {} },
  {
    id: "handwriting",
    label: "Aa",
    class: "",
    name: "Script",
    style: { fontFamily: "cursive" },
  },
  { id: "bold", label: "Aa", class: "font-bold", name: "Bold", style: {} },
];

const TEXT_EFFECTS = [
  { id: "none", label: "None" },
  { id: "shadow", label: "Shadow" },
  { id: "outline", label: "Outline" },
  { id: "glow", label: "Glow" },
];

const FILTERS = [
  { id: "normal", label: "Normal", style: {} },
  {
    id: "vivid",
    label: "Vivid",
    style: { filter: "saturate(1.8) contrast(1.1)" },
  },
  {
    id: "warm",
    label: "Warm",
    style: { filter: "sepia(0.4) saturate(1.3) brightness(1.05)" },
  },
  {
    id: "cool",
    label: "Cool",
    style: { filter: "hue-rotate(20deg) saturate(0.9) brightness(1.05)" },
  },
  { id: "bw", label: "B&W", style: { filter: "grayscale(1) contrast(1.1)" } },
  {
    id: "vintage",
    label: "Vintage",
    style: { filter: "sepia(0.7) saturate(0.8) contrast(0.9) brightness(0.9)" },
  },
];

type TabType = "text" | "media" | "audio";
type Align = "left" | "center" | "right";

export default function StatusPostDialog({
  open,
  onClose,
  onPost,
}: StatusPostDialogProps) {
  const [tab, setTab] = useState<TabType>("text");

  // Text tab state
  const [text, setText] = useState("");
  const [selectedBg, setSelectedBg] = useState(BG_OPTIONS[0]);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [textEffect, setTextEffect] = useState(TEXT_EFFECTS[0]);
  const [align, setAlign] = useState<Align>("center");

  // Media tab state
  const [_mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [caption, setCaption] = useState("");
  const [textOverlay, setTextOverlay] = useState("");
  const [showTextOverlay, setShowTextOverlay] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio tab state
  const [recording, setRecording] = useState(false);
  const [audioSecs, setAudioSecs] = useState(0);
  const [audioRecorded, setAudioRecorded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) {
      // reset on close
      setText("");
      setMediaFile(null);
      setMediaUrl(null);
      setCaption("");
      setTextOverlay("");
      setShowTextOverlay(false);
      setRecording(false);
      setAudioSecs(0);
      setAudioRecorded(false);
      setTab("text");
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    const url = URL.createObjectURL(file);
    setMediaUrl(url);
  };

  const startRecording = () => {
    setRecording(true);
    setAudioSecs(0);
    timerRef.current = setInterval(() => setAudioSecs((s) => s + 1), 1000);
  };

  const stopRecording = () => {
    setRecording(false);
    setAudioRecorded(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handlePost = () => {
    if (tab === "text" && text.trim()) {
      onPost(text.trim());
    } else if (tab === "media" && mediaUrl) {
      onPost(caption || "📷 Photo");
    } else if (tab === "audio" && audioRecorded) {
      onPost(`🎤 Voice status (${formatTime(audioSecs)})`);
    }
    onClose();
  };

  const canPost =
    (tab === "text" && !!text.trim()) ||
    (tab === "media" && !!mediaUrl) ||
    (tab === "audio" && audioRecorded);

  const alignClass =
    align === "left"
      ? "text-left"
      : align === "right"
        ? "text-right"
        : "text-center";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        data-ocid="status.dialog"
        className="max-w-[400px] w-full mx-2 rounded-2xl p-0 overflow-hidden gap-0"
      >
        <DialogHeader className="px-4 pt-4 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="status.close_button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <DialogTitle className="text-[17px] font-semibold">
              Create status
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-border flex-shrink-0">
          {(["text", "media", "audio"] as TabType[]).map((t) => (
            <button
              key={t}
              type="button"
              data-ocid={`status.${t}.tab`}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 flex flex-col items-center gap-1 text-[11px] font-medium transition-colors border-b-2 ${
                tab === t
                  ? "border-wa-green text-wa-green"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "text" && <Type className="w-4 h-4" />}
              {t === "media" && <Image className="w-4 h-4" />}
              {t === "audio" && <Mic className="w-4 h-4" />}
              {t === "text" ? "Text" : t === "media" ? "Photo/Video" : "Audio"}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto max-h-[65vh]">
          {/* TEXT TAB */}
          {tab === "text" && (
            <div className="flex flex-col gap-3 p-4">
              {/* Preview */}
              <div
                className={`w-full rounded-xl flex items-center justify-center min-h-[160px] p-4 ${selectedBg.class}`}
              >
                {text ? (
                  <p
                    className={`text-white text-[18px] font-semibold ${selectedFont.class} ${alignClass} w-full break-words`}
                    style={{
                      ...selectedFont.style,
                      textShadow:
                        textEffect.id === "shadow"
                          ? "2px 2px 6px rgba(0,0,0,0.8)"
                          : textEffect.id === "glow"
                            ? "0 0 12px rgba(255,255,255,0.9), 0 0 24px rgba(255,255,255,0.5)"
                            : undefined,
                      WebkitTextStroke:
                        textEffect.id === "outline" ? "1px white" : undefined,
                      color:
                        textEffect.id === "outline" ? "transparent" : undefined,
                    }}
                  >
                    {text}
                  </p>
                ) : (
                  <p className="text-white/40 text-[14px] italic">
                    Your text here…
                  </p>
                )}
              </div>

              {/* Text input */}
              <textarea
                data-ocid="status.textarea"
                placeholder="Type your status…"
                value={text}
                onChange={(e) =>
                  e.target.value.length <= 139 && setText(e.target.value)
                }
                className="w-full bg-muted rounded-lg px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[72px]"
              />
              <div className="text-right text-[11px] text-muted-foreground -mt-2">
                {139 - text.length} remaining
              </div>

              {/* Background colors */}
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Background
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {BG_OPTIONS.map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      data-ocid={"status.bg.button"}
                      onClick={() => setSelectedBg(bg)}
                      className={`rounded-lg h-10 ${bg.class} border-2 transition-all ${
                        selectedBg.id === bg.id
                          ? "border-white scale-105"
                          : "border-transparent"
                      }`}
                      title={bg.label}
                    />
                  ))}
                </div>
              </div>

              {/* Font selector */}
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Font
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {FONTS.map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      data-ocid="status.font.button"
                      onClick={() => setSelectedFont(font)}
                      className={`py-2 rounded-lg text-[14px] font-semibold border-2 transition-all ${font.class} ${
                        selectedFont.id === font.id
                          ? "border-wa-green bg-wa-green/10 text-wa-green"
                          : "border-border text-foreground hover:border-muted-foreground"
                      }`}
                      style={font.style}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-1 mt-1">
                  {FONTS.map((font) => (
                    <span
                      key={font.id}
                      className="text-center text-[9px] text-muted-foreground"
                      style={font.style}
                    >
                      {font.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Text effects */}
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Text Effect
                </p>
                <div className="flex gap-2">
                  {TEXT_EFFECTS.map((effect) => (
                    <button
                      key={effect.id}
                      type="button"
                      data-ocid="status.effect.button"
                      onClick={() => setTextEffect(effect)}
                      className={`flex-1 py-2 rounded-lg text-[12px] font-semibold border-2 transition-all ${
                        textEffect.id === effect.id
                          ? "border-wa-green bg-wa-green/10 text-wa-green"
                          : "border-border text-foreground hover:border-muted-foreground"
                      }`}
                    >
                      {effect.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text alignment */}
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Alignment
                </p>
                <div className="flex gap-2">
                  {(["left", "center", "right"] as Align[]).map((a) => (
                    <button
                      key={a}
                      type="button"
                      data-ocid={"status.align.button"}
                      onClick={() => setAlign(a)}
                      className={`flex-1 py-2 rounded-lg border-2 flex justify-center transition-all ${
                        align === a
                          ? "border-wa-green bg-wa-green/10 text-wa-green"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {a === "left" && <AlignLeft className="w-4 h-4" />}
                      {a === "center" && <AlignCenter className="w-4 h-4" />}
                      {a === "right" && <AlignRight className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MEDIA TAB */}
          {tab === "media" && (
            <div className="flex flex-col gap-3 p-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {!mediaUrl ? (
                <button
                  type="button"
                  data-ocid="status.upload_button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 hover:border-wa-green hover:bg-wa-green/5 transition-all"
                >
                  <Image className="w-10 h-10 text-muted-foreground" />
                  <p className="text-[14px] text-muted-foreground">
                    Tap to choose photo or video
                  </p>
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Image preview with filter */}
                  <div className="relative w-full rounded-xl overflow-hidden">
                    <img
                      src={mediaUrl}
                      alt="Status preview"
                      className="w-full object-cover max-h-48"
                      style={selectedFilter.style}
                    />
                    {/* Toolbar overlay */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        data-ocid="status.media.edit_button"
                        onClick={() => setShowTextOverlay(!showTextOverlay)}
                        className="bg-black/50 text-white p-1.5 rounded-full"
                        title="Add text"
                      >
                        <Type className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        data-ocid="status.media.crop_button"
                        onClick={() => alert("Crop mode (UI only)")}
                        className="bg-black/50 text-white p-1.5 rounded-full"
                        title="Crop"
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path d="M6 2v14h14" />
                          <path d="M18 22V8H4" />
                        </svg>
                      </button>
                    </div>
                    {showTextOverlay && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <input
                          data-ocid="status.media.text_overlay.input"
                          type="text"
                          placeholder="Add text…"
                          value={textOverlay}
                          onChange={(e) => setTextOverlay(e.target.value)}
                          className="bg-transparent text-white font-bold text-[18px] text-center outline-none w-full px-4 drop-shadow-lg placeholder:text-white/60"
                        />
                      </div>
                    )}
                  </div>

                  {/* Filter strip */}
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Filters
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {FILTERS.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          data-ocid="status.filter.button"
                          onClick={() => setSelectedFilter(f)}
                          className={
                            "flex flex-col items-center gap-1 flex-shrink-0"
                          }
                        >
                          <div
                            className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                              selectedFilter.id === f.id
                                ? "border-wa-green"
                                : "border-border"
                            }`}
                          >
                            <img
                              src={mediaUrl}
                              alt={f.label}
                              className="w-full h-full object-cover"
                              style={f.style}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {f.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Caption */}
                  <input
                    data-ocid="status.caption.input"
                    type="text"
                    placeholder="Add a caption…"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full bg-muted rounded-lg px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
                  />

                  <button
                    type="button"
                    data-ocid="status.media.change_button"
                    onClick={() => {
                      setMediaFile(null);
                      setMediaUrl(null);
                    }}
                    className="text-[13px] text-muted-foreground underline text-center"
                  >
                    Change photo/video
                  </button>
                </div>
              )}
            </div>
          )}

          {/* AUDIO TAB */}
          {tab === "audio" && (
            <div className="flex flex-col items-center gap-6 p-6">
              <div className="w-24 h-24 rounded-full bg-wa-green/10 flex items-center justify-center">
                <Mic className="w-10 h-10 text-wa-green" />
              </div>

              {recording ? (
                <>
                  {/* Waveform animation */}
                  <div className="flex items-center gap-1 h-10">
                    {Array.from({ length: 20 }, (_, i) => i).map((barIdx) => (
                      <div
                        key={barIdx}
                        className="w-1 bg-wa-green rounded-full"
                        style={{
                          height: `${Math.random() * 28 + 8}px`,
                          animation: `pulse ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate`,
                          animationDelay: `${barIdx * 0.05}s`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-[22px] font-mono font-bold text-foreground">
                    {formatTime(audioSecs)}
                  </p>
                  <button
                    type="button"
                    data-ocid="status.audio.stop_button"
                    onClick={stopRecording}
                    className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <Square className="w-6 h-6 text-white" />
                  </button>
                  <p className="text-[13px] text-muted-foreground">
                    Tap to stop recording
                  </p>
                </>
              ) : audioRecorded ? (
                <>
                  <p className="text-[16px] font-semibold text-foreground">
                    Recorded: {formatTime(audioSecs)}
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      data-ocid="status.audio.play_button"
                      className="flex items-center gap-2 px-4 py-2 bg-wa-green text-white rounded-full text-[14px] font-medium"
                    >
                      <Play className="w-4 h-4" /> Preview
                    </button>
                    <button
                      type="button"
                      data-ocid="status.audio.rerecord_button"
                      onClick={() => {
                        setAudioRecorded(false);
                        setAudioSecs(0);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-full text-[14px] font-medium"
                    >
                      <MicOff className="w-4 h-4" /> Re-record
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[15px] text-muted-foreground text-center">
                    Tap the button to start recording your voice status
                  </p>
                  <button
                    type="button"
                    data-ocid="status.audio.record_button"
                    onClick={startRecording}
                    className="w-16 h-16 rounded-full bg-wa-green flex items-center justify-center shadow-lg hover:bg-wa-green/90 transition-colors"
                  >
                    <Mic className="w-7 h-7 text-white" />
                  </button>
                  <p className="text-[13px] text-muted-foreground">
                    Tap to record
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Post button */}
        <div className="px-4 py-3 border-t border-border flex-shrink-0">
          <Button
            type="button"
            data-ocid="status.submit_button"
            onClick={handlePost}
            disabled={!canPost}
            className="w-full bg-wa-green hover:bg-wa-green/90 text-white font-semibold text-[15px] h-11 rounded-full"
          >
            Post status
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
