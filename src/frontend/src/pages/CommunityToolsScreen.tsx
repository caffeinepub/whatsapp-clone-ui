import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart2,
  Bell,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Shield,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CommunityToolsScreenProps {
  communityName: string;
  onBack: () => void;
}

const MOCK_MEMBERS = [
  {
    id: 1,
    name: "Alice Johnson",
    initials: "AJ",
    role: "Admin",
    color: "bg-violet-600",
  },
  {
    id: 2,
    name: "Bob Martinez",
    initials: "BM",
    role: "Mod",
    color: "bg-blue-600",
  },
  {
    id: 3,
    name: "Carol Zhang",
    initials: "CZ",
    role: "Member",
    color: "bg-emerald-600",
  },
  {
    id: 4,
    name: "Dave Patel",
    initials: "DP",
    role: "Member",
    color: "bg-orange-600",
  },
  {
    id: 5,
    name: "Eve Kumar",
    initials: "EK",
    role: "Member",
    color: "bg-rose-600",
  },
  {
    id: 6,
    name: "Frank Lee",
    initials: "FL",
    role: "Member",
    color: "bg-cyan-600",
  },
];

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    text: "📢 Community guidelines have been updated. Please read carefully.",
    time: "2h ago",
    pinned: true,
  },
  {
    id: 2,
    text: "🎉 Welcome to all new members joining this week!",
    time: "1d ago",
    pinned: false,
  },
  {
    id: 3,
    text: "🔔 Reminder: Monthly meetup this Saturday at 3pm.",
    time: "3d ago",
    pinned: false,
  },
];

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Monthly Meetup",
    date: "2026-03-15",
    time: "3:00 PM",
    desc: "In-person gathering at the usual spot.",
    rsvp: "yes" as string,
  },
  {
    id: 2,
    title: "Online Q&A Session",
    date: "2026-03-20",
    time: "6:00 PM",
    desc: "Ask anything about the community.",
    rsvp: "" as string,
  },
];

const ROLE_COLORS: Record<string, string> = {
  Admin: "bg-violet-600/20 text-violet-400",
  Mod: "bg-blue-600/20 text-blue-400",
  Member: "bg-muted text-muted-foreground",
};

