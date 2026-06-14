'use client';

import type { HTMLAttributes } from 'react';

interface GradientButtonProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  width?: string;
  height?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const GradientButton = ({
  children,
  width = '220px',
  height = '56px',
  className = '',
  onClick,
  disabled = false,
  ...props
}: GradientButtonProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div className="text-center">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={`
          relative rounded-full cursor-pointer
          flex items-center justify-center
          border border-white/30
          bg-transparent
          transition-all duration-500 ease-out
          hover:border-white/80
          hover:bg-white/10
          hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
          active:scale-95
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        style={{
          minWidth: width,
          height: height,
        }}
        onClick={disabled ? undefined : onClick}
        onKeyDown={handleKeyDown}
        aria-disabled={disabled}
        {...props}
      >
        <span className="relative z-10 text-white text-sm font-medium tracking-wide">
          {children}
        </span>
      </div>
    </div>
  );
};

export default GradientButton;
