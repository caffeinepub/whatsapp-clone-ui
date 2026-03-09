import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface StatusPostDialogProps {
  open: boolean;
  onClose: () => void;
  onPost: (text: string) => void;
}

const MAX_CHARS = 139;

export default function StatusPostDialog({
  open,
  onClose,
  onPost,
}: StatusPostDialogProps) {
  const [text, setText] = useState("");

  const handlePost = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onPost(trimmed);
    setText("");
    onClose();
  };

  const handleClose = () => {
    setText("");
    onClose();
  };

  const remaining = MAX_CHARS - text.length;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        data-ocid="status.dialog"
        className="max-w-[360px] mx-4 rounded-2xl"
      >
        <DialogHeader>
          <DialogTitle className="font-display">Add Status</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <Textarea
            data-ocid="status.textarea"
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setText(e.target.value);
              }
            }}
            className="resize-none min-h-[100px] text-[14px]"
            autoFocus
          />
          <div
            className={`text-right text-[11px] mt-1 ${
              remaining <= 20 ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {remaining} characters remaining
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            data-ocid="status.cancel_button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            data-ocid="status.submit_button"
            onClick={handlePost}
            disabled={!text.trim()}
            className="flex-1 bg-wa-green hover:bg-wa-green/90 text-white"
          >
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
