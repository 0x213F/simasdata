import { create } from 'zustand'
import { supabase, Artist, Project, BlogPost } from './supabase'
import { User } from '@supabase/supabase-js'

// Utility function to preload images
const preloadImages = (posts: BlogPost[]) => {
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

interface ArtistStore {
  artists: Artist[]
  loading: boolean
  error: string | null
  fetchArtists: () => Promise<void>
  refetchArtists: () => Promise<void>
  createArtist: (name: string, description: string) => Promise<boolean>
}

interface ProjectStore {
  projects: Project[]
  loading: boolean
  error: string | null
  fetchProjects: () => Promise<void>
  refetchProjects: () => Promise<void>
  createProject: (name: string, description: string) => Promise<boolean>
}

interface BlogPostStore {
  posts: BlogPost[]
  selectedIndex: number
  loading: boolean
  error: string | null
  selectedPost: BlogPost | null
  fetchRecentPosts: () => Promise<void>
  fetchMoreOlderPosts: () => Promise<void>
  createBlogPost: (pane1Text: string | null, pane2Text: string | null, pane1ImageUrl?: string | null, pane2ImageUrl?: string | null) => Promise<boolean>
  navigateToNewerPost: () => void
  navigateToOlderPost: () => void
  setSelectedIndex: (index: number) => void
}

interface AuthStore {
  user: User | null
  loading: boolean
  initialized: boolean
  checkAuth: () => Promise<void>
  signOut: () => Promise<void>
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

  createArtist: async (name: string, description: string) => {
    const state = get()
    if (state.loading) {
      return false
    }

    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('Artist')
        .insert({
          name: name.trim(),
          description: description.trim(),
          medium: '', // Default empty medium
          is_active: true
        })
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
  }
}))

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    // Don't fetch if already loading or if we already have data
    const state = get()
    if (state.loading || (state.projects.length > 0 && !state.error)) {
      return
    }

    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('Project')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) {
        set({
          loading: false,
          error: error.message,
          projects: []
        })
      } else {
        set({
          loading: false,
          error: null,
          projects: data || []
        })
      }
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || 'Failed to fetch projects',
        projects: []
      })
    }
  },

  refetchProjects: async () => {
    // Force refetch by clearing current data first
    set({ projects: [], loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('Project')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) {
        set({
          loading: false,
          error: error.message,
          projects: []
        })
      } else {
        set({
          loading: false,
          error: null,
          projects: data || []
        })
      }
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || 'Failed to fetch projects',
        projects: []
      })
    }
  },

  createProject: async (name: string, description: string) => {
    const state = get()
    if (state.loading) {
      return false
    }

    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('Project')
        .insert({
          name: name.trim(),
          description: description.trim(),
          medium: '', // Default empty medium
          is_active: true
        })
        .select()
        .single()

      if (error) {
        set({
          loading: false,
          error: error.message
        })
        return false
      } else {
        // Add the new project to the beginning of the list
        const updatedProjects = [data, ...state.projects]
        set({
          loading: false,
          error: null,
          projects: updatedProjects
        })
        return true
      }
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || 'Failed to create project'
      })
      return false
    }
  }
}))

export const useBlogPostStore = create<BlogPostStore>((set, get) => ({
  posts: [],
  selectedIndex: 0,
  loading: false,
  error: null,
  selectedPost: null,

  fetchRecentPosts: async () => {
    // Don't fetch if already loading
    const state = get()
    if (state.loading) {
      return
    }

    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('BlogPost')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        set({ 
          loading: false, 
          error: error.message,
          posts: [],
          selectedIndex: 0,
          selectedPost: null
        })
      } else {
        const posts = data || []
        
        // Preload images in the background
        if (posts.length > 0) {
          preloadImages(posts)
        }
        
        set({ 
          loading: false, 
          error: null,
          posts: posts,
          selectedIndex: 0, // Always start with the newest post (index 0)
          selectedPost: posts[0] || null
        })
      }
    } catch (err: any) {
      set({ 
        loading: false, 
        error: err.message || 'Failed to fetch recent posts',
        posts: [],
        selectedIndex: 0,
        selectedPost: null
      })
    }
  },

  fetchMoreOlderPosts: async () => {
    const state = get()
    
    // Don't fetch if already loading or no posts exist
    if (state.loading || state.posts.length === 0) {
      return
    }

    // Get the oldest post's created_at timestamp to fetch posts older than it
    const oldestPost = state.posts[state.posts.length - 1]
    
    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('BlogPost')
        .select('*')
        .lt('created_at', oldestPost.created_at)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        set({ 
          loading: false, 
          error: error.message
        })
      } else {
        // Append the new older posts to the existing cache
        const newPosts = data || []
        const updatedPosts = [...state.posts, ...newPosts]
        
        // Preload images for the newly fetched posts
        if (newPosts.length > 0) {
          preloadImages(newPosts)
        }
        
        set({ 
          loading: false, 
          error: null,
          posts: updatedPosts,
          selectedPost: updatedPosts[state.selectedIndex] || null
        })
      }
    } catch (err: any) {
      set({ 
        loading: false, 
        error: err.message || 'Failed to fetch more posts'
      })
    }
  },

  createBlogPost: async (pane1Text: string | null, pane2Text: string | null, pane1ImageUrl?: string | null, pane2ImageUrl?: string | null) => {
    const state = get()
    if (state.loading) {
      return false
    }

    set({ loading: true, error: null })

    try {
      // Prepare insert data - only include non-null values
      const insertData: any = {}
      if (pane1Text) insertData.pane_1_text = pane1Text
      if (pane2Text) insertData.pane_2_text = pane2Text
      if (pane1ImageUrl) insertData.pane_1_imgurl = pane1ImageUrl
      if (pane2ImageUrl) insertData.pane_2_imgurl = pane2ImageUrl

      const { data, error } = await supabase
        .from('BlogPost')
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
        // Preload images for the new post
        preloadImages([data])
        
        // Add the new post to the beginning of the cache and update selectedPost
        const updatedPosts = [data, ...state.posts]
        set({ 
          loading: false, 
          error: null,
          posts: updatedPosts,
          selectedIndex: 0, // Select the new post
          selectedPost: data
        })
        return true
      }
    } catch (err: any) {
      set({ 
        loading: false, 
        error: err.message || 'Failed to create blog post'
      })
      return false
    }
  },

  navigateToNewerPost: () => {
    const state = get()
    // Newer posts have lower indices (index 0 = newest)
    if (state.selectedIndex > 0) {
      const newIndex = state.selectedIndex - 1
      set({ 
        selectedIndex: newIndex,
        selectedPost: state.posts[newIndex] || null
      })
    }
  },

  navigateToOlderPost: () => {
    const state = get()
    // Older posts have higher indices
    if (state.selectedIndex < state.posts.length - 1) {
      const newIndex = state.selectedIndex + 1
      set({ 
        selectedIndex: newIndex,
        selectedPost: state.posts[newIndex] || null
      })
      
      // Auto-fetch more posts if we're approaching the end
      // When we're 5 posts away from the end, fetch 10 more older posts
      if (state.posts.length - newIndex <= 6 && !state.loading) {
        get().fetchMoreOlderPosts()
      }
    }
  },

  setSelectedIndex: (index: number) => {
    const state = get()
    if (index >= 0 && index < state.posts.length) {
      set({ 
        selectedIndex: index,
        selectedPost: state.posts[index] || null
      })
    }
  }
}))

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