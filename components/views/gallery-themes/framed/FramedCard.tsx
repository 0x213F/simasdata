import { TrackedLink } from '@/lib/navigation-provider';
import { ArtSummary, getArtSummaryName, getArtSummaryDescription, getArtSummaryImageUrl } from '@/lib/supabase';

interface FramedCardProps {
  item: ArtSummary;
  type: 'artist' | 'project';
  index: number;
  onClick?: (itemId: string) => void;
  isSelected?: boolean;
  className?: string;
}

export default function FramedCard({
  item,
  type,
  index,
  onClick,
  isSelected = false,
  className = ''
}: FramedCardProps) {
  const imageUrl = getArtSummaryImageUrl(item);
  const name = getArtSummaryName(item);
  const description = getArtSummaryDescription(item);

  const content = (
    <div
      className={`
        group relative cursor-pointer
        bg-white p-3
        transition-all duration-300
        ${isSelected
          ? 'shadow-2xl scale-[1.02]'
          : 'shadow-md hover:shadow-xl'
        }
        ${className}
      `}
      onClick={onClick ? () => onClick(item.uuid) : undefined}
    >
      {/* Outer frame border */}
      <div className={`
        border-8 p-4 transition-colors duration-300
        ${isSelected ? 'border-amber-600' : 'border-amber-700/80'}
      `}>
        {/* Inner matting */}
        <div className="border-2 border-stone-200 p-3">
          {/* Image */}
          <div className="aspect-square w-full overflow-hidden bg-stone-50">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200"></div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery label plate */}
      <div className="mt-4 px-2 text-center">
        <h3 className="text-sm font-serif text-gray-900 mb-1">
          {name}
        </h3>
        {description && (
          <p className="text-xs text-gray-500 italic line-clamp-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return content;
  }

  const href = type === 'artist' ? `/artists/${item.slug}` : `/projects/${item.slug}`;
  return (
    <TrackedLink href={href} className="block">
      {content}
    </TrackedLink>
  );
}
