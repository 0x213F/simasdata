'use client';

import React, { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

// Navigation context to track if navigation was soft (client-side) or hard (page load)
const NavigationContext = createContext<{
  isNavigatingRef: React.MutableRefObject<boolean>;
  isHardNavigation: boolean;
} | null>(null);

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const isNavigatingRef = useRef(false);
  const [isHardNavigation, setIsHardNavigation] = useState(true); // Start as true for initial load
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  // Initial check on mount
  useEffect(() => {
    // Check if this is a hard navigation by examining the referrer
    // and checking if we came from a soft navigation
    const checkNavigationType = () => {
      // If we have a flag indicating soft navigation, this is not a hard nav
      if (isNavigatingRef.current) {
        setIsHardNavigation(false);
        isNavigatingRef.current = false; // Reset the flag
        return;
      }

      // Check document.referrer as additional verification
      const referrer = document.referrer;
      const currentOrigin = window.location.origin;

      // If referrer is from same origin and we didn't have a soft nav flag,
      // this could still be a hard navigation (refresh, direct URL)
      // The key is the isNavigatingRef flag which gets set by our TrackedLink
      if (referrer && referrer.startsWith(currentOrigin) && !isNavigatingRef.current) {
        // This is likely a hard navigation even with same-origin referrer
        setIsHardNavigation(true);
      } else if (!referrer || !referrer.startsWith(currentOrigin)) {
        // External referrer or no referrer = definitely hard navigation
        setIsHardNavigation(true);
      } else {
        // Same origin referrer with soft nav flag = soft navigation
        setIsHardNavigation(false);
      }
    };

    checkNavigationType();
  }, []);

  // Track pathname changes to update navigation type
  useEffect(() => {
    // Only update if pathname actually changed
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;

      // If isNavigatingRef is true, this was a soft navigation via TrackedLink
      if (isNavigatingRef.current) {
        setIsHardNavigation(false);
        isNavigatingRef.current = false; // Reset the flag
      } else {
        // No TrackedLink was clicked, so this is a hard navigation
        setIsHardNavigation(true);
      }
    }
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{ isNavigatingRef, isHardNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
}

// Custom Link component that tracks navigation
export function TrackedLink({ children, ...props }: React.ComponentProps<typeof Link>) {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error('TrackedLink must be used within a NavigationProvider');
  }

  const { isNavigatingRef } = context;

  return (
    <Link
      {...props}
      onClick={(e) => {
        // Set flag to indicate this is a soft navigation
        isNavigatingRef.current = true;
        if (props.onClick) props.onClick(e);
      }}
    >
      {children}
    </Link>
  );
}

// Hook to get navigation type
export function useNavigationType() {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error('useNavigationType must be used within a NavigationProvider');
  }

  return {
    isHardNavigation: context.isHardNavigation,
    navigationType: context.isHardNavigation ? 'hard' : 'soft'
  };
}