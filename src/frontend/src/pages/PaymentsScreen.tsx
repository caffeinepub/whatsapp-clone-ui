import {
  ArrowDownLeft,
  ArrowUpRight,
  BanknoteIcon,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  QrCode,
  Send,
  Smartphone,
} from "lucide-react";
import { useState } from "react";

const TRANSACTIONS = [
  {
    id: 1,
    name: "Emma Rodriguez",
    initials: "ER",
    amount: 500,
    type: "sent" as const,
    date: "Today, 10:42 AM",
    note: "Dinner split",
    status: "completed",
    colorIndex: 0,
  },
  {
    id: 2,
    name: "Marcus Chen",
    initials: "MC",
    amount: 1200,
    type: "received" as const,
    date: "Yesterday, 3:15 PM",
    note: "Rent share",
    status: "completed",
    colorIndex: 1,
  },
  {
    id: 3,
    name: "Priya Sharma",
    initials: "PS",
    amount: 350,
    type: "sent" as const,
    date: "Mon, 11:00 AM",
    note: "Movie tickets",
    status: "completed",
    colorIndex: 4,
  },
  {
    id: 4,
    name: "Jordan Williams",
    initials: "JW",
    amount: 750,
    type: "received" as const,
    date: "Sun, 6:30 PM",
    note: "Project payment",
    status: "pending",
    colorIndex: 3,
  },
  {
    id: 5,
    name: "Sarah & Mike",
    initials: "SM",
    amount: 200,
    type: "sent" as const,
    date: "Fri, 2:00 PM",
    note: "Gift contribution",
    status: "completed",
    colorIndex: 5,
  },
  {
    id: 6,
    name: "Alex Thompson",
    initials: "AT",
    amount: 890,
    type: "received" as const,
    date: "Thu, 9:00 AM",
    note: "Grocery split",
    status: "completed",
    colorIndex: 2,
  },
  {
    id: 7,
    name: "Neha Gupta",
    initials: "NG",
    amount: 1500,
    type: "sent" as const,
    date: "Wed, 4:20 PM",
    note: "Concert tickets",
    status: "completed",
    colorIndex: 0,
  },
  {
    id: 8,
    name: "Raj Patel",
    initials: "RP",
    amount: 300,
    type: "received" as const,
    date: "Tue, 1:45 PM",
    note: "Lunch",
    status: "failed",
    colorIndex: 1,
  },
  {
    id: 9,
    name: "Lisa Wang",
    initials: "LW",
    amount: 2200,
    type: "sent" as const,
    date: "Last Mon",
    note: "Salary advance",
    status: "completed",
    colorIndex: 3,
  },
  {
    id: 10,
    name: "David Kim",
    initials: "DK",
    amount: 450,
    type: "received" as const,
    date: "Last Sun",
    note: "Book club fees",
    status: "completed",
    colorIndex: 4,
  },
];

const PAY_CONTACTS = [
  { name: "Emma", initials: "ER", colorIndex: 0 },
  { name: "Marcus", initials: "MC", colorIndex: 1 },
  { name: "Priya", initials: "PS", colorIndex: 4 },
  { name: "Jordan", initials: "JW", colorIndex: 3 },
  { name: "Alex", initials: "AT", colorIndex: 2 },
  { name: "Neha", initials: "NG", colorIndex: 5 },
];

const AVATAR_COLORS = [
  "bg-[#F44336]",
  "bg-[#2196F3]",
  "bg-[#4CAF50]",
  "bg-[#FF9800]",
  "bg-[#9C27B0]",
  "bg-[#00BCD4]",
];

const QR_CELLS = Array.from({ length: 49 }, (_, i) => String(i));

