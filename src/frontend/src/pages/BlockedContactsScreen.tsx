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
import { ArrowLeft, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ContactAvatar from "../components/ContactAvatar";

interface BlockedContact {
  id: string;
  name: string;
  initials: string;
  colorIndex: number;
  phone: string;
}

const DEFAULT_BLOCKED: BlockedContact[] = [
  {
    id: "bc1",
    name: "Unknown Caller",
    initials: "UC",
    colorIndex: 5,
    phone: "+91 99999 00001",
  },
  {
    id: "bc2",
    name: "Spam Account",
    initials: "SA",
    colorIndex: 7,
    phone: "+91 88888 00002",
  },
];

interface BlockedContactsScreenProps {
  onBack: () => void;
}

export default function BlockedContactsScreen({
  onBack,
}: BlockedContactsScreenProps) {
  const [blocked, setBlocked] = useState<BlockedContact[]>(() => {
    const saved = localStorage.getItem("wa_blocked_contacts");
    return saved ? JSON.parse(saved) : DEFAULT_BLOCKED;
  });
  const [unblockTarget, setUnblockTarget] = useState<BlockedContact | null>(
    null,
  );

  const handleUnblock = () => {
    if (!unblockTarget) return;
    const updated = blocked.filter((c) => c.id !== unblockTarget.id);
    setBlocked(updated);
    localStorage.setItem("wa_blocked_contacts", JSON.stringify(updated));
    toast.success(`${unblockTarget.name} unblocked`);
    setUnblockTarget(null);
  };

  return (
    <div
      className="flex flex-col h-full bg-background"
      data-ocid="blocked.page"
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 bg-wa-header flex items-center gap-3 px-4 pb-3 flex-shrink-0"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
      >
        <button
          type="button"
          data-ocid="blocked.back.button"
          onClick={onBack}
          className="p-1 text-wa-header-fg/80 hover:text-wa-header-fg transition-colors rounded-full hover:bg-white/10"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-wa-header-fg text-[20px] font-bold font-display flex-1">
          Blocked Contacts
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {blocked.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-64 gap-3"
            data-ocid="blocked.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <UserX className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-[15px] font-semibold text-foreground">
              No blocked contacts
            </p>
            <p className="text-[13px] text-muted-foreground text-center px-8">
              You haven't blocked anyone. If you block someone, they appear
              here.
            </p>
          </div>
        ) : (
          <>
            <p className="px-4 py-3 text-[12px] text-muted-foreground">
              {blocked.length} blocked contact{blocked.length !== 1 ? "s" : ""}
            </p>
            <ul data-ocid="blocked.list">
              {blocked.map((contact, idx) => (
                <li
                  key={contact.id}
                  data-ocid={`blocked.item.${idx + 1}`}
                  className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0"
                >
                  <ContactAvatar
                    initials={contact.initials}
                    size="md"
                    colorIndex={contact.colorIndex}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-foreground">
                      {contact.name}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {contact.phone}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    data-ocid={`blocked.unblock_button.${idx + 1}`}
                    onClick={() => setUnblockTarget(contact)}
                    className="text-[12px] border-wa-green text-wa-green hover:bg-wa-green/10 flex-shrink-0"
                  >
                    Unblock
                  </Button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Unblock confirmation dialog */}
      <AlertDialog
        open={!!unblockTarget}
        onOpenChange={(o) => !o && setUnblockTarget(null)}
      >
        <AlertDialogContent data-ocid="blocked.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Unblock {unblockTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              They will be able to call you and send you messages again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="blocked.cancel_button"
              onClick={() => setUnblockTarget(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="blocked.confirm_button"
              onClick={handleUnblock}
              className="bg-wa-green hover:bg-wa-green/90 text-white"
            >
              Unblock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
