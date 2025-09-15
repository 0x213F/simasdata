'use client'

import { useArtistStore } from '../../lib/store'

export default function ArtistsView() {
  const { artists, loading, error, refetchArtists } = useArtistStore()

  const getGradientColors = (index: number) => {
    const gradients = [
      'from-blue-100 to-blue-200',
      'from-purple-100 to-purple-200',
      'from-green-100 to-green-200',
      'from-orange-100 to-orange-200',
      'from-pink-100 to-pink-200',
      'from-teal-100 to-teal-200',
      'from-indigo-100 to-indigo-200',
      'from-red-100 to-red-200',
    ]
    return gradients[index % gradients.length]
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-8">
          <h1 className="hero-title mb-6">Featured Artists</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the talented artists we represent and their extraordinary works
          </p>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="py-20 px-8">
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
                <div key={`artist-${artist.id}-${index}`} className="card rounded-lg overflow-hidden">
                  {artist.image_url ? (
                    <div className="h-80 bg-cover bg-center bg-no-repeat" 
                         style={{ backgroundImage: `url(${artist.image_url})` }}>
                    </div>
                  ) : (
                    <div className={`h-80 bg-gradient-to-br ${getGradientColors(index)}`}></div>
                  )}
                  <div className="p-8">
                    <h3 className="text-2xl font-medium mb-2">{artist.name}</h3>
                    <p className="text-gray-600 mb-4">{artist.medium}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {artist.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-6">Interested in Representing an Artist?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            We're always looking for exceptional talent to join our gallery family.
          </p>
          <button className="contact-button">
            Submit Your Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}