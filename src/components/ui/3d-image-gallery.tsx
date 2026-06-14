"use client"

import React, { Suspense, useMemo, useRef, useState, createContext, useContext, useEffect } from "react"
import { motion } from "framer-motion"
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  OrbitControls,
  Environment,
  Html,
} from "@react-three/drei"
import { X } from "lucide-react"

/**
 * Single-file Stellar Card Gallery
 * - Context, Galaxy, FloatingCard, Modal, and Page in one.
 */

/* =========================
   Card Context (inlined)
   ========================= */

type Card = {
  id: string
  imageUrl: string
  alt: string
  title: string
}

type CardContextType = {
  selectedCard: Card | null
  setSelectedCard: (card: Card | null) => void
  cards: Card[]
  showButton: boolean
}

const CardContext = createContext<CardContextType | undefined>(undefined)

function useCard() {
  const ctx = useContext(CardContext)
  if (!ctx) throw new Error("useCard must be used within CardProvider")
  return ctx
}

function CardProvider({ children, showButton }: { children: React.ReactNode, showButton: boolean }) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  const cards: Card[] = useMemo(() => {
    const baseCards: Card[] = [
      { id: "1", imageUrl: "/photos/1.jpeg", alt: "Cuaa", title: "Cuaa ♥" },
      { id: "2", imageUrl: "/photos/2.jpeg", alt: "Cuaa", title: "My Love" },
      { id: "3", imageUrl: "/photos/3.jpeg", alt: "Cuaa", title: "Beautiful" },
      { id: "4", imageUrl: "/photos/4.png", alt: "Cuaa", title: "Together" },
      { id: "5", imageUrl: "/photos/5.png", alt: "Cuaa", title: "Love You" },
      { id: "6", imageUrl: "/photos/6.jpg", alt: "Cuaa", title: "Mine ♥" },
      { id: "7", imageUrl: "/photos/7.jpg", alt: "Cuaa", title: "Happy" },
      { id: "8", imageUrl: "/photos/8.jpg", alt: "Cuaa", title: "Smile!" },
      { id: "9", imageUrl: "/photos/9.jpg", alt: "Cuaa", title: "Always" },
      { id: "10", imageUrl: "/photos/10.jpg", alt: "Cuaa", title: "Only You" },
      { id: "11", imageUrl: "/photos/11.jpg", alt: "Cuaa", title: "Sweetheart" },
      { id: "12", imageUrl: "/photos/12.jpg", alt: "Cuaa", title: "Precious" },
      { id: "13", imageUrl: "/photos/13.jpg", alt: "Cuaa", title: "My Girl" },
      { id: "14", imageUrl: "/photos/14.jpg", alt: "Cuaa", title: "Perfect" },
      { id: "15", imageUrl: "/photos/15.jpg", alt: "Cuaa", title: "Cute ♥" },
      { id: "16", imageUrl: "/photos/16.jpg", alt: "Cuaa", title: "Adored" },
      { id: "17", imageUrl: "/photos/17.jpg", alt: "Cuaa", title: "Angel" },
      { id: "18", imageUrl: "/photos/18.jpg", alt: "Cuaa", title: "Memory" },
      { id: "19", imageUrl: "/photos/19.jpg", alt: "Cuaa", title: "Pure ♥" },
    ];
    const double = [...baseCards, ...baseCards];
    return double.map((card, index) => ({
      ...card,
      id: `${card.id}-dup-${index}`,
    }));
  }, []);

  return (
    <CardContext.Provider value={{ selectedCard, setSelectedCard, cards, showButton }}>
      {children}
    </CardContext.Provider>
  )
}

/* =========================
   Floating Hearts Background (inlined)
   ========================= */

