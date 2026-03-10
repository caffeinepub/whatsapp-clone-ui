import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Camera, Image, Megaphone, MoreVertical, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CameraModal from "../components/CameraModal";
import ContactAvatar from "../components/ContactAvatar";
import StatusPostDialog from "../components/StatusPostDialog";
import type { UserStatus } from "../hooks/useAppState";

interface StatusScreenProps {
  onOpenStatusViewer: (index: number) => void;
  userStatuses: UserStatus[];
  onAddStatus: (text: string) => void;
  onOpenStarred?: () => void;
  onOpenSettings?: () => void;
}

const RECENT_UPDATES = [
  {
    name: "Emma Rodriguez",
    initials: "ER",
    time: "2 minutes ago",
    viewed: false,
    colorIndex: 0,
  },
  {
    name: "Marcus Chen",
    initials: "MC",
    time: "15 minutes ago",
    viewed: false,
    colorIndex: 1,
  },
  {
    name: "Priya Sharma",
    initials: "PS",
    time: "1 hour ago",
    viewed: true,
    colorIndex: 4,
  },
  {
    name: "Jordan Williams",
    initials: "JW",
    time: "3 hours ago",
    viewed: true,
    colorIndex: 3,
  },
];

const ARCHIVED_STATUSES = [
  {
    name: "My Status",
    time: "Yesterday, 3:00 PM",
    preview: "Had an amazing time at the beach! 🌊",
  },
  {
    name: "My Status",
    time: "2 days ago, 11:00 AM",
    preview: "Working from home today ☕",
  },
  {
    name: "My Status",
    time: "3 days ago, 8:30 PM",
    preview: "Movie night with the family 🎬",
  },
];

