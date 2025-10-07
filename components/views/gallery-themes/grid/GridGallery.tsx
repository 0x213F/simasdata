'use client';

import { ArtSummary } from '@/lib/supabase';
import { calculateLayout } from '../boutique/layout-calculator';
import GridCard from './GridCard';

interface GridGalleryProps {
  items: ArtSummary[];
  type: 'artist' | 'project';
  onItemClick?: (itemId: string) => void;
  selectedItemId?: string | null;
  loading?: boolean;
  hasHydrated?: boolean;
}

export default function GridGallery({
  items,
  type,
  onItemClick,
  selectedItemId,
  loading = false,
  hasHydrated = true,
}: GridGalleryProps) {
  const layout = calculateLayout(items.length);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-white">
        <div className="w-8 h-8 border border-gray-300 border-t-red-500 animate-spin"></div>
      </div>
    );
  }

  if (!hasHydrated && items.length === 0) {
    return <div className="min-h-[70vh] bg-white"></div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-white">
        <div className="border border-gray-200 px-8 py-4">
          <p className="text-gray-400 text-xs uppercase tracking-widest">NO DATA</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full px-8 md:px-16 py-16 md:py-24 bg-white">
      {/* Swiss grid system background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
           style={{
             backgroundImage: `
               repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 8px),
               repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 8px)
             `,
           }}>
      </div>

      {/* Precise measurements indicator */}
      <div className="absolute top-8 left-8 flex items-center gap-2 opacity-30">
        <div className="w-4 h-[1px] bg-red-500"></div>
        <div className="text-[10px] text-gray-400 font-mono">8px grid</div>
      </div>

      <div className={layout.containerClass}>
        {items.map((item, index) => (
          <GridCard
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
