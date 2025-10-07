'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface LoadingContextType {
  isInitialLoad: boolean
}

const LoadingContext = createContext<LoadingContextType>({
  isInitialLoad: true,
})

interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // This effect runs only once on the client after the component mounts
  useEffect(() => {
    // Check if we've already shown splash in this session
    const splashShown = sessionStorage.getItem('splashShown')

    if (splashShown) {
      // If splash was already shown, don't show it again
      setIsInitialLoad(false)
    } else {
      // This is the first load, keep showing splash and mark it as shown
      sessionStorage.setItem('splashShown', 'true')
    }
  }, []) // Empty dependency array ensures it runs only once

  return (
    <LoadingContext.Provider value={{ isInitialLoad }}>
      {children}
    </LoadingContext.Provider>
  )
}

// Custom hook to easily consume the context
export function useLoading() {
  return useContext(LoadingContext)
}