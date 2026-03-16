import {
  ArrowDownLeft,
  ArrowLeft,
  Bitcoin,
  Copy,
  History,
  LayoutDashboard,
  Send,
  Share2,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CryptoWalletScreenProps {
  onBack: () => void;
}

const COINS = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    balance: "0.04521",
    usd: "2,847.32",
    change: "+3.42",
    positive: true,
    color: "#F7931A",
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    balance: "1.2840",
    usd: "3,124.18",
    change: "+1.87",
    positive: true,
    color: "#627EEA",
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    balance: "540.00",
    usd: "540.00",
    change: "+0.01",
    positive: true,
    color: "#26A17B",
  },
];

const HISTORY_TXS = [
  {
    id: 1,
    type: "received",
    coin: "BTC",
    amount: "+0.0150",
    usd: "+$945.12",
    from: "0x3a8f...c21d",
    date: "Mar 12, 14:32",
    status: "confirmed",
  },
  {
    id: 2,
    type: "sent",
    coin: "ETH",
    amount: "-0.5",
    usd: "-$1,218.40",
    to: "0x9e2a...b87f",
    date: "Mar 11, 09:15",
    status: "confirmed",
  },
  {
    id: 3,
    type: "received",
    coin: "USDT",
    amount: "+200.00",
    usd: "+$200.00",
    from: "0xf4c1...7d3a",
    date: "Mar 10, 18:44",
    status: "confirmed",
  },
  {
    id: 4,
    type: "sent",
    coin: "BTC",
    amount: "-0.0080",
    usd: "-$503.92",
    to: "0x1b7e...4f9c",
    date: "Mar 9, 11:20",
    status: "confirmed",
  },
  {
    id: 5,
    type: "received",
    coin: "ETH",
    amount: "+0.2",
    usd: "+$487.36",
    from: "0xa3d9...2e1b",
    date: "Mar 8, 16:05",
    status: "pending",
  },
  {
    id: 6,
    type: "sent",
    coin: "USDT",
    amount: "-100.00",
    usd: "-$100.00",
    to: "0x5c8f...9a2d",
    date: "Mar 7, 08:33",
    status: "confirmed",
  },
];

