import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatWindow } from "@/components/ChatWindow";
import type { Chat } from "@/types";
import "./App.css";

function App() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  function handleTitleUpdate(chatId: string, title: string) {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, title } : chat))
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        selectedChatId={selectedChatId}
        onSelectChat={setSelectedChatId}
        chats={chats}
        setChats={setChats}
      />
      <ChatWindow chatId={selectedChatId} onTitleUpdate={handleTitleUpdate} />
    </div>
  );
}

export default App;
