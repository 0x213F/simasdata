import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase, ArtSummary, ArtSummaryWithDetails, updateArtSummary as updateArtSummaryAPI, deleteArtSummary as deleteArtSummaryAPI, generateSlug } from '../supabase'
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
  // Single item fetching by slug
  fetchArtSummaryBySlug: (slug: string, type: 'artist' | 'project') => Promise<ArtSummary | null>
  // Single item fetching with details by slug
  fetchArtSummaryWithDetailsBySlug: (slug: string, type: 'artist' | 'project') => Promise<ArtSummaryWithDetails | null>
  // CRUD operations
  createArtSummary: (name: string, description: string, type: 'artist' | 'project', imageUrl?: string, slug?: string) => Promise<boolean>
  updateArtSummary: (uuid: string, name: string, description: string, type: 'artist' | 'project', imageUrl?: string, slug?: string) => Promise<boolean>
  deleteArtSummary: (uuid: string) => Promise<boolean>
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

      fetchArtSummaryBySlug: async (slug: string, type: 'artist' | 'project') => {
        try {
          const { data, error } = await supabase
            .from('ArtSummary')
            .select('*')
            .eq('slug', slug)
            .eq('type', type)
            .eq('is_active', true)
            .single()

          if (error) {
            console.error(`Failed to fetch ${type} by slug:`, error)
            return null
          }

          return data
        } catch (err: any) {
          console.error(`Failed to fetch ${type} by slug:`, err)
          return null
        }
      },

      fetchArtSummaryWithDetailsBySlug: async (slug: string, type: 'artist' | 'project') => {
        try {
          // Single query with join to fetch ArtSummary and related ArtDetails
          const { data, error } = await supabase
            .from('ArtSummary')
            .select(`
              *,
              ArtDetail(*)
            `)
            .eq('slug', slug)
            .eq('type', type)
            .eq('is_active', true)
            .single()

          if (error) {
            console.error(`Failed to fetch ${type} with details by slug:`, error)
            return null
          }

          if (!data) {
            console.log(`No ${type} found with slug: ${slug}`)
            return null
          }


          // Transform the data to match our expected structure
          const artDetails = data.ArtDetail || []

          // Sort by index to ensure correct order - creating a new array and ensuring proper number comparison
          const sortedArtDetails = [...artDetails].sort((a, b) => {
            const indexA = Number(a.index)
            const indexB = Number(b.index)
            return indexA - indexB
          })

          return {
            ...data,
            artDetails: sortedArtDetails
          }
        } catch (err: any) {
          console.error(`Failed to fetch ${type} with details by slug:`, err)
          return null
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