'use client'

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ScrollHeaderProps {
  backText: string;
  backHref: string;
  onBack?: () => void;
}

export default function ScrollHeader({ backText, backHref, onBack }: ScrollHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling down past 200px
      // Hide when scrolling back up past 100px
      if (currentScrollY > 200 && currentScrollY > lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY < 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="bg-surface-secondary/95 dark:bg-surface-elevated/95 backdrop-blur-md border-b border-border-primary/20">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center">
            {onBack ? (
              <button
                onClick={onBack}
                className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm uppercase tracking-[0.2em] font-light">{backText}</span>
              </button>
            ) : (
              <Link
                href={backHref}
                className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm uppercase tracking-[0.2em] font-light">{backText}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}