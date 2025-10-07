import { TrackedLink } from '@/lib/navigation-provider';
import { GalleryItem } from './types';
import { getArtSummaryName, getArtSummaryDescription, getArtSummaryImageUrl } from '@/lib/supabase';

interface BoutiqueCardProps {
  item: GalleryItem;
  type: 'artist' | 'project';
  index: number;
  onClick?: (itemId: string) => void;
  isSelected?: boolean;
  className?: string;
}

/**
 * Lightweight Instagram-boutique style card
 * Minimal design with subtle interactions
 */
export default function BoutiqueCard({
  item,
  type,
  index,
  onClick,
  isSelected = false,
  className = ''
}: BoutiqueCardProps) {
  const imageUrl = getArtSummaryImageUrl(item);
  const name = getArtSummaryName(item);
  const description = getArtSummaryDescription(item);

  // Subtle gradient fallbacks for items without images
  const gradients = [
    'from-slate-100 to-slate-200',
    'from-stone-100 to-stone-200',
    'from-neutral-100 to-neutral-200',
    'from-zinc-100 to-zinc-200',
  ];
  const gradient = gradients[index % gradients.length];

  const content = (
    <div
      className={`
        group relative overflow-hidden cursor-pointer
        bg-white rounded-sm shadow-sm
        transition-all duration-300 ease-out
        ${isSelected
          ? 'ring-2 ring-black shadow-xl scale-[1.02]'
          : 'hover:shadow-lg hover:scale-[1.01]'
        }
        ${className}
      `}
      onClick={onClick ? () => onClick(item.uuid) : undefined}
    >
      {/* Image Container */}
      <div className="aspect-square w-full overflow-hidden bg-gradient-to-br">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient}`}></div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
      </div>

      {/* Minimal Text Content */}
      <div className="p-4 md:p-5">
        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1 line-clamp-1">
          {name}
        </h3>
        {description && (
          <p className="text-xs md:text-sm text-gray-500 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  // If onClick is provided (for modal/selection mode), return content directly
  if (onClick) {
    return content;
  }

  // Otherwise, wrap in TrackedLink for navigation
  const href = type === 'artist' ? `/artists/${item.slug}` : `/projects/${item.slug}`;
  return (
    <TrackedLink href={href} className="block">
      {content}
    </TrackedLink>
  );
}
