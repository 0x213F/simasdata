import { getGradientColors } from './utils';

interface Artist {
  id: string;
  name: string;
  description: string;
  imgurl?: string;
}

interface ArtistCardProps {
  artist: Artist;
  index: number;
}

export default function ArtistCard({ artist, index }: ArtistCardProps) {
  return (
    <div key={`artist-${artist.id}-${index}`} className="card rounded-lg overflow-hidden">
      {artist.imgurl ? (
        <div className="h-80 bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: `url(${artist.imgurl})` }}>
        </div>
      ) : (
        <div className={`h-80 bg-gradient-to-br ${getGradientColors(index)}`}></div>
      )}
      <div className="p-8">
        <h3 className="text-2xl font-medium mb-4">{artist.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {artist.description}
        </p>
      </div>
    </div>
  );
}