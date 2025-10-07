'use client';

import { ArtSummary } from '@/lib/supabase';
import { calculateLayout } from '../boutique/layout-calculator';
import MinimalistCard from './MinimalistCard';

interface MinimalistGalleryProps {
  items: ArtSummary[];
  type: 'artist' | 'project';
  onItemClick?: (itemId: string) => void;
  selectedItemId?: string | null;
  loading?: boolean;
  hasHydrated?: boolean;
}

export default function MinimalistGallery({
  items,
  type,
  onItemClick,
  selectedItemId,
  loading = false,
  hasHydrated = true,
}: MinimalistGalleryProps) {
  const layout = calculateLayout(items.length);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-8 h-8 border border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasHydrated && items.length === 0) {
    return <div className="min-h-[70vh]"></div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-gray-300 text-xs uppercase tracking-wider">Empty</p>
      </div>
    );
  }

  return (
    <div className="relative w-full px-8 md:px-16 py-16 md:py-24">
      <div className={layout.containerClass}>
        {items.map((item, index) => (
          <MinimalistCard
            key={`${type}-${item.uuid}-${index}`}
            item={item}
            type={type}
            index={index}
            onClick={onItemClick}
            isSelected={selectedItemId === item.uuid}
            className={layout.cardSizes[index] || ''}
          />
        ))}
      </div>
    </div>
  );
}
