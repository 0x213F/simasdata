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
  id: number
  pane_1_text?: string
  pane_2_text?: string
  pane_1_imgurl?: string
  pane_2_imgurl?: string
  created_at: string
  updated_at: string
}