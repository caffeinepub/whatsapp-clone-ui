import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Briefcase } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BusinessProfileScreenProps {
  onBack: () => void;
}

export default function BusinessProfileScreen({
  onBack,
}: BusinessProfileScreenProps) {
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [about, setAbout] = useState("");
  const [mondayFriday, setMondayFriday] = useState("9:00 AM - 6:00 PM");
  const [saturday, setSaturday] = useState("Closed");
  const [sunday, setSunday] = useState("Closed");

  const handleSave = () => {
    toast.success("Business profile saved");
    onBack();
  };

  return (
    <div
      data-ocid="business.page"
      className="absolute inset-0 flex flex-col bg-background z-40 overflow-y-auto"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 bg-[#1F2C34] text-white flex items-center gap-3 px-3 py-3 flex-shrink-0"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
      >
        <button
          type="button"
          data-ocid="business.close_button"
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[18px] font-bold flex-1">Business Tools</h1>
        <button
          type="button"
          data-ocid="business.save_button"
          onClick={handleSave}
          className="text-[14px] font-semibold text-wa-green hover:text-green-400 transition-colors"
        >
          Save
        </button>
      </header>

      <div className="flex-1 pb-8">
        {/* Business account toggle */}
        <div className="bg-card mt-3 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-wa-green/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-wa-green" />
            </div>
            <div>
              <p className="font-semibold text-[15px] text-foreground">
                Business account
              </p>
              <p className="text-[12px] text-muted-foreground">
                Enable business features
              </p>
            </div>
          </div>
          <Switch
            data-ocid="business.account.switch"
            checked={isBusinessAccount}
            onCheckedChange={setIsBusinessAccount}
          />
        </div>

        {isBusinessAccount && (
          <>
            {/* Business info */}
            <div className="bg-card mt-3 px-4 py-4 space-y-4">
              <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
                Business Info
              </p>
              <div className="space-y-1.5">
                <Label className="text-[13px] text-muted-foreground">
                  Display name
                </Label>
                <Input
                  data-ocid="business.name.input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Business name"
                  className="h-10 text-[14px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] text-muted-foreground">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger
                    data-ocid="business.category.select"
                    className="h-10 text-[14px]"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] text-muted-foreground">
                  About
                </Label>
                <Textarea
                  data-ocid="business.about.textarea"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Describe your business..."
                  className="text-[14px] resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Contact info */}
            <div className="bg-card mt-3 px-4 py-4 space-y-4">
              <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
                Contact
              </p>
              <div className="space-y-1.5">
                <Label className="text-[13px] text-muted-foreground">
                  Address
                </Label>
                <Input
                  data-ocid="business.address.input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main Street, City"
                  className="h-10 text-[14px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] text-muted-foreground">
                  Website
                </Label>
                <Input
                  data-ocid="business.website.input"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.example.com"
                  className="h-10 text-[14px]"
                />
              </div>
            </div>

            {/* Business hours */}
            <div className="bg-card mt-3 px-4 py-4 space-y-4">
              <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
                Business Hours
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-foreground">
                    Monday – Friday
                  </span>
                  <Input
                    data-ocid="business.hours_weekday.input"
                    value={mondayFriday}
                    onChange={(e) => setMondayFriday(e.target.value)}
                    className="w-40 h-8 text-[12px] text-right"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-foreground">Saturday</span>
                  <Input
                    data-ocid="business.hours_saturday.input"
                    value={saturday}
                    onChange={(e) => setSaturday(e.target.value)}
                    className="w-40 h-8 text-[12px] text-right"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-foreground">Sunday</span>
                  <Input
                    data-ocid="business.hours_sunday.input"
                    value={sunday}
                    onChange={(e) => setSunday(e.target.value)}
                    className="w-40 h-8 text-[12px] text-right"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
