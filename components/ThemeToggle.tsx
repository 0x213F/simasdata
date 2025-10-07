'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'button' | 'icon' | 'minimal';
}

export default function ThemeToggle({
  className = '',
  showLabel = false,
  variant = 'icon'
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);

  // Only render after hydration to prevent SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted
  if (!mounted) {
    return (
      <div className={`
        ${variant === 'button' ? 'inline-flex items-center gap-2 px-3 py-2' : 'p-2'}
        ${variant === 'minimal' ? 'p-1.5' : ''}
        opacity-0
        ${className}
      `}>
        <div className={variant === 'minimal' ? 'w-4 h-4' : 'w-5 h-5'} />
      </div>
    );
  }

  const { theme, actualTheme, setTheme } = useTheme();

  const getIcon = (themeType: string) => {
    const iconClasses = variant === 'minimal' ? 'w-4 h-4' : 'w-5 h-5';

    switch (themeType) {
      case 'light':
        return <Sun className={iconClasses} />;
      case 'dark':
        return <Moon className={iconClasses} />;
      case 'system':
        return <Monitor className={iconClasses} />;
      default:
        return <Sun className={iconClasses} />;
    }
  };

  const getLabel = (themeType: string) => {
    switch (themeType) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'Light';
    }
  };

  const cycleTheme = () => {
    const themeOrder: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  if (variant === 'button') {
    return (
      <button
        onClick={cycleTheme}
        className={`
          inline-flex items-center gap-2 px-3 py-2
          bg-surface-secondary dark:bg-surface-elevated
          border border-border-primary dark:border-border-primary
          rounded-lg
          text-text-secondary dark:text-text-secondary
          hover:text-text-primary dark:hover:text-text-primary
          hover:bg-surface-tertiary dark:hover:bg-surface-tertiary
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-border-focus dark:focus:ring-border-focus
          ${className}
        `}
        title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
        aria-label="Toggle theme"
      >
        {getIcon(theme)}
        {showLabel && (
          <span className="text-sm font-medium">
            {getLabel(theme)}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={cycleTheme}
        className={`
          p-1.5
          text-text-tertiary dark:text-text-tertiary
          hover:text-text-primary dark:hover:text-text-primary
          transition-colors duration-200
          focus:outline-none focus:ring-1 focus:ring-border-focus dark:focus:ring-border-focus
          rounded-md
          ${className}
        `}
        title={`Current: ${getLabel(theme)} (${getLabel(actualTheme)}). Click to cycle themes.`}
        aria-label="Toggle theme"
      >
        {getIcon(theme)}
      </button>
    );
  }

  // Default 'icon' variant
  return (
    <button
      onClick={cycleTheme}
      className={`
        p-2
        text-text-secondary dark:text-text-secondary
        hover:text-text-primary dark:hover:text-text-primary
        hover:bg-surface-secondary dark:hover:bg-surface-elevated
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-border-focus dark:focus:ring-border-focus
        rounded-lg
        ${className}
      `}
      title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
      aria-label="Toggle theme"
    >
      {getIcon(theme)}
      {showLabel && (
        <span className="ml-2 text-sm">
          {getLabel(theme)}
        </span>
      )}
    </button>
  );
}