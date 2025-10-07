'use client'

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArtistsView from '@/components/views/ArtistsView';
import { useRouter } from 'next/navigation';
import { useArtSummaryStore } from '@/lib/stores/art-summary-store';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function ArtistsPage() {
  const router = useRouter();
  const fetchArtSummaries = useArtSummaryStore(state => state.fetchArtSummaries);
  const checkAuth = useAuthStore(state => state.checkAuth);

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
    fetchArtSummaries();
    checkAuth();
  }, [fetchArtSummaries, checkAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 transition-all duration-300">
      <Header currentRoute="artists" onNavigate={handleNavigate} />
      <main className="min-h-screen overflow-auto pt-20 pb-20">
        <div className="transition-opacity duration-300">
          <ArtistsView />
        </div>
      </main>
      <Footer />
    </div>
  );
}