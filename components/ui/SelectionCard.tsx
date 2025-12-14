import Link from "next/link";

interface SelectionCardProps {
  title: string;
  href?: string;
  disabled?: boolean;
  comingSoon?: boolean;
}

export default function SelectionCard({ 
  title, 
  href = "#", 
  disabled = false, 
  comingSoon = false 
}: SelectionCardProps) {
  
  // GLASS BASE: Heavy blur, translucent background, subtle border
  const baseStyles = "relative w-full sm:w-72 h-44 rounded-[2rem] border flex items-center justify-center transition-all duration-500 backdrop-blur-2xl";
  
  // LIGHT MODE: White tint with pinkish glow on hover
  // DARK MODE: Black tint with deep shine
  const activeStyles = `
    border-white/40 bg-white/30 hover:bg-white/50 hover:border-white/60 hover:shadow-[0_8px_32px_0_rgba(255,182,193,0.15)] hover:-translate-y-1
    dark:border-white/10 dark:bg-black/20 dark:hover:bg-white/5 dark:hover:border-white/20 dark:hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
    cursor-pointer
  `;
  
  const disabledStyles = `
    border-white/20 bg-white/10 opacity-60 cursor-not-allowed
    dark:border-white/5 dark:bg-white/5
  `;

  const content = (
    <>
      <span className={`text-2xl font-light tracking-widest font-sans ${disabled ? "text-stone-400" : "text-stone-600 dark:text-stone-200"}`}>
        {title}
      </span>
      {comingSoon && (
        <span className="absolute -top-3 right-4 bg-white/80 dark:bg-stone-800/80 backdrop-blur-md text-[10px] uppercase tracking-wider px-3 py-1 rounded-full text-stone-500 shadow-sm">
          soon
        </span>
      )}
    </>
  );

  if (disabled) {
    return <div className={`${baseStyles} ${disabledStyles}`}>{content}</div>;
  }

  return (
    <Link href={href} className={`group ${baseStyles} ${activeStyles}`}>
      {content}
    </Link>
  );
}