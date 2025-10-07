import { TrackedLink } from '@/lib/navigation-provider';
import { ArtSummary, getArtSummaryName, getArtSummaryDescription, getArtSummaryImageUrl } from '@/lib/supabase';

interface EmbossedCardProps {
  item: ArtSummary;
  type: 'artist' | 'project';
  index: number;
  onClick?: (itemId: string) => void;
  isSelected?: boolean;
  className?: string;
}

/**
 * Embossed - Raised from the surface
 * Opposite of carved - cards appear stamped/pressed upward with sharp definition
 */
export default function EmbossedCard({
  item,
  type,
  index,
  onClick,
  isSelected = false,
  className = ''
}: EmbossedCardProps) {
  const imageUrl = getArtSummaryImageUrl(item);
  const name = getArtSummaryName(item);
  const description = getArtSummaryDescription(item);

  const content = (
    <div
      className={`
        group relative cursor-pointer
        bg-slate-50 border-2 overflow-hidden
        transition-all duration-200
        ${isSelected
          ? 'border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1),8px_8px_0px_0px_rgba(0,0,0,0.1)]'
          : 'border-slate-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.15)] hover:translate-y-[-2px]'
        }
        ${className}
      `}
      onClick={onClick ? () => onClick(item.uuid) : undefined}
    >
      {/* Stamped border effect */}
      <div className="relative">
        <div className="absolute inset-0 border-b-4 border-slate-200 pointer-events-none"></div>

        <div className="aspect-square w-full overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-200"></div>
          )}
        </div>
      </div>

      {/* Raised label */}
      <div className="relative p-4 bg-slate-50">
        {/* Emboss effect line */}
        <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

        <h3 className="text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider">
          {name}
        </h3>
        {description && (
          <p className="text-xs text-slate-600 line-clamp-2">
            {description}
          </p>
        )}

        {/* Bottom emboss */}
        <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-white"></div>
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
