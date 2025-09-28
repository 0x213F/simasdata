import { create } from 'zustand'
import { supabase, Artist, updateArtist as updateArtistAPI, deleteArtist as deleteArtistAPI } from '../supabase'

interface ArtistStore {
  artists: Artist[]
  loading: boolean
  error: string | null
  fetchArtists: () => Promise<void>
  refetchArtists: () => Promise<void>
  createArtist: (name: string, description: string, imageUrl?: string) => Promise<boolean>
  updateArtist: (uuid: string, name: string, description: string, imageUrl?: string) => Promise<boolean>
  deleteArtist: (uuid: string) => Promise<boolean>
}

export const useArtistStore = create<ArtistStore>((set, get) => ({
  artists: [],
  loading: false,
  error: null,

  fetchArtists: async () => {
    // Don't fetch if already loading or if we already have data
    const state = get()
    if (state.loading || (state.artists.length > 0 && !state.error)) {
      return
    }

    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('Artist')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) {
        set({
          loading: false,
          error: error.message,
          artists: []
        })
      } else {
        set({
          loading: false,
          error: null,
          artists: data || []
        })
      }
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || 'Failed to fetch artists',
        artists: []
      })
    }
  },

  refetchArtists: async () => {
    // Force refetch by clearing current data first
    set({ artists: [], loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('Artist')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) {
        set({
          loading: false,
          error: error.message,
          artists: []
        })
      } else {
        set({
          loading: false,
          error: null,
          artists: data || []
        })
      }
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || 'Failed to fetch artists',
        artists: []
      })
    }
  },

  createArtist: async (name: string, description: string, imageUrl?: string) => {
    const state = get()
    if (state.loading) {
      return false
    }

    set({ loading: true, error: null })

    try {
      const insertData: any = {
        name: name.trim(),
        description: description.trim(),
        is_active: true
      }
      if (imageUrl) {
        insertData.imgurl = imageUrl
      }

      const { data, error } = await supabase
        .from('Artist')
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
        // Add the new artist to the beginning of the list
        const updatedArtists = [data, ...state.artists]
        set({
          loading: false,
          error: null,
          artists: updatedArtists
        })
        return true
      }
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || 'Failed to create artist'
      })
      return false
    }
  },

  updateArtist: async (uuid: string, name: string, description: string, imageUrl?: string) => {
    const state = get()
    if (state.loading) {
      return false
    }

    set({ loading: true, error: null })

    try {
      const success = await updateArtistAPI(uuid, name, description, imageUrl)

      if (!success) {
        set({
          loading: false,
          error: 'Failed to update artist'
        })
        return false
      }

      // Update the artist in local state
      const updatedArtists = state.artists.map(artist =>
        artist.uuid === uuid
          ? {
              ...artist,
              name: name.trim(),
              description: description.trim(),
              imgurl: imageUrl || artist.imgurl,
              updated_at: new Date().toISOString()
            }
          : artist
      )

      set({
        loading: false,
        error: null,
        artists: updatedArtists
      })

      return true
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || 'Failed to update artist'
      })
      return false
    }
  },

  deleteArtist: async (uuid: string) => {
    const state = get()
    if (state.loading) {
      return false
    }

    set({ loading: true, error: null })

    try {
      const success = await deleteArtistAPI(uuid)

      if (!success) {
        set({
          loading: false,
          error: 'Failed to delete artist'
        })
        return false
      }

      // Remove the artist from local state
      const updatedArtists = state.artists.filter(artist => artist.uuid !== uuid)

      set({
        loading: false,
        error: null,
        artists: updatedArtists
      })

      return true
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || 'Failed to delete artist'
      })
      return false
    }
  }
}))