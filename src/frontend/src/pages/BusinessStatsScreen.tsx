import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface Props {
  onBack: () => void;
}

type Period = "today" | "7days" | "30days";

const STATS: Record<
  Period,
  {
    sent: number;
    delivered: number;
    read: number;
    responseRate: number;
    avgResponseTime: string;
    chartData: number[];
  }
> = {
  today: {
    sent: 48,
    delivered: 45,
    read: 38,
    responseRate: 79,
    avgResponseTime: "4 min",
    chartData: [12, 18, 8, 22, 15, 30, 48],
  },
  "7days": {
    sent: 312,
    delivered: 298,
    read: 241,
    responseRate: 77,
    avgResponseTime: "6 min",
    chartData: [42, 55, 38, 71, 48, 62, 96],
  },
  "30days": {
    sent: 1284,
    delivered: 1210,
    read: 983,
    responseRate: 73,
    avgResponseTime: "8 min",
    chartData: [180, 220, 160, 290, 200, 255, 390],
  },
};

const PERIODS: { key: Period; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7days", label: "Last 7 Days" },
  { key: "30days", label: "Last 30 Days" },
];

export default function BusinessStatsScreen({ onBack }: Props) {
  const [period, setPeriod] = useState<Period>("7days");
  const stats = STATS[period];
  const maxChart = Math.max(...stats.chartData);

  const statCards = [
    {
      label: "Messages Sent",
      value: stats.sent.toLocaleString(),
      icon: "📤",
      color: "#25D366",
    },
    {
      label: "Delivered",
      value: stats.delivered.toLocaleString(),
      icon: "✓✓",
      color: "#53BDEB",
    },
    {
      label: "Read",
      value: stats.read.toLocaleString(),
      icon: "👁️",
      color: "#A8E6CF",
    },
    {
      label: "Response Rate",
      value: `${stats.responseRate}%`,
      icon: "📊",
      color: "#FFE66D",
    },
    {
      label: "Avg Response Time",
      value: stats.avgResponseTime,
      icon: "⏱️",
      color: "#FF8B94",
    },
  ];

  const chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div
      data-ocid="business_stats.page"
      className="absolute inset-0 flex flex-col z-50 overflow-y-auto"
      style={{ background: "#0B141A", WebkitOverflowScrolling: "touch" }}
    >
      <header
        className="sticky top-0 z-10 bg-[#1F2C34] text-white flex items-center gap-3 px-3 py-3 flex-shrink-0"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
      >
        <button
          type="button"
          data-ocid="business_stats.close_button"
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[18px] font-bold flex-1">Business Statistics</h1>
      </header>

      <div className="flex-1 pb-10">
        {/* Period Filter */}
        <div className="flex gap-2 px-4 pt-4 pb-2">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              data-ocid={`business_stats.${p.key}.tab`}
              onClick={() => setPeriod(p.key)}
              className={`flex-1 py-2 rounded-full text-[12px] font-semibold transition-colors ${
                period === p.key
                  ? "bg-[#25D366] text-white"
                  : "bg-[#1F2C34] text-[#8696A0]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 px-4 pt-3">
          {statCards.map((card, idx) => (
            <div
              key={card.label}
              data-ocid={`business_stats.item.${idx + 1}`}
              className={`bg-[#1F2C34] rounded-2xl p-4 ${
                idx === statCards.length - 1 ? "col-span-2" : ""
              }`}
            >
              <div className="text-2xl mb-1">{card.icon}</div>
              <p
                className="text-[22px] font-bold"
                style={{ color: card.color }}
              >
                {card.value}
              </p>
              <p className="text-[12px] text-[#8696A0] mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="mx-4 mt-4 bg-[#1F2C34] rounded-2xl p-4">
          <p className="text-[13px] font-semibold text-white mb-4">
            Messages per Day
          </p>
          <div className="flex items-end gap-2 h-24">
            {stats.chartData.map((val, idx) => (
              <div
                key={chartLabels[idx]}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${(val / maxChart) * 80}px`,
                    backgroundColor: "#25D366",
                    opacity: 0.7 + (val / maxChart) * 0.3,
                  }}
                />
                <span className="text-[10px] text-[#8696A0]">
                  {chartLabels[idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Response Rate Visual */}
        <div className="mx-4 mt-3 bg-[#1F2C34] rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[13px] font-semibold text-white">
              Response Rate
            </p>
            <p className="text-[13px] font-bold text-[#25D366]">
              {stats.responseRate}%
            </p>
          </div>
          <div className="w-full h-2.5 bg-[#0B141A] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${stats.responseRate}%`,
                backgroundColor: "#25D366",
              }}
            />
          </div>
          <p className="text-[11px] text-[#8696A0] mt-1.5">
            Avg response time: {stats.avgResponseTime}
          </p>
        </div>
      </div>
    </div>
  );
}
