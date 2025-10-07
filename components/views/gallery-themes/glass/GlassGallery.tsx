'use client';

import { ArtSummary } from '@/lib/supabase';
import { calculateLayout } from '../boutique/layout-calculator';
import GlassCard from './GlassCard';

interface GlassGalleryProps {
  items: ArtSummary[];
  type: 'artist' | 'project';
  onItemClick?: (itemId: string) => void;
  selectedItemId?: string | null;
  loading?: boolean;
  hasHydrated?: boolean;
}

export default function GlassGallery({
  items,
  type,
  onItemClick,
  selectedItemId,
  loading = false,
  hasHydrated = true,
}: GlassGalleryProps) {
  const layout = calculateLayout(items.length);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 rounded-full border-2 border-white/50 border-t-white backdrop-blur-sm animate-spin"></div>
      </div>
    );
  }

  if (!hasHydrated && items.length === 0) {
    return <div className="min-h-[70vh]"></div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="px-6 py-3 rounded-lg backdrop-blur-md bg-white/20 border border-white/30">
          <p className="text-gray-700 text-sm">Empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full px-6 md:px-12 py-12 md:py-16">
      {/* Gradient background for glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 -z-10"></div>

      {/* Floating orbs for depth */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl -z-10"></div>

      <div className={layout.containerClass}>
        {items.map((item, index) => (
          <GlassCard
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
