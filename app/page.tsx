import SelectionCard from "@/components/ui/SelectionCard";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden transition-colors duration-700">
      
      {/* --- BACKGROUND LAYERS --- */}
      
      {/* Light Mode Gradient: Soft Pink top -> Off-White bottom */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-rose-100/40 via-stone-50/50 to-white dark:hidden" />
      
      {/* Dark Mode Gradient: Deep Charcoal -> Pure Black */}
      <div className="absolute inset-0 -z-20 hidden dark:block bg-gradient-to-b from-stone-900 via-black to-black" />

      {/* Glass Orb 1 (Top Left decoration) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-200/20 rounded-full blur-[100px] pointer-events-none dark:bg-indigo-900/10" />
      
      {/* Glass Orb 2 (Bottom Right decoration) */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[100px] pointer-events-none dark:bg-purple-900/10" />


      {/* --- CONTENT --- */}

      {/* Theme Toggle (Top Right) */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="z-10 flex flex-col items-center w-full px-4">
        
        {/* Branding */}
        <div className="mb-20 text-center animate-fade-in-down">
          <h1 className="font-sans font-light text-6xl md:text-8xl tracking-tight text-stone-800 dark:text-white mb-2 drop-shadow-sm">
            shadow
          </h1>
          <p className="text-stone-400 dark:text-stone-500 uppercase tracking-[0.4em] text-xs font-medium">
            Intelligence Redefined
          </p>
        </div>

        {/* Cards Container (Responsive: Stack on mobile, Row on desktop) */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 w-full max-w-2xl">
          <SelectionCard 
            title="chat" 
            href="/chat" 
          />
          <SelectionCard 
            title="build" 
            disabled={true} 
            comingSoon={true} 
          />
        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-stone-300 dark:text-stone-700 text-[10px] uppercase tracking-widest font-medium">
        Designed for Clarity
      </div>

    </main>
  );
}