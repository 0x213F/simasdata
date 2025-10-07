import ArtSummaryDetail from '@/components/shared/ArtSummaryDetail';
import { ArtSummaryWithDetails } from '@/lib/supabase';

interface ArtistDetailProps {
  artist: ArtSummaryWithDetails;
  onClose?: () => void;
}

export default function ArtistDetail({ artist, onClose }: ArtistDetailProps) {
  return (
    <ArtSummaryDetail
      artSummary={artist}
      type="artist"
      onClose={onClose}
    />
  );
}