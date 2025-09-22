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
  id: number
  name: string
  description: string
  imgurl?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Type definitions for our Project table
export interface Project {
  id: number
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

// Blog post API functions
export const updateBlogPost = async (
  uuid: string,
  pane1Text: string | null,
  pane2Text: string | null,
  pane1ImageUrl: string | null,
  pane2ImageUrl: string | null
): Promise<boolean> => {
  try {
    console.log('Attempting to update blog post with UUID:', uuid)

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