export default function StatusScreen({
  onOpenStatusViewer,
  userStatuses,
  onAddStatus,
  onOpenStarred,
  onOpenSettings,
}: StatusScreenProps) {
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showAdvertiseSheet, setShowAdvertiseSheet] = useState(false);
  const [showCreateChannelSheet, setShowCreateChannelSheet] = useState(false);
  const [showPrivacySheet, setShowPrivacySheet] = useState(false);
  const [showArchiveSheet, setShowArchiveSheet] = useState(false);
  const [privacyOption, setPrivacyOption] = useState("contacts");
  const [channelName, setChannelName] = useState("");
  const [channelDesc, setChannelDesc] = useState("");
  const [channels, setChannels] = useState([
    { name: "Tech News Daily", subs: "128K subscribers" },
    { name: "Mumbai Local Updates", subs: "45K subscribers" },
  ]);

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header */}
      <header
        className="sticky top-0 z-50 bg-wa-header px-4 pb-3 flex-shrink-0"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-wa-header-fg text-[22px] font-bold font-display">
            Updates
          </h1>
          <div className="flex items-center gap-0">
            <button
              type="button"
              data-ocid="status.pencil.button"
              onClick={() => setPostDialogOpen(true)}
              className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg transition-colors rounded-full hover:bg-white/10"
              aria-label="Text status"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              type="button"
              data-ocid="status.camera.button"
              onClick={() => setShowCameraModal(true)}
              className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg transition-colors rounded-full hover:bg-white/10"
              aria-label="Camera status"
            >
              <Camera className="w-5 h-5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  data-ocid="status.menu.button"
                  className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg transition-colors rounded-full hover:bg-white/10"
                  aria-label="More options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 bg-popover border-border shadow-lg z-50"
                data-ocid="status.dropdown_menu"
              >
                <DropdownMenuItem
                  data-ocid="status.menu.advertise"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => setShowAdvertiseSheet(true)}
                >
                  Advertise
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="status.menu.create_channel"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => setShowCreateChannelSheet(true)}
                >
                  Create channel
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="status.menu.privacy"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => setShowPrivacySheet(true)}
                >
                  Status privacy
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="status.menu.starred"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={onOpenStarred}
                >
                  Starred
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="status.menu.archive"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={() => setShowArchiveSheet(true)}
                >
                  Status archive settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="status.menu.settings"
                  className="text-[14px] py-2.5 cursor-pointer"
                  onClick={onOpenSettings}
                >
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-card">
        {/* My Status */}
        <div className="px-4 py-3 border-b border-border">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            My Status
          </p>
          <button
            type="button"
            data-ocid="status.my_status.button"
            onClick={() => setPostDialogOpen(true)}
            className="flex items-center gap-3 w-full hover:bg-muted/50 rounded-xl p-2 -mx-2 transition-colors text-left"
          >
            <div className="relative">
              <ContactAvatar initials="ME" size="md" colorIndex={2} />
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-wa-green rounded-full flex items-center justify-center border-2 border-card">
                <span className="text-white text-[10px] font-bold leading-none">
                  +
                </span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-[15px] text-foreground font-display">
                My Status
              </p>
              {userStatuses.length > 0 ? (
                <p className="text-[13px] text-muted-foreground">
                  {userStatuses[0].text.slice(0, 40)}
                  {userStatuses[0].text.length > 40 ? "…" : ""}
                </p>
              ) : (
                <p className="text-[13px] text-muted-foreground">
                  Tap to add status update
                </p>
              )}
            </div>
          </button>
          {userStatuses.length > 0 && (
            <div className="mt-2 space-y-1 pl-2">
              {userStatuses.slice(0, 3).map((s) => (
                <div
                  key={`my-status-${s.time}`}
                  className="text-[12px] text-muted-foreground flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-wa-green flex-shrink-0" />
                  <span className="truncate">{s.text}</span>
                  <span className="flex-shrink-0 text-[11px]">· {s.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Updates */}
        <div className="px-4 py-3">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Recent Updates
          </p>
          <div className="space-y-1">
            {RECENT_UPDATES.map((item, i) => (
              <button
                type="button"
                key={item.name}
                data-ocid={`status.item.${i + 1}`}
                onClick={() => onOpenStatusViewer(i)}
                className="flex items-center gap-3 w-full hover:bg-muted/50 rounded-xl p-2 -mx-2 transition-colors text-left"
              >
                <div
                  className={`p-0.5 rounded-full ${item.viewed ? "border-2 border-muted-foreground/40" : "border-2 border-wa-green"}`}
                >
                  <ContactAvatar
                    initials={item.initials}
                    size="md"
                    colorIndex={item.colorIndex}
                  />
                </div>
                <div>
                  <p className="font-semibold text-[15px] text-foreground font-display">
                    {item.name}
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {item.time}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Channels */}
        {channels.length > 0 && (
          <div className="px-4 py-3 border-t border-border">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Channels
            </p>
            <div className="space-y-1">
              {channels.map((ch, i) => (
                <div
                  key={ch.name}
                  data-ocid={`status.channel.item.${i + 1}`}
                  className="flex items-center gap-3 py-2 px-2"
                >
                  <div className="w-11 h-11 bg-[#25D366]/15 rounded-full flex items-center justify-center">
                    <span className="text-[18px]">📢</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[15px] text-foreground font-display">
                      {ch.name}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {ch.subs}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <StatusPostDialog
        open={postDialogOpen}
        onClose={() => setPostDialogOpen(false)}
        onPost={onAddStatus}
      />
      <CameraModal
        open={showCameraModal}
        onClose={() => setShowCameraModal(false)}
      />

      {/* Advertise Sheet */}
      <Sheet open={showAdvertiseSheet} onOpenChange={setShowAdvertiseSheet}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4"
          data-ocid="status.advertise.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-5">
            <SheetTitle className="text-[17px] font-bold">
              Advertise on WhatsApp
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="w-16 h-16 bg-[#25D366]/15 rounded-2xl flex items-center justify-center">
              <Megaphone className="w-8 h-8 text-[#25D366]" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-[16px] font-bold text-foreground">
                Reach more customers
              </p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Create ads that send people directly to your WhatsApp chat.
                Connect with more customers and grow your business.
              </p>
            </div>
            <div className="w-full space-y-2">
              {[
                "Target the right audience",
                "Get more leads instantly",
                "Track ad performance",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#25D366]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] text-[#25D366] font-bold">
                      ✓
                    </span>
                  </div>
                  <p className="text-[14px] text-foreground">{f}</p>
                </div>
              ))}
            </div>
          </div>
          <Button
            data-ocid="status.advertise.learn_more.button"
            className="w-full mt-5 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            onClick={() => {
              toast.success("Opening WhatsApp Ads...");
              setShowAdvertiseSheet(false);
            }}
          >
            Learn More
          </Button>
        </SheetContent>
      </Sheet>

      {/* Create Channel Sheet */}
      <Sheet
        open={showCreateChannelSheet}
        onOpenChange={setShowCreateChannelSheet}
      >
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4"
          data-ocid="status.create_channel.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[17px] font-bold">
              Create Channel
            </SheetTitle>
          </SheetHeader>
          <p className="text-[13px] text-muted-foreground mb-4">
            Channels are a private way to send updates to a large audience.
          </p>
          <div className="space-y-3">
            <div>
              <Label className="text-[13px] text-muted-foreground mb-1 block">
                Channel name *
              </Label>
              <Input
                data-ocid="status.channel.name.input"
                placeholder="e.g. My Business Updates"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="bg-muted/50 border-0 rounded-xl"
              />
            </div>
            <div>
              <Label className="text-[13px] text-muted-foreground mb-1 block">
                Description (optional)
              </Label>
              <Input
                data-ocid="status.channel.desc.input"
                placeholder="What is this channel about?"
                value={channelDesc}
                onChange={(e) => setChannelDesc(e.target.value)}
                className="bg-muted/50 border-0 rounded-xl"
              />
            </div>
          </div>
          <Button
            data-ocid="status.channel.create_button"
            disabled={!channelName.trim()}
            className="w-full mt-5 bg-[#25D366] hover:bg-[#25D366]/90 text-white disabled:opacity-50"
            onClick={() => {
              setChannels((prev) => [
                ...prev,
                { name: channelName, subs: "Just created" },
              ]);
              toast.success(`Channel "${channelName}" created!`);
              setShowCreateChannelSheet(false);
              setChannelName("");
              setChannelDesc("");
            }}
          >
            Create Channel
          </Button>
        </SheetContent>
      </Sheet>

      {/* Status Privacy Sheet */}
      <Sheet open={showPrivacySheet} onOpenChange={setShowPrivacySheet}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4"
          data-ocid="status.privacy.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[17px] font-bold">
              Status privacy
            </SheetTitle>
          </SheetHeader>
          <p className="text-[13px] text-muted-foreground mb-4">
            Choose who can see your status updates.
          </p>
          <RadioGroup
            value={privacyOption}
            onValueChange={setPrivacyOption}
            className="space-y-3"
          >
            {[
              {
                val: "contacts",
                label: "My contacts",
                desc: "All your contacts",
              },
              {
                val: "except",
                label: "My contacts except...",
                desc: "Choose contacts to exclude",
              },
              {
                val: "only",
                label: "Only share with...",
                desc: "Choose specific contacts",
              },
            ].map(({ val, label, desc }) => (
              <button
                type="button"
                key={val}
                className="flex items-center justify-between py-2 cursor-pointer w-full"
                onClick={() => setPrivacyOption(val)}
              >
                <div>
                  <p className="text-[15px] text-foreground font-semibold">
                    {label}
                  </p>
                  <p className="text-[12px] text-muted-foreground">{desc}</p>
                </div>
                <RadioGroupItem
                  value={val}
                  data-ocid={`status.privacy.${val}.radio`}
                />
              </button>
            ))}
          </RadioGroup>
          <Button
            data-ocid="status.privacy.save_button"
            className="w-full mt-5 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            onClick={() => {
              toast.success("Status privacy updated");
              setShowPrivacySheet(false);
            }}
          >
            Save
          </Button>
        </SheetContent>
      </Sheet>

      {/* Status Archive Sheet */}
      <Sheet open={showArchiveSheet} onOpenChange={setShowArchiveSheet}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[80vh] overflow-y-auto"
          data-ocid="status.archive.sheet"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[17px] font-bold">
              Status archive
            </SheetTitle>
          </SheetHeader>
          <p className="text-[13px] text-muted-foreground mb-4">
            Your past status updates are saved here.
          </p>
          <div className="space-y-3">
            {ARCHIVED_STATUSES.map((s, i) => (
              <div
                key={s.time}
                data-ocid={`status.archive.item.${i + 1}`}
                className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl"
              >
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                  <Image className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-foreground truncate">
                    {s.preview}
                  </p>
                  <p className="text-[12px] text-muted-foreground">{s.time}</p>
                </div>
                <button
                  type="button"
                  data-ocid={`status.archive.save.button.${i + 1}`}
                  className="text-[12px] text-[#25D366] font-semibold flex-shrink-0"
                  onClick={() => toast.success("Saved to camera roll")}
                >
                  Save
                </button>
              </div>
            ))}
          </div>
          <Button
            data-ocid="status.archive.save_all.button"
            variant="outline"
            className="w-full mt-5"
            onClick={() => {
              toast.success("All statuses saved to camera roll");
              setShowArchiveSheet(false);
            }}
          >
            Save all to Camera Roll
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
