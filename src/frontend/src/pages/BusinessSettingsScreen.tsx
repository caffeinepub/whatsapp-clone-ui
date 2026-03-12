import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  BadgeCheck,
  BarChart2,
  BriefcaseBusiness,
  ChevronRight,
  Clock,
  MessageSquareReply,
  ShoppingBag,
  Tag,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AutoReplyScreen from "./AutoReplyScreen";
import BusinessHoursScreen from "./BusinessHoursScreen";
import BusinessProfilePage from "./BusinessProfilePage";
import BusinessStatsScreen from "./BusinessStatsScreen";
import CustomerLabelsScreen from "./CustomerLabelsScreen";

interface Props {
  onBack: () => void;
  onOpenMarketplace?: () => void;
}

type SubPage =
  | null
  | "profile"
  | "hours"
  | "autoreply"
  | "quickreplies"
  | "labels"
  | "stats";

export default function BusinessSettingsScreen({
  onBack,
  onOpenMarketplace,
}: Props) {
  const [businessMode, setBusinessMode] = useState(
    () => localStorage.getItem("businessMode") === "true",
  );
  const [subPage, setSubPage] = useState<SubPage>(null);

  const handleBusinessToggle = (val: boolean) => {
    setBusinessMode(val);
    localStorage.setItem("businessMode", val ? "true" : "false");
    toast.success(val ? "Business mode enabled" : "Switched to personal mode", {
      position: "top-center",
    });
  };

  if (subPage === "profile") {
    return <BusinessProfilePage onBack={() => setSubPage(null)} />;
  }
  if (subPage === "hours") {
    return <BusinessHoursScreen onBack={() => setSubPage(null)} />;
  }
  if (subPage === "autoreply") {
    return <AutoReplyScreen onBack={() => setSubPage(null)} />;
  }
  if (subPage === "labels") {
    return <CustomerLabelsScreen onBack={() => setSubPage(null)} />;
  }
  if (subPage === "stats") {
    return <BusinessStatsScreen onBack={() => setSubPage(null)} />;
  }

  const menuItems = [
    {
      id: "profile",
      icon: <BriefcaseBusiness className="w-5 h-5 text-[#25D366]" />,
      label: "Business Profile",
      sub: "Name, category, address, website",
      action: () => setSubPage("profile"),
    },
    {
      id: "hours",
      icon: <Clock className="w-5 h-5 text-[#25D366]" />,
      label: "Business Hours",
      sub: "Set your open and close times",
      action: () => setSubPage("hours"),
    },
    {
      id: "autoreply",
      icon: <MessageSquareReply className="w-5 h-5 text-[#25D366]" />,
      label: "Auto Reply Messages",
      sub: "Greeting & away messages",
      action: () => setSubPage("autoreply"),
    },
    {
      id: "quickreplies",
      icon: <Zap className="w-5 h-5 text-[#25D366]" />,
      label: "Quick Replies",
      sub: "Shortcut keywords for common replies",
      action: () => setSubPage("quickreplies"),
    },
    {
      id: "labels",
      icon: <Tag className="w-5 h-5 text-[#25D366]" />,
      label: "Customer Labels",
      sub: "Organize customers with colored labels",
      action: () => setSubPage("labels"),
    },
    {
      id: "stats",
      icon: <BarChart2 className="w-5 h-5 text-[#25D366]" />,
      label: "Business Statistics",
      sub: "Messages sent, read rate, response time",
      action: () => setSubPage("stats"),
    },
    {
      id: "catalog",
      icon: <ShoppingBag className="w-5 h-5 text-[#25D366]" />,
      label: "Product Catalog",
      sub: "Browse and manage your products",
      action: () => {
        onBack();
        if (onOpenMarketplace) onOpenMarketplace();
      },
    },
  ];

  return (
    <div
      data-ocid="business_settings.page"
      className="absolute inset-0 flex flex-col z-40 overflow-y-auto"
      style={{
        background: "#0B141A",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <header
        className="sticky top-0 z-10 bg-[#1F2C34] text-white flex items-center gap-3 px-3 py-3 flex-shrink-0"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
      >
        <button
          type="button"
          data-ocid="business_settings.close_button"
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[18px] font-bold flex-1">Business Account</h1>
      </header>

      {/* Business Mode Toggle */}
      <div className="bg-[#1F2C34] mt-3 mx-0 px-4 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-11 h-11 rounded-full bg-[#25D366]/15 flex items-center justify-center flex-shrink-0">
            <BadgeCheck className="w-5 h-5 text-[#25D366]" />
          </div>
          <div>
            <p className="font-semibold text-[15px] text-white">
              Business Account
            </p>
            <p className="text-[12px] text-white/50">
              {businessMode
                ? "Active — business features enabled"
                : "Switch to business mode"}
            </p>
          </div>
        </div>
        <Switch
          data-ocid="business_settings.account.switch"
          checked={businessMode}
          onCheckedChange={handleBusinessToggle}
          className="data-[state=checked]:bg-[#25D366]"
        />
      </div>

      {businessMode && (
        <>
          <p className="px-4 pt-5 pb-2 text-[11px] font-semibold text-[#8696A0] uppercase tracking-widest">
            Business Tools
          </p>
          <div className="bg-[#1F2C34]">
            {menuItems.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                data-ocid={`business_settings.${item.id}.button`}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 active:bg-white/10 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-full bg-[#0B141A] flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-medium text-white">
                    {item.label}
                  </p>
                  <p className="text-[12px] text-white/50 truncate">
                    {item.sub}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />
                {idx < menuItems.length - 1 && (
                  <span className="sr-only">separator</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {!businessMode && (
        <div className="mx-4 mt-6 bg-[#1F2C34] rounded-2xl p-5 text-center">
          <div className="w-16 h-16 rounded-full bg-[#25D366]/10 flex items-center justify-center mx-auto mb-3">
            <BriefcaseBusiness className="w-8 h-8 text-[#25D366]" />
          </div>
          <p className="text-white font-semibold text-[16px] mb-1">
            Enable Business Mode
          </p>
          <p className="text-white/50 text-[13px] leading-relaxed">
            Get access to business hours, auto-replies, catalogs, customer
            labels, and business analytics.
          </p>
        </div>
      )}

      <div className="pb-10" />
    </div>
  );
}
