import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import BottomNav from "./components/BottomNav";
import BroadcastListsScreen from "./components/BroadcastListsScreen";
import CallOverlay from "./components/CallOverlay";
import MediaGalleryScreen from "./components/MediaGalleryScreen";
import QRCodeScreen from "./components/QRCodeScreen";
import StarredMessagesScreen from "./components/StarredMessagesScreen";
import StatusViewer from "./components/StatusViewer";
import { useAppState } from "./hooks/useAppState";
import CallsScreen from "./pages/CallsScreen";
import ChatListScreen from "./pages/ChatListScreen";
import ChatViewScreen from "./pages/ChatViewScreen";
import CommunitiesScreen from "./pages/CommunitiesScreen";
import ContactListScreen from "./pages/ContactListScreen";
import LoginScreen from "./pages/LoginScreen";
import NewGroupScreen from "./pages/NewGroupScreen";
import OTPScreen from "./pages/OTPScreen";
import ProfileCreationScreen from "./pages/ProfileCreationScreen";
import SettingsScreen from "./pages/SettingsScreen";
import SplashScreen from "./pages/SplashScreen";
import StatusScreen from "./pages/StatusScreen";

export type TabName = "chats" | "calls" | "status" | "communities" | "settings";
type AppView = "main" | "new-group" | "contacts";
type AuthState = "splash" | "login" | "otp" | "profile" | "app";

const SEED_EXTRA_CONVS: {
  id: bigint;
  contactName: string;
  initials: string;
  lastMsg: string;
  time: string;
  unread: number;
  isGroup: boolean;
}[] = [];

const RECENT_STATUS_LIST = [
  {
    name: "Emma Rodriguez",
    initials: "ER",
    time: "2 minutes ago",
    colorIndex: 0,
  },
  {
    name: "Marcus Chen",
    initials: "MC",
    time: "15 minutes ago",
    colorIndex: 1,
  },
  {
    name: "Priya Sharma",
    initials: "PS",
    time: "1 hour ago",
    colorIndex: 4,
  },
  {
    name: "Jordan Williams",
    initials: "JW",
    time: "3 hours ago",
    colorIndex: 3,
  },
];

