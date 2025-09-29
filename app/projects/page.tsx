'use client'

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectsView from '@/components/views/ProjectsView';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useBlogPostStore } from '@/lib/stores/blog-post-store';

export default function ProjectsPage() {
  const router = useRouter();
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
    fetchRecentPosts();
    checkAuth();
  }, [fetchRecentPosts, checkAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 transition-all duration-300">
      <Header currentRoute="projects" onNavigate={handleNavigate} />
      <main className="min-h-screen overflow-auto pt-20 pb-20">
        <div className="transition-opacity duration-300">
          <ProjectsView />
        </div>
      </main>
      <Footer />
    </div>
  );
}