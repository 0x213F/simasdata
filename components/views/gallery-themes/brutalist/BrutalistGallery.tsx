'use client';

import { ArtSummary } from '@/lib/supabase';
import { calculateLayout } from '../boutique/layout-calculator';
import BrutalistCard from './BrutalistCard';

interface BrutalistGalleryProps {
  items: ArtSummary[];
  type: 'artist' | 'project';
  onItemClick?: (itemId: string) => void;
  selectedItemId?: string | null;
  loading?: boolean;
  hasHydrated?: boolean;
}

export default function BrutalistGallery({
  items,
  type,
  onItemClick,
  selectedItemId,
  loading = false,
  hasHydrated = true,
}: BrutalistGalleryProps) {
  const layout = calculateLayout(items.length);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-white">
        <div className="w-16 h-16 border-4 border-black border-t-white animate-spin"></div>
      </div>
    );
  }

  if (!hasHydrated && items.length === 0) {
    return <div className="min-h-[70vh] bg-white"></div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-white">
        <div className="border-4 border-black px-8 py-4">
          <p className="text-black font-bold uppercase tracking-wider">EMPTY</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full px-6 md:px-12 py-12 md:py-16 bg-white">
      {/* Brutalist grid pattern background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
           style={{
             backgroundImage: 'repeating-linear-gradient(0deg, black 0px, black 2px, transparent 2px, transparent 40px), repeating-linear-gradient(90deg, black 0px, black 2px, transparent 2px, transparent 40px)',
           }}>
      </div>

      <div className={layout.containerClass}>
        {items.map((item, index) => (
          <BrutalistCard
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
