import {
  CircleDot,
  MessageCircle,
  Phone,
  Play,
  Radio,
  Settings2,
  Users,
  Wallet,
} from "lucide-react";
import type { TabName } from "../App";

const HIDE_REELS_LIVE = true;

interface BottomNavProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
  missedCallsCount?: number;
}

const tabs: {
  id: TabName;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}[] = [
  { id: "chats", label: "Chats", icon: MessageCircle },
  { id: "status", label: "Updates", icon: CircleDot },
  { id: "reels", label: "Reels", icon: Play },
  { id: "live", label: "Live", icon: Radio },
  { id: "communities", label: "Community", icon: Users },
  { id: "calls", label: "Calls", icon: Phone },
  { id: "payments", label: "Pay", icon: Wallet },
  { id: "settings", label: "Settings", icon: Settings2 },
];

export default function BottomNav({
  activeTab,
  onTabChange,
  missedCallsCount = 0,
}: BottomNavProps) {
  const visibleTabs = HIDE_REELS_LIVE
    ? tabs.filter((t) => t.id !== "reels" && t.id !== "live")
    : tabs;

  return (
    <nav
      className="sticky bottom-0 z-50 flex items-stretch bg-wa-nav-bg border-t border-white/10"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {visibleTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const dynamicBadges: Partial<Record<TabName, number>> = {
          chats: 5,
          calls: missedCallsCount,
          communities: 1,
        };
        const badge = isActive ? 0 : (dynamicBadges[tab.id] ?? 0);
        return (
          <button
            key={tab.id}
            type="button"
            data-ocid={`nav.${tab.id}.tab`}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex flex-col items-center justify-center flex-1 py-2 gap-1
              transition-all duration-150 min-h-[56px]
              ${isActive ? "text-wa-nav-active" : "text-muted-foreground/70"}
            `}
            aria-label={tab.label}
            aria-current={isActive ? "page" : undefined}
            data-active-nav={isActive ? "true" : undefined}
          >
            <div className="relative">
              <Icon
                className={
                  isActive
                    ? "fill-wa-nav-active/20 stroke-wa-nav-active"
                    : "stroke-muted-foreground/70"
                }
                style={{
                  width: isActive ? 26 : 24,
                  height: isActive ? 26 : 24,
                  strokeWidth: isActive ? 2.5 : 2,
                  transition: "all 0.15s ease",
                }}
              />
              {badge > 0 && (
                <span
                  data-ocid={`nav.${tab.id}.badge`}
                  className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm"
                >
                  {badge}
                </span>
              )}
            </div>
            <span
              className={`text-[11px] leading-none tracking-wide ${
                isActive
                  ? "text-wa-nav-active font-semibold"
                  : "font-medium text-muted-foreground/70"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
