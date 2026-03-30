

# Speed Up Image Loading

## Problem
Images are served as full-size originals (up to 1518px wide JPEG/PNG) regardless of screen size, and many pages use CSS `background-image` which can't benefit from `loading="lazy"` or responsive sizing. No image transformation is applied.

## Approach
Use the Supabase Storage **image transformation** feature, which lets you append query parameters to resize and convert images on the fly (e.g. `?width=800&quality=75`). This avoids re-uploading anything — same URLs, just with transform params.

## Changes

### 1. Create image URL helper (`src/lib/imageUrl.ts`)
A small utility function that appends Supabase image transform params:

```typescript
const STORAGE_BASE = "https://fgjdlgslkwfgfzidfpyz.supabase.co/storage/v1/object/public/cms-images/";
const RENDER_BASE = "https://fgjdlgslkwfgfzidfpyz.supabase.co/storage/v1/render/image/public/cms-images/";

export function imageUrl(filename: string, opts?: { width?: number; height?: number; quality?: number }) {
  if (!opts) return `${STORAGE_BASE}${filename}`;
  const params = new URLSearchParams();
  if (opts.width) params.set("width", String(opts.width));
  if (opts.height) params.set("height", String(opts.height));
  params.set("quality", String(opts.quality ?? 75));
  return `${RENDER_BASE}${filename}?${params}`;
}
```

### 2. Convert hero banner images from `background-image` to `<img>` tags
~10 pages use `style={{ backgroundImage: ... }}` for hero banners. These prevent lazy loading, responsive sizing, and format negotiation. Convert each to an `<img>` tag with `object-cover` (same visual result), adding `width`, `height`, `sizes`, and `decoding="async"`.

**Affected pages:** EventsPage, CommunityGardensPage, FarmsPage, SupportedGardeningPage, SurplusProjectsPage, WildlifeGardeningPage, ContactPage, CoursesPage, ResourcesPage, PlotsPage, EquipmentPage, GrowersNetworkPage.

Pattern (replacing `style={{ backgroundImage }}` sections):
```tsx
<section className="relative flex h-[40vh] md:h-[60vh] ...">
  <img
    src={imageUrl("IMG_3558-200x200.jpeg", { width: 1200, quality: 75 })}
    alt="..."
    className="absolute inset-0 w-full h-full object-cover"
    loading="eager"  // for above-fold heroes
    decoding="async"
  />
  <div className="absolute inset-0 bg-black/45" />
  ...
</section>
```

### 3. Add responsive `srcSet` to card/grid images
For the GrowingGroupsSection cards and data-driven listing pages (farms, community gardens, etc.), add a `srcSet` with multiple widths so browsers download appropriately sized images:

```tsx
<img
  src={imageUrl(filename, { width: 400, quality: 75 })}
  srcSet={`${imageUrl(filename, { width: 400, quality: 75 })} 400w, ${imageUrl(filename, { width: 800, quality: 75 })} 800w`}
  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
  loading="lazy"
  decoding="async"
/>
```

### 4. Update `index.html` preload
Update the hero image preload link to use the transformed (smaller) URL with `imagesizes` and `imagesrcset` attributes.

### 5. Update homepage components
Apply `imageUrl()` with appropriate widths to Hero.tsx, IntroSection.tsx, MappingSection.tsx, MissionAndValues.tsx, GrowingGroupsSection.tsx.

## Summary of files to change
- **New:** `src/lib/imageUrl.ts`
- **Edit:** `index.html`, `Hero.tsx`, `IntroSection.tsx`, `MappingSection.tsx`, `MissionAndValues.tsx`, `GrowingGroupsSection.tsx`, and ~12 page files to convert background-image heroes to `<img>` tags with transformed URLs

## What stays the same
- All visual layouts, colors, spacing, and UX remain identical
- Database-stored `image_url` values are unchanged — the helper is applied at render time
- No images need to be re-uploaded or deleted

