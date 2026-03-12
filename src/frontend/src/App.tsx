import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import AdvancedSearchScreen from "./components/AdvancedSearchScreen";
import BottomNav from "./components/BottomNav";
import BroadcastListsScreen from "./components/BroadcastListsScreen";
import CallOverlay from "./components/CallOverlay";
import MediaGalleryScreen from "./components/MediaGalleryScreen";
import QRCodeScreen from "./components/QRCodeScreen";
import StarredMessagesScreen from "./components/StarredMessagesScreen";
import StatusViewer from "./components/StatusViewer";
import { useAppState } from "./hooks/useAppState";
import AIChatScreen from "./pages/AIChatScreen";
import AppLockScreen from "./pages/AppLockScreen";
import BlockedContactsScreen from "./pages/BlockedContactsScreen";
import BusinessProfileScreen from "./pages/BusinessProfileScreen";
import BusinessSettingsScreen from "./pages/BusinessSettingsScreen";
import CallsScreen from "./pages/CallsScreen";
import ChatBackupScreen from "./pages/ChatBackupScreen";
import ChatListScreen from "./pages/ChatListScreen";
import ChatLockScreen from "./pages/ChatLockScreen";
import ChatViewScreen from "./pages/ChatViewScreen";
import CommunitiesScreen from "./pages/CommunitiesScreen";
import ContactListScreen from "./pages/ContactListScreen";
import GroupAdminScreen from "./pages/GroupAdminScreen";
import LinkedDevicesScreen from "./pages/LinkedDevicesScreen";
import LiveScreen from "./pages/LiveScreen";
import LoginScreen from "./pages/LoginScreen";
import MarketplaceScreen from "./pages/MarketplaceScreen";
import NewGroupScreen from "./pages/NewGroupScreen";
import NotificationsCenterScreen from "./pages/NotificationsCenterScreen";
import OTPScreen from "./pages/OTPScreen";
import PaymentsScreen from "./pages/PaymentsScreen";
import ProfileCreationScreen from "./pages/ProfileCreationScreen";
import QuickRepliesSettingsScreen from "./pages/QuickRepliesSettingsScreen";
import ReelsScreen from "./pages/ReelsScreen";
import SecretChatsScreen from "./pages/SecretChatsScreen";
import SettingsScreen from "./pages/SettingsScreen";
import SplashScreen from "./pages/SplashScreen";
import StatusScreen from "./pages/StatusScreen";
import StorageScreen from "./pages/StorageScreen";
import TwoStepVerificationScreen from "./pages/TwoStepVerificationScreen";

