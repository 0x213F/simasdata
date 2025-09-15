'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Import view components
import HomeView from './views/HomeView';
import ProjectsView from './views/ProjectsView';
import ArtistsView from './views/ArtistsView';

interface MainWebsiteProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isMobileLandscape?: boolean;
}

// Simple HTML/CSS splash components
function SplashImage({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-20">
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
      className={`absolute inset-0 z-10 transition-opacity duration-500 ${
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

export default function MainWebsite({ currentRoute, onNavigate, isMobileLandscape = false }: MainWebsiteProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [videoFadeOut, setVideoFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSplashComplete = () => {
    setShowSplash(false);
    onNavigate('home');
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
      }, 1000);

      // Step 3: Start fade at end of video (after 3 seconds total)
      const timer2 = setTimeout(() => {
        setVideoFadeOut(true);
      }, 3000);

      // Step 4: Display website (after fade completes)
      const timer3 = setTimeout(() => {
        handleSplashComplete();
      }, 3500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [showSplash]);

  const renderCurrentView = () => {
    // Show splash screen
    if (showSplash) {
      return (
        <div className="w-full h-full relative bg-white">
          <SplashImage show={!showVideo} />
          <SplashVideo show={showVideo} fadeOut={videoFadeOut} videoRef={videoRef} />
        </div>
      );
    }

    // Show regular views after splash
    switch (currentRoute) {
      case 'home':
        return <HomeView isMobileLandscape={isMobileLandscape} />;
      case 'projects':
        return <ProjectsView />;
      case 'artists':
        return <ArtistsView />;
      default:
        return <HomeView isMobileLandscape={isMobileLandscape} />;
    }
  };

  return (
    <main 
      className={
        isMobileLandscape 
          ? "fixed inset-0 overflow-auto" 
          : "fixed top-20 bottom-20 left-0 right-0 overflow-auto"
      }
    >
      <div className="transition-opacity duration-300 h-full">
        {renderCurrentView()}
      </div>
    </main>
  );
}