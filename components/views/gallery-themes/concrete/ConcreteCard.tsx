import { TrackedLink } from '@/lib/navigation-provider';
import { ArtSummary, getArtSummaryName, getArtSummaryDescription, getArtSummaryImageUrl } from '@/lib/supabase';

interface ConcreteCardProps {
  item: ArtSummary;
  type: 'artist' | 'project';
  index: number;
  onClick?: (itemId: string) => void;
  isSelected?: boolean;
  className?: string;
}

/**
 * Concrete - Industrial modernism meets soft tactility
 * Inspired by raw concrete architecture with soft neumorphic touches
 */
export default function ConcreteCard({
  item,
  type,
  index,
  onClick,
  isSelected = false,
  className = ''
}: ConcreteCardProps) {
  const imageUrl = getArtSummaryImageUrl(item);
  const name = getArtSummaryName(item);
  const description = getArtSummaryDescription(item);

  const content = (
    <div
      className={`
        group relative cursor-pointer
        bg-stone-200 rounded-lg overflow-hidden
        transition-all duration-300 ease-out
        ${isSelected
          ? 'shadow-[inset_4px_4px_12px_rgba(0,0,0,0.2),inset_-4px_-4px_12px_rgba(255,255,255,0.4),0_8px_24px_rgba(0,0,0,0.15)]'
          : 'shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_16px_rgba(0,0,0,0.15),-3px_-3px_12px_rgba(255,255,255,0.6)]'
        }
        ${className}
      `}
      onClick={onClick ? () => onClick(item.uuid) : undefined}
    >
      {/* Image with concrete texture overlay */}
      <div className="relative aspect-square w-full overflow-hidden">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 bg-stone-900/5 mix-blend-multiply"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-300 to-stone-400"></div>
        )}
      </div>

      {/* Recessed text area */}
      <div className="relative p-5 bg-stone-200">
        <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] pointer-events-none"></div>
        <h3 className="relative text-sm font-medium text-stone-800 mb-1 uppercase tracking-wider">
          {name}
        </h3>
        {description && (
          <p className="relative text-xs text-stone-600 line-clamp-2">
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
