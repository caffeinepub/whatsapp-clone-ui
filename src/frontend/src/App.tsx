import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
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
import NewGroupScreen from "./pages/NewGroupScreen";
import SettingsScreen from "./pages/SettingsScreen";
import StatusScreen from "./pages/StatusScreen";

export type TabName = "chats" | "calls" | "status" | "settings";
type AppView = "main" | "new-group";

// Extra conversations from new groups
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

export default function App() {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50">
      {/* Phone frame on desktop */}
      <div className="relative flex flex-col w-full max-w-[430px] h-screen overflow-hidden bg-background shadow-2xl">
        {/* Main content area */}
        <div className="flex-1 overflow-hidden relative">
          {/* New Group Screen overlays everything */}
          {appView === "new-group" ? (
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
                />
              )}
            </>
          )}

          {/* Call overlay — rendered inside the phone frame */}
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

          {/* Stage 6 overlay screens */}
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

        {/* Bottom nav — sticky, hidden when in chat view or new group */}
        {openConversationId === null && appView === "main" && (
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        )}
      </div>
      <Toaster />
    </div>
  );
}
