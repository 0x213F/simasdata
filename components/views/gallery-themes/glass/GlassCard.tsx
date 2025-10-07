import { TrackedLink } from '@/lib/navigation-provider';
import { ArtSummary, getArtSummaryName, getArtSummaryDescription, getArtSummaryImageUrl } from '@/lib/supabase';

interface GlassCardProps {
  item: ArtSummary;
  type: 'artist' | 'project';
  index: number;
  onClick?: (itemId: string) => void;
  isSelected?: boolean;
  className?: string;
}

export default function GlassCard({
  item,
  type,
  index,
  onClick,
  isSelected = false,
  className = ''
}: GlassCardProps) {
  const imageUrl = getArtSummaryImageUrl(item);
  const name = getArtSummaryName(item);
  const description = getArtSummaryDescription(item);

  const content = (
    <div
      className={`
        group relative overflow-hidden cursor-pointer
        rounded-xl backdrop-blur-md
        border transition-all duration-300
        ${isSelected
          ? 'bg-white/30 border-white/60 shadow-xl'
          : 'bg-white/20 border-white/30 hover:bg-white/25 hover:border-white/50'
        }
        ${className}
      `}
      onClick={onClick ? () => onClick(item.uuid) : undefined}
    >
      {/* Frosted glass overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-200/50 to-slate-300/50"></div>
        )}
        {/* Glass reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none"></div>
      </div>

      {/* Frosted text area */}
      <div className="relative p-5 backdrop-blur-sm bg-white/10">
        <h3 className="text-base font-medium text-gray-900 mb-1">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-gray-700 line-clamp-2">
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
