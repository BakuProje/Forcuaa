'use client';

import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';

function FloatingHearts() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const hearts = useMemo(
    () => {
      if (!mounted) return [];
      const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 25;
      return Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 14 + 8,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 8,
        color: ['#c4a882', '#b8956a', '#a67c52', '#d4b896', '#c9a87c'][i % 5],
        rotateDir: Math.random() > 0.5 ? 1 : -1,
        rotateAngle: Math.random() * 180 + 90,
      }));
    },
    [mounted]
  );

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.x}%`,
            bottom: '-4%',
            width: h.size,
            height: h.size,
            opacity: 0,
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight * 1.15 : 950)],
            x: [0, Math.sin(h.id * 0.7) * 40],
            rotate: [0, h.rotateDir * h.rotateAngle],
            opacity: [0, 0.7, 0.7, 0],
            scale: [0.4, 1.1, 0.4],
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
              filter: `drop-shadow(0 0 4px ${h.color}60)`,
            }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* Love burst that auto-triggers when page loads */
function LoveEntrance() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; color: string; tx: number; ty: number; rot: number; dur: number }[]
  >([]);

  useEffect(() => {
    setMounted(true);
    const count = window.innerWidth < 768 ? 12 : 25;
    const burst = Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const dist = Math.random() * 180 + 80;
      return {
        id: i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        size: Math.random() * 20 + 14,
        color: ['#c4a882', '#b8956a', '#a67c52', '#d4b896', '#c9a87c', '#8b6f47'][i % 6],
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist - 60,
        rot: Math.random() * 360,
        dur: Math.random() * 1 + 1.5,
      };
    });
    const t = setTimeout(() => setParticles(burst), 400);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[6] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          initial={{
            left: p.x - p.size / 2,
            top: p.y - p.size / 2,
            scale: 0,
            opacity: 0,
            rotate: 0,
          }}
          animate={{
            x: p.tx,
            y: p.ty,
            scale: [0, 1.3, 0.8, 0],
            opacity: [0, 1, 0.8, 0],
            rotate: [0, p.rot],
          }}
          transition={{
            duration: p.dur,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ width: p.size, height: p.size }}
        >
          <svg
            viewBox="0 0 24 24"
            fill={p.color}
            style={{
              width: '100%',
              height: '100%',
              filter: `drop-shadow(0 0 8px ${p.color}80)`,
            }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

interface EnvelopeProps {
  onOpen: () => void;
}

function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpenAnimation, setIsOpenAnimation] = useState(false);

  const handleOpenClick = () => {
    setIsOpenAnimation(true);
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="relative flex flex-col items-center justify-center pointer-events-auto">
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-[#d4b896] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-8 text-center drop-shadow-[0_0_12px_rgba(184,149,106,0.5)]"
      >
        surat untukmu Cuaa<br />
        <span className="text-[9px] tracking-[0.15em] opacity-80 normal-case block mt-2 text-[#d4b896]/70">
          Ketuk segel untuk membuka
        </span>
      </motion.p>

      {/* Envelope wrapper */}
      <motion.div
        className="relative w-[280px] h-[190px] sm:w-[340px] sm:h-[220px] bg-stone-900/60 rounded-2xl shadow-[0_20px_50px_rgba(184,149,106,0.25)] flex items-center justify-center cursor-pointer overflow-visible"
        onClick={handleOpenClick}
        animate={isOpenAnimation ? { scale: 0.9, opacity: 0, y: -20 } : { y: [0, -8, 0] }}
        transition={isOpenAnimation ? { duration: 0.8, ease: "easeInOut" } : { repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        style={{ perspective: 1000 }}
      >
        {/* Envelope Back Flap */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8b6f47]/30 to-[#3a2e1d]/50 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-xs" />
        </div>

        {/* The Letter preview sticking out */}
        <motion.div
          className="absolute w-[90%] h-[75%] bg-gradient-to-b from-amber-50/95 to-amber-100/90 rounded-lg top-[10%] shadow-[0_-5px_15px_rgba(0,0,0,0.15)] flex flex-col p-4 border border-[#d4b896]/20 z-10 pointer-events-none"
          initial={{ y: 0 }}
          animate={isOpenAnimation ? { y: -85, scale: 1.05 } : { y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
        >
          <div className="w-[50%] h-2 bg-[#b8956a]/30 rounded-full mb-3" />
          <div className="w-[85%] h-1.5 bg-[#b8956a]/20 rounded-full mb-2" />
          <div className="w-[75%] h-1.5 bg-[#b8956a]/20 rounded-full mb-2" />
          <div className="w-[45%] h-1.5 bg-[#b8956a]/20 rounded-full" />
        </motion.div>

        {/* Envelope Body Fold sides */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Left triangle */}
          <div
            className="absolute left-0 bottom-0 top-0 w-1/2 bg-gradient-to-tr from-[#2a2217]/90 to-[#8b6f47]/20"
            style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
          />
          {/* Right triangle */}
          <div
            className="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-tl from-[#2a2217]/90 to-[#8b6f47]/20"
            style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }}
          />
          {/* Bottom pocket fold */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-[#2d2419]/95 to-[#6b5234]/40 rounded-b-2xl"
            style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }}
          />
        </div>

        {/* Envelope Flap Top */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[55%] bg-gradient-to-b from-[#8b6f47]/90 to-[#6b5234]/90 z-30 origin-top"
          style={{
            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
          }}
          initial={{ rotateX: 0 }}
          animate={isOpenAnimation ? { rotateX: 180 } : { rotateX: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />

        {/* Wax Stamp Seal */}
        <motion.div
          className="absolute z-40 cursor-pointer pointer-events-auto flex items-center justify-center"
          style={{ top: "45%", left: "50%", x: "-50%", y: "-50%" }}
          animate={isOpenAnimation ? { scale: 0, opacity: 0, rotate: 180 } : { scale: [1, 1.05, 1] }}
          transition={isOpenAnimation ? { duration: 0.6, ease: "easeInOut" } : { repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          whileHover={{ scale: 1.18, rotate: 3 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* 3D Wax stamp heart outer contour */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center filter drop-shadow-[0_10px_15px_rgba(139,111,71,0.5)]">
            {/* Outer irregular wax shape (simulated with border-radius and multi-layers of gold-bronze gradient) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4b896] via-[#b8956a] to-[#8b6f47] rounded-[48%_52%_45%_55%/_50%_45%_55%_50%] opacity-90 border border-[#e6d0b8]/30 shadow-[inset_0_4px_8px_rgba(255,255,255,0.4)]" />
            <div className="absolute inset-1.5 bg-gradient-to-tr from-[#8b6f47] via-[#a67c52] to-[#d4b896] rounded-[52%_48%_55%_45%/_45%_55%_50%_50%] opacity-85 rotate-12" />

            {/* Inner heart stamp design */}
            <div className="absolute w-[76%] h-[76%] bg-gradient-to-b from-[#b8956a] to-[#5c462e] rounded-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.4),_0_2px_4px_rgba(255,255,255,0.25)] flex items-center justify-center border border-[#d4b896]/10">
              <svg viewBox="0 0 24 24" className="w-11 h-11 text-amber-100/90 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" fill="currentColor">
                {/* Heart body */}
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                {/* Keyhole cutout overlay */}
                <path d="M12 6.5a2.2 2.2 0 0 0-2.2 2.2c0 .93.58 1.73 1.4 2.04v3.8c0 .28.22.5.5.5h1.6a.5.5 0 0 0 .5-.5v-3.8c.82-.31 1.4-1.11 1.4-2.04a2.2 2.2 0 0 0-2.2-2.2z" fill="#36291a" />
              </svg>
            </div>

            {/* Wax stamp highlight */}
            <div className="absolute top-[20%] left-[28%] w-3 h-1.5 rounded-full bg-white/25 blur-[1px] rotate-[-25deg]" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

interface TypewriterModalProps {
  onClose: () => void;
}

function TypewriterModal({ onClose }: TypewriterModalProps) {
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  const textIndex = useRef(0);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const MESSAGES = [
    `Wanita Kuat

Teruntuk perempuan kuat yang selalu aku banggakan,jangan pernah meragukan dirimu hanya karena hari ini terasa berat. Kamu sudah melewati begitu banyak hal yang bahkan tidak semua orang mampu hadapi. Di balik senyummu, ada perjuangan yang mungkin tidak banyak diketahui orang, tetapi saya tahu betapa hebatnya dirimu.

Kamu adalah Wonder Woman versimu sendiri tidak memakai jubah, tidak memiliki kekuatan super seperti di film, tetapi memiliki hati yang luar biasa kuat, kesabaran yang tak habis, dan keberanian untuk terus melangkah meski lelah.

Jika suatu saat dunia terasa tidak berpihak padamu, ingatlah bahwa badai tidak datang untuk menghancurkanmu, melainkan untuk menunjukkan seberapa kuat dirimu. Tidak apa-apa menangis, tidak apa-apa merasa lelah, karena perempuan hebat juga manusia. Yang terpenting, jangan pernah berhenti percaya pada dirimu sendiri.

Teruslah menjadi cahaya bagi dirimu sendiri. Jangan biarkan perkataan orang lain memadamkan mimpi-mimpimu. Kamu pantas mendapatkan kebahagiaan, ketenangan, dan semua hal baik yang sedang kamu perjuangkan.

Aku percaya, suatu hari nanti kamu akan melihat ke belakang dan tersenyum, karena semua air mata, usaha, dan doa yang kamu simpan hari ini akan berubah menjadi kebanggaan.

Terima kasih sudah menjadi Wonder Woman yang luar biasa.
Tetaplah kuat, tetaplah rendah hati, dan tetaplah menjadi perempuan yang penuh kasih. Karena dunia mungkin melihatmu sebagai seseorang yang biasa, tetapi bagi orang-orang yang menyayangimu, kamu adalah sosok yang tidak tergantikan.

Kamu tidak harus menjadi sempurna untuk menjadi hebat. Cukup terus melangkah, karena setiap langkahmu adalah bukti bahwa kamu jauh lebih kuat daripada yang kamu kira.`,

    `Perbaiki Hubungan

menghadapi banyak hal dengan kuat, sabar, dan penuh semangat. Meski sekarang kita terhalang oleh komunikasi, rasa syukurku dan rasa banggaku kepada kita tidak akan pernah hilang.

bersyukur karena kita selalu ada untukku. Dari kita saya belajar banyak tentang ketulusan, kesabaran, dan arti saling percaya. kita mengajarkanku bahwa seseorang bisa menjadi begitu hebat tanpa harus selalu menunjukkan semuanya kepada orang lain.

Mungkin saat ini keadaan membuat kita harus diam, tetapi semua kenangan, perjuangan, dan doa yang pernah kita lalui akan selalu memiliki tempat di hatiku. percaya setiap usaha yang kita lakukan tidak pernah sia-sia dan akan menjadi bagian dari cerita.

berharap semoga komunikasi kita bisa kembali membaik. Jika ada salah paham, semoga kita diberi hati yang lapang untuk saling mengerti dan saling mendengarkan. Tidak ada hubungan yang sempurna, tetapi percaya bahwa dengan kejujuran, rasa percaya, dan kemauan untuk memperbaiki keadaan, kita bisa menemukan jalan untuk kembali berbicara dengan hangat seperti dulu.

tidak meminta semuanya kembali seperti sebelumnya dalam sekejap. hanya berharap kita sama-sama diberi kesempatan untuk memperbaiki apa yang kurang, menjaga apa yang masih ada, dan membangun komunikasi yang lebih baik dengan saling menghargai dan memahami satu sama lain.

