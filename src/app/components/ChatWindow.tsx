"use client";
import { useEffect, useRef, useState } from "react";
import { Message } from "../page";
import Image from "next/image";

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  typingText: string;
}

export default function ChatWindow({
  messages,
  isTyping,
  typingText,
}: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!hasMounted) return null;

  return (
    <div className="h-full p-4 overflow-y-auto space-y-4">
      {messages.map((msg, index) => (
        <div
          key={`${msg.timestamp}-${index}`}
          className={`flex flex-col max-w-[80%] ${
            msg.sender === "user" ? "items-end ml-auto" : "items-start mr-auto"
          }`}
        >
          <div
            className={`flex items-center space-x-2 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center flex-shrink-0 overflow-hidden">
              {msg.sender === "user" ? (
                "👤"
              ) : (
                <Image
                  src="/images/dinkle.png"
                  alt="Dinkle Duck"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              )}
            </div>

            <div
              className={`p-3 m-2 rounded-xl ${
                msg.sender === "user"
                  ? "bg-amber-300 text-black"
                  : "bg-yellow-500 text-black"
              }`}
            >
              {msg.text}
            </div>
          </div>
          {hasMounted && (
            <span className="text-xs text-gray-400 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
      ))}

      {isTyping && (
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-white flex items-center justify-center overflow-hidden">
            <Image
              src="/images/dinkle.png"
              alt="Dinkle Duck"
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-3 rounded-xl bg-gray-700 text-white animate-pulse">
            {typingText}
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
