import { LayoutConfig, LayoutType } from './types';

/**
 * Calculates the optimal layout based on the number of items
 * This ensures the page always looks balanced and boutique-like
 */
export function calculateLayout(itemCount: number): LayoutConfig {
  switch (itemCount) {
    case 1:
      return {
        type: 'single-centered',
        containerClass: 'flex items-center justify-center min-h-[70vh]',
        cardSizes: ['w-full max-w-md'],
        showDecor: true,
      };

    case 2:
      return {
        type: 'duo-horizontal',
        containerClass: 'flex items-center justify-center gap-8 md:gap-12 flex-col md:flex-row min-h-[70vh]',
        cardSizes: ['w-full max-w-sm', 'w-full max-w-sm'],
        showDecor: true,
      };

    case 3:
      return {
        type: 'trio-asymmetric',
        containerClass: 'grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto min-h-[70vh] items-center',
        cardSizes: [
          '', // First card
          '', // Second card
          '', // Third card
        ],
        showDecor: true,
      };

    case 4:
      return {
        type: 'quad-square',
        containerClass: 'grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-4xl mx-auto min-h-[70vh] items-center',
        cardSizes: Array(4).fill(''),
        showDecor: false,
      };

    case 5:
      return {
        type: 'penta-custom',
        containerClass: 'grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto min-h-[70vh] items-center',
        cardSizes: [
          'md:col-span-2',  // First card spans 2 columns
          'md:col-span-1',  // Second card
          'md:col-span-1',  // Third card
          'md:col-span-1',  // Fourth card
          'md:col-span-1',  // Fifth card
        ],
        showDecor: false,
      };

    case 6:
    default:
      return {
        type: 'hexa-grid',
        containerClass: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto',
        cardSizes: Array(itemCount).fill(''),
        showDecor: false,
      };
  }
}
