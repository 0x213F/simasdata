'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { uploadBlogImage, createArtDetail, updateArtDetail, ArtDetail } from '@/lib/supabase';

interface ArtDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  artSummaryUuid: string;
  artDetail?: ArtDetail | null;
  onSuccess: () => void;
}

export default function ArtDetailModal({
  isOpen,
  onClose,
  mode,
  artSummaryUuid,
  artDetail,
  onSuccess
}: ArtDetailModalProps) {
  const [type, setType] = useState<'hero-welcome' | 'hero-goodbye' | 'taster-img-left' | 'taster-img-right' | 'img-highlight'>('hero-welcome');
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');
  const [image1, setImage1] = useState<File | null>(null);
  const [image1Preview, setImage1Preview] = useState<string | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image2Preview, setImage2Preview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && artDetail) {
      setType(artDetail.type);
      setText1(artDetail.text_1 || '');
      setText2(artDetail.text_2 || '');
      setText3(artDetail.text_3 || '');
      setImage1Preview(artDetail.img_url_1 || null);
      setImage2Preview(artDetail.img_url_2 || null);
      setImage1(null);
      setImage2(null);
    } else {
      resetForm();
    }
  }, [mode, artDetail, isOpen]);

  const resetForm = () => {
    setType('hero-welcome');
    setText1('');
    setText2('');
    setText3('');
    setImage1(null);
    setImage1Preview(null);
    setImage2(null);
    setImage2Preview(null);
    setError(null);
  };

  const handleImage1Select = (file: File | null) => {
    setImage1(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage1Preview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImage1Preview(null);
    }
  };

  const handleImage2Select = (file: File | null) => {
    setImage2(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage2Preview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImage2Preview(null);
    }
  };

  const isValid = () => {
    return text1.trim() && text2.trim();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid()) {
      setError('Text 1 and Text 2 are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Upload images if provided
      let imageUrl1 = null;
      let imageUrl2 = null;

      if (image1) {
        imageUrl1 = await uploadBlogImage(image1);
        if (!imageUrl1) {
          setError('Failed to upload first image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      if (image2) {
        imageUrl2 = await uploadBlogImage(image2);
        if (!imageUrl2) {
          setError('Failed to upload second image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      let success = false;
      if (mode === 'create') {
        success = await createArtDetail(
          artSummaryUuid,
          type,
          text1,
          text2,
          text3 || undefined,
          imageUrl1 || undefined,
          imageUrl2 || undefined
        );
      } else if (mode === 'edit' && artDetail) {
        // Debug logging
        console.log('Edit mode - artDetail:', artDetail);
        console.log('Edit mode - artDetail.uuid:', artDetail.uuid);

        if (!artDetail.uuid) {
          setError('Art detail UUID is missing. Please try again.');
          setIsSubmitting(false);
          return;
        }

        // For edit mode: handle image updates properly
        let finalImageUrl1: string | undefined = undefined;
        let finalImageUrl2: string | undefined = undefined;

        if (image1 && imageUrl1) {
          finalImageUrl1 = imageUrl1;
        } else if (!image1 && image1Preview !== artDetail.img_url_1) {
          finalImageUrl1 = image1Preview || undefined;
        }

        if (image2 && imageUrl2) {
          finalImageUrl2 = imageUrl2;
        } else if (!image2 && image2Preview !== artDetail.img_url_2) {
          finalImageUrl2 = image2Preview || undefined;
        }

        success = await updateArtDetail(
          artDetail.uuid,
          type,
          text1,
          text2,
          text3 || undefined,
          finalImageUrl1,
          finalImageUrl2
        );
      }

      if (success) {
        resetForm();
        onSuccess();
        onClose();
      } else {
        setError(`Failed to ${mode} art detail. Please try again.`);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    { value: 'hero-welcome', label: 'Hero Welcome' },
    { value: 'hero-goodbye', label: 'Hero Goodbye' },
    { value: 'taster-img-left', label: 'Taster Image Left' },
    { value: 'taster-img-right', label: 'Taster Image Right' },
    { value: 'img-highlight', label: 'Image Highlight' },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-slate-800">
            {mode === 'create' ? 'Add New Art Detail' : 'Edit Art Detail'}
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
            {/* Type Field */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-2">
                Art Detail Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                disabled={isSubmitting}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Text 1 Field */}
            <div>
              <label htmlFor="text1" className="block text-sm font-medium text-slate-700 mb-2">
                Text 1 (Required)
              </label>
              <input
                type="text"
                id="text1"
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Enter text 1..."
                maxLength={500}
              />
            </div>

            {/* Text 2 Field */}
            <div>
              <label htmlFor="text2" className="block text-sm font-medium text-slate-700 mb-2">
                Text 2 (Required)
              </label>
              <textarea
                id="text2"
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Enter text 2..."
                maxLength={2000}
              />
              <div className="text-right text-sm text-slate-500 mt-1">
                {text2.length}/2000
              </div>
            </div>

            {/* Text 3 Field */}
            <div>
              <label htmlFor="text3" className="block text-sm font-medium text-slate-700 mb-2">
                Text 3 (Optional)
              </label>
              <textarea
                id="text3"
                value={text3}
                onChange={(e) => setText3(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Enter text 3..."
                maxLength={1000}
              />
              <div className="text-right text-sm text-slate-500 mt-1">
                {text3.length}/1000
              </div>
            </div>

            {/* Image 1 Upload Field */}
            <div>
              <label htmlFor="image1" className="block text-sm font-medium text-slate-700 mb-2">
                Image 1 (Optional)
              </label>
              <input
                type="file"
                id="image1"
                accept="image/*"
                onChange={(e) => handleImage1Select(e.target.files?.[0] || null)}
                disabled={isSubmitting}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50"
              />
              {image1Preview && (
                <div className="mt-3 relative">
                  <img
                    src={image1Preview}
                    alt="Image 1 preview"
                    className="w-full h-32 object-cover rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage1(null);
                      setImage1Preview(null);
                    }}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors disabled:bg-red-300"
                    title="Remove image 1"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Image 2 Upload Field */}
            <div>
              <label htmlFor="image2" className="block text-sm font-medium text-slate-700 mb-2">
                Image 2 (Optional)
              </label>
              <input
                type="file"
                id="image2"
                accept="image/*"
                onChange={(e) => handleImage2Select(e.target.files?.[0] || null)}
                disabled={isSubmitting}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50"
              />
              {image2Preview && (
                <div className="mt-3 relative">
                  <img
                    src={image2Preview}
                    alt="Image 2 preview"
                    className="w-full h-32 object-cover rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage2(null);
                      setImage2Preview(null);
                    }}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors disabled:bg-red-300"
                    title="Remove image 2"
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
                ? (mode === 'create' ? 'Creating...' : 'Updating...')
                : (mode === 'create' ? 'Create Art Detail' : 'Update Art Detail')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}