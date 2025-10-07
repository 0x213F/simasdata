import Link from 'next/link';
import { getGradientColors } from './utils';
import { ArtSummary, getArtSummaryName, getArtSummaryDescription, getArtSummaryImageUrl } from '@/lib/supabase';

interface ArtistCardProps {
  artist: ArtSummary;
  index: number;
  onClick?: (artistId: string) => void;
  isSelected?: boolean;
}

export default function ArtistCard({ artist, index, onClick, isSelected = false }: ArtistCardProps) {
  const content = (
    <div
      key={`artist-${artist.uuid}-${index}`}
      className={`card rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-4 ring-amber-400' : 'hover:shadow-lg'
      }`}
      onClick={onClick ? () => onClick(artist.uuid) : undefined}
    >
      {getArtSummaryImageUrl(artist) ? (
        <div className="h-80 bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: `url(${getArtSummaryImageUrl(artist)})` }}>
        </div>
      ) : (
        <div className={`h-80 bg-gradient-to-br ${getGradientColors(index)}`}></div>
      )}
      <div className="p-8">
        <h3 className="text-2xl font-medium mb-4">{getArtSummaryName(artist)}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {getArtSummaryDescription(artist)}
        </p>
      </div>
    </div>
  );

  // If onClick is provided (for modal mode), return content directly
  if (onClick) {
    return content;
  }

  // Otherwise, wrap in Link for navigation
  return (
    <Link href={`/artists/${artist.slug}`} className="block">
      {content}
    </Link>
  );
}