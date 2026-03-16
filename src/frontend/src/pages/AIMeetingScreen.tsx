import { useState } from "react";
import { toast } from "sonner";

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string[];
  agenda: string;
  status: "upcoming" | "live" | "ended";
  summary?: string;
  joinLink: string;
}

const SAMPLE_MEETINGS: Meeting[] = [
  {
    id: "1",
    title: "Product Roadmap Q2",
    date: "2026-03-14",
    time: "10:00",
    participants: ["Emma Rodriguez", "Marcus Chen", "Priya Sharma"],
    agenda: "Review Q2 milestones, discuss feature priorities, assign owners.",
    status: "upcoming",
    joinLink: "https://meet.wa.app/abc123",
  },
  {
    id: "2",
    title: "Weekly Team Standup",
    date: "2026-03-13",
    time: "09:00",
    participants: ["Jordan Williams", "Alex Kim"],
    agenda: "Status updates, blockers, quick wins.",
    status: "ended",
    summary:
      "Team confirmed all sprint items on track. Alex will unblock the API issue by EOD. Next sync same time next week.",
    joinLink: "https://meet.wa.app/def456",
  },
  {
    id: "3",
    title: "Client Demo",
    date: "2026-03-13",
    time: "14:30",
    participants: ["Sarah Johnson", "Michael Torres"],
    agenda: "Live demo of new features to TechCorp stakeholders.",
    status: "live",
    joinLink: "https://meet.wa.app/live789",
  },
];

const CONTACTS = [
  "Emma Rodriguez",
  "Marcus Chen",
  "Priya Sharma",
  "Jordan Williams",
  "Alex Kim",
  "Sarah Johnson",
  "Michael Torres",
  "Nina Patel",
];

const AI_SUMMARIES = [
  "Meeting was productive. Key action items assigned to each participant. Follow-up scheduled for next week.",
  "All agenda points covered. Team aligned on next steps. Two open questions to be resolved asynchronously.",
  "Great discussion on priorities. Roadmap updated based on feedback. Owners confirmed for Q2 milestones.",
];

