'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase, ArtSummary } from '@/lib/supabase';
import ArtistDetail from '@/components/views/ArtistsView/ArtistDetail';
import { useArtistStore } from '@/lib/stores/artist-store';
import { useProjectStore } from '@/lib/stores/project-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useBlogPostStore } from '@/lib/stores/blog-post-store';

export default function ArtistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [artist, setArtist] = useState<ArtSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtists = useArtistStore(state => state.fetchArtists);
  const fetchProjects = useProjectStore(state => state.fetchProjects);
  const checkAuth = useAuthStore(state => state.checkAuth);
  const fetchRecentPosts = useBlogPostStore(state => state.fetchRecentPosts);

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
    // Mark site as visited to prevent splash screen on homepage return
    sessionStorage.setItem('simasdata-visited', 'true');

    fetchArtists();
    fetchProjects();
    fetchRecentPosts();
    checkAuth();
  }, [fetchArtists, fetchProjects, fetchRecentPosts, checkAuth]);

  // Fetch artist by slug
  useEffect(() => {
    const fetchArtist = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('ArtSummary')
          .select('*')
          .eq('slug', slug)
          .eq('type', 'artist')
          .eq('is_active', true)
          .single();

        if (error) {
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
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 transition-all duration-300">
        <Header currentRoute="artists" onNavigate={handleNavigate} />
        <main className="min-h-screen overflow-auto pt-20 pb-20">
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
        <Header currentRoute="artists" onNavigate={handleNavigate} />
        <main className="min-h-screen overflow-auto pt-20 pb-20">
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
      <Header currentRoute="artists" onNavigate={() => {}} />
      <main className="min-h-screen overflow-auto pt-20 pb-20">
        <div className="transition-opacity duration-300">
          <ArtistDetail artist={artist} />
        </div>
      </main>
      <Footer />
    </div>
  );
}