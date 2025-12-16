"use client";

import { useEffect, useState } from "react";
import SelectionCard from "@/components/ui/SelectionCard";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(false);

  // 1. INITIAL LOAD & SYNC
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const pref = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (saved === "dark" || (!saved && pref)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // 2. MOUSE TRACKER
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 3. TOGGLE
  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    
    // Force HTML class update
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <main 
      className={`
        flex min-h-screen flex-col items-center justify-center relative overflow-hidden transition-colors duration-1000 font-sans
        ${isDark ? "bg-[#050505] text-white" : "bg-[#F5F5F7] text-black"} 
      `}
    >
      
      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Teal Blob */}
        <div className={`absolute top-[-10%] left-[-10%] w-[70vw] h-[70vh] rounded-full mix-blend-multiply filter blur-[100px] animate-blob transition-colors duration-1000 
          ${isDark ? "bg-indigo-800/30 opacity-50" : "bg-[#008080]/70 opacity-75"}`} 
        />
        {/* Silver Blob */}
        <div className={`absolute top-[10%] right-[-10%] w-[70vw] h-[70vh] rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 transition-colors duration-1000 
          ${isDark ? "bg-cyan-800/30 opacity-50" : "bg-[#CACFD6] opacity-85"}`} 
        />
        {/* Taupe Blob */}
        <div className={`absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vh] rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000 transition-colors duration-1000 
          ${isDark ? "bg-slate-800/40 opacity-50" : "bg-[#816C61]/70 opacity-75"}`} 
        />
      </div>

      {/* Cursor Spotlight */}
      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${isDark ? 'rgba(120, 120, 255, 0.1)' : 'rgba(255, 255, 255, 0.6)'}, transparent 50%)`
        }} 
      />

      {/* Noise */}
      <div className={`absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]`} />


      {/* --- UI CONTENT --- */}
      <button
        onClick={toggleTheme}
        className={`
          absolute top-8 right-8 z-[60] p-3 rounded-full backdrop-blur-xl shadow-lg border transition-all duration-300 hover:scale-110 active:scale-95
          ${isDark 
            ? "bg-white/10 border-white/10 text-stone-300 hover:bg-white/20" 
            : "bg-white/80 border-white/50 text-black hover:bg-white"
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

      <div className="z-10 flex flex-col items-center w-full px-4">
        <div className="mb-24 text-center animate-[fadeInDown_1.5s_ease-out_forwards] opacity-0">
          <h1 className={`font-light text-8xl md:text-9xl tracking-tighter mb-2 drop-shadow-sm select-none transition-colors duration-700 ${isDark ? "text-stone-100" : "text-black"}`}>
            shadow
          </h1>
          <p className={`uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold pl-2 transition-colors duration-700 ${isDark ? "text-stone-500" : "text-black"}`}>
            Intelligence Redefined
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 w-full max-w-2xl animate-[fadeInUp_1.5s_ease-out_0.5s_forwards] opacity-0">
          <div className="flex-1 flex justify-center">
            {/* PASSING THE PROP HERE IS THE KEY */}
            <SelectionCard title="chat" href="/chat" isDark={isDark} />
          </div>
          <div className="flex-1 flex justify-center">
            {/* PASSING THE PROP HERE IS THE KEY */}
            <SelectionCard title="build" disabled={true} comingSoon={true} isDark={isDark} />
          </div>
        </div>
      </div>

      <div className={`absolute bottom-10 text-[9px] uppercase tracking-widest font-bold opacity-50 transition-colors duration-700 ${isDark ? "text-stone-600" : "text-black"}`}>
        Designed for Clarity
      </div>

      <style jsx global>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}