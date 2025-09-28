import { createJSONStorage } from 'zustand/middleware'
import { BlogPost } from '../supabase'

// Utility function to preload images
export const preloadImages = (posts: BlogPost[]) => {
  posts.forEach(post => {
    // Preload pane 1 image if it exists
    if (post.pane_1_imgurl) {
      const img1 = new Image()
      img1.src = post.pane_1_imgurl
    }

    // Preload pane 2 image if it exists
    if (post.pane_2_imgurl) {
      const img2 = new Image()
      img2.src = post.pane_2_imgurl
    }
  })
}

// Custom storage with TTL for Zustand persist
export const createTTLStorage = (ttlMs: number) => ({
  getItem: (name: string): string | null => {
    try {
      const item = localStorage.getItem(name)
      if (!item) return null

      const parsed = JSON.parse(item)
      const now = Date.now()

      if (parsed.timestamp && now - parsed.timestamp > ttlMs) {
        localStorage.removeItem(name)
        return null
      }

      return item
    } catch (error) {
      console.warn('Failed to read from TTL storage:', error)
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      const parsed = JSON.parse(value)
      const withTimestamp = {
        ...parsed,
        timestamp: Date.now()
      }
      localStorage.setItem(name, JSON.stringify(withTimestamp))
    } catch (error) {
      console.warn('Failed to write to TTL storage:', error)
    }
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name)
  }
})

export const TTL_30_MINUTES = 30 * 60 * 1000