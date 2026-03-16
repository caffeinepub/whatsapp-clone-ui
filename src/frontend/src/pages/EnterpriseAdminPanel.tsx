import {
  ArrowLeft,
  BarChart3,
  ChevronRight,
  Copy,
  FileText,
  Key,
  MessageSquare,
  Plus,
  Radio,
  RefreshCw,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EnterpriseAdminPanelProps {
  onBack: () => void;
}

const TEAM = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@acme.com",
    role: "Admin",
    avatar: "SJ",
    color: "#7C3AED",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@acme.com",
    role: "Agent",
    avatar: "MC",
    color: "#0ea5e9",
  },
  {
    id: 3,
    name: "Priya Sharma",
    email: "priya@acme.com",
    role: "Viewer",
    avatar: "PS",
    color: "#10b981",
  },
];

const AUDIT_LOG = [
  { id: 1, action: "SSO enabled", user: "Sarah Johnson", time: "Today 14:32" },
  {
    id: 2,
    action: "API key regenerated",
    user: "Mike Chen",
    time: "Today 10:15",
  },
  {
    id: 3,
    action: "New team member added",
    user: "Sarah Johnson",
    time: "Mar 12 09:44",
  },
  {
    id: 4,
    action: "Broadcast sent to 1,240 contacts",
    user: "Mike Chen",
    time: "Mar 11 16:22",
  },
  {
    id: 5,
    action: "Webhook URL updated",
    user: "Sarah Johnson",
    time: "Mar 10 11:08",
  },
];

const STATS = [
  {
    label: "Messages Today",
    value: "8,342",
    change: "+12%",
    up: true,
    icon: MessageSquare,
    color: "#7C3AED",
  },
  {
    label: "Active Users",
    value: "1,240",
    change: "+5%",
    up: true,
    icon: Users,
    color: "#0ea5e9",
  },
  {
    label: "Broadcast Reach",
    value: "45.2K",
    change: "-2%",
    up: false,
    icon: Radio,
    color: "#ec4899",
  },
  {
    label: "Response Rate",
    value: "94.7%",
    change: "+1.2%",
    up: true,
    icon: BarChart3,
    color: "#10b981",
  },
];

const ROLE_COLORS: Record<string, string> = {
  Admin: "bg-purple-500/20 text-purple-400",
  Agent: "bg-blue-500/20 text-blue-400",
  Viewer: "bg-white/10 text-white/60",
};

