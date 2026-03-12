import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertCircle,
  BanknoteIcon,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Split,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PaymentRequestData {
  id: string;
  amount: number;
  note: string;
  status: "pending" | "paid" | "declined";
  requestedFrom?: string;
  isSent: boolean;
}

export interface SplitBillParticipant {
  name: string;
  initials: string;
  colorClass: string;
  paid: boolean;
  share: number;
}

export interface SplitBillData {
  id: string;
  total: number;
  description: string;
  participants: SplitBillParticipant[];
  isSent: boolean;
}

// ─── Avatar color helper ──────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-[#F44336]",
  "bg-[#2196F3]",
  "bg-[#4CAF50]",
  "bg-[#FF9800]",
  "bg-[#9C27B0]",
  "bg-[#00BCD4]",
  "bg-[#E91E63]",
  "bg-[#607D8B]",
];

// ─── Payment Request Sheet ────────────────────────────────────────────────────

interface PaymentRequestSheetProps {
  open: boolean;
  onClose: () => void;
  contactName: string;
  onSend: (data: PaymentRequestData) => void;
}

export function PaymentRequestSheet({
  open,
  onClose,
  contactName,
  onSend,
}: PaymentRequestSheetProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleSend = () => {
    const num = Number.parseFloat(amount);
    if (!num || num <= 0) {
      toast.error("Enter a valid amount", { position: "top-center" });
      return;
    }
    onSend({
      id: `pr_${Date.now()}`,
      amount: num,
      note: note.trim(),
      status: "pending",
      requestedFrom: contactName,
      isSent: true,
    });
    setAmount("");
    setNote("");
    onClose();
    toast.success("Payment request sent!", { position: "top-center" });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-5 pb-8 pt-4"
        data-ocid="chat.payment_request.sheet"
      >
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
        <SheetHeader className="mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center">
              <BanknoteIcon className="w-5 h-5 text-[#25D366]" />
            </div>
            <div>
              <SheetTitle className="text-[17px] font-bold text-left">
                Request Money
              </SheetTitle>
              <p className="text-[12px] text-muted-foreground">
                From {contactName}
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Amount input */}
        <div className="mb-4">
          <p className="text-[12px] text-muted-foreground font-medium mb-1.5 block">
            Amount (₹)
          </p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] font-bold text-[#25D366]">
              ₹
            </span>
            <input
              data-ocid="chat.payment_request.amount.input"
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl bg-muted border border-border text-[22px] font-bold text-foreground placeholder:text-muted-foreground/40 text-center"
            />
          </div>
        </div>

        {/* Quick amounts */}
        <div className="flex gap-2 mb-4">
          {[50, 100, 200, 500].map((amt) => (
            <button
              key={amt}
              type="button"
              data-ocid="chat.payment_request.quick_amount.button"
              onClick={() => setAmount(String(amt))}
              className="flex-1 py-2 rounded-xl bg-muted text-[13px] font-semibold text-foreground hover:bg-muted/70 transition-colors"
            >
              ₹{amt}
            </button>
          ))}
        </div>

        {/* Note */}
        <div className="mb-5">
          <p className="text-[12px] text-muted-foreground font-medium mb-1.5 block">
            Note (optional)
          </p>
          <input
            data-ocid="chat.payment_request.note.input"
            type="text"
            placeholder="What's this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-[14px] text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <Button
          data-ocid="chat.payment_request.send.button"
          onClick={handleSend}
          className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold text-[15px] py-6 rounded-2xl"
        >
          Send Request
        </Button>
      </SheetContent>
    </Sheet>
  );
}

// ─── Payment Request Bubble ───────────────────────────────────────────────────

interface PaymentRequestBubbleProps {
  data: PaymentRequestData;
  onPay?: (id: string) => void;
  onDecline?: (id: string) => void;
}

