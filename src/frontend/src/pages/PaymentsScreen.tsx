import { ArrowDownLeft, ArrowUpRight, CreditCard, Send } from "lucide-react";

const TRANSACTIONS = [
  {
    id: 1,
    name: "Emma Rodriguez",
    initials: "ER",
    amount: 500,
    type: "sent" as const,
    date: "Today, 10:42 AM",
    note: "Dinner split",
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
    colorIndex: 5,
  },
];

const AVATAR_COLORS = [
  "bg-[#F44336]",
  "bg-[#2196F3]",
  "bg-[#4CAF50]",
  "bg-[#FF9800]",
  "bg-[#9C27B0]",
  "bg-[#00BCD4]",
];

interface PaymentsScreenProps {
  onBack?: () => void;
}

export default function PaymentsScreen({
  onBack: _onBack,
}: PaymentsScreenProps) {
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
          <p className="text-white/70 text-[13px] mb-1">Available Balance</p>
          <p className="text-white text-[36px] font-bold leading-tight">
            ₹2,450.00
          </p>
          <p className="text-white/60 text-[12px] mt-1">
            WhatsApp Pay • HDFC Bank ••••4521
          </p>

          <div className="flex gap-3 mt-5">
            <button
              type="button"
              data-ocid="payments.send.button"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 text-white text-[14px] font-semibold hover:bg-white/30 transition-colors active:scale-95"
            >
              <ArrowUpRight className="w-4 h-4" />
              Send Money
            </button>
            <button
              type="button"
              data-ocid="payments.receive.button"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 text-white text-[14px] font-semibold hover:bg-white/30 transition-colors active:scale-95"
            >
              <ArrowDownLeft className="w-4 h-4" />
              Receive
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-3 mt-4 grid grid-cols-4 gap-2">
          {["Self Transfer", "Scan QR", "UPI ID", "Bank Acc."].map(
            (action, i) => (
              <button
                key={action}
                type="button"
                data-ocid={`payments.quick.button.${i + 1}`}
                className="flex flex-col items-center gap-2 py-3 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-wa-green/10 flex items-center justify-center">
                  <Send className="w-4 h-4 text-wa-green" />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium text-center">
                  {action}
                </span>
              </button>
            ),
          )}
        </div>

        {/* Transactions */}
        <div className="mt-5 px-3 pb-6">
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
                    className={`text-[14px] font-bold ${
                      tx.type === "received"
                        ? "text-green-500"
                        : "text-foreground"
                    }`}
                  >
                    {tx.type === "received" ? "+" : "-"}₹
                    {tx.amount.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {tx.type === "received" ? (
                      <ArrowDownLeft className="w-3 h-3 text-green-500" />
                    ) : (
                      <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                    )}
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {tx.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
