"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// --- TYPES ---
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [isDark, setIsDark] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Initial State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Shadow online. I am ready to analyze or assist. What is your directive?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- THEME SYNC ---
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const pref = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = saved === "dark" || (!saved && pref);

    setIsDark(shouldBeDark);
    if (shouldBeDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    if (newMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  // --- SCROLL LOGIC ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);


  // --- STREAMING FRONTEND LOGIC ---
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    // 1. Add User Message & Clear Input
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", content: inputValue };
    const newHistory = [...messages, newUserMsg];
    
    setMessages(newHistory);
    setInputValue("");
    setIsTyping(true);

    try {
      // 2. Init API Call
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newHistory.map(({ role, content }) => ({ role, content })) 
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      if (!response.body) throw new Error("No response body");

      // 3. Create Placeholder for AI Message
      const aiMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev, 
        { id: aiMsgId, role: "assistant", content: "" }
      ]);

      // 4. Read the Stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;
          
          setMessages((prev) => 
            prev.map((msg) => 
              msg.id === aiMsgId ? { ...msg, content: accumulatedText } : msg
            )
          );
        }
      }

    } catch (error) {
      console.error("Error:", error);
      const errorMsg: Message = { 
        id: Date.now().toString(), 
        role: "assistant", 
        content: "Connection interrupted. Shadow cannot reach the server." 
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div 
      className={`
        flex flex-col h-screen w-full relative overflow-hidden transition-colors duration-1000 font-sans
        ${isDark ? "bg-[#050505] text-white" : "bg-[#F5F5F7] text-black"} 
      `}
    >
      
      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[70vw] h-[70vh] rounded-full mix-blend-multiply filter blur-[100px] animate-blob transition-colors duration-1000 
          ${isDark ? "bg-indigo-800/30 opacity-50" : "bg-[#008080]/60 opacity-60"}`} 
        />
        <div className={`absolute top-[10%] right-[-10%] w-[70vw] h-[70vh] rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 transition-colors duration-1000 
          ${isDark ? "bg-cyan-800/30 opacity-50" : "bg-[#CACFD6] opacity-70"}`} 
        />
        <div className={`absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vh] rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000 transition-colors duration-1000 
          ${isDark ? "bg-slate-800/40 opacity-50" : "bg-[#816C61]/60 opacity-60"}`} 
        />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* --- HEADER --- */}
      <header className="flex-none h-20 px-6 flex items-center justify-between z-10">
        <Link 
          href="/"
          className={`text-2xl font-light tracking-tighter hover:opacity-70 transition-opacity ${isDark ? "text-white" : "text-black"}`}
        >
          shadow
        </Link>
        <button
          onClick={toggleTheme}
          className={`
            p-2 rounded-full backdrop-blur-md border transition-all hover:scale-105 active:scale-95
            ${isDark 
              ? "bg-white/10 border-white/10 text-stone-300" 
              : "bg-white/60 border-black/5 text-black"
            }
          `}
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </header>

      {/* --- CHAT AREA --- */}
      <main className="flex-1 overflow-y-auto px-4 py-8 relative z-0 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-8 pb-32">
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`
                  relative max-w-[85%] px-6 py-4 rounded-3xl text-sm md:text-base leading-relaxed tracking-wide shadow-sm
                  ${msg.role === "user" 
                    ? (isDark ? "bg-white text-black rounded-br-sm" : "bg-black text-white rounded-br-sm")
                    : (isDark 
                        ? "bg-white/5 border border-white/10 text-stone-200 backdrop-blur-md rounded-bl-sm" 
                        : "bg-white/60 border border-white/40 text-black backdrop-blur-md rounded-bl-sm shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)]")
                  }
                `}
              >
                {/* --- RENDER MARKDOWN INSTEAD OF PLAIN TEXT --- */}
                {msg.role === "assistant" ? (
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <div className="rounded-md overflow-hidden my-2 border border-white/10 shadow-lg">
                            <div className="bg-white/10 px-4 py-1 text-xs text-stone-400 font-mono border-b border-white/5">
                              {match[1]}
                            </div>
                            <SyntaxHighlighter
                              style={atomDark}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{ margin: 0, background: 'rgba(0,0,0,0.4)' }}
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code className={`font-mono text-sm px-1 py-0.5 rounded ${isDark ? "bg-white/10" : "bg-black/10"}`} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  // User messages are simple text
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {isTyping && !messages[messages.length - 1].content && (
            <div className="flex justify-start animate-pulse">
               <div className={`px-6 py-4 rounded-3xl rounded-bl-sm text-xs tracking-widest uppercase opacity-50 ${isDark ? "text-white" : "text-black"}`}>
                 Thinking...
               </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* --- INPUT AREA --- */}
      <div className="fixed bottom-0 left-0 w-full p-4 md:p-8 z-20 flex justify-center pointer-events-none">
        <form 
          onSubmit={handleSendMessage}
          className={`
            pointer-events-auto w-full max-w-2xl flex items-center gap-2 p-2 pr-2 rounded-full border backdrop-blur-2xl transition-all duration-300 shadow-xl
            ${isDark 
              ? "bg-black/40 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]" 
              : "bg-white/70 border-white/60 ring-1 ring-black/5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)]"
            }
          `}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className={`
              flex-1 bg-transparent px-6 py-3 outline-none text-base placeholder-opacity-50
              ${isDark ? "text-white placeholder-stone-400" : "text-black placeholder-stone-500"}
            `}
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={`
              p-3 rounded-full transition-all duration-300 flex items-center justify-center
              ${(!inputValue.trim() || isTyping) ? "opacity-30 cursor-not-allowed scale-90" : "opacity-100 hover:scale-105 active:scale-95"}
              ${isDark ? "bg-white text-black" : "bg-black text-white"}
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a.75.75 0 00.75.75h13.5a.75.75 0 00.75-.75V16.5a.75.75 0 011.5 0v2.25a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 18.75V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
      </div>

    </div>
  );
}