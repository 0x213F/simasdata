'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ScrollHeader from '@/components/ScrollHeader';
import Footer from '@/components/Footer';
import { ArtSummaryWithDetails } from '@/lib/supabase';
import ArtistDetail from '@/components/views/ArtistsView/ArtistDetail';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useBlogPostStore } from '@/lib/stores/blog-post-store';
import { useArtSummaryStore } from '@/lib/stores/art-summary-store';

interface ArtistDetailClientProps {
  slug: string;
}

export default function ArtistDetailClient({ slug }: ArtistDetailClientProps) {
  const router = useRouter();
  const [artist, setArtist] = useState<ArtSummaryWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useAuthStore(state => state.checkAuth);
  const fetchRecentPosts = useBlogPostStore(state => state.fetchRecentPosts);
  const fetchArtSummaryWithDetailsBySlug = useArtSummaryStore(state => state.fetchArtSummaryWithDetailsBySlug);

  const handleNavigate = (route: string) => {
    if (route === 'home') {
      router.push('/');
    } else if (route === 'projects') {
      router.push('/projects');
    } else if (route === 'artists') {
      router.push('/artists');
    }
  };

  // Fetch data on page load
  useEffect(() => {
    fetchRecentPosts();
    checkAuth();
  }, [fetchRecentPosts, checkAuth]);

  // Fetch artist by slug
  useEffect(() => {
    const fetchArtist = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchArtSummaryWithDetailsBySlug(slug, 'artist');

        if (!data) {
          setError('Artist not found');
          setArtist(null);
        } else {
          setArtist(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch artist');
        setArtist(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [slug, fetchArtSummaryWithDetailsBySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 transition-all duration-300">
        <ScrollHeader backText="Back to Artists" backHref="/artists" />
        <main className="min-h-screen overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-text-secondary text-lg">Loading artist...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 transition-all duration-300">
        <ScrollHeader backText="Back to Artists" backHref="/artists" />
        <main className="min-h-screen overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-red-600 text-lg">{error || 'Artist not found'}</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 transition-all duration-300">
      <ScrollHeader backText="Back to Artists" backHref="/artists" />
      <main className="min-h-screen overflow-auto">
        <div className="transition-opacity duration-300">
          <ArtistDetail artist={artist} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
