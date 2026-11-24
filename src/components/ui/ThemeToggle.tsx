'use client';

import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useTheme();
  const reduce = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isDark = mounted && theme === 'dark';
  const actionLabel = isDark ? 'Chế độ sáng' : 'Chế độ tối';
  const compactLabel = isDark ? 'Sáng' : 'Tối';
  const ariaLabel = isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối';

  const handleClick = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : undefined;
    toggleTheme(origin);
  };

  return (
    <motion.button
      id="theme-toggle-btn"
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      aria-pressed={isDark}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="inline-flex items-center justify-center gap-2 min-h-9 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-shell-surface hover:bg-shell-hover border border-shell-border text-shell-ink-bright text-xs font-semibold transition-colors cursor-pointer select-none flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shell-ink-bright"
    >
      <span
        className={`theme-toggle-icon relative w-4 h-4 flex items-center justify-center flex-shrink-0 ${
          isDark ? 'text-[#F0BE63]' : 'text-[#C8DCE8]'
        }`}
        aria-hidden="true"
      >
        {isDark ? <Sun size={15} strokeWidth={2.2} /> : <Moon size={15} strokeWidth={2.2} />}
      </span>
      <span className="hidden sm:inline-block min-w-[78px] text-center whitespace-nowrap">
        {actionLabel}
      </span>
      <span className="sm:hidden inline-block min-w-[28px] text-center whitespace-nowrap">
        {compactLabel}
      </span>
    </motion.button>
  );
}
