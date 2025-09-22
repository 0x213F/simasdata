'use client';

import { useState } from 'react';
import { useArtistStore } from '@/lib/store';
import AddArtistModal from './AddArtistModal';
import FloatingActionButtons from '../HomeView/FloatingActionButtons';
import ArtistCard from './ArtistCard';

export default function ArtistsView() {
  const { artists, loading, error, refetchArtists, deleteArtist } = useArtistStore()
  const [isModalOpen, setIsModalOpen] = useState(false)


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
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-600 mb-4">
                  Error loading artists: {error}
                </div>
                <button
                  onClick={refetchArtists}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : artists.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No active artists found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {artists.map((artist, index) => (
                  <ArtistCard key={`artist-${artist.uuid}-${index}`} artist={artist} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <FloatingActionButtons
        onAdd={() => setIsModalOpen(true)}
        onCopy={() => {}} // Disabled - no action
        onEdit={() => {}} // Disabled - no action
        onDelete={async () => {
          if (artists.length === 0) {
            alert('No artists to delete');
            return;
          }

          // Create a simple selection dialog
          const artistNames = artists.map((a, i) => `${i + 1}. ${a.name}`).join('\n');
          const selection = prompt(`Select an artist to delete:\n\n${artistNames}\n\nEnter the number (1-${artists.length}):`);

          if (selection) {
            const index = parseInt(selection) - 1;
            if (index >= 0 && index < artists.length) {
              const artist = artists[index];
              if (window.confirm(`Are you sure you want to delete "${artist.name}"? This action cannot be undone.`)) {
                await deleteArtist(artist.uuid);
              }
            } else {
              alert('Invalid selection');
            }
          }
        }}
        onAdmin={() => {
          window.open('/admin-portal', '_blank');
        }}
        disabledButtons={{
          copy: true,
          edit: true,
          delete: false
        }}
      />

      {/* Add Artist Modal */}
      <AddArtistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}