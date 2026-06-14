'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface ThreeDMarqueeProps {
  images?: string[];
  className?: string;
}

const defaultImages = [
  "/photos/1.jpeg",
  "/photos/2.jpeg",
  "/photos/3.jpeg",
  "/photos/4.png",
  "/photos/5.png",
  "/photos/6.jpg",
  "/photos/7.jpg",
  "/photos/8.jpg",
  "/photos/9.jpg",
  "/photos/10.jpg",
  "/photos/11.jpg",
  "/photos/12.jpg",
  "/photos/13.jpg",
  "/photos/14.jpg",
  "/photos/15.jpg",
  "/photos/16.jpg",
  "/photos/17.jpg",
  "/photos/18.jpg",
  "/photos/19.jpg",
];

const polaroidTexts = [
  "Cuaa ♥", "My Love", "Beautiful", "Together", "Love You",
  "Mine ♥", "Happy", "Smile!", "Always", "Only You",
  "Sweetheart", "Precious", "My Girl", "Perfect", "Cute ♥",
  "Adored", "Angel", "Memory", "Pure ♥"
];



// Predefined responsive coordinates and depth factors for 19 photos
const polaroidPositions = [
  // Left side (8 items)
  { x: 2, y: 5, z: -120, rotate: -6 },
  { x: 15, y: 10, z: 60, rotate: 8 },
  { x: 3, y: 26, z: -40, rotate: -10 },
  { x: 16, y: 36, z: 20, rotate: 6 },
  { x: 1, y: 52, z: 110, rotate: -8 },
  { x: 14, y: 64, z: -30, rotate: 5 },
  { x: 3, y: 78, z: 80, rotate: 11 },
  { x: 15, y: 88, z: -10, rotate: -4 },
  
  // Right side (8 items)
  { x: 80, y: 4, z: 40, rotate: 7 },
  { x: 91, y: 13, z: -90, rotate: -9 },
  { x: 81, y: 25, z: 30, rotate: 10 },
  { x: 92, y: 37, z: 120, rotate: -5 },
  { x: 79, y: 51, z: -110, rotate: 8 },
  { x: 90, y: 64, z: 50, rotate: -12 },
  { x: 80, y: 76, z: -20, rotate: 6 },
  { x: 91, y: 86, z: 90, rotate: -7 },

  // Center Top / Bottom (3 items)
  { x: 44, y: 3, z: -130, rotate: 5 },
  { x: 59, y: 5, z: -70, rotate: -6 },
  { x: 48, y: 91, z: 30, rotate: 8 },
];

const BackgroundSparkles = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 14 }).map((_, i) => {
        const size = Math.random() * 10 + 6; // size 6px to 16px
        const duration = Math.random() * 6 + 6; // 6s to 12s
        const delay = Math.random() * 5;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const isHeart = i % 2 === 0;
        
        return (
          <motion.div
            key={i}
            className="absolute opacity-0"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.15, 0.55, 0.15],
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {isHeart ? (
              <svg viewBox="0 0 24 24" fill="#ff6097" className="w-full h-full drop-shadow-[0_0_3px_rgba(255,96,151,0.6)]">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="#ffd54f" className="w-full h-full drop-shadow-[0_0_3px_rgba(255,213,79,0.6)]">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

const PolaroidCard = ({ src, index, x, y, z, rotate, mousePos }: any) => {
  // Parallax translation based on depth (Z)
  const parallaxX = mousePos.x * z * 0.45;
  const parallaxY = mousePos.y * z * 0.45;

  // Scale factor: closer cards are larger
  const scale = 1 + z / 650;
  // Opacity: deeper cards are slightly more transparent/dreamy
  const opacity = 0.5 + (z + 130) / 600;
  // Blur for distant background cards to create depth-of-field
  const blurAmount = z < -60 ? Math.min(2.5, Math.abs(z + 60) / 50) : 0;
  const text = polaroidTexts[index % polaroidTexts.length];

  return (
    <motion.div
      style={{
        left: `${x}%`,
        top: `${y}%`,
        zIndex: Math.round(z + 150),
        scale: scale,
        opacity: Math.max(0.25, Math.min(0.98, opacity)),
      }}
      animate={{
        x: parallaxX,
        y: parallaxY,
      }}
      transition={{
        type: "spring",
        stiffness: 45,
        damping: 20,
      }}
      className="absolute select-none pointer-events-none"
    >
      <motion.div
        animate={{
          y: [0, Math.sin(index) * 10, -Math.cos(index) * 8, 0],
          x: [0, Math.cos(index) * 7, -Math.sin(index) * 7, 0],
          rotate: [rotate, rotate + 2, rotate - 2, rotate],
        }}
        transition={{
          duration: 12 + (index % 5) * 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-18 sm:w-24 md:w-28 lg:w-32 bg-[url('/photos/bgfoto.png')] bg-cover bg-center p-1 pb-3 sm:p-1.5 sm:pb-4 md:p-2 md:pb-5 rounded-md shadow-[0_8px_20px_rgba(244,63,94,0.2),0_2px_8px_rgba(0,0,0,0.08)] border border-pink-200/40 relative"
      >
        {/* White Polaroid Photo Frame */}
        <div 
          className="w-full aspect-square overflow-hidden rounded border-2 border-white shadow-xs relative bg-neutral-50"
          style={{ filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none' }}
        >
          <img
            src={src}
            alt={`Memory ${index + 1}`}
            className="w-full h-full object-cover select-none"
            draggable={false}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
        </div>
        
        {/* Polaroid Label Badge */}
        <div className="mt-1.5 text-center flex items-center justify-center select-none font-sans text-[7px] sm:text-[9px] md:text-[10px] font-semibold tracking-wide">
          <span className="px-1.5 py-0.5 rounded-full bg-white/90 text-pink-600 border border-pink-100/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            {text}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ThreeDMarquee = ({
  images = defaultImages,
  className,
}: ThreeDMarqueeProps) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={cn('w-full h-full relative overflow-hidden pointer-events-none', className)}>
      {/* Dynamic drifting background sparkles & hearts */}
      <BackgroundSparkles />

      {images.map((src, index) => {
        const pos = polaroidPositions[index % polaroidPositions.length];
        return (
          <PolaroidCard
            key={index + '-' + src}
            src={src}
            index={index}
            x={pos.x}
            y={pos.y}
            z={pos.z}
            rotate={pos.rotate}
            mousePos={mousePos}
          />
        );
      })}
    </div>
  );
};

export default ThreeDMarquee;
