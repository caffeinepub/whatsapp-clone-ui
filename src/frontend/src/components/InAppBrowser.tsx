import { ArrowLeft, ArrowRight, Globe, RefreshCw, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface InAppBrowserProps {
  url: string;
  onClose: () => void;
}

function getFavicon(url: string): string {
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?sz=32&domain=${u.hostname}`;
  } catch {
    return "";
  }
}

function getTitle(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export default function InAppBrowser({ url, onClose }: InAppBrowserProps) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [urlBarText, setUrlBarText] = useState(url);
  const [refreshKey, setRefreshKey] = useState(0);
  const [history, setHistory] = useState<string[]>([url]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const navigate = (newUrl: string) => {
    const trimmed = newUrl.trim();
    const finalUrl = trimmed.startsWith("http")
      ? trimmed
      : `https://${trimmed}`;
    setCurrentUrl(finalUrl);
    setUrlBarText(finalUrl);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (!canGoBack) return;
    const idx = historyIndex - 1;
    setHistoryIndex(idx);
    setCurrentUrl(history[idx]);
    setUrlBarText(history[idx]);
  };

  const goForward = () => {
    if (!canGoForward) return;
    const idx = historyIndex + 1;
    setHistoryIndex(idx);
    setCurrentUrl(history[idx]);
    setUrlBarText(history[idx]);
  };

  const reload = () => setRefreshKey((k) => k + 1);

  return (
    <AnimatePresence>
      <motion.div
        data-ocid="browser.sheet"
        className="absolute inset-0 z-50 flex flex-col bg-card"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{ height: "85vh", bottom: 0, top: "auto" }}
      >
        {/* Browser chrome */}
        <div className="flex-shrink-0 bg-[#1F2C34] text-white">
          {/* Drag handle */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>
          {/* URL bar row */}
          <div className="flex items-center gap-1 px-2 pb-2">
            <button
              type="button"
              data-ocid="browser.close_button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Close browser"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              data-ocid="browser.back_button"
              onClick={goBack}
              disabled={!canGoBack}
              className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0 disabled:opacity-30"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              data-ocid="browser.forward_button"
              onClick={goForward}
              disabled={!canGoForward}
              className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0 disabled:opacity-30"
              aria-label="Go forward"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            {/* URL bar */}
            <form
              className="flex-1 flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5"
              onSubmit={(e) => {
                e.preventDefault();
                navigate(urlBarText);
              }}
            >
              <Globe className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
              <input
                data-ocid="browser.url.input"
                value={urlBarText}
                onChange={(e) => setUrlBarText(e.target.value)}
                className="flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-white/50 min-w-0"
                aria-label="URL bar"
              />
            </form>
            <button
              type="button"
              data-ocid="browser.reload_button"
              onClick={reload}
              className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Reload"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Page content — simulated */}
        <div
          key={refreshKey}
          className="flex-1 overflow-y-auto bg-white flex flex-col"
        >
          {/* Simulated page header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-gray-50">
            <img
              src={getFavicon(currentUrl)}
              alt="favicon"
              className="w-8 h-8 rounded-lg bg-gray-200 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[15px] text-gray-800 truncate">
                {getTitle(currentUrl)}
              </p>
              <p className="text-[11px] text-gray-500 truncate">{currentUrl}</p>
            </div>
          </div>

          {/* Simulated content */}
          <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6 py-10">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
              <img
                src={getFavicon(currentUrl)}
                alt="favicon"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-[18px] font-bold text-gray-800">
                {getTitle(currentUrl)}
              </p>
              <p className="text-[13px] text-gray-500 mt-1">{currentUrl}</p>
            </div>
            <div className="w-full max-w-sm space-y-3">
              <div className="h-3 bg-gray-100 rounded-full w-full" />
              <div className="h-3 bg-gray-100 rounded-full w-5/6" />
              <div className="h-3 bg-gray-100 rounded-full w-4/5" />
              <div className="h-3 bg-gray-100 rounded-full w-full" />
              <div className="h-3 bg-gray-100 rounded-full w-3/4" />
            </div>
            <div className="text-[12px] text-gray-400 text-center px-4">
              In-app browser preview · Content is simulated
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
