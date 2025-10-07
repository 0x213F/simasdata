'use client';

import { ArtSummary } from '@/lib/supabase';
import { calculateLayout } from '../boutique/layout-calculator';
import FramedCard from './FramedCard';

interface FramedGalleryProps {
  items: ArtSummary[];
  type: 'artist' | 'project';
  onItemClick?: (itemId: string) => void;
  selectedItemId?: string | null;
  loading?: boolean;
  hasHydrated?: boolean;
}

export default function FramedGallery({
  items,
  type,
  onItemClick,
  selectedItemId,
  loading = false,
  hasHydrated = true,
}: FramedGalleryProps) {
  const layout = calculateLayout(items.length);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="border-4 border-amber-700 border-t-transparent w-12 h-12 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasHydrated && items.length === 0) {
    return <div className="min-h-[70vh] bg-stone-50"></div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-stone-50">
        <p className="text-amber-800 text-sm font-serif italic">Gallery Empty</p>
      </div>
    );
  }

  return (
    <div className="relative w-full px-6 md:px-12 py-12 md:py-16 bg-stone-50">
      {/* Gallery wall texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h60v60H0z\' fill=\'none\'/%3E%3Cpath d=\'M30 0v60M0 30h60\' stroke=\'%23000\' stroke-width=\'1\'/%3E%3C/svg%3E")' }}>
      </div>

      <div className={layout.containerClass}>
        {items.map((item, index) => (
          <FramedCard
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
