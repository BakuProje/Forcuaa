'use client';

import React, { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { X, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VIDEOS = [
  { id: "1", src: "/Video/1.mp4", title: "Cuaa #1", aspect: "aspect-[3/4]" },
  { id: "2", src: "/Video/2.mp4", title: "Cuaa #2", aspect: "aspect-[4/5]" },
  { id: "3", src: "/Video/3.mp4", title: "Cuaa #3", aspect: "aspect-[2/3]" },
  { id: "4", src: "/Video/4.mp4", title: "Cuaa #4", aspect: "aspect-[1/1]" },
  { id: "5", src: "/Video/5.mp4", title: "Cuaa #5", aspect: "aspect-[3/4]" },
  { id: "6", src: "/Video/6.mp4", title: "Cuaa #6", aspect: "aspect-[4/5]" },
  { id: "7", src: "/Video/7.mp4", title: "Cuaa #7", aspect: "aspect-[2/3]" },
  { id: "8", src: "/Video/8.mp4", title: "Cuaa #8", aspect: "aspect-[1/1]" },
  { id: "9", src: "/Video/9.mp4", title: "Cuaa #9", aspect: "aspect-[3/4]" },
  { id: "10", src: "/Video/10.mp4", title: "Cuaa #10", aspect: "aspect-[3/4]" },
  { id: "11", src: "/Video/11.mp4", title: "Cuaa #11", aspect: "aspect-[9/16]" },
  { id: "12", src: "/Video/12.mp4", title: "Cuaa #12", aspect: "aspect-[2/3]" },
];

/* Floating mini hearts inside each individual video card */
function LocalCardHearts() {
  const hearts = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      size: Math.random() * 6 + 6,
      duration: Math.random() * 3 + 3,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.x}%`,
            bottom: '-10%',
            width: h.size,
            height: h.size,
            opacity: 0,
          }}
          animate={{
            y: [0, -220],
            x: [0, Math.sin(h.id * 1.5) * 12],
            opacity: [0, 0.7, 0.7, 0],
            scale: [0.6, 1, 0.6],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          <svg viewBox="0 0 24 24" fill="#ff4081" className="w-full h-full drop-shadow-[0_0_2px_rgba(255,64,129,0.5)]">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

export default function Example() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [fullscreenVideoIdx, setFullscreenVideoIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayStateOverlay, setShowPlayStateOverlay] = useState<"play" | "pause" | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  // Restore state on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("fullscreen_video_idx");
    if (saved !== null) {
      setFullscreenVideoIdx(parseInt(saved, 10));
    } else {
      const params = new URLSearchParams(window.location.search);
      const videoParam = params.get("video");
      if (videoParam) {
        const idx = parseInt(videoParam, 10) - 1;
        if (idx >= 0 && idx < VIDEOS.length) {
          setFullscreenVideoIdx(idx);
        }
      }
    }
  }, []);

  // Helper to change fullscreen video state and sync with storage/URL
  const handleSetFullscreen = (idx: number | null) => {
    setFullscreenVideoIdx(idx);
    if (idx !== null) {
      sessionStorage.setItem("fullscreen_video_idx", idx.toString());
      const url = new URL(window.location.href);
      url.searchParams.set("video", (idx + 1).toString());
      window.history.replaceState({}, "", url.toString());
    } else {
      sessionStorage.removeItem("fullscreen_video_idx");
      const url = new URL(window.location.href);
      url.searchParams.delete("video");
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Sync play states on active video transitions
  useEffect(() => {
    if (fullscreenVideoIdx !== null) {
      setIsPlaying(true);
      setShowPlayStateOverlay(null);
    }
  }, [fullscreenVideoIdx]);

  const handleCardClick = (idx: number) => {
    handleSetFullscreen(idx);
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoPlayerRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      setShowPlayStateOverlay("pause");
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
      setShowPlayStateOverlay("play");
    }

    // Hide micro icon overlay after 800ms
    setTimeout(() => {
      setShowPlayStateOverlay(null);
    }, 800);
  };

  // Drag-to-swipe fullscreen video transition
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (fullscreenVideoIdx === null) return;

    if (info.offset.x < -swipeThreshold) {
      // Swiped Left -> Go to Next Video
      if (fullscreenVideoIdx < VIDEOS.length - 1) {
        handleSetFullscreen(fullscreenVideoIdx + 1);
      }
    } else if (info.offset.x > swipeThreshold) {
      // Swiped Right -> Go to Previous Video
      if (fullscreenVideoIdx > 0) {
        handleSetFullscreen(fullscreenVideoIdx - 1);
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap');
    
        .poppins-font * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <section className="w-full flex flex-col items-center justify-start poppins-font z-20 relative select-none">
        
        {/* Video grid - Pinterest style masonry columns layout */}
        <div className="w-full max-w-full sm:max-w-3xl px-2 sm:px-4 overflow-y-auto max-h-[90vh] scrollbar-hide py-4 [webkit-overflow-scrolling:touch]">
          <div className="columns-3 sm:columns-4 gap-2 sm:gap-3 w-full [column-fill:_balance]">
            {VIDEOS.map((video, idx) => {
              const isHovered = hoveredIdx === idx;
              const isAnyHovered = hoveredIdx !== null;
              
              return (
                <div
                  key={video.id}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(idx);
                  }}
                  className={cn(
                    "break-inside-avoid mb-3.5 relative rounded-2xl overflow-hidden cursor-pointer group block",
                    "transition-all duration-500 ease-out",
                    "border border-white/15 shadow-[0_8px_25px_rgba(0,0,0,0.3)] bg-black/20",
                    video.aspect,
                    isHovered
                      ? "scale-[1.04] -translate-y-1 border-white/40 shadow-[0_12px_30px_rgba(255,64,129,0.25)] z-30"
                      : isAnyHovered
                        ? "scale-95 opacity-60 border-white/5 z-0"
                        : "border-white/10 z-10"
                  )}
                >
                  {/* Local floating hearts inside the card in front of video */}
                  <LocalCardHearts />

                  {/* Live loop video inside card */}
                  <video
                    src={video.src}
                    muted
                    autoPlay
                    loop
                    playsInline
                    className="h-full w-full object-cover pointer-events-none select-none"
                  />

                  {/* Subtle shine overlay on hover */}
                  <div
                    className={cn(
                      "absolute inset-0 transition-opacity duration-500 pointer-events-none z-10",
                      "bg-gradient-to-br from-white/10 via-transparent to-transparent",
                      "opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    )}
                  />

                  {/* Top Right Save/Love Button */}
                  <div className={cn(
                    "absolute top-2 right-2 z-20 transition-opacity duration-300 pointer-events-auto",
                    "opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  )}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(idx);
                      }}
                      className="bg-[#e60023] hover:bg-[#ad0018] text-white font-semibold text-[9px] px-2 py-0.5 rounded-full shadow-md active:scale-95 transition-transform"
                    >
                      Love
                    </button>
                  </div>

                  {/* Bottom Profile Bar overlay */}
                  <div 
                    className={cn(
                      "absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 flex flex-col justify-end transition-opacity duration-300 z-20",
                      "opacity-100 md:opacity-80 md:group-hover:opacity-100"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <img 
                        src="/photos/16.jpg" 
                        alt="Cuaa" 
                        className="w-4.5 h-4.5 rounded-full object-cover border border-white/50"
                      />
                      <div>
                        <p className="text-white font-medium text-[9px] leading-none">Cuaa #{idx + 1}</p>
                        <p className="text-white/60 text-[7px] font-light mt-0.5">Sentuh untuk putar</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fullscreen swipeable video player overlay */}
        <AnimatePresence>
          {fullscreenVideoIdx !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black flex flex-col justify-center items-center"
              onClick={() => handleSetFullscreen(null)}
            >
              {/* Only close button X overlay exists in top-right, smaller and inside video bounds */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleSetFullscreen(null);
                }} 
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-[110] w-9 h-9 flex items-center justify-center pointer-events-auto bg-black/45 rounded-full backdrop-blur-xxs hover:scale-105 active:scale-95 border border-white/10"
              >
                <X className="w-5.5 h-5.5" />
              </button>

              {/* Fullscreen Video Area supporting drag-swipe and tap to play/pause */}
              <motion.div
                className="w-full h-full flex items-center justify-center relative cursor-pointer"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                onClick={handleVideoClick}
              >
                <video
                  key={fullscreenVideoIdx}
                  ref={videoPlayerRef}
                  src={VIDEOS[fullscreenVideoIdx].src}
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover bg-black select-none pointer-events-none"
                />

                {/* Modern feedback play/pause overlay icons */}
                <AnimatePresence>
                  {showPlayStateOverlay && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute w-20 h-20 rounded-full bg-black/60 flex items-center justify-center text-white z-40 pointer-events-none"
                    >
                      {showPlayStateOverlay === "play" ? (
                        <Play className="w-10 h-10 fill-white ml-1 text-white" />
                      ) : (
                        <Pause className="w-10 h-10 fill-white text-white" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
