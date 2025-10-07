import { TrackedLink } from '@/lib/navigation-provider';
import { ArtSummary, getArtSummaryName, getArtSummaryDescription, getArtSummaryImageUrl } from '@/lib/supabase';

interface GridCardProps {
  item: ArtSummary;
  type: 'artist' | 'project';
  index: number;
  onClick?: (itemId: string) => void;
  isSelected?: boolean;
  className?: string;
}

export default function GridCard({
  item,
  type,
  index,
  onClick,
  isSelected = false,
  className = ''
}: GridCardProps) {
  const imageUrl = getArtSummaryImageUrl(item);
  const name = getArtSummaryName(item);
  const description = getArtSummaryDescription(item);

  const content = (
    <div
      className={`
        group relative cursor-pointer
        bg-white rounded-[4px]
        border transition-all duration-200
        ${isSelected
          ? 'border-red-500 border-2 shadow-sm'
          : 'border-gray-200 hover:border-gray-400'
        }
        ${className}
      `}
      onClick={onClick ? () => onClick(item.uuid) : undefined}
    >
      {/* Precise image container */}
      <div className="aspect-square w-full overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100"></div>
        )}
      </div>

      {/* Grid-aligned text */}
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide leading-tight">
          {name}
        </h3>
        {description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Corner markers for selected state */}
      {isSelected && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 bg-red-500"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-red-500"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-red-500"></div>
        </>
      )}
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