function FloatingHearts() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const hearts = useMemo(() => {
    if (!mounted) return []
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 15 + 10,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 6,
      color: ["#ff4081", "#ff1744", "#f50057", "#e040fb", "#ff80ab"][i % 5],
      rotateDir: Math.random() > 0.5 ? 1 : -1,
      rotateAngle: Math.random() * 180 + 90,
    }))
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.x}%`,
            bottom: "-5%",
            width: h.size,
            height: h.size,
            opacity: 0,
          }}
          animate={{
            y: [0, -1000],
            x: [0, Math.sin(h.id * 0.7) * 50],
            rotate: [0, h.rotateDir * h.rotateAngle],
            opacity: [0, 0.7, 0.7, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill={h.color}
            style={{
              width: "100%",
              height: "100%",
              filter: `drop-shadow(0 0 5px ${h.color}80)`,
            }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

/* =========================
   Floating Card (inlined)
   ========================= */

function FloatingCard({
  card,
  position,
  index,
}: {
  card: Card
  position: { x: number; y: number; z: number }
  index: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [showHearts, setShowHearts] = useState(false)

  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position)
    }
  })

  // Trigger heart burst shortly after card scales in
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHearts(true)
    }, 600 + index * 50)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      <Html
        transform
        distanceFactor={16}
        position={[0, 0, 0]}
        style={{
          pointerEvents: "none",
        }}
        wrapperClass="html-card-wrapper"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -25 }}
          animate={{ scale: 1, opacity: 0.9, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 75,
            damping: 14,
            delay: index * 0.06,
          }}
          className="relative select-none pointer-events-none"
        >
          {/* Heart burst pop effect */}
          {showHearts && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-10">
              {Array.from({ length: 5 }).map((_, i) => {
                const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.4;
                const distance = Math.random() * 40 + 35;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance - 25; // float upwards
                const size = Math.random() * 10 + 9;
                
                return (
                  <motion.svg
                    key={i}
                    viewBox="0 0 24 24"
                    fill="#ff4081"
                    className="absolute"
                    style={{ width: size, height: size }}
                    initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1.2, 0.9, 0],
                      opacity: [0, 1, 0.8, 0],
                      x: tx,
                      y: ty,
                    }}
                    transition={{
                      duration: 1.6,
                      delay: Math.random() * 0.2,
                      ease: "easeOut",
                    }}
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </motion.svg>
                );
              })}
            </div>
          )}

          <div
            className="w-[4.5rem] h-[6.5rem] sm:w-[7rem] sm:h-[10rem] md:w-[8rem] md:h-[11rem] rounded-md overflow-hidden shadow-lg bg-[url('/photos/bgfoto.png')] bg-cover bg-center bg-no-repeat p-0.5 sm:p-1 md:p-1.5 select-none border border-pink-200/30 relative pointer-events-none"
            style={{
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* White photo container border inside card */}
            <div className="w-full h-[4.5rem] sm:h-[7rem] md:h-[8rem] overflow-hidden rounded border border-white shadow-xs bg-neutral-50 pointer-events-none">
              <img
                src={card.imageUrl || "/placeholder.svg"}
                alt={card.alt}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
            </div>
            
            {/* High-contrast label for the title */}
            <div className="mt-0.5 sm:mt-1 text-center pointer-events-none flex items-center justify-center">
              <span className="px-1 sm:px-1.5 py-0.25 sm:py-0.5 rounded-full bg-white/95 text-pink-600 border border-pink-100/50 shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-[5px] sm:text-[8px] md:text-[9px] font-bold tracking-wide">
                {card.title}
              </span>
            </div>
          </div>
        </motion.div>
      </Html>
    </group>
  )
}

/* =========================
   Card Modal (inlined)
   ========================= */

function CardModal() {
  const { selectedCard, setSelectedCard } = useCard()
  const cardRef = useRef<HTMLDivElement>(null)

  if (!selectedCard) return null

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 15
    const rotateY = (centerX - x) / 15
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleMouseEnter = () => { }
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.5s ease-out"
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)"
    }
  }

  const handleClose = () => setSelectedCard(null)
  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) handleClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={handleBackdropClick}>
      <div className="relative max-w-md w-full mx-4">
        <button onClick={handleClose} className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10">
          <X className="w-8 h-8" />
        </button>

        <div style={{ perspective: "1000px" }} className="w-full">
          <div
            ref={cardRef}
            className="relative cursor-pointer rounded-[16px] bg-[url('/photos/bgfoto.png')] bg-cover bg-center bg-no-repeat p-4 transition-all duration-500 ease-out w-full border border-pink-200/40 overflow-hidden"
            style={{
              transformStyle: "preserve-3d",
              boxShadow: "0 25px 60px rgba(244, 63, 94, 0.25), 0 10px 30px rgba(0, 0, 0, 0.15)",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative w-full mb-3" style={{ aspectRatio: "3 / 4" }}>
              {["1", "2", "3"].includes(selectedCard.id) ? (
                <video
                  src={`/Video/${selectedCard.id}.mp4`}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full rounded-[12px] object-cover bg-black"
                  style={{ boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                />
              ) : (
                <img
                  loading="lazy"
                  className="absolute inset-0 h-full w-full rounded-[12px] object-cover"
                  alt={selectedCard.alt}
                  src={selectedCard.imageUrl || "/placeholder.svg"}
                  style={{ boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                />
              )}
            </div>

            <h3 className="text-rose-700 text-base font-semibold text-center">{selectedCard.title}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================
   Card Galaxy (inlined)
   ========================= */

function CardGalaxy() {
  const { cards } = useCard()

  // After mount, force overflow visible on all drei Html wrapper elements
  useEffect(() => {
    const fix = () => {
      document.querySelectorAll('.html-card-wrapper').forEach((el) => {
        const htmlEl = el as HTMLElement
        htmlEl.style.overflow = 'visible'
        // Walk up all ancestors too
        let parent = htmlEl.parentElement
        while (parent) {
          parent.style.overflow = 'visible'
          parent = parent.parentElement
        }
      })
    }
    // Run immediately and also after a delay (drei may create elements async)
    fix()
    const t1 = setTimeout(fix, 200)
    const t2 = setTimeout(fix, 800)
    const t3 = setTimeout(fix, 2000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  // Fibonacci sphere: evenly distribute cards on a perfect sphere surface
  const SPHERE_RADIUS = 8

  const cardPositions = useMemo(() => {
    const positions: {
      x: number
      y: number
      z: number
    }[] = []
    const numCards = cards.length
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // golden angle in radians

    for (let i = 0; i < numCards; i++) {
      // Fibonacci sphere distribution for even spacing
      const y = 1 - (i / (numCards - 1)) * 2 // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y) // radius at this y level
      const theta = goldenAngle * i // golden angle increments

      const x = Math.cos(theta) * radiusAtY
      const z = Math.sin(theta) * radiusAtY

      positions.push({
        x: x * SPHERE_RADIUS,
        y: y * SPHERE_RADIUS,
        z: z * SPHERE_RADIUS,
      })
    }
    return positions
  }, [cards.length])

  return (
    <>
      {cards.map((card, i) => (
        <FloatingCard key={card.id} card={card} position={cardPositions[i]} index={i} />
      ))}
    </>
  )
}

/* =========================
   Page/Component Export
   ========================= */

export default function StellarCardGallerySingle() {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Responsive camera: push further on mobile portrait so the full sphere fits
  const cameraDistance = isMobile ? 56 : 34

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-[url('/photos/gallerybg.png')] bg-cover bg-center bg-no-repeat" />
    )
  }

  return (
    <CardProvider showButton={false}>
      <div className="w-full h-full relative bg-transparent overflow-visible">
        {/* Render background floating hearts dynamic particle layer */}
        <FloatingHearts />

        <Canvas
          key={isMobile ? "mobile" : "desktop"}
          camera={{ position: [0, 2, cameraDistance], fov: 45 }}
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ overflow: 'visible' }}
          onCreated={({ gl }) => {
            gl.domElement.style.pointerEvents = "none"
            // Walk up from canvas to page root, force overflow visible on every ancestor
            let el: HTMLElement | null = gl.domElement.parentElement
            while (el) {
              el.style.overflow = 'visible'
              el = el.parentElement
            }
          }}
        >
          <Suspense fallback={null}>
            <Environment preset="night" />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.7} />
            <pointLight position={[-10, -10, -10]} intensity={0.4} />
            <CardGalaxy />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              enableRotate={false}
              minDistance={5}
              maxDistance={cameraDistance}
              autoRotate={true}
              autoRotateSpeed={0.25}
              rotateSpeed={0.5}
              zoomSpeed={1.2}
              panSpeed={0.8}
              target={[0, 2, 0]}
            />
          </Suspense>
        </Canvas>

        <CardModal />
      </div>
    </CardProvider>
  )
}
