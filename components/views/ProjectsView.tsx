'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useProjectStore, useAuthStore } from '../../lib/store'
import { uploadBlogImage } from '../../lib/supabase'

// Add Project Modal Component
function AddProjectModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { createProject } = useProjectStore()

  const resetForm = () => {
    setName('')
    setDescription('')
    setImage(null)
    setImagePreview(null)
    setError(null)
  }

  // Handle image file selection
  const handleImageSelect = (file: File | null) => {
    setImage(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const isValid = () => {
    return name.trim() && description.trim()
  }

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid()) {
      setError('Both name and description are required')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Upload image if provided
      let imageUrl = null
      if (image) {
        imageUrl = await uploadBlogImage(image)
        if (!imageUrl) {
          setError('Failed to upload image. Please try again.')
          setIsSubmitting(false)
          return
        }
      }

      const success = await createProject(name, description, imageUrl || undefined)

      if (success) {
        resetForm()
        onClose()
      } else {
        setError('Failed to create project. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Add New Project</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Enter project name..."
                maxLength={100}
              />
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Enter project description..."
                maxLength={500}
              />
              <div className="text-right text-sm text-slate-500 mt-1">
                {description.length}/500
              </div>
            </div>

            {/* Image Upload Field */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-slate-700 mb-2">
                Image (Optional)
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => handleImageSelect(e.target.files?.[0] || null)}
                disabled={isSubmitting}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50"
              />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Project preview"
                    className="w-full h-32 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => { resetForm(); onClose(); }}
              disabled={isSubmitting}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors disabled:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValid()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Floating Add Button Component
function FloatingAddButton({ onOpenModal }: { onOpenModal: () => void }) {
  const { user } = useAuthStore()

  if (!user) return null

  return (
    <button
      onClick={onOpenModal}
      className="fixed bottom-24 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl flex items-center justify-center transition-all duration-200 z-50"
      title="Add new project"
    >
      <Plus className="w-6 h-6" />
    </button>
  )
}

export default function ProjectsView() {
  const { projects, loading, error, refetchProjects } = useProjectStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getGradientColors = (index: number) => {
    const gradients = [
      'from-blue-100 to-blue-200',
      'from-purple-100 to-purple-200',
      'from-green-100 to-green-200',
      'from-orange-100 to-orange-200',
      'from-pink-100 to-pink-200',
      'from-teal-100 to-teal-200',
      'from-indigo-100 to-indigo-200',
      'from-red-100 to-red-200',
    ]
    return gradients[index % gradients.length]
  }

  return (
    <>
      <div className="min-h-screen">
        {/* Projects Grid */}
        <div className="pt-8 px-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-600 mb-4">
                  Error loading projects: {error}
                </div>
                <button
                  onClick={refetchProjects}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No active projects found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {projects.map((project, index) => (
                  <div key={`project-${project.id}-${index}`} className="card rounded-lg overflow-hidden">
                    {project.imgurl ? (
                      <div className="h-80 bg-cover bg-center bg-no-repeat"
                           style={{ backgroundImage: `url(${project.imgurl})` }}>
                      </div>
                    ) : (
                      <div className={`h-80 bg-gradient-to-br ${getGradientColors(index)}`}></div>
                    )}
                    <div className="p-8">
                      <h3 className="text-2xl font-medium mb-4">{project.name}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <FloatingAddButton onOpenModal={() => setIsModalOpen(true)} />

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}