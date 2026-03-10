import { Input } from "@/components/ui/input";
import { ArrowLeft, Pencil, Search, UserPlus, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import ContactAvatar from "../components/ContactAvatar";

interface ContactListScreenProps {
  onBack: () => void;
  onSelectContact: (name: string) => void;
}

export const MOCK_CONTACTS = [
  { name: "Aanya Patel", phone: "+91 98765 43210", colorIndex: 0 },
  { name: "Arjun Mehta", phone: "+91 99887 66554", colorIndex: 1 },
  { name: "Ben Carter", phone: "+1 555 234 5678", colorIndex: 2 },
  { name: "Carla Santos", phone: "+55 11 9 8765 4321", colorIndex: 3 },
  { name: "David Kim", phone: "+82 10 1234 5678", colorIndex: 4 },
  { name: "Emma Wilson", phone: "+44 7700 900123", colorIndex: 0 },
  { name: "Fatima Al-Zahra", phone: "+971 50 123 4567", colorIndex: 1 },
  { name: "George Thompson", phone: "+1 555 876 5432", colorIndex: 2 },
  { name: "Hannah Müller", phone: "+49 151 12345678", colorIndex: 3 },
  { name: "Ivan Petrov", phone: "+7 916 123 4567", colorIndex: 4 },
  { name: "Jaya Krishnan", phone: "+91 87654 32109", colorIndex: 0 },
  { name: "Kevin O'Brien", phone: "+353 87 123 4567", colorIndex: 1 },
  { name: "Layla Hassan", phone: "+971 55 987 6543", colorIndex: 2 },
  { name: "Marco Rossi", phone: "+39 347 123 4567", colorIndex: 3 },
  { name: "Nina Johansson", phone: "+46 70 123 4567", colorIndex: 4 },
  { name: "Omar Farouq", phone: "+20 10 1234 5678", colorIndex: 0 },
  { name: "Priya Sharma", phone: "+91 76543 21098", colorIndex: 1 },
  { name: "Quinn Adams", phone: "+1 555 345 6789", colorIndex: 2 },
  { name: "Ravi Gupta", phone: "+91 65432 10987", colorIndex: 3 },
  { name: "Sofia Andrade", phone: "+351 912 345 678", colorIndex: 4 },
  { name: "Tariq Malik", phone: "+92 300 1234567", colorIndex: 0 },
  { name: "Uma Devi", phone: "+91 54321 09876", colorIndex: 1 },
  { name: "Victor Ngozi", phone: "+234 803 123 4567", colorIndex: 2 },
  { name: "Wendy Chang", phone: "+886 912 345 678", colorIndex: 3 },
  { name: "Xiu Li", phone: "+86 138 1234 5678", colorIndex: 4 },
  { name: "Yuki Tanaka", phone: "+81 90 1234 5678", colorIndex: 0 },
  { name: "Zara Ahmed", phone: "+92 321 9876543", colorIndex: 1 },
];

function getInitials(name: string) {
  const parts = name.split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function ContactListScreen({
  onBack,
  onSelectContact,
}: ContactListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filtered = MOCK_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery),
  );

  // Group alphabetically
  const grouped: Record<string, typeof MOCK_CONTACTS> = {};
  for (const contact of filtered) {
    const letter = contact.name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(contact);
  }
  const sortedLetters = Object.keys(grouped).sort();

  return (
    <div
      className="flex flex-col h-full bg-background"
      data-ocid="contacts.page"
    >
      {/* Sticky Header */}
      <header
        className="sticky top-0 z-50 bg-wa-header flex-shrink-0"
        style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 44px)" }}
      >
        <div className="px-4 pb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            data-ocid="contacts.back.button"
            className="p-2 -ml-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-wa-header-fg text-[20px] font-bold">
            Select contact
          </h1>
          <button
            type="button"
            onClick={() => setShowSearch((v) => !v)}
            data-ocid="contacts.search.button"
            className="p-2 text-wa-header-fg/80 hover:text-wa-header-fg rounded-full hover:bg-white/10 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        {showSearch && (
          <div className="px-4 pb-3">
            <Input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/10 border-white/20 text-wa-header-fg placeholder:text-wa-header-fg/50"
              autoFocus
              data-ocid="contacts.search_input"
            />
          </div>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Special rows */}
        <div className="border-b border-border">
          <button
            type="button"
            data-ocid="contacts.new_contact.button"
            className="flex items-center gap-4 w-full px-4 py-3 hover:bg-muted/50 transition-colors"
            onClick={() => {}}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "#25D366" }}
            >
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[15px] text-foreground">
                New contact
              </p>
            </div>
          </button>
          <button
            type="button"
            data-ocid="contacts.new_group.button"
            className="flex items-center gap-4 w-full px-4 py-3 hover:bg-muted/50 transition-colors"
            onClick={() => {}}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "#25D366" }}
            >
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[15px] text-foreground">
                New group
              </p>
            </div>
          </button>
        </div>

        {/* Contacts by letter */}
        {sortedLetters.map((letter) => (
          <div key={letter}>
            <div className="px-4 py-1.5 bg-muted/30">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "#075E54" }}
              >
                {letter}
              </p>
            </div>
            {grouped[letter].map((contact, idx) => (
              <motion.button
                key={contact.name}
                type="button"
                data-ocid={`contacts.item.${idx + 1}`}
                onClick={() => onSelectContact(contact.name)}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 w-full px-4 py-3 hover:bg-muted/50 transition-colors text-left"
              >
                <ContactAvatar
                  initials={getInitials(contact.name)}
                  size="md"
                  colorIndex={contact.colorIndex}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[15px] text-foreground truncate">
                    {contact.name}
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {contact.phone}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        ))}

        {filtered.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-16 gap-3"
            data-ocid="contacts.empty_state"
          >
            <p className="text-muted-foreground text-sm">No contacts found</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        type="button"
        data-ocid="contacts.fab.button"
        className="absolute bottom-6 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: "#25D366" }}
        onClick={() => {}}
      >
        <Pencil className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
