

# Mobile Polish — All Pages

The viewport is 390px. Here are all the issues found and fixes needed across every page:

## Issues Found

1. **Hero h1 (global base style)**: `h1 { font-size: 3.5rem }` (56px) is too large on mobile — overflows on pages with long titles like "Community Gardens and Allotments", "Plots and Land Available", "Grants and National Organisations"
2. **h2 base style**: `h2 { font-size: 2.5rem }` (40px) is also oversized on mobile — "Sites across the Bath area", "Volunteering timetable" etc. wrap awkwardly
3. **h3 base style**: 1.75rem is fine but some pages override with `text-[32px]` or `text-[36px]` which is too big on mobile
4. **CalendarPage table**: 7-column table with `min-w-[700px]` — scrollable but the hero section has no background image and looks bare. The table itself is fine (horizontal scroll is the correct approach)
5. **GrowersNetworkPage**: Hero uses a tiny 200x200 image as background — will look pixelated on any screen
6. **EquipmentPage**: `text-[18px]` list items and `text-[32px]` headings are slightly large on mobile but acceptable
7. **PlotsPage**: Same heading size issue — `text-[32px]` headings don't scale down
8. **GrantsPage**: `text-[40px] md:text-[48px]` hero title "Grants and National Organisations" is very long and may overflow at 390px even at 40px
9. **EventDetailPage**: The side panel (`md:w-[30%]`) stacks correctly, no issues
10. **Footer newsletter form**: `max-w-[420px]` flex row is fine at 390px
11. **GrowingGroupsSection**: 5-column grid collapses to 1-col on mobile — fine, but card images at `h-[160px]` could be taller on mobile for visual impact
12. **OurWorkSection**: Grid `md:grid-cols-4` collapses to 1-col — the label and text stack fine
13. **Navbar mobile menu**: Looks functional, gap-3 spacing is adequate

## Plan

### 1. Add responsive heading sizes in `src/index.css`
Scale down h1, h2, h3 for mobile:
- h1: `2rem` on mobile, `3.5rem` on `md:`
- h2: `1.75rem` on mobile, `2.5rem` on `md:`
- h3: `1.375rem` on mobile, `1.75rem` on `md:`

### 2. Fix per-page hardcoded font sizes
Many pages use `text-[40px] md:text-[48px]` for hero titles — change to `text-[28px] md:text-[48px]` or `text-[32px] md:text-[48px]` across all page hero h1 elements. Similarly, section headings using `text-[36px]` or `text-[32px]` should get mobile-responsive equivalents like `text-[24px] md:text-[32px]`.

**Files to update** (hero h1 sizes): `CommunityGardensPage`, `SupportedGardeningPage`, `FarmsPage`, `WildlifeGardeningPage`, `SurplusProjectsPage`, `CoursesPage`, `EventsPage`, `ContactPage`, `EquipmentPage`, `PlotsPage`, `GrantsPage`, `GrowersNetworkPage`, `ResourcesPage`, `CalendarPage`

**Files to update** (section h2 sizes): `CommunityGardensPage` (region headings, sites heading), `EventsPage` ("Upcoming Events"), `EquipmentPage`, `PlotsPage`, `GrantsPage`

### 3. Fix hero section heights on mobile
Change `h-[60vh]` to `h-[40vh] md:h-[60vh]` on hero banners — 60vh is excessive on short mobile screens, leaving little room for content below.

### 4. Reduce section padding on mobile
Many sections use `py-[60px]` or `py-20` (80px). Add mobile-friendly padding: `py-10 md:py-[60px]` or `py-10 md:py-20` to give content more room on small screens.

### 5. Fix CalendarPage table header text
The h2 "Volunteering timetable, Summer 2023" at `text-[28px]` is fine, no change needed.

### 6. Fix GrowingGroupsSection card images
Add `loading="lazy"` to all card images (currently missing).

### 7. Fix MappingSection and IntroSection images
Add `loading="lazy"` to the images in these split-layout sections.

### 8. Ensure EventTagPage and LocationDetailPage have proper mobile sizing
Same hero h1 pattern — apply consistent responsive text sizes.

---

**Summary**: ~18 files touched, primarily changing hardcoded pixel font sizes to responsive pairs and reducing vertical padding/hero heights on mobile. No layout restructuring needed — the existing grid/flex patterns all collapse to single-column correctly.

