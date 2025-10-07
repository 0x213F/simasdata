import { TrackedLink } from '@/lib/navigation-provider';
import { ArtSummary, getArtSummaryName, getArtSummaryDescription, getArtSummaryImageUrl } from '@/lib/supabase';

interface NeumorphicCardProps {
  item: ArtSummary;
  type: 'artist' | 'project';
  index: number;
  onClick?: (itemId: string) => void;
  isSelected?: boolean;
  className?: string;
}

export default function NeumorphicCard({
  item,
  type,
  index,
  onClick,
  isSelected = false,
  className = ''
}: NeumorphicCardProps) {
  const imageUrl = getArtSummaryImageUrl(item);
  const name = getArtSummaryName(item);
  const description = getArtSummaryDescription(item);

  const content = (
    <div
      className={`
        group relative overflow-hidden cursor-pointer
        bg-gray-100 rounded-3xl
        transition-all duration-500 ease-out
        ${isSelected
          ? 'shadow-[inset_8px_8px_16px_rgba(0,0,0,0.15),inset_-8px_-8px_16px_rgba(255,255,255,0.7)]'
          : 'shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] hover:shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,0.8)]'
        }
        ${className}
      `}
      onClick={onClick ? () => onClick(item.uuid) : undefined}
    >
      {/* Image Container - also neumorphic */}
      <div className="p-4">
        <div className={`
          aspect-square w-full overflow-hidden rounded-2xl
          ${isSelected
            ? 'shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.5)]'
            : 'shadow-[6px_6px_12px_rgba(0,0,0,0.08),-4px_-4px_8px_rgba(255,255,255,0.5)]'
          }
        `}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100"></div>
          )}
        </div>
      </div>

      {/* Soft text */}
      <div className="px-6 pb-6">
        <h3 className="text-base font-medium text-gray-700 mb-1">
          {name}
        </h3>
        {description && (
          <p className="text-xs text-gray-500 line-clamp-2">
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
