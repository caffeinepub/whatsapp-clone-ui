import { ChevronRight, Plus, Users } from "lucide-react";
import { useState } from "react";
import CommunityDetailScreen from "../components/CommunityDetailScreen";

const COMMUNITY_COLORS = [
  "bg-emerald-600",
  "bg-blue-600",
  "bg-violet-600",
  "bg-orange-600",
];

const MOCK_COMMUNITIES = [
  {
    id: 1,
    name: "Family Group",
    initials: "FG",
    groupCount: 3,
    description: "Stay connected with the whole family",
    lastActivity: "Mom sent a photo",
    colorIndex: 0,
  },
  {
    id: 2,
    name: "Work Team",
    initials: "WT",
    groupCount: 5,
    description: "All company departments in one place",
    lastActivity: "Project deadline reminder",
    colorIndex: 1,
  },
  {
    id: 3,
    name: "Neighborhood Watch",
    initials: "NW",
    groupCount: 2,
    description: "Keeping the block safe together",
    lastActivity: "Alert: suspicious activity",
    colorIndex: 2,
  },
  {
    id: 4,
    name: "Sports Club",
    initials: "SC",
    groupCount: 4,
    description: "Football, cricket and more!",
    lastActivity: "Match this Saturday 4pm",
    colorIndex: 3,
  },
];

interface CommunitiesScreenProps {
  onOpenChat: (id: bigint) => void;
}

export default function CommunitiesScreen({
  onOpenChat,
}: CommunitiesScreenProps) {
  const [openCommunity, setOpenCommunity] = useState<
    (typeof MOCK_COMMUNITIES)[0] | null
  >(null);

  if (openCommunity) {
    return (
      <CommunityDetailScreen
        communityName={openCommunity.name}
        communityDescription={openCommunity.description}
        colorIndex={openCommunity.colorIndex}
        onBack={() => setOpenCommunity(null)}
        onOpenChat={onOpenChat}
      />
    );
  }

  return (
    <div
      className="flex flex-col h-full bg-background"
      data-ocid="communities.page"
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-wa-header-bg border-b border-border"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
      >
        <h1 className="text-[18px] font-bold text-wa-header-text">
          Communities
        </h1>
        <button
          type="button"
          data-ocid="communities.open_modal_button"
          className="text-wa-header-text hover:opacity-70 transition-opacity"
          aria-label="New community"
        >
          <Users className="w-5 h-5" />
        </button>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* New community banner */}
        <div
          className="mx-3 mt-3 mb-1 rounded-xl bg-wa-green overflow-hidden"
          data-ocid="communities.primary_button"
        >
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-4"
            onClick={() => {}}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[14px] font-semibold text-white">
                New community
              </p>
              <p className="text-[12px] text-white/80">
                Create a community with groups
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Community list label */}
        <p className="px-4 pt-4 pb-2 text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">
          Your communities
        </p>

        {/* Communities list */}
        <ul data-ocid="communities.list">
          {MOCK_COMMUNITIES.map((community, idx) => (
            <li key={community.id} data-ocid={`communities.item.${idx + 1}`}>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 active:bg-muted transition-colors"
                onClick={() => setOpenCommunity(community)}
              >
                {/* Avatar */}
                <div
                  className={`w-14 h-14 rounded-full ${COMMUNITY_COLORS[community.colorIndex % COMMUNITY_COLORS.length]} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white font-bold text-[18px]">
                    {community.initials}
                  </span>
                </div>
                {/* Info */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[15px] font-semibold text-foreground truncate">
                      {community.name}
                    </p>
                    <span className="text-[12px] text-muted-foreground ml-2 flex-shrink-0">
                      {community.groupCount} groups
                    </span>
                  </div>
                  <p className="text-[13px] text-muted-foreground truncate mt-0.5">
                    {community.lastActivity}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
            </li>
          ))}
        </ul>

        {/* Bottom padding */}
        <div className="h-20" />
      </div>

      {/* FAB */}
      <div className="absolute bottom-20 right-4 z-30">
        <button
          type="button"
          data-ocid="communities.secondary_button"
          className="flex items-center gap-2 bg-wa-green text-white px-4 py-3 rounded-full shadow-lg hover:brightness-105 active:brightness-95 transition-all"
          onClick={() => {}}
        >
          <Plus className="w-5 h-5" />
          <span className="text-[14px] font-semibold">Create community</span>
        </button>
      </div>
    </div>
  );
}
