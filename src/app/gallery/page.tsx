'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useTransition } from '@/context/TransitionContext';
import PulsatingDots from '@/components/ui/pulsating-loader';
import RippleWaveLoader from '@/components/ui/ripple-wave-loader';

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
    const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 4 : 15;
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
  const { setDoorImage } = useTransition();
  const [mounted, setMounted] = useState(false);
  
  // Transition States
  const [transitionActive, setTransitionActive] = useState(false);
  const [isExitingLoader, setIsExitingLoader] = useState(false);
  const [showDoors, setShowDoors] = useState(false);
  const [windowOpen, setWindowOpen] = useState(false);
  const [doorImageLocal, setDoorImageLocal] = useState<string | null>(null);
  const [videoOpacity, setVideoOpacity] = useState(1);
  const [videoStarted, setVideoStarted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Check if URL has ?transition=true
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('transition') === 'true') {
        setTransitionActive(true);
      }
    }
  }, []);

  const handleVideoPlaying = () => {
    const v = videoRef.current;
    if (v) {
      if (v.muted) {
        try {
          v.muted = false;
          v.volume = 1;
          const playPromise = v.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn("Unmuted play promise failed, keeping muted:", err);
              v.muted = true;
              v.play().catch(() => {});
            });
          }
        } catch (e) {
          console.warn("Mute toggle failed:", e);
        }
      }
    }
    setVideoStarted(true);
  };

  const captureVideoFrame = (): string | null => {
    const v = videoRef.current;
    if (!v) return null;
    try {
      const canvas = document.createElement('canvas');
      const scale = 0.3;
      canvas.width = (v.videoWidth || 1280) * scale;
      canvas.height = (v.videoHeight || 720) * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.75);
    } catch {
      return null;
    }
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.currentTime > 0.1 && !videoStarted) {
      setVideoStarted(true);
    }

    // Fade out loader at 21.2s (800ms before transition at 22s)
    if (v.currentTime >= 21.2 && !isExitingLoader) {
      setIsExitingLoader(true);
    }

    // Trigger door opening sequence at 22.0s
    if (v.currentTime >= 22.0 && !showDoors) {
      const frame = captureVideoFrame();
      setDoorImageLocal(frame);
      setDoorImage(frame); 
      setShowDoors(true);
      setVideoOpacity(0); // Instantly hide video, let audio continue playing in background

      // Trigger the slide open animation shortly after
      setTimeout(() => {
        setWindowOpen(true);
      }, 150);
 
      // After 3.15s of door opening (at 25.15s), complete transition locally (no router redirect)
      setTimeout(() => {
        if (videoRef.current) videoRef.current.pause();
        setTransitionActive(false);
        // Clean URL parameter without reloading
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('transition');
          window.history.replaceState({}, '', url.toString());
        }
      }, 3150);
    }
  };

  // Fallback Timer
  useEffect(() => {
    if (!mounted || !transitionActive) return;
 
    const fallbackTimer = setTimeout(() => {
      if (!showDoors) {
        setIsExitingLoader(true);
        setTimeout(() => {
          const frame = captureVideoFrame();
          setDoorImageLocal(frame);
          setDoorImage(frame);
          setVideoStarted(true);
          setShowDoors(true);
          setVideoOpacity(0);
          setTimeout(() => {
            setWindowOpen(true);
            setTimeout(() => {
              if (videoRef.current) videoRef.current.pause();
              setTransitionActive(false);
              if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.delete('transition');
                window.history.replaceState({}, '', url.toString());
              }
            }, 3000);
          }, 150);
        }, 800);
      }
    }, 22500);

    return () => clearTimeout(fallbackTimer);
  }, [mounted, transitionActive, showDoors]);

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-[url('/photos/gallerybg.png')] bg-cover bg-center bg-no-repeat" />
    );
  }

  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex flex-col items-center select-none bg-black"
      suppressHydrationWarning
    >
      {/* 1. Gallery Content - rendered in the background for a seamless transition */}
      {(!transitionActive || videoStarted) && (
        <div
          className="absolute inset-0 z-0 flex flex-col items-center"
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
            initial={transitionActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: transitionActive ? 0 : 1.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-full max-w-full sm:max-w-3xl z-20 pointer-events-auto flex items-center justify-center flex-1"
          >
            {/* If transition is active, we tell the gallery not to autoplay hover videos yet */}
            <ClassicGallery play={!transitionActive} />
          </motion.div>
        </div>
      )}

      {/* 2. Transition Overlay (Only rendered if transitionActive is true) */}
      {transitionActive && (
        <>
          {/* Preload loading video link */}
          <link rel="preload" href="/Video/loading.mp4" as="video" type="video/mp4" />

          {/* Fullscreen Video */}
          <video
            ref={videoRef}
            src="/Video/loading.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onPlaying={handleVideoPlaying}
            onTimeUpdate={handleTimeUpdate}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 10,
              pointerEvents: 'none',
              opacity: videoOpacity,
              transition: 'opacity 0.3s ease-in-out',
              willChange: 'opacity',
            }}
          />

          {/* Loading Animation - positioned at bottom */}
          {!isExitingLoader && (
            <motion.div
              className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center gap-4 pb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <RippleWaveLoader />
              <PulsatingDots />
            </motion.div>
          )}

          {/* Splitting Doors Overlay (Uses the captured frame) */}
          {showDoors && doorImageLocal && (
            <div className="fixed inset-0 z-40 pointer-events-none flex overflow-hidden">
              {/* Left Door */}
              <motion.div
                initial={{ x: '0%' }}
                animate={windowOpen ? { x: '-100%', translateZ: 0 } : { x: '0%', translateZ: 0 }}
                transition={{ duration: 3.0, ease: [0.76, 0, 0.24, 1] }}
                className="w-1/2 h-full relative overflow-hidden pointer-events-auto border-r border-white/10"
                style={{ willChange: 'transform' }}
              >
                <div
                  className="absolute top-0 left-0 w-[100vw] h-full"
                  style={{
                    backgroundImage: `url(${doorImageLocal})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              </motion.div>
     
              {/* Right Door */}
              <motion.div
                initial={{ x: '0%' }}
                animate={windowOpen ? { x: '100%', translateZ: 0 } : { x: '0%', translateZ: 0 }}
                transition={{ duration: 3.0, ease: [0.76, 0, 0.24, 1] }}
                className="w-1/2 h-full relative overflow-hidden pointer-events-auto border-l border-white/10"
                style={{ willChange: 'transform' }}
              >
                <div
                  className="absolute top-0 right-0 w-[100vw] h-full"
                  style={{
                    backgroundImage: `url(${doorImageLocal})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
