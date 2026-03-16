import { useState } from "react";
import { toast } from "sonner";

type AppId =
  | "calculator"
  | "notes"
  | "unit"
  | "qr"
  | "tip"
  | "currency"
  | "todo"
  | "weather";

interface MiniApp {
  id: AppId;
  name: string;
  icon: string;
  color: string;
  desc: string;
}

const APPS: MiniApp[] = [
  {
    id: "calculator",
    name: "Calculator",
    icon: "🔢",
    color: "from-blue-600 to-blue-800",
    desc: "Basic & scientific",
  },
  {
    id: "notes",
    name: "Quick Notes",
    icon: "📝",
    color: "from-yellow-500 to-orange-500",
    desc: "Jot anything fast",
  },
  {
    id: "unit",
    name: "Unit Convert",
    icon: "📐",
    color: "from-green-500 to-teal-600",
    desc: "Length, weight, temp",
  },
  {
    id: "qr",
    name: "QR Generator",
    icon: "⬛",
    color: "from-gray-700 to-gray-900",
    desc: "Generate QR codes",
  },
  {
    id: "tip",
    name: "Tip Splitter",
    icon: "💰",
    color: "from-emerald-500 to-green-700",
    desc: "Split bills easily",
  },
  {
    id: "currency",
    name: "Currency",
    icon: "💱",
    color: "from-purple-600 to-indigo-700",
    desc: "Convert currencies",
  },
  {
    id: "todo",
    name: "Todo List",
    icon: "✅",
    color: "from-pink-500 to-rose-600",
    desc: "Track your tasks",
  },
  {
    id: "weather",
    name: "Weather",
    icon: "🌤️",
    color: "from-sky-500 to-blue-600",
    desc: "Current conditions",
  },
];

// --- Mini app implementations ---

