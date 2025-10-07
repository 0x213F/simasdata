'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useArtSummaryStore } from '@/lib/stores/art-summary-store';
import { uploadBlogImage, ArtSummary, getArtSummaryName, getArtSummaryDescription, getArtSummaryImageUrl, generateSlug } from '@/lib/supabase';

interface ArtSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'clone';
  type: 'artist' | 'project';
  item?: ArtSummary | null;
}

export default function ArtSummaryModal({ isOpen, onClose, mode, type, item }: ArtSummaryModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createArtSummary, updateArtSummary } = useArtSummaryStore();

  // Populate form when editing or cloning
  useEffect(() => {
    if ((mode === 'edit' || mode === 'clone') && item) {
      setName(getArtSummaryName(item));
      setDescription(getArtSummaryDescription(item));
      setSlug(item.slug || '');
      setImagePreview(getArtSummaryImageUrl(item) || null);
      setImage(null); // Clear any selected file when editing/cloning
    } else {
      // Reset form for create mode
      resetForm();
    }
  }, [mode, item, isOpen]);

  // Auto-generate slug from name
  useEffect(() => {
    if (mode === 'create' || mode === 'clone') {
      setSlug(generateSlug(name));
    }
  }, [name, mode]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setSlug('');
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
    return name.trim() && description.trim() && slug.trim();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid()) {
      setError('Name, description, and slug are all required');
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

      let success = false;
      if (mode === 'create' || mode === 'clone') {
        success = await createArtSummary(name, description, type, imageUrl || undefined, slug);
      } else if (mode === 'edit' && item) {
        // For edit mode:
        // - If new image uploaded, use the new imageUrl
        // - If no new image and existing preview matches item image, pass undefined to keep existing
        // - If preview was cleared (is null), pass null to clear in DB
        let finalImageUrl: string | null | undefined = undefined;
        if (image && imageUrl) {
          // New image uploaded
          finalImageUrl = imageUrl;
        } else if (!image && imagePreview !== getArtSummaryImageUrl(item)) {
          // Image was cleared (null) or changed without file upload
          finalImageUrl = imagePreview;
        }
        // If image unchanged, finalImageUrl stays undefined to preserve existing image

        success = await updateArtSummary(item.uuid, name, description, type, finalImageUrl, slug);
      }

      if (success) {
        resetForm();
        onClose();
      } else {
        setError(`Failed to ${mode} ${type}. Please try again.`);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">
            {mode === 'create' ? `Add New ${capitalizedType}` :
             mode === 'clone' ? `Clone ${capitalizedType}` :
             `Edit ${capitalizedType}`}
          </h2>
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
                {capitalizedType} Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder={`Enter ${type} name...`}
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
                placeholder={`Enter ${type} description...`}
                maxLength={500}
              />
              <div className="text-right text-sm text-slate-500 mt-1">
                {description.length}/500
              </div>
            </div>

            {/* Slug Field */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))}
                disabled={isSubmitting}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="url-friendly-slug"
                maxLength={100}
              />
              <div className="text-sm text-slate-500 mt-1">
                This will be used in the URL: /{type}s/{slug}
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
                <div className="mt-3 relative">
                  <img
                    src={imagePreview}
                    alt={`${capitalizedType} preview`}
                    className="w-full h-32 object-cover rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors disabled:bg-red-300"
                    title="Remove image"
                  >
                    ×
                  </button>
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
              {isSubmitting
                ? (mode === 'create' || mode === 'clone' ? 'Creating...' : 'Updating...')
                : (mode === 'create' || mode === 'clone' ? `Create ${capitalizedType}` : `Update ${capitalizedType}`)
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}