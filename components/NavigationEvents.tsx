"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigationType } from '@/lib/navigation-provider';

export function NavigationEvents() {
  const pathname = usePathname();
  const { isHardNavigation, navigationType } = useNavigationType();

  useEffect(() => {
    // This code will run every time the pathname changes.
    // You can add any logic here, like sending analytics events,
    // closing a mobile menu, etc.

  }, [pathname, navigationType]); // The effect depends on the pathname

  return null; // This component renders nothing.
}
