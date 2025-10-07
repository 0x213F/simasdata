'use client';

import { ArtSummary } from '@/lib/supabase';
import { calculateLayout } from '../boutique/layout-calculator';
import EmbossedCard from './EmbossedCard';

interface EmbossedGalleryProps {
  items: ArtSummary[];
  type: 'artist' | 'project';
  onItemClick?: (itemId: string) => void;
  selectedItemId?: string | null;
  loading?: boolean;
  hasHydrated?: boolean;
}

export default function EmbossedGallery({
  items,
  type,
  onItemClick,
  selectedItemId,
  loading = false,
  hasHydrated = true,
}: EmbossedGalleryProps) {
  const layout = calculateLayout(items.length);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-slate-100">
        <div className="w-12 h-12 border-2 border-slate-900 bg-slate-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!hasHydrated && items.length === 0) {
    return <div className="min-h-[70vh] bg-slate-100"></div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-slate-100">
        <div className="px-6 py-3 border-2 border-slate-300 bg-slate-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
          <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">EMPTY</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full px-8 md:px-12 py-12 md:py-16 bg-slate-100">
      <div className={layout.containerClass}>
        {items.map((item, index) => (
          <EmbossedCard
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
