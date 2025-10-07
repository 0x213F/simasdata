import { create } from 'zustand'
import { createContactSubmission as createContactSubmissionAPI } from '../supabase'

interface ContactSubmissionStore {
  loading: boolean
  error: string | null
  createContactSubmission: (text: string) => Promise<boolean>
}

export const useContactSubmissionStore = create<ContactSubmissionStore>((set, get) => ({
  loading: false,
  error: null,

  createContactSubmission: async (text: string) => {
    const state = get()
    if (state.loading) {
      return false
    }

    set({ loading: true, error: null })

    try {
      const success = await createContactSubmissionAPI(text)

      if (!success) {
        set({
          loading: false,
          error: 'Failed to submit contact message'
        })
        return false
      }

      set({
        loading: false,
        error: null
      })

      return true
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || 'Failed to submit contact message'
      })
      return false
    }
  }
}))