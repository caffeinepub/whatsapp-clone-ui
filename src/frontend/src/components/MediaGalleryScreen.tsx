import { ArrowLeft, ExternalLink, File, Link } from "lucide-react";
import { useState } from "react";

interface MediaGalleryScreenProps {
  onBack: () => void;
  contactName: string;
}

type GalleryTab = "media" | "links" | "docs";

const MEDIA_ITEMS = [
  { emoji: "🏖️", bg: "bg-amber-300" },
  { emoji: "🌸", bg: "bg-pink-300" },
  { emoji: "🎨", bg: "bg-purple-300" },
  { emoji: "🍕", bg: "bg-orange-300" },
  { emoji: "🌿", bg: "bg-green-300" },
  { emoji: "🎵", bg: "bg-blue-300" },
  { emoji: "🏔️", bg: "bg-sky-300" },
  { emoji: "🦋", bg: "bg-violet-300" },
  { emoji: "🌊", bg: "bg-cyan-300" },
  { emoji: "🎭", bg: "bg-red-300" },
  { emoji: "🌺", bg: "bg-rose-300" },
  { emoji: "🦜", bg: "bg-teal-300" },
];

const LINK_ITEMS = [
  {
    title: "Figma Design System",
    url: "https://figma.com/design-system",
    domain: "figma.com",
    preview: "Shared design tokens and components for the project",
  },
  {
    title: "Project Roadmap 2026",
    url: "https://notion.so/roadmap",
    domain: "notion.so",
    preview: "Q1-Q4 milestones and deliverables overview",
  },
  {
    title: "Sprint Review Recording",
    url: "https://drive.google.com/recording",
    domain: "drive.google.com",
    preview: "Video recording from last Friday's sprint review session",
  },
];

const DOC_ITEMS = [
  {
    name: "Product Requirements v2.pdf",
    size: "2.4 MB",
    date: "Mar 7, 2026",
    emoji: "📋",
  },
  {
    name: "User Research Report.docx",
    size: "1.1 MB",
    date: "Mar 5, 2026",
    emoji: "📝",
  },
  {
    name: "Sprint Planning Deck.pptx",
    size: "5.8 MB",
    date: "Mar 3, 2026",
    emoji: "📊",
  },
];

export default function MediaGalleryScreen({
  onBack,
  contactName,
}: MediaGalleryScreenProps) {
  const [activeTab, setActiveTab] = useState<GalleryTab>("media");

  return (
    <div
      data-ocid="media_gallery.panel"
      className="absolute inset-0 z-50 flex flex-col bg-background animate-slide-up"
    >
      {/* Sticky header */}
      <header
        className="sticky top-0 z-50 bg-wa-header flex flex-col flex-shrink-0"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
      >
        <div className="flex items-center gap-2 px-2 pb-2">
          <button
            type="button"
            data-ocid="media_gallery.back.button"
            onClick={onBack}
            className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-wa-header-fg text-[18px] font-bold font-display truncate">
              {contactName}
            </h2>
            <p className="text-wa-header-fg/60 text-[12px]">
              Media, links and docs
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {(["media", "links", "docs"] as GalleryTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              data-ocid={`media_gallery.${tab}.tab`}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-[13px] font-semibold uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? "text-wa-header-fg border-b-2 border-wa-green"
                  : "text-wa-header-fg/50 hover:text-wa-header-fg/70"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto bg-secondary/20">
        {activeTab === "media" && (
          <div className="p-1">
            <div className="grid grid-cols-3 gap-0.5">
              {MEDIA_ITEMS.map((item, i) => (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable gallery
                  key={i}
                  type="button"
                  data-ocid={`media_gallery.media.item.${i + 1}`}
                  className={`aspect-square ${item.bg} flex items-center justify-center text-3xl hover:opacity-90 active:opacity-75 transition-opacity`}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "links" && (
          <div className="p-3 space-y-2">
            {LINK_ITEMS.map((link, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: stable list
                key={i}
                data-ocid={`media_gallery.link.item.${i + 1}`}
                className="bg-card rounded-2xl overflow-hidden"
              >
                <div className="flex items-start gap-3 p-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Link className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px] text-foreground truncate">
                      {link.title}
                    </p>
                    <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-2">
                      {link.preview}
                    </p>
                    <p className="text-[11px] text-wa-green mt-1 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      {link.domain}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "docs" && (
          <div className="p-3 space-y-2">
            {DOC_ITEMS.map((doc, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: stable list
                key={i}
                data-ocid={`media_gallery.doc.item.${i + 1}`}
                className="bg-card rounded-2xl"
              >
                <button
                  type="button"
                  className="flex items-center gap-3 w-full p-4 hover:bg-muted/40 rounded-2xl transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0 relative">
                    <File className="w-6 h-6 text-muted-foreground" />
                    <span className="absolute -bottom-1 -right-1 text-lg">
                      {doc.emoji}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px] text-foreground truncate">
                      {doc.name}
                    </p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      {doc.size} · {doc.date}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