function getInitials(name: string) {
  const parts = name.split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function App() {
  // Auth flow
  const [authState, setAuthState] = useState<AuthState>(() => {
    return localStorage.getItem("wa_auth_done") === "1" ? "app" : "splash";
  });
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const [loginValue, setLoginValue] = useState("");

  // Main app state
  const [activeTab, setActiveTab] = useState<TabName>("chats");
  const [openConversationId, setOpenConversationId] = useState<bigint | null>(
    null,
  );
  const [appView, setAppView] = useState<AppView>("main");
  const [seedConversations, setSeedConversations] = useState<
    typeof SEED_EXTRA_CONVS
  >([]);

  // Stage 6 overlay states
  const [starredOpen, setStarredOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const [mediaGalleryFor, setMediaGalleryFor] = useState<string | null>(null);

  const appState = useAppState();

  const handleLoginNext = useCallback(
    (method: "phone" | "email", value: string) => {
      setLoginMethod(method);
      setLoginValue(value);
      setAuthState("otp");
    },
    [],
  );

  const handleOTPVerified = useCallback(() => {
    setAuthState("profile");
  }, []);

  const handleProfileDone = useCallback(
    (name: string, bio: string, _avatar?: string) => {
      appState.updateProfile(name, bio);
      localStorage.setItem("wa_auth_done", "1");
      setAuthState("app");
    },
    [appState.updateProfile],
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem("wa_auth_done");
    setAuthState("splash");
    setActiveTab("chats");
    setOpenConversationId(null);
    setAppView("main");
  }, []);

  const handleOpenChat = (conversationId: bigint) => {
    setOpenConversationId(conversationId);
  };

  const handleCloseChat = () => {
    setOpenConversationId(null);
  };

  const handleGroupCreated = (name: string, _members: string[]) => {
    const newConv = {
      id: BigInt(Date.now()),
      contactName: name,
      initials: name.slice(0, 2).toUpperCase(),
      lastMsg: "Group created",
      time: "Now",
      unread: 0,
      isGroup: true,
    };
    setSeedConversations((prev) => [newConv, ...prev]);
    setAppView("main");
    setActiveTab("chats");
  };

  const handleContactSelected = (contactName: string) => {
    // Create a new conversation with this contact
    const existing = seedConversations.find(
      (c) => c.contactName === contactName,
    );
    if (existing) {
      setAppView("main");
      setOpenConversationId(existing.id);
    } else {
      const newConv = {
        id: BigInt(Date.now()),
        contactName,
        initials: getInitials(contactName),
        lastMsg: "",
        time: "Now",
        unread: 0,
        isGroup: false,
      };
      setSeedConversations((prev) => [newConv, ...prev]);
      setAppView("main");
      setOpenConversationId(newConv.id);
    }
  };

  // --- Auth screens ---
  if (authState === "splash") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/50">
        <div className="relative flex flex-col w-full max-w-[430px] h-screen overflow-hidden bg-background shadow-2xl">
          <SplashScreen onDone={() => setAuthState("login")} />
        </div>
        <Toaster />
      </div>
    );
  }

  if (authState === "login") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/50">
        <div className="relative flex flex-col w-full max-w-[430px] h-screen overflow-hidden bg-background shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full"
            >
              <LoginScreen onNext={handleLoginNext} />
            </motion.div>
          </AnimatePresence>
        </div>
        <Toaster />
      </div>
    );
  }

  if (authState === "otp") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/50">
        <div className="relative flex flex-col w-full max-w-[430px] h-screen overflow-hidden bg-background shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full"
            >
              <OTPScreen
                method={loginMethod}
                value={loginValue}
                onVerified={handleOTPVerified}
                onBack={() => setAuthState("login")}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <Toaster />
      </div>
    );
  }

  if (authState === "profile") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/50">
        <div className="relative flex flex-col w-full max-w-[430px] h-screen overflow-hidden bg-background shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full"
            >
              <ProfileCreationScreen onDone={handleProfileDone} />
            </motion.div>
          </AnimatePresence>
        </div>
        <Toaster />
      </div>
    );
  }

  // --- Main app ---
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50">
      <div className="relative flex flex-col w-full max-w-[430px] h-screen overflow-hidden bg-background shadow-2xl">
        {/* Main content area */}
        <div className="flex-1 overflow-hidden relative">
          {/* Contacts screen */}
          {appView === "contacts" ? (
            <ContactListScreen
              onBack={() => setAppView("main")}
              onSelectContact={handleContactSelected}
            />
          ) : appView === "new-group" ? (
            <NewGroupScreen
              onBack={() => setAppView("main")}
              onGroupCreated={handleGroupCreated}
            />
          ) : openConversationId !== null ? (
            <ChatViewScreen
              conversationId={openConversationId}
              onBack={handleCloseChat}
              onOpenCall={appState.openCall}
              wallpaper={appState.wallpaper}
              onOpenMediaGallery={(contactName) =>
                setMediaGalleryFor(contactName)
              }
            />
          ) : (
            <>
              {activeTab === "chats" && (
                <ChatListScreen
                  onOpenChat={handleOpenChat}
                  onNewGroup={() => setAppView("new-group")}
                  extraConversations={seedConversations}
                  onOpenBroadcast={() => setBroadcastOpen(true)}
                  onOpenStarred={() => setStarredOpen(true)}
                  onOpenSettings={() => setActiveTab("settings")}
                  onOpenContacts={() => setAppView("contacts")}
                />
              )}
              {activeTab === "status" && (
                <StatusScreen
                  onOpenStatusViewer={appState.openStatusViewer}
                  userStatuses={appState.userStatuses}
                  onAddStatus={appState.addUserStatus}
                  onOpenStarred={() => setStarredOpen(true)}
                  onOpenSettings={() => setActiveTab("settings")}
                />
              )}
              {activeTab === "communities" && (
                <CommunitiesScreen onOpenChat={handleOpenChat} />
              )}
              {activeTab === "calls" && (
                <CallsScreen onOpenCall={appState.openCall} />
              )}
              {activeTab === "settings" && (
                <SettingsScreen
                  darkMode={appState.darkMode}
                  toggleDarkMode={appState.toggleDarkMode}
                  userProfile={appState.userProfile}
                  onUpdateProfile={appState.updateProfile}
                  wallpaper={appState.wallpaper}
                  onWallpaperChange={appState.setWallpaper}
                  onOpenQRCode={() => setQrCodeOpen(true)}
                  onLogout={handleLogout}
                />
              )}
            </>
          )}

          {/* Call overlay */}
          {appState.activeCall && (
            <CallOverlay call={appState.activeCall} onEnd={appState.endCall} />
          )}

          {/* Status viewer overlay */}
          {appState.statusViewerOpen && (
            <StatusViewer
              statusList={RECENT_STATUS_LIST}
              currentIndex={appState.statusViewerIndex}
              onClose={appState.closeStatusViewer}
            />
          )}

          {/* Stage 6 overlays */}
          {starredOpen && (
            <StarredMessagesScreen onBack={() => setStarredOpen(false)} />
          )}
          {broadcastOpen && (
            <BroadcastListsScreen onBack={() => setBroadcastOpen(false)} />
          )}
          {qrCodeOpen && (
            <QRCodeScreen
              onBack={() => setQrCodeOpen(false)}
              userName={appState.userProfile.name}
            />
          )}
          {mediaGalleryFor !== null && (
            <MediaGalleryScreen
              onBack={() => setMediaGalleryFor(null)}
              contactName={mediaGalleryFor}
            />
          )}
        </div>

        {/* Bottom nav */}
        {openConversationId === null && appView === "main" && (
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        )}
      </div>
      <Toaster />
    </div>
  );
}
