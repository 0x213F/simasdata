'use client';

import { ArtSummary } from '@/lib/supabase';
import { calculateLayout } from '../boutique/layout-calculator';
import CarvedCard from './CarvedCard';

interface CarvedGalleryProps {
  items: ArtSummary[];
  type: 'artist' | 'project';
  onItemClick?: (itemId: string) => void;
  selectedItemId?: string | null;
  loading?: boolean;
  hasHydrated?: boolean;
}

export default function CarvedGallery({
  items,
  type,
  onItemClick,
  selectedItemId,
  loading = false,
  hasHydrated = true,
}: CarvedGalleryProps) {
  const layout = calculateLayout(items.length);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-zinc-200">
        <div className="w-16 h-16 bg-zinc-100 rounded-sm shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15)] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!hasHydrated && items.length === 0) {
    return <div className="min-h-[70vh] bg-zinc-200"></div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-zinc-200">
        <div className="px-6 py-3 bg-zinc-100 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1)]">
          <p className="text-zinc-400 text-xs uppercase tracking-widest">EMPTY</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full px-8 md:px-12 py-12 md:py-16 bg-zinc-200">
      <div className={layout.containerClass}>
        {items.map((item, index) => (
          <CarvedCard
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
