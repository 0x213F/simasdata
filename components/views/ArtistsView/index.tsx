'use client';

import { useState, useEffect } from 'react';
import { useArtSummaryStore } from '@/lib/stores/art-summary-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { getArtSummaryName } from '@/lib/supabase';
import ArtSummaryModal from '../../shared/ArtSummaryModal';
import FloatingActionButtons from '../HomeView/FloatingActionButtons';
import ArtistCard from './ArtistCard';
import ArtistDetail from './ArtistDetail';
import DetailViewTransition from '../../DetailViewTransition';

export default function ArtistsView() {
  const { loading, error, fetchArtSummaries, refetchArtSummaries, deleteArtist, hasHydrated } = useArtSummaryStore()
  const artSummaries = useArtSummaryStore(state => state.artSummaries)
  const artists = artSummaries.filter(item => item.type === 'artist')
  const { user } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'clone'>('create')
  const [showDetailView, setShowDetailView] = useState(false)

  const selectedArtist = selectedArtistId ? artists.find(a => a.uuid === selectedArtistId) : null

  // Fetch art summaries on component mount
  useEffect(() => {
    fetchArtSummaries()
  }, [fetchArtSummaries])

  const handleArtistClick = (artistId: string) => {
    if (user) {
      // User is logged in
      if (selectedArtistId === artistId) {
        // Artist is already selected - take them to detail view
        setShowDetailView(true)
      } else {
        // Artist is not selected - make it selected and return early
        setSelectedArtistId(artistId)
        return
      }
    } else {
      // User is not logged in - take them immediately to detail view
      setSelectedArtistId(artistId)
      setShowDetailView(true)
    }
  }

  const handleCloseDetailView = () => {
    setShowDetailView(false)
    // Keep the selected artist for logged-in users, clear for non-logged-in users
    if (!user) {
      setSelectedArtistId(null)
    }
  }

  // Wrap the entire component with transition
  return (
    <>
      <DetailViewTransition isActive={showDetailView}>
        {showDetailView && selectedArtist && (
          <ArtistDetail artist={selectedArtist} onClose={handleCloseDetailView} />
        )}
      </DetailViewTransition>

      {/* Main artists view - hidden when detail view is active */}
      {!showDetailView && (
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
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-600 mb-4">
                  Error loading artists: {error}
                </div>
                <button
                  onClick={refetchArtSummaries}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
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
            await deleteArtist(selectedArtist.uuid);
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

        </>
      )}

      {/* Add Artist Modal */}
      <ArtSummaryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedArtistId(null) // Clear selection when modal closes
          setShowDetailView(false) // Also close detail view
        }}
        mode={modalMode}
        type="artist"
        item={selectedArtist}
      />
    </>
  );
}