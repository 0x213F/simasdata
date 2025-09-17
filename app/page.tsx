'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import MainWebsite from '../components/MainWebsite';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useArtistStore, useProjectStore, useAuthStore, useBlogPostStore } from '../lib/store';

// Splash components
function SplashImage({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-50">
      <Image
        src="./simasdata-1.jpg"
        alt="Gallery Landing"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}

function SplashVideo({ show, fadeOut, videoRef }: {
  show: boolean;
  fadeOut: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  if (!show) return null;

  return (
    <div
      className={`absolute inset-0 z-40 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
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
  const [currentRoute, setCurrentRoute] = useState('splash');
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [videoFadeOut, setVideoFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fetchArtists = useArtistStore(state => state.fetchArtists);
  const fetchProjects = useProjectStore(state => state.fetchProjects);
  const checkAuth = useAuthStore(state => state.checkAuth);
  const fetchRecentPosts = useBlogPostStore(state => state.fetchRecentPosts);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setCurrentRoute('home');
  };

  // Splash animation sequence
  useEffect(() => {
    if (showSplash) {
      // Step 1: Show image for 1 second
      const timer1 = setTimeout(() => {
        // Step 2: Immediately switch to video (no transition/fade)
        setShowVideo(true);
        if (videoRef.current) {
          videoRef.current.play();
        }
      }, 600);

      // Step 3: Start fade at end of video (after 3 seconds total)
      const timer2 = setTimeout(() => {
        setVideoFadeOut(true);
      }, 2000);

      // Step 4: Display website (after fade completes)
      const timer3 = setTimeout(() => {
        handleSplashComplete();
      }, 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [showSplash]);

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

  // Show splash screen covering entire viewport
  if (showSplash) {
    return (
      <div className="fixed inset-0 w-full h-full bg-white">
        <SplashImage show={!showVideo} />
        <SplashVideo show={true} fadeOut={videoFadeOut} videoRef={videoRef} />
      </div>
    );
  }

  // Show main website after splash
  return (
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
  );
}