import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface SettingsPanelProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function SettingsPanel({
  title,
  open,
  onClose,
  children,
}: SettingsPanelProps) {
  return (
    <div
      data-ocid="settings.panel"
      className={`
        absolute inset-0 z-30 flex flex-col bg-background
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
      aria-hidden={!open}
    >
      {/* Panel header */}
      <header className="bg-wa-header px-2 pt-12 pb-2 flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          data-ocid="settings.panel.close_button"
          onClick={onClose}
          aria-label="Go back"
          className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-wa-header-fg text-[18px] font-bold font-display">
          {title}
        </h2>
      </header>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto bg-secondary/20">{children}</div>
    </div>
  );
}
