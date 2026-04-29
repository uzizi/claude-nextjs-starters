# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **Web GIS Starter Kit** built with:
- **Next.js 16.2.4** (App Router)
- **React 19.2.4**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (CSS Variables approach)
- **OpenLayers 10.9.0** (web mapping library)
- **shadcn/ui** (radix-nova style, Tabler icons)

The project provides a modern foundation for building interactive web GIS applications with features like layer management, coordinate display, and zoom controls.

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint (v9 flat config)
```

No test suite is currently configured.

## Project Structure

```
app/                              # App Router routes
├── globals.css                   # Tailwind v4 + CSS imports
├── layout.tsx                    # RootLayout (fonts + TooltipProvider)
├── page.tsx                      # Home page with feature cards
└── map/
    └── page.tsx                  # Map page (/map route)

components/
├── map/                          # Map-specific components
│   ├── OpenLayersMap.tsx        # Core OL map component (use client)
│   ├── MapLayout.tsx            # Map page layout & state composition
│   ├── MapToolbar.tsx           # Floating zoom/home/fullscreen buttons
│   ├── LayerPanel.tsx           # Sidebar layer visibility panel
│   └── CoordinateDisplay.tsx    # Bottom status bar (coordinates + zoom)
└── ui/                          # shadcn/ui components
    └── (button, card, label, separator, switch, tooltip, etc.)

hooks/
└── use-map-store.ts             # Custom hook for map state (no external store)

lib/
├── map-utils.ts                 # OpenLayers utilities (projections, GeoJSON)
└── utils.ts                     # cn() utility (clsx + tailwind-merge)

types/
└── map.ts                       # Centralized domain types (LayerConfig, CoordinateState, etc.)

public/
└── data/                        # Static GeoJSON files
```

**Note:** No `src/` directory. Path alias `@/*` refers to project root.

## Critical Patterns

### OpenLayers Integration

1. **Dynamic Import with SSR Disabled**
   - OpenLayers cannot be server-rendered. Use `next/dynamic` with `ssr: false`:
   ```tsx
   const OpenLayersMap = dynamic(() => import('./OpenLayersMap'), { ssr: false });
   ```

2. **Coordinate Systems**
   - **Input:** EPSG:4326 (WGS84 longitude/latitude) — the geographic standard
   - **Internal:** EPSG:3857 (Web Mercator) — used by OpenLayers and tile services
   - **Conversion:** Use `lonLatToMercator()` from `lib/map-utils.ts` when initializing or updating map center
   
3. **Layer Architecture**
   - Base layer: `TileLayer` with OpenStreetMap tiles
   - Feature layer: `VectorLayer` with GeoJSON source
   - Each layer is assigned a `layerId` via `set('layerId', id)` for visibility toggling

4. **Event Handling**
   - `pointermove` → coordinate callback
   - `change:resolution` → zoom level callback
   - `mouseleave` → clear coordinates
   - All listeners added/removed in `useEffect` cleanup

### State Management

- **No external store** (Zustand, Redux, etc.)
- **Pattern:** Custom hook + props drilling
- `use-map-store.ts` provides: `layerVisibility`, `coordinate`, `currentZoom`
- State lives in `MapLayout` (parent), passed down to children via props

### Styling

- **Tailwind v4**: No `tailwind.config.js` — design tokens defined in `globals.css` via `@theme inline {}`
- **CSS Variables**: Uses oklch() color space for light/dark theme support
- **No CSS Modules**: All styles applied as inline Tailwind utility classes
- **shadcn/ui**: Components use CVA (class-variance-authority) for variant management
- **OpenLayers CSS**: Imported in `globals.css` to style map elements

### TypeScript

- `strict: true` enabled
- Domain types centralized in `types/map.ts`
- Component props typed inline with `interface Props`
- External library types (e.g., `ol/Map`) directly imported
- No global type definitions needed (Next.js 16 provides them)

## Important Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Must include `transpilePackages: ["ol"]` for ESM bundling |
| `app/globals.css` | CSS entry point; imports Tailwind, shadcn, OL, and tw-animate-css |
| `components/map/OpenLayersMap.tsx` | Core map rendering; contains all OL setup |
| `hooks/use-map-store.ts` | Centralized map state (visibility, coordinates, zoom) |
| `lib/map-utils.ts` | OL utilities: `lonLatToMercator()`, `createGeoJsonLayer()` |
| `types/map.ts` | `LayerConfig`, `CoordinateState`, `MapProps` interfaces |
| `AGENTS.md` | AI agent guidelines — read `node_modules/next/dist/docs/` before coding Next.js features |

## Before Writing Code

### Next.js-Specific Changes
Before implementing Next.js features (routing, layouts, middleware, etc.), consult:
- `node_modules/next/dist/docs/` (official Next.js 16 docs embedded in node_modules)
- APIs, conventions, and file structure may differ from training data
- Check `AGENTS.md` for additional guidance

### Adding New Map Functionality
1. Keep OpenLayers setup in dedicated components under `components/map/`
2. Use `use-map-store.ts` for shared state, or extend the hook if needed
3. Coordinate transformations: always convert EPSG:4326 → EPSG:3857 for OL
4. Style with Tailwind — avoid inline styles
5. Export types from `types/map.ts` for type safety

### Adding New UI Components
- Use shadcn/ui CLI: `npx shadcn-ui@latest add <component>`
- Radix-nova style will be applied automatically
- Components stored in `components/ui/`
- Use Tabler icons via `@tabler/icons-react`

## Configuration Notes

- **Tailwind v4**: Uses PostCSS integration (`@tailwindcss/postcss`), not the legacy Webpack plugin
- **ESLint v9**: Flat config format in `eslint.config.mjs`
- **TypeScript**: Strict mode with `noEmit: true`
- **Fonts**: Geist Sans and Geist Mono via `next/font/google`

## Dependencies

**Key runtime packages:**
- `ol` (10.9.0) — OpenLayers
- `@radix-ui/*` (1.4.3+) — Headless UI primitives
- `shadcn` (4.4.0) — Component library
- `tailwindcss` (v4) — CSS utility framework
- `@tabler/icons-react` (3.41.1) — Icon set

**Key dev tools:**
- `typescript` (v5)
- `eslint` (v9)
- `postcss` with Tailwind v4 plugin
