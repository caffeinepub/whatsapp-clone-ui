import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Bell,
  BellOff,
  Copy,
  Eye,
  Pin,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export interface Channel {
  name: string;
  subs: string;
  isOwner?: boolean;
  subscribers?: number;
  views?: number;
  muted?: boolean;
  pinnedPostId?: string | null;
}

interface ChannelAdminPanelProps {
  channel: Channel;
  onBack: () => void;
  onDelete: () => void;
  onUpdate: (updated: Channel) => void;
}

export default function ChannelAdminPanel({
  channel,
  onBack,
  onDelete,
  onUpdate,
}: ChannelAdminPanelProps) {
  const [muted, setMuted] = useState(channel.muted ?? false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const subscribers = channel.subscribers ?? 128_450;
  const views = channel.views ?? 2_340_887;

  const handleMuteToggle = (val: boolean) => {
    setMuted(val);
    onUpdate({ ...channel, muted: val });
    toast.success(
      val ? "Channel notifications muted" : "Channel notifications unmuted",
    );
  };

  const handleShareLink = () => {
    const link = `https://wa.me/channel/${channel.name.toLowerCase().replace(/\s+/g, "-")}`;
    navigator.clipboard?.writeText(link).catch(() => {});
    toast.success("Channel link copied!");
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    toast.success(`Channel "${channel.name}" deleted`);
    onDelete();
  };

  return (
    <motion.div
      data-ocid="channel_admin.panel"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 380, damping: 38 }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 bg-wa-header flex items-center gap-3 px-2 pb-3 flex-shrink-0"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
      >
        <button
          type="button"
          data-ocid="channel_admin.back.button"
          onClick={onBack}
          className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-wa-header-fg text-[17px] font-bold">
            {channel.name}
          </h1>
          <p className="text-wa-header-fg/60 text-[12px]">Channel Admin</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 px-4 pt-5 pb-4">
          <motion.div
            data-ocid="channel_admin.subscribers.card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card rounded-2xl p-4 flex flex-col gap-1 border border-border/40"
          >
            <div className="w-10 h-10 rounded-full bg-[#25D366]/15 flex items-center justify-center mb-1">
              <Users className="w-5 h-5 text-[#25D366]" />
            </div>
            <p className="text-[22px] font-bold text-foreground">
              {subscribers.toLocaleString()}
            </p>
            <p className="text-[12px] text-muted-foreground">Subscribers</p>
          </motion.div>
          <motion.div
            data-ocid="channel_admin.views.card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-4 flex flex-col gap-1 border border-border/40"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center mb-1">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-[22px] font-bold text-foreground">
              {(views / 1_000_000).toFixed(1)}M
            </p>
            <p className="text-[12px] text-muted-foreground">Total Views</p>
          </motion.div>
        </div>

        {/* Settings */}
        <div className="px-4 space-y-2">
          {/* Mute */}
          <div className="bg-card rounded-2xl border border-border/40 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                  {muted ? (
                    <BellOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Bell className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-[15px] font-medium text-foreground">
                    Mute channel
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    Stop notifications from this channel
                  </p>
                </div>
              </div>
              <Switch
                data-ocid="channel_admin.mute.switch"
                checked={muted}
                onCheckedChange={handleMuteToggle}
              />
            </div>
          </div>

          {/* Share link */}
          <button
            type="button"
            data-ocid="channel_admin.share.button"
            onClick={handleShareLink}
            className="w-full bg-card rounded-2xl border border-border/40 flex items-center gap-3 px-4 py-4 hover:bg-muted/30 active:bg-muted/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-[#25D366]/15 flex items-center justify-center">
              <Copy className="w-4 h-4 text-[#25D366]" />
            </div>
            <div className="text-left">
              <p className="text-[15px] font-medium text-foreground">
                Share channel link
              </p>
              <p className="text-[12px] text-muted-foreground">
                Copy invite link to clipboard
              </p>
            </div>
          </button>

          {/* Pinning info */}
          <div className="bg-card rounded-2xl border border-border/40 flex items-center gap-3 px-4 py-4">
            <div className="w-9 h-9 rounded-full bg-yellow-500/15 flex items-center justify-center">
              <Pin className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <p className="text-[15px] font-medium text-foreground">
                Pin posts
              </p>
              <p className="text-[12px] text-muted-foreground">
                Long-press any post in the channel to pin it
              </p>
            </div>
          </div>

          {/* Delete channel */}
          <button
            type="button"
            data-ocid="channel_admin.delete.button"
            onClick={() => setShowDeleteDialog(true)}
            className="w-full bg-card rounded-2xl border border-destructive/30 flex items-center gap-3 px-4 py-4 hover:bg-destructive/5 active:bg-destructive/10 transition-colors mt-4"
          >
            <div className="w-9 h-9 rounded-full bg-destructive/15 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-destructive" />
            </div>
            <div className="text-left">
              <p className="text-[15px] font-medium text-destructive">
                Delete channel
              </p>
              <p className="text-[12px] text-muted-foreground">
                This action cannot be undone
              </p>
            </div>
          </button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent
          data-ocid="channel_admin.delete.dialog"
          className="max-w-[320px] rounded-2xl"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{channel.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting this channel is permanent. All posts and subscribers will
              be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="channel_admin.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="channel_admin.delete.confirm_button"
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
