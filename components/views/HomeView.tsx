'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, X } from 'lucide-react';
import { useBlogPostStore, useAuthStore } from '../../lib/store';
import { uploadBlogImage, BlogPost } from '../../lib/supabase';

// Helper function to format timestamp for vertical display
function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month} ${day} ${year}`;
}


// Book Pages Component
function BookPages({ post }: { post: BlogPost }) {
  // Helper function to render pane content
  const renderPaneContent = (text?: string, imageUrl?: string) => {
    if (imageUrl) {
      return (
        <img 
          src={imageUrl} 
          alt="Blog post content"
          className="w-full h-full object-cover rounded-lg"
        />
      );
    } else if (text) {
      return (
        <div className="text-slate-800 text-base leading-relaxed text-center">
          {text}
        </div>
      );
    } else {
      return (
        <div className="text-slate-400 text-base text-center">
          No content available
        </div>
      );
    }
  };

  return (
    <>
      {/* Mobile: Stacked Layout */}
      <div className="flex flex-col md:hidden gap-4 items-center">
        {/* Page 1 */}
        <div className={`bg-white rounded-lg shadow-lg aspect-square w-64 flex items-center justify-center border border-slate-200 ${post.pane_1_imgurl ? 'p-0 overflow-hidden' : 'p-6'}`}>
          {renderPaneContent(post.pane_1_text, post.pane_1_imgurl)}
        </div>

        {/* Page 2 */}
        <div className={`bg-white rounded-lg shadow-lg aspect-square w-64 flex items-center justify-center border border-slate-200 ${post.pane_2_imgurl ? 'p-0 overflow-hidden' : 'p-6'}`}>
          {renderPaneContent(post.pane_2_text, post.pane_2_imgurl)}
        </div>
      </div>

      {/* Desktop: Side-by-side Layout */}
      <div className="hidden md:flex gap-8 items-center justify-center">
        {/* Left Page */}
        <div className={`bg-white rounded-lg shadow-lg aspect-square w-80 flex items-center justify-center border border-slate-200 ${post.pane_1_imgurl ? 'p-0 overflow-hidden' : 'p-8'}`}>
          {renderPaneContent(post.pane_1_text, post.pane_1_imgurl)}
        </div>
        
        {/* Right Page */}
        <div className={`bg-white rounded-lg shadow-lg aspect-square w-80 flex items-center justify-center border border-slate-200 ${post.pane_2_imgurl ? 'p-0 overflow-hidden' : 'p-8'}`}>
          {renderPaneContent(post.pane_2_text, post.pane_2_imgurl)}
        </div>
      </div>
    </>
  );
}

// Add Post Modal Component
function AddPostModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
  const { createBlogPost } = useBlogPostStore();

  // Reset form when modal closes
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

  // Validate form
  const isValid = () => {
    const pane1Valid = pane1Type === 'text' ? pane1Text.trim() : pane1Image;
    const pane2Valid = pane2Type === 'text' ? pane2Text.trim() : pane2Image;
    return pane1Valid && pane2Valid;
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid()) {
      setError('Both pages must have content');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Upload images if needed
      let pane1ImageUrl = null;
      let pane2ImageUrl = null;

      if (pane1Type === 'image' && pane1Image) {
        pane1ImageUrl = await uploadBlogImage(pane1Image);
        if (!pane1ImageUrl) {
          setError('Failed to upload Page 1 image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      if (pane2Type === 'image' && pane2Image) {
        pane2ImageUrl = await uploadBlogImage(pane2Image);
        if (!pane2ImageUrl) {
          setError('Failed to upload Page 2 image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      // Create blog post with mixed content
      const success = await createBlogPost(
        pane1Type === 'text' ? pane1Text.trim() : null,
        pane2Type === 'text' ? pane2Text.trim() : null,
        pane1ImageUrl,
        pane2ImageUrl
      );
      
      if (success) {
        resetForm();
        onClose();
      } else {
        setError('Failed to create post. Please try again.');
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
          <h2 className="text-xl font-semibold text-slate-800">Add New Post</h2>
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
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Floating Add Button Component
function FloatingAddButton({ isMobileLandscape, onOpenModal }: { 
  isMobileLandscape?: boolean;
  onOpenModal: () => void;
}) {
  const { user } = useAuthStore();

  if (!user || isMobileLandscape) return null;

  return (
    <button
      onClick={onOpenModal}
      className="fixed bottom-24 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl flex items-center justify-center transition-all duration-200 z-50"
      title="Add new post"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}

// Navigation Buttons Component
function NavigationButtons({
  onNavigateNewer,
  onNavigateOlder,
  cooldownActive,
  timestamp
}: {
  onNavigateNewer: () => void;
  onNavigateOlder: () => void;
  cooldownActive: boolean;
  timestamp: string;
}) {
  const formattedDate = formatTimestamp(timestamp);

  return (
    <>
      {/* Mobile Navigation - Stacked Layout */}
      <div className="flex flex-col md:hidden gap-4 items-center">
        {/* Timestamp */}
        <div className="text-slate-500 text-sm font-mono tracking-wider">
          {formattedDate}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onNavigateNewer}
            disabled={cooldownActive}
            className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center cursor-pointer group"
            title="Newer post (page left)"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:rotate-9 transition-transform duration-200" />
          </button>

          <button
            onClick={onNavigateOlder}
            disabled={cooldownActive}
            className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center cursor-pointer group"
            title="Older post (page right)"
          >
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:-rotate-9 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Desktop Navigation - Left/Right Panel Layout */}
      <div className="hidden md:flex gap-8 items-center justify-center mt-6">
        {/* Left Panel - Same width as blog post (w-80) */}
        <div className="w-80 flex items-center justify-start">
          <div className="text-slate-500 text-sm font-mono tracking-wider">
            {formattedDate}
          </div>
        </div>

        {/* Right Panel - Same width as blog post (w-80) */}
        <div className="w-80 flex items-center justify-end">
          <div className="flex gap-4">
            <button
              onClick={onNavigateNewer}
              disabled={cooldownActive}
              className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center cursor-pointer group"
              title="Newer post (page left)"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:rotate-9 transition-transform duration-200" />
            </button>

            <button
              onClick={onNavigateOlder}
              disabled={cooldownActive}
              className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center cursor-pointer group"
              title="Older post (page right)"
            >
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:-rotate-9 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function HomeView({ isMobileLandscape }: { isMobileLandscape?: boolean }) {
  const { selectedPost, loading, error, navigateToNewerPost, navigateToOlderPost } = useBlogPostStore();
  const [cooldownActive, setCooldownActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cooldown handler
  const handleNavigationWithCooldown = (navigationFn: () => void) => {
    if (cooldownActive) return;
    
    navigationFn();
    setCooldownActive(true);
    setTimeout(() => setCooldownActive(false), 200);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handleNavigationWithCooldown(navigateToNewerPost);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNavigationWithCooldown(navigateToOlderPost);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigateToNewerPost, navigateToOlderPost, cooldownActive]);

  if (loading && !selectedPost) {
    return (
      <div className="w-full h-full flex items-center justify-center ">
        <div className="text-slate-600 text-lg">Loading recent posts...</div>
      </div>
    );
  }

  if (error && !selectedPost) {
    return (
      <div className="w-full h-full flex items-center justify-center ">
        <div className="text-red-600 text-lg">Error loading posts: {error}</div>
      </div>
    );
  }

  if (!selectedPost) {
    return (
      <div className="w-full h-full flex items-center justify-center ">
        <div className="text-slate-600 text-lg">No posts available</div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full flex items-center justify-center p-8">
        {/* Book Pages Layout */}
        <div className="max-w-4xl w-full">
          <div className="flex flex-col md:block gap-8">
            <BookPages post={selectedPost} />
            <NavigationButtons
              onNavigateNewer={() => handleNavigationWithCooldown(navigateToNewerPost)}
              onNavigateOlder={() => handleNavigationWithCooldown(navigateToOlderPost)}
              cooldownActive={cooldownActive}
              timestamp={selectedPost.created_at}
            />
          </div>
        </div>
      </div>
      
      {/* Floating Add Button */}
      <FloatingAddButton 
        isMobileLandscape={isMobileLandscape} 
        onOpenModal={() => setIsModalOpen(true)}
      />

      {/* Add Post Modal */}
      <AddPostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}