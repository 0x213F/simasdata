'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useArtSummaryStore } from '@/lib/stores/art-summary-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { getArtSummaryName } from '@/lib/supabase';
import ArtSummaryModal from '../../shared/ArtSummaryModal';
import FloatingActionButtons from '@/components/shared/FloatingActionButtons';
import ArtistCard from './ArtistCard';

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

  return (
    <>
      <div className="min-h-screen">

        {/* Artists Grid */}
        <div className="px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : !hasHydrated && artists.length === 0 ? (
              // Only show empty state during hydration if we have no data
              <div></div>
            ) : artists.length === 0 ? (
              // Show nothing when there are no artists - completely empty
              <div></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {artists.map((artist, index) => (
                  <ArtistCard
                    key={`artist-${artist.uuid}-${index}`}
                    artist={artist}
                    index={index}
                    onClick={handleArtistClick}
                    isSelected={selectedArtistId === artist.uuid}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
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