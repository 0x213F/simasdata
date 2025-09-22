'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useArtistStore } from '@/lib/store';
import { uploadBlogImage } from '@/lib/supabase';

export default function AddArtistModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createArtist } = useArtistStore();

  const resetForm = () => {
    setName('');
    setDescription('');
    setImage(null);
    setImagePreview(null);
    setError(null);
  };

  // Handle image file selection
  const handleImageSelect = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const isValid = () => {
    return name.trim() && description.trim();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid()) {
      setError('Both name and description are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Upload image if provided
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadBlogImage(image);
        if (!imageUrl) {
          setError('Failed to upload image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      const success = await createArtist(name, description, imageUrl || undefined);

      if (success) {
        resetForm();
        onClose();
      } else {
        setError('Failed to create artist. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Add New Artist</h2>
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
                Artist Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Enter artist name..."
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
                placeholder="Enter artist description..."
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
                    alt="Artist preview"
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
              {isSubmitting ? 'Creating...' : 'Create Artist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}