export default function EnterpriseAdminPanel({
  onBack,
}: EnterpriseAdminPanelProps) {
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [ssoProvider, setSsoProvider] = useState("Google");
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://acme.corp/webhook/wa");
  const API_KEY = "sk-ent-8f4a2c1b9e3d7f6a";

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
          data-ocid="enterprise.back.button"
          onClick={onBack}
          className="p-2 -ml-2"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="flex-1 text-lg font-bold text-white">
          Enterprise Dashboard
        </h1>
        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full font-semibold">
          PRO
        </span>
      </header>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-4 space-y-5">
        {/* Company card */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, #7C3AED20 0%, #0ea5e920 100%)",
            border: "1px solid rgba(124,58,237,0.3)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-white font-bold text-base">Acme Corp</p>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              </div>
              <p className="text-white/50 text-xs">WhatsApp Business Pro</p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-lg">47</p>
              <p className="text-white/40 text-xs">members</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div>
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">
            Analytics Overview
          </p>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                data-ocid={`enterprise.stat.item.${i + 1}`}
                className="bg-white/5 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${s.color}20` }}
                  >
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <span
                    className={`text-[11px] font-semibold flex items-center gap-0.5 ${s.up ? "text-green-400" : "text-red-400"}`}
                  >
                    {s.up ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {s.change}
                  </span>
                </div>
                <p className="text-white font-bold text-xl">{s.value}</p>
                <p className="text-white/50 text-[11px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team management */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">
              Team Management
            </p>
            <button
              type="button"
              data-ocid="enterprise.add_member.button"
              onClick={() => toast.success("Add member dialog")}
              className="flex items-center gap-1 text-purple-400 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {TEAM.map((member, i) => (
              <div
                key={member.id}
                data-ocid={`enterprise.team.item.${i + 1}`}
                className="flex items-center gap-3 bg-white/5 rounded-xl p-3"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: member.color }}
                >
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">
                    {member.name}
                  </p>
                  <p className="text-white/40 text-xs truncate">
                    {member.email}
                  </p>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${ROLE_COLORS[member.role]}`}
                >
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Broadcast analytics */}
        <div>
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">
            Broadcast Analytics
          </p>
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="flex items-end gap-1 h-16 mb-3">
              {([40, 65, 45, 80, 70, 90, 55] as number[]).map((h, i) => (
                <div
                  key={`b${i}v${h}`}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${h}%`,
                    background:
                      i === 5
                        ? "linear-gradient(180deg, #7C3AED, #0ea5e9)"
                        : "rgba(255,255,255,0.1)",
                  }}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-white font-bold text-sm">45,200</p>
                <p className="text-white/40 text-[10px]">Sent</p>
              </div>
              <div>
                <p className="text-white font-bold text-sm">42,880</p>
                <p className="text-white/40 text-[10px]">Delivered</p>
              </div>
              <div>
                <p className="text-white font-bold text-sm">38,940</p>
                <p className="text-white/40 text-[10px]">Read</p>
              </div>
            </div>
          </div>
        </div>

        {/* SSO Settings */}
        <div>
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">
            SSO Settings
          </p>
          <div className="bg-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-white text-sm font-semibold">
                  Single Sign-On
                </span>
              </div>
              <button
                type="button"
                data-ocid="enterprise.sso.switch"
                onClick={() => setSsoEnabled((v) => !v)}
                className={`w-12 h-6 rounded-full transition-colors relative ${ssoEnabled ? "bg-purple-500" : "bg-white/20"}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${ssoEnabled ? "left-7" : "left-1"}`}
                />
              </button>
            </div>
            {ssoEnabled && (
              <div>
                <label
                  htmlFor="sso-provider-select"
                  className="text-white/50 text-xs mb-1.5 block"
                >
                  Provider
                </label>
                <select
                  id="sso-provider-select"
                  data-ocid="enterprise.sso_provider.select"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none"
                  value={ssoProvider}
                  onChange={(e) => setSsoProvider(e.target.value)}
                >
                  {["Google", "Microsoft", "Okta"].map((p) => (
                    <option key={p} value={p} className="bg-[#1a1a2e]">
                      {p}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  data-ocid="enterprise.sso_configure.button"
                  onClick={() => toast.success("SSO configured!")}
                  className="mt-3 w-full py-2.5 rounded-xl bg-purple-600/30 border border-purple-500/30 text-purple-300 text-sm font-semibold"
                >
                  Configure SSO
                </button>
              </div>
            )}
          </div>
        </div>

        {/* API Access */}
        <div>
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">
            API Access
          </p>
          <div className="bg-white/5 rounded-2xl p-4 space-y-3">
            <div>
              <p className="text-white/50 text-xs mb-1.5">API Key</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-mono text-sm text-white/70">
                  {apiKeyVisible ? API_KEY : "sk-ent-••••••••••••••"}
                </div>
                <button
                  type="button"
                  data-ocid="enterprise.api_key_show.toggle"
                  onClick={() => setApiKeyVisible((v) => !v)}
                  className="p-2 text-white/50"
                >
                  <Key className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  data-ocid="enterprise.api_key_copy.button"
                  onClick={() => {
                    navigator.clipboard?.writeText(API_KEY);
                    toast.success("API key copied!");
                  }}
                  className="p-2 text-white/50"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              type="button"
              data-ocid="enterprise.regenerate_key.button"
              onClick={() => toast.success("API key regenerated!")}
              className="flex items-center gap-2 text-yellow-400 text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate Key
            </button>
            <div>
              <label
                htmlFor="enterprise-webhook-input"
                className="text-white/50 text-xs mb-1.5 block"
              >
                Webhook URL
              </label>
              <input
                id="enterprise-webhook-input"
                data-ocid="enterprise.webhook.input"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-purple-400"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Audit log */}
        <div>
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">
            Audit Log
          </p>
          <div className="space-y-2">
            {AUDIT_LOG.map((log, i) => (
              <div
                key={log.id}
                data-ocid={`enterprise.audit.item.${i + 1}`}
                className="flex items-center gap-3 bg-white/5 rounded-xl p-3"
              >
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-3.5 h-3.5 text-white/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium">{log.action}</p>
                  <p className="text-white/40 text-[10px]">
                    {log.user} · {log.time}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
