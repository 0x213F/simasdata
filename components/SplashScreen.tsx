'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [requireClick] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const startSequence = () => {
    if (hasStarted) return;
    setHasStarted(true);
    
    // After 1 second, transition from image to video
    setTimeout(() => {
      setShowVideo(true);
    }, 1000);
    
    // After total of 3.5 seconds (1s image + 2.5s video), fade out
    setTimeout(() => {
      setIsVisible(false);
    }, 3500);
  };

  useEffect(() => {
    if (!requireClick) {
      startSequence();
    }
  }, [requireClick]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer transition-opacity duration-500 ${!isVisible ? 'opacity-0' : 'opacity-100'}`}
      onClick={requireClick ? startSequence : undefined}
    >
      <div className="relative w-full h-full">
        {!showVideo && (
          <Image
            src="./simasdata-1.jpg"
            alt="Gallery Landing"
            fill
            className="object-cover"
            priority
          />
        )}
        
        {showVideo && (
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
          >
            <source src="./simasdata-2.mov" type="video/quicktime" />
            <source src="./simasdata-2.mov" type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
}