export default function AIMeetingScreen({ onBack }: { onBack: () => void }) {
  const [meetings, setMeetings] = useState<Meeting[]>(SAMPLE_MEETINGS);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    agenda: "",
    participants: [] as string[],
  });
  const [summarizing, setSummarizing] = useState(false);

  const handleCreate = () => {
    if (!form.title || !form.date || !form.time) {
      toast.error("Please fill in title, date and time.");
      return;
    }
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      ...form,
      status: "upcoming",
      joinLink: `https://meet.wa.app/${Math.random().toString(36).slice(2, 8)}`,
    };
    setMeetings((prev) => [newMeeting, ...prev]);
    setShowCreate(false);
    setForm({ title: "", date: "", time: "", agenda: "", participants: [] });
    toast.success("Meeting scheduled!");
  };

  const handleSummarize = (id: string) => {
    setSummarizing(true);
    setTimeout(() => {
      const summary =
        AI_SUMMARIES[Math.floor(Math.random() * AI_SUMMARIES.length)];
      setMeetings((prev) =>
        prev.map((m) => (m.id === id ? { ...m, summary, status: "ended" } : m)),
      );
      if (selectedMeeting?.id === id) {
        setSelectedMeeting((prev) =>
          prev ? { ...prev, summary, status: "ended" } : prev,
        );
      }
      setSummarizing(false);
      toast.success("AI summary generated!");
    }, 2000);
  };

  const toggleParticipant = (name: string) => {
    setForm((prev) => ({
      ...prev,
      participants: prev.participants.includes(name)
        ? prev.participants.filter((p) => p !== name)
        : [...prev.participants, name],
    }));
  };

  const statusColor = (s: Meeting["status"]) =>
    s === "live"
      ? "bg-red-500"
      : s === "upcoming"
        ? "bg-green-500"
        : "bg-gray-500";

  const statusLabel = (s: Meeting["status"]) =>
    s === "live" ? "LIVE" : s === "upcoming" ? "Upcoming" : "Ended";

  if (selectedMeeting) {
    const m = selectedMeeting;
    return (
      <div className="flex flex-col h-full bg-background text-foreground">
        <div
          className="flex items-center gap-3 px-4 py-3 border-b border-border"
          style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)" }}
        >
          <button
            type="button"
            data-ocid="meeting_detail.close_button"
            onClick={() => setSelectedMeeting(null)}
            className="text-white text-xl"
          >
            ←
          </button>
          <span className="text-white font-semibold text-base flex-1 truncate">
            {m.title}
          </span>
          <span
            className={`text-[10px] text-white font-bold px-2 py-0.5 rounded-full ${statusColor(m.status)}`}
          >
            {statusLabel(m.status)}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-card rounded-2xl p-4 space-y-2">
            <div className="text-xs text-muted-foreground">Date & Time</div>
            <div className="font-semibold">
              {m.date} at {m.time}
            </div>
          </div>
          <div className="bg-card rounded-2xl p-4 space-y-2">
            <div className="text-xs text-muted-foreground">
              Participants ({m.participants.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {m.participants.map((p) => (
                <span
                  key={p}
                  className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl p-4 space-y-2">
            <div className="text-xs text-muted-foreground">Agenda</div>
            <div className="text-sm">{m.agenda || "No agenda set."}</div>
          </div>
          <div className="bg-card rounded-2xl p-4 space-y-2">
            <div className="text-xs text-muted-foreground">Join Link</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary flex-1 truncate">
                {m.joinLink}
              </span>
              <button
                type="button"
                data-ocid="meeting_detail.secondary_button"
                onClick={() => {
                  navigator.clipboard?.writeText(m.joinLink);
                  toast.success("Link copied!");
                }}
                className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full"
              >
                Copy
              </button>
            </div>
          </div>
          {m.summary && (
            <div
              className="rounded-2xl p-4 space-y-2"
              style={{
                background:
                  "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(37,99,235,0.15))",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <span className="text-xs text-muted-foreground font-semibold">
                  AI Meeting Summary
                </span>
              </div>
              <div className="text-sm">{m.summary}</div>
            </div>
          )}
          {m.status !== "ended" && (
            <button
              type="button"
              data-ocid="meeting_detail.primary_button"
              onClick={() => handleSummarize(m.id)}
              disabled={summarizing}
              className="w-full py-3 rounded-2xl font-semibold text-white text-sm"
              style={{ background: "linear-gradient(135deg,#7C3AED,#2563EB)" }}
            >
              {summarizing
                ? "Generating AI Summary..."
                : "✨ Generate AI Summary"}
            </button>
          )}
          {m.status === "upcoming" && (
            <button
              type="button"
              data-ocid="meeting_detail.open_modal_button"
              onClick={() => {
                window.open(m.joinLink, "_blank");
              }}
              className="w-full py-3 rounded-2xl font-semibold text-white text-sm bg-green-600"
            >
              Join Meeting
            </button>
          )}
          {m.status === "live" && (
            <button
              type="button"
              data-ocid="meeting_detail.open_modal_button"
              className="w-full py-3 rounded-2xl font-semibold text-white text-sm bg-red-500 animate-pulse"
              onClick={() => toast.info("Joining live meeting...")}
            >
              🔴 Join Live Now
            </button>
          )}
        </div>
      </div>
    );
  }

  if (showCreate) {
    return (
      <div className="flex flex-col h-full bg-background text-foreground">
        <div
          className="flex items-center gap-3 px-4 py-3 border-b border-border"
          style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)" }}
        >
          <button
            type="button"
            data-ocid="create_meeting.close_button"
            onClick={() => setShowCreate(false)}
            className="text-white text-xl"
          >
            ←
          </button>
          <span className="text-white font-semibold">New Meeting</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Meeting Title *</div>
            <input
              data-ocid="create_meeting.input"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Enter meeting title"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Date *</div>
              <input
                data-ocid="create_meeting.input"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                className="w-full bg-card border border-border rounded-xl px-3 py-3 text-sm text-foreground outline-none"
              />
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Time *</div>
              <input
                data-ocid="create_meeting.input"
                type="time"
                value={form.time}
                onChange={(e) =>
                  setForm((p) => ({ ...p, time: e.target.value }))
                }
                className="w-full bg-card border border-border rounded-xl px-3 py-3 text-sm text-foreground outline-none"
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Agenda</div>
            <textarea
              data-ocid="create_meeting.textarea"
              value={form.agenda}
              onChange={(e) =>
                setForm((p) => ({ ...p, agenda: e.target.value }))
              }
              placeholder="Meeting agenda..."
              rows={3}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none resize-none"
            />
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              Invite Participants
            </div>
            <div className="space-y-1">
              {CONTACTS.map((c) => (
                <button
                  type="button"
                  key={c}
                  data-ocid="create_meeting.toggle"
                  onClick={() => toggleParticipant(c)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                    form.participants.includes(c)
                      ? "bg-primary/20 text-primary"
                      : "bg-card text-foreground"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {c
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </div>
                  <span className="flex-1">{c}</span>
                  {form.participants.includes(c) && (
                    <span className="text-primary">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            data-ocid="create_meeting.submit_button"
            onClick={handleCreate}
            className="w-full py-3 rounded-2xl font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#7C3AED,#2563EB)" }}
          >
            Schedule Meeting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-border"
        style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)" }}
      >
        <button
          type="button"
          data-ocid="ai_meeting.close_button"
          onClick={onBack}
          className="text-white text-xl"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="text-white font-semibold text-base">
            AI Meeting Assistant
          </div>
          <div className="text-white/60 text-xs">
            {meetings.length} meetings
          </div>
        </div>
        <button
          type="button"
          data-ocid="ai_meeting.open_modal_button"
          onClick={() => setShowCreate(true)}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xl"
        >
          +
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 px-4 py-3 border-b border-border">
        {[
          {
            label: "Upcoming",
            count: meetings.filter((m) => m.status === "upcoming").length,
            color: "text-green-400",
          },
          {
            label: "Live",
            count: meetings.filter((m) => m.status === "live").length,
            color: "text-red-400",
          },
          {
            label: "Ended",
            count: meetings.filter((m) => m.status === "ended").length,
            color: "text-muted-foreground",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex-1 bg-card rounded-xl p-2 text-center"
          >
            <div className={`text-lg font-bold ${s.color}`}>{s.count}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {meetings.map((m) => (
          <button
            type="button"
            key={m.id}
            data-ocid="ai_meeting.item"
            onClick={() => setSelectedMeeting(m)}
            className="w-full flex items-start gap-3 px-4 py-3 border-b border-border text-left hover:bg-card/50 transition-colors"
          >
            <div
              className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg,#7C3AED,#2563EB)" }}
            >
              📅
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm truncate flex-1">
                  {m.title}
                </span>
                <span
                  className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full ${statusColor(m.status)}`}
                >
                  {statusLabel(m.status)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {m.date} · {m.time}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 truncate">
                {m.participants.join(", ")}
              </div>
              {m.summary && (
                <div className="text-xs text-primary mt-1 flex items-center gap-1">
                  <span>✨</span>
                  <span className="truncate">{m.summary.slice(0, 50)}...</span>
                </div>
              )}
            </div>
          </button>
        ))}
        {meetings.length === 0 && (
          <div
            data-ocid="ai_meeting.empty_state"
            className="flex flex-col items-center justify-center h-64 text-muted-foreground"
          >
            <div className="text-5xl mb-3">📅</div>
            <div className="font-semibold">No meetings yet</div>
            <div className="text-sm mt-1">Tap + to schedule one</div>
          </div>
        )}
      </div>
    </div>
  );
}
