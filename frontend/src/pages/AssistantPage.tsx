import Sidemenu from "@/components/sidemenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface ChatResponse {
  data: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  function handleSend(message: string) {
    setMessages((prev) => [
      ...prev,
      { text: message, isUser: true },
      {
        text: "The ai is loading your outfit",
        isUser: false,
        status: "loading",
      },
    ]);
    getData(message);
  }
  async function getData(input?: string) {
    let url = "http://127.0.0.1:8000/chatgpt";
    if (input) {
      url += `?message=${encodeURIComponent(input)}`;
    }

    try {
      const res = await fetch(url);
      const result: ChatResponse = await res.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.status === "loading" && !msg.isUser
            ? {
                text: result.data,
                isUser: false,
                status: "success",
              }
            : msg,
        ),
      );
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "An error occured", isUser: false, status: "error" },
      ]);
      console.error(err);
    }
  }

  return (
    <div className="flex gap-3">
      <Sidemenu />
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 overflow-auto pb-[125px] sm:pb-[70px]">
          <ScrollArea className="h-full px-4 py-6 md:px-8 space-y-6 max-w-3xl mx-auto">
            <Chat messages={messages} />
          </ScrollArea>
          <ChatBar onSend={handleSend} />
        </main>
      </div>
    </div>
  );
}

interface ChatBarProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

function ChatBar({ onSend, placeholder = "Type your message…" }: ChatBarProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;
    onSend(text);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" fixed bottom-16 sm:bottom-0 w-full h-16 bg-gray/20 backdrop-blur-md border-t border-border px-4 flex items-center gap-2 "
    >
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit">Send</Button>
    </form>
  );
}

interface ChatsProps {
  messages: Message[];
}

function Chat({ messages }: ChatsProps) {
  return (
    <div className="flex flex-col gap-6">
      {messages.map((msg, i) => (
        <div key={i} className="flex flex-col">
          <ChatBubble text={msg.text} isUser={msg.isUser} />
          <Skeleton key={i} className="w-full  h-6 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

interface ChatProps {
  text: string;
  isUser: boolean;
}

function ChatBubble({ text, isUser }: ChatProps) {
  return (
    <div
      className={` rounded-xl p-2 px-3 ${isUser === true ? "self-end bg-[#303030]" : "self-start"}`}
    >
      {text}
    </div>
  );
}

type Status = "loading" | "error" | "success";

interface Message {
  text: string;
  isUser: boolean;
  status?: Status;
}