export function PaymentRequestBubble({
  data,
  onPay,
  onDecline,
}: PaymentRequestBubbleProps) {
  return (
    <div
      className="w-[220px] rounded-2xl overflow-hidden border border-[#25D366]/30"
      data-ocid="chat.payment_request.card"
      style={{
        background:
          "linear-gradient(135deg, #075E54 0%, #128C7E 60%, #25D366 100%)",
      }}
    >
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2">
        <BanknoteIcon className="w-4 h-4 text-white/80" />
        <span className="text-[11px] text-white/80 font-medium">
          Payment Request
        </span>
      </div>

      {/* Amount */}
      <div className="px-4 pb-2">
        <p className="text-[28px] font-black text-white leading-none">
          ₹{data.amount.toLocaleString()}
        </p>
        {data.note && (
          <p className="text-[12px] text-white/70 mt-0.5 truncate">
            {data.note}
          </p>
        )}
      </div>

      {/* Status / Actions */}
      {data.status === "pending" && !data.isSent ? (
        <div className="flex border-t border-white/20">
          <button
            type="button"
            data-ocid="chat.payment_request.decline.button"
            onClick={() => onDecline?.(data.id)}
            className="flex-1 py-2.5 text-[13px] font-semibold text-white/70 hover:bg-white/10 transition-colors"
          >
            Decline
          </button>
          <div className="w-px bg-white/20" />
          <button
            type="button"
            data-ocid="chat.payment_request.pay.button"
            onClick={() => onPay?.(data.id)}
            className="flex-1 py-2.5 text-[13px] font-bold text-white hover:bg-white/10 transition-colors"
          >
            Pay Now
          </button>
        </div>
      ) : (
        <div
          className={`flex items-center justify-center gap-2 py-2.5 border-t border-white/20 ${
            data.status === "paid"
              ? "text-white"
              : data.status === "declined"
                ? "text-white/50"
                : "text-white/70"
          }`}
        >
          {data.status === "paid" ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[13px] font-semibold">Paid</span>
            </>
          ) : data.status === "declined" ? (
            <>
              <X className="w-4 h-4" />
              <span className="text-[13px] font-semibold">Declined</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              <span className="text-[13px] font-semibold">Pending</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Split Bill Sheet ─────────────────────────────────────────────────────────

const DEFAULT_PARTICIPANTS = [
  { name: "You", initials: "ME", colorClass: AVATAR_COLORS[2] },
  { name: "Rahul Sharma", initials: "RS", colorClass: AVATAR_COLORS[1] },
  { name: "Priya Patel", initials: "PP", colorClass: AVATAR_COLORS[4] },
  { name: "Amit Kumar", initials: "AK", colorClass: AVATAR_COLORS[0] },
];

interface SplitBillSheetProps {
  open: boolean;
  onClose: () => void;
  isGroup: boolean;
  contactName?: string;
  onSend: (data: SplitBillData) => void;
}

export function SplitBillSheet({
  open,
  onClose,
  isGroup,
  contactName,
  onSend,
}: SplitBillSheetProps) {
  const [total, setTotal] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set([0, 1]));

  const participants = isGroup
    ? DEFAULT_PARTICIPANTS
    : [
        { name: "You", initials: "ME", colorClass: AVATAR_COLORS[2] },
        {
          name: contactName ?? "Contact",
          initials: (contactName ?? "C").slice(0, 2).toUpperCase(),
          colorClass: AVATAR_COLORS[1],
        },
      ];

  const selectedCount = selected.size;
  const perPerson =
    selectedCount > 0 && total
      ? (Number.parseFloat(total) / selectedCount).toFixed(2)
      : "0.00";

  const toggle = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        if (next.size > 1) next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleSend = () => {
    const num = Number.parseFloat(total);
    if (!num || num <= 0) {
      toast.error("Enter a valid total amount", { position: "top-center" });
      return;
    }
    if (!description.trim()) {
      toast.error("Add a description", { position: "top-center" });
      return;
    }
    const billParticipants: SplitBillParticipant[] = participants
      .filter((_, i) => selected.has(i))
      .map((p) => ({
        ...p,
        paid: p.name === "You",
        share: Number.parseFloat(perPerson),
      }));

    onSend({
      id: `sb_${Date.now()}`,
      total: num,
      description: description.trim(),
      participants: billParticipants,
      isSent: true,
    });
    setTotal("");
    setDescription("");
    setSelected(new Set([0, 1]));
    onClose();
    toast.success("Split bill sent!", { position: "top-center" });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[92vh] overflow-y-auto"
        data-ocid="chat.split_bill.sheet"
      >
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
        <SheetHeader className="mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Split className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <SheetTitle className="text-[17px] font-bold text-left">
                Split Bill
              </SheetTitle>
              <p className="text-[12px] text-muted-foreground">
                Divide expenses fairly
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Total amount */}
        <div className="mb-4">
          <p className="text-[12px] text-muted-foreground font-medium mb-1.5 block">
            Total Bill Amount (₹)
          </p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] font-bold text-blue-400">
              ₹
            </span>
            <input
              data-ocid="chat.split_bill.amount.input"
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="w-full pl-8 pr-4 py-3 rounded-xl bg-muted border border-border text-[20px] font-bold text-foreground placeholder:text-muted-foreground/40"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-[12px] text-muted-foreground font-medium mb-1.5 block">
            Description
          </p>
          <input
            data-ocid="chat.split_bill.description.input"
            type="text"
            placeholder="e.g. Dinner at Spice Garden"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-[14px] text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Participants */}
        <div className="mb-4">
          <p className="text-[12px] text-muted-foreground font-medium mb-2 block">
            Split Between ({selectedCount} people)
          </p>
          <div className="space-y-2">
            {participants.map((p, i) => (
              <button
                key={p.name}
                type="button"
                data-ocid={`chat.split_bill.participant.toggle.${i + 1}`}
                onClick={() => toggle(i)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  selected.has(i)
                    ? "bg-blue-500/15 border border-blue-500/40"
                    : "bg-muted border border-transparent"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full ${p.colorClass} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white text-[12px] font-bold">
                    {p.initials}
                  </span>
                </div>
                <span className="flex-1 text-[14px] font-medium text-foreground text-left">
                  {p.name}
                </span>
                {selected.has(i) ? (
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-border" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Per person summary */}
        {total && selectedCount > 0 && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">
              Each person pays
            </span>
            <span className="text-[18px] font-black text-blue-400">
              ₹{perPerson}
            </span>
          </div>
        )}

        <Button
          data-ocid="chat.split_bill.send.button"
          onClick={handleSend}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] py-6 rounded-2xl"
        >
          Send Split Bill
        </Button>
      </SheetContent>
    </Sheet>
  );
}

// ─── Split Bill Card (in-chat bubble) ────────────────────────────────────────

interface SplitBillCardProps {
  data: SplitBillData;
  onPay?: (billId: string, participantName: string) => void;
}

export function SplitBillCard({ data, onPay }: SplitBillCardProps) {
  const [expanded, setExpanded] = useState(false);
  const paidCount = data.participants.filter((p) => p.paid).length;
  const paidPct = (paidCount / data.participants.length) * 100;

  return (
    <div
      className="w-[240px] rounded-2xl overflow-hidden border border-blue-500/30 bg-card"
      data-ocid="chat.split_bill.card"
    >
      {/* Header */}
      <div
        className="px-4 pt-3 pb-2"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Split className="w-4 h-4 text-white/80" />
          <span className="text-[11px] text-white/80 font-medium">
            Split Bill
          </span>
        </div>
        <p className="text-[15px] font-bold text-white truncate">
          {data.description}
        </p>
        <p className="text-[22px] font-black text-white">
          ₹{data.total.toLocaleString()}
        </p>
      </div>

      {/* Progress */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-muted-foreground">
            {paidCount} of {data.participants.length} paid
          </span>
          <span className="text-[11px] font-semibold text-blue-400">
            {Math.round(paidPct)}%
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${paidPct}%` }}
          />
        </div>
      </div>

      {/* Participants toggle */}
      <button
        type="button"
        data-ocid="chat.split_bill.expand.toggle"
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>₹{data.participants[0]?.share.toFixed(2)} per person</span>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>

      {expanded && (
        <div className="px-3 pb-2 space-y-1.5">
          {data.participants.map((p, i) => (
            <div key={p.name} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full ${p.colorClass} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-white text-[10px] font-bold">
                  {p.initials}
                </span>
              </div>
              <span className="flex-1 text-[12px] text-foreground truncate">
                {p.name}
              </span>
              {p.paid ? (
                <span className="text-[11px] text-green-500 font-semibold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Paid
                </span>
              ) : (
                <button
                  type="button"
                  data-ocid={`chat.split_bill.pay.button.${i + 1}`}
                  onClick={() => onPay?.(data.id, p.name)}
                  className="text-[11px] text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                >
                  Pay
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
