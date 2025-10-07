import { CURRENT_THEME, GalleryTheme } from './theme-config';

// Import all gallery themes
import { BoutiqueGallery } from './boutique';
import { MinimalistGallery } from './minimalist';
import { FramedGallery } from './framed';
import { NeumorphicGallery } from './neumorphic';
import { GlassGallery } from './glass';
import { BrutalistGallery } from './brutalist';
import { GridGallery } from './grid';
import { ConcreteGallery } from './concrete';
import { CarvedGallery } from './carved';
import { EmbossedGallery } from './embossed';

/**
 * Returns the gallery component based on the current theme configuration.
 * This is the main switcher that determines which theme is rendered.
 */
export function getGalleryComponent(theme: GalleryTheme = CURRENT_THEME) {
  switch (theme) {
    case 'boutique':
      return BoutiqueGallery;
    case 'minimalist':
      return MinimalistGallery;
    case 'framed':
      return FramedGallery;
    case 'neumorphic':
      return NeumorphicGallery;
    case 'glass':
      return GlassGallery;
    case 'brutalist':
      return BrutalistGallery;
    case 'grid':
      return GridGallery;
    case 'concrete':
      return ConcreteGallery;
    case 'carved':
      return CarvedGallery;
    case 'embossed':
      return EmbossedGallery;
    default:
      return BoutiqueGallery;
  }
}
