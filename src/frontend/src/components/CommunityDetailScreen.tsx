import {
  ArrowLeft,
  MessageSquare,
  MoreVertical,
  Plus,
  Settings,
  Users,
} from "lucide-react";

const COMMUNITY_COLORS = [
  "from-emerald-600 to-emerald-800",
  "from-blue-600 to-blue-800",
  "from-violet-600 to-violet-800",
  "from-orange-600 to-orange-800",
];

const AVATAR_COLORS = [
  "bg-emerald-600",
  "bg-blue-600",
  "bg-violet-600",
  "bg-orange-600",
  "bg-rose-600",
];

const MOCK_GROUPS: Record<
  string,
  {
    id: bigint;
    name: string;
    members: number;
    lastMsg: string;
    initials: string;
  }[]
> = {
  "Family Group": [
    {
      id: 1001n,
      name: "Family - General",
      members: 12,
      lastMsg: "Mom: Don't forget Sunday dinner!",
      initials: "FG",
    },
    {
      id: 1002n,
      name: "Family - Events",
      members: 12,
      lastMsg: "Birthday planning for Dad",
      initials: "FE",
    },
    {
      id: 1003n,
      name: "Family - Photos",
      members: 10,
      lastMsg: "Shared 5 photos",
      initials: "FP",
    },
  ],
  "Work Team": [
    {
      id: 2001n,
      name: "Engineering",
      members: 18,
      lastMsg: "PR #247 is ready for review",
      initials: "EG",
    },
    {
      id: 2002n,
      name: "Design",
      members: 8,
      lastMsg: "New wireframes uploaded",
      initials: "DS",
    },
    {
      id: 2003n,
      name: "Marketing",
      members: 11,
      lastMsg: "Q1 campaign is live!",
      initials: "MK",
    },
  ],
  "Neighborhood Watch": [
    {
      id: 3001n,
      name: "Block A Residents",
      members: 24,
      lastMsg: "Street light fixed",
      initials: "BA",
    },
    {
      id: 3002n,
      name: "Safety Alerts",
      members: 30,
      lastMsg: "All clear tonight",
      initials: "SA",
    },
  ],
  "Sports Club": [
    {
      id: 4001n,
      name: "Football Team",
      members: 16,
      lastMsg: "Training tomorrow 7am",
      initials: "FT",
    },
    {
      id: 4002n,
      name: "Cricket XI",
      members: 13,
      lastMsg: "Match vs. Riverside confirmed",
      initials: "CX",
    },
    {
      id: 4003n,
      name: "General Sports",
      members: 40,
      lastMsg: "Pool table available today",
      initials: "GS",
    },
  ],
};

interface CommunityDetailScreenProps {
  communityName: string;
  communityDescription: string;
  colorIndex: number;
  onBack: () => void;
  onOpenChat: (id: bigint) => void;
  onOpenTools?: () => void;
}

export default function CommunityDetailScreen({
  communityName,
  communityDescription,
  colorIndex,
  onBack,
  onOpenChat,
  onOpenTools,
}: CommunityDetailScreenProps) {
  const groups = MOCK_GROUPS[communityName] ?? [];
  const gradient = COMMUNITY_COLORS[colorIndex % COMMUNITY_COLORS.length];
  const initials = communityName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const memberCount = groups.reduce((sum, g) => sum + g.members, 0);

  return (
    <div
      className="flex flex-col h-full bg-background"
      data-ocid="community.page"
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20 flex items-center gap-3 px-2 py-3 bg-wa-header-bg border-b border-border"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
      >
        <button
          type="button"
          data-ocid="community.close_button"
          onClick={onBack}
          className="p-2 text-wa-header-text hover:opacity-70 transition-opacity"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-[17px] font-bold text-wa-header-text truncate">
          {communityName}
        </h1>
        {onOpenTools && (
          <button
            type="button"
            data-ocid="community.tools.button"
            onClick={onOpenTools}
            className="p-2 text-wa-header-text hover:opacity-70 transition-opacity"
            aria-label="Community tools"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
        <button
          type="button"
          data-ocid="community.open_modal_button"
          className="p-2 text-wa-header-text hover:opacity-70 transition-opacity"
          aria-label="More options"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Banner */}
        <div
          className={`w-full h-36 bg-gradient-to-br ${gradient} flex items-center justify-center`}
        >
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-[28px]">{initials}</span>
          </div>
        </div>

        {/* Community info */}
        <div className="px-4 py-4 border-b border-border">
          <h2 className="text-[18px] font-bold text-foreground">
            {communityName}
          </h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            {communityDescription}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-[13px] text-muted-foreground">
              {memberCount} members
            </span>
          </div>
        </div>

        {/* Groups section */}
        <div className="pt-2">
          <p className="px-4 pt-2 pb-2 text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">
            Groups
          </p>

          <ul data-ocid="community.list">
            {groups.map((group, idx) => (
              <li
                key={group.id.toString()}
                data-ocid={`community.item.${idx + 1}`}
              >
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 active:bg-muted transition-colors"
                  onClick={() => onOpenChat(group.id)}
                >
                  <div
                    className={`w-12 h-12 rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white font-bold text-[14px]">
                      {group.initials}
                    </span>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-[15px] font-semibold text-foreground truncate">
                        {group.name}
                      </p>
                      <span className="text-[11px] text-muted-foreground ml-2">
                        {group.members} members
                      </span>
                    </div>
                    <p className="text-[13px] text-muted-foreground truncate mt-0.5">
                      {group.lastMsg}
                    </p>
                  </div>
                  <MessageSquare className="w-4 h-4 text-wa-green flex-shrink-0" />
                </button>
              </li>
            ))}
          </ul>

          {/* Add groups */}
          <button
            type="button"
            data-ocid="community.secondary_button"
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 active:bg-muted transition-colors"
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center flex-shrink-0">
              <Plus className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-[15px] text-wa-green font-medium">Add groups</p>
          </button>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
