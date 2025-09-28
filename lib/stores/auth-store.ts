import { create } from 'zustand'
import { supabase } from '../supabase'
import { User } from '@supabase/supabase-js'

interface AuthStore {
  user: User | null
  loading: boolean
  initialized: boolean
  checkAuth: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,

  checkAuth: async () => {
    const state = get()
    if (state.loading) return

    set({ loading: true })

    try {
      // Get current user
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error && error.message !== 'JWT expired') {
        console.warn('Auth check error:', error.message)
      }

      set({
        user: user || null,
        loading: false,
        initialized: true
      })

      // Set up auth state change listener (only if not already listening)
      if (!state.initialized) {
        supabase.auth.onAuthStateChange((event, session) => {
          set({
            user: session?.user ?? null,
            loading: false,
            initialized: true
          })
        })
      }
    } catch (err: any) {
      console.warn('Auth check failed:', err.message)
      set({
        user: null,
        loading: false,
        initialized: true
      })
    }
  },

  signOut: async () => {
    set({ loading: true })

    try {
      await supabase.auth.signOut()
      set({
        user: null,
        loading: false
      })
    } catch (err: any) {
      console.error('Sign out failed:', err.message)
      set({ loading: false })
    }
  }
}))