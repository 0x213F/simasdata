'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ArtSummary, getArtSummaryName, getArtSummaryDescription, getArtSummaryImageUrl } from '@/lib/supabase';

interface ArtistDetailProps {
  artist: ArtSummary;
  onClose?: () => void;
}

export default function ArtistDetail({ artist, onClose }: ArtistDetailProps) {
  return (
    <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900 border-b border-slate-700 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {onClose ? (
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Artists</span>
              </button>
            ) : (
              <Link
                href="/artists"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Artists</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          {getArtSummaryImageUrl(artist) ? (
            <div
              className="w-full h-96 bg-cover bg-center bg-no-repeat rounded-2xl mb-6"
              style={{ backgroundImage: `url(${getArtSummaryImageUrl(artist)})` }}
            />
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6 flex items-center justify-center">
              <div className="text-white text-6xl font-light opacity-50">
                {getArtSummaryName(artist).charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">
              {getArtSummaryName(artist)}
            </h1>

            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>Added {new Date(artist.created_at).toLocaleDateString()}</span>
              {artist.updated_at !== artist.created_at && (
                <span>• Updated {new Date(artist.updated_at).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>

        {/* Biography Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">About {getArtSummaryName(artist)}</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">
              {getArtSummaryDescription(artist)}
            </p>
          </div>
        </div>

        {/* Artist Details Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Artist Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Artist ID</span>
                <span className="text-slate-200 font-mono text-sm">{artist.uuid.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                  Active
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Added</span>
                <span className="text-slate-200">{new Date(artist.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              {artist.updated_at !== artist.created_at && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Updated</span>
                  <span className="text-slate-200">{new Date(artist.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 hover:bg-slate-600 transition-colors">
                <div className="font-medium text-white">View Portfolio</div>
                <div className="text-sm text-slate-300">Browse artist works</div>
              </button>
              <button className="w-full text-left px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 hover:bg-slate-600 transition-colors">
                <div className="font-medium text-white">Contact Artist</div>
                <div className="text-sm text-slate-300">Send a message</div>
              </button>
              <button className="w-full text-left px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 hover:bg-slate-600 transition-colors">
                <div className="font-medium text-white">Share Profile</div>
                <div className="text-sm text-slate-300">Copy link to share</div>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Works Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Featured Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for artist works */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800 rounded-xl h-48 flex items-center justify-center">
                <span className="text-slate-400 text-sm">Work #{i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Content Placeholder */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-3">More Content Coming Soon</h3>
          <p className="text-slate-300">
            Additional artist details, portfolio, and interactive features will be added here.
          </p>
        </div>
      </div>
    </div>
  );
}