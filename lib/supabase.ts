import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Image upload utility for blog posts
export const uploadBlogImage = async (file: File): Promise<string | null> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be smaller than 5MB')
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error } = await supabase.storage
      .from('BlogPostImage')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return null
    }
    
    // Return public URL
    const { data: { publicUrl } } = supabase.storage
      .from('BlogPostImage')
      .getPublicUrl(filePath)
      
    return publicUrl
  } catch (error) {
    console.error('Image upload failed:', error)
    return null
  }
}

// Type definitions for our Artist table
export interface Artist {
  uuid: string
  name: string
  description: string
  imgurl?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Type definitions for our Project table
export interface Project {
  uuid: string
  name: string
  description: string
  imgurl?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Type definitions for our BlogPost table
export interface BlogPost {
  uuid: string
  pane_1_text?: string
  pane_2_text?: string
  pane_1_imgurl?: string
  pane_2_imgurl?: string
  created_at: string
  updated_at: string
}

// Type definitions for our unified ArtSummary table
export interface ArtSummary {
  uuid: string
  text_1: string
  text_2: string
  img_url_1?: string
  slug: string
  is_active: boolean
  type: 'artist' | 'project'
  created_at: string
  updated_at: string
}

// Type definitions for our ContactSubmission table
export interface ContactSubmission {
  uuid: string
  text: string
  created_at: string
}

// Helper getters for backward compatibility
export const getArtSummaryName = (item: ArtSummary) => item.text_1
export const getArtSummaryDescription = (item: ArtSummary) => item.text_2
export const getArtSummaryImageUrl = (item: ArtSummary) => item.img_url_1

// Helper function to generate URL-friendly slugs
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Blog post API functions
export const updateBlogPost = async (
  uuid: string,
  pane1Text: string | null,
  pane2Text: string | null,
  pane1ImageUrl: string | null,
  pane2ImageUrl: string | null
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('BlogPost')
      .update({
        pane_1_text: pane1Text,
        pane_2_text: pane2Text,
        pane_1_imgurl: pane1ImageUrl,
        pane_2_imgurl: pane2ImageUrl
      })
      .eq('uuid', uuid)

    if (error) {
      console.error('Error updating blog post:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error updating blog post:', error)
    return false
  }
}

export const deleteBlogPost = async (uuid: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('BlogPost')
      .delete()
      .eq('uuid', uuid)

    if (error) {
      console.error('Error deleting blog post:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return false
  }
}

export const updateProject = async (
  uuid: string,
  name: string,
  description: string,
  imageUrl?: string | null
): Promise<boolean> => {
  try {
    const updateData: any = {
      name: name.trim(),
      description: description.trim(),
      updated_at: new Date().toISOString()
    }

    // Only include imgurl if provided
    if (imageUrl !== undefined) {
      updateData.imgurl = imageUrl
    }

    const { error } = await supabase
      .from('Project')
      .update(updateData)
      .eq('uuid', uuid)

    if (error) {
      console.error('Error updating project:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error updating project:', error)
    return false
  }
}

export const deleteProject = async (uuid: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Project')
      .delete()
      .eq('uuid', uuid)

    if (error) {
      console.error('Error deleting project:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting project:', error)
    return false
  }
}

export const updateArtist = async (
  uuid: string,
  name: string,
  description: string,
  imageUrl?: string | null
): Promise<boolean> => {
  try {
    const updateData: any = {
      name: name.trim(),
      description: description.trim(),
      updated_at: new Date().toISOString()
    }

    // Only include imgurl if provided
    if (imageUrl !== undefined) {
      updateData.imgurl = imageUrl
    }

    const { error } = await supabase
      .from('Artist')
      .update(updateData)
      .eq('uuid', uuid)

    if (error) {
      console.error('Error updating artist:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error updating artist:', error)
    return false
  }
}

export const deleteArtist = async (uuid: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Artist')
      .delete()
      .eq('uuid', uuid)

    if (error) {
      console.error('Error deleting artist:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting artist:', error)
    return false
  }
}

// ArtSummary API functions for unified artist/project management
export const updateArtSummary = async (
  uuid: string,
  name: string,
  description: string,
  type: 'artist' | 'project',
  imageUrl?: string | null,
  slug?: string | null
): Promise<boolean> => {
  try {
    const updateData: any = {
      text_1: name.trim(),
      text_2: description.trim(),
      type,
      updated_at: new Date().toISOString()
    }

    // Only include img_url_1 if provided
    if (imageUrl !== undefined) {
      updateData.img_url_1 = imageUrl
    }

    // Only include slug if provided, otherwise generate from name
    if (slug !== undefined) {
      updateData.slug = slug || generateSlug(name)
    }

    const { error } = await supabase
      .from('ArtSummary')
      .update(updateData)
      .eq('uuid', uuid)

    if (error) {
      console.error('Error updating art summary:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error updating art summary:', error)
    return false
  }
}

export const deleteArtSummary = async (uuid: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ArtSummary')
      .delete()
      .eq('uuid', uuid)

    if (error) {
      console.error('Error deleting art summary:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting art summary:', error)
    return false
  }
}

// ContactSubmission API functions
export const createContactSubmission = async (text: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ContactSubmission')
      .insert({
        text: text.trim()
      })

    if (error) {
      console.error('Error creating contact submission:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error creating contact submission:', error)
    return false
  }
}