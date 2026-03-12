import { ArrowLeft, Lock, Plus, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SECRET_CHATS = [
  {
    id: 1,
    name: "Alex Turner",
    lastMsg: "This message will vanish 🔒",
    time: "10:24 AM",
    initials: "AT",
    color: "bg-purple-600",
  },
  {
    id: 2,
    name: "Confidential",
    lastMsg: "Secret location shared",
    time: "Yesterday",
    initials: "CF",
    color: "bg-indigo-600",
  },
  {
    id: 3,
    name: "Private Convo",
    lastMsg: "End-to-end encrypted",
    time: "Mon",
    initials: "PC",
    color: "bg-violet-600",
  },
];

interface Props {
  onBack: () => void;
  onOpenChat?: (name: string) => void;
}

export default function SecretChatsScreen({ onBack }: Props) {
  const [locked, setLocked] = useState(true);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [openChatId, setOpenChatId] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { text: string; mine: boolean; time: string }[]
  >([
    {
      text: "🔒 This is a secret chat. Messages are end-to-end encrypted.",
      mine: false,
      time: "10:20 AM",
    },
    { text: "Hey, only we can see this 👁️", mine: true, time: "10:22 AM" },
    { text: "Perfect for sensitive info 🛡️", mine: false, time: "10:24 AM" },
  ]);

  const handlePinDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setPinError(false);
    if (newPin.length === 4) {
      setTimeout(() => {
        if (newPin === "1234") {
          setLocked(false);
          setPin("");
          toast.success("Secret chats unlocked");
        } else {
          setPinError(true);
          setPin("");
        }
      }, 200);
    }
  };

  if (openChatId !== null) {
    const chat = SECRET_CHATS.find((c) => c.id === openChatId);
    if (!chat) return null;
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-[#0d1117]">
        <header className="flex items-center gap-3 px-4 py-3 bg-[#1a0a2e]">
          <button
            type="button"
            data-ocid="secret_chat.back.button"
            onClick={() => setOpenChatId(null)}
            className="p-1 text-purple-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[12px] font-bold text-white">
            {chat.initials}
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-[15px]">{chat.name}</p>
            <p className="text-purple-300 text-[11px] flex items-center gap-1">
              <Lock className="w-3 h-3" /> Secret Chat
            </p>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((msg, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static chat messages
              key={i}
              className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl text-[14px] ${
                  msg.mine
                    ? "bg-purple-600 text-white rounded-br-sm"
                    : "bg-[#1e1e2e] text-purple-100 rounded-bl-sm"
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-[10px] opacity-60 mt-0.5 text-right">
                  {msg.time} 🔒
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 bg-[#1a0a2e] flex items-center gap-2">
          <input
            data-ocid="secret_chat.message.input"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && chatInput.trim()) {
                setChatMessages((prev) => [
                  ...prev,
                  {
                    text: chatInput.trim(),
                    mine: true,
                    time: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  },
                ]);
                setChatInput("");
              }
            }}
            placeholder="Secret message..."
            className="flex-1 bg-[#0d1117] border border-purple-800 rounded-full px-4 py-2 text-[13px] text-white placeholder:text-purple-400 outline-none"
          />
          <button
            type="button"
            data-ocid="secret_chat.send.button"
            onClick={() => {
              if (!chatInput.trim()) return;
              setChatMessages((prev) => [
                ...prev,
                {
                  text: chatInput.trim(),
                  mine: true,
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ]);
              setChatInput("");
            }}
            className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-[16px]">➤</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-[#1f2c34]">
        <button
          type="button"
          data-ocid="secret_chats.back.button"
          onClick={onBack}
          className="p-1 text-white/80 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Lock className="w-5 h-5 text-purple-400" />
        <h1 className="text-white font-semibold text-[17px]">Secret Chats</h1>
      </header>

      {/* Info banner */}
      <div className="mx-4 mt-4 mb-2 bg-purple-500/10 border border-purple-500/30 rounded-2xl p-3 flex gap-2">
        <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          Messages in secret chats are end-to-end encrypted and won't appear in
          your main chat list.
        </p>
      </div>

      {locked ? (
        /* PIN entry */
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <p className="text-center font-semibold text-[17px] text-foreground mb-1">
              Enter PIN to unlock
            </p>
            <p className="text-center text-[13px] text-muted-foreground">
              Default PIN: 1234
            </p>
          </div>
          <div className="flex gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  i < pin.length
                    ? "bg-purple-500 border-purple-500"
                    : pinError
                      ? "border-red-400"
                      : "border-muted-foreground/50"
                }`}
              />
            ))}
          </div>
          {pinError && (
            <p className="text-red-400 text-[13px]">Wrong PIN. Try again.</p>
          )}
          <div className="grid grid-cols-3 gap-4 w-full max-w-[260px]">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "x", "0", "del"].map(
              (d) => (
                <button
                  key={d}
                  type="button"
                  data-ocid="secret_chats.pin.button"
                  onClick={() => {
                    if (d === "del") setPin((p) => p.slice(0, -1));
                    else if (d !== "x") handlePinDigit(d);
                  }}
                  disabled={d === "x"}
                  className={`h-14 rounded-2xl text-[20px] font-semibold transition-all ${
                    d === ""
                      ? "invisible"
                      : d === "del"
                        ? "bg-muted/60 text-foreground hover:bg-muted active:scale-95"
                        : "bg-muted/60 text-foreground hover:bg-muted active:scale-95"
                  }`}
                >
                  {d}
                </button>
              ),
            )}
          </div>
        </div>
      ) : (
        /* Chat list */
        <div className="flex-1 overflow-y-auto">
          {SECRET_CHATS.map((chat) => (
            <button
              key={chat.id}
              type="button"
              data-ocid={`secret_chats.chat.item.${chat.id}`}
              onClick={() => setOpenChatId(chat.id)}
              className="flex items-center gap-3 px-4 py-3.5 w-full hover:bg-muted/40 transition-colors border-b border-border/40"
            >
              <div
                className={`w-12 h-12 rounded-full ${chat.color} flex items-center justify-center flex-shrink-0 relative`}
              >
                <span className="text-white font-bold text-[14px]">
                  {chat.initials}
                </span>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-background rounded-full flex items-center justify-center">
                  <Lock className="w-3 h-3 text-purple-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[15px] text-foreground">
                    {chat.name}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {chat.time}
                  </p>
                </div>
                <p className="text-[13px] text-muted-foreground truncate">
                  {chat.lastMsg}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!locked && (
        <div className="p-4">
          <button
            type="button"
            data-ocid="secret_chats.new.button"
            onClick={() => toast.info("New secret chat coming soon")}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Secret Chat
          </button>
        </div>
      )}
    </div>
  );
}