export default function CommunityToolsScreen({
  communityName,
  onBack,
}: CommunityToolsScreenProps) {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [guidelines, setGuidelines] = useState(
    "1. Be respectful to all members.\n2. No spam or self-promotion.\n3. Stay on topic.\n4. No hate speech or harassment.\n5. Admins have the final word.",
  );
  const [memberMenuId, setMemberMenuId] = useState<number | null>(null);
  const [showPostSheet, setShowPostSheet] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [showEventSheet, setShowEventSheet] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [statsExpanded, setStatsExpanded] = useState(false);

  const handlePostAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    setAnnouncements((prev) => [
      {
        id: Date.now(),
        text: newAnnouncement.trim(),
        time: "Just now",
        pinned: false,
      },
      ...prev,
    ]);
    setNewAnnouncement("");
    setShowPostSheet(false);
    toast.success("Announcement posted");
  };

  const handleCreateEvent = () => {
    if (!eventTitle.trim() || !eventDate) return;
    setEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: eventTitle.trim(),
        date: eventDate,
        time: eventTime || "TBD",
        desc: eventDesc.trim(),
        rsvp: "",
      },
    ]);
    setEventTitle("");
    setEventDate("");
    setEventTime("");
    setEventDesc("");
    setShowEventSheet(false);
    toast.success("Event created!");
  };

  const handleRSVP = (id: number, val: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, rsvp: val } : e)),
    );
    toast.success(
      `RSVP: ${val === "yes" ? "Going" : val === "no" ? "Not going" : "Maybe"}`,
    );
  };

  const handlePromote = (id: number) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, role: m.role === "Member" ? "Mod" : "Admin" } : m,
      ),
    );
    setMemberMenuId(null);
    toast.success("Member promoted");
  };

  const handleRemove = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setMemberMenuId(null);
    toast.success("Member removed");
  };

  return (
    <div
      className="flex flex-col h-full bg-background"
      data-ocid="community_tools.page"
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-wa-header-bg border-b border-border"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
      >
        <button
          type="button"
          data-ocid="community_tools.back.button"
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-full text-wa-header-text hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[17px] font-bold text-wa-header-text truncate">
            Community Tools
          </h1>
          <p className="text-[12px] text-wa-header-text/60 truncate">
            {communityName}
          </p>
        </div>
        <Shield className="w-5 h-5 text-wa-header-text/60" />
      </header>

      {/* Tabs */}
      <Tabs
        defaultValue="announcements"
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="flex-shrink-0 w-full justify-start overflow-x-auto gap-0 h-auto bg-card border-b border-border rounded-none px-2 py-1">
          <TabsTrigger
            value="announcements"
            data-ocid="community_tools.announcements.tab"
            className="text-[12px] py-2 px-3 data-[state=active]:text-wa-green data-[state=active]:border-b-2 data-[state=active]:border-wa-green rounded-none"
          >
            <Bell className="w-3.5 h-3.5 mr-1" />
            Announce
          </TabsTrigger>
          <TabsTrigger
            value="members"
            data-ocid="community_tools.members.tab"
            className="text-[12px] py-2 px-3 data-[state=active]:text-wa-green data-[state=active]:border-b-2 data-[state=active]:border-wa-green rounded-none"
          >
            <Users className="w-3.5 h-3.5 mr-1" />
            Members
          </TabsTrigger>
          <TabsTrigger
            value="events"
            data-ocid="community_tools.events.tab"
            className="text-[12px] py-2 px-3 data-[state=active]:text-wa-green data-[state=active]:border-b-2 data-[state=active]:border-wa-green rounded-none"
          >
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Events
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            data-ocid="community_tools.stats.tab"
            className="text-[12px] py-2 px-3 data-[state=active]:text-wa-green data-[state=active]:border-b-2 data-[state=active]:border-wa-green rounded-none"
          >
            <BarChart2 className="w-3.5 h-3.5 mr-1" />
            Stats
          </TabsTrigger>
          <TabsTrigger
            value="guidelines"
            data-ocid="community_tools.guidelines.tab"
            className="text-[12px] py-2 px-3 data-[state=active]:text-wa-green data-[state=active]:border-b-2 data-[state=active]:border-wa-green rounded-none"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1" />
            Rules
          </TabsTrigger>
        </TabsList>

        {/* Announcements */}
        <TabsContent
          value="announcements"
          className="flex-1 overflow-y-auto p-4 space-y-3 mt-0"
        >
          <button
            type="button"
            data-ocid="community_tools.post_announcement.button"
            onClick={() => setShowPostSheet(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-wa-green/10 border border-wa-green/30 text-wa-green text-[14px] font-semibold hover:bg-wa-green/20 transition-colors"
          >
            <Bell className="w-4 h-4" />
            Post Announcement
          </button>
          {announcements.map((a, i) => (
            <div
              key={a.id}
              data-ocid={`community_tools.announcement.item.${i + 1}`}
              className="bg-card rounded-xl p-4 border border-border"
            >
              {a.pinned && (
                <span className="text-[10px] font-bold uppercase text-wa-green tracking-wider mb-1 block">
                  📌 Pinned
                </span>
              )}
              <p className="text-[14px] text-foreground leading-relaxed">
                {a.text}
              </p>
              <p className="text-[11px] text-muted-foreground mt-2">{a.time}</p>
            </div>
          ))}
        </TabsContent>

        {/* Members */}
        <TabsContent value="members" className="flex-1 overflow-y-auto mt-0">
          <div className="p-4 space-y-1">
            <p className="text-[12px] text-muted-foreground uppercase tracking-wider font-semibold mb-3">
              {members.length} members
            </p>
            {members.map((m, i) => (
              <div
                key={m.id}
                data-ocid={`community_tools.member.item.${i + 1}`}
                className="flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-muted/40 transition-colors relative"
              >
                <div
                  className={`w-10 h-10 rounded-full ${m.color} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white font-bold text-[13px]">
                    {m.initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-foreground">
                    {m.name}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[m.role]}`}
                >
                  {m.role}
                </span>
                <button
                  type="button"
                  data-ocid={`community_tools.member.menu.${i + 1}.button`}
                  onClick={() =>
                    setMemberMenuId(memberMenuId === m.id ? null : m.id)
                  }
                  className="p-1.5 rounded-full text-muted-foreground hover:bg-muted transition-colors"
                  aria-label="Member options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {memberMenuId === m.id && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMemberMenuId(null)}
                      onKeyDown={() => setMemberMenuId(null)}
                      role="button"
                      tabIndex={-1}
                      aria-label="Close"
                    />
                    <div
                      className="absolute right-0 top-12 z-50 bg-popover rounded-xl shadow-xl border border-border w-40 overflow-hidden"
                      data-ocid="community_tools.member.dropdown_menu"
                    >
                      <button
                        type="button"
                        data-ocid="community_tools.member.promote.button"
                        onClick={() => handlePromote(m.id)}
                        className="flex items-center gap-2 w-full px-4 py-3 hover:bg-muted text-[13px] text-foreground transition-colors"
                      >
                        <UserCheck className="w-4 h-4 text-wa-green" /> Promote
                      </button>
                      <button
                        type="button"
                        data-ocid="community_tools.member.delete_button"
                        onClick={() => handleRemove(m.id)}
                        className="flex items-center gap-2 w-full px-4 py-3 hover:bg-muted text-[13px] text-destructive transition-colors"
                      >
                        <X className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Events */}
        <TabsContent
          value="events"
          className="flex-1 overflow-y-auto p-4 space-y-3 mt-0"
        >
          <button
            type="button"
            data-ocid="community_tools.create_event.button"
            onClick={() => setShowEventSheet(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-wa-green/10 border border-wa-green/30 text-wa-green text-[14px] font-semibold hover:bg-wa-green/20 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Create Event
          </button>
          {events.map((ev, i) => (
            <div
              key={ev.id}
              data-ocid={`community_tools.event.item.${i + 1}`}
              className="bg-card rounded-xl p-4 border border-border"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[15px] font-bold text-foreground">
                    {ev.title}
                  </p>
                  <p className="text-[12px] text-wa-green mt-0.5">
                    {ev.date} · {ev.time}
                  </p>
                  {ev.desc && (
                    <p className="text-[12px] text-muted-foreground mt-1.5">
                      {ev.desc}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {(["yes", "maybe", "no"] as const).map((val) => (
                  <button
                    key={val}
                    type="button"
                    data-ocid={`community_tools.event.rsvp_${val}.${i + 1}.button`}
                    onClick={() => handleRSVP(ev.id, val)}
                    className={`flex-1 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                      ev.rsvp === val
                        ? val === "yes"
                          ? "bg-wa-green text-white"
                          : val === "maybe"
                            ? "bg-yellow-500 text-white"
                            : "bg-destructive text-destructive-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    {val === "yes"
                      ? "Going"
                      : val === "maybe"
                        ? "Maybe"
                        : "Can't go"}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Stats */}
        <TabsContent
          value="stats"
          className="flex-1 overflow-y-auto p-4 space-y-4 mt-0"
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Members", val: "248", icon: "👥" },
              { label: "Active Today", val: "89", icon: "🟢" },
              { label: "Messages/Day", val: "1.2k", icon: "💬" },
              { label: "New This Week", val: "34", icon: "✨" },
            ].map((s, i) => (
              <div
                key={s.label}
                data-ocid={`community_tools.stat.item.${i + 1}`}
                className="bg-card rounded-xl p-4 border border-border text-center"
              >
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="text-[20px] font-bold text-foreground">{s.val}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[14px] font-bold text-foreground">
                Message Activity
              </p>
              <button
                type="button"
                onClick={() => setStatsExpanded(!statsExpanded)}
                className="text-muted-foreground"
              >
                {statsExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="flex items-end gap-1.5 h-20">
              <div
                className="flex-1 rounded-t-sm bg-wa-green/60"
                style={{ height: "40%" }}
              />
              <div
                className="flex-1 rounded-t-sm bg-wa-green/60"
                style={{ height: "60%" }}
              />
              <div
                className="flex-1 rounded-t-sm bg-wa-green/60"
                style={{ height: "30%" }}
              />
              <div
                className="flex-1 rounded-t-sm bg-wa-green/60"
                style={{ height: "80%" }}
              />
              <div
                className="flex-1 rounded-t-sm bg-wa-green/60"
                style={{ height: "95%" }}
              />
              <div
                className="flex-1 rounded-t-sm bg-wa-green/60"
                style={{ height: "70%" }}
              />
              <div
                className="flex-1 rounded-t-sm bg-wa-green/60"
                style={{ height: "55%" }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="flex-1 text-center text-[10px] text-muted-foreground">
                M
              </span>
              <span className="flex-1 text-center text-[10px] text-muted-foreground">
                T
              </span>
              <span className="flex-1 text-center text-[10px] text-muted-foreground">
                W
              </span>
              <span className="flex-1 text-center text-[10px] text-muted-foreground">
                T
              </span>
              <span className="flex-1 text-center text-[10px] text-muted-foreground">
                F
              </span>
              <span className="flex-1 text-center text-[10px] text-muted-foreground">
                S
              </span>
              <span className="flex-1 text-center text-[10px] text-muted-foreground">
                S
              </span>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-[14px] font-bold text-foreground mb-3">
              Top Contributors
            </p>
            {MOCK_MEMBERS.slice(0, 3).map((m, i) => (
              <div key={m.id} className="flex items-center gap-3 py-2">
                <span className="text-[16px]">{["🥇", "🥈", "🥉"][i]}</span>
                <div
                  className={`w-7 h-7 rounded-full ${m.color} flex items-center justify-center`}
                >
                  <span className="text-white text-[10px] font-bold">
                    {m.initials}
                  </span>
                </div>
                <span className="text-[13px] text-foreground flex-1">
                  {m.name}
                </span>
                <span className="text-[12px] text-muted-foreground">
                  {[342, 289, 201][i]} msgs
                </span>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Guidelines */}
        <TabsContent
          value="guidelines"
          className="flex-1 overflow-y-auto p-4 mt-0"
        >
          <p className="text-[12px] text-muted-foreground mb-3">
            Edit community rules visible to all members.
          </p>
          <textarea
            data-ocid="community_tools.guidelines.textarea"
            value={guidelines}
            onChange={(e) => setGuidelines(e.target.value)}
            rows={10}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-wa-green transition-colors resize-none"
          />
          <button
            type="button"
            data-ocid="community_tools.guidelines.save_button"
            onClick={() => toast.success("Guidelines saved!")}
            className="w-full mt-3 py-3 rounded-xl bg-wa-green text-white text-[14px] font-semibold hover:brightness-105 transition-all"
          >
            Save Guidelines
          </button>
        </TabsContent>
      </Tabs>

      {/* Post Announcement Sheet */}
      {showPostSheet && (
        <>
          <div
            className="absolute inset-0 z-50 bg-black/60"
            onClick={() => setShowPostSheet(false)}
            onKeyDown={() => setShowPostSheet(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close"
          />
          <div
            data-ocid="community_tools.post_announcement.sheet"
            className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl p-5"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 20px)" }}
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-[17px] font-bold text-foreground">
                New Announcement
              </p>
              <button
                type="button"
                data-ocid="community_tools.post_announcement.close_button"
                onClick={() => setShowPostSheet(false)}
                className="p-1.5 rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              data-ocid="community_tools.announcement.textarea"
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              placeholder="Write your announcement..."
              rows={4}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-wa-green transition-colors resize-none mb-4"
            />
            <button
              type="button"
              data-ocid="community_tools.announcement.submit_button"
              onClick={handlePostAnnouncement}
              disabled={!newAnnouncement.trim()}
              className="w-full py-3 rounded-xl bg-wa-green text-white text-[14px] font-semibold hover:brightness-105 disabled:opacity-50 transition-all"
            >
              Post Announcement
            </button>
          </div>
        </>
      )}

      {/* Create Event Sheet */}
      {showEventSheet && (
        <>
          <div
            className="absolute inset-0 z-50 bg-black/60"
            onClick={() => setShowEventSheet(false)}
            onKeyDown={() => setShowEventSheet(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close"
          />
          <div
            data-ocid="community_tools.create_event.sheet"
            className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl p-5"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 20px)" }}
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-[17px] font-bold text-foreground">New Event</p>
              <button
                type="button"
                data-ocid="community_tools.create_event.close_button"
                onClick={() => setShowEventSheet(false)}
                className="p-1.5 rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                data-ocid="community_tools.event.title.input"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Event title"
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-wa-green transition-colors"
              />
              <div className="flex gap-2">
                <input
                  data-ocid="community_tools.event.date.input"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 text-[14px] text-foreground outline-none focus:border-wa-green transition-colors"
                />
                <input
                  data-ocid="community_tools.event.time.input"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 text-[14px] text-foreground outline-none focus:border-wa-green transition-colors"
                />
              </div>
              <textarea
                data-ocid="community_tools.event.desc.textarea"
                value={eventDesc}
                onChange={(e) => setEventDesc(e.target.value)}
                placeholder="Description (optional)"
                rows={3}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-wa-green transition-colors resize-none"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                data-ocid="community_tools.create_event.cancel_button"
                onClick={() => setShowEventSheet(false)}
                className="flex-1 py-3 rounded-xl border border-border text-[14px] font-semibold text-foreground hover:bg-muted/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="community_tools.create_event.confirm_button"
                onClick={handleCreateEvent}
                disabled={!eventTitle.trim() || !eventDate}
                className="flex-1 py-3 rounded-xl bg-wa-green text-white text-[14px] font-semibold hover:brightness-105 disabled:opacity-50 transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
