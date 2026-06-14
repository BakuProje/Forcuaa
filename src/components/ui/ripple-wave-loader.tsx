'use client';

import { motion } from 'framer-motion';

const AURORA_COLORS = [
  '#8b6f47', // dark brown
  '#6b5234', // deep brown
  '#7a5c3a', // rich brown
  '#9a7b52', // warm brown
  '#5c4028', // very dark brown
  '#8b6f47', // dark brown
  '#6b5234', // deep brown
];

export default function RippleWaveLoader() {
  return (
    <div className="flex items-center justify-center space-x-1.5">
      {[...Array(7)].map((_, index) => (
        <motion.div
          key={index}
          className="h-10 w-2.5 rounded-full"
          style={{
            backgroundColor: AURORA_COLORS[index],
            boxShadow: `0 0 8px ${AURORA_COLORS[index]}80`,
          }}
          animate={{
            scaleY: [0.5, 1.5, 0.5],
            scaleX: [1, 0.8, 1],
            translateY: ['0%', '-15%', '0%'],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );
}
