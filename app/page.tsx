'use client'

import { useState, useEffect, useRef } from 'react';
import MainWebsite from '@/components/MainWebsite';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useBlogPostStore } from '@/lib/stores/blog-post-store';
import { useArtSummaryStore } from '@/lib/stores/art-summary-store';
import { useNavigationType } from '@/lib/navigation-provider';

// Splash overlay component - renders instantly on hard navigation
function SplashOverlay({ shouldShow }: { shouldShow: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFading, setIsFading] = useState(false);
  const [shouldRender, setShouldRender] = useState(shouldShow);

  // Timing constants
  const PAUSE_DURATION = 750; // milliseconds to stay paused
  const PLAY_BEFORE_FADE = 1500; // milliseconds to play before fade starts
  const FADE_DURATION = 2000; // milliseconds for fade transition

  useEffect(() => {
    // Only start the sequence if we should show the splash
    if (!shouldShow) {
      setShouldRender(false);
      return;
    }

    // Step 1: Start playing video after pause duration
    const playTimer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, PAUSE_DURATION);

    // Step 2: Start fade after video has played
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, PAUSE_DURATION + PLAY_BEFORE_FADE);

    // Step 3: Remove from DOM after fade completes
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, PAUSE_DURATION + PLAY_BEFORE_FADE + FADE_DURATION);

    return () => {
      clearTimeout(playTimer);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [shouldShow]);

  // Don't render at all if not needed
  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition-all ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        pointerEvents: isFading ? 'none' : 'auto',
        transitionDuration: `${FADE_DURATION}ms`
      }}
    >
      {/* Background that fades out */}
      <div
        className={`absolute inset-0 bg-surface transition-opacity ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          transitionDuration: `${FADE_DURATION}ms`
        }}
      />

      {/* Video that also fades out */}
      <video
        ref={videoRef}
        className={`relative w-full h-full object-cover transition-opacity ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          transitionDuration: `${FADE_DURATION}ms`
        }}
        muted
        loop
        playsInline
      >
        <source src="./simasdata-2.mov" type="video/quicktime" />
        <source src="./simasdata-2.mov" type="video/mp4" />
      </video>
    </div>
  );
}

export default function Home() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const { isHardNavigation } = useNavigationType();
  const [shouldShowSplash, setShouldShowSplash] = useState(isHardNavigation);
  const checkAuth = useAuthStore(state => state.checkAuth);
  const fetchRecentPosts = useBlogPostStore(state => state.fetchRecentPosts);
  const fetchArtSummaries = useArtSummaryStore(state => state.fetchArtSummaries);

  // Update splash state if navigation type changes (shouldn't happen but for safety)
  useEffect(() => {
    setShouldShowSplash(isHardNavigation);
  }, [isHardNavigation]);

  // Check if device is mobile in landscape mode
  useEffect(() => {
    const checkMobileLandscape = () => {
      const isMobile = window.innerHeight <= 500; // Mobile breakpoint
      const isLandscape = window.innerWidth > window.innerHeight;
      setIsMobileLandscape(isMobile && isLandscape);
    };

    // Check on mount
    checkMobileLandscape();

    // Listen for resize and orientation changes
    window.addEventListener('resize', checkMobileLandscape);
    window.addEventListener('orientationchange', () => {
      // Small delay to ensure orientation change is complete
      setTimeout(checkMobileLandscape, 100);
    });

    return () => {
      window.removeEventListener('resize', checkMobileLandscape);
      window.removeEventListener('orientationchange', checkMobileLandscape);
    };
  }, []);

  // Fetch blog posts, art summaries, and check auth on page load
  useEffect(() => {
    fetchRecentPosts();
    fetchArtSummaries();
    checkAuth();
  }, [fetchRecentPosts, fetchArtSummaries, checkAuth]);

  const handleNavigation = (routeId: string) => {
    setCurrentRoute(routeId);
  };

  return (
    <>
      {/* Main website - always rendered */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 transition-all duration-300">
        {/* Fixed Header - Hidden in mobile landscape */}
        {!isMobileLandscape && (
          <Header currentRoute={currentRoute} onNavigate={handleNavigation} />
        )}

        {/* Fixed Footer - Hidden in mobile landscape */}
        {!isMobileLandscape && <Footer />}

        {/* Main Website Content - Full height in mobile landscape */}
        <MainWebsite
          currentRoute={currentRoute}
          onNavigate={handleNavigation}
          isMobileLandscape={isMobileLandscape}
        />
      </div>

      {/* Splash overlay - only shows on hard navigation to this specific page */}
      <SplashOverlay shouldShow={shouldShowSplash} />
    </>
  );
}