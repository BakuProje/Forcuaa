import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface AnimatedLayerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const AnimatedLayerButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedLayerButtonProps
>(({ className, children, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="relative inline-block select-none py-6 px-8">
      {/* Outer wrapper to contain deco items and handle hover state */}
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Floating Heart 1 (Top Right) */}
        <motion.svg
          viewBox="0 0 24 24"
          animate={isHovered ? {
            y: [-12, -22, -12],
            scale: [1, 1.15, 1],
            rotate: [5, 15, 5],
          } : {
            y: [-12, -16, -12],
            scale: 1,
            rotate: 5,
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1 right-2 w-7 h-7 text-[#ffacd2] fill-[#ffacd2] drop-shadow-[0_3px_6px_rgba(244,63,94,0.35)] z-30 pointer-events-none"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </motion.svg>

        {/* Floating Heart 2 (Bottom Right) */}
        <motion.svg
          viewBox="0 0 24 24"
          animate={isHovered ? {
            y: [4, -6, 4],
            scale: [0.9, 1.05, 0.9],
            rotate: [-10, -20, -10],
          } : {
            y: [4, 0, 4],
            scale: 0.9,
            rotate: -10,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute -bottom-2 -right-4 w-6 h-6 text-[#ff8ebb] fill-[#ff8ebb] drop-shadow-[0_3px_6px_rgba(244,63,94,0.35)] z-30 pointer-events-none"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </motion.svg>

        {/* Twinkling Star 1 (Top Left) */}
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={isHovered ? {
            scale: [0.8, 1.3, 0.8],
            rotate: [0, 90, 180],
            opacity: [0.7, 1, 0.7],
          } : {
            scale: [0.9, 1.1, 0.9],
            rotate: [0, 45, 0],
            opacity: 0.8,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1 left-2.5 w-4.5 h-4.5 text-yellow-200 fill-yellow-200 drop-shadow-[0_0_4px_rgba(254,240,138,0.6)] z-30 pointer-events-none"
        >
          <path d="M12 3v3m0 12v3m-9-9h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" />
        </motion.svg>

        {/* Twinkling Star 2 (Bottom Left) */}
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          animate={isHovered ? {
            scale: [0.7, 1.2, 0.7],
            rotate: [0, -90, -180],
            opacity: [0.6, 1, 0.6],
          } : {
            scale: [0.8, 1, 0.8],
            rotate: 0,
            opacity: 0.7,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="absolute -bottom-1 left-6 w-3.5 h-3.5 text-white fill-white drop-shadow-[0_0_3px_rgba(255,255,255,0.6)] z-30 pointer-events-none"
        >
          <path d="M12 3v3m0 12v3m-9-9h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" />
        </motion.svg>

        {/* Twinkling Star 3 (Top Right Side) */}
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          animate={isHovered ? {
            scale: [0.7, 1.2, 0.7],
            rotate: [0, 90, 0],
            opacity: [0.5, 1, 0.5],
          } : {
            scale: [0.8, 1, 0.8],
            rotate: 0,
            opacity: 0.6,
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
          className="absolute top-1 right-10 w-3.5 h-3.5 text-yellow-100 fill-yellow-100 drop-shadow-[0_0_3px_rgba(254,240,138,0.5)] z-30 pointer-events-none"
        >
          <path d="M12 3v3m0 12v3m-9-9h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" />
        </motion.svg>

        {/* Outer 3D pink border halo ring */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full border-[3px] border-[#ffb3d6] pointer-events-none scale-102 z-0 transition-all duration-300",
            isHovered ? "opacity-100 scale-104 shadow-[0_0_15px_rgba(255,182,213,0.6)]" : "opacity-75 scale-102 shadow-none"
          )}
        />

        {/* The main button */}
        <button
          className={cn(
            "relative flex h-[58px] w-[240px] md:h-[62px] md:w-[260px] items-center justify-center rounded-full z-10",
            "cursor-pointer font-bold text-white text-lg md:text-xl tracking-wider select-none outline-none",
            "transition-all duration-300 ease-out",
            "bubble-3d-btn",
            isHovered ? "-translate-y-1 scale-103 brightness-105" : "",
            className
          )}
          ref={ref}
          {...props}
        >
          {/* Glass reflection top highlight bar */}
          <div className="absolute top-[2.5px] left-[6%] w-[88%] h-[28%] bg-gradient-to-b from-white/70 to-white/5 rounded-full pointer-events-none" />

          <span className="flex items-center justify-center drop-shadow-[0_2px_4px_rgba(206,18,87,0.6)] font-sans">
            {children}
          </span>
        </button>

        {/* Fluffy cloud bottom-left */}
        <motion.div 
          animate={isHovered ? {
            y: [-1, -4, -1],
            scale: 1.05,
          } : {
            y: [-1, 1, -1],
            scale: 1,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-2.5 -left-4 z-20 pointer-events-none filter drop-shadow-[0_4px_8px_rgba(255,105,180,0.3)]"
        >
          <svg viewBox="0 0 100 60" className="w-16 h-10">
            <defs>
              <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="75%" stopColor="#fff0f5" />
                <stop offset="100%" stopColor="#ffd2e5" />
              </linearGradient>
            </defs>
            <path 
              fill="url(#cloudGrad)" 
              d="M20 50 C10 50, 5 40, 10 32 C5 22, 22 15, 30 22 C38 10, 60 10, 68 20 C78 12, 92 22, 88 35 C96 42, 90 50, 80 50 Z" 
            />
          </svg>
        </motion.div>

        {/* Fluffy cloud bottom-right */}
        <motion.div 
          animate={isHovered ? {
            y: [-1, -4, -1],
            scale: 1.05,
          } : {
            y: [1, -1, 1],
            scale: 1,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute -bottom-2.5 -right-4 z-20 pointer-events-none filter drop-shadow-[0_4px_8px_rgba(255,105,180,0.3)]"
        >
          <svg viewBox="0 0 100 60" className="w-16 h-10">
            <path 
              fill="url(#cloudGrad)" 
              d="M20 50 C10 50, 5 40, 10 32 C5 22, 22 15, 30 22 C38 10, 60 10, 68 20 C78 12, 92 22, 88 35 C96 42, 90 50, 80 50 Z" 
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
});
AnimatedLayerButton.displayName = "AnimatedLayerButton";

export { AnimatedLayerButton };