function PinModal({
  onConfirm,
  onClose,
}: { onConfirm: () => void; onClose: () => void }) {
  const [pin, setPin] = useState("");
  const handleDigit = (d: string) => {
    if (pin.length < 6) {
      const next = pin + d;
      setPin(next);
      if (next.length === 6) {
        if (next === "123456") {
          setTimeout(() => {
            onConfirm();
            onClose();
          }, 200);
        } else {
          setTimeout(() => {
            toast.error("Wrong PIN");
            setPin("");
          }, 200);
        }
      }
    }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center">
      <div className="w-full max-w-[390px] bg-[#1a1a2e] rounded-t-3xl p-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg">Confirm with PIN</h3>
          <button type="button" onClick={onClose} className="text-white/60">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-center gap-3 mb-8">
          {([0, 1, 2, 3, 4, 5] as number[]).map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 ${i < pin.length ? "bg-purple-400 border-purple-400" : "border-white/30"}`}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "x",
              "0",
              "del",
            ] as string[]
          ).map((d, pIdx) => (
            <button
              key={d}
              type="button"
              data-ocid={`crypto.pin.button.${pIdx + 1}`}
              onClick={() =>
                d === "del"
                  ? setPin((p) => p.slice(0, -1))
                  : d !== "x"
                    ? handleDigit(d)
                    : undefined
              }
              className={`h-14 rounded-2xl text-white text-xl font-semibold ${d !== "x" ? "bg-white/10 active:bg-white/20" : ""}`}
            >
              {d === "del" ? "⌫" : d === "x" ? "" : d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CryptoWalletScreen({
  onBack,
}: CryptoWalletScreenProps) {
  const [tab, setTab] = useState<"portfolio" | "send" | "receive" | "history">(
    "portfolio",
  );
  const [showPin, setShowPin] = useState(false);
  const [sendCoin, setSendCoin] = useState("BTC");
  const [sendAddress, setSendAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");

  const WALLET_ADDR = "0x3a8fC9b2E14d7c21A0F4d8eB3c91D5F7a2E8B4C6";

  const tabs = [
    { id: "portfolio" as const, label: "Portfolio", icon: LayoutDashboard },
    { id: "send" as const, label: "Send", icon: Send },
    { id: "receive" as const, label: "Receive", icon: ArrowDownLeft },
    { id: "history" as const, label: "History", icon: History },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0d0d1a] text-white overflow-hidden">
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 pt-12 pb-4 flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #1a0a2e 0%, #0d1a2e 100%)",
        }}
      >
        <button
          type="button"
          data-ocid="crypto.back.button"
          onClick={onBack}
          className="p-2 -ml-2"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="flex-1 text-lg font-bold text-white">Crypto Wallet</h1>
        {/* Live price ticker */}
        <div className="flex gap-2">
          <span className="text-[11px] bg-white/10 rounded-full px-2 py-1 flex items-center gap-1">
            <Bitcoin className="w-3 h-3 text-[#F7931A]" />
            <span className="text-green-400 font-semibold">$62,940</span>
          </span>
          <span className="text-[11px] bg-white/10 rounded-full px-2 py-1 text-blue-400 font-semibold">
            ETH $2,431
          </span>
        </div>
      </header>

      {/* Portfolio balance card */}
      <div
        className="mx-4 mb-4 rounded-2xl p-5 flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #7C3AED 0%, #0ea5e9 100%)",
        }}
      >
        <p className="text-white/70 text-xs mb-1">Total Portfolio Value</p>
        <p className="text-white text-3xl font-bold">$6,511.50</p>
        <div className="flex items-center gap-1 mt-1">
          <TrendingUp className="w-4 h-4 text-green-300" />
          <span className="text-green-300 text-sm font-semibold">
            +$234.18 (3.7%) today
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 flex-shrink-0 mx-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            data-ocid={`crypto.${t.id}.tab`}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 text-[11px] font-semibold transition-colors ${tab === t.id ? "text-purple-400 border-b-2 border-purple-400" : "text-white/40"}`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {/* Portfolio tab */}
        {tab === "portfolio" && (
          <div className="p-4 space-y-3">
            {COINS.map((coin, i) => (
              <div
                key={coin.id}
                data-ocid={`crypto.coin.item.${i + 1}`}
                className="flex items-center gap-3 bg-white/5 rounded-2xl p-4"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: coin.color }}
                >
                  {coin.symbol[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">
                    {coin.name}
                  </p>
                  <p className="text-white/50 text-xs">
                    {coin.balance} {coin.symbol}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold text-sm">
                    ${coin.usd}
                  </p>
                  <p
                    className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${coin.positive ? "text-green-400" : "text-red-400"}`}
                  >
                    {coin.positive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {coin.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Send tab */}
        {tab === "send" && (
          <div className="p-4 space-y-4">
            <div>
              <label
                htmlFor="crypto-send-input"
                className="text-white/60 text-xs mb-1.5 block"
              >
                Recipient Address
              </label>
              <input
                id="crypto-send-input"
                data-ocid="crypto.send.input"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-400"
                placeholder="0x..."
                value={sendAddress}
                onChange={(e) => setSendAddress(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="crypto-amount-input"
                className="text-white/60 text-xs mb-1.5 block"
              >
                Amount
              </label>
              <input
                id="crypto-amount-input"
                data-ocid="crypto.amount.input"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-400"
                placeholder="0.00"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="crypto-coin-select"
                className="text-white/60 text-xs mb-1.5 block"
              >
                Select Coin
              </label>
              <select
                id="crypto-coin-select"
                data-ocid="crypto.coin.select"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none"
                value={sendCoin}
                onChange={(e) => setSendCoin(e.target.value)}
              >
                {COINS.map((c) => (
                  <option key={c.id} value={c.symbol} className="bg-[#1a1a2e]">
                    {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-xs text-white/60">
              Estimated fee:{" "}
              <span className="text-white font-semibold">
                0.000042 BTC (~$2.64)
              </span>
            </div>
            <button
              type="button"
              data-ocid="crypto.send.primary_button"
              onClick={() => {
                if (!sendAddress || !sendAmount) {
                  toast.error("Fill all fields");
                  return;
                }
                setShowPin(true);
              }}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-sm"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #0ea5e9)",
              }}
            >
              Send {sendCoin}
            </button>
          </div>
        )}

        {/* Receive tab */}
        {tab === "receive" && (
          <div className="p-4 flex flex-col items-center gap-4">
            <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center mt-4">
              <div className="grid grid-cols-7 grid-rows-7 gap-0.5 p-2">
                {(
                  [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                    17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                    32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
                    47, 48,
                  ] as number[]
                ).map((i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-[1px] ${[0, 1, 2, 3, 4, 5, 6, 7, 14, 21, 28, 35, 42, 43, 44, 45, 46, 47, 48, 8, 15, 22, 29, 36, 10, 11, 12, 24, 31, 38, 17, 18, 19].includes(i) ? "bg-black" : "bg-white"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-white/50 text-xs">Scan to send crypto</p>
            <div className="w-full bg-white/5 rounded-xl p-3">
              <p className="text-white/50 text-[10px] mb-1">Wallet Address</p>
              <p className="text-white text-[11px] font-mono break-all">
                {WALLET_ADDR}
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                type="button"
                data-ocid="crypto.copy_address.button"
                onClick={() => {
                  navigator.clipboard?.writeText(WALLET_ADDR);
                  toast.success("Address copied!");
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 rounded-xl text-white text-sm font-semibold"
              >
                <Copy className="w-4 h-4" /> Copy
              </button>
              <button
                type="button"
                data-ocid="crypto.share_address.button"
                onClick={() => toast.success("Sharing address...")}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 rounded-xl text-white text-sm font-semibold"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        )}

        {/* History tab */}
        {tab === "history" && (
          <div className="p-4 space-y-2">
            {HISTORY_TXS.map((tx, i) => (
              <div
                key={tx.id}
                data-ocid={`crypto.history.item.${i + 1}`}
                className="flex items-center gap-3 bg-white/5 rounded-xl p-3"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === "received" ? "bg-green-500/20" : "bg-red-500/20"}`}
                >
                  {tx.type === "received" ? (
                    <ArrowDownLeft className="w-4 h-4 text-green-400" />
                  ) : (
                    <Send className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold capitalize">
                    {tx.type} {tx.coin}
                  </p>
                  <p className="text-white/40 text-[11px]">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${tx.type === "received" ? "text-green-400" : "text-red-400"}`}
                  >
                    {tx.amount}
                  </p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${tx.status === "confirmed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPin && (
        <PinModal
          onConfirm={() => {
            toast.success(`${sendCoin} sent successfully!`);
            setSendAddress("");
            setSendAmount("");
            setTab("history");
          }}
          onClose={() => setShowPin(false)}
        />
      )}
    </div>
  );
}
