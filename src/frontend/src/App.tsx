import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import CallsScreen from "./pages/CallsScreen";
import ChatListScreen from "./pages/ChatListScreen";
import ChatViewScreen from "./pages/ChatViewScreen";
import SettingsScreen from "./pages/SettingsScreen";
import StatusScreen from "./pages/StatusScreen";

export type TabName = "chats" | "status" | "calls" | "settings";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>("chats");
  const [openConversationId, setOpenConversationId] = useState<bigint | null>(
    null,
  );

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
            />
          ) : (
            <>
              {activeTab === "chats" && (
                <ChatListScreen onOpenChat={handleOpenChat} />
              )}
              {activeTab === "status" && <StatusScreen />}
              {activeTab === "calls" && <CallsScreen />}
              {activeTab === "settings" && <SettingsScreen />}
            </>
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
