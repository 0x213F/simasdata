import { create } from 'zustand'
import { supabase, Project, updateProject as updateProjectAPI, deleteProject as deleteProjectAPI } from '../supabase'

interface ProjectStore {
  projects: Project[]
  loading: boolean
  error: string | null
  fetchProjects: () => Promise<void>
  refetchProjects: () => Promise<void>
  createProject: (name: string, description: string, imageUrl?: string) => Promise<boolean>
  updateProject: (uuid: string, name: string, description: string, imageUrl?: string) => Promise<boolean>
  deleteProject: (uuid: string) => Promise<boolean>
}

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

  createProject: async (name: string, description: string, imageUrl?: string) => {
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
        .from('Project')
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
  },

  updateProject: async (uuid: string, name: string, description: string, imageUrl?: string) => {
    const state = get()
    if (state.loading) {
      return false
    }

    set({ loading: true, error: null })

    try {
      const success = await updateProjectAPI(uuid, name, description, imageUrl)

      if (!success) {
        set({
          loading: false,
          error: 'Failed to update project'
        })
        return false
      }

      // Update the project in local state
      const updatedProjects = state.projects.map(project =>
        project.uuid === uuid
          ? {
              ...project,
              name: name.trim(),
              description: description.trim(),
              imgurl: imageUrl || project.imgurl,
              updated_at: new Date().toISOString()
            }
          : project
      )

      set({
        loading: false,
        error: null,
        projects: updatedProjects
      })

      return true
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || 'Failed to update project'
      })
      return false
    }
  },

  deleteProject: async (uuid: string) => {
    const state = get()
    if (state.loading) {
      return false
    }

    set({ loading: true, error: null })

    try {
      const success = await deleteProjectAPI(uuid)

      if (!success) {
        set({
          loading: false,
          error: 'Failed to delete project'
        })
        return false
      }

      // Remove the project from local state
      const updatedProjects = state.projects.filter(project => project.uuid !== uuid)

      set({
        loading: false,
        error: null,
        projects: updatedProjects
      })

      return true
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || 'Failed to delete project'
      })
      return false
    }
  }
}))