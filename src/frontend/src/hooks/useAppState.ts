import { useCallback, useEffect, useRef, useState } from "react";
import { playCallEndSound, playRingtone } from "../utils/audioUtils";

export interface ActiveCall {
  name: string;
  initials: string;
  kind: "voice" | "video";
  colorIndex: number;
  incoming?: boolean;
}

export interface UserProfile {
  name: string;
  bio: string;
}

export interface UserStatus {
  name: string;
  time: string;
  text: string;
}

export type WallpaperType = "default" | "light" | "dark" | "green";

const INCOMING_CALL_CONTACTS = [
  { name: "Emma Rodriguez", initials: "ER", colorIndex: 0 },
  { name: "Marcus Chen", initials: "MC", colorIndex: 1 },
  { name: "Priya Sharma", initials: "PS", colorIndex: 4 },
  { name: "Jordan Williams", initials: "JW", colorIndex: 3 },
  { name: "Alice Johnson", initials: "AJ", colorIndex: 2 },
];

interface AppState {
  darkMode: boolean;
  activeCall: ActiveCall | null;
  incomingCall: ActiveCall | null;
  statusViewerOpen: boolean;
  statusViewerIndex: number;
  userProfile: UserProfile;
  userStatuses: UserStatus[];
  wallpaper: WallpaperType;
  openCall: (contact: ActiveCall) => void;
  endCall: () => void;
  acceptIncomingCall: () => void;
  rejectIncomingCall: () => void;
  openStatusViewer: (index: number) => void;
  closeStatusViewer: () => void;
  toggleDarkMode: () => void;
  updateProfile: (name: string, bio: string) => void;
  addUserStatus: (text: string) => void;
  setWallpaper: (w: WallpaperType) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Alex Johnson",
  bio: "Building great things one line at a time ✨",
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useAppState(): AppState {
  const [darkMode, setDarkMode] = useState<boolean>(() =>
    loadFromStorage("wa-dark-mode", false),
  );

  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [incomingCall, setIncomingCall] = useState<ActiveCall | null>(null);
  const [statusViewerOpen, setStatusViewerOpen] = useState(false);
  const [statusViewerIndex, setStatusViewerIndex] = useState(0);

  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    loadFromStorage("wa-profile", DEFAULT_PROFILE),
  );

  const [userStatuses, setUserStatuses] = useState<UserStatus[]>([]);

  const [wallpaper, setWallpaperState] = useState<WallpaperType>(() =>
    loadFromStorage<WallpaperType>("wa-wallpaper", "default"),
  );

  const stopRingtoneRef = useRef<(() => void) | null>(null);
  const incomingCallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("wa-dark-mode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Listen for profile updates from other tabs/components
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("wa_realtime");
      channel.onmessage = (
        ev: MessageEvent<{ kind: string; name?: string; bio?: string }>,
      ) => {
        if (ev.data?.kind === "wa_profile_update" && ev.data.name) {
          const updated: UserProfile = {
            name: ev.data.name,
            bio: ev.data.bio ?? "",
          };
          setUserProfile(updated);
        }
      };
    } catch {
      // BroadcastChannel not supported
    }
    return () => channel?.close();
  }, []);

  // Simulate incoming calls every 60 seconds (30% chance)
  useEffect(() => {
    const schedule = () => {
      incomingCallTimerRef.current = setTimeout(
        () => {
          // Only trigger if not already in a call
          if (Math.random() < 0.3) {
            const contact =
              INCOMING_CALL_CONTACTS[
                Math.floor(Math.random() * INCOMING_CALL_CONTACTS.length)
              ];
            const call: ActiveCall = {
              ...contact,
              kind: Math.random() > 0.5 ? "video" : "voice",
              incoming: true,
            };
            setIncomingCall(call);
          }
          schedule();
        },
        60000 + Math.random() * 30000,
      );
    };
    schedule();
    return () => {
      if (incomingCallTimerRef.current)
        clearTimeout(incomingCallTimerRef.current);
    };
  }, []);

  // Play ringtone when incoming call arrives
  useEffect(() => {
    if (incomingCall) {
      stopRingtoneRef.current = playRingtone();
      // Auto-reject after 30 seconds if not answered
      const autoReject = setTimeout(() => {
        stopRingtoneRef.current?.();
        stopRingtoneRef.current = null;
        setIncomingCall(null);
      }, 30000);
      return () => clearTimeout(autoReject);
    }
    return undefined;
  }, [incomingCall]);

  const openCall = useCallback((contact: ActiveCall) => {
    setActiveCall(contact);
  }, []);

  const endCall = useCallback(() => {
    stopRingtoneRef.current?.();
    stopRingtoneRef.current = null;
    playCallEndSound();
    setActiveCall(null);
  }, []);

  const acceptIncomingCall = useCallback(() => {
    stopRingtoneRef.current?.();
    stopRingtoneRef.current = null;
    if (incomingCall) {
      setActiveCall({ ...incomingCall, incoming: false });
      setIncomingCall(null);
    }
  }, [incomingCall]);

  const rejectIncomingCall = useCallback(() => {
    stopRingtoneRef.current?.();
    stopRingtoneRef.current = null;
    playCallEndSound();
    setIncomingCall(null);
  }, []);

  const openStatusViewer = useCallback((index: number) => {
    setStatusViewerIndex(index);
    setStatusViewerOpen(true);
  }, []);

  const closeStatusViewer = useCallback(() => {
    setStatusViewerOpen(false);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const updateProfile = useCallback((name: string, bio: string) => {
    const updated = { name, bio };
    setUserProfile(updated);
    localStorage.setItem("wa-profile", JSON.stringify(updated));
  }, []);

  const addUserStatus = useCallback((text: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setUserStatuses((prev) => [
      { name: "My Status", time: `Today at ${timeStr}`, text },
      ...prev,
    ]);
  }, []);

  const setWallpaper = useCallback((w: WallpaperType) => {
    setWallpaperState(w);
    localStorage.setItem("wa-wallpaper", JSON.stringify(w));
  }, []);

  return {
    darkMode,
    activeCall,
    incomingCall,
    statusViewerOpen,
    statusViewerIndex,
    userProfile,
    userStatuses,
    wallpaper,
    openCall,
    endCall,
    acceptIncomingCall,
    rejectIncomingCall,
    openStatusViewer,
    closeStatusViewer,
    toggleDarkMode,
    updateProfile,
    addUserStatus,
    setWallpaper,
  };
}
