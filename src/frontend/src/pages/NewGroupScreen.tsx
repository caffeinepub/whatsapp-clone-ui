import { ArrowLeft, Camera, Check, Users } from "lucide-react";
import { useState } from "react";
import ContactAvatar from "../components/ContactAvatar";

interface NewGroupScreenProps {
  onBack: () => void;
  onGroupCreated: (name: string, members: string[]) => void;
}

const CONTACTS = [
  { id: "1", name: "Emma Rodriguez", initials: "ER", colorIndex: 0 },
  { id: "2", name: "Marcus Chen", initials: "MC", colorIndex: 1 },
  { id: "3", name: "Priya Sharma", initials: "PS", colorIndex: 4 },
  { id: "4", name: "Jordan Williams", initials: "JW", colorIndex: 3 },
  { id: "5", name: "Sarah Mitchell", initials: "SM", colorIndex: 5 },
  { id: "6", name: "David Park", initials: "DP", colorIndex: 2 },
  { id: "7", name: "Aisha Johnson", initials: "AJ", colorIndex: 6 },
  { id: "8", name: "Carlos Rivera", initials: "CR", colorIndex: 7 },
];

type Step = "select-members" | "set-name";

export default function NewGroupScreen({
  onBack,
  onGroupCreated,
}: NewGroupScreenProps) {
  const [step, setStep] = useState<Step>("select-members");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState("");

  const toggleContact = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedContacts = CONTACTS.filter((c) => selectedIds.has(c.id));

  const handleCreate = () => {
    const name = groupName.trim() || "New Group";
    const members = selectedContacts.map((c) => c.name);
    onGroupCreated(name, members);
  };

  if (step === "set-name") {
    return (
      <div className="flex flex-col h-full animate-slide-up">
        {/* Header */}
        <header
          className="bg-wa-header px-2 pb-2 flex items-center gap-2 flex-shrink-0"
          style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
        >
          <button
            type="button"
            onClick={() => setStep("select-members")}
            className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-wa-header-fg text-[18px] font-bold font-display flex-1">
            New Group
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto bg-secondary/30">
          {/* Group icon + name */}
          <div className="bg-card px-4 py-6 flex items-center gap-4">
            <button
              type="button"
              className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0 hover:bg-muted/80 transition-colors"
              aria-label="Set group photo"
            >
              <Camera className="w-7 h-7 text-muted-foreground" />
            </button>
            <input
              data-ocid="group.new.name.input"
              type="text"
              placeholder="Group name (optional)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="flex-1 bg-transparent border-b-2 border-wa-green pb-1.5 text-[16px] text-foreground placeholder:text-muted-foreground outline-none"
              maxLength={50}
            />
          </div>

          {/* Members preview */}
          <div className="mt-3 bg-card px-4 py-3">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Members · {selectedContacts.length}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedContacts.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-1.5 bg-muted/60 rounded-full pl-1 pr-2.5 py-0.5"
                >
                  <ContactAvatar
                    initials={c.initials}
                    size="sm"
                    colorIndex={c.colorIndex}
                  />
                  <span className="text-[13px] font-medium text-foreground">
                    {c.name.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Create button */}
        <div
          className="px-4 py-4 bg-card border-t border-border"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
        >
          <button
            type="button"
            data-ocid="group.create.button"
            onClick={handleCreate}
            className="w-full py-3 bg-wa-green text-white font-semibold text-[16px] rounded-full flex items-center justify-center gap-2 hover:brightness-105 active:brightness-95 transition-all shadow-bubble"
          >
            <Users className="w-5 h-5" />
            Create Group
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Select members
  return (
    <div className="flex flex-col h-full animate-slide-up">
      {/* Header */}
      <header
        className="bg-wa-header px-2 pb-2 flex items-center gap-2 flex-shrink-0"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
      >
        <button
          type="button"
          onClick={onBack}
          className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-wa-header-fg text-[18px] font-bold font-display">
            New Group
          </h1>
          <p className="text-wa-header-fg/60 text-[12px]">
            {selectedIds.size > 0
              ? `${selectedIds.size} participant${selectedIds.size > 1 ? "s" : ""} selected`
              : "Select participants"}
          </p>
        </div>
        {selectedIds.size > 0 && (
          <button
            type="button"
            onClick={() => setStep("set-name")}
            className="w-10 h-10 bg-wa-green rounded-full flex items-center justify-center hover:brightness-105 active:brightness-95 transition-all"
            aria-label="Next"
          >
            <Check className="w-5 h-5 text-white" />
          </button>
        )}
      </header>

      {/* Selected chips */}
      {selectedIds.size > 0 && (
        <div className="bg-card px-3 py-2 border-b border-border flex gap-2 overflow-x-auto flex-shrink-0">
          {selectedContacts.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleContact(c.id)}
              className="flex flex-col items-center gap-0.5 flex-shrink-0"
              aria-label={`Remove ${c.name}`}
            >
              <div className="relative">
                <ContactAvatar
                  initials={c.initials}
                  size="sm"
                  colorIndex={c.colorIndex}
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-muted-foreground rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">✕</span>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground truncate max-w-[44px]">
                {c.name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Contacts list */}
      <main className="flex-1 overflow-y-auto bg-card divide-y divide-border/60">
        {CONTACTS.map((contact, i) => {
          const isSelected = selectedIds.has(contact.id);
          const ocidIndex = i + 1;
          return (
            <button
              key={contact.id}
              type="button"
              data-ocid={`group.new.contact.checkbox.${ocidIndex}`}
              onClick={() => toggleContact(contact.id)}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/60 active:bg-muted transition-colors text-left"
              aria-pressed={isSelected}
            >
              <div className="relative">
                <ContactAvatar
                  initials={contact.initials}
                  size="md"
                  colorIndex={contact.colorIndex}
                />
                {isSelected && (
                  <div className="absolute inset-0 rounded-full bg-wa-green flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[15px] text-foreground font-display">
                  {contact.name}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  Hey there! I am using WhatsApp.
                </p>
              </div>
              {/* Checkbox visual */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected
                    ? "bg-wa-green border-wa-green"
                    : "border-muted-foreground/40"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
          );
        })}
      </main>
    </div>
  );
}
