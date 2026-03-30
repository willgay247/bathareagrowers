

# Plan: Host All Images Locally via Cloud Storage

## Overview
Download all images currently hosted on `bathareagrowers.org` and upload them to your project's cloud storage bucket. Then update every reference across the codebase and database to point to the new self-hosted URLs.

## Steps

### 1. Create a storage bucket
Create a public `images` storage bucket with an RLS policy allowing anonymous read access.

### 2. Download and upload all images
Write a backend function (edge function) or script that:
- Downloads each unique image from `bathareagrowers.org`
- Uploads it to the `images` bucket preserving the filename

There are approximately **20 unique images** referenced in hardcoded files:

| File | Image |
|------|-------|
| Hero, IntroSection, index.html | IMG_3572-1024x683.jpeg |
| MappingSection | IMG_3561-1024x691.jpeg |
| MissionAndValues | IMG_3570-1024x683.jpeg |
| GrowingGroupsSection | IMG_3631, IMG_3632, IMG_3657, IMG_3634, IMG_3690 |
| EventsPage | IMG_3636-e1717271139891.jpeg |
| CommunityGardensPage | cropped-IMG_3545-1-200x200.jpeg |
| FarmsPage | IMG_3632-e1715201712644.jpeg |
| SupportedGardeningPage | IMG_3558-200x200.jpeg |
| SurplusProjectsPage | IMG_3557-e1713291149232-200x200.jpeg |
| WildlifeGardeningPage | IMG_3679.webp |
| ContactPage | IMG_3559-e1713291506509-200x200.jpeg |
| CoursesPage/ResourcesPage | IMG_3690.jpeg |
| PlotsPage | 1-1-rotated.jpeg |
| EquipmentPage | IMG_3759.webp |
| GrowersNetworkPage | IMG_3573-e1713295309470-200x200.jpeg |
| events.ts | 2_20240729_214914_0001.png |
| locations.ts | IMG_3660, IMG_3652, IMG_3668 |

### 3. Update all hardcoded references
Replace every `https://bathareagrowers.org/wp-content/uploads/...` URL in the following files with the new storage URL (`https://fgjdlgslkwfgfzidfpyz.supabase.co/storage/v1/object/public/images/...`):

- `index.html` (preload, og:image, twitter:image)
- `src/components/Hero.tsx`
- `src/components/IntroSection.tsx`
- `src/components/MappingSection.tsx`
- `src/components/MissionAndValues.tsx`
- `src/components/GrowingGroupsSection.tsx`
- `src/data/events.ts`
- `src/data/locations.ts`
- `src/pages/EventsPage.tsx`
- `src/pages/CommunityGardensPage.tsx`
- `src/pages/FarmsPage.tsx`
- `src/pages/SupportedGardeningPage.tsx`
- `src/pages/SurplusProjectsPage.tsx`
- `src/pages/WildlifeGardeningPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/CoursesPage.tsx`
- `src/pages/ResourcesPage.tsx`
- `src/pages/PlotsPage.tsx`
- `src/pages/EquipmentPage.tsx`
- `src/pages/GrowersNetworkPage.tsx`

### 4. Update database records
Any `image_url` values in the `community_gardens`, `farms`, `supported_gardening`, `wildlife_gardening_entries`, and `surplus_projects` tables that point to `bathareagrowers.org` will need to be updated via a migration to the new storage URLs.

### 5. Remove the preconnect hint
Remove the `<link rel="preconnect" href="https://bathareagrowers.org" />` from `index.html` since it's no longer needed.

## Technical Detail
- The storage bucket URL pattern will be: `https://fgjdlgslkwfgfzidfpyz.supabase.co/storage/v1/object/public/images/{filename}`
- A helper constant (e.g. `IMAGE_BASE`) can be created in a shared file to avoid repeating the full URL everywhere
- This also improves performance scores since you'll control caching headers (the current external images have 0 cache TTL)

