'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ArtSummary, getArtSummaryName, getArtSummaryDescription } from '@/lib/supabase';

interface ProjectDetailProps {
  project: ArtSummary;
  onClose?: () => void;
}

// Demo art pieces data for the gallery experience
const demoArtPieces = [
  {
    id: 1,
    title: "Ethereal Reflections",
    artist: "Marina Volkov",
    year: "2024",
    medium: "Oil on Canvas",
    dimensions: "180 × 120 cm",
    description: "A contemplative exploration of light and shadow, capturing the ephemeral beauty of dawn breaking through morning mist.",
    image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=1200&h=1600&fit=crop&crop=center"
  },
  {
    id: 2,
    title: "Urban Symphony",
    artist: "James Chen",
    year: "2024",
    medium: "Mixed Media",
    dimensions: "200 × 150 cm",
    description: "A dynamic composition that captures the rhythm and energy of contemporary city life through bold geometric forms.",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=1600&fit=crop&crop=center"
  },
  {
    id: 3,
    title: "Temporal Fragments",
    artist: "Sophie Laurent",
    year: "2024",
    medium: "Digital Art, Archival Print",
    dimensions: "160 × 240 cm",
    description: "An investigation into memory and time, weaving together past and present through layered visual narratives.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=1600&fit=crop&crop=center"
  }
];

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`art-piece-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setCurrentIndex(index);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto">
      {/* Elegant Header */}
      <div className="fixed top-0 left-0 w-full z-10 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/20">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {onClose ? (
              <button
                onClick={onClose}
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm uppercase tracking-[0.2em] font-light">Back to Projects</span>
              </button>
            ) : (
              <Link
                href="/projects"
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm uppercase tracking-[0.2em] font-light">Back to Projects</span>
              </Link>
            )}

            <div className="text-center">
              <h1 className="text-xl text-white font-light tracking-wide">
                {getArtSummaryName(project)}
              </h1>
              <div className="text-xs text-slate-400 uppercase tracking-[0.3em] mt-1">
                Exhibition
              </div>
            </div>

            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-slate-900 to-slate-800 pt-20">
        <div className="text-center px-8 max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4 font-light">
              {getArtSummaryName(project)}
            </div>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-8 leading-tight">
              Curated Collection
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-12 font-light tracking-wide max-w-3xl mx-auto">
            {getArtSummaryDescription(project) || "A thoughtfully curated selection of contemporary works exploring the intersection of tradition and innovation"}
          </p>
          <button
            onClick={() => scrollToSection(0)}
            className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-colors font-light tracking-wide"
          >
            Begin Journey
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Art Pieces Gallery */}
      {demoArtPieces.map((piece, index) => (
        <section
          key={piece.id}
          id={`art-piece-${index}`}
          className="min-h-screen flex items-center relative"
        >
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-screen">

            {/* Image Side */}
            <div className="relative overflow-hidden bg-slate-800">
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent z-10"></div>
              <img
                src={piece.image}
                alt={piece.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Content Side */}
            <div className="flex items-center justify-center p-12 lg:p-16 xl:p-20 bg-slate-900">
              <div className="max-w-lg">
                <div className="mb-8">
                  <div className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4 font-light">
                    {piece.medium} · {piece.year}
                  </div>
                  <h2 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 leading-tight">
                    {piece.title}
                  </h2>
                  <div className="text-lg text-slate-300 mb-8 font-light tracking-wide">
                    {piece.artist}
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-slate-300 leading-relaxed text-lg font-light">
                    {piece.description}
                  </p>

                  <div className="pt-4 border-t border-slate-700/30">
                    <div className="text-sm text-slate-400 uppercase tracking-[0.2em] font-light">
                      {piece.dimensions}
                    </div>
                  </div>
                </div>

                {/* Navigation dots */}
                <div className="flex space-x-3 mt-12">
                  {demoArtPieces.map((_, i) => (
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
      ))}

      {/* Footer Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="text-center px-8 max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-light text-white mb-6 leading-tight">
            Thank you for exploring
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed mb-12 font-light tracking-wide">
            This concludes your journey through {getArtSummaryName(project)}
          </p>
          {onClose ? (
            <button
              onClick={onClose}
              className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-colors font-light tracking-wide"
            >
              Return to Gallery
            </button>
          ) : (
            <Link
              href="/projects"
              className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-colors font-light tracking-wide"
            >
              Return to Gallery
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}