'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEME_CONFIG } from './theme-config';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark'; // The computed theme (resolves 'system' to light/dark)
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // During SSR or before provider is ready, return safe defaults
    if (typeof window === 'undefined') {
      return {
        theme: 'light' as const,
        actualTheme: 'light' as const,
        setTheme: () => {},
        toggleTheme: () => {}
      };
    }

    // On client side, still throw error to help with debugging
    // but provide more helpful context
    console.error('useTheme called outside ThemeProvider. Make sure ThemeToggle is wrapped properly.');
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

const STORAGE_KEY = 'simasdata-theme';

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme(): Theme {
  // If theme is forced, always return the forced theme (ignore all user preferences)
  if (THEME_CONFIG.FORCE_THEME) {
    return THEME_CONFIG.FORCE_THEME;
  }

  // Only check user preferences when theme is not forced
  if (typeof window === 'undefined') {
    return THEME_CONFIG.DEFAULT_THEME;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme;
    return stored || THEME_CONFIG.DEFAULT_THEME;
  } catch {
    return THEME_CONFIG.DEFAULT_THEME;
  }
}

function applyTheme(actualTheme: 'light' | 'dark') {
  const root = document.documentElement;

  if (actualTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  // If theme is forced, use simple static values
  if (THEME_CONFIG.FORCE_THEME) {
    const forcedTheme = THEME_CONFIG.FORCE_THEME;
    const contextValue: ThemeContextType = {
      theme: forcedTheme,
      actualTheme: forcedTheme,
      setTheme: () => {}, // No-op when forced
      toggleTheme: () => {}, // No-op when forced
    };

    // Apply the forced theme immediately
    useEffect(() => {
      if (forcedTheme === 'light') {
        // Aggressively enforce light mode
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      } else {
        applyTheme(forcedTheme);
      }
    }, [forcedTheme]);

    return (
      <ThemeContext.Provider value={contextValue}>
        {/* Never add dark class when forced to light */}
        <div className={forcedTheme === 'dark' ? 'dark' : ''}>
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }

  // Dynamic theme logic (only when theme is not forced)
  const [theme, setTheme] = useState<Theme>('light');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = getInitialTheme();
    const systemPreference = getSystemPreference();

    setTheme(initialTheme);

    const computed = initialTheme === 'system' ? systemPreference : initialTheme as 'light' | 'dark';
    setActualTheme(computed);

    // Apply theme immediately to prevent flash
    applyTheme(computed);
    setMounted(true);
  }, []);

  // Update actualTheme when theme or system preference changes
  useEffect(() => {
    if (!mounted) return;

    const updateActualTheme = () => {
      const systemPreference = getSystemPreference();
      const computed = theme === 'system' ? systemPreference : theme as 'light' | 'dark';
      setActualTheme(computed);
      applyTheme(computed);
    };

    updateActualTheme();

    // Listen for system preference changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateActualTheme);
      return () => mediaQuery.removeEventListener('change', updateActualTheme);
    }
  }, [theme, mounted]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      handleSetTheme('dark');
    } else if (theme === 'dark') {
      handleSetTheme('system');
    } else {
      handleSetTheme('light');
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface">
        {children}
      </div>
    );
  }

  const contextValue: ThemeContextType = {
    theme,
    actualTheme,
    setTheme: handleSetTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={`min-h-screen transition-theme ${actualTheme === 'dark' ? 'dark' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}