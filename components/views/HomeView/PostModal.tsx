'use client';

import { useState, useEffect } from 'react';
import { X, ArrowLeftRight } from 'lucide-react';
import { useBlogPostStore } from '@/lib/store';
import { uploadBlogImage, BlogPost } from '@/lib/supabase';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'copy';
  editPost?: BlogPost | null;
  copyFromPost?: BlogPost | null;
}

export default function PostModal({ isOpen, onClose, mode, editPost, copyFromPost }: PostModalProps) {
  // Pane content state
  const [pane1Type, setPane1Type] = useState<'text' | 'image'>('text');
  const [pane2Type, setPane2Type] = useState<'text' | 'image'>('text');
  const [pane1Text, setPane1Text] = useState('');
  const [pane2Text, setPane2Text] = useState('');
  const [pane1Image, setPane1Image] = useState<File | null>(null);
  const [pane2Image, setPane2Image] = useState<File | null>(null);
  const [pane1ImagePreview, setPane1ImagePreview] = useState<string | null>(null);
  const [pane2ImagePreview, setPane2ImagePreview] = useState<string | null>(null);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createBlogPost, updateBlogPost } = useBlogPostStore();

  // Reset form function
  const resetForm = () => {
    setPane1Type('text');
    setPane2Type('text');
    setPane1Text('');
    setPane2Text('');
    setPane1Image(null);
    setPane2Image(null);
    setPane1ImagePreview(null);
    setPane2ImagePreview(null);
    setError(null);
  };

  // Initialize form when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'create') {
        // Reset form for create mode
        resetForm();
      } else if (mode === 'copy' && copyFromPost) {
        // Copy data from the source post for copy mode
        // Set pane 1
        if (copyFromPost.pane_1_text) {
          setPane1Type('text');
          setPane1Text(copyFromPost.pane_1_text);
          setPane1Image(null);
          setPane1ImagePreview(null);
        } else if (copyFromPost.pane_1_imgurl) {
          setPane1Type('image');
          setPane1Text('');
          setPane1Image(null);
          setPane1ImagePreview(copyFromPost.pane_1_imgurl);
        } else {
          // Empty pane 1
          setPane1Type('text');
          setPane1Text('');
          setPane1Image(null);
          setPane1ImagePreview(null);
        }

        // Set pane 2
        if (copyFromPost.pane_2_text) {
          setPane2Type('text');
          setPane2Text(copyFromPost.pane_2_text);
          setPane2Image(null);
          setPane2ImagePreview(null);
        } else if (copyFromPost.pane_2_imgurl) {
          setPane2Type('image');
          setPane2Text('');
          setPane2Image(null);
          setPane2ImagePreview(copyFromPost.pane_2_imgurl);
        } else {
          // Empty pane 2
          setPane2Type('text');
          setPane2Text('');
          setPane2Image(null);
          setPane2ImagePreview(null);
        }

        setError(null);
      }
    }
  }, [mode, editPost, copyFromPost, isOpen]);

  // Handle image file selection
  const handleImageSelect = (pane: 1 | 2, file: File | null) => {
    if (pane === 1) {
      setPane1Image(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setPane1ImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPane1ImagePreview(null);
      }
    } else {
      setPane2Image(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setPane2ImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPane2ImagePreview(null);
      }
    }
  };

  // Swap content between panes
  const handleSwapPanes = () => {
    // Swap types
    const tempType = pane1Type;
    setPane1Type(pane2Type);
    setPane2Type(tempType);

    // Swap text content
    const tempText = pane1Text;
    setPane1Text(pane2Text);
    setPane2Text(tempText);

    // Swap image files (new uploads)
    const tempImage = pane1Image;
    setPane1Image(pane2Image);
    setPane2Image(tempImage);

    // Swap image previews (existing URLs or new file previews)
    const tempPreview = pane1ImagePreview;
    setPane1ImagePreview(pane2ImagePreview);
    setPane2ImagePreview(tempPreview);
  };

  // Validate form
  const isValid = () => {
    const pane1Valid = pane1Type === 'text' ? pane1Text.trim() : pane1Image || pane1ImagePreview;
    const pane2Valid = pane2Type === 'text' ? pane2Text.trim() : pane2Image || pane2ImagePreview;
    return pane1Valid && pane2Valid;
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid()) {
      setError('Both pages must have content');
      return;
    }

    if (mode === 'edit' && !editPost) {
      setError('No post selected for editing');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Handle images
      let pane1ImageUrl = null;
      let pane2ImageUrl = null;

      // For pane 1
      if (pane1Type === 'image') {
        if (pane1Image) {
          // New image uploaded
          pane1ImageUrl = await uploadBlogImage(pane1Image);
          if (!pane1ImageUrl) {
            setError('Failed to upload Page 1 image. Please try again.');
            setIsSubmitting(false);
            return;
          }
        } else if (pane1ImagePreview && (mode === 'edit' || mode === 'copy')) {
          // Keep existing image
          pane1ImageUrl = pane1ImagePreview;
        }
      }

      // For pane 2
      if (pane2Type === 'image') {
        if (pane2Image) {
          // New image uploaded
          pane2ImageUrl = await uploadBlogImage(pane2Image);
          if (!pane2ImageUrl) {
            setError('Failed to upload Page 2 image. Please try again.');
            setIsSubmitting(false);
            return;
          }
        } else if (pane2ImagePreview && (mode === 'edit' || mode === 'copy')) {
          // Keep existing image
          pane2ImageUrl = pane2ImagePreview;
        }
      }

      // Create or update blog post
      let success = false;
      if (mode === 'create' || mode === 'copy') {
        success = await createBlogPost(
          pane1Type === 'text' ? pane1Text.trim() : null,
          pane2Type === 'text' ? pane2Text.trim() : null,
          pane1ImageUrl,
          pane2ImageUrl
        );
      } else {
        success = await updateBlogPost(
          editPost!.uuid,
          pane1Type === 'text' ? pane1Text.trim() : null,
          pane2Type === 'text' ? pane2Text.trim() : null,
          pane1ImageUrl,
          pane2ImageUrl
        );
      }

      if (success) {
        resetForm();
        onClose();
      } else {
        setError(`Failed to ${mode === 'copy' ? 'create' : mode} post. Please try again.`);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">
            {mode === 'create' ? 'Add New Post' : mode === 'copy' ? 'Copy Post' : 'Edit Post'}
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
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-8">
            {/* Page 1 */}
            <div>
              <h3 className="text-lg font-medium text-slate-800 mb-4">Page 1</h3>

              {/* Page 1 Type Selection */}
              <div className="flex gap-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pane1Type"
                    value="text"
                    checked={pane1Type === 'text'}
                    onChange={(e) => setPane1Type(e.target.value as 'text' | 'image')}
                    disabled={isSubmitting}
                    className="mr-2"
                  />
                  Text
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pane1Type"
                    value="image"
                    checked={pane1Type === 'image'}
                    onChange={(e) => setPane1Type(e.target.value as 'text' | 'image')}
                    disabled={isSubmitting}
                    className="mr-2"
                  />
                  Image
                </label>
              </div>

              {/* Page 1 Content */}
              {pane1Type === 'text' ? (
                <div>
                  <textarea
                    value={pane1Text}
                    onChange={(e) => setPane1Text(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="Enter text for page 1..."
                    maxLength={200}
                  />
                  <div className="text-right text-sm text-slate-500 mt-1">
                    {pane1Text.length}/200
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(1, e.target.files?.[0] || null)}
                    disabled={isSubmitting}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50"
                  />
                  {pane1ImagePreview && (
                    <div className="mt-3">
                      <img
                        src={pane1ImagePreview}
                        alt="Page 1 preview"
                        className="w-full h-32 object-cover rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSwapPanes}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Swap content between pages"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span className="text-sm font-medium">Swap Pages</span>
              </button>
            </div>

            {/* Page 2 */}
            <div>
              <h3 className="text-lg font-medium text-slate-800 mb-4">Page 2</h3>

              {/* Page 2 Type Selection */}
              <div className="flex gap-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pane2Type"
                    value="text"
                    checked={pane2Type === 'text'}
                    onChange={(e) => setPane2Type(e.target.value as 'text' | 'image')}
                    disabled={isSubmitting}
                    className="mr-2"
                  />
                  Text
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pane2Type"
                    value="image"
                    checked={pane2Type === 'image'}
                    onChange={(e) => setPane2Type(e.target.value as 'text' | 'image')}
                    disabled={isSubmitting}
                    className="mr-2"
                  />
                  Image
                </label>
              </div>

              {/* Page 2 Content */}
              {pane2Type === 'text' ? (
                <div>
                  <textarea
                    value={pane2Text}
                    onChange={(e) => setPane2Text(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="Enter text for page 2..."
                    maxLength={200}
                  />
                  <div className="text-right text-sm text-slate-500 mt-1">
                    {pane2Text.length}/200
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(2, e.target.files?.[0] || null)}
                    disabled={isSubmitting}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50"
                  />
                  {pane2ImagePreview && (
                    <div className="mt-3">
                      <img
                        src={pane2ImagePreview}
                        alt="Page 2 preview"
                        className="w-full h-32 object-cover rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8">
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
              {isSubmitting ? `${mode === 'create' || mode === 'copy' ? 'Creating' : 'Updating'}...` : `${mode === 'create' || mode === 'copy' ? 'Create' : 'Update'} Post`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}