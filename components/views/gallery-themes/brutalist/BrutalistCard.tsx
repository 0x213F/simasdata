import { TrackedLink } from '@/lib/navigation-provider';
import { ArtSummary, getArtSummaryName, getArtSummaryDescription, getArtSummaryImageUrl } from '@/lib/supabase';

interface BrutalistCardProps {
  item: ArtSummary;
  type: 'artist' | 'project';
  index: number;
  onClick?: (itemId: string) => void;
  isSelected?: boolean;
  className?: string;
}

export default function BrutalistCard({
  item,
  type,
  index,
  onClick,
  isSelected = false,
  className = ''
}: BrutalistCardProps) {
  const imageUrl = getArtSummaryImageUrl(item);
  const name = getArtSummaryName(item);
  const description = getArtSummaryDescription(item);

  const content = (
    <div
      className={`
        group relative cursor-pointer
        bg-white border-4 border-black
        transition-all duration-200
        ${isSelected
          ? 'shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] translate-x-[-4px] translate-y-[-4px]'
          : 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
        }
        ${className}
      `}
      onClick={onClick ? () => onClick(item.uuid) : undefined}
    >
      {/* Image Container */}
      <div className="aspect-square w-full overflow-hidden border-b-4 border-black">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full bg-black"></div>
        )}
      </div>

      {/* Stark text */}
      <div className="p-4 bg-white">
        <h3 className="text-base font-bold uppercase text-black mb-1 tracking-tight">
          {name}
        </h3>
        {description && (
          <p className="text-xs text-black font-mono line-clamp-1">
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
