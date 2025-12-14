"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/components/ui/CodeBlock";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("Network error");
      if (!response.body) throw new Error("No body");

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...lastMsg, content: lastMsg.content + chunk }];
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto">
      
      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 scroll-smooth">
        {messages.map((m, index) => (
          <div
            key={index}
            className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] p-5 md:p-6 rounded-2xl text-sm leading-7 shadow-sm ${
                m.role === "user"
                  ? "bg-[#292524] text-stone-50 rounded-br-none" // Luxury Charcoal for User
                  : "bg-white border border-stone-100 text-stone-700 rounded-bl-none" // Clean White for AI
              }`}
            >
              <div className={`prose ${m.role === "user" ? "prose-invert" : "prose-stone"} max-w-none`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || "");
                      if (!inline && match) {
                        return <CodeBlock language={match[1]} value={String(children).replace(/\n$/, "")} />;
                      }
                      return (
                        <code className={`${m.role === "user" ? "bg-stone-700" : "bg-stone-100 text-amber-700"} px-1.5 py-0.5 rounded font-mono text-xs`} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
        
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-stone-300">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-white border border-stone-100 flex items-center justify-center shadow-sm">
              <span className="font-serif text-2xl text-stone-400">S</span>
            </div>
            <p className="font-light tracking-wide">How may I assist you today?</p>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-6 md:p-10 bg-gradient-to-t from-[#FAFAF9] via-[#FAFAF9] to-transparent">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            className="w-full pl-6 pr-14 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] text-stone-700 placeholder-stone-400 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your inquiry..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-stone-800 text-white rounded-xl hover:bg-black disabled:opacity-30 disabled:hover:bg-stone-800 transition-colors"
          >
            {/* Elegant Arrow Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
        <div className="text-center mt-3">
             <p className="text-[10px] text-stone-400 uppercase tracking-widest">Powered by Shadow AI</p>
        </div>
      </div>
    </div>
  );
}