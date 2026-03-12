import { Button } from "@/components/ui/button";
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
import { ArrowLeft, BadgeCheck, Camera } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  onBack: () => void;
}

export default function BusinessProfilePage({ onBack }: Props) {
  const [verified, setVerified] = useState(
    () => localStorage.getItem("bp_verified") === "true",
  );
  const [avatar, setAvatar] = useState<string | null>(
    () => localStorage.getItem("bp_avatar") ?? null,
  );
  const [name, setName] = useState(() => localStorage.getItem("bp_name") ?? "");
  const [category, setCategory] = useState(
    () => localStorage.getItem("bp_category") ?? "",
  );
  const [description, setDescription] = useState(
    () => localStorage.getItem("bp_description") ?? "",
  );
  const [address, setAddress] = useState(
    () => localStorage.getItem("bp_address") ?? "",
  );
  const [city, setCity] = useState(() => localStorage.getItem("bp_city") ?? "");
  const [website, setWebsite] = useState(
    () => localStorage.getItem("bp_website") ?? "",
  );
  const [email, setEmail] = useState(
    () => localStorage.getItem("bp_email") ?? "",
  );
  const [phone, setPhone] = useState(
    () => localStorage.getItem("bp_phone") ?? "",
  );

  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatar(dataUrl);
      localStorage.setItem("bp_avatar", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("bp_name", name);
    localStorage.setItem("bp_category", category);
    localStorage.setItem("bp_description", description);
    localStorage.setItem("bp_address", address);
    localStorage.setItem("bp_city", city);
    localStorage.setItem("bp_website", website);
    localStorage.setItem("bp_email", email);
    localStorage.setItem("bp_phone", phone);
    localStorage.setItem("bp_verified", verified ? "true" : "false");
    toast.success("Business profile saved!", { position: "top-center" });
  };

  const categories = [
    "Retail",
    "Restaurant",
    "Education",
    "Healthcare",
    "Finance",
    "Technology",
    "Beauty",
    "Automotive",
    "Other",
  ];

  return (
    <div
      data-ocid="business_profile.page"
      className="absolute inset-0 flex flex-col z-50 overflow-y-auto"
      style={{ background: "#0B141A", WebkitOverflowScrolling: "touch" }}
    >
      <header
        className="sticky top-0 z-10 bg-[#1F2C34] text-white flex items-center gap-3 px-3 py-3 flex-shrink-0"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
      >
        <button
          type="button"
          data-ocid="business_profile.close_button"
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[18px] font-bold flex-1">Business Profile</h1>
        <button
          type="button"
          data-ocid="business_profile.save_button"
          onClick={handleSave}
          className="text-[14px] font-semibold text-[#25D366] hover:text-green-400 transition-colors"
        >
          Save
        </button>
      </header>

      <div className="flex-1 pb-10">
        {/* Avatar */}
        <div className="flex flex-col items-center pt-6 pb-4">
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 rounded-full bg-[#1F2C34] overflow-hidden border-2 border-[#25D366]/30">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Business"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl">🏢</span>
                </div>
              )}
            </div>
            <button
              type="button"
              data-ocid="business_profile.upload_button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatar}
            />
          </div>
          {verified && (
            <div className="flex items-center gap-1 mt-2 text-[12px] text-[#25D366] font-medium">
              <BadgeCheck className="w-4 h-4" />
              Verified Business
            </div>
          )}
        </div>

        {/* Verified Badge Toggle */}
        <div className="bg-[#1F2C34] mx-0 px-4 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-[14px] font-medium text-white">Verified Badge</p>
            <p className="text-[12px] text-white/50">
              Show green verified checkmark
            </p>
          </div>
          <Switch
            data-ocid="business_profile.verified.switch"
            checked={verified}
            onCheckedChange={setVerified}
            className="data-[state=checked]:bg-[#25D366]"
          />
        </div>

        <div className="h-3" />

        {/* Fields */}
        <div className="bg-[#1F2C34] px-4 py-4 space-y-4">
          <p className="text-[11px] font-semibold text-[#8696A0] uppercase tracking-widest">
            Business Info
          </p>
          <div className="space-y-1">
            <Label className="text-[12px] text-[#8696A0]">Business Name</Label>
            <Input
              data-ocid="business_profile.name.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your business name"
              className="bg-[#0B141A] border-[#2A3942] text-white placeholder:text-white/30 focus:border-[#25D366]"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[12px] text-[#8696A0]">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                data-ocid="business_profile.category.select"
                className="bg-[#0B141A] border-[#2A3942] text-white"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1F2C34] border-[#2A3942]">
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="text-white">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-[12px] text-[#8696A0]">Description</Label>
            <Textarea
              data-ocid="business_profile.description.textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does your business do?"
              rows={3}
              className="bg-[#0B141A] border-[#2A3942] text-white placeholder:text-white/30 focus:border-[#25D366] resize-none"
            />
          </div>
        </div>

        <div className="h-3" />

        <div className="bg-[#1F2C34] px-4 py-4 space-y-4">
          <p className="text-[11px] font-semibold text-[#8696A0] uppercase tracking-widest">
            Location
          </p>
          <div className="space-y-1">
            <Label className="text-[12px] text-[#8696A0]">Address</Label>
            <Input
              data-ocid="business_profile.address.input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address"
              className="bg-[#0B141A] border-[#2A3942] text-white placeholder:text-white/30 focus:border-[#25D366]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[12px] text-[#8696A0]">City</Label>
            <Input
              data-ocid="business_profile.city.input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="bg-[#0B141A] border-[#2A3942] text-white placeholder:text-white/30 focus:border-[#25D366]"
            />
          </div>
        </div>

        <div className="h-3" />

        <div className="bg-[#1F2C34] px-4 py-4 space-y-4">
          <p className="text-[11px] font-semibold text-[#8696A0] uppercase tracking-widest">
            Contact
          </p>
          <div className="space-y-1">
            <Label className="text-[12px] text-[#8696A0]">Website URL</Label>
            <Input
              data-ocid="business_profile.website.input"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourbusiness.com"
              type="url"
              className="bg-[#0B141A] border-[#2A3942] text-white placeholder:text-white/30 focus:border-[#25D366]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[12px] text-[#8696A0]">Email</Label>
            <Input
              data-ocid="business_profile.email.input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@yourbusiness.com"
              type="email"
              className="bg-[#0B141A] border-[#2A3942] text-white placeholder:text-white/30 focus:border-[#25D366]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[12px] text-[#8696A0]">Phone</Label>
            <Input
              data-ocid="business_profile.phone.input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              type="tel"
              className="bg-[#0B141A] border-[#2A3942] text-white placeholder:text-white/30 focus:border-[#25D366]"
            />
          </div>
        </div>

        <div className="px-4 pt-5">
          <Button
            data-ocid="business_profile.submit_button"
            onClick={handleSave}
            className="w-full bg-[#25D366] hover:bg-[#1DB954] text-white font-semibold rounded-full py-3 text-[15px]"
          >
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
