import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import CallOverlay from "./components/CallOverlay";
import StatusViewer from "./components/StatusViewer";
import { useAppState } from "./hooks/useAppState";
import CallsScreen from "./pages/CallsScreen";
import ChatListScreen from "./pages/ChatListScreen";
import ChatViewScreen from "./pages/ChatViewScreen";
import SettingsScreen from "./pages/SettingsScreen";
import StatusScreen from "./pages/StatusScreen";

export type TabName = "chats" | "status" | "calls" | "settings";

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

  const appState = useAppState();

  const handleOpenChat = (conversationId: bigint) => {
    setOpenConversationId(conversationId);
  };

  const handleCloseChat = () => {
    setOpenConversationId(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50">
      {/* Phone frame on desktop */}
      <div className="relative flex flex-col w-full max-w-[430px] h-screen overflow-hidden bg-background shadow-2xl">
        {/* Main content area */}
        <div className="flex-1 overflow-hidden relative">
          {/* Chat view overlays everything when open */}
          {openConversationId !== null ? (
            <ChatViewScreen
              conversationId={openConversationId}
              onBack={handleCloseChat}
              onOpenCall={appState.openCall}
            />
          ) : (
            <>
              {activeTab === "chats" && (
                <ChatListScreen onOpenChat={handleOpenChat} />
              )}
              {activeTab === "status" && (
                <StatusScreen
                  onOpenStatusViewer={appState.openStatusViewer}
                  userStatuses={appState.userStatuses}
                  onAddStatus={appState.addUserStatus}
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
        </div>

        {/* Bottom nav — hidden when in chat view */}
        {openConversationId === null && (
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        )}
      </div>
      <Toaster />
    </div>
  );
}
