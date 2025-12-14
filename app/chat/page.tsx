import ChatInterface from "@/components/features/chat/ChatInterface";
import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="flex h-screen w-full bg-[#FDFCFB] dark:bg-black overflow-hidden relative">
      
      {/* Background Gradient for Chat Page (Subtle) */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/30 via-transparent to-transparent pointer-events-none dark:hidden" />

      {/* --- SIDEBAR (Glass Effect) --- */}
      <aside className="w-72 hidden md:flex flex-col z-20 
                        backdrop-blur-xl bg-white/40 dark:bg-stone-900/40 
                        border-r border-white/50 dark:border-white/5
                        shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        
        {/* Branding */}
        <div className="p-8 pb-4">
          <h1 className="font-sans font-light text-2xl tracking-tight text-stone-800 dark:text-white">
            shadow
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem active>New Chat</NavItem>
          <NavItem>History</NavItem>
          <NavItem>Settings</NavItem>
        </nav>

        {/* User Profile */}
        <div className="p-4 mx-4 mb-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/5 backdrop-blur-md flex items-center gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-200 to-stone-200 dark:from-stone-700 dark:to-stone-600 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-300">
            U
          </div>
          <div className="text-xs">
            <p className="font-medium text-stone-700 dark:text-stone-200">User</p>
            <p className="text-stone-400 dark:text-stone-500">Pro</p>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col relative z-10">
        
        {/* Mobile Header (Glass) */}
        <div className="md:hidden p-4 backdrop-blur-md bg-white/60 dark:bg-black/60 border-b border-white/20 sticky top-0 z-50 flex justify-between items-center">
          <span className="font-sans text-lg text-stone-800 dark:text-white">shadow</span>
        </div>

        {/* Chat Interface */}
        <ChatInterface />
      </main>

    </div>
  );
}

// Nav Item Helper
function NavItem({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={`w-full text-left px-4 py-3 rounded-2xl text-sm transition-all duration-300 ${
        active
          ? "bg-white/60 dark:bg-white/10 text-stone-800 dark:text-white font-medium shadow-sm border border-white/50 dark:border-white/5"
          : "text-stone-500 dark:text-stone-400 hover:bg-white/30 dark:hover:bg-white/5 hover:text-stone-700 dark:hover:text-stone-200"
      }`}
    >
      {children}
    </button>
  );
}