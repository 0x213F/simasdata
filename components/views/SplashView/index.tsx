'use client';

import { useState, useEffect, useRef } from 'react';
import SplashImage from './SplashImage';
import SplashVideo from './SplashVideo';

interface SplashViewProps {
  onComplete?: () => void;
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