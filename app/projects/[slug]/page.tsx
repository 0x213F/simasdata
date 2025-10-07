'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ScrollHeader from '@/components/ScrollHeader';
import Footer from '@/components/Footer';
import { ArtSummaryWithDetails } from '@/lib/supabase';
import ProjectDetail from '@/components/views/ProjectsView/ProjectDetail';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useBlogPostStore } from '@/lib/stores/blog-post-store';
import { useArtSummaryStore } from '@/lib/stores/art-summary-store';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [project, setProject] = useState<ArtSummaryWithDetails | null>(null);
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

  // Fetch project by slug
  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchArtSummaryWithDetailsBySlug(slug, 'project');

        if (!data) {
          setError('Project not found');
          setProject(null);
        } else {
          setProject(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch project');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug, fetchArtSummaryWithDetailsBySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900"></div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 transition-all duration-300">
        <ScrollHeader backText="Back to Projects" backHref="/projects" />
        <main className="min-h-screen overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-red-600 text-lg">{error || 'Project not found'}</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return <ProjectDetail project={project} />;
}