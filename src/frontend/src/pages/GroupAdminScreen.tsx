import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Copy,
  Link,
  RefreshCw,
  Shield,
  UserMinus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GroupAdminScreenProps {
  onBack: () => void;
}

const MOCK_MEMBERS = [
  { id: 1, name: "You", initials: "YO", role: "Admin" as const, colorIndex: 0 },
  {
    id: 2,
    name: "Emma Rodriguez",
    initials: "ER",
    role: "Admin" as const,
    colorIndex: 2,
  },
  {
    id: 3,
    name: "Marcus Chen",
    initials: "MC",
    role: "Member" as const,
    colorIndex: 1,
  },
  {
    id: 4,
    name: "Priya Sharma",
    initials: "PS",
    role: "Member" as const,
    colorIndex: 4,
  },
  {
    id: 5,
    name: "Jordan Williams",
    initials: "JW",
    role: "Member" as const,
    colorIndex: 3,
  },
];

const AVATAR_COLORS = [
  "bg-[#00a884]",
  "bg-[#2563EB]",
  "bg-[#7C3AED]",
  "bg-[#DC2626]",
  "bg-[#D97706]",
];

export default function GroupAdminScreen({ onBack }: GroupAdminScreenProps) {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [groupName, setGroupName] = useState("Family Group 🏡");
  const [groupDesc, setGroupDesc] = useState(
    "Our family chat – stay connected!",
  );
  const [approveMembers, setApproveMembers] = useState(false);
  const [announcementMode, setAnnouncementMode] = useState(false);
  const [inviteLink, setInviteLink] = useState(
    "https://chat.whatsapp.com/abc123xyz",
  );

  const toggleRole = (id: number) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, role: m.role === "Admin" ? "Member" : "Admin" }
          : m,
      ),
    );
    const member = members.find((m) => m.id === id);
    if (member) {
      const newRole = member.role === "Admin" ? "Member" : "Admin";
      toast.success(`${member.name} is now ${newRole}`, {
        position: "top-center",
      });
    }
  };

  const removeMember = (id: number) => {
    const member = members.find((m) => m.id === id);
    if (!member || member.name === "You") {
      toast.error("You cannot remove yourself", { position: "top-center" });
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success(`${member.name} removed from group`, {
      position: "top-center",
    });
  };

  const handleSaveSettings = () => {
    if (!groupName.trim()) {
      toast.error("Group name cannot be empty", { position: "top-center" });
      return;
    }
    toast.success("Group settings saved", { position: "top-center" });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink).catch(() => {});
    toast.success("Link copied to clipboard", { position: "top-center" });
  };

  const resetLink = () => {
    const newLink = `https://chat.whatsapp.com/${Math.random().toString(36).slice(2, 12)}`;
    setInviteLink(newLink);
    toast.success("Invite link reset", { position: "top-center" });
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col bg-background"
      data-ocid="group_admin.page"
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-3 py-2 flex-shrink-0"
        style={{
          background: "#00a884",
          paddingTop: "max(env(safe-area-inset-top, 0px), 8px)",
        }}
      >
        <button
          type="button"
          data-ocid="group_admin.back_button"
          onClick={onBack}
          className="p-2 text-white rounded-full hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-white" />
          <h1 className="text-[18px] font-semibold text-white">
            Group Admin Tools
          </h1>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="pb-8 space-y-0">
          {/* Members Section */}
          <div className="mt-4">
            <div className="flex items-center gap-2 px-4 mb-2">
              <Users className="w-4 h-4 text-[#00a884]" />
              <h2 className="text-[13px] font-semibold text-[#00a884] uppercase tracking-wide">
                Members
              </h2>
              <span className="ml-auto text-[12px] text-muted-foreground">
                {members.length} members
              </span>
            </div>
            <div
              className="bg-card border-y border-border"
              data-ocid="group_admin.members.list"
            >
              {members.map((member, idx) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0"
                  data-ocid={`group_admin.member.item.${idx + 1}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full ${AVATAR_COLORS[member.colorIndex]} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-[13px] font-bold text-white">
                      {member.initials}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground truncate">
                      {member.name}
                    </p>
                    <Badge
                      variant={
                        member.role === "Admin" ? "default" : "secondary"
                      }
                      className={`text-[10px] px-1.5 py-0 h-4 mt-0.5 ${
                        member.role === "Admin"
                          ? "bg-[#00a884]/20 text-[#00a884] border-[#00a884]/30"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {member.role}
                    </Badge>
                  </div>
                  {member.name !== "You" && (
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        data-ocid={`group_admin.member.toggle.${idx + 1}`}
                        onClick={() => toggleRole(member.id)}
                        className="text-[11px] px-2 py-1 rounded-full border border-[#00a884] text-[#00a884] hover:bg-[#00a884]/10 transition-colors font-medium"
                      >
                        {member.role === "Admin"
                          ? "Remove Admin"
                          : "Make Admin"}
                      </button>
                      <button
                        type="button"
                        data-ocid={`group_admin.member.delete_button.${idx + 1}`}
                        onClick={() => removeMember(member.id)}
                        className="p-1.5 rounded-full text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label={`Remove ${member.name}`}
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Group Settings */}
          <div className="mt-6">
            <div className="flex items-center gap-2 px-4 mb-2">
              <h2 className="text-[13px] font-semibold text-[#00a884] uppercase tracking-wide">
                Group Settings
              </h2>
            </div>
            <div className="bg-card border-y border-border px-4 py-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[13px] text-muted-foreground">
                  Group Name
                </Label>
                <Input
                  data-ocid="group_admin.group_name.input"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="h-10 text-[14px] bg-background"
                  maxLength={60}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] text-muted-foreground">
                  Description
                </Label>
                <Textarea
                  data-ocid="group_admin.group_desc.textarea"
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  className="text-[14px] bg-background resize-none"
                  rows={3}
                  maxLength={200}
                />
              </div>
              <Button
                data-ocid="group_admin.save.primary_button"
                className="w-full bg-[#00a884] hover:bg-[#008f72] text-white h-10"
                onClick={handleSaveSettings}
              >
                Save Changes
              </Button>
            </div>
          </div>

          {/* Invite Link */}
          <div className="mt-6">
            <div className="flex items-center gap-2 px-4 mb-2">
              <Link className="w-4 h-4 text-[#00a884]" />
              <h2 className="text-[13px] font-semibold text-[#00a884] uppercase tracking-wide">
                Invite Link
              </h2>
            </div>
            <div className="bg-card border-y border-border px-4 py-4 space-y-3">
              <p className="text-[13px] text-muted-foreground font-mono bg-muted rounded-lg px-3 py-2 break-all select-all">
                {inviteLink}
              </p>
              <div className="flex gap-2">
                <Button
                  data-ocid="group_admin.copy_link.button"
                  variant="outline"
                  className="flex-1 h-9 gap-2 text-[13px]"
                  onClick={copyLink}
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
                </Button>
                <Button
                  data-ocid="group_admin.reset_link.secondary_button"
                  variant="outline"
                  className="flex-1 h-9 gap-2 text-[13px] text-destructive border-destructive/40 hover:bg-destructive/10"
                  onClick={resetLink}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Link
                </Button>
              </div>
            </div>
          </div>

          {/* Join Approval */}
          <div className="mt-6">
            <div className="bg-card border-y border-border">
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex-1 pr-4">
                  <p className="text-[14px] font-medium text-foreground">
                    Approve new members
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    Admins must approve join requests
                  </p>
                </div>
                <Switch
                  data-ocid="group_admin.approve_members.switch"
                  checked={approveMembers}
                  onCheckedChange={setApproveMembers}
                  className="data-[state=checked]:bg-[#00a884]"
                />
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex-1 pr-4">
                  <p className="text-[14px] font-medium text-foreground">
                    Announcement mode
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    Only admins can send messages
                  </p>
                </div>
                <Switch
                  data-ocid="group_admin.announcement_mode.switch"
                  checked={announcementMode}
                  onCheckedChange={(v) => {
                    setAnnouncementMode(v);
                    toast.success(
                      v
                        ? "Announcement mode enabled"
                        : "Announcement mode disabled",
                      { position: "top-center" },
                    );
                  }}
                  className="data-[state=checked]:bg-[#00a884]"
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
