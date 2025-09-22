'use client'

import { useState, useEffect, useRef } from 'react';
import MainWebsite from '@/components/MainWebsite';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useArtistStore, useProjectStore, useAuthStore, useBlogPostStore } from '@/lib/store';

// Splash overlay component
function SplashOverlay() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFading, setIsFading] = useState(false);

  // Timing constants
  const PAUSE_DURATION = 750; // milliseconds to stay paused
  const PLAY_BEFORE_FADE = 1500; // milliseconds to play before fade starts
  const FADE_DURATION = 2000; // milliseconds for fade transition

  useEffect(() => {
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

    return () => {
      clearTimeout(playTimer);
      clearTimeout(fadeTimer);
    };
  }, []);

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
      {/* White background that fades out */}
      <div
        className={`absolute inset-0 bg-white transition-opacity ${
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
  const fetchArtists = useArtistStore(state => state.fetchArtists);
  const fetchProjects = useProjectStore(state => state.fetchProjects);
  const checkAuth = useAuthStore(state => state.checkAuth);
  const fetchRecentPosts = useBlogPostStore(state => state.fetchRecentPosts);

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

  // Fetch artists, projects, blog posts, and check auth on page load
  useEffect(() => {
    fetchArtists();
    fetchProjects();
    fetchRecentPosts();
    checkAuth();
  }, [fetchArtists, fetchProjects, fetchRecentPosts, checkAuth]);

  const handleNavigation = (routeId: string) => {
    setCurrentRoute(routeId);
  };

  return (
    <>
      {/* Main website - always rendered */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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

      {/* Splash overlay - fades out to reveal website underneath */}
      <SplashOverlay />
    </>
  );
}