export default function PaymentsScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [showSend, setShowSend] = useState(false);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex-shrink-0"
        style={{
          background: "#128C7E",
          paddingTop: "max(env(safe-area-inset-top, 0px), 44px)",
          paddingBottom: "16px",
        }}
      >
        <div className="px-4 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-white" />
          <h1 className="text-white text-[20px] font-bold">Payments</h1>
        </div>
      </header>

      <main
        className="flex-1 overflow-y-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Balance card */}
        <div
          className="mx-3 mt-4 rounded-2xl p-5 shadow-md"
          style={{
            background: "linear-gradient(135deg, #075E54 0%, #128C7E 100%)",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-white/70 text-[13px]">Available Balance</p>
            <button
              type="button"
              data-ocid="payments.balance.toggle"
              onClick={() => setBalanceVisible((v) => !v)}
              className="text-white/60 hover:text-white"
            >
              {balanceVisible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-white text-[36px] font-bold leading-tight">
            {balanceVisible ? "₹2,450.00" : "₹ ••••"}
          </p>
          <p className="text-white/60 text-[12px] mt-1">
            WhatsApp Pay • HDFC Bank ••••4521
          </p>

          <div className="flex gap-3 mt-5">
            <button
              type="button"
              data-ocid="payments.send.button"
              onClick={() => setShowSend(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 text-white text-[14px] font-semibold hover:bg-white/30 transition-colors active:scale-95"
            >
              <ArrowUpRight className="w-4 h-4" />
              Send Money
            </button>
            <button
              type="button"
              data-ocid="payments.receive.button"
              onClick={() => setShowQR(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 text-white text-[14px] font-semibold hover:bg-white/30 transition-colors active:scale-95"
            >
              <ArrowDownLeft className="w-4 h-4" />
              Receive
            </button>
          </div>
        </div>

        {/* UPI ID */}
        <div className="mx-3 mt-3 bg-card border border-border rounded-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground">UPI ID</p>
            <p className="text-[14px] font-semibold text-foreground">
              user@waypay
            </p>
          </div>
          <button
            type="button"
            data-ocid="payments.upi.button"
            className="text-wa-green text-[13px] font-semibold"
          >
            Copy
          </button>
        </div>

        {/* Pay Contacts row */}
        <div className="mt-4 px-3">
          <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide px-1 mb-3">
            Pay Contacts
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {PAY_CONTACTS.map((c, i) => (
              <button
                key={c.name}
                type="button"
                data-ocid={`payments.contact.button.${i + 1}`}
                className="flex flex-col items-center gap-1.5 flex-shrink-0"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-[14px] font-bold ${AVATAR_COLORS[c.colorIndex % AVATAR_COLORS.length]}`}
                >
                  {c.initials}
                </div>
                <span className="text-[11px] text-foreground">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-3 mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Self Transfer", icon: Send },
            { label: "Scan QR", icon: QrCode },
            { label: "UPI ID", icon: Smartphone },
            { label: "Bank Acc.", icon: BanknoteIcon },
          ].map((action, i) => (
            <button
              key={action.label}
              type="button"
              data-ocid={`payments.quick.button.${i + 1}`}
              className="flex flex-col items-center gap-2 py-3 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-wa-green/10 flex items-center justify-center">
                <action.icon className="w-4 h-4 text-wa-green" />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium text-center">
                {action.label}
              </span>
            </button>
          ))}
        </div>

        {/* Bank account */}
        <div className="mx-3 mt-4 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <BanknoteIcon className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-foreground">
                HDFC Bank
              </p>
              <p className="text-[12px] text-muted-foreground">
                Savings •••• 4521 • Primary
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Transactions */}
        <div className="mt-5 px-3 pb-8">
          <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide px-1 mb-3">
            Recent Transactions
          </p>
          <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border/60">
            {TRANSACTIONS.map((tx, i) => (
              <div
                key={tx.id}
                data-ocid={`payments.tx.item.${i + 1}`}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0 ${AVATAR_COLORS[tx.colorIndex % AVATAR_COLORS.length]}`}
                >
                  {tx.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] text-foreground truncate">
                    {tx.name}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {tx.note} • {tx.date}
                  </p>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span
                    className={`text-[14px] font-bold ${tx.type === "received" ? "text-green-500" : "text-foreground"}`}
                  >
                    {tx.type === "received" ? "+" : "-"}₹
                    {tx.amount.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {tx.status === "completed" ? (
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    ) : tx.status === "pending" ? (
                      <span className="text-[9px] text-yellow-500 font-semibold">
                        PENDING
                      </span>
                    ) : (
                      <span className="text-[9px] text-red-500 font-semibold">
                        FAILED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Receive QR Sheet */}
      {showQR && (
        <div
          className="absolute inset-0 z-50 bg-black/60 flex items-end"
          data-ocid="payments.qr.modal"
        >
          <div className="w-full bg-card rounded-t-3xl p-6 flex flex-col items-center gap-4">
            <div className="w-12 h-1 bg-border rounded-full mb-2" />
            <p className="text-[17px] font-bold text-foreground">
              Receive Money
            </p>
            <div className="bg-white p-4 rounded-2xl shadow-md">
              <div className="w-40 h-40 grid grid-cols-7 gap-0.5">
                {QR_CELLS.map((cell, idx) => (
                  <div
                    key={cell}
                    className={`rounded-sm ${idx % 3 === 0 || idx % 7 === 2 ? "bg-gray-900" : "bg-transparent"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-[13px] text-muted-foreground">
              UPI ID: user@waypay
            </p>
            <button
              type="button"
              data-ocid="payments.qr.close_button"
              onClick={() => setShowQR(false)}
              className="w-full py-3 rounded-xl bg-wa-green text-white font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Send Money Sheet */}
      {showSend && (
        <div
          className="absolute inset-0 z-50 bg-black/60 flex items-end"
          data-ocid="payments.send.modal"
        >
          <div className="w-full bg-card rounded-t-3xl p-6">
            <div className="w-12 h-1 bg-border rounded-full mb-4 mx-auto" />
            <p className="text-[17px] font-bold text-foreground mb-4">
              Send Money
            </p>
            <div className="flex gap-4 overflow-x-auto pb-3">
              {PAY_CONTACTS.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  data-ocid={`payments.send.contact.${i + 1}`}
                  onClick={() => setShowSend(false)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-[14px] font-bold ${AVATAR_COLORS[c.colorIndex % AVATAR_COLORS.length]}`}
                  >
                    {c.initials}
                  </div>
                  <span className="text-[11px] text-foreground">{c.name}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              data-ocid="payments.send.close_button"
              onClick={() => setShowSend(false)}
              className="w-full py-3 rounded-xl bg-muted text-foreground font-semibold mt-3"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
