# Gallery Theme Game Plan
## 10 Distinct, Elegant & Sui Generis Themes

### 1. **Minimalist** - "The Void"
**Feeling:** Pure, breathable, zen-like tranquility
- Ultra-clean white cards with barely-there borders
- Maximum whitespace between items
- No shadows, just subtle borders (1px #f0f0f0)
- Square corners or very subtle radius (2px)
- Monochromatic focus

### 2. **Framed** - "The Gallery Wall"
**Feeling:** Classic museum, timeless curation
- Thick ornate borders (8-12px) simulating picture frames
- Double border effect (inner + outer)
- Subtle matting effect with padding
- Gold/bronze accent colors for borders
- Sharp corners for authenticity

### 3. **Neumorphic** - "The Soft Touch"
**Feeling:** Tactile, modern, approachable luxury
- Soft 3D effect with same-color shadows (light + dark)
- Subtle raised/inset appearance
- Smooth rounded corners (16-20px)
- Background blends with card color
- Gentle transitions on hover

### 4. **Glass** - "The Crystal Palace"
**Feeling:** Futuristic, ethereal, transparent elegance
- Glassmorphism with backdrop-filter blur
- Semi-transparent backgrounds (rgba)
- Subtle border glow
- Frosted glass effect
- Medium radius (12px)

### 5. **Brutalist** - "The Statement"
**Feeling:** Bold, architectural, unapologetically geometric
- Thick black borders (4-6px)
- Sharp corners (0px radius)
- High contrast blacks and whites
- Offset box shadows for depth
- Raw, unpolished aesthetic

### 6. **Elegant** - "The Refined"
**Feeling:** Understated luxury, subtle sophistication
- Thin gold/silver borders (1-2px)
- Soft shadows with warm tones
- Gentle rounded corners (8px)
- Cream/ivory backgrounds
- Delicate hover animations

### 7. **Shadow** - "The Depth"
**Feeling:** Dramatic, layered, dimensional
- Multiple layered shadows (3-4 levels)
- Deep 3D block effect
- Cards appear to float above surface
- Strong hover lift effect
- Medium corners (10px)

### 8. **Rounded** - "The Organic"
**Feeling:** Soft, friendly, naturally flowing
- Circular or pill-shaped cards
- Extreme border radius (50% or 32px)
- Gentle curves throughout
- Warm, inviting shadows
- Fluid transitions

### 9. **Floating** - "The Levitation"
**Feeling:** Weightless, elevated, premium
- Offset shadows creating elevation
- Cards hover with perspective
- Asymmetric shadow placement
- Subtle rotation on hover (1-2deg)
- Smooth corners (14px)

### 10. **Grid** - "The Precision"
**Feeling:** Swiss design, mathematical perfection
- Strict geometric alignment
- Precise gap measurements (multiples of 8px)
- Thin, precise borders
- Perfect squares/rectangles
- Minimal radius (4px)

## Implementation Strategy

Each theme will have:
1. **Unique layout calculator** - Adapts 1-6+ items differently
2. **Custom card component** - Specific styling per theme
3. **Theme-specific decorative elements** - Balancing UI
4. **Shared interface** - Easy swapping via config

## Theme Switcher Location

The theme will be set in:
- `components/views/gallery-themes/theme-config.ts`
- Simple string constant: `CURRENT_THEME = 'boutique'`
- Views import and use the configured theme
