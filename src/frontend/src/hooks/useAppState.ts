import { useCallback, useEffect, useState } from "react";

export interface ActiveCall {
  name: string;
  initials: string;
  kind: "voice" | "video";
  colorIndex: number;
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

interface AppState {
  darkMode: boolean;
  activeCall: ActiveCall | null;
  statusViewerOpen: boolean;
  statusViewerIndex: number;
  userProfile: UserProfile;
  userStatuses: UserStatus[];
  openCall: (contact: ActiveCall) => void;
  endCall: () => void;
  openStatusViewer: (index: number) => void;
  closeStatusViewer: () => void;
  toggleDarkMode: () => void;
  updateProfile: (name: string, bio: string) => void;
  addUserStatus: (text: string) => void;
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
  const [statusViewerOpen, setStatusViewerOpen] = useState(false);
  const [statusViewerIndex, setStatusViewerIndex] = useState(0);

  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    loadFromStorage("wa-profile", DEFAULT_PROFILE),
  );

  const [userStatuses, setUserStatuses] = useState<UserStatus[]>([]);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("wa-dark-mode", JSON.stringify(darkMode));
  }, [darkMode]);

  const openCall = useCallback((contact: ActiveCall) => {
    setActiveCall(contact);
  }, []);

  const endCall = useCallback(() => {
    setActiveCall(null);
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

  return {
    darkMode,
    activeCall,
    statusViewerOpen,
    statusViewerIndex,
    userProfile,
    userStatuses,
    openCall,
    endCall,
    openStatusViewer,
    closeStatusViewer,
    toggleDarkMode,
    updateProfile,
    addUserStatus,
  };
}
