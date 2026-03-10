import {
  ChevronRight,
  Edit,
  Link,
  LogOut,
  MoreVertical,
  Plus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CommunityDetailScreen from "../components/CommunityDetailScreen";

const COMMUNITY_COLORS = [
  "bg-emerald-600",
  "bg-blue-600",
  "bg-violet-600",
  "bg-orange-600",
];

interface Community {
  id: number;
  name: string;
  initials: string;
  groupCount: number;
  description: string;
  lastActivity: string;
  colorIndex: number;
}

const INITIAL_COMMUNITIES: Community[] = [
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
  const [communities, setCommunities] =
    useState<Community[]>(INITIAL_COMMUNITIES);
  const [openCommunity, setOpenCommunity] = useState<Community | null>(null);
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [editCommunity, setEditCommunity] = useState<Community | null>(null);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [leaveConfirm, setLeaveConfirm] = useState<Community | null>(null);

  const openCreate = (community?: Community) => {
    setEditCommunity(community ?? null);
    setNewName(community?.name ?? "");
    setNewDesc(community?.description ?? "");
    setShowCreateSheet(true);
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    if (editCommunity) {
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === editCommunity.id
            ? { ...c, name: newName.trim(), description: newDesc.trim() }
            : c,
        ),
      );
      toast.success("Community updated");
    } else {
      const initials = newName.trim().slice(0, 2).toUpperCase();
      setCommunities((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: newName.trim(),
          initials,
          groupCount: 0,
          description: newDesc.trim(),
          lastActivity: "Just created",
          colorIndex: prev.length % COMMUNITY_COLORS.length,
        },
      ]);
      toast.success("Community created!");
    }
    setShowCreateSheet(false);
    setNewName("");
    setNewDesc("");
    setEditCommunity(null);
  };

  const handleLeave = (c: Community) => {
    setCommunities((prev) => prev.filter((x) => x.id !== c.id));
    setLeaveConfirm(null);
    toast.success(`Left ${c.name}`);
  };

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
          onClick={() => openCreate()}
          className="text-wa-header-text hover:opacity-70 transition-opacity"
          aria-label="New community"
        >
          <Users className="w-5 h-5" />
        </button>
      </header>

      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
      >
        {/* New community banner */}
        <div
          className="mx-3 mt-3 mb-1 rounded-xl bg-wa-green overflow-hidden"
          data-ocid="communities.primary_button"
        >
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-4"
            onClick={() => openCreate()}
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

        <p className="px-4 pt-4 pb-2 text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">
          Your communities
        </p>

        <ul data-ocid="communities.list">
          {communities.map((community, idx) => (
            <li
              key={community.id}
              data-ocid={`communities.item.${idx + 1}`}
              className="relative"
            >
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 active:bg-muted transition-colors"
                onClick={() => setOpenCommunity(community)}
              >
                <div
                  className={`w-14 h-14 rounded-full ${COMMUNITY_COLORS[community.colorIndex % COMMUNITY_COLORS.length]} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white font-bold text-[18px]">
                    {community.initials}
                  </span>
                </div>
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
              </button>
              {/* 3-dot menu */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  data-ocid={`communities.menu.${idx + 1}.button`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(
                      menuOpen === community.id ? null : community.id,
                    );
                  }}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                  aria-label="Community options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {menuOpen === community.id && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(null)}
                      onKeyDown={() => setMenuOpen(null)}
                      role="button"
                      tabIndex={-1}
                      aria-label="Close menu"
                    />
                    <div
                      className="absolute right-0 top-8 z-50 bg-popover rounded-xl shadow-xl border border-border w-44 overflow-hidden"
                      data-ocid="communities.dropdown_menu"
                    >
                      <button
                        type="button"
                        data-ocid="communities.menu.edit_button"
                        onClick={() => {
                          setMenuOpen(null);
                          openCreate(community);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted text-[14px] text-foreground transition-colors"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" /> Edit
                      </button>
                      <button
                        type="button"
                        data-ocid="communities.menu.invite_button"
                        onClick={() => {
                          setMenuOpen(null);
                          toast.success(`Invite link: wa.me/c/${community.id}`);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted text-[14px] text-foreground transition-colors"
                      >
                        <Link className="w-4 h-4 text-muted-foreground" />{" "}
                        Invite link
                      </button>
                      <button
                        type="button"
                        data-ocid="communities.menu.delete_button"
                        onClick={() => {
                          setMenuOpen(null);
                          setLeaveConfirm(community);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted text-[14px] text-destructive transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Leave
                      </button>
                    </div>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="h-24" />
      </div>

      {/* FAB */}
      <div className="absolute bottom-20 right-4 z-30">
        <button
          type="button"
          data-ocid="communities.secondary_button"
          className="flex items-center gap-2 bg-wa-green text-white px-4 py-3 rounded-full shadow-lg hover:brightness-105 active:brightness-95 transition-all"
          onClick={() => openCreate()}
        >
          <Plus className="w-5 h-5" />
          <span className="text-[14px] font-semibold">Create community</span>
        </button>
      </div>

      {/* Create/Edit Sheet */}
      {showCreateSheet && (
        <>
          <div
            className="absolute inset-0 z-50 bg-black/50"
            onClick={() => setShowCreateSheet(false)}
            onKeyDown={(e) => e.key === "Escape" && setShowCreateSheet(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close"
          />
          <div
            data-ocid="communities.create.sheet"
            className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl p-4"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
          >
            <div className="flex justify-center pt-1 pb-3">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            <h3 className="text-[17px] font-bold text-foreground mb-4">
              {editCommunity ? "Edit community" : "New community"}
            </h3>
            <input
              data-ocid="communities.name.input"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Community name"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground outline-none focus:border-wa-green transition-colors mb-3"
            />
            <textarea
              data-ocid="communities.desc.textarea"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground outline-none focus:border-wa-green transition-colors resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                data-ocid="communities.create.cancel_button"
                onClick={() => setShowCreateSheet(false)}
                className="flex-1 py-3 rounded-xl border border-border text-[15px] font-semibold text-foreground hover:bg-muted/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="communities.create.confirm_button"
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="flex-1 py-3 rounded-xl bg-wa-green text-white text-[15px] font-semibold hover:brightness-105 disabled:opacity-50 transition-all"
              >
                {editCommunity ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Leave confirmation */}
      {leaveConfirm && (
        <>
          <div
            className="absolute inset-0 z-50 bg-black/50"
            onClick={() => setLeaveConfirm(null)}
            onKeyDown={() => setLeaveConfirm(null)}
            role="button"
            tabIndex={-1}
            aria-label="Cancel"
          />
          <div
            className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl p-6"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
          >
            <h3 className="text-[17px] font-bold text-foreground mb-2">
              Leave {leaveConfirm.name}?
            </h3>
            <p className="text-[13px] text-muted-foreground mb-6">
              You will no longer be a member of this community.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                data-ocid="communities.leave.cancel_button"
                onClick={() => setLeaveConfirm(null)}
                className="flex-1 py-3 rounded-xl border border-border text-[15px] font-semibold text-foreground hover:bg-muted/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="communities.leave.confirm_button"
                onClick={() => handleLeave(leaveConfirm)}
                className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground text-[15px] font-semibold hover:brightness-105 transition-all"
              >
                Leave
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
