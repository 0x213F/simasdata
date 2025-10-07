# Gallery Themes

This directory contains 11 distinct, professional gallery themes for displaying artists and projects. Each theme is sui generis - truly one-of-a-kind in its design approach.

## 🎨 How to Switch Themes

**Simply edit one file:** `components/views/gallery-themes/theme-config.ts`

Change the `CURRENT_THEME` value:

```typescript
// Change this value to switch themes
export const CURRENT_THEME: GalleryTheme = 'boutique'; // ← Change this!
```

Available options: `'boutique'`, `'minimalist'`, `'framed'`, `'neumorphic'`, `'glass'`, `'brutalist'`, `'elegant'`, `'shadow'`, `'rounded'`, `'floating'`, `'grid'`

## 🖼️ All Available Themes

### 1. Boutique (Default)
**Feeling:** Modern, clean, boutique luxury
**Style:** Instagram-inspired minimal cards, subtle shadows, adaptive layouts
**Best for:** 1-6+ items, fits in one page on desktop

### 2. Minimalist
**Feeling:** Pure, breathable, zen-like tranquility
**Style:** Ultra-clean with barely-there borders (1px), maximum whitespace, no shadows
**Best for:** Those who want "less is more"

### 3. Framed
**Feeling:** Classic museum, timeless curation
**Style:** Thick ornate borders (8-12px), double frame effect, gold/bronze accents
**Best for:** Traditional gallery aesthetic, art collections

### 4. Neumorphic
**Feeling:** Tactile, modern, approachable luxury
**Style:** Soft 3D with same-color shadows, raised/inset appearance, smooth rounded corners
**Best for:** Modern, touchable UI feel

### 5. Glass
**Feeling:** Futuristic, ethereal, transparent elegance
**Style:** Glassmorphism with backdrop-filter blur, semi-transparent, frosted effects
**Best for:** Contemporary, futuristic presentations

### 6. Brutalist
**Feeling:** Bold, architectural, unapologetically geometric
**Style:** Thick black borders (4-6px), sharp corners, high contrast, offset box shadows
**Best for:** Making a strong statement, architectural themes

### 7. Elegant
**Feeling:** Understated luxury, subtle sophistication
**Style:** Thin gold/silver borders, warm shadows, cream backgrounds, delicate animations
**Best for:** High-end luxury brands, refined presentations

### 8. Shadow
**Feeling:** Dramatic, layered, dimensional
**Style:** Multiple layered shadows (3-4 levels), deep 3D block effect, strong hover lift
**Best for:** Creating depth and drama

### 9. Rounded
**Feeling:** Soft, friendly, naturally flowing
**Style:** Circular images, extreme border radius (32px), organic shapes, warm colors
**Best for:** Approachable, friendly brand identities

### 10. Floating
**Feeling:** Weightless, elevated, premium
**Style:** Offset shadows with perspective, cards hover with slight rotation on hover
**Best for:** Premium, elevated brand experiences

### 11. Grid
**Feeling:** Swiss design, mathematical perfection
**Style:** Strict geometric alignment, precise gaps (8px multiples), minimal borders
**Best for:** Precision, minimalist design systems

## 🏗️ Architecture

### Theme Configuration System

```
gallery-themes/
├── theme-config.ts          ← Configure active theme here
├── get-gallery-component.tsx ← Theme switcher logic
├── index.ts                  ← Central exports
├── boutique/                 ← Theme folders
├── minimalist/
├── framed/
└── ... (11 themes total)
```

### How It Works

1. **Set theme** in `theme-config.ts` by changing `CURRENT_THEME`
2. **Views import** `getGalleryComponent()` from `gallery-themes`
3. **Switcher returns** the correct gallery component
4. **Views render** the themed gallery with their data

### Adding New Themes

To add a 12th theme:

1. **Create theme folder** (e.g., `./masonry/`)
2. **Build components:**
   - `MasonryGallery.tsx` - Main component
   - `MasonryCard.tsx` - Card component
   - `index.ts` - Exports
3. **Register in theme-config.ts:**
   ```ts
   export type GalleryTheme = ... | 'masonry';
   ```
4. **Add to switcher** in `get-gallery-component.tsx`:
   ```ts
   case 'masonry':
     return MasonryGallery;
   ```

### Theme Interface

All themes must accept:

```tsx
interface GalleryProps {
  items: ArtSummary[];
  type: 'artist' | 'project';
  onItemClick?: (id: string) => void;
  selectedItemId?: string | null;
  loading?: boolean;
  hasHydrated?: boolean;
}
```

## 🎯 Design Philosophy

- **Sui Generis**: Each theme is truly unique, one-of-a-kind
- **Modularity**: Self-contained, swappable modules
- **Consistency**: Same interface across all themes
- **Adaptability**: All themes handle 1-6+ items gracefully
- **Professional**: Production-ready, polished designs
