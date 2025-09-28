import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase, ArtSummary, updateArtSummary as updateArtSummaryAPI, deleteArtSummary as deleteArtSummaryAPI, generateSlug } from '../supabase'
import { createTTLStorage, TTL_30_MINUTES } from './utils'

// Unified ArtSummaryStore for both artists and projects
interface ArtSummaryStore {
  artSummaries: ArtSummary[]
  loading: boolean
  error: string | null
  hasHydrated: boolean
  setHasHydrated: (hasHydrated: boolean) => void
  // Main data fetching
  fetchArtSummaries: () => Promise<void>
  refetchArtSummaries: () => Promise<void>
  // CRUD operations
  createArtSummary: (name: string, description: string, type: 'artist' | 'project', imageUrl?: string, slug?: string) => Promise<boolean>
  updateArtSummary: (uuid: string, name: string, description: string, type: 'artist' | 'project', imageUrl?: string, slug?: string) => Promise<boolean>
  deleteArtSummary: (uuid: string) => Promise<boolean>
  // Legacy compatibility methods
  createArtist: (name: string, description: string, imageUrl?: string) => Promise<boolean>
  createProject: (name: string, description: string, imageUrl?: string) => Promise<boolean>
  updateArtist: (uuid: string, name: string, description: string, imageUrl?: string) => Promise<boolean>
  updateProject: (uuid: string, name: string, description: string, imageUrl?: string) => Promise<boolean>
  deleteArtist: (uuid: string) => Promise<boolean>
  deleteProject: (uuid: string) => Promise<boolean>
}

// New unified ArtSummaryStore with automatic caching
export const useArtSummaryStore = create<ArtSummaryStore>()(
  persist(
    (set, get) => ({
      artSummaries: [],
      loading: false,
      error: null,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      fetchArtSummaries: async () => {
        const state = get()

        // Don't fetch if already loading or if we already have data
        if (state.loading || (state.artSummaries.length > 0 && !state.error)) {
          return
        }

        set({ loading: true, error: null })

        try {
          const { data, error } = await supabase
            .from('ArtSummary')
            .select('*')
            .eq('is_active', true)
            .order('text_1', { ascending: true })

          if (error) {
            set({
              loading: false,
              error: error.message,
              artSummaries: []
            })
          } else {
            set({
              loading: false,
              error: null,
              artSummaries: data || []
            })
          }
        } catch (err: any) {
          set({
            loading: false,
            error: err.message || 'Failed to fetch art summaries',
            artSummaries: []
          })
        }
      },

      refetchArtSummaries: async () => {
        // Force refetch by clearing current data
        set({ artSummaries: [], loading: true, error: null })

        try {
          const { data, error } = await supabase
            .from('ArtSummary')
            .select('*')
            .eq('is_active', true)
            .order('text_1', { ascending: true })

          if (error) {
            set({
              loading: false,
              error: error.message,
              artSummaries: []
            })
          } else {
            set({
              loading: false,
              error: null,
              artSummaries: data || []
            })
          }
        } catch (err: any) {
          set({
            loading: false,
            error: err.message || 'Failed to fetch art summaries',
            artSummaries: []
          })
        }
      },

      createArtSummary: async (name: string, description: string, type: 'artist' | 'project', imageUrl?: string, slug?: string) => {
        const state = get()
        if (state.loading) {
          return false
        }

        set({ loading: true, error: null })

        try {
          const insertData: any = {
            text_1: name.trim(),
            text_2: description.trim(),
            type,
            slug: slug || generateSlug(name),
            is_active: true
          }
          if (imageUrl) {
            insertData.img_url_1 = imageUrl
          }

          const { data, error } = await supabase
            .from('ArtSummary')
            .insert(insertData)
            .select()
            .single()

          if (error) {
            set({
              loading: false,
              error: error.message
            })
            return false
          } else {
            // Add the new item to the beginning of the list
            const updatedArtSummaries = [data, ...state.artSummaries]

            set({
              loading: false,
              error: null,
              artSummaries: updatedArtSummaries
            })
            return true
          }
        } catch (err: any) {
          set({
            loading: false,
            error: err.message || `Failed to create ${type}`
          })
          return false
        }
      },

      updateArtSummary: async (uuid: string, name: string, description: string, type: 'artist' | 'project', imageUrl?: string, slug?: string) => {
        const state = get()
        if (state.loading) {
          return false
        }

        set({ loading: true, error: null })

        try {
          const success = await updateArtSummaryAPI(uuid, name, description, type, imageUrl, slug)

          if (!success) {
            set({
              loading: false,
              error: `Failed to update ${type}`
            })
            return false
          }

          // Update the item in local state
          const updatedArtSummaries = state.artSummaries.map(item =>
            item.uuid === uuid
              ? {
                  ...item,
                  text_1: name.trim(),
                  text_2: description.trim(),
                  type,
                  slug: slug || item.slug || generateSlug(name),
                  img_url_1: imageUrl || item.img_url_1,
                  updated_at: new Date().toISOString()
                }
              : item
          )

          set({
            loading: false,
            error: null,
            artSummaries: updatedArtSummaries
          })

          return true
        } catch (err: any) {
          set({
            loading: false,
            error: err.message || `Failed to update ${type}`
          })
          return false
        }
      },

      deleteArtSummary: async (uuid: string) => {
        const state = get()
        if (state.loading) {
          return false
        }

        set({ loading: true, error: null })

        try {
          const success = await deleteArtSummaryAPI(uuid)

          if (!success) {
            set({
              loading: false,
              error: 'Failed to delete item'
            })
            return false
          }

          // Remove the item from local state
          const updatedArtSummaries = state.artSummaries.filter(item => item.uuid !== uuid)

          set({
            loading: false,
            error: null,
            artSummaries: updatedArtSummaries
          })

          return true
        } catch (err: any) {
          set({
            loading: false,
            error: err.message || 'Failed to delete item'
          })
          return false
        }
      },

      // Legacy compatibility methods
      createArtist: async (name: string, description: string, imageUrl?: string) => {
        return get().createArtSummary(name, description, 'artist', imageUrl)
      },

      createProject: async (name: string, description: string, imageUrl?: string) => {
        return get().createArtSummary(name, description, 'project', imageUrl)
      },

      updateArtist: async (uuid: string, name: string, description: string, imageUrl?: string) => {
        return get().updateArtSummary(uuid, name, description, 'artist', imageUrl)
      },

      updateProject: async (uuid: string, name: string, description: string, imageUrl?: string) => {
        return get().updateArtSummary(uuid, name, description, 'project', imageUrl)
      },

      deleteArtist: async (uuid: string) => {
        return get().deleteArtSummary(uuid)
      },

      deleteProject: async (uuid: string) => {
        return get().deleteArtSummary(uuid)
      }
    }),
    {
      name: 'art-summary-storage',
      storage: createJSONStorage(() => createTTLStorage(TTL_30_MINUTES)),
      partialize: (state) => ({ artSummaries: state.artSummaries }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)