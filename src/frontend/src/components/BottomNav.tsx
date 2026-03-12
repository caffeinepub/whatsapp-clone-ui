import {
  CreditCard,
  Grid3X3,
  MessageSquare,
  Phone,
  Play,
  Radio,
  Users,
  Wifi,
} from "lucide-react";
import type { TabName } from "../App";

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
  { id: "chats", label: "Chats", icon: MessageSquare },
  { id: "status", label: "Updates", icon: Radio },
  { id: "reels", label: "Reels", icon: Play },
  { id: "live", label: "Live", icon: Wifi },
  { id: "communities", label: "Community", icon: Users },
  { id: "calls", label: "Calls", icon: Phone },
  { id: "payments", label: "Pay", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Grid3X3 },
];

export default function BottomNav({
  activeTab,
  onTabChange,
  missedCallsCount = 0,
}: BottomNavProps) {
  return (
    <nav
      className="sticky bottom-0 z-50 flex items-center bg-wa-nav-bg border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const dynamicBadges: Partial<Record<TabName, number>> = {
          chats: 5,
          calls: missedCallsCount,
          communities: 1,
          live: 5,
        };
        const badge = isActive ? 0 : (dynamicBadges[tab.id] ?? 0);
        return (
          <button
            key={tab.id}
            type="button"
            data-ocid={`nav.${tab.id}.tab`}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex flex-col items-center justify-center flex-1 py-1.5 gap-0.5
              transition-colors duration-150
              ${isActive ? "text-wa-nav-active" : "text-muted-foreground"}
            `}
            aria-label={tab.label}
            aria-current={isActive ? "page" : undefined}
          >
            <div className="relative">
              <Icon
                className={`w-4.5 h-4.5 ${isActive ? "fill-wa-nav-active/20 stroke-wa-nav-active" : "stroke-muted-foreground"}`}
                style={{ width: 18, height: 18 }}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {badge > 0 && (
                <span
                  data-ocid={`nav.${tab.id}.badge`}
                  className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-sm"
                >
                  {badge}
                </span>
              )}
            </div>
            <span
              className={`text-[8px] font-medium tracking-wide leading-none ${
                isActive ? "text-wa-nav-active" : "text-muted-foreground"
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
