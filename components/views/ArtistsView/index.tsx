'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useArtSummaryStore } from '@/lib/stores/art-summary-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { getArtSummaryName } from '@/lib/supabase';
import ArtSummaryModal from '../../shared/ArtSummaryModal';
import FloatingActionButtons from '@/components/shared/FloatingActionButtons';
import { getGalleryComponent } from '../gallery-themes';

export default function ArtistsView() {
  const router = useRouter()
  const { loading, error, fetchArtSummaries, deleteArtSummary, hasHydrated } = useArtSummaryStore()
  const artSummaries = useArtSummaryStore(state => state.artSummaries)
  const artists = artSummaries.filter(item => item.type === 'artist')
  const { user } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'clone'>('create')

  const selectedArtist = selectedArtistId ? artists.find(a => a.uuid === selectedArtistId) : null

  // Fetch art summaries on component mount
  useEffect(() => {
    fetchArtSummaries()
  }, [fetchArtSummaries])

  const handleArtistClick = (artistId: string) => {
    const artist = artists.find(a => a.uuid === artistId)
    if (!artist) return

    if (user) {
      // User is logged in
      if (selectedArtistId === artistId) {
        // Artist is already selected - navigate to detail view
        router.push(`/artists/${artist.slug}`)
      } else {
        // Artist is not selected - make it selected and return early
        setSelectedArtistId(artistId)
        return
      }
    } else {
      // User is not logged in - navigate immediately to detail view
      router.push(`/artists/${artist.slug}`)
    }
  }

  // Get the configured gallery component (theme is set in gallery-themes/theme-config.ts)
  const GalleryComponent = getGalleryComponent();

  return (
    <>
      <div className="min-h-screen">
        {/* Gallery (theme controlled by gallery-themes/theme-config.ts) */}
        <GalleryComponent
          items={artists}
          type="artist"
          onItemClick={handleArtistClick}
          selectedItemId={selectedArtistId}
          loading={loading}
          hasHydrated={hasHydrated}
        />
      </div>

      {/* Floating Action Buttons */}
      <FloatingActionButtons
        onAdd={() => {
          setModalMode('create')
          setIsModalOpen(true)
        }}
        onCopy={() => {
          if (selectedArtist) {
            setModalMode('clone')
            setIsModalOpen(true)
          }
        }}
        onEdit={() => {
          if (selectedArtist) {
            setModalMode('edit')
            setIsModalOpen(true)
          }
        }}
        onDelete={async () => {
          if (!selectedArtist) {
            alert('Please select an artist to delete');
            return;
          }

          if (window.confirm(`Are you sure you want to delete "${getArtSummaryName(selectedArtist)}"? This action cannot be undone.`)) {
            await deleteArtSummary(selectedArtist.uuid);
            setSelectedArtistId(null); // Clear selection after deletion
          }
        }}
        onAdmin={() => {
          window.open('/admin-portal', '_blank');
        }}
        disabledButtons={{
          copy: !selectedArtist, // Enable copy when an artist is selected
          edit: !selectedArtist, // Enable edit when an artist is selected
          delete: !selectedArtist // Enable delete when an artist is selected
        }}
      />

      {/* Add Artist Modal */}
      <ArtSummaryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedArtistId(null) // Clear selection when modal closes
        }}
        mode={modalMode}
        type="artist"
        item={selectedArtist}
      />
    </>
  );
}