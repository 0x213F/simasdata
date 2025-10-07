'use client';

import { ArtSummary } from '@/lib/supabase';
import { calculateLayout } from '../boutique/layout-calculator';
import NeumorphicCard from './NeumorphicCard';

interface NeumorphicGalleryProps {
  items: ArtSummary[];
  type: 'artist' | 'project';
  onItemClick?: (itemId: string) => void;
  selectedItemId?: string | null;
  loading?: boolean;
  hasHydrated?: boolean;
}

export default function NeumorphicGallery({
  items,
  type,
  onItemClick,
  selectedItemId,
  loading = false,
  hasHydrated = true,
}: NeumorphicGalleryProps) {
  const layout = calculateLayout(items.length);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-gray-100">
        <div className="w-16 h-16 rounded-full bg-gray-100 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.1),inset_-8px_-8px_16px_rgba(255,255,255,0.7)] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-gray-400 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!hasHydrated && items.length === 0) {
    return <div className="min-h-[70vh] bg-gray-100"></div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-gray-100">
        <p className="text-gray-400 text-sm">Nothing here</p>
      </div>
    );
  }

  return (
    <div className="relative w-full px-6 md:px-12 py-12 md:py-16 bg-gray-100">
      <div className={layout.containerClass}>
        {items.map((item, index) => (
          <NeumorphicCard
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
