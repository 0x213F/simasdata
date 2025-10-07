import { TrackedLink } from '@/lib/navigation-provider';
import { ArtSummary, getArtSummaryName, getArtSummaryDescription, getArtSummaryImageUrl } from '@/lib/supabase';

interface CarvedCardProps {
  item: ArtSummary;
  type: 'artist' | 'project';
  index: number;
  onClick?: (itemId: string) => void;
  isSelected?: boolean;
  className?: string;
}

/**
 * Carved - Precision-cut recessed panels
 * Sharp edges meet deep inset shadows, like carved stone or CNC-milled panels
 */
export default function CarvedCard({
  item,
  type,
  index,
  onClick,
  isSelected = false,
  className = ''
}: CarvedCardProps) {
  const imageUrl = getArtSummaryImageUrl(item);
  const name = getArtSummaryName(item);
  const description = getArtSummaryDescription(item);

  const content = (
    <div
      className={`
        group relative cursor-pointer
        bg-zinc-100 rounded-sm overflow-hidden
        transition-all duration-200
        ${isSelected
          ? 'shadow-[inset_0_0_0_2px_rgba(0,0,0,0.8),inset_6px_6px_12px_rgba(0,0,0,0.25),inset_-2px_-2px_8px_rgba(255,255,255,0.3)]'
          : 'shadow-[inset_3px_3px_8px_rgba(0,0,0,0.15),inset_-1px_-1px_4px_rgba(255,255,255,0.4)] hover:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.5)]'
        }
        ${className}
      `}
      onClick={onClick ? () => onClick(item.uuid) : undefined}
    >
      {/* Carved frame effect */}
      <div className="p-2">
        <div className="relative aspect-square w-full overflow-hidden shadow-[inset_2px_2px_6px_rgba(0,0,0,0.2)]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-300"></div>
          )}
        </div>
      </div>

      {/* Carved text recess */}
      <div className="px-4 pb-4 pt-2">
        <div className="p-3 bg-zinc-50 rounded-sm shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]">
          <h3 className="text-xs font-bold text-zinc-900 mb-1 uppercase tracking-widest">
            {name}
          </h3>
          {description && (
            <p className="text-[10px] text-zinc-600 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
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
