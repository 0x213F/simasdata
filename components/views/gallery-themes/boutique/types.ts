import { ArtSummary } from '@/lib/supabase';

export interface GalleryItem extends ArtSummary {}

export type LayoutType =
  | 'single-centered'
  | 'duo-horizontal'
  | 'trio-asymmetric'
  | 'quad-square'
  | 'penta-custom'
  | 'hexa-grid';

export interface LayoutConfig {
  type: LayoutType;
  containerClass: string;
  cardSizes: string[]; // Array of tailwind classes for each card
  showDecor: boolean;
}
