"use client";
import { useEffect, useState, useRef } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { typing_message, quack_message } from "./utils/messsages";

export interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: number;
}

const LOCAL_STORAGE_KEY = "chat_messages";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  const quackAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
    quackAudioRef.current = new Audio("/quack.mp3");
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  async function handleSend(message: string) {
    const timestamp = Date.now();
    const userMessage: Message = { sender: "user", text: message, timestamp };
    setMessages((prev) => [...prev, userMessage]);

    const randomTyping =
      typing_message[Math.floor(Math.random() * typing_message.length)];
    setTypingText(randomTyping);
    setIsTyping(true);

    await new Promise((res) => setTimeout(res, 1500));

    const quackReply =
      quack_message[Math.floor(Math.random() * quack_message.length)];
    const botMessage: Message = {
      sender: "bot",
      text: quackReply,
      timestamp: Date.now(),
    };

    if (!isMuted && quackAudioRef.current) {
      quackAudioRef.current.currentTime = 0;
      quackAudioRef.current.play().catch(() => {});
    }

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
    setTypingText("");
  }

  function handleClear() {
    setMessages([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-2xl h-[90vh] bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-hidden relative">
        <div className="flex justify-between items-center bg-gray-900 py-4 px-6 border-b border-gray-700">
          <div>
            <p className="text-xl font-semibold">dinkleberry the 10x swe</p>
            <p className="text-md">
              Trusted by Millions of Engineers Worldwide
            </p>
            <p className="text-xs">
              sometimes dinkleberry can be wrong because he is not
            </p>
          </div>
          <button
            onClick={() => setIsMuted((m) => !m)}
            aria-label={isMuted ? "Unmute quack sounds" : "Mute quack sounds"}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            typingText={typingText}
          />
        </div>
        <ChatInput onSend={handleSend} />
        <button
          onClick={handleClear}
          className="m-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
}