function CalculatorApp({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(false);

  const press = (val: string) => {
    if (val === "C") {
      setDisplay("0");
      setStored(null);
      setOp(null);
      setFresh(false);
      return;
    }
    if (val === "=") {
      if (stored !== null && op) {
        const b = Number.parseFloat(display);
        let result = 0;
        if (op === "+") result = stored + b;
        else if (op === "-") result = stored - b;
        else if (op === "×") result = stored * b;
        else if (op === "÷") result = b !== 0 ? stored / b : 0;
        setDisplay(String(Number.parseFloat(result.toFixed(8))));
        setStored(null);
        setOp(null);
        setFresh(true);
      }
      return;
    }
    if (["+", "-", "×", "÷"].includes(val)) {
      setStored(Number.parseFloat(display));
      setOp(val);
      setFresh(true);
      return;
    }
    if (val === ".") {
      if (display.includes(".") && !fresh) return;
      setDisplay(fresh ? "0." : `${display}.`);
      setFresh(false);
      return;
    }
    if (val === "%") {
      setDisplay(String(Number.parseFloat(display) / 100));
      return;
    }
    if (val === "+/-") {
      setDisplay(String(-Number.parseFloat(display)));
      return;
    }
    setDisplay(fresh || display === "0" ? val : display + val);
    setFresh(false);
  };

  const btns = [
    ["C", "+/-", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];
  return (
    <div className="flex flex-col h-full bg-black text-white">
      <div className="flex items-center px-4 py-3 border-b border-white/10">
        <button
          type="button"
          data-ocid="mini_calculator.close_button"
          onClick={onClose}
          className="text-white text-xl"
        >
          ←
        </button>
        <span className="ml-3 font-semibold">Calculator</span>
      </div>
      <div className="flex-1 flex items-end justify-end px-6 py-4">
        <div className="text-5xl font-light truncate max-w-full">{display}</div>
      </div>
      <div className="p-3 space-y-2">
        {btns.map((row, ri) => (
          <div key={ri.toString()} className="flex gap-2">
            {row.map((b) => (
              <button
                type="button"
                key={b}
                data-ocid="mini_calculator.button"
                onClick={() => press(b)}
                className={`flex-1 h-14 rounded-full text-xl font-medium transition-all active:scale-95 ${
                  b === "="
                    ? "bg-orange-500 text-white"
                    : ["÷", "×", "-", "+"].includes(b)
                      ? "bg-orange-400/30 text-orange-400"
                      : ["C", "+/-", "%"].includes(b)
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-white"
                } ${b === "0" ? "col-span-2" : ""}`}
                style={b === "0" ? { flexGrow: 2 } : {}}
              >
                {b}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesApp({ onClose }: { onClose: () => void }) {
  const [notes, setNotes] = useState(
    () => localStorage.getItem("wa_mini_notes") ?? "",
  );
  const save = () => {
    localStorage.setItem("wa_mini_notes", notes);
    toast.success("Saved!");
  };
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button
          type="button"
          data-ocid="mini_notes.close_button"
          onClick={onClose}
          className="text-xl"
        >
          ←
        </button>
        <span className="font-semibold flex-1">Quick Notes</span>
        <button
          type="button"
          data-ocid="mini_notes.save_button"
          onClick={save}
          className="text-sm text-primary font-semibold"
        >
          Save
        </button>
      </div>
      <textarea
        data-ocid="mini_notes.textarea"
        className="flex-1 p-4 bg-background text-foreground resize-none outline-none text-sm"
        placeholder="Start typing your notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
}

function TipApp({ onClose }: { onClose: () => void }) {
  const [bill, setBill] = useState("");
  const [tip, setTip] = useState(18);
  const [people, setPeople] = useState(2);
  const total = Number.parseFloat(bill || "0") * (1 + tip / 100);
  const perPerson = people > 0 ? total / people : 0;
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button
          type="button"
          data-ocid="mini_tip.close_button"
          onClick={onClose}
          className="text-xl"
        >
          ←
        </button>
        <span className="font-semibold">Tip Splitter</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-card rounded-2xl p-4 space-y-3">
          <div>
            <div className="text-xs text-muted-foreground">Bill Amount ($)</div>
            <input
              data-ocid="mini_tip.input"
              type="number"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-2xl font-bold text-foreground outline-none mt-1"
            />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Tip: {tip}%</div>
            <div className="flex gap-2 mt-2">
              {[10, 15, 18, 20, 25].map((t) => (
                <button
                  type="button"
                  key={t}
                  data-ocid="mini_tip.toggle"
                  onClick={() => setTip(t)}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-colors ${tip === t ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}
                >
                  {t}%
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">
              People: {people}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                data-ocid="mini_tip.button"
                onClick={() => setPeople(Math.max(1, people - 1))}
                className="w-8 h-8 rounded-full bg-card border border-border text-lg"
              >
                -
              </button>
              <span className="text-xl font-bold flex-1 text-center">
                {people}
              </span>
              <button
                type="button"
                data-ocid="mini_tip.button"
                onClick={() => setPeople(people + 1)}
                className="w-8 h-8 rounded-full bg-card border border-border text-lg"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Bill</span>
            <span>${Number.parseFloat(bill || "0").toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tip ({tip}%)</span>
            <span>
              ${((Number.parseFloat(bill || "0") * tip) / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-semibold border-t border-border pt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-primary">
            <span>Per Person</span>
            <span>${perPerson.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CurrencyApp({ onClose }: { onClose: () => void }) {
  const rates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.2,
    JPY: 149.5,
    AUD: 1.53,
    CAD: 1.36,
  };
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const converted =
    (Number.parseFloat(amount || "0") / rates[from]) * rates[to];
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button
          type="button"
          data-ocid="mini_currency.close_button"
          onClick={onClose}
          className="text-xl"
        >
          ←
        </button>
        <span className="font-semibold">Currency Converter</span>
      </div>
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-card rounded-2xl p-4">
          <div className="text-xs text-muted-foreground">Amount</div>
          <input
            data-ocid="mini_currency.input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent text-3xl font-bold text-foreground outline-none mt-1"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-card rounded-2xl p-3">
            <div className="text-xs text-muted-foreground">From</div>
            <select
              data-ocid="mini_currency.select"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-transparent text-foreground text-lg font-bold outline-none mt-1"
            >
              {Object.keys(rates).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            data-ocid="mini_currency.button"
            onClick={() => {
              const t = from;
              setFrom(to);
              setTo(t);
            }}
            className="w-12 h-12 self-center rounded-full bg-primary/20 text-primary text-xl"
          >
            ⇄
          </button>
          <div className="flex-1 bg-card rounded-2xl p-3">
            <div className="text-xs text-muted-foreground">To</div>
            <select
              data-ocid="mini_currency.select"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-transparent text-foreground text-lg font-bold outline-none mt-1"
            >
              {Object.keys(rates).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 text-center">
          <div className="text-xs text-muted-foreground">
            {amount} {from} =
          </div>
          <div className="text-4xl font-bold text-primary mt-1">
            {converted.toFixed(4)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{to}</div>
        </div>
      </div>
    </div>
  );
}

function TodoApp({ onClose }: { onClose: () => void }) {
  const [todos, setTodos] = useState<
    { id: number; text: string; done: boolean }[]
  >(() => JSON.parse(localStorage.getItem("wa_mini_todos") ?? "[]"));
  const [input, setInput] = useState("");
  const save = (t: typeof todos) => {
    setTodos(t);
    localStorage.setItem("wa_mini_todos", JSON.stringify(t));
  };
  const add = () => {
    if (!input.trim()) return;
    save([{ id: Date.now(), text: input.trim(), done: false }, ...todos]);
    setInput("");
  };
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button
          type="button"
          data-ocid="mini_todo.close_button"
          onClick={onClose}
          className="text-xl"
        >
          ←
        </button>
        <span className="font-semibold flex-1">Todo List</span>
        <span className="text-xs text-muted-foreground">
          {todos.filter((t) => !t.done).length} left
        </span>
      </div>
      <div className="flex gap-2 px-4 py-3 border-b border-border">
        <input
          data-ocid="todo.input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add task..."
          className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none"
        />
        <button
          type="button"
          data-ocid="todo.add_button"
          onClick={add}
          className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center"
        >
          +
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {todos.map((t, i) => (
          <div
            key={t.id}
            data-ocid={`todo.item.${i + 1}`}
            className="flex items-center gap-3 px-4 py-3 border-b border-border"
          >
            <button
              type="button"
              data-ocid={`todo.checkbox.${i + 1}`}
              onClick={() =>
                save(
                  todos.map((x) =>
                    x.id === t.id ? { ...x, done: !x.done } : x,
                  ),
                )
              }
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${t.done ? "bg-primary border-primary" : "border-border"}`}
            >
              {t.done && (
                <span className="text-primary-foreground text-xs">✓</span>
              )}
            </button>
            <span
              className={`flex-1 text-sm ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}
            >
              {t.text}
            </span>
            <button
              type="button"
              data-ocid={`todo.delete_button.${i + 1}`}
              onClick={() => save(todos.filter((x) => x.id !== t.id))}
              className="text-muted-foreground text-sm"
            >
              ✕
            </button>
          </div>
        ))}
        {todos.length === 0 && (
          <div
            data-ocid="todo.empty_state"
            className="flex flex-col items-center justify-center h-40 text-muted-foreground"
          >
            <div className="text-4xl mb-2">✅</div>
            <div className="text-sm">No tasks yet</div>
          </div>
        )}
      </div>
    </div>
  );
}

function WeatherApp({ onClose }: { onClose: () => void }) {
  const cities = [
    {
      city: "New York",
      temp: 12,
      feels: 9,
      desc: "Partly Cloudy",
      icon: "⛅",
      humidity: 65,
      wind: 14,
    },
    {
      city: "London",
      temp: 8,
      feels: 5,
      desc: "Overcast",
      icon: "☁️",
      humidity: 78,
      wind: 20,
    },
    {
      city: "Tokyo",
      temp: 18,
      feels: 16,
      desc: "Sunny",
      icon: "☀️",
      humidity: 45,
      wind: 8,
    },
    {
      city: "Mumbai",
      temp: 31,
      feels: 36,
      desc: "Hot & Humid",
      icon: "🌤️",
      humidity: 88,
      wind: 12,
    },
  ];
  const [idx, setIdx] = useState(0);
  const w = cities[idx];
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button
          type="button"
          data-ocid="mini_weather.close_button"
          onClick={onClose}
          className="text-xl"
        >
          ←
        </button>
        <span className="font-semibold flex-1">Weather</span>
      </div>
      <div className="flex gap-2 px-3 py-2 border-b border-border overflow-x-auto">
        {cities.map((c, i) => (
          <button
            type="button"
            key={c.city}
            data-ocid="mini_weather.tab"
            onClick={() => setIdx(i)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${idx === i ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
          >
            {c.city}
          </button>
        ))}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="text-8xl">{w.icon}</div>
        <div className="text-5xl font-bold text-foreground">{w.temp}°C</div>
        <div className="text-muted-foreground font-semibold">{w.desc}</div>
        <div className="text-sm text-muted-foreground">{w.city}</div>
        <div className="grid grid-cols-3 gap-3 w-full mt-4">
          {[
            { label: "Feels Like", val: `${w.feels}°` },
            { label: "Humidity", val: `${w.humidity}%` },
            { label: "Wind", val: `${w.wind} km/h` },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl p-3 text-center">
              <div className="font-bold text-foreground">{s.val}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Simulated data · Updates hourly
        </div>
      </div>
    </div>
  );
}

function UnitApp({ onClose }: { onClose: () => void }) {
  const [value, setValue] = useState("1");
  const [cat, setCat] = useState("length");
  const categories = {
    length: {
      units: ["m", "km", "ft", "mi", "cm", "in"],
      toBase: {
        m: 1,
        km: 1000,
        ft: 0.3048,
        mi: 1609.34,
        cm: 0.01,
        in: 0.0254,
      } as Record<string, number>,
    },
    weight: {
      units: ["kg", "g", "lb", "oz"],
      toBase: { kg: 1, g: 0.001, lb: 0.4536, oz: 0.0283 } as Record<
        string,
        number
      >,
    },
    temp: { units: ["°C", "°F", "K"], toBase: {} as Record<string, number> },
  } as const;
  type Cat = keyof typeof categories;
  const c = categories[cat as Cat];
  const convertTemp = (v: number, from: string) => {
    if (from === "°C")
      return { "°C": v, "°F": (v * 9) / 5 + 32, K: v + 273.15 };
    if (from === "°F")
      return {
        "°F": v,
        "°C": ((v - 32) * 5) / 9,
        K: ((v - 32) * 5) / 9 + 273.15,
      };
    return { K: v, "°C": v - 273.15, "°F": ((v - 273.15) * 9) / 5 + 32 };
  };
  const from = c.units[0];
  const n = Number.parseFloat(value || "0");
  const results =
    cat === "temp"
      ? convertTemp(n, from)
      : Object.fromEntries(
          c.units.map((u) => [
            u,
            (n * (c as any).toBase[from]) / (c as any).toBase[u],
          ]),
        );
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button
          type="button"
          data-ocid="mini_unit.close_button"
          onClick={onClose}
          className="text-xl"
        >
          ←
        </button>
        <span className="font-semibold">Unit Converter</span>
      </div>
      <div className="flex gap-2 px-3 py-2 border-b border-border">
        {Object.keys(categories).map((k) => (
          <button
            type="button"
            key={k}
            data-ocid="mini_unit.tab"
            onClick={() => {
              setCat(k);
              setValue("1");
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${cat === k ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
          >
            {k}
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-card rounded-2xl p-4">
          <div className="text-xs text-muted-foreground">{from}</div>
          <input
            data-ocid="mini_unit.input"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-transparent text-3xl font-bold text-foreground outline-none mt-1"
          />
        </div>
        <div className="space-y-2">
          {c.units.slice(1).map((u) => (
            <div
              key={u}
              className="bg-card rounded-xl px-4 py-3 flex justify-between"
            >
              <span className="text-muted-foreground text-sm">{u}</span>
              <span className="font-semibold text-foreground">
                {((results as Record<string, number>)[u] ?? 0).toFixed(4)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QRApp({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("https://wa.me");
  const size = 200;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button
          type="button"
          data-ocid="mini_qr.close_button"
          onClick={onClose}
          className="text-xl"
        >
          ←
        </button>
        <span className="font-semibold">QR Generator</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <img
            src={qrUrl}
            alt="QR Code"
            width={size}
            height={size}
            className="block"
          />
        </div>
        <input
          data-ocid="mini_qr.input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL"
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none text-center"
        />
        <button
          type="button"
          data-ocid="mini_qr.primary_button"
          onClick={() => {
            navigator.clipboard?.writeText(qrUrl);
            toast.success("QR URL copied!");
          }}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm"
        >
          Copy QR URL
        </button>
      </div>
    </div>
  );
}

export default function MiniAppsScreen({ onBack }: { onBack: () => void }) {
  const [openApp, setOpenApp] = useState<AppId | null>(null);
  const [recentApps, setRecentApps] = useState<AppId[]>(() =>
    JSON.parse(localStorage.getItem("wa_recent_apps") ?? "[]"),
  );

  const openMiniApp = (id: AppId) => {
    setOpenApp(id);
    const updated = [id, ...recentApps.filter((a) => a !== id)].slice(0, 4);
    setRecentApps(updated);
    localStorage.setItem("wa_recent_apps", JSON.stringify(updated));
  };

  const closeApp = () => setOpenApp(null);

  if (openApp === "calculator")
    return (
      <MobileWrapper>
        <CalculatorApp onClose={closeApp} />
      </MobileWrapper>
    );
  if (openApp === "notes")
    return (
      <MobileWrapper>
        <NotesApp onClose={closeApp} />
      </MobileWrapper>
    );
  if (openApp === "tip")
    return (
      <MobileWrapper>
        <TipApp onClose={closeApp} />
      </MobileWrapper>
    );
  if (openApp === "currency")
    return (
      <MobileWrapper>
        <CurrencyApp onClose={closeApp} />
      </MobileWrapper>
    );
  if (openApp === "todo")
    return (
      <MobileWrapper>
        <TodoApp onClose={closeApp} />
      </MobileWrapper>
    );
  if (openApp === "weather")
    return (
      <MobileWrapper>
        <WeatherApp onClose={closeApp} />
      </MobileWrapper>
    );
  if (openApp === "unit")
    return (
      <MobileWrapper>
        <UnitApp onClose={closeApp} />
      </MobileWrapper>
    );
  if (openApp === "qr")
    return (
      <MobileWrapper>
        <QRApp onClose={closeApp} />
      </MobileWrapper>
    );

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-border"
        style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)" }}
      >
        <button
          type="button"
          data-ocid="mini_apps.close_button"
          onClick={onBack}
          className="text-white text-xl"
        >
          ←
        </button>
        <div>
          <div className="text-white font-semibold text-base">Mini Apps</div>
          <div className="text-white/60 text-xs">Built-in tools</div>
        </div>
      </div>

      {recentApps.length > 0 && (
        <div className="px-4 pt-4">
          <div className="text-xs text-muted-foreground font-semibold mb-2">
            RECENTLY USED
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentApps.map((id) => {
              const app = APPS.find((a) => a.id === id);
              if (!app) return null;
              return (
                <button
                  type="button"
                  key={id}
                  data-ocid="mini_apps.item"
                  onClick={() => openMiniApp(id)}
                  className="flex-shrink-0 flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl shadow-md`}
                  >
                    {app.icon}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {app.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="px-4 pt-4">
        <div className="text-xs text-muted-foreground font-semibold mb-3">
          ALL APPS
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {APPS.map((app) => (
            <button
              type="button"
              key={app.id}
              data-ocid="mini_apps.item"
              onClick={() => openMiniApp(app.id)}
              className="bg-card rounded-2xl p-4 text-left flex flex-col gap-2 active:scale-95 transition-transform"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl shadow-sm`}
              >
                {app.icon}
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">
                  {app.name}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {app.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col h-full bg-background">{children}</div>;
}
