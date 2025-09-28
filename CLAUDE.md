# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SIMASDATA is a luxury art space website built with Next.js 15, featuring an international collective of artists, curators, and cultural strategists. The application serves as a digital gallery and blog platform with admin capabilities for content management.

## Architecture

### Frontend Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming
- **State Management**: Zustand for client-side state
- **UI Components**: Custom React components with Three.js/React Three Fiber integration
- **Font**: Custom Poppl Laudatio font loaded locally

### Backend & Data
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage for blog post images
- **Real-time**: Supabase real-time subscriptions

### Database Schema
The app uses four main tables:
- `BlogPost`: Main content with dual-pane layout (text/images for each pane)
- `Artist`: Individual artist profiles (legacy, being migrated to ArtSummary)
- `Project`: Project information (legacy, being migrated to ArtSummary)
- `ArtSummary`: Unified table for both artists and projects with type field

## Development Commands

```bash
# Development
npm run dev --turbopack  # Start dev server with Turbopack (recommended)
npm run dev             # Start dev server without Turbopack

# Production builds
npm run build           # Create production build
npm run start          # Start production server
npm run export         # Static export build (same as build for this config)

# Type checking
npx tsc --noEmit        # Type check without emitting files

# Development notes
# - Default port: http://localhost:3000
# - Turbopack is enabled by default for faster development
# - No linting/testing commands configured
```

## Application Structure

### Core Components
- `app/page.tsx`: Main entry point with splash video overlay and route management
- `components/MainWebsite.tsx`: Route switcher for home/projects/artists views
- `components/Header.tsx` & `components/Footer.tsx`: Fixed navigation elements
- `lib/store.ts`: Zustand stores for all data management
- `lib/supabase.ts`: Database client and API functions

### Routing Structure
- `/` - Main app with client-side navigation between views
- `/projects` - Static projects page (new App Router implementation)
- `/projects/[slug]` - Individual project detail pages
- `/artists` - Static artists page (new App Router implementation)
- `/artists/[slug]` - Individual artist detail pages
- `/admin-portal` - Admin interface for content management

### View Architecture
Three main views accessible via navigation:
1. **HomeView**: Blog/content management with dual-pane book-like layout
2. **ProjectsView**: Grid display of projects with detail modals
3. **ArtistsView**: Grid display of artists with detail modals

**Note**: The app currently uses both client-side navigation (in MainWebsite.tsx) and Next.js App Router pages. The static pages provide direct URLs while the main app provides the interactive experience.

### State Management Pattern
Each data type has its own Zustand store with consistent patterns:
- Loading states and error handling
- CRUD operations that update local state optimistically
- Automatic data fetching with deduplication
- Legacy compatibility layers for migration

### Theme System
- CSS variables defined in `globals.css` for light/dark themes using custom color tokens
- Theme configuration in `lib/theme-config.ts` controls theme behavior:
  - `FORCE_THEME`: 'light' | 'dark' | null (null allows user choice)
  - `SHOW_THEME_TOGGLE`: boolean (shows/hides toggle in header)
  - `DEFAULT_THEME`: 'light' | 'dark' | 'system'
- Currently locked to light mode (`FORCE_THEME: 'light'`, `SHOW_THEME_TOGGLE: false`)
- Tailwind configured with custom color variables and `darkMode: 'selector'`
- ThemeProvider context ready for theme switching when enabled

## Key Features

### Content Management
- **Blog Posts**: Dual-pane layout with text and images per pane
- **Admin Portal**: Located at `/admin-portal` for content management
- **Image Upload**: Direct to Supabase storage with 5MB limit
- **Real-time Updates**: Changes reflect immediately via Zustand state

### Navigation & UX
- **Splash Screen**: Auto-playing video with timed fade transition
- **Mobile Landscape**: Special handling to hide header/footer for immersive view
- **Navigation Cooldown**: 200ms cooldown on rapid navigation to prevent issues
- **Floating Action Buttons**: Admin controls for CRUD operations

### Data Migration
The app is transitioning from separate Artist/Project tables to a unified ArtSummary table:
- Legacy stores (`useArtistStore`, `useProjectStore`) still functional
- New unified store (`useArtSummaryStore`) with backward compatibility
- Type field distinguishes between 'artist' and 'project' entries

## Environment Setup

Required environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development Notes

### Mobile Responsiveness
- Responsive breakpoints handled via Tailwind classes
- Special mobile landscape mode for immersive viewing
- Touch-friendly floating action buttons

### Performance Optimizations
- Image preloading for blog posts in background
- Lazy loading for navigation between posts
- Zustand state persistence and deduplication
- Next.js 15 optimizations with Turbopack in dev

### Authentication
- Supabase Auth integration via `useAuthStore`
- Admin features protected by authentication state
- Automatic session management with real-time updates

### Type Safety
- Full TypeScript implementation
- Strict mode enabled
- Interface definitions in `lib/supabase.ts`
- Path aliases configured for clean imports (`@/`)

### File Organization
- Components organized by feature in `components/views/`
- Shared utilities in `components/shared/`
- All business logic centralized in stores
- Clean separation of UI and data layers

## Configuration Files

### Next.js Configuration (`next.config.ts`)
- Images set to `unoptimized: true` for compatibility
- TypeScript configuration for strict mode
- Path aliases: `@/*` maps to project root

### Tailwind Configuration (`tailwind.config.ts`)
- Dark mode configured with `'selector'` strategy (Tailwind v4)
- Custom color system using CSS variables for theming
- Theme-aware color tokens: surface, text, border, accent variants

### Theme Control (`lib/theme-config.ts`)
Single source of truth for theme behavior - modify this file to:
- Enable/disable theme toggle
- Force specific theme mode
- Set default theme preference

Reference `THEME_CONTROL.md` for detailed theme configuration options.