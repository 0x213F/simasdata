/**
 * GALLERY THEME CONFIGURATION
 *
 * This file controls which gallery theme is used throughout the application.
 * Simply change the CURRENT_THEME value to switch between different gallery styles.
 *
 * Available themes:
 * - 'boutique'    - Instagram-inspired minimal cards with adaptive layouts
 * - 'minimalist'  - Ultra-clean with maximum white space, barely-there borders
 * - 'framed'      - Classic museum gallery with ornate picture frames
 * - 'neumorphic'  - Soft 3D with same-color shadows, tactile feel
 * - 'glass'       - Glassmorphism with backdrop blur, futuristic
 * - 'brutalist'   - Raw, blocky with high contrast and offset shadows
 * - 'elegant'     - Refined luxury with subtle gold accents
 * - 'shadow'      - Deep 3D shadows with dramatic layered depth
 * - 'rounded'     - Organic circles and soft edges, friendly
 * - 'floating'    - Elevated cards with offset shadows and rotation
 * - 'grid'        - Swiss design, strict geometric precision
 */

export type GalleryTheme =
  | 'boutique'
  | 'minimalist'
  | 'framed'
  | 'neumorphic'
  | 'glass'
  | 'brutalist'
  | 'grid'
  | 'concrete'
  | 'carved'
  | 'embossed';

/**
 * ⚙️ CHANGE THIS VALUE TO SWITCH THEMES ⚙️
 *
 * Set to any of the theme names listed above.
 * The entire app will update to use the selected theme.
 *
 * USER FEEDBACK:
 * ✅ LIKED: 'neumorphic'
 * 💡 INSPIRATION: 'brutalist'
 * 👍 LIKED A BIT: 'grid'
 * 🤔 OK/CLOSE TO POLAROID: 'carved'
 * ❌ DIDN'T LIKE: 'elegant', 'shadow', 'rounded', 'floating', 'concrete' (removed)
 */
export const CURRENT_THEME: GalleryTheme = 'embossed';

/**
 * Theme metadata for reference
 */
export const THEME_INFO: Record<GalleryTheme, { name: string; description: string; feeling: string }> = {
  boutique: {
    name: 'Boutique',
    description: 'Instagram-inspired minimal cards with adaptive layouts',
    feeling: 'Modern, clean, boutique luxury',
  },
  minimalist: {
    name: 'Minimalist',
    description: 'Ultra-clean with maximum white space',
    feeling: 'Pure, breathable, zen-like tranquility',
  },
  framed: {
    name: 'Framed',
    description: 'Classic museum gallery with ornate frames',
    feeling: 'Classic museum, timeless curation',
  },
  neumorphic: {
    name: 'Neumorphic', // ✅ USER LIKED THIS ONE
    description: 'Soft 3D with same-color shadows',
    feeling: 'Tactile, modern, approachable luxury',
  },
  glass: {
    name: 'Glass',
    description: 'Glassmorphism with backdrop blur',
    feeling: 'Futuristic, ethereal, transparent elegance',
  },
  brutalist: {
    name: 'Brutalist', // 💡 USER FOUND THIS INSPIRING
    description: 'Raw blocky with high contrast',
    feeling: 'Bold, architectural, unapologetically geometric',
  },
  grid: {
    name: 'Grid', // 👍 USER LIKED THIS A BIT
    description: 'Swiss design with strict geometric precision',
    feeling: 'Mathematical perfection, minimal precision',
  },
  concrete: {
    name: 'Concrete', // ❌ USER DIDN'T LIKE - too muddy/dull
    description: 'Industrial modernism with soft tactile touches',
    feeling: 'Raw architecture meets neumorphic softness',
  },
  carved: {
    name: 'Carved', // 🤔 USER SAID OK, CLOSE TO POLAROID
    description: 'Precision-cut recessed panels with deep insets',
    feeling: 'CNC-milled stone, sharp precision',
  },
  embossed: {
    name: 'Embossed', // NEW - inspired by brutalist
    description: 'Raised stamped surfaces with hard shadows',
    feeling: 'Pressed metal, industrial strength',
  },
};
