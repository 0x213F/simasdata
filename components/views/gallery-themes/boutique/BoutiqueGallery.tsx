'use client';

import { GalleryItem } from './types';
import { calculateLayout } from './layout-calculator';
import BoutiqueCard from './BoutiqueCard';
import BalancingDecor from './BalancingDecor';

interface BoutiqueGalleryProps {
  items: GalleryItem[];
  type: 'artist' | 'project';
  onItemClick?: (itemId: string) => void;
  selectedItemId?: string | null;
  loading?: boolean;
  hasHydrated?: boolean;
}

/**
 * Boutique Instagram-style gallery that adapts to any number of items (1-6+)
 * Features:
 * - Adaptive layouts based on item count
 * - Lightweight, minimal card design
 * - Decorative balancing for pages with few items
 * - Fits in one page frame on desktop
 * - Responsive and scrollable on mobile
 */
export default function BoutiqueGallery({
  items,
  type,
  onItemClick,
  selectedItemId,
  loading = false,
  hasHydrated = true,
}: BoutiqueGalleryProps) {
  // Calculate the optimal layout based on item count
  const layout = calculateLayout(items.length);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-gray-900"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!hasHydrated && items.length === 0) {
    return <div className="min-h-[70vh]"></div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <p className="text-gray-400 text-sm">No {type}s yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full px-4 md:px-8 py-8 md:py-12">
      {/* Decorative background elements */}
      {layout.showDecor && (
        <BalancingDecor layoutType={layout.type} itemCount={items.length} />
      )}

      {/* Gallery Grid */}
      <div className={layout.containerClass}>
        {items.map((item, index) => (
          <BoutiqueCard
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
