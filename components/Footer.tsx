'use client'

import { useAuthStore } from '../lib/store'
import { useState, useRef } from 'react'

export default function Footer() {
  const user = useAuthStore(state => state.user)
  const isAuthenticated = !!user
  const [isPressed, setIsPressed] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const handlePressStart = () => {
    setIsPressed(true)
    timeoutRef.current = setTimeout(() => {
      // Redirect to admin portal after 1 second
      window.location.href = '/admin-portal'
    }, 1000)
  }

  const handlePressEnd = () => {
    setIsPressed(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  return (
    <footer 
      className="fixed bottom-0 left-0 w-full bg-white z-30"
      style={{
        height: '80px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        alignItems: 'center',
        padding: '0 60px',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Left: Gallery Name */}
      <div 
        className={`text-xs tracking-[0.2em] font-light uppercase transition-colors ${
          isAuthenticated ? 'text-green-600' : 'text-black'
        }`}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
      >
        simasdata
      </div>

      {/* Center: Location */}
      <div className="hidden md:block text-xs tracking-[0.15em] text-gray-500 font-light text-center">
        San Francisco
      </div>

      {/* Right: Links */}
      <div className="flex items-center space-x-8 justify-end">
        <a 
          href="mailto:hello@gallery.com" 
          className="text-xs tracking-[0.1em] text-gray-500 hover:text-black transition-colors font-light"
        >
          Contact
        </a>
        <a 
          href="https://www.instagram.com/simasdata/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs tracking-[0.1em] text-gray-500 hover:text-black transition-colors font-light"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
}