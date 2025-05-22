"use client";
import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-gray-700 flex items-center space-x-2"
    >
      <input
        type="text"
        className="flex-1 p-3 border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Send a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
      >
        Send
      </button>
    </form>
  );
}
