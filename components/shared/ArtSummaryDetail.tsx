'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { ArtSummaryWithDetails, ArtDetail, getArtSummaryName, getArtSummaryDescription, deleteArtDetail } from '@/lib/supabase';
import { Lens } from '@/components/ui/lens';
import { useAuthStore } from '@/lib/stores/auth-store';
import ArtDetailModal from '@/components/shared/ArtDetailModal';

interface ArtSummaryDetailProps {
  artSummary: ArtSummaryWithDetails;
  type: 'artist' | 'project';
  onClose?: () => void;
}

export default function ArtSummaryDetail({ artSummary, type, onClose }: ArtSummaryDetailProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedArtDetail, setSelectedArtDetail] = useState<ArtDetail | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { user } = useAuthStore();

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`art-detail-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setCurrentIndex(index);
    }
  };

  const handleEditArtDetail = (artDetail: ArtDetail) => {
    console.log('handleEditArtDetail called with:', artDetail);
    console.log('artDetail.uuid:', artDetail.uuid);
    setSelectedArtDetail(artDetail);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteArtDetail = async (artDetail: ArtDetail) => {
    if (!confirm('Are you sure you want to delete this art detail?')) {
      return;
    }

    const success = await deleteArtDetail(artDetail.uuid);
    if (success) {
      setRefreshKey(prev => prev + 1);
      window.location.reload(); // Force refresh to update the data
    } else {
      alert('Failed to delete art detail. Please try again.');
    }
  };

  const handleCreateArtDetail = () => {
    setSelectedArtDetail(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setRefreshKey(prev => prev + 1);
    window.location.reload(); // Force refresh to update the data
  };

  const renderEditDeleteButtons = (artDetail: ArtDetail) => {
    if (!user) return null;

    return (
      <div className="absolute bottom-8 left-8 flex gap-2 z-20">
        <button
          onClick={() => handleEditArtDetail(artDetail)}
          className="p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition-colors"
          title="Edit art detail"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleDeleteArtDetail(artDetail)}
          className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
          title="Delete art detail"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const renderArtDetail = (artDetail: ArtDetail, index: number) => {
    switch (artDetail.type) {
      case 'hero-welcome':
        return (
          <section
            key={artDetail.uuid}
            id={`art-detail-${index}`}
            className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-slate-900 to-slate-800"
          >
            {renderEditDeleteButtons(artDetail)}
            <div className="text-center px-8 max-w-4xl mx-auto">
              <div className="mb-6">
                {artDetail.text_1 && (
                  <div className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4 font-light">
                    {artDetail.text_1}
                  </div>
                )}
                {artDetail.text_2 && (
                  <h1 className="text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-8 leading-tight">
                    {artDetail.text_2}
                  </h1>
                )}
              </div>
              {artDetail.text_3 && (
                <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-12 font-light tracking-wide max-w-3xl mx-auto">
                  {artDetail.text_3}
                </p>
              )}
              {index < artSummary.artDetails.length - 1 && (
                <button
                  onClick={() => scrollToSection(index + 1)}
                  className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-colors font-light tracking-wide"
                >
                  Continue
                </button>
              )}
            </div>
          </section>
        );

      case 'hero-goodbye':
        return (
          <section
            key={artDetail.uuid}
            id={`art-detail-${index}`}
            className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-slate-800 to-slate-900"
          >
            {renderEditDeleteButtons(artDetail)}
            <div className="text-center px-8 max-w-4xl mx-auto">
              <div className="mb-6">
                {artDetail.text_1 && (
                  <div className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4 font-light">
                    {artDetail.text_1}
                  </div>
                )}
                {artDetail.text_2 && (
                  <h1 className="text-4xl lg:text-5xl font-light text-white mb-6 leading-tight">
                    {artDetail.text_2}
                  </h1>
                )}
              </div>
              {artDetail.text_3 && (
                <p className="text-xl text-slate-300 leading-relaxed mb-12 font-light tracking-wide max-w-3xl mx-auto">
                  {artDetail.text_3}
                </p>
              )}
              {onClose ? (
                <button
                  onClick={onClose}
                  className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-colors font-light tracking-wide"
                >
                  Return to Gallery
                </button>
              ) : (
                <Link
                  href={`/${type}s`}
                  className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-colors font-light tracking-wide"
                >
                  Return to Gallery
                </Link>
              )}
            </div>
          </section>
        );

      case 'taster-img-left':
        return (
          <section
            key={artDetail.uuid}
            id={`art-detail-${index}`}
            className="min-h-screen flex items-center relative"
          >
            {renderEditDeleteButtons(artDetail)}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-screen">
              {/* Image Side */}
              <div className="relative overflow-hidden bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent z-10"></div>
                {artDetail.img_url_1 ? (
                  <img
                    src={artDetail.img_url_1}
                    alt={artDetail.text_1 || 'Art detail'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <div className="text-slate-400 text-lg">No image available</div>
                  </div>
                )}
              </div>

              {/* Content Side */}
              <div className="flex items-center justify-center p-12 lg:p-16 xl:p-20 bg-slate-900">
                <div className="max-w-lg">
                  <div className="mb-8">
                    {artDetail.text_1 && (
                      <div className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4 font-light">
                        {artDetail.text_1}
                      </div>
                    )}
                    {artDetail.text_2 && (
                      <h2 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 leading-tight">
                        {artDetail.text_2}
                      </h2>
                    )}
                  </div>

                  {artDetail.text_3 && (
                    <div className="space-y-6">
                      <p className="text-slate-300 leading-relaxed text-lg font-light">
                        {artDetail.text_3}
                      </p>
                    </div>
                  )}

                  {/* Navigation dots */}
                  <div className="flex space-x-3 mt-12">
                    {artSummary.artDetails.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => scrollToSection(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i === index
                            ? 'bg-white w-8'
                            : 'bg-slate-500 hover:bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'taster-img-right':
        return (
          <section
            key={artDetail.uuid}
            id={`art-detail-${index}`}
            className="min-h-screen flex items-center relative"
          >
            {renderEditDeleteButtons(artDetail)}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-screen">
              {/* Content Side */}
              <div className="flex items-center justify-center p-12 lg:p-16 xl:p-20 bg-slate-900">
                <div className="max-w-lg">
                  <div className="mb-8">
                    {artDetail.text_1 && (
                      <div className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4 font-light">
                        {artDetail.text_1}
                      </div>
                    )}
                    {artDetail.text_2 && (
                      <h2 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 leading-tight">
                        {artDetail.text_2}
                      </h2>
                    )}
                  </div>

                  {artDetail.text_3 && (
                    <div className="space-y-6">
                      <p className="text-slate-300 leading-relaxed text-lg font-light">
                        {artDetail.text_3}
                      </p>
                    </div>
                  )}

                  {/* Navigation dots */}
                  <div className="flex space-x-3 mt-12">
                    {artSummary.artDetails.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => scrollToSection(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i === index
                            ? 'bg-white w-8'
                            : 'bg-slate-500 hover:bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Image Side */}
              <div className="relative overflow-hidden bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent z-10"></div>
                {artDetail.img_url_1 ? (
                  <img
                    src={artDetail.img_url_1}
                    alt={artDetail.text_1 || 'Art detail'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <div className="text-slate-400 text-lg">No image available</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'img-highlight':
        return (
          <section
            key={artDetail.uuid}
            id={`art-detail-${index}`}
            className="min-h-screen flex flex-col items-center justify-center relative bg-black p-8"
          >
            {renderEditDeleteButtons(artDetail)}
            {/* Main Image - Centered */}
            <div className="flex-1 flex items-center justify-center max-w-5xl mx-auto">
              {artDetail.img_url_1 ? (
                <Lens hovering={hovering} setHovering={setHovering} zoomFactor={2.5} lensSize={200}>
                  <img
                    src={artDetail.img_url_1}
                    alt={artDetail.text_2 || 'Artwork'}
                    className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                  />
                </Lens>
              ) : (
                <div className="w-96 h-96 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="text-slate-500 text-lg">No image available</div>
                </div>
              )}
            </div>

            {/* Gallery Details - Bottom, dimly lit */}
            <motion.div
              className="w-full max-w-4xl mx-auto mt-12 mb-8"
              animate={{
                filter: hovering ? "blur(1px)" : "blur(0px)",
                opacity: hovering ? 0.6 : 0.8,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 text-center md:text-left">
                {/* Dimensions - text_1 */}
                {artDetail.text_1 && (
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-light text-slate-300 mb-1">
                      {artDetail.text_1}
                    </h2>
                  </div>
                )}

                {/* Title - text_2 */}
                {artDetail.text_2 && (
                  <div className="flex-shrink-0">
                    <p className="text-sm text-slate-500 font-light">
                      {artDetail.text_2}
                    </p>
                  </div>
                )}

                {/* Price - text_3 */}
                {artDetail.text_3 && (
                  <div className="flex-shrink-0">
                    <p className="text-sm text-slate-500 font-light">
                      {artDetail.text_3}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation dots - Centered below */}
              <div className="flex justify-center space-x-2 mt-8">
                {artSummary.artDetails.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToSection(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === index
                        ? 'bg-slate-400 w-6'
                        : 'bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </section>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      // Hide header when scrolled past 100vh, show when back above 100vh
      if (scrollY > viewportHeight) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);

  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  const pluralType = `${type}s`;

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto">
      {/* Fixed Header */}
      <div className={`fixed top-0 left-0 w-full z-[60] bg-slate-900/95 backdrop-blur-md border-b border-slate-700/20 transition-transform duration-300 ease-in-out ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {onClose ? (
              <button
                onClick={onClose}
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm uppercase tracking-[0.2em] font-light">Back to {capitalizedType}s</span>
              </button>
            ) : (
              <Link
                href={`/${pluralType}`}
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm uppercase tracking-[0.2em] font-light">Back to {capitalizedType}s</span>
              </Link>
            )}

            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Default Hero Section - shown when no art details */}
      {artSummary.artDetails.length === 0 && (
        <section className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-slate-900 to-slate-800 pt-20">
          <div className="text-center px-8 max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4 font-light">
                {getArtSummaryName(artSummary)}
              </div>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-8 leading-tight">
                {getArtSummaryName(artSummary)}
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-12 font-light tracking-wide max-w-3xl mx-auto">
              {getArtSummaryDescription(artSummary) || `A thoughtfully curated ${type} exploring the intersection of tradition and innovation`}
            </p>
          </div>
        </section>
      )}

      {/* ArtDetail Gallery */}
      {artSummary.artDetails.map((artDetail, index) => (
        <div key={artDetail.uuid}>
          {renderArtDetail(artDetail, index)}
        </div>
      ))}

      {/* Floating Add Button */}
      {user && (
        <button
          onClick={handleCreateArtDetail}
          className="fixed bottom-6 right-6 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors z-50"
          title="Add new art detail"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* ArtDetail Modal */}
      <ArtDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        artSummaryUuid={artSummary.uuid}
        artDetail={selectedArtDetail}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}