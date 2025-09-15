'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface SplashViewProps {
  onComplete?: () => void;
}

// Simple HTML/CSS splash components
function SplashImage({ show, fadeOut }: { show: boolean; fadeOut: boolean }) {
  if (!show) return null;

  return (
    <div
      className={`absolute inset-0 z-20 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <Image
        src="/simasdata-1.jpg"
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
        <source src="/simasdata-2.mov" type="video/quicktime" />
        <source src="/simasdata-2.mov" type="video/mp4" />
      </video>
    </div>
  );
}

export default function SplashView({ onComplete }: SplashViewProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [videoFadeOut, setVideoFadeOut] = useState(false);
  const [imageFadeOut, setImageFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // After 1 second, transition from image to video
    const timer1 = setTimeout(() => {
      setImageFadeOut(true);
      setTimeout(() => {
        setShowVideo(true);
        if (videoRef.current) {
          videoRef.current.play();
        }
      }, 250);
    }, 800);
    
    // After 3 seconds, start video fade out
    const timer2 = setTimeout(() => {
      setVideoFadeOut(true);
    }, 2800);
    
    // After total of 4 seconds, mark as complete
    const timer3 = setTimeout(() => {
      onComplete?.();
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="w-full h-full relative bg-black">
      <SplashImage show={!showVideo} fadeOut={imageFadeOut} />
      <SplashVideo show={showVideo} fadeOut={videoFadeOut} videoRef={videoRef} />
    </div>
  );
}