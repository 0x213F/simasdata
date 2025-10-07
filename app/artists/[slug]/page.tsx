import { supabase } from '@/lib/supabase';
import ArtistDetailClient from './ArtistDetailClient';
import { use } from 'react';

export async function generateStaticParams() {
  const { data: artists } = await supabase
    .from('ArtSummary')
    .select('slug')
    .eq('type', 'artist')
    .eq('is_active', true);

  return artists?.map((artist) => ({
    slug: artist.slug,
  })) || [];
}

export default function ArtistDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <ArtistDetailClient slug={slug} />;
}