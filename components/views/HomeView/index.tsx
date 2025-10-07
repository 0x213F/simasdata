'use client';

import { useEffect, useState } from 'react';
import { useBlogPostStore } from '@/lib/stores/blog-post-store';
import BookPages from './BookPages';
import PostModal from './PostModal';
import FloatingActionButtons from '@/components/shared/FloatingActionButtons';
import NavigationButtons from './NavigationButtons';

export default function HomeView({ isMobileLandscape }: { isMobileLandscape?: boolean }) {
  const { selectedPost, loading, error, hasHydrated, navigateToNewerPost, navigateToOlderPost, deleteBlogPost } = useBlogPostStore();
  const [cooldownActive, setCooldownActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'copy'>('create');

  // Cooldown handler
  const handleNavigationWithCooldown = (navigationFn: () => void) => {
    if (cooldownActive) return;
    
    navigationFn();
    setCooldownActive(true);
    setTimeout(() => setCooldownActive(false), 200);
  };


  // Show loading state while hydrating or fetching
  if (!hasHydrated || (loading && !selectedPost)) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface transition-theme">
        <div className="text-text-secondary dark:text-text-secondary text-lg">Loading recent posts...</div>
      </div>
    );
  }

  if (error && !selectedPost) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface transition-theme">
        <div className="text-red-600 dark:text-red-400 text-lg">Error loading posts: {error}</div>
      </div>
    );
  }

  if (!selectedPost) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface transition-theme">
        <div className="text-text-secondary dark:text-text-secondary text-lg">No posts available</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-surface transition-theme">
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

      {/* Floating Action Buttons */}
      <FloatingActionButtons
        isMobileLandscape={isMobileLandscape}
        onAdd={() => {
          setModalMode('create');
          setIsModalOpen(true);
        }}
        onCopy={() => {
          if (selectedPost) {
            setModalMode('copy');
            setIsModalOpen(true);
          }
        }}
        onEdit={() => {
          if (selectedPost) {
            setModalMode('edit');
            setIsModalOpen(true);
          }
        }}
        onDelete={async () => {
          if (selectedPost && window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            await deleteBlogPost(selectedPost.uuid);
          }
        }}
        onAdmin={() => {
          window.open('/admin-portal', '_blank');
        }}
      />

      {/* Post Modal */}
      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        editPost={modalMode === 'edit' ? selectedPost : null}
        copyFromPost={modalMode === 'copy' ? selectedPost : null}
      />
    </div>
  );
}