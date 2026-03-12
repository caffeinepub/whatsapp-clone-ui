import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  BanknoteIcon,
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  Filter,
  Gift,
  History,
  Home,
  Lock,
  MessageSquare,
  MoreVertical,
  Pencil,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  Smartphone,
  Star,
  Trash2,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Data ──────────────────────────────────────────────────────────────────

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

const BANK_ACCOUNTS = [
  {
    id: 1,
    bank: "State Bank of India",
    masked: "XXXX4521",
    upiId: "919876543210@sbi",
    primary: true,
    colorClass: "bg-[#2563EB]",
    initials: "SBI",
    ifsc: "SBIN0001234",
    balance: 12450,
  },
  {
    id: 2,
    bank: "HDFC Bank",
    masked: "XXXX8934",
    upiId: "rahul.sharma@hdfc",
    primary: false,
    colorClass: "bg-[#DC2626]",
    initials: "HDFC",
    ifsc: "HDFC0001234",
    balance: 5320,
  },
];

const UPI_IDS = [
  { id: 1, upi: "919876543210@ybl", primary: true },
  { id: 2, upi: "user.name@oksbi", primary: false },
];

const TRANSACTIONS = [
  {
    id: 1,
    name: "Rahul Sharma",
    initials: "RS",
    amount: 500,
    type: "sent" as const,
    date: "Today, 2:15 PM",
    dateShort: "2 hours ago",
    note: "Dinner split",
    status: "success" as const,
    upiId: "rahul.sharma@hdfc",
    utr: "407812345678",
    bankRef: "HDFC24031200001",
    colorIndex: 1,
  },
  {
    id: 2,
    name: "Priya Patel",
    initials: "PP",
    amount: 1200,
    type: "received" as const,
    date: "Yesterday, 4:30 PM",
    dateShort: "Yesterday",
    note: "Rent share",
    status: "success" as const,
    upiId: "priya.patel@paytm",
    utr: "407812345679",
    bankRef: "SBI24031100001",
    colorIndex: 4,
  },
  {
    id: 3,
    name: "Electricity Bill",
    initials: "EB",
    amount: 847,
    type: "sent" as const,
    date: "Mar 10, 11:00 AM",
    dateShort: "2 days ago",
    note: "MSEDCL Bill Payment",
    status: "success" as const,
    upiId: "msedcl@billpay",
    utr: "407812345680",
    bankRef: "HDFC24031000001",
    colorIndex: 2,
  },
  {
    id: 4,
    name: "Amit Kumar",
    initials: "AK",
    amount: 250,
    type: "sent" as const,
    date: "Mar 9, 6:00 PM",
    dateShort: "3 days ago",
    note: "Coffee",
    status: "failed" as const,
    upiId: "amit.kumar@upi",
    utr: "407812345681",
    bankRef: "HDFC24030900001",
    colorIndex: 3,
  },
  {
    id: 5,
    name: "Neha Gupta",
    initials: "NG",
    amount: 3000,
    type: "received" as const,
    date: "Mar 7, 9:30 AM",
    dateShort: "5 days ago",
    note: "Freelance work",
    status: "success" as const,
    upiId: "neha.gupta@oksbi",
    utr: "407812345682",
    bankRef: "SBI24030700001",
    colorIndex: 5,
  },
  {
    id: 6,
    name: "Recharge — Jio",
    initials: "JI",
    amount: 299,
    type: "sent" as const,
    date: "Mar 5, 8:00 PM",
    dateShort: "1 week ago",
    note: "Mobile Recharge",
    status: "success" as const,
    upiId: "jio@airtel",
    utr: "407812345683",
    bankRef: "HDFC24030500001",
    colorIndex: 0,
  },
  {
    id: 7,
    name: "Jordan Williams",
    initials: "JW",
    amount: 750,
    type: "received" as const,
    date: "Mar 3, 2:00 PM",
    dateShort: "9 days ago",
    note: "Project payment",
    status: "pending" as const,
    upiId: "jordan.w@upi",
    utr: "407812345684",
    bankRef: "SBI24030300001",
    colorIndex: 3,
  },
  {
    id: 8,
    name: "Amazon Pay",
    initials: "AP",
    amount: 1599,
    type: "sent" as const,
    date: "Mar 1, 10:00 AM",
    dateShort: "11 days ago",
    note: "Online Shopping",
    status: "success" as const,
    upiId: "amazon@pay",
    utr: "407812345685",
    bankRef: "HDFC24030100001",
    colorIndex: 6,
  },
];

const PAY_CONTACTS = [
  { name: "Rahul", initials: "RS", upi: "rahul.sharma@hdfc", colorIndex: 1 },
  { name: "Priya", initials: "PP", upi: "priya.patel@paytm", colorIndex: 4 },
  { name: "Amit", initials: "AK", upi: "amit.kumar@upi", colorIndex: 3 },
  { name: "Neha", initials: "NG", upi: "neha.gupta@oksbi", colorIndex: 5 },
  { name: "Jordan", initials: "JW", upi: "jordan.w@upi", colorIndex: 2 },
  { name: "Alex", initials: "AT", upi: "alex.t@icici", colorIndex: 0 },
];

const OFFER_BANNERS = [
  {
    title: "Earn ₹50 Cashback",
    desc: "Pay any bill above ₹500",
    color: "from-[#1a73e8] to-[#0052cc]",
  },
  {
    title: "Free Recharge",
    desc: "Refer a friend, get ₹25",
    color: "from-[#128C7E] to-[#075E54]",
  },
];

// ─── Sub-components ─────────────────────────────────────────────────────────

function Avatar({
  initials,
  colorIndex,
  size = 10,
}: { initials: string; colorIndex: number; size?: number }) {
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${AVATAR_COLORS[colorIndex % AVATAR_COLORS.length]}`}
      style={{
        fontSize: size < 10 ? 11 : 14,
        width: size * 4,
        height: size * 4,
      }}
    >
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: "success" | "failed" | "pending" }) {
  if (status === "success")
    return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
  if (status === "pending")
    return <Clock className="w-3.5 h-3.5 text-yellow-500" />;
  return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
}

// ─── UPI PIN Modal ──────────────────────────────────────────────────────────

function UPIPinModal({
  bankMasked,
  onSuccess,
  onCancel,
}: {
  bankMasked: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleDigit = (d: string) => {
    if (pin.length >= 6) return;
    const next = pin + d;
    setPin(next);
    setError("");
    if (next.length === 6) {
      setTimeout(() => {
        if (next === "123456" || next === "111111") {
          onSuccess();
        } else {
          setError("Incorrect PIN. Please try again.");
          setPin("");
        }
      }, 300);
    }
  };

  const handleBackspace = () => setPin((p) => p.slice(0, -1));

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  return (
    <div
      className="absolute inset-0 z-[200] flex items-end"
      data-ocid="payments.pin.modal"
    >
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onCancel()}
        className="absolute inset-0 bg-black/70"
        onClick={onCancel}
      />
      <div className="relative w-full bg-card rounded-t-3xl pb-8 pt-6 px-6">
        <div className="w-12 h-1 bg-border rounded-full mx-auto mb-5" />
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-wa-green" />
          <p className="text-[13px] text-muted-foreground">
            Enter UPI PIN for SBI {bankMasked}
          </p>
        </div>
        <div className="flex justify-center gap-3 my-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={String(i)}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                i < pin.length
                  ? "bg-wa-green border-wa-green"
                  : "border-muted-foreground"
              }`}
            />
          ))}
        </div>
        {error && (
          <p className="text-center text-[12px] text-red-500 mb-3">{error}</p>
        )}
        <div className="grid grid-cols-3 gap-3">
          {digits.map((d, i) => (
            <button
              key={String(i)}
              type="button"
              data-ocid={`payments.pin.button.${i + 1}`}
              onClick={() =>
                d === "⌫" ? handleBackspace() : d ? handleDigit(d) : undefined
              }
              className={`h-14 rounded-2xl text-[22px] font-semibold transition-all active:scale-95 ${
                d === "⌫"
                  ? "bg-muted text-muted-foreground"
                  : d
                    ? "bg-muted hover:bg-muted/70 text-foreground"
                    : ""
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button
          type="button"
          data-ocid="payments.pin.cancel_button"
          onClick={onCancel}
          className="mt-4 w-full py-3 rounded-xl text-muted-foreground text-[15px] font-medium"
        >
          Cancel
        </button>
        <p className="text-center text-[11px] text-muted-foreground mt-2">
          Hint: use 123456
        </p>
      </div>
    </div>
  );
}

// ─── Transaction Detail Sheet ────────────────────────────────────────────────

function TransactionDetailSheet({
  tx,
  onClose,
}: {
  tx: (typeof TRANSACTIONS)[0];
  onClose: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-[100] flex items-end"
      data-ocid="payments.tx.sheet"
    >
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div className="relative w-full bg-card rounded-t-3xl p-6 max-h-[80%] overflow-y-auto">
        <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4" />
        <div className="flex items-center gap-3 mb-5">
          <Avatar initials={tx.initials} colorIndex={tx.colorIndex} size={12} />
          <div>
            <p className="font-bold text-[16px] text-foreground">{tx.name}</p>
            <p className="text-[12px] text-muted-foreground">{tx.upiId}</p>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <span
              className={`text-[20px] font-bold ${tx.type === "received" ? "text-green-500" : "text-red-500"}`}
            >
              {tx.type === "received" ? "+" : "-"}₹{tx.amount.toLocaleString()}
            </span>
            <div className="flex items-center gap-1">
              <StatusBadge status={tx.status} />
              <span className="text-[11px] text-muted-foreground capitalize">
                {tx.status}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-3 border border-border rounded-2xl p-4">
          {[
            { label: "Date & Time", value: tx.date },
            { label: "Note", value: tx.note },
            { label: "Transaction ID (UTR)", value: tx.utr },
            { label: "Bank Reference", value: tx.bankRef },
            { label: "Type", value: tx.type === "sent" ? "Debit" : "Credit" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-start justify-between gap-3"
            >
              <span className="text-[12px] text-muted-foreground flex-shrink-0">
                {row.label}
              </span>
              <span className="text-[13px] font-medium text-foreground text-right break-all">
                {row.value}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            data-ocid="payments.tx.share_button"
            onClick={() => {
              toast.success("Receipt shared!");
              onClose();
            }}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-muted text-foreground text-[14px] font-medium"
          >
            <Share2 className="w-4 h-4" /> Share Receipt
          </button>
          <button
            type="button"
            data-ocid="payments.tx.dispute_button"
            onClick={() => {
              toast.info("Dispute raised. We'll review within 48 hours.");
              onClose();
            }}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-500 text-[14px] font-medium"
          >
            <AlertCircle className="w-4 h-4" /> Raise Dispute
          </button>
        </div>
        <button
          type="button"
          data-ocid="payments.tx.close_button"
          onClick={onClose}
          className="mt-3 w-full py-3 rounded-xl bg-wa-green text-white font-semibold text-[15px]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Bank Account Management Sheet ──────────────────────────────────────────

function BankManagementSheet({ onClose }: { onClose: () => void }) {
  const [banks, setBanks] = useState(BANK_ACCOUNTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBank, setNewBank] = useState({ bank: "", account: "", ifsc: "" });
  const [removeConfirm, setRemoveConfirm] = useState<number | null>(null);

  const handleAdd = () => {
    if (!newBank.bank || !newBank.account || !newBank.ifsc) {
      toast.error("Please fill all fields");
      return;
    }
    setBanks((prev) => [
      ...prev,
      {
        id: Date.now(),
        bank: newBank.bank,
        masked: `XXXX${newBank.account.slice(-4)}`,
        upiId: `user@${newBank.bank.toLowerCase().replace(/\s/g, "").slice(0, 4)}`,
        primary: false,
        colorClass: "bg-[#6B7280]",
        initials: newBank.bank.slice(0, 3).toUpperCase(),
        ifsc: newBank.ifsc,
        balance: 0,
      },
    ]);
    setNewBank({ bank: "", account: "", ifsc: "" });
    setShowAddForm(false);
    toast.success("Bank account linked successfully!");
  };

  const handleSetPrimary = (id: number) => {
    setBanks((prev) => prev.map((b) => ({ ...b, primary: b.id === id })));
    toast.success("Primary account updated");
  };

  const handleRemove = (id: number) => {
    if (banks.length <= 1) {
      toast.error("Cannot remove the only bank account");
      return;
    }
    setBanks((prev) => prev.filter((b) => b.id !== id));
    setRemoveConfirm(null);
    toast.success("Bank account removed");
  };

  return (
    <div
      className="absolute inset-0 z-[100] flex items-end"
      data-ocid="payments.banks.sheet"
    >
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div className="relative w-full bg-card rounded-t-3xl p-5 max-h-[85%] overflow-y-auto">
        <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <p className="text-[17px] font-bold text-foreground">
            Linked Bank Accounts
          </p>
          <button
            type="button"
            data-ocid="payments.banks.close_button"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-3">
          {banks.map((bank, i) => (
            <div
              key={bank.id}
              data-ocid={`payments.banks.item.${i + 1}`}
              className="border border-border rounded-2xl p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl ${bank.colorClass} flex items-center justify-center text-white font-bold text-[12px] flex-shrink-0`}
                >
                  {bank.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[14px] text-foreground">
                      {bank.bank}
                    </p>
                    {bank.primary && (
                      <span className="text-[9px] bg-wa-green/20 text-wa-green font-bold px-1.5 py-0.5 rounded-full">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-muted-foreground">
                    Savings {bank.masked}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {bank.upiId}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid={`payments.banks.more.${i + 1}`}
                  onClick={() =>
                    setRemoveConfirm(removeConfirm === bank.id ? null : bank.id)
                  }
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              {removeConfirm === bank.id && (
                <div className="mt-3 flex gap-2 pt-3 border-t border-border">
                  {!bank.primary && (
                    <button
                      type="button"
                      data-ocid={`payments.banks.primary.${i + 1}`}
                      onClick={() => handleSetPrimary(bank.id)}
                      className="flex-1 py-2 rounded-xl bg-wa-green/10 text-wa-green text-[13px] font-medium"
                    >
                      Set Primary
                    </button>
                  )}
                  <button
                    type="button"
                    data-ocid={`payments.banks.delete_button.${i + 1}`}
                    onClick={() => handleRemove(bank.id)}
                    className="flex-1 py-2 rounded-xl bg-red-500/10 text-red-500 text-[13px] font-medium flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {showAddForm ? (
          <div className="mt-4 border border-border rounded-2xl p-4 space-y-3">
            <p className="font-semibold text-[14px] text-foreground">
              Add New Bank Account
            </p>
            <select
              data-ocid="payments.banks.bank_select"
              value={newBank.bank}
              onChange={(e) =>
                setNewBank((p) => ({ ...p, bank: e.target.value }))
              }
              className="w-full py-2.5 px-3 rounded-xl bg-muted text-foreground text-[14px] border border-border appearance-none"
            >
              <option value="">Select Bank</option>
              {[
                "Axis Bank",
                "ICICI Bank",
                "Kotak Bank",
                "Bank of Baroda",
                "Punjab National Bank",
                "Yes Bank",
              ].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <input
              data-ocid="payments.banks.account_input"
              type="text"
              placeholder="Account Number"
              maxLength={18}
              value={newBank.account}
              onChange={(e) =>
                setNewBank((p) => ({ ...p, account: e.target.value }))
              }
              className="w-full py-2.5 px-3 rounded-xl bg-muted text-foreground text-[14px] border border-border placeholder:text-muted-foreground"
            />
            <input
              data-ocid="payments.banks.ifsc_input"
              type="text"
              placeholder="IFSC Code"
              maxLength={11}
              value={newBank.ifsc}
              onChange={(e) =>
                setNewBank((p) => ({
                  ...p,
                  ifsc: e.target.value.toUpperCase(),
                }))
              }
              className="w-full py-2.5 px-3 rounded-xl bg-muted text-foreground text-[14px] border border-border placeholder:text-muted-foreground"
            />
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                data-ocid="payments.banks.add_cancel_button"
                onClick={() => setShowAddForm(false)}
                className="py-2.5 rounded-xl bg-muted text-muted-foreground text-[14px] font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="payments.banks.add_submit_button"
                onClick={handleAdd}
                className="py-2.5 rounded-xl bg-wa-green text-white text-[14px] font-semibold"
              >
                Link Account
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            data-ocid="payments.banks.add_button"
            onClick={() => setShowAddForm(true)}
            className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-border text-wa-green text-[14px] font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Bank Account
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Payment Settings Sheet ──────────────────────────────────────────────────

function PaymentSettingsSheet({ onClose }: { onClose: () => void }) {
  const [txNotifs, setTxNotifs] = useState(true);
  const [hideHistory, setHideHistory] = useState(false);
  const [autoPay, setAutoPay] = useState(true);

  return (
    <div
      className="absolute inset-0 z-[100] flex items-end"
      data-ocid="payments.settings.sheet"
    >
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div className="relative w-full bg-card rounded-t-3xl p-5 max-h-[85%] overflow-y-auto">
        <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-5">
          <p className="text-[17px] font-bold text-foreground">
            Payment Settings
          </p>
          <button
            type="button"
            data-ocid="payments.settings.close_button"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide px-1 mb-2">
            Security
          </p>
          <button
            type="button"
            data-ocid="payments.settings.change_pin_button"
            onClick={() => {
              toast.info("UPI PIN change initiated");
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <Lock className="w-5 h-5 text-wa-green" />
            <div className="flex-1 text-left">
              <p className="text-[14px] font-medium text-foreground">
                Change UPI PIN
              </p>
              <p className="text-[12px] text-muted-foreground">
                Update your 6-digit UPI PIN
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          <button
            type="button"
            data-ocid="payments.settings.limit_button"
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-muted/50"
          >
            <Shield className="w-5 h-5 text-blue-500" />
            <div className="flex-1 text-left">
              <p className="text-[14px] font-medium text-foreground">
                Transaction Limits
              </p>
              <p className="text-[12px] text-muted-foreground">
                ₹1,00,000 / day • ₹10,000 / transaction
              </p>
            </div>
          </button>
        </div>

        <div className="space-y-1 mt-4">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide px-1 mb-2">
            Preferences
          </p>
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-muted/50">
            <Zap className="w-5 h-5 text-yellow-500" />
            <div className="flex-1">
              <p className="text-[14px] font-medium text-foreground">
                Auto-pay Permissions
              </p>
              <p className="text-[12px] text-muted-foreground">
                2 active mandates
              </p>
            </div>
            <button
              type="button"
              data-ocid="payments.settings.autopay_toggle"
              onClick={() => setAutoPay((v) => !v)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${autoPay ? "bg-wa-green" : "bg-muted-foreground/30"}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${autoPay ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>

          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-muted/50">
            <MessageSquare className="w-5 h-5 text-wa-green" />
            <div className="flex-1">
              <p className="text-[14px] font-medium text-foreground">
                Payment Notifications
              </p>
              <p className="text-[12px] text-muted-foreground">
                Alerts for all transactions
              </p>
            </div>
            <button
              type="button"
              data-ocid="payments.settings.notif_toggle"
              onClick={() => setTxNotifs((v) => !v)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${txNotifs ? "bg-wa-green" : "bg-muted-foreground/30"}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${txNotifs ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>

          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-muted/50">
            <Eye className="w-5 h-5 text-purple-500" />
            <div className="flex-1">
              <p className="text-[14px] font-medium text-foreground">
                Hide Payment History
              </p>
              <p className="text-[12px] text-muted-foreground">
                Others can't see your transactions
              </p>
            </div>
            <button
              type="button"
              data-ocid="payments.settings.hide_toggle"
              onClick={() => setHideHistory((v) => !v)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${hideHistory ? "bg-wa-green" : "bg-muted-foreground/30"}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${hideHistory ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>
        </div>

        <div className="space-y-1 mt-4">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide px-1 mb-2">
            UPI IDs
          </p>
          {UPI_IDS.map((u, i) => (
            <div
              key={u.id}
              data-ocid={`payments.settings.upi.item.${i + 1}`}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-muted/50"
            >
              <Smartphone className="w-5 h-5 text-wa-green" />
              <p className="flex-1 text-[13px] font-medium text-foreground break-all">
                {u.upi}
              </p>
              {u.primary && (
                <span className="text-[9px] bg-wa-green/20 text-wa-green font-bold px-1.5 py-0.5 rounded-full">
                  PRIMARY
                </span>
              )}
              <button
                type="button"
                data-ocid={`payments.settings.upi.copy.${i + 1}`}
                onClick={() => {
                  navigator.clipboard?.writeText(u.upi).catch(() => {});
                  toast.success("UPI ID copied!");
                }}
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ))}
          <button
            type="button"
            data-ocid="payments.settings.add_upi_button"
            onClick={() => toast.info("Add UPI ID coming soon")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-dashed border-2 border-border text-wa-green text-[14px] font-medium mt-2"
          >
            <Plus className="w-4 h-4" /> Add UPI ID
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Home Tab ────────────────────────────────────────────────────────────────

function HomeTab({
  onSend,
  onReceive,
  onManageBanks,
  onTxClick,
}: {
  onSend: () => void;
  onReceive: () => void;
  onManageBanks: () => void;
  onTxClick: (tx: (typeof TRANSACTIONS)[0]) => void;
}) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const recentTx = TRANSACTIONS.slice(0, 5);

  return (
    <div
      className="flex-1 overflow-y-auto pb-24"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Balance Card */}
      <div
        className="mx-3 mt-4 rounded-2xl p-5 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #075E54 0%, #25D366 100%)",
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <p className="text-white/70 text-[12px] uppercase tracking-wide">
            WhatsApp Pay Balance
          </p>
          <button
            type="button"
            data-ocid="payments.balance.toggle"
            onClick={() => setBalanceVisible((v) => !v)}
            className="text-white/60"
          >
            {balanceVisible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-white text-[36px] font-bold leading-none">
          {balanceVisible ? "₹2,450.00" : "₹ ••••"}
        </p>
        <p className="text-white/60 text-[11px] mt-1">
          SBI ••••4521 • Primary Account
        </p>

        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            {
              label: "Send",
              icon: Send,
              action: onSend,
              ocid: "payments.home.send_button",
            },
            {
              label: "Receive",
              icon: ArrowDownLeft,
              action: onReceive,
              ocid: "payments.home.receive_button",
            },
            {
              label: "Contacts",
              icon: Wallet,
              action: onSend,
              ocid: "payments.home.contacts_button",
            },
            {
              label: "Scan QR",
              icon: QrCode,
              action: onReceive,
              ocid: "payments.home.scan_button",
            },
          ].map((btn) => (
            <button
              key={btn.label}
              type="button"
              data-ocid={btn.ocid}
              onClick={btn.action}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/15 hover:bg-white/25 transition-colors active:scale-95"
            >
              <btn.icon className="w-4 h-4 text-white" />
              <span className="text-[10px] text-white font-medium">
                {btn.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Offer Banner */}
      <div className="px-3 mt-3">
        <div
          className={`rounded-2xl p-4 bg-gradient-to-r ${OFFER_BANNERS[0].color} flex items-center gap-3`}
        >
          <Gift className="w-8 h-8 text-white flex-shrink-0" />
          <div>
            <p className="text-white font-bold text-[14px]">
              {OFFER_BANNERS[0].title}
            </p>
            <p className="text-white/80 text-[12px]">{OFFER_BANNERS[0].desc}</p>
          </div>
        </div>
      </div>

      {/* Pay Contacts */}
      <div className="mt-4 px-3">
        <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide px-1 mb-3">
          Pay Contacts
        </p>
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
          {PAY_CONTACTS.map((c, i) => (
            <button
              key={c.name}
              type="button"
              data-ocid={`payments.contact.button.${i + 1}`}
              className="flex flex-col items-center gap-1.5 flex-shrink-0"
            >
              <Avatar
                initials={c.initials}
                colorIndex={c.colorIndex}
                size={12}
              />
              <span className="text-[11px] text-foreground">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Linked Banks */}
      <div className="mx-3 mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
            Bank Accounts
          </p>
          <button
            type="button"
            data-ocid="payments.home.manage_banks_button"
            onClick={onManageBanks}
            className="text-[12px] text-wa-green font-semibold"
          >
            Manage
          </button>
        </div>
        {BANK_ACCOUNTS.map((bank, i) => (
          <div
            key={bank.id}
            data-ocid={`payments.home.bank.item.${i + 1}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border mb-2"
          >
            <div
              className={`w-9 h-9 rounded-lg ${bank.colorClass} flex items-center justify-center text-white font-bold text-[10px]`}
            >
              {bank.initials}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground">
                {bank.bank}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {bank.masked} • {bank.upiId}
              </p>
            </div>
            {bank.primary && (
              <span className="text-[9px] bg-wa-green/20 text-wa-green font-bold px-2 py-0.5 rounded-full">
                PRIMARY
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="mx-3 mt-3 mb-4">
        <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Recent Transactions
        </p>
        <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border/60">
          {recentTx.map((tx, i) => (
            <button
              key={tx.id}
              type="button"
              data-ocid={`payments.tx.item.${i + 1}`}
              onClick={() => onTxClick(tx)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors"
            >
              <Avatar
                initials={tx.initials}
                colorIndex={tx.colorIndex}
                size={10}
              />
              <div className="flex-1 min-w-0 text-left">
                <p className="font-semibold text-[13px] text-foreground truncate">
                  {tx.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {tx.dateShort}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`text-[14px] font-bold ${tx.type === "received" ? "text-green-500" : "text-red-500"}`}
                >
                  {tx.type === "received" ? "+" : "-"}₹
                  {tx.amount.toLocaleString()}
                </span>
                <StatusBadge status={tx.status} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Send Tab ────────────────────────────────────────────────────────────────

type SendStep = "form" | "pin" | "success" | "failure";

function SendTab() {
  const [step, setStep] = useState<SendStep>("form");
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<
    (typeof PAY_CONTACTS)[0] | null
  >(null);
  const [upiInput, setUpiInput] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const filtered = PAY_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.upi.includes(search),
  );

  const handleProceed = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!selectedContact && !upiInput) {
      toast.error("Select a contact or enter UPI ID");
      return;
    }
    setStep("pin");
  };

  const handlePinSuccess = () => {
    setStep(Math.random() > 0.2 ? "success" : "failure");
  };

  const handleReset = () => {
    setStep("form");
    setAmount("");
    setNote("");
    setSelectedContact(null);
    setUpiInput("");
    setSearch("");
  };

  if (step === "success") {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center gap-4 px-6 pb-24"
        data-ocid="payments.send.success_state"
      >
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <div className="text-center">
          <p className="text-[22px] font-bold text-foreground">
            Payment Successful!
          </p>
          <p className="text-[14px] text-muted-foreground mt-1">
            ₹{Number.parseFloat(amount).toLocaleString()} sent to{" "}
            {selectedContact?.name ?? upiInput}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            UTR: {Math.floor(Math.random() * 9e11 + 1e11)}
          </p>
        </div>
        <button
          type="button"
          data-ocid="payments.send.new_button"
          onClick={handleReset}
          className="mt-4 w-full max-w-xs py-3 rounded-xl bg-wa-green text-white font-semibold text-[15px]"
        >
          Send Another
        </button>
      </div>
    );
  }

  if (step === "failure") {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center gap-4 px-6 pb-24"
        data-ocid="payments.send.error_state"
      >
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <div className="text-center">
          <p className="text-[22px] font-bold text-foreground">
            Payment Failed
          </p>
          <p className="text-[14px] text-muted-foreground mt-1">
            Transaction could not be processed
          </p>
          <p className="text-[12px] text-muted-foreground mt-1">
            Please check your balance and try again
          </p>
        </div>
        <button
          type="button"
          data-ocid="payments.send.retry_button"
          onClick={() => setStep("form")}
          className="w-full max-w-xs py-3 rounded-xl bg-wa-green text-white font-semibold text-[15px] flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto pb-24 px-3 pt-3"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          data-ocid="payments.send.search_input"
          type="text"
          placeholder="Search contacts or UPI ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-[14px] text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Recent Contacts */}
      <div className="mb-4">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Recent Contacts
        </p>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {filtered.map((c, i) => (
            <button
              key={c.name}
              type="button"
              data-ocid={`payments.send.contact.${i + 1}`}
              onClick={() => {
                setSelectedContact(c);
                setUpiInput(c.upi);
              }}
              className={`flex flex-col items-center gap-1.5 flex-shrink-0 p-2 rounded-xl transition-colors ${selectedContact?.name === c.name ? "bg-wa-green/10 ring-2 ring-wa-green" : ""}`}
            >
              <Avatar
                initials={c.initials}
                colorIndex={c.colorIndex}
                size={11}
              />
              <span className="text-[10px] text-foreground w-12 text-center truncate">
                {c.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* UPI Input */}
      <div className="space-y-3">
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            UPI ID / Phone
          </p>
          <input
            data-ocid="payments.send.upi_input"
            type="text"
            placeholder="e.g. name@upi or 9876543210"
            value={upiInput}
            onChange={(e) => {
              setUpiInput(e.target.value);
              setSelectedContact(null);
            }}
            className="w-full py-3 px-4 rounded-xl bg-muted border border-border text-[14px] text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            Amount (₹)
          </p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-bold text-[18px]">
              ₹
            </span>
            <input
              data-ocid="payments.send.amount_input"
              type="number"
              placeholder="0"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 rounded-xl bg-muted border border-border text-[22px] font-bold text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            Add Note (optional)
          </p>
          <input
            data-ocid="payments.send.note_input"
            type="text"
            placeholder="What's this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full py-3 px-4 rounded-xl bg-muted border border-border text-[14px] text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <button
          type="button"
          data-ocid="payments.send.proceed_button"
          onClick={handleProceed}
          className="w-full py-4 rounded-xl bg-wa-green text-white font-bold text-[15px] mt-2 active:scale-[0.98] transition-transform"
        >
          Proceed to Pay
        </button>
      </div>

      {/* PIN Modal overlay inside this container */}
      {step === "pin" && (
        <UPIPinModal
          bankMasked="XXXX4521"
          onSuccess={handlePinSuccess}
          onCancel={() => setStep("form")}
        />
      )}
    </div>
  );
}

// ─── Receive Tab ─────────────────────────────────────────────────────────────

function ReceiveTab() {
  const [requestAmount, setRequestAmount] = useState("");
  const [requestMsg, setRequestMsg] = useState("");
  const primaryUpi = UPI_IDS.find((u) => u.primary)?.upi ?? UPI_IDS[0].upi;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(primaryUpi).catch(() => {});
    toast.success("UPI ID copied!");
  };

  const handleShareQr = () => toast.success("QR code shared!");

  const handleRequestMoney = () => {
    if (!requestAmount) {
      toast.error("Enter an amount to request");
      return;
    }
    toast.success(`Payment request of ₹${requestAmount} sent!`);
    setRequestAmount("");
    setRequestMsg("");
  };

  return (
    <div
      className="flex-1 overflow-y-auto pb-24 px-4 pt-4"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* QR Code */}
      <div className="flex flex-col items-center">
        <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Your QR Code
        </p>
        <div className="bg-white p-5 rounded-3xl shadow-xl border border-border">
          {/* Styled QR placeholder */}
          <div className="relative w-44 h-44">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#075E54] rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#075E54] rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#075E54] rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#075E54] rounded-br-lg" />
            {/* QR pattern simulation */}
            <div className="absolute inset-3 grid grid-cols-8 gap-0.5">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={String(i)}
                  className={`rounded-[1px] ${
                    [
                      0, 1, 7, 8, 2, 9, 16, 17, 14, 15, 56, 57, 63, 62, 48, 49,
                      6, 13, 3, 4, 5, 32, 33, 34, 22, 21, 20, 45, 44, 43, 28,
                      35, 41, 27,
                    ].includes(i)
                      ? "bg-gray-900"
                      : "bg-transparent"
                  }`}
                />
              ))}
            </div>
            {/* Center WA logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-9 h-9 bg-white rounded-full border-2 border-[#075E54] flex items-center justify-center">
                <span className="text-[#075E54] font-black text-[13px]">W</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[13px] font-medium text-foreground">
          {primaryUpi}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Scan to pay me on WhatsApp Pay
        </p>

        <div className="flex gap-3 mt-4 w-full">
          <button
            type="button"
            data-ocid="payments.receive.copy_button"
            onClick={handleCopyUpi}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-muted border border-border text-foreground text-[13px] font-semibold"
          >
            <Copy className="w-4 h-4" /> Copy UPI ID
          </button>
          <button
            type="button"
            data-ocid="payments.receive.share_button"
            onClick={handleShareQr}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-wa-green text-white text-[13px] font-semibold"
          >
            <Share2 className="w-4 h-4" /> Share QR
          </button>
        </div>
      </div>

      {/* Request Money */}
      <div className="mt-6 border border-border rounded-2xl p-4">
        <p className="text-[14px] font-bold text-foreground mb-3">
          Request Money
        </p>
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground font-bold">
            ₹
          </span>
          <input
            data-ocid="payments.receive.amount_input"
            type="number"
            placeholder="Amount"
            value={requestAmount}
            onChange={(e) => setRequestAmount(e.target.value)}
            className="w-full pl-7 pr-4 py-3 rounded-xl bg-muted border border-border text-[18px] font-bold text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <input
          data-ocid="payments.receive.message_input"
          type="text"
          placeholder="Add a message (optional)"
          value={requestMsg}
          onChange={(e) => setRequestMsg(e.target.value)}
          className="w-full py-3 px-4 rounded-xl bg-muted border border-border text-[14px] text-foreground placeholder:text-muted-foreground mb-3"
        />
        <button
          type="button"
          data-ocid="payments.receive.request_button"
          onClick={handleRequestMoney}
          className="w-full py-3 rounded-xl bg-wa-green text-white font-semibold text-[14px]"
        >
          Send Payment Request
        </button>
      </div>
    </div>
  );
}

// ─── History Tab ─────────────────────────────────────────────────────────────

type TxFilter = "all" | "sent" | "received" | "pending" | "failed";

function HistoryTab({
  onTxClick,
}: { onTxClick: (tx: (typeof TRANSACTIONS)[0]) => void }) {
  const [filter, setFilter] = useState<TxFilter>("all");

  const filtered = TRANSACTIONS.filter((tx) => {
    if (filter === "all") return true;
    if (filter === "sent") return tx.type === "sent" && tx.status !== "failed";
    if (filter === "received") return tx.type === "received";
    if (filter === "pending") return tx.status === "pending";
    if (filter === "failed") return tx.status === "failed";
    return true;
  });

  const FILTERS: { id: TxFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "sent", label: "Sent" },
    { id: "received", label: "Received" },
    { id: "pending", label: "Pending" },
    { id: "failed", label: "Failed" },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Filter Tabs */}
      <div className="flex gap-2 px-3 py-3 overflow-x-auto scrollbar-hide flex-shrink-0">
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0 self-center" />
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            data-ocid={`payments.history.${f.id}.tab`}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex-shrink-0 transition-colors ${
              filter === f.id
                ? "bg-wa-green text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div
        className="flex-1 overflow-y-auto px-3 pb-24"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-40 gap-2"
            data-ocid="payments.history.empty_state"
          >
            <History className="w-10 h-10 text-muted-foreground" />
            <p className="text-[14px] text-muted-foreground">
              No transactions found
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border/60">
            {filtered.map((tx, i) => (
              <button
                key={tx.id}
                type="button"
                data-ocid={`payments.history.tx.item.${i + 1}`}
                onClick={() => onTxClick(tx)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <Avatar
                    initials={tx.initials}
                    colorIndex={tx.colorIndex}
                    size={10}
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-card border border-border flex items-center justify-center">
                    {tx.type === "sent" ? (
                      <ArrowUpRight className="w-2.5 h-2.5 text-red-500" />
                    ) : (
                      <ArrowDownLeft className="w-2.5 h-2.5 text-green-500" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-[13px] text-foreground truncate">
                    {tx.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {tx.note} • {tx.dateShort}
                  </p>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span
                    className={`text-[14px] font-bold ${tx.type === "received" ? "text-green-500" : tx.status === "failed" ? "text-red-400" : "text-foreground"}`}
                  >
                    {tx.type === "received" ? "+" : "-"}₹
                    {tx.amount.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <StatusBadge status={tx.status} />
                    <span
                      className={`text-[10px] font-medium capitalize ${tx.status === "success" ? "text-green-500" : tx.status === "pending" ? "text-yellow-500" : "text-red-500"}`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Scheduled Payments Tab ──────────────────────────────────────────────────

interface ScheduledPayment {
  id: number;
  name: string;
  initials: string;
  colorIndex: number;
  amount: number;
  note: string;
  date: string;
  time: string;
  upiId: string;
  recurring: "once" | "weekly" | "monthly";
}

const SCHEDULED_PAYMENTS: ScheduledPayment[] = [
  {
    id: 1,
    name: "Priya Patel",
    initials: "PP",
    colorIndex: 4,
    amount: 2500,
    note: "Monthly rent",
    date: "2026-03-20",
    time: "10:00",
    upiId: "priya.patel@oksbi",
    recurring: "monthly",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    initials: "RS",
    colorIndex: 1,
    amount: 150,
    note: "Netflix split",
    date: "2026-03-15",
    time: "09:00",
    upiId: "rahul.sharma@hdfc",
    recurring: "monthly",
  },
  {
    id: 3,
    name: "Sunita Verma",
    initials: "SV",
    colorIndex: 2,
    amount: 500,
    note: "Office lunch fund",
    date: "2026-03-14",
    time: "13:00",
    upiId: "sunita.v@ybl",
    recurring: "weekly",
  },
];

function ScheduledTab() {
  const [payments, setPayments] =
    useState<ScheduledPayment[]>(SCHEDULED_PAYMENTS);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [editTarget, setEditTarget] = useState<ScheduledPayment | null>(null);
  const [addAmount, setAddAmount] = useState("");
  const [addName, setAddName] = useState("");
  const [addNote, setAddNote] = useState("");
  const [addDate, setAddDate] = useState("");
  const [addTime, setAddTime] = useState("");
  const [addRecurring, setAddRecurring] = useState<
    "once" | "weekly" | "monthly"
  >("once");

  const handleCancel = (id: number) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
    toast.success("Scheduled payment cancelled", { position: "top-center" });
  };

  const handleSave = () => {
    if (!addAmount || !addName || !addDate || !addTime) {
      toast.error("Fill in all required fields", { position: "top-center" });
      return;
    }
    if (editTarget) {
      setPayments((prev) =>
        prev.map((p) =>
          p.id === editTarget.id
            ? {
                ...p,
                amount: Number(addAmount),
                note: addNote,
                date: addDate,
                time: addTime,
                recurring: addRecurring,
                name: addName,
              }
            : p,
        ),
      );
      toast.success("Payment updated", { position: "top-center" });
    } else {
      const newPay: ScheduledPayment = {
        id: Date.now(),
        name: addName,
        initials: addName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
        colorIndex: Math.floor(Math.random() * 8),
        amount: Number(addAmount),
        note: addNote,
        date: addDate,
        time: addTime,
        upiId: `${addName.toLowerCase().replace(/\s/g, ".")}@upi`,
        recurring: addRecurring,
      };
      setPayments((prev) => [newPay, ...prev]);
      toast.success("Payment scheduled!", { position: "top-center" });
    }
    setShowAddSheet(false);
    setAddAmount("");
    setAddName("");
    setAddNote("");
    setAddDate("");
    setAddTime("");
    setAddRecurring("once");
    setEditTarget(null);
  };

  const openEdit = (p: ScheduledPayment) => {
    setEditTarget(p);
    setAddAmount(String(p.amount));
    setAddName(p.name);
    setAddNote(p.note);
    setAddDate(p.date);
    setAddTime(p.time);
    setAddRecurring(p.recurring);
    setShowAddSheet(true);
  };

  const recurringLabel = {
    once: "One-time",
    weekly: "Weekly",
    monthly: "Monthly",
  };

  return (
    <div
      className="flex-1 overflow-y-auto pb-24"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Header row */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div>
          <p className="text-[17px] font-bold text-foreground">
            Scheduled Payments
          </p>
          <p className="text-[12px] text-muted-foreground">
            {payments.length} upcoming
          </p>
        </div>
        <button
          type="button"
          data-ocid="payments.scheduled.add.button"
          onClick={() => {
            setEditTarget(null);
            setAddAmount("");
            setAddName("");
            setAddNote("");
            setAddDate("");
            setAddTime("");
            setAddRecurring("once");
            setShowAddSheet(true);
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-wa-green rounded-xl text-white text-[13px] font-semibold"
        >
          <Plus className="w-4 h-4" />
          Schedule
        </button>
      </div>

      {payments.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-3 py-16 px-8"
          data-ocid="payments.scheduled.empty_state"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <CalendarClock className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-[15px] font-semibold text-foreground">
            No scheduled payments
          </p>
          <p className="text-[13px] text-muted-foreground text-center">
            Schedule a payment to send money automatically on a future date
          </p>
        </div>
      ) : (
        <div className="px-3 space-y-3">
          {payments.map((p, idx) => (
            <div
              key={p.id}
              data-ocid={`payments.scheduled.item.${idx + 1}`}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              <div className="px-4 py-3 flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full ${AVATAR_COLORS[p.colorIndex % AVATAR_COLORS.length]} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white text-[13px] font-bold">
                    {p.initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-foreground">
                    {p.name}
                  </p>
                  <p className="text-[12px] text-muted-foreground truncate">
                    {p.upiId}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[17px] font-black text-foreground">
                    ₹{p.amount.toLocaleString()}
                  </p>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${p.recurring === "once" ? "bg-muted text-muted-foreground" : "bg-wa-green/20 text-wa-green"}`}
                  >
                    {recurringLabel[p.recurring]}
                  </span>
                </div>
              </div>

              <div className="px-4 pb-3 flex items-center gap-2">
                <CalendarClock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-[12px] text-muted-foreground flex-1">
                  {new Date(p.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  at {p.time}
                </span>
              </div>

              {p.note && (
                <div className="px-4 pb-3">
                  <p className="text-[12px] text-muted-foreground italic">
                    "{p.note}"
                  </p>
                </div>
              )}

              <div className="flex border-t border-border">
                <button
                  type="button"
                  data-ocid={`payments.scheduled.edit.button.${idx + 1}`}
                  onClick={() => openEdit(p)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <div className="w-px bg-border" />
                <button
                  type="button"
                  data-ocid={`payments.scheduled.cancel.button.${idx + 1}`}
                  onClick={() => handleCancel(p.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Sheet */}
      {showAddSheet && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowAddSheet(false)}
            onKeyDown={(e) => e.key === "Escape" && setShowAddSheet(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close"
          />
          <div
            data-ocid="payments.scheduled.sheet"
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-2xl px-5 pb-8 pt-4 max-h-[90vh] overflow-y-auto"
            style={{ maxWidth: "390px", margin: "0 auto" }}
          >
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
            <p className="text-[17px] font-bold text-foreground mb-5">
              {editTarget ? "Edit Scheduled Payment" : "Schedule a Payment"}
            </p>

            <div className="space-y-3">
              <div>
                <p className="text-[12px] text-muted-foreground font-medium mb-1 block">
                  Recipient Name *
                </p>
                <input
                  data-ocid="payments.scheduled.name.input"
                  type="text"
                  placeholder="Enter name"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-[14px] text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <p className="text-[12px] text-muted-foreground font-medium mb-1 block">
                  Amount (₹) *
                </p>
                <input
                  data-ocid="payments.scheduled.amount.input"
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-[14px] text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="text-[12px] text-muted-foreground font-medium mb-1 block">
                    Date *
                  </p>
                  <input
                    data-ocid="payments.scheduled.date.input"
                    type="date"
                    value={addDate}
                    onChange={(e) => setAddDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-[14px] text-foreground"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[12px] text-muted-foreground font-medium mb-1 block">
                    Time *
                  </p>
                  <input
                    data-ocid="payments.scheduled.time.input"
                    type="time"
                    value={addTime}
                    onChange={(e) => setAddTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-[14px] text-foreground"
                  />
                </div>
              </div>
              <div>
                <p className="text-[12px] text-muted-foreground font-medium mb-1 block">
                  Note (optional)
                </p>
                <input
                  data-ocid="payments.scheduled.note.input"
                  type="text"
                  placeholder="Add a note"
                  value={addNote}
                  onChange={(e) => setAddNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-[14px] text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <p className="text-[12px] text-muted-foreground font-medium mb-1 block">
                  Repeat
                </p>
                <div className="flex gap-2">
                  {(["once", "weekly", "monthly"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      data-ocid="payments.scheduled.recurring.toggle"
                      onClick={() => setAddRecurring(r)}
                      className={`flex-1 py-2 rounded-xl text-[13px] font-semibold transition-colors ${addRecurring === r ? "bg-wa-green text-white" : "bg-muted text-foreground"}`}
                    >
                      {r === "once"
                        ? "Once"
                        : r === "weekly"
                          ? "Weekly"
                          : "Monthly"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              data-ocid="payments.scheduled.save.button"
              onClick={handleSave}
              className="mt-5 w-full py-3.5 rounded-2xl bg-wa-green text-white font-bold text-[15px]"
            >
              {editTarget ? "Save Changes" : "Schedule Payment"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main PaymentsScreen ─────────────────────────────────────────────────────

type PayTab = "home" | "send" | "receive" | "history" | "scheduled";

const PAY_TABS: {
  id: PayTab;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "send", label: "Send", icon: Send },
  { id: "receive", label: "Receive", icon: ArrowDownLeft },
  { id: "history", label: "History", icon: History },
  { id: "scheduled", label: "Scheduled", icon: CalendarClock },
];

export default function PaymentsScreen() {
  const [payTab, setPayTab] = useState<PayTab>("home");
  const [showBanks, setShowBanks] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTx, setSelectedTx] = useState<(typeof TRANSACTIONS)[0] | null>(
    null,
  );

  const handleTxClick = (tx: (typeof TRANSACTIONS)[0]) => setSelectedTx(tx);

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex-shrink-0"
        style={{
          background: "linear-gradient(180deg, #075E54 0%, #128C7E 100%)",
          paddingTop: "max(env(safe-area-inset-top, 0px), 44px)",
          paddingBottom: "12px",
        }}
      >
        <div className="px-4 flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-white" />
          <h1 className="text-white text-[19px] font-bold flex-1">Payments</h1>
          <div className="flex items-center gap-1">
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
              Secured by NPCI
            </span>
            <button
              type="button"
              data-ocid="payments.header.settings_button"
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full hover:bg-white/10 text-white"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Internal Tab Bar */}
      <div className="flex border-b border-border bg-card flex-shrink-0">
        {PAY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = payTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-ocid={`payments.${tab.id}.tab`}
              onClick={() => setPayTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors ${isActive ? "text-wa-green border-b-2 border-wa-green" : "text-muted-foreground"}`}
            >
              <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold tracking-wide">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {payTab === "home" && (
          <HomeTab
            onSend={() => setPayTab("send")}
            onReceive={() => setPayTab("receive")}
            onManageBanks={() => setShowBanks(true)}
            onTxClick={handleTxClick}
          />
        )}
        {payTab === "send" && <SendTab />}
        {payTab === "receive" && <ReceiveTab />}
        {payTab === "history" && <HistoryTab onTxClick={handleTxClick} />}
        {payTab === "scheduled" && <ScheduledTab />}
      </div>

      {/* Modals / Sheets */}
      {showBanks && <BankManagementSheet onClose={() => setShowBanks(false)} />}
      {showSettings && (
        <PaymentSettingsSheet onClose={() => setShowSettings(false)} />
      )}
      {selectedTx && (
        <TransactionDetailSheet
          tx={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
}
