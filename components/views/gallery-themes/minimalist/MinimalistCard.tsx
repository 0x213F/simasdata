import { TrackedLink } from '@/lib/navigation-provider';
import { ArtSummary, getArtSummaryName, getArtSummaryDescription, getArtSummaryImageUrl } from '@/lib/supabase';

interface MinimalistCardProps {
  item: ArtSummary;
  type: 'artist' | 'project';
  index: number;
  onClick?: (itemId: string) => void;
  isSelected?: boolean;
  className?: string;
}

export default function MinimalistCard({
  item,
  type,
  index,
  onClick,
  isSelected = false,
  className = ''
}: MinimalistCardProps) {
  const imageUrl = getArtSummaryImageUrl(item);
  const name = getArtSummaryName(item);
  const description = getArtSummaryDescription(item);

  const content = (
    <div
      className={`
        group relative overflow-hidden cursor-pointer
        bg-white rounded-sm
        border border-gray-100
        transition-all duration-300 ease-out
        ${isSelected ? 'border-gray-900' : 'hover:border-gray-300'}
        ${className}
      `}
      onClick={onClick ? () => onClick(item.uuid) : undefined}
    >
      {/* Image Container */}
      <div className="aspect-square w-full overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-50"></div>
        )}
      </div>

      {/* Ultra minimal text */}
      <div className="p-6">
        <h3 className="text-sm font-normal text-gray-900 mb-1 tracking-wide uppercase">
          {name}
        </h3>
        {description && (
          <p className="text-xs text-gray-400 line-clamp-1">
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