export type TabName =
  | "chats"
  | "calls"
  | "status"
  | "communities"
  | "payments"
  | "settings"
  | "reels"
  | "live";
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
  { name: "Priya Sharma", initials: "PS", time: "1 hour ago", colorIndex: 4 },
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

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen min-h-[100dvh] bg-[#111b21] md:bg-muted/50">
      <div
        className="
          relative flex flex-col
          w-full h-screen h-[100dvh]
          md:w-[390px] md:max-w-[390px] md:h-[844px] md:max-h-[844px]
          md:rounded-[44px] md:overflow-hidden md:shadow-[0_0_0_10px_#1a1a2e,0_30px_80px_rgba(0,0,0,0.6)]
          overflow-hidden bg-background
        "
        style={{ touchAction: "pan-y" }}
      >
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    return localStorage.getItem("wa_auth_done") === "1" ? "app" : "splash";
  });
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const [loginValue, setLoginValue] = useState("");

  const [activeTab, setActiveTab] = useState<TabName>("chats");
  const handleTabChange = (tab: TabName) => {
    setActiveTab(tab);
    if (tab === "calls") setMissedCallsCount(0);
  };
  const [openConversationId, setOpenConversationId] = useState<bigint | null>(
    null,
  );
  const [appView, setAppView] = useState<AppView>("main");
  const [seedConversations, setSeedConversations] = useState<
    typeof SEED_EXTRA_CONVS
  >([]);

  // Overlay states
  const [starredOpen, setStarredOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const [chatLockOpen, setChatLockOpen] = useState(false);
  const [quickRepliesOpen, setQuickRepliesOpen] = useState(false);
  const [twoStepOpen, setTwoStepOpen] = useState(false);
  const [linkedDevicesOpen, setLinkedDevicesOpen] = useState(false);
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [businessProfileOpen, setBusinessProfileOpen] = useState(false);
  const [businessSettingsOpen, setBusinessSettingsOpen] = useState(false);
  const [blockedContactsOpen, setBlockedContactsOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [secretChatsOpen, setSecretChatsOpen] = useState(false);
  const [chatBackupOpen, setChatBackupOpen] = useState(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [groupAdminOpen, setGroupAdminOpen] = useState(false);
  const [appLocked, setAppLocked] = useState(() => {
    return localStorage.getItem("wa_app_lock_enabled") === "1";
  });
  const [missedCallsCount, setMissedCallsCount] = useState(3);
  const [notificationCount] = useState(5);
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
      <MobileFrame>
        <SplashScreen onDone={() => setAuthState("login")} />
        <Toaster position="top-center" richColors closeButton />
      </MobileFrame>
    );
  }
  if (authState === "login") {
    return (
      <MobileFrame>
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
        <Toaster position="top-center" richColors closeButton />
      </MobileFrame>
    );
  }
  if (authState === "otp") {
    return (
      <MobileFrame>
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
        <Toaster position="top-center" richColors closeButton />
      </MobileFrame>
    );
  }
  if (authState === "profile") {
    return (
      <MobileFrame>
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
        <Toaster position="top-center" richColors closeButton />
      </MobileFrame>
    );
  }

  if (appLocked && localStorage.getItem("wa_app_lock_enabled") === "1") {
    const savedPin = localStorage.getItem("wa_app_lock_pin") ?? "0000";
    return (
      <MobileFrame>
        <AppLockScreen
          savedPin={savedPin}
          onUnlock={() => setAppLocked(false)}
        />
        <Toaster position="top-center" richColors closeButton />
      </MobileFrame>
    );
  }

  // Full-screen overlays
  if (aiChatOpen) {
    return (
      <MobileFrame>
        <AIChatScreen onBack={() => setAiChatOpen(false)} />
        <Toaster position="top-center" richColors closeButton />
      </MobileFrame>
    );
  }

  if (notificationsOpen) {
    return (
      <MobileFrame>
        <NotificationsCenterScreen onBack={() => setNotificationsOpen(false)} />
        <Toaster position="top-center" richColors closeButton />
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <div className="flex-1 overflow-hidden relative">
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
            onOpenGroupAdmin={() => setGroupAdminOpen(true)}
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
            {activeTab === "reels" && <ReelsScreen />}
            {activeTab === "live" && <LiveScreen />}
            {activeTab === "communities" && (
              <CommunitiesScreen onOpenChat={handleOpenChat} />
            )}
            {activeTab === "payments" && <PaymentsScreen />}
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
                onOpenStorage={() => setStorageOpen(true)}
                onOpenChatLock={() => setChatLockOpen(true)}
                onOpenQuickReplies={() => setQuickRepliesOpen(true)}
                onOpenTwoStep={() => setTwoStepOpen(true)}
                onOpenLinkedDevices={() => setLinkedDevicesOpen(true)}
                onOpenBusiness={() => setBusinessSettingsOpen(true)}
                onOpenAppLock={() => setAppLocked(true)}
                onOpenBlockedContacts={() => setBlockedContactsOpen(true)}
                onOpenSecretChats={() => setSecretChatsOpen(true)}
                onOpenChatBackup={() => setChatBackupOpen(true)}
              />
            )}
          </>
        )}

        {/* Call overlay */}
        {appState.activeCall && (
          <CallOverlay call={appState.activeCall} onEnd={appState.endCall} />
        )}

        {/* Status viewer */}
        {appState.statusViewerOpen && (
          <StatusViewer
            statusList={RECENT_STATUS_LIST}
            currentIndex={appState.statusViewerIndex}
            onClose={appState.closeStatusViewer}
          />
        )}

        {/* Standard overlays */}
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
        {storageOpen && <StorageScreen onBack={() => setStorageOpen(false)} />}
        {quickRepliesOpen && (
          <QuickRepliesSettingsScreen
            onBack={() => setQuickRepliesOpen(false)}
          />
        )}
        {chatLockOpen && (
          <ChatLockScreen onBack={() => setChatLockOpen(false)} />
        )}
        {mediaGalleryFor !== null && (
          <MediaGalleryScreen
            onBack={() => setMediaGalleryFor(null)}
            contactName={mediaGalleryFor}
          />
        )}
        {twoStepOpen && (
          <TwoStepVerificationScreen onBack={() => setTwoStepOpen(false)} />
        )}
        {linkedDevicesOpen && (
          <LinkedDevicesScreen onBack={() => setLinkedDevicesOpen(false)} />
        )}
        {businessSettingsOpen && (
          <BusinessSettingsScreen
            onBack={() => setBusinessSettingsOpen(false)}
            onOpenMarketplace={() => {
              setBusinessSettingsOpen(false);
              setMarketplaceOpen(true);
            }}
          />
        )}
        {businessProfileOpen && (
          <BusinessProfileScreen onBack={() => setBusinessProfileOpen(false)} />
        )}
        {blockedContactsOpen && (
          <BlockedContactsScreen onBack={() => setBlockedContactsOpen(false)} />
        )}
        {secretChatsOpen && (
          <SecretChatsScreen onBack={() => setSecretChatsOpen(false)} />
        )}
        {chatBackupOpen && (
          <ChatBackupScreen onBack={() => setChatBackupOpen(false)} />
        )}
        {marketplaceOpen && (
          <MarketplaceScreen onBack={() => setMarketplaceOpen(false)} />
        )}
        {groupAdminOpen && (
          <GroupAdminScreen onBack={() => setGroupAdminOpen(false)} />
        )}
        <AdvancedSearchScreen
          open={advancedSearchOpen}
          onClose={() => setAdvancedSearchOpen(false)}
        />

        {/* Meta AI floating button (only on chats tab) */}
        {activeTab === "chats" &&
          openConversationId === null &&
          appView === "main" && (
            <button
              type="button"
              data-ocid="ai_chat.open_modal_button"
              onClick={() => setAiChatOpen(true)}
              className="absolute bottom-4 right-4 w-13 h-13 rounded-full shadow-lg flex items-center justify-center z-40"
              style={{
                width: 52,
                height: 52,
                background: "linear-gradient(135deg, #7C3AED, #2563EB)",
                boxShadow: "0 4px 20px rgba(124,58,237,0.5)",
              }}
              aria-label="Meta AI"
            >
              <span className="text-2xl">✨</span>
            </button>
          )}

        {/* Notifications bell (only on chats tab) */}
        {activeTab === "chats" &&
          openConversationId === null &&
          appView === "main" &&
          notificationCount > 0 && (
            <button
              type="button"
              data-ocid="notifications.open_modal_button"
              onClick={() => setNotificationsOpen(true)}
              className="absolute top-3 right-16 w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center z-40 shadow-md"
              aria-label="Notifications"
            >
              <span className="text-[13px]">🔔</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                {notificationCount}
              </span>
            </button>
          )}
      </div>

      {openConversationId === null && appView === "main" && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          missedCallsCount={missedCallsCount}
        />
      )}

      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{ style: { marginTop: "env(safe-area-inset-top, 8px)" } }}
      />
    </MobileFrame>
  );
}
