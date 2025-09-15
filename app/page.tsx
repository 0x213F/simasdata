'use client'

import { useState, useEffect } from 'react';
import MainWebsite from '../components/MainWebsite';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useArtistStore, useAuthStore, useBlogPostStore } from '../lib/store';

export default function Home() {
  const [currentRoute, setCurrentRoute] = useState('splash');
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const fetchArtists = useArtistStore(state => state.fetchArtists);
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

  // Fetch artists, blog posts, and check auth on page load
  useEffect(() => {
    fetchArtists();
    fetchRecentPosts();
    checkAuth();
  }, [fetchArtists, fetchRecentPosts, checkAuth]);

  const handleNavigation = (routeId: string) => {
    setCurrentRoute(routeId);
  };

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