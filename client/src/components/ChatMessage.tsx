import { cn } from "@/lib/utils";
import type { Message } from "@/types";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-xl",
        isUser ? "bg-primary/5" : "bg-muted/50"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-1 min-w-0">
        <p className="text-sm font-medium">{isUser ? "You" : "Assistant"}</p>
        <div className="text-sm text-foreground whitespace-pre-wrap break-words">
          {message.content}
        </div>
      </div>
    </div>
  );
}
