import Link from "next/link";

interface SelectionCardProps {
  title: string;
  href?: string;
  disabled?: boolean;
  comingSoon?: boolean;
  isDark?: boolean; // <--- NEW PROP
}

export default function SelectionCard({ 
  title, 
  href = "#", 
  disabled = false, 
  comingSoon = false,
  isDark = false // Default to false if not passed
}: SelectionCardProps) {
  
  const baseStyles = "relative w-full sm:w-80 h-48 rounded-[2rem] border flex items-center justify-center transition-all duration-500 backdrop-blur-2xl overflow-hidden group";
  
  // CONTAINER STYLES (Glass Slabs)
  const activeStyles = isDark 
    ? `
      /* Dark Mode Container */
      bg-white/5 border-white/10 shadow-none
      hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]
      cursor-pointer
    `
    : `
      /* Light Mode Container */
      bg-gradient-to-br from-white/80 via-white/50 to-white/30
      border-white/60 ring-1 ring-black/5
      shadow-[0_8px_30px_rgb(0,0,0,0.12)]
      hover:scale-[1.02] 
      hover:bg-gradient-to-br hover:from-white/90 hover:via-white/60 hover:to-white/40
      hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)]
      cursor-pointer
    `;
  
  const disabledStyles = isDark
    ? "border-white/5 bg-white/5 cursor-not-allowed"
    : "border-black/5 bg-gray-200/20 cursor-not-allowed";

  // TEXT COLOR LOGIC (Manual Override)
  // If Dark Mode: Stone-200
  // If Light Mode: PURE BLACK
  const textColor = isDark ? "text-stone-200" : "text-black";
  
  // DISABLED TEXT COLOR
  // If Dark Mode: Stone-500
  // If Light Mode: Black with 40% opacity (visible but distinct)
  const disabledTextColor = isDark ? "text-stone-500" : "text-black/40";

  const content = (
    <>
      {/* Shine Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-r from-transparent ${isDark ? "via-white/10" : "via-white/80"} to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] z-0`} style={{ transition: 'transform 0.7s ease' }} />

      {/* Title */}
      <span className={`relative z-10 text-3xl font-normal tracking-widest font-sans transition-colors duration-300 ${disabled ? disabledTextColor : textColor} ${!disabled && "group-hover:opacity-80"}`}>
        {title}
      </span>
      
      {comingSoon && (
        <span className={`absolute top-6 right-6 z-10 backdrop-blur-sm text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm font-bold border ${isDark ? "bg-white/10 text-stone-400 border-white/10" : "bg-white text-black border-stone-300"}`}>
          soon
        </span>
      )}
    </>
  );

  if (disabled) {
    return <div className={`${baseStyles} ${disabledStyles}`}>{content}</div>;
  }

  return (
    <Link href={href} className={`${baseStyles} ${activeStyles}`}>
      {content}
    </Link>
  );
}