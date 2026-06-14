'use client';

import { motion } from 'framer-motion';

const DOT_COLORS = ['#8b6f47', '#6b5234', '#7a5c3a'];

export default function PulsatingDots() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: DOT_COLORS[i],
              boxShadow: `0 0 12px ${DOT_COLORS[i]}80`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              ease: 'easeInOut',
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