Terima kasih karena sudah menjadi Wonder Womanku, sosok yang selalu berjuang tanpa banyak mengeluh and mampu menghadapi berbagai rintangan dengan penuh keberanian. Semoga kita selalu diberi kebahagiaan, kesehatan, dan kemudahan dalam setiap langkah. Dan semoga, di mana pun kita berada, kita tetap bisa saling mendoakan, saling mendukung, dan bangga dengan perjalanan yang telah kita lalui bersama.`
  ];

  useEffect(() => {
    if (!isEnvelopeOpened) return;

    setTypedText("");
    setIsTypingFinished(false);
    textIndex.current = 0;

    const typeChar = () => {
      const message = MESSAGES[currentMessageIndex];
      if (textIndex.current < message.length) {
        const nextChar = message.charAt(textIndex.current);
        setTypedText((prev) => prev + nextChar);
        textIndex.current += 1;
        typingTimer.current = setTimeout(typeChar, 18);
      } else {
        setIsTypingFinished(true);
      }
    };

    typingTimer.current = setTimeout(typeChar, 600);

    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, [isEnvelopeOpened, currentMessageIndex]);

  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (cursorRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cursor = cursorRef.current;

      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      const cursorTop = cursor.offsetTop;
      const cursorBottom = cursorTop + cursor.clientHeight;

      if (cursorBottom > containerBottom) {
        container.scrollTop = cursorBottom - container.clientHeight + 20; // 20px buffer to keep typing area visible
      } else if (cursorTop < containerTop) {
        container.scrollTop = cursorTop;
      }
    }
  }, [typedText]);

  const handleSkip = () => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    setTypedText(MESSAGES[currentMessageIndex]);
    setIsTypingFinished(true);
  };

  const paragraphs = typedText ? typedText.split('\n\n') : [""];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-text"
      suppressHydrationWarning
    >
      {!isEnvelopeOpened ? (
        <Envelope onOpen={() => setIsEnvelopeOpened(true)} />
      ) : (
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 22, stiffness: 110 }}
          className="w-[90vw] sm:w-[420px] h-[127vw] sm:h-[595px] rounded-3xl shadow-[0_0_60px_rgba(184,149,106,0.35)] relative overflow-hidden flex flex-col poppins-font"
        >
          {/* Background image container to ensure it stays completely still */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-20"
            style={{ backgroundImage: "url('/photos/bgteks.png')" }}
          />
          {/* Subtle light/beige blur overlay to guarantee readability of black text on vintage paper */}
          <div className="absolute inset-0 bg-amber-50/10 backdrop-blur-[0.5px] -z-10" />

          {/* Pulsating Glowing Top Feather Decorator - absolute so it doesn't push the text down */}
          <div className="absolute top-4 right-6 z-20">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="text-[#b8956a] w-6 h-6 filter drop-shadow-[0_0_8px_rgba(184,149,106,0.5)] flex items-center justify-center pointer-events-none"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                <line x1="16" y1="8" x2="2" y2="22" />
                <line x1="17.5" y1="15" x2="9" y2="15" />
              </svg>
            </motion.div>
          </div>

          {/* Content container */}
          <div className="relative px-9 sm:px-12 pt-8 pb-6 flex flex-col flex-1 overflow-hidden">
            {/* Scrollable text container */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto pr-1 mb-4 scrollbar-hide scroll-smooth relative [webkit-overflow-scrolling:touch]"
            >
              {paragraphs.map((p, index) => {
                if (index === 0) {
                  return (
                    <h2
                      key={index}
                      className="text-[#8b6f47] font-extrabold text-lg sm:text-2xl tracking-wide mb-6 pb-2 border-b border-[#b8956a]/30 text-center relative"
                    >
                      {p}
                      {!isTypingFinished && paragraphs.length === 1 && (
                        <motion.span
                          ref={cursorRef}
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="inline-block w-2 h-5 bg-[#b8956a] ml-1.5 align-middle"
                        />
                      )}
                    </h2>
                  );
                }

                return (
                  <p
                    key={index}
                    className="text-black font-bold text-xs sm:text-sm leading-relaxed whitespace-pre-wrap tracking-wide text-justify px-1 sm:px-2 mb-4 last:mb-0"
                  >
                    {p}
                    {!isTypingFinished && index === paragraphs.length - 1 && (
                      <motion.span
                        ref={cursorRef}
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-1.5 h-4 bg-[#b8956a] ml-0.5 align-middle"
                      />
                    )}
                  </p>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between gap-3 sm:gap-4 border-t border-black/10 pt-4">
              {/* Skip Button */}
              {!isTypingFinished ? (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#5c462e] border-2 border-[#b8956a] font-bold text-xs active:scale-95 transition-all pointer-events-auto shadow-sm"
                >
                  Skip Ketikan
                </button>
              ) : (
                <div />
              )}

              {/* Action Buttons */}
              {isTypingFinished && currentMessageIndex === 0 ? (
                <button
                  onClick={() => setCurrentMessageIndex(1)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#b8956a] to-[#8b6f47] hover:from-[#a67c52] hover:to-[#6b5234] text-white font-semibold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 pointer-events-auto"
                >
                  <span>Surat Selanjutnya</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : isTypingFinished && currentMessageIndex === 1 ? (
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#b8956a] to-[#8b6f47] hover:from-[#a67c52] hover:to-[#6b5234] text-white font-semibold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 pointer-events-auto"
                >
                  <span>Tutup Pesan</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanFailed, setScanFailed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHolding = useRef(false);

  // Message Modal States & Typewriter Logic
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const startHold = useCallback(() => {
    if (scanComplete) return;
    isHolding.current = true;
    setScanning(true);
    setScanFailed(false);
    setScanProgress(0);

    const duration = 2000;
    const interval = 30;
    const step = (interval / duration) * 100;

    timerRef.current = setInterval(() => {
      setScanProgress((prev) => {
        if (!isHolding.current) {
          if (timerRef.current) clearInterval(timerRef.current);
          return prev;
        }
        const next = prev + step;
        if (next >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          setScanComplete(true);
          setTimeout(() => {
            setIsLeaving(true);
            setTimeout(() => router.push('/gallery?transition=true'), 1000);
          }, 400);
          return 100;
        }
        return next;
      });
    }, interval);
  }, [scanComplete, router]);

  const stopHold = useCallback(() => {
    isHolding.current = false;
    if (timerRef.current) clearInterval(timerRef.current);

    setScanProgress((prev) => {
      if (prev < 100 && !scanComplete) {
        setScanFailed(true);
        setTimeout(() => {
          setScanFailed(false);
          setScanning(false);
          setScanProgress(0);
        }, 800);
      }
      return prev;
    });
  }, [scanComplete]);

  if (!mounted) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-[url('/photos/android.png')] md:bg-[url('/photos/windows.png')] bg-cover bg-center bg-no-repeat" />
    );
  }

  return (
    <>
      {/* Preload loading video to ensure instant smooth transition on mobile */}
      <link rel="preload" href="/Video/loading.mp4" as="video" type="video/mp4" />

      {/* Background curtain overlay - animates with main content for pull effect */}
      <motion.div
        className="fixed inset-0 bg-[url('/photos/android.png')] md:bg-[url('/photos/windows.png')] bg-cover bg-center bg-no-repeat"
        style={{ zIndex: isLeaving ? 90 : -1 }}
        animate={isLeaving ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 1.0, ease: 'easeInOut' }}
      />

      {/* Page content */}
      <motion.div
        className="relative min-h-screen w-full flex flex-col items-center select-none"
        style={{ zIndex: isLeaving ? 91 : 1 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={
          isLeaving
            ? { opacity: 0, scale: 0.95 }
            : { y: 0, opacity: 1, scale: 1 }
        }
        transition={{
          duration: isLeaving ? 1.0 : 0.8,
          ease: 'easeInOut',
        }}
      >
        {/* Floating Hearts Background */}
        <FloatingHearts />

        {/* Love entrance animation */}
        <LoveEntrance />

        {/* Fingerprint Scan Content */}
        <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-end pb-24 px-6 text-center select-none">
          {/* Scan disini text */}
          <motion.p
            className="text-sm md:text-base font-semibold tracking-[0.3em] uppercase mb-6"
            style={{
              color: scanComplete
                ? '#4ade80'
                : scanFailed
                  ? '#ef4444'
                  : '#ffffff',
            }}
            animate={
              scanFailed
                ? { opacity: [1, 0.3, 1, 0.3, 1] }
                : !scanComplete
                  ? { opacity: [0.5, 1, 0.5] }
                  : {}
            }
            transition={{
              duration: scanFailed ? 0.5 : 2.5,
              repeat: scanFailed ? 0 : !scanComplete ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            {scanComplete ? 'Berhasil!' : scanFailed ? 'Gagal! Tahan lebih lama' : 'Tahan disini'}
          </motion.p>

          {/* Fingerprint Scanner */}
          <div
            className="relative w-[140px] h-[140px] flex items-center justify-center cursor-pointer select-none touch-none"
            style={{
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
            onMouseDown={startHold}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={(e) => {
              e.preventDefault();
              startHold();
            }}
            onTouchEnd={stopHold}
            onTouchCancel={stopHold}
            onTouchMove={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Outer rotating ring */}
            <motion.svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 140 140"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={scanComplete ? '#4ade80' : scanFailed ? '#ef4444' : '#ffffff'} stopOpacity="1" />
                  <stop offset="50%" stopColor={scanComplete ? '#22c55e' : scanFailed ? '#dc2626' : '#ffffff'} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={scanComplete ? '#4ade80' : scanFailed ? '#ef4444' : '#ffffff'} stopOpacity="1" />
                </linearGradient>
              </defs>
              <circle
                cx="70" cy="70" r="66"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="5"
                strokeDasharray="12 6"
                opacity={scanning ? 1 : 0.7}
                style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.7))' }}
              />
            </motion.svg>

            {/* Middle glowing ring */}
            <motion.div
              className="absolute w-[120px] h-[120px] rounded-full border-4"
              style={{
                borderColor: scanComplete
                  ? 'rgba(74,222,128,0.7)'
                  : scanFailed
                    ? 'rgba(239,68,68,0.7)'
                    : scanning
                      ? 'rgba(255,255,255,0.9)'
                      : 'rgba(255,255,255,0.5)',
                boxShadow: scanComplete
                  ? '0 0 40px rgba(74,222,128,0.6), inset 0 0 35px rgba(74,222,128,0.2)'
                  : scanFailed
                    ? '0 0 35px rgba(239,68,68,0.5), inset 0 0 30px rgba(239,68,68,0.2)'
                    : scanning
                      ? '0 0 45px rgba(255,255,255,0.6), inset 0 0 30px rgba(255,255,255,0.25)'
                      : '0 0 25px rgba(255,255,255,0.25), inset 0 0 15px rgba(255,255,255,0.1)',
              }}
              animate={scanning ? { scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] } : {}}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Progress arc */}
            {scanning && (
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 140 140">
                <circle
                  cx="70" cy="70" r="60"
                  fill="none"
                  stroke={scanComplete ? '#4ade80' : scanFailed ? '#ef4444' : '#ffffff'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(scanProgress / 100) * 377} 377`}
                  style={{
                    filter: `drop-shadow(0 0 10px ${scanComplete ? '#4ade80' : scanFailed ? '#ef4444' : '#ffffff'})`,
                    transition: 'stroke-dasharray 0.1s ease',
                  }}
                />
              </svg>
            )}

            {/* Scanning line effect */}
            {scanning && !scanComplete && (
              <motion.div
                className="absolute w-[90px] h-[3px] rounded-full"
                style={{
                  background: scanFailed
                    ? 'linear-gradient(90deg, transparent, #ef4444, #dc2626, #ef4444, transparent)'
                    : 'linear-gradient(90deg, transparent, #ffffff, #f0f0f0, #ffffff, transparent)',
                  boxShadow: scanFailed
                    ? '0 0 16px #ef4444, 0 0 32px #dc262680'
                    : '0 0 16px #ffffff, 0 0 32px #ffffff80, 0 0 48px #ffffff40',
                }}
                animate={{ y: [-42, 42, -42], opacity: [0.3, 1, 1, 0.3] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}

            {/* Fingerprint icon container */}
            <div
              className="relative z-10 w-[100px] h-[100px] rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: scanComplete
                  ? 'rgba(74,222,128,0.2)'
                  : scanFailed
                    ? 'rgba(239,68,68,0.15)'
                    : scanning
                      ? 'rgba(255,255,255,0.25)'
                      : 'rgba(255,255,255,0.15)',
                border: scanComplete
                  ? '3px solid rgba(74,222,128,0.5)'
                  : scanFailed
                    ? '3px solid rgba(239,68,68,0.4)'
                    : scanning
                      ? '3px solid rgba(255,255,255,0.7)'
                      : '3px solid rgba(255,255,255,0.4)',
                boxShadow: scanComplete
                  ? '0 0 40px rgba(74,222,128,0.4), inset 0 0 25px rgba(74,222,128,0.15)'
                  : scanFailed
                    ? '0 0 35px rgba(239,68,68,0.3), inset 0 0 20px rgba(239,68,68,0.1)'
                    : scanning
                      ? '0 0 40px rgba(255,255,255,0.4), inset 0 0 20px rgba(255,255,255,0.15)'
                      : '0 0 25px rgba(255,255,255,0.25), 0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
              }}
            >
              <img
                src="/photos/fingerprint.png"
                alt="fingerprint"
                className="w-[70px] h-[70px] object-contain pointer-events-none select-none"
                draggable="false"
                style={{
                  filter: scanComplete
                    ? 'drop-shadow(0 0 12px #4ade80) brightness(0.3) saturate(2) hue-rotate(80deg)'
                    : scanFailed
                      ? 'drop-shadow(0 0 12px #ef4444) brightness(0.4) saturate(2) hue-rotate(-30deg)'
                      : scanning
                        ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8)) brightness(0.15)'
                        : 'brightness(0.2) drop-shadow(0 0 4px rgba(255,255,255,0.3))',
                  transition: 'filter 0.3s ease',
                }}
              />
            </div>

            {/* Pulse rings when idle */}
            {!scanning && (
              <>
                <motion.div
                  className="absolute w-[140px] h-[140px] rounded-full border-[3px] border-white/30"
                  animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.div
                  className="absolute w-[140px] h-[140px] rounded-full border-[3px] border-white/25"
                  animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
                />
              </>
            )}

            {/* Success burst particles */}
            {scanComplete && (
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-green-400"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [1, 1, 0],
                      x: Math.cos((i * Math.PI * 2) / 8) * 60,
                      y: Math.sin((i * Math.PI * 2) / 8) * 60,
                    }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ boxShadow: '0 0 6px #4ade80' }}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Typewriter message overlay modal */}
      <AnimatePresence>
        {showModal && (
          <TypewriterModal onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
