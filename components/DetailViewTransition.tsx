'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/lib/theme-context';

interface DetailViewTransitionProps {
  isActive: boolean;
  children: React.ReactNode;
  onTransitionComplete?: () => void;
}

export default function DetailViewTransition({
  isActive,
  children,
  onTransitionComplete
}: DetailViewTransitionProps) {
  const { setTheme, actualTheme } = useTheme();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [originalTheme, setOriginalTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (isActive) {
      // Store current theme before switching
      setOriginalTheme(actualTheme);

      // Start transition sequence and activate dark mode immediately
      setShowOverlay(true);
      setTheme('dark');

      // Show content after fade transition completes
      const timer = setTimeout(() => {
        setShowContent(true);
        onTransitionComplete?.();
      }, 500); // After the full fade transition

      return () => clearTimeout(timer);
    } else {
      // Reverse transition - hide content first
      setShowContent(false);

      // Then switch back to original theme and hide overlay
      const timer = setTimeout(() => {
        setTheme(originalTheme);
        setShowOverlay(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isActive, setTheme, originalTheme, actualTheme, onTransitionComplete]);

  if (!isActive && !showOverlay) {
    return null;
  }

  return (
    <>
      {/* Black fade overlay */}
      <div
        className={`fixed inset-0 bg-black z-[60] transition-opacity duration-500 ease-in-out ${
          showOverlay && isActive ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Content container - only show when transition is complete */}
      {showContent && (
        <div className="relative z-[70]">
          {children}
        </div>
      )}
    </>
  );
}