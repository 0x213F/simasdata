# 🎨 How to Switch Gallery Themes

## Quick Start (3 Simple Steps)

### Step 1: Open the Theme Config File
Open: `components/views/gallery-themes/theme-config.ts`

### Step 2: Change the Theme
Find this line (around line 34):
```typescript
export const CURRENT_THEME: GalleryTheme = 'boutique';
```

### Step 3: Replace with Your Desired Theme
Change `'boutique'` to any of these:

```typescript
export const CURRENT_THEME: GalleryTheme = 'minimalist';  // Ultra clean
export const CURRENT_THEME: GalleryTheme = 'framed';      // Museum gallery
export const CURRENT_THEME: GalleryTheme = 'neumorphic';  // Soft 3D
export const CURRENT_THEME: GalleryTheme = 'glass';       // Glassmorphism
export const CURRENT_THEME: GalleryTheme = 'brutalist';   // Bold & blocky
export const CURRENT_THEME: GalleryTheme = 'elegant';     // Luxury gold
export const CURRENT_THEME: GalleryTheme = 'shadow';      // Deep shadows
export const CURRENT_THEME: GalleryTheme = 'rounded';     // Organic circles
export const CURRENT_THEME: GalleryTheme = 'floating';    // Elevated cards
export const CURRENT_THEME: GalleryTheme = 'grid';        // Swiss precision
```

That's it! Save the file and the entire app will use the new theme.

---

## 📋 Theme Reference Guide

| Theme | Feeling | Key Features |
|-------|---------|--------------|
| **boutique** | Modern, clean, boutique luxury | Instagram-style, subtle shadows, adaptive |
| **minimalist** | Pure, zen-like tranquility | Barely-there borders, maximum whitespace |
| **framed** | Classic museum curation | Ornate borders, gold accents, gallery feel |
| **neumorphic** | Tactile, modern luxury | Soft 3D, same-color shadows, rounded |
| **glass** | Futuristic, ethereal | Backdrop blur, transparency, frosted |
| **brutalist** | Bold, architectural | Thick black borders, high contrast, raw |
| **elegant** | Understated luxury | Gold/silver accents, warm shadows, refined |
| **shadow** | Dramatic, dimensional | Multiple shadow layers, deep 3D effect |
| **rounded** | Soft, friendly, organic | Circular images, extreme rounding, warm |
| **floating** | Weightless, premium | Offset shadows, rotation, elevated |
| **grid** | Swiss design, precision | Strict alignment, 8px multiples, minimal |

---

## 🔍 Where to Find the File

### File Path:
```
components/views/gallery-themes/theme-config.ts
```

### Full Path from Project Root:
```
/Users/schultheiss/Developer/art-proj/simasdata/components/views/gallery-themes/theme-config.ts
```

### What to Look For:
Search for this exact text in the file:
```typescript
export const CURRENT_THEME: GalleryTheme =
```

---

## 🎯 Examples

### Example 1: Switch to Brutalist
```typescript
// Before:
export const CURRENT_THEME: GalleryTheme = 'boutique';

// After:
export const CURRENT_THEME: GalleryTheme = 'brutalist';
```

### Example 2: Switch to Glass
```typescript
// Before:
export const CURRENT_THEME: GalleryTheme = 'boutique';

// After:
export const CURRENT_THEME: GalleryTheme = 'glass';
```

### Example 3: Switch to Elegant
```typescript
// Before:
export const CURRENT_THEME: GalleryTheme = 'boutique';

// After:
export const CURRENT_THEME: GalleryTheme = 'elegant';
```

---

## ⚡ Pro Tips

1. **TypeScript will help you**: If you type an invalid theme name, TypeScript will show an error
2. **No restart needed**: Just save the file and refresh the browser
3. **Same theme everywhere**: Both Projects and Artists pages use the same theme
4. **Easy to revert**: Just change it back to the original theme name

---

## 📚 More Information

For detailed theme descriptions and architecture, see:
- `components/views/gallery-themes/README.md` - Full documentation
- `components/views/gallery-themes/THEME_GAMEPLAN.md` - Design philosophy
