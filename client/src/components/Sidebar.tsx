import { useState, useEffect } from "react";
import { Plus, Trash2, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchChats, createChat, deleteChat } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Chat } from "@/types";

interface SidebarProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

export function Sidebar({ selectedChatId, onSelectChat, chats, setChats }: SidebarProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  async function loadChats() {
    try {
      const data = await fetchChats();
      setChats(data);
    } catch (error) {
      console.error("Failed to load chats:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateChat() {
    setIsCreating(true);
    try {
      const newChat = await createChat();
      setChats((prev) => [newChat, ...prev]);
      onSelectChat(newChat.id);
    } catch (error) {
      console.error("Failed to create chat:", error);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteChat(e: React.MouseEvent, chatId: string) {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (selectedChatId === chatId) {
        onSelectChat("");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  }

  return (
    <div className="w-64 border-r border-border bg-muted/30 flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-semibold mb-3">AI Chat</h1>
        <Button
          onClick={handleCreateChat}
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No chats yet
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg cursor-pointer group hover:bg-muted transition-colors",
                  selectedChatId === chat.id && "bg-muted"
                )}
              >
                <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate text-sm">{chat.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
