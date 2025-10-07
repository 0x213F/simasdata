import { supabase } from '@/lib/supabase';
import ProjectDetailClient from './ProjectDetailClient';
import { use } from 'react';

export async function generateStaticParams() {
  const { data: projects } = await supabase
    .from('ArtSummary')
    .select('slug')
    .eq('type', 'project')
    .eq('is_active', true);

  return projects?.map((project) => ({
    slug: project.slug,
  })) || [];
}

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <ProjectDetailClient slug={slug} />;
}