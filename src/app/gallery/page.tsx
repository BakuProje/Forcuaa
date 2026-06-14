'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useTransition } from '@/context/TransitionContext';

const ClassicGallery = dynamic(
  () => import("@/components/ui/image-gallery"),
  { ssr: false }
);

/* Floating love hearts animation layer for the gallery */
function GalleryHearts() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const hearts = useMemo(() => {
    if (!mounted) return [];
    const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 20;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 14 + 10,
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 8,
      color: ['#ff4081', '#ff1744', '#f50057', '#e040fb', '#ff80ab'][i % 5],
      rotateDir: Math.random() > 0.5 ? 1 : -1,
      rotateAngle: Math.random() * 180 + 90,
      drift: Math.random() * 40 - 20,
    }));
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.x}%`,
            bottom: '-5%',
            width: h.size,
            height: h.size,
            opacity: 0,
          }}
          animate={{
            y: [0, -900],
            x: [0, Math.sin(h.id * 0.7) * 50 + h.drift],
            rotate: [0, h.rotateDir * h.rotateAngle],
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.4, 1.1, 0.5],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill={h.color}
            style={{
              width: '100%',
              height: '100%',
              filter: `drop-shadow(0 0 6px ${h.color}80)`,
            }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

export default function GalleryPage() {
  const [mounted, setMounted] = useState(false);
  const { transitionComplete } = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-[url('/photos/gallerybg.png')] bg-cover bg-center bg-no-repeat" />
    );
  }

  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex flex-col items-center select-none"
      style={{
        backgroundImage: "url('/photos/gallerybg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      suppressHydrationWarning
    >
      {/* Floating love hearts animation */}
      <GalleryHearts />

      {/* Gallery Content */}
      <motion.div
        initial={transitionComplete ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: transitionComplete ? 0 : 1.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-full max-w-full sm:max-w-3xl z-20 pointer-events-auto flex items-center justify-center flex-1"
      >
        <ClassicGallery play={transitionComplete || mounted} />
      </motion.div>
    </div>
  